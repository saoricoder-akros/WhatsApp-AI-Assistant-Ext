// Content Script - WhatsApp Web & Microsoft Teams Automation (Manifest V3)
console.log(`[${new Date().toISOString()}] Content Script (Robusto Teams Lexical) cargado en: ${window.location.hostname}`);

// ============================================================================
// CONFIGURACIÓN DE GRUPOS Y PATRONES
// ============================================================================

const CONFIG_WHATSAPP = {
  TARGET_GROUP_NAME: "Soporte en Sitio Akros", 
  TICKET_REGEX: /(?:tk|ticket|tkt|caso|incidencia|soporte|tk\s*-?)\s*[:#\-]?\s*([A-Z0-9-]+)/i
};

const CONFIG_TEAMS = {
  TARGET_CHANNEL_NAME: "Atención de Soporte"
};

const sessionStartTime = Date.now();
let isInitialScanFinished = false;

const isWhatsApp = window.location.hostname.includes('web.whatsapp.com');
const isTeams = window.location.hostname.includes('teams.microsoft.com') ||
                window.location.hostname.includes('teams.cloud.microsoft') ||
                window.location.hostname.includes('teams.live.com');

if (isWhatsApp) {
  console.log("%c[WhatsApp Auto-Support] Escuchador activo en WhatsApp Web", "color: #25D366; font-weight: bold;");
  initWhatsAppModule();
} else if (isTeams) {
  console.log("%c[Teams Auto-Support] Módulo de inyección activo en Microsoft Teams (teams.cloud.microsoft)", "color: #464EB8; font-weight: bold; font-size: 13px;");
  initTeamsModule();
}


// ============================================================================
// MÓDULO 1: WHATSAPP WEB
// ============================================================================

function initWhatsAppModule() {
  setTimeout(() => {
    isInitialScanFinished = true;
    console.log('[WhatsApp Listener] 🕒 Carga inicial de historial ignorada. Listo para capturar únicamente MENSAJES NUEVOS.');
  }, 2500);

  const observer = new MutationObserver((mutations) => {
    chrome.storage.local.get(['autoSupportEnabled', 'waGroupName'], (result) => {
      const autoEnabled = typeof result.autoSupportEnabled !== 'undefined' ? result.autoSupportEnabled : true;
      if (!autoEnabled) return;

      const targetGroup = result.waGroupName || CONFIG_WHATSAPP.TARGET_GROUP_NAME;
      const activeChatHeaderName = getActiveWhatsAppChatName();
      
      if (targetGroup && targetGroup.trim() !== "") {
        if (activeChatHeaderName && !activeChatHeaderName.toLowerCase().includes(targetGroup.toLowerCase().trim())) {
          return;
        }
      }

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            scanUniversalWhatsAppNode(node);
          }
        }
      }
    });
  });

  const targetElement = document.querySelector('#main') || document.querySelector('#app') || document.body;
  observer.observe(targetElement, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMessages") {
      const targetGroup = request.targetGroup || CONFIG_WHATSAPP.TARGET_GROUP_NAME;
      ensureTargetChatOpened(targetGroup);
      const limit = request.count || 1000;
      
      setTimeout(() => {
        const res = getMessages(limit);
        sendResponse({ 
          messages: res.messages, 
          structuredMessages: res.structuredMessages,
          activeChat: getActiveWhatsAppChatName()
        });
      }, 300);
      return true;
    }

    if (request.action === "sendToChat") {
      sendMessageToChat(request.message).then(success => {
        sendResponse({ success: success });
      });
      return true;
    }
  });
}

function ensureTargetChatOpened(targetGroup = "Soporte en Sitio Akros") {
  const currentChat = getActiveWhatsAppChatName();
  if (currentChat && currentChat.toLowerCase().includes(targetGroup.toLowerCase().trim())) {
    return true;
  }

  // Buscar en el panel lateral de chats de WhatsApp Web
  const chatListItems = document.querySelectorAll('#pane-side [role="gridcell"], #pane-side div[role="listitem"], [data-testid="chat-list"] div[role="listitem"]');
  for (const item of chatListItems) {
    const titleEl = item.querySelector('span[title], div[title]');
    if (titleEl) {
      const title = titleEl.getAttribute('title') || titleEl.textContent || '';
      if (title.toLowerCase().includes(targetGroup.toLowerCase().trim()) || title.toLowerCase().includes("soporte en sitio")) {
        titleEl.click();
        return true;
      }
    }
  }
  return false;
}

