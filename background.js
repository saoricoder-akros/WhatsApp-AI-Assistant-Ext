// Background Service Worker - WhatsApp AI Assistant & Teams Automation (Manifest V3)
console.log(`[${new Date().toISOString()}] Background Service Worker (Dynamic Injection & Query) iniciado.`);

const DEFAULT_CONFIG = {
  autoSupportEnabled: true,
  waGroupName: "Soporte en Sitio Akros",
  teamsGroupName: "Atención de Soporte",
  teamsDefaultUrl: "https://teams.cloud.microsoft/"
};

// Habilitar apertura de Side Panel al hacer clic en el icono de la extensión
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
}

// Inicialización de storage
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
  }
  chrome.storage.local.get(['autoSupportEnabled', 'waGroupName', 'teamsGroupName'], (result) => {
    const updates = {};
    if (typeof result.autoSupportEnabled === 'undefined') updates.autoSupportEnabled = DEFAULT_CONFIG.autoSupportEnabled;
    if (!result.waGroupName) updates.waGroupName = DEFAULT_CONFIG.waGroupName;
    if (!result.teamsGroupName) updates.teamsGroupName = DEFAULT_CONFIG.teamsGroupName;
    
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
});

// Listener Principal de Mensajes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`[Background] Mensaje recibido [${request.type || request.action}]:`, request);

  if (request.type === "TICKET_DETECTED" || request.action === "ticketDetected") {
    const ticketCode = request.code || request.ticketData?.ticketCode || 'TICKET';
    const text = request.text || request.ticketData?.description || '';
    const senderName = request.sender || request.ticketData?.senderName || 'Usuario WhatsApp';

    const ticketData = {
      ticketCode: ticketCode,
      description: text,
      senderName: senderName,
      timestamp: new Date().toISOString()
    };

    processTicketUnidirectional(ticketData);
    sendResponse({ success: true, status: "Ticket registrado y procesado hacia Teams" });
    return true;
  }
});

// Lógica de búsqueda de pestaña Teams con reintento e inyección dinámica mediante chrome.scripting
async function processTicketUnidirectional(ticketData) {
  const config = await chrome.storage.local.get(['autoSupportEnabled', 'waGroupName', 'teamsGroupName', 'activityLogs']);
  const autoEnabled = typeof config.autoSupportEnabled !== 'undefined' ? config.autoSupportEnabled : true;

  if (!autoEnabled) {
    console.log('[Background] Ticket detectado pero la automatización está desactivada.');
    return;
  }

  const logs = config.activityLogs || [];
  const timestamp = new Date().toISOString();

  // 1. REGISTRAR EVENTO: WhatsApp Capturado
  logs.unshift({
    id: Date.now(),
    type: 'whatsapp_captured',
    timestamp: timestamp,
    ticketCode: ticketData.ticketCode,
    senderName: ticketData.senderName,
    text: ticketData.description
  });

  notifyUser(
    `📥 Ticket Capturado: ${ticketData.ticketCode}`,
    `Remitente: ${ticketData.senderName}\nDetalle: ${ticketData.description.slice(0, 70)}...`
  );

  const targetChannelName = config.teamsGroupName || DEFAULT_CONFIG.teamsGroupName;

  const formattedMessage = `🚨 *SOLICITUD DE SOPORTE DE TICKET*\n` +
    `• *Código de Ticket:* ${ticketData.ticketCode}\n` +
    `• *Solicitante (WhatsApp):* ${ticketData.senderName}\n` +
    `• *Detalle:* ${ticketData.description}\n\n` +
    `👉 *Atención:* Notificación de soporte generada automáticamente.`;

  // 2. REGISTRAR EVENTO: Teams Enviado
  logs.unshift({
    id: Date.now() + 1,
    type: 'teams_sent',
    timestamp: new Date().toISOString(),
    ticketCode: ticketData.ticketCode,
    targetChannel: targetChannelName,
    text: `Solicitud para ticket ${ticketData.ticketCode} enviada a Teams.`
  });

  await chrome.storage.local.set({
    activityLogs: logs.slice(0, 50),
    ticketLogs: logs.slice(0, 50)
  });

  const payload = {
    type: "SEND_TO_TEAMS",
    action: "sendTeamsSupportRequest",
    text: formattedMessage,
    formattedText: formattedMessage,
    ticketData: ticketData,
    targetChannel: targetChannelName
  };

  // 3. BUSCAR PESTAÑA ABIERTA DE TEAMS USANDO PATRONES MULTIPLES DE URL
  const teamsTabs = await chrome.tabs.query({
    url: [
      "*://teams.microsoft.com/*",
      "*://*.teams.microsoft.com/*",
      "*://teams.cloud.microsoft/*",
      "*://*.teams.cloud.microsoft/*",
      "*://teams.live.com/*"
    ]
  });

  const teamsTab = teamsTabs[0];

  if (teamsTab) {
    console.log('[Background] 📤 Pestaña de Teams hallada (ID:', teamsTab.id, '). Enviando mensaje...');

    // Función de envío con reintento e inyección dinámica mediante chrome.scripting
    const sendToTeamsTab = (tabId, payloadData) => {
      chrome.tabs.sendMessage(tabId, payloadData, async (response) => {
        if (chrome.runtime.lastError) {
          console.warn('[Background] Error de conexión con Teams content.js. Ejecutando inyección dinámica:', chrome.runtime.lastError.message);
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['content.js']
            });
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, payloadData, (retryRes) => {
                if (chrome.runtime.lastError) {
                  console.error('[Background] Reintento fallido tras inyección:', chrome.runtime.lastError.message);
                } else {
                  console.log('[Background] Inyección dinámica exitosa en Teams:', retryRes);
                }
              });
            }, 500);
          } catch (injectErr) {
            console.error('[Background] Error al inyectar content.js en Teams:', injectErr);
          }
        } else {
          console.log('[Background] Teams content.js confirmó recepción:', response);
        }
      });
    };

    sendToTeamsTab(teamsTab.id, payload);

  } else {
    console.log('[Background] Pestaña de Teams no encontrada. Abriendo teams.cloud.microsoft...');
    const newTab = await chrome.tabs.create({ url: DEFAULT_CONFIG.teamsDefaultUrl, active: false });
    
    const listener = (tabId, changeInfo) => {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        setTimeout(async () => {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              files: ['content.js']
            });
          } catch (e) {}

          setTimeout(() => {
            chrome.tabs.sendMessage(newTab.id, payload);
          }, 500);
        }, 3500);
        chrome.tabs.onUpdated.removeListener(listener);
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  }
}

function notifyUser(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: title,
      message: message,
      priority: 2
    });
  } catch (err) {
    console.warn('[Background] Error al notificar:', err);
  }
}