function getActiveWhatsAppChatName() {
  const mainHeader = document.querySelector('#main header');
  if (!mainHeader) return '';

  const headerTitleSelectors = [
    '[data-testid="conversation-info-header"]',
    '[data-testid="chat-title"]',
    'span[title]',
    'div[role="button"] span[title]',
    'div[title]',
    'span._ao3e',
    'h2'
  ];

  for (const selector of headerTitleSelectors) {
    const el = mainHeader.querySelector(selector);
    if (el && el.getAttribute('title')) {
      return el.getAttribute('title').trim();
    }
    if (el && el.textContent && el.textContent.trim().length > 0) {
      return el.textContent.trim();
    }
  }

  return mainHeader.textContent.trim();
}

function scanUniversalWhatsAppNode(node) {
  // 0. FILTRO DE FECHA/SESIÓN: Ignorar historial previo renderizado antes de que termine el escaneo inicial (Date.now() > sessionStartTime)
  if (!isInitialScanFinished) {
    return;
  }

  // Ignorar nodos pertenecientes a la interfaz general (header, lista de chats, iconos o botones)
  if (node.closest && (
    node.closest('header') ||
    node.closest('[data-testid="chat-list"]') ||
    node.closest('[data-icon]') ||
    node.closest('button') ||
    node.closest('[role="button"]')
  )) {
    return;
  }

  // Selectores estrictos de texto de mensajes en WhatsApp Web
  const messageSelectors = [
    'span.selectable-text',
    '.copyable-text',
    '[data-testid="msg-text"]',
    'span._ao3e'
  ];

  let textElements = [];

  // 1. Si el propio nodo coincide con un selector de mensaje
  if (node.matches && messageSelectors.some(sel => node.matches(sel))) {
    textElements.push(node);
  }
  // 2. Si el nodo contiene elementos de mensaje
  if (node.querySelectorAll) {
    const found = node.querySelectorAll(messageSelectors.join(','));
    if (found.length > 0) {
      textElements.push(...Array.from(found));
    }
  }

  // 3. Filtrar para asegurar que los elementos pertenezcan EXCLUSIVAMENTE a burbujas de mensajes ENTRANTES (.message-in)
  textElements = textElements.filter(el => {
    if (el.closest('[data-icon]') || el.closest('button') || el.closest('header')) return false;

    // EXCLUIR EXPLICITAMENTE MENSAJES SALIENTES (enviados por el usuario)
    if (el.closest('.message-out')) return false;

    // CONCENTRARSE EXCLUSIVAMENTE EN MENSAJES ENTRANTES
    const isIncoming = el.closest('.message-in');
    const row = el.closest('[data-testid^="msg-"], [role="row"]');
    if (row && (row.classList.contains('message-out') || row.querySelector('.message-out'))) return false;

    return !!(isIncoming || row);
  });

  textElements.forEach(el => {
    const text = el.textContent ? el.textContent.trim() : '';

    // Ignorar textos cortos o identificadores visuales de iconos (ej: ic-close, ic-notifications-off)
    if (!text || text.length < 3) return;
    if (text.startsWith('ic-') || text.includes('notifications-off') || text.includes('selectable-text')) return;

    // Disparar la Regex únicamente sobre el texto válido del mensaje
    const match = text.match(CONFIG_WHATSAPP.TICKET_REGEX);
    if (match && match[1]) {
      const ticketCode = match[1].toUpperCase();
      const ticketKey = `${ticketCode}_${text.slice(0, 30)}`;

      // 1. Verificación en memoria
      if (processedTickets.has(ticketCode) || processedTickets.has(ticketKey)) return;

      // 2. Verificación asíncrona en chrome.storage.local para control anti-duplicados estricto
      chrome.storage.local.get(['activityLogs', 'processedTicketsStore'], (storageRes) => {
        const store = storageRes.processedTicketsStore || [];
        const logs = storageRes.activityLogs || [];

        const alreadyInStore = store.includes(ticketCode) || store.includes(ticketKey);
        const alreadyInLogs = logs.some(l => l.ticketCode === ticketCode);

        if (alreadyInStore || alreadyInLogs) {
          processedTickets.add(ticketCode);
          processedTickets.add(ticketKey);
          return;
        }

        // Marcar como procesado en memoria y en almacenamiento local
        processedTickets.add(ticketCode);
        processedTickets.add(ticketKey);
        store.push(ticketCode, ticketKey);
        chrome.storage.local.set({ processedTicketsStore: store.slice(-100) });

        let senderName = 'Usuario WhatsApp';
        const rowContainer = el.closest('[role="row"], [data-testid^="msg-"], .message-in') || el.parentElement;
        if (rowContainer) {
          const prePlainTextEl = rowContainer.querySelector('[data-pre-plain-text]');
          if (prePlainTextEl) {
            const preText = prePlainTextEl.getAttribute('data-pre-plain-text') || '';
            const nameMatch = preText.match(/] ([^:]+): /);
            if (nameMatch && nameMatch[1]) senderName = nameMatch[1].trim();
          }
        }

        console.log(
          '%c[WhatsApp Listener] ¡TICKET ENTRANTE DETECTADO! Code: %s | Solicitante: "%s"',
          'color: #00ff00; font-weight: bold; font-size: 13px; background: #111; padding: 4px 8px; border-radius: 4px;',
          ticketCode,
          senderName
        );

        chrome.runtime.sendMessage({
          type: "TICKET_DETECTED",
          action: "ticketDetected",
          code: ticketCode,
          text: text,
          sender: senderName,
          ticketData: {
            ticketCode: ticketCode,
            description: text,
            senderName: senderName,
            timestamp: new Date().toISOString()
          }
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.warn('[WhatsApp Listener] Advertencia al notificar background.js:', chrome.runtime.lastError.message);
          } else {
            console.log('[WhatsApp Listener] Background confirmó procesamiento:', response);
          }
        });
      });
    }
  });
}

function getMessages(limit = 1000) {
  let messages = [];
  const mainContainer = document.querySelector('#main') || document;
  
  // Selectores de filas y burbujas de conversación en WhatsApp Web
  const rows = mainContainer.querySelectorAll('[role="row"], [data-testid^="msg-"], .message-in, .message-out');
  
  rows.forEach(row => {
    const textEl = row.querySelector('span.selectable-text, .copyable-text, [data-testid="msg-text"], span._ao3e');
    if (!textEl) return;

    const text = textEl.textContent ? textEl.textContent.trim() : '';
    if (!text || text.length < 2) return;

    let senderName = 'Desconocido';
    const prePlainTextEl = row.querySelector('[data-pre-plain-text]');
    if (prePlainTextEl) {
      const prePlainText = prePlainTextEl.getAttribute('data-pre-plain-text') || '';
      const match = prePlainText.match(/] ([^:]+): /);
      if (match && match[1]) senderName = match[1].trim();
    } else {
      const authorEl = row.querySelector('[data-testid="author"], span._am37, div._ao3e span[title]');
      if (authorEl && authorEl.textContent) {
        senderName = authorEl.textContent.trim();
      }
    }

    messages.push(`${senderName}: ${text}`);
  });

  // Fallback si no hay filas estructurales
  if (messages.length === 0) {
    const textElements = mainContainer.querySelectorAll('span.selectable-text, .copyable-text');
    textElements.forEach(el => {
      const text = el.textContent ? el.textContent.trim() : '';
      if (!text) return;

      let senderName = 'Desconocido';
      const rowContainer = el.closest('[role="row"], [data-testid^="msg-"]') || el.parentElement;
      if (rowContainer) {
        const prePlainTextEl = rowContainer.querySelector('[data-pre-plain-text]');
        if (prePlainTextEl) {
          const prePlainText = prePlainTextEl.getAttribute('data-pre-plain-text') || '';
          const match = prePlainText.match(/] ([^:]+): /);
          if (match && match[1]) senderName = match[1].trim();
        }
      }
      messages.push(`${senderName}: ${text}`);
    });
  }

  const uniqueMessages = [...new Set(messages)];
  return uniqueMessages.slice(-limit);
}

async function sendMessageToChat(message) {
  const inputSelectors = [
    '[contenteditable="true"][data-tab="10"]',
    '[data-testid="conversation-compose-box-input"]',
    'footer div[role="textbox"][contenteditable="true"]',
    '#main footer div[role="textbox"]'
  ];

  let inputField = null;
  for (const selector of inputSelectors) {
    inputField = document.querySelector(selector);
    if (inputField) break;
  }

  if (!inputField) return false;

  inputField.focus();
  inputField.textContent = message;
  inputField.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, data: message }));
  inputField.dispatchEvent(new Event('change', { bubbles: true }));

  await new Promise(resolve => setTimeout(resolve, 500));

  const sendBtn = document.querySelector('button[data-testid="send"], span[data-icon="send"] button, button[aria-label="Send"]');
  if (sendBtn) {
    sendBtn.click();
    return true;
  } else {
    inputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    return true;
  }
}


// ============================================================================
// MÓDULO 2: MICROSOFT TEAMS (Inyección Directa por DOM Sin Atajos de Loop)
// ============================================================================

function initTeamsModule() {
  console.log('[Teams Content] Listener de mensajes activo en Microsoft Teams.');

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Teams Content] Mensaje recibido de background.js:', request);

    if (request.type === "SEND_TO_TEAMS" || request.action === "sendTeamsSupportRequest") {
      const textToPublish = request.text || request.formattedText || (
        request.ticketData ? `🚨 *SOLICITUD DE SOPORTE DE TICKET*\n• *Ticket:* ${request.ticketData.ticketCode}\n• *Solicitante:* ${request.ticketData.senderName}\n• *Detalle:* ${request.ticketData.description}` : ''
      );

      console.log('%c[Teams Content] 📥 Iniciando inyección limpia en el editor de Teams...', 'color: #464EB8; font-weight: bold;');

      postSupportRequestToTeams(textToPublish, request.ticketData).then(success => {
        sendResponse({ success: success, status: "Inyección ejecutada en Teams" });
      });
      return true;
    }
  });
}

// Inyección por Evento de Portapapeles (ClipboardEvent paste & DataTransfer) en Microsoft Teams
async function postSupportRequestToTeams(messageText, ticketData) {
  try {
    const formattedMessage = messageText || (
      ticketData && ticketData.ticketCode 
        ? `🚨 *SOLICITUD DE SOPORTE DE TICKET*\n• *Ticket:* ${ticketData.ticketCode}\n• *Solicitante:* ${ticketData.senderName || 'WhatsApp'}\n• *Detalle:* ${ticketData.description}`
        : ''
    );

    if (!formattedMessage || formattedMessage.trim() === '') {
      console.error('[Teams Content] ❌ El mensaje a enviar está vacío.');
      return false;
    }

    console.log('[Teams Content] Buscando editor de texto principal del chat...');

    // 1. Localización del Editor Principal de Texto (excluyendo modales y componentes de Loop)
    const mainEditor = document.querySelector('div[contenteditable="true"][aria-label*="Escriba un mensaje"]') ||
                       document.querySelector('div[contenteditable="true"][aria-label*="Type a message"]');

    let teamsEditor = mainEditor;

    if (!teamsEditor) {
      const editors = Array.from(document.querySelectorAll('div[contenteditable="true"]'));
      for (const ed of editors) {
        const isLoopOrModal = ed.closest('div[class*="loop"]') ||
                              ed.closest('div[class*="component"]') ||
                              ed.closest('div[class*="card"]') ||
                              ed.closest('[data-tid*="loop"]') ||
                              ed.closest('[role="dialog"]') ||
                              ed.closest('iframe');
        
        if (!isLoopOrModal) {
          const ariaLabel = (ed.getAttribute('aria-label') || '').toLowerCase();
          if (ariaLabel.includes('escriba') || ariaLabel.includes('mensaje') || ariaLabel.includes('message') || ed.getAttribute('role') === 'textbox') {
            teamsEditor = ed;
            break;
          }
          if (!teamsEditor) teamsEditor = ed;
        }
      }
    }

    if (!teamsEditor) {
      console.error('[Teams Content] ❌ No se encontró el editor de texto principal de Teams.');
      return false;
    }

    console.log('[Teams Content] Editor de texto principal de Teams localizado:', teamsEditor);

    // 2. LIMPIEZA TOTAL Y FOCO EN EL EDITOR DE TEAMS
    teamsEditor.focus();
    teamsEditor.innerHTML = '';
    teamsEditor.textContent = '';
    teamsEditor.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    // 3. INYECCIÓN LIMPIA DEL NUEVO TICKET VÍA PORTAPAPELES
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', formattedMessage);

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true
    });

    teamsEditor.dispatchEvent(pasteEvent);

    // Respaldo de asignación en caso de que el evento paste requiera actualización directa de propiedades
    if (!teamsEditor.textContent || teamsEditor.textContent.trim() === '') {
      teamsEditor.textContent = formattedMessage;
    }

    // Disparar eventos de actualización requeridos por React / Lexical
    teamsEditor.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    teamsEditor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: formattedMessage }));
    teamsEditor.dispatchEvent(new Event('change', { bubbles: true }));

    console.log('[Teams Content] Texto del ticket inyectado y editor preparado.');

    // 4. ALERTA SONORA NATIVA Y FLUJO CONTROLADO DE ENVÍO MANUAL
    playAlertBeep();

    console.log(
      '%c[Teams Content] 🔔 TICKET PREPARADO Y PEGLADO EN TEAMS. Alerta sonora emitida. Esperando confirmación y envío manual del usuario.',
      'color: #0080ff; font-weight: bold; font-size: 13px; background: #eef2ff; padding: 4px 8px; border-radius: 4px;'
    );

    return true;

  } catch (error) {
    console.error('[Teams Content] Excepción en postSupportRequestToTeams:', error);
    return false;
  }
}

// Función para emitir una alerta sonora nativa mediante la Web Audio API
function playAlertBeep() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 (880Hz)
    osc.frequency.exponentialRampToValueAtTime(1174.66, audioCtx.currentTime + 0.15); // D6 (1174.66Hz)

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
    console.log('[Teams Content] 🔔 Alerta sonora nativa (Web Audio API) emitida.');
  } catch (e) {
    console.warn('[Teams Content] Error al generar alerta sonora:', e);
  }
}