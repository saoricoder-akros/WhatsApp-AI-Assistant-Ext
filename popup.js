// Popup Script - UI Controller & Persistencia de Preferencias (Manifest V3)
// Este script SOLO gestiona la interfaz visual del popup y la sincronización con chrome.storage.local.
// La lógica de automatización corre de forma 100% independiente en background.js.

console.log("WhatsApp AI Assistant Extension - Popup UI Controller cargado");

document.addEventListener('DOMContentLoaded', function () {
  // Elementos de la interfaz (Acciones, Automatización, Configuración)
  const fetchMessagesBtn = document.getElementById('fetchMessages');
  const summarizeBtn = document.getElementById('summarizeMessages');
  const generateReplyBtn = document.getElementById('generateReply');
  const sendToChatBtn = document.getElementById('sendToChat');
  const fetchedMessagesDiv = document.getElementById('fetchedMessages');
  const generatedOutputDiv = document.getElementById('generatedOutput');
  const messageCountInput = document.getElementById('messageCount');
  const summarizeCountInput = document.getElementById('summarizeCount');

  const aiProviderSelect = document.getElementById('aiProvider');
  const geminiApiKeyInput = document.getElementById('geminiApiKey');
  const groqApiKeyInput = document.getElementById('groqApiKey');
  const aiEnabledSwitch = document.getElementById('aiEnabledSwitch');
  const saveSettingsBtn = document.getElementById('saveSettings');

  const tabs = document.querySelectorAll('.tab');
  const actionsTab = document.getElementById('actionsTab');
  const settingsTab = document.getElementById('settingsTab');
  const automationTab = document.getElementById('automationTab');
  const analyticsTab = document.getElementById('analyticsTab');

  const runAnalyticsBtn = document.getElementById('runAnalyticsBtn');
  const resetTimestampBtn = document.getElementById('resetTimestampBtn');
  const loadMockAnalyticsBtn = document.getElementById('loadMockAnalyticsBtn');
  const analyticsRegionFilter = document.getElementById('analyticsRegionFilter');
  const analyticsSearchInput = document.getElementById('analyticsSearchInput');
  const analyticsViewSelect = document.getElementById('analyticsViewSelect');
  const lastTimestampInfo = document.getElementById('lastTimestampInfo');
  const kpiTotalCount = document.getElementById('kpiTotalCount');
  const kpiAgenciesCount = document.getElementById('kpiAgenciesCount');
  const kpiBottlenecksCount = document.getElementById('kpiBottlenecksCount');
  const kpiTopTech = document.getElementById('kpiTopTech');
  const analyticsReportContainer = document.getElementById('analyticsReportContainer');

  const autoSupportSwitch = document.getElementById('autoSupportSwitch');
  const autoStatusBadge = document.getElementById('autoStatusBadge');
  const ticketLogsDiv = document.getElementById('ticketLogsDiv');
  const waGroupInput = document.getElementById('waGroupInput');
  const teamsGroupInput = document.getElementById('teamsGroupInput');
  const saveGroupsBtn = document.getElementById('saveGroupsBtn');

  const contextInfoDiv = document.getElementById('contextInfo');
  const analysisInfoDiv = document.getElementById('analysisInfo');
  const tldrSelectedBtn = document.getElementById('tldrSelected');
  const findActionItemsBtn = document.getElementById('findActionItems');

  // Variables de Estado de la Interfaz
  let fetchedMessages = [];
  let selectedMessageIndices = new Set();
  let generatedText = '';
  let aiProvider = 'gemini';
  let geminiApiKey = '';
  let groqApiKey = '';
  let aiEnabled = true;
  let autoSupportEnabled = true;

  // --- Funciones de Utilidad e Interfaz ---
  function getActiveApiKey() {
    return aiProvider === 'groq' ? groqApiKey : geminiApiKey;
  }

  function getProviderName() {
    return aiProvider === 'groq' ? 'Groq' : 'Gemini';
  }

  function displayInfoMessage(element, message) {
    if (element) element.innerHTML = `<p><em>${message}</em></p>`;
  }

  function displayErrorMessage(element, prefix, error) {
    console.error(prefix, error);
    if (generatedOutputDiv) {
      generatedOutputDiv.innerHTML += `<p style="color: #c0392b;"><strong>Error (${prefix}):</strong> ${error.message || error}</p>`;
    }
  }

  function updateAutomationBadge() {
    if (autoStatusBadge) {
      if (autoSupportEnabled) {
        autoStatusBadge.textContent = 'ACTIVO';
        autoStatusBadge.className = 'status-badge badge-on';
      } else {
        autoStatusBadge.textContent = 'DESACTIVADO';
        autoStatusBadge.className = 'status-badge badge-off';
      }
    }
  }

  function renderTicketLogs() {
    if (!ticketLogsDiv) return;
    chrome.storage.local.get(['activityLogs', 'ticketLogs'], (res) => {
      const logs = res.activityLogs || res.ticketLogs || [];
      if (logs.length === 0) {
        ticketLogsDiv.innerHTML = '<em>No se han registrado eventos a&uacute;n.</em>';
        return;
      }
      let html = '<div style="display:flex; flex-direction:column; gap:6px;">';
      logs.forEach(log => {
        const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '';
        if (log.type === 'whatsapp_captured') {
          html += `
            <div style="background:#e8f5e9; border:1px solid #c8e6c9; border-radius:4px; padding:6px 8px; font-size:11px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-weight:bold; color:#1b5e20;">📥 Capturado de WhatsApp</span>
                <span style="color:#555; font-size:10px;">${time}</span>
              </div>
              <div style="color:#2e7d32; font-weight:bold;">Ticket: ${log.ticketCode || 'N/A'} (De: ${log.senderName || 'Usuario'})</div>
              <div style="color:#333; margin-top:2px; font-style:italic;">"${log.text ? log.text.replace(/</g, '&lt;').slice(0, 100) : ''}"</div>
            </div>
          `;
        } else if (log.type === 'teams_sent') {
          html += `
            <div style="background:#e8eaf6; border:1px solid #c5cae9; border-radius:4px; padding:6px 8px; font-size:11px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-weight:bold; color:#1a237e;">📤 Enviado a MS Teams</span>
                <span style="color:#555; font-size:10px;">${time}</span>
              </div>
              <div style="color:#283593; font-weight:bold;">Ticket: ${log.ticketCode || 'N/A'} &rarr; ${log.targetChannel || 'Teams'}</div>
              <div style="color:#333; margin-top:2px;">Solicitud enviada e inyectada con &eacute;xito en Teams.</div>
            </div>
          `;
        } else {
          html += `
            <div style="background:#fff3e0; border:1px solid #ffe0b2; border-radius:4px; padding:6px 8px; font-size:11px;">
              <div style="font-weight:bold; color:#e65100;">[${time}] Ticket ${log.ticketCode || ''}</div>
              <div style="color:#333;">${log.replyText || log.text || ''}</div>
            </div>
          `;
        }
      });
      html += '</div>';
      ticketLogsDiv.innerHTML = html;
    });
  }

  function updateButtonStates() {
    const activeApiKey = getActiveApiKey();
    const hasApiKey = activeApiKey && activeApiKey.trim() !== '';
    const hasFetched = fetchedMessages.length > 0;
    const hasSelection = selectedMessageIndices.size > 0;
    const hasGeneratedOutput = generatedText.trim() !== '';

    if (!aiEnabled) {
      if (summarizeBtn) summarizeBtn.disabled = true;
      if (findActionItemsBtn) findActionItemsBtn.disabled = true;
      if (generateReplyBtn) generateReplyBtn.disabled = true;
      if (tldrSelectedBtn) tldrSelectedBtn.disabled = true;
    } else {
      if (summarizeBtn) summarizeBtn.disabled = !hasApiKey || !hasFetched;
      if (findActionItemsBtn) findActionItemsBtn.disabled = !hasApiKey || !hasFetched;
      if (generateReplyBtn) generateReplyBtn.disabled = !hasApiKey || !hasSelection;
      if (tldrSelectedBtn) tldrSelectedBtn.disabled = !hasApiKey || !hasSelection;
    }

    if (sendToChatBtn) {
      if (hasGeneratedOutput) {
        sendToChatBtn.classList.remove('hidden');
        sendToChatBtn.disabled = false;
      } else {
        sendToChatBtn.classList.add('hidden');
      }
    }

    const warningElement = document.getElementById('api-key-warning');
    if (warningElement) warningElement.remove();

    if (!aiEnabled && analysisInfoDiv) {
      analysisInfoDiv.innerHTML = `
        <p id="api-key-warning" style="color: #c0392b; font-weight: bold;">
        <strong>Atenci&oacute;n:</strong> El motor de Inteligencia Artificial se encuentra desactivado. Act&iacute;valo en la pesta&ntilde;a Configuraci&oacute;n.
        </p>
      `;
    } else if ((hasFetched || hasSelection) && !hasApiKey && analysisInfoDiv) {
      analysisInfoDiv.innerHTML = `
        <p id="api-key-warning" style="color: #c0392b;">
        <strong>Nota:</strong> Las acciones requieren la clave de API de ${getProviderName()} en la pesta&ntilde;a Configuraci&oacute;n.
        </p>
      `;
    }
  }

  // --- Carga Inicial de Preferencias desde chrome.storage.local ---
  chrome.storage.local.get([
    'geminiApiKey', 
    'groqApiKey', 
    'aiProvider', 
    'aiEnabled', 
    'autoSupportEnabled', 
    'waGroupName', 
    'teamsGroupName'
  ], function (result) {
    if (result.aiProvider) {
      aiProvider = result.aiProvider;
      if (aiProviderSelect) aiProviderSelect.value = aiProvider;
    }
    if (result.geminiApiKey) {
      geminiApiKey = result.geminiApiKey;
      if (geminiApiKeyInput) geminiApiKeyInput.value = geminiApiKey;
    }
    if (result.groqApiKey) {
      groqApiKey = result.groqApiKey;
      if (groqApiKeyInput) groqApiKeyInput.value = groqApiKey;
    }
    if (typeof result.aiEnabled !== 'undefined') {
      aiEnabled = result.aiEnabled;
      if (aiEnabledSwitch) aiEnabledSwitch.checked = aiEnabled;
    }
    if (typeof result.autoSupportEnabled !== 'undefined') {
      autoSupportEnabled = result.autoSupportEnabled;
      if (autoSupportSwitch) autoSupportSwitch.checked = autoSupportEnabled;
    }
    if (result.waGroupName && waGroupInput) {
      waGroupInput.value = result.waGroupName;
    }
    if (result.teamsGroupName && teamsGroupInput) {
      teamsGroupInput.value = result.teamsGroupName;
    }

    updateButtonStates();
    updateAutomationBadge();
    renderTicketLogs();
  });

  // --- Listeners de Eventos de la Interfaz ---
  if (aiEnabledSwitch) {
    aiEnabledSwitch.addEventListener('change', () => {
      aiEnabled = aiEnabledSwitch.checked;
      chrome.storage.local.set({ aiEnabled: aiEnabled });
      updateButtonStates();
    });
  }

  const clearLogsBtn = document.getElementById('clearLogsBtn');

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      chrome.storage.local.set({ activityLogs: [], ticketLogs: [] }, () => {
        renderTicketLogs();
      });
    });
  }

  // Escuchar cambios de almacenamiento en tiempo real si el popup está abierto
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && (changes.activityLogs || changes.ticketLogs)) {
      renderTicketLogs();
    }
  });

  if (autoSupportSwitch) {
    autoSupportSwitch.addEventListener('change', () => {
      autoSupportEnabled = autoSupportSwitch.checked;
      chrome.storage.local.set({ autoSupportEnabled: autoSupportEnabled });
      updateAutomationBadge();
    });
  }

  if (saveGroupsBtn) {
    saveGroupsBtn.addEventListener('click', () => {
      const waVal = waGroupInput ? waGroupInput.value.trim() : 'Soporte Técnico';
      const teamsVal = teamsGroupInput ? teamsGroupInput.value.trim() : 'Atención de Soporte';

      chrome.storage.local.set({
        waGroupName: waVal,
        teamsGroupName: teamsVal
      }, () => {
        alert('\u00a1Configuraci\u00f3n de grupos guardada con \u00e9xito!');
      });
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function () {
      const selectedProvider = aiProviderSelect.value;
      const geminiVal = geminiApiKeyInput.value.trim();
      const groqVal = groqApiKeyInput.value.trim();

      chrome.storage.local.set({
        aiProvider: selectedProvider,
        geminiApiKey: geminiVal,
        groqApiKey: groqVal
      }, function () {
        aiProvider = selectedProvider;
        geminiApiKey = geminiVal;
        groqApiKey = groqVal;
        alert('\u00a1Configuraci\u00f3n guardada con \u00e9xito!');
        updateButtonStates();
      });
    });
  }

  if (aiProviderSelect) {
    aiProviderSelect.addEventListener('change', () => {
      aiProvider = aiProviderSelect.value;
      updateButtonStates();
    });
  }

  // Navegación entre pestañas de la interfaz
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');

      if (actionsTab) actionsTab.classList.add('hidden');
      if (automationTab) automationTab.classList.add('hidden');
      if (analyticsTab) analyticsTab.classList.add('hidden');
      if (settingsTab) settingsTab.classList.add('hidden');

      if (tabName === 'actions' && actionsTab) {
        actionsTab.classList.remove('hidden');
      } else if (tabName === 'automation' && automationTab) {
        automationTab.classList.remove('hidden');
        renderTicketLogs();
      } else if (tabName === 'analytics' && analyticsTab) {
        analyticsTab.classList.remove('hidden');
      } else if (tabName === 'settings' && settingsTab) {
        settingsTab.classList.remove('hidden');
      }
    });
  });

  // --- Módulo de Visor Analítico Interno ---
  let currentRawMessages = [];
  let storedLastProcessedTimestamp = null;

  // Cargar timestamp guardado previamente
  chrome.storage.local.get(['lastProcessedTimestamp'], (res) => {
    if (res.lastProcessedTimestamp) {
      storedLastProcessedTimestamp = res.lastProcessedTimestamp;
      if (lastTimestampInfo) {
        lastTimestampInfo.textContent = `Sincronización: ${new Date(storedLastProcessedTimestamp).toLocaleTimeString()}`;
      }
    }
  });

  function renderAnalyticsReport(messagesList, ignoreTimestamp = false) {
    if (!window.WhatsAppAnalyticsEngine) {
      if (analyticsReportContainer) {
        analyticsReportContainer.innerHTML = '<p style="color:#c62828; font-size:11px;">Error: Módulo WhatsAppAnalyticsEngine no cargado.</p>';
      }
      return;
    }

    currentRawMessages = messagesList || [];
    const engine = new window.WhatsAppAnalyticsEngine();

    const timestampToUse = ignoreTimestamp ? null : storedLastProcessedTimestamp;
    const extractRes = engine.extractDataFromMessages(currentRawMessages, timestampToUse);
    let extracted = extractRes.extractedData;

    // Actualizar marca de tiempo local y en storage
    if (extractRes.latestTimestamp) {
      storedLastProcessedTimestamp = extractRes.latestTimestamp;
      chrome.storage.local.set({ lastProcessedTimestamp: storedLastProcessedTimestamp });
      if (lastTimestampInfo) {
        lastTimestampInfo.textContent = `Sincronización: ${new Date(storedLastProcessedTimestamp).toLocaleTimeString()}`;
      }
    }

    const selectedRegion = analyticsRegionFilter ? analyticsRegionFilter.value : 'TODAS';
    const searchTerm = analyticsSearchInput ? analyticsSearchInput.value.toLowerCase().trim() : '';
    const viewType = analyticsViewSelect ? analyticsViewSelect.value : 'consolidated';

    // Filtrar por término de búsqueda (técnico, agencia o región)
    if (searchTerm) {
      extracted = extracted.filter(item => 
        item.agency.toLowerCase().includes(searchTerm) ||
        item.chatMention.toLowerCase().includes(searchTerm) ||
        item.technician.toLowerCase().includes(searchTerm) ||
        item.region.toLowerCase().includes(searchTerm)
      );
    }

    const reportData = engine.generateStrategicReport(extracted, selectedRegion);

    const metrics = reportData.summaryMetrics;
    if (kpiTotalCount) kpiTotalCount.textContent = metrics.totalExtractedCount;
    if (kpiAgenciesCount) kpiAgenciesCount.textContent = metrics.affectedAgenciesCount;
    if (kpiBottlenecksCount) kpiBottlenecksCount.textContent = metrics.bottlenecksCount;
    if (kpiTopTech) kpiTopTech.textContent = metrics.topNationalTech !== 'N/A' ? `${metrics.topNationalTech} (${metrics.topNationalSupports})` : 'N/A';

    if (!reportData.reportRows || reportData.reportRows.length === 0) {
      if (analyticsReportContainer) {
        analyticsReportContainer.innerHTML = '<em style="font-size: 11px; color: #666; padding: 8px; display: block;">No hay datos o incidencias nuevas para los filtros aplicados.</em>';
      }
      return;
    }

    let html = '';

    if (viewType === 'agencyVsChat') {
      html = `
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Agencia Oficial</th>
              <th>Mencion en Chat</th>
              <th>Tecnico Asignado</th>
              <th>Confirmacion</th>
            </tr>
          </thead>
          <tbody>
      `;

      reportData.reportRows.forEach(row => {
        const confirmedBadge = row.confirmedByOutgoingCount > 0 ? `<span class="badge-confirmed">Confirmado</span>` : '';
        html += `
          <tr>
            <td><strong>${row.agencyName}</strong></td>
            <td>${row.chatMentionName || row.agencyName}</td>
            <td>${row.frequentTech}</td>
            <td style="text-align: center;">${confirmedBadge || '-'}</td>
          </tr>
        `;
      });

      html += '</tbody></table>';
    } else {
      html = `
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Region / Agencia</th>
              <th>Tecnico Frecuente</th>
              <th>Soportes</th>
              <th>Estado Recurrencia</th>
            </tr>
          </thead>
          <tbody>
      `;

      reportData.reportRows.forEach(row => {
        const regionBadge = row.regionName ? `<span style="font-size:9px; color:#666; display:block;">${row.regionName}</span>` : '';
        const confirmedBadge = row.confirmedByOutgoingCount > 0 ? `<span class="badge-confirmed">Confirmado</span>` : '';
        html += `
          <tr>
            <td><strong>${row.agencyName}</strong>${regionBadge}</td>
            <td>${row.frequentTech}${confirmedBadge}</td>
            <td style="text-align: center; font-weight: bold;">${row.totalSupports}</td>
            <td><span class="status-badge ${row.statusBadgeClass}">${row.bottleneckLevel}</span></td>
          </tr>
        `;
      });

      html += '</tbody></table>';
    }

    if (analyticsReportContainer) {
      analyticsReportContainer.innerHTML = html;
    }
  }

  // Escuchadores de eventos para la barra de filtros interactiva
  if (analyticsRegionFilter) {
    analyticsRegionFilter.addEventListener('change', () => {
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (analyticsViewSelect) {
    analyticsViewSelect.addEventListener('change', () => {
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (analyticsSearchInput) {
    analyticsSearchInput.addEventListener('input', () => {
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (loadMockAnalyticsBtn) {
    loadMockAnalyticsBtn.addEventListener('click', () => {
      if (!window.WhatsAppAnalyticsEngine) return;
      const engine = new window.WhatsAppAnalyticsEngine();
      const mockData = engine.getMockData();
      renderAnalyticsReport(mockData, true);
    });
  }

  if (resetTimestampBtn) {
    resetTimestampBtn.addEventListener('click', () => {
      storedLastProcessedTimestamp = null;
      chrome.storage.local.remove(['lastProcessedTimestamp'], () => {
        if (lastTimestampInfo) {
          lastTimestampInfo.textContent = 'Sincronización: Reiniciada (Completa)';
        }
        renderAnalyticsReport(currentRawMessages, true);
      });
    });
  }

  if (runAnalyticsBtn) {
    runAnalyticsBtn.addEventListener('click', async () => {
      runAnalyticsBtn.textContent = 'Barrimiento Akros...';
      runAnalyticsBtn.disabled = true;

      chrome.storage.local.get(['activityLogs', 'ticketLogs', 'waGroupName'], async (res) => {
        const storedLogs = res.activityLogs || res.ticketLogs || [];
        const targetGroup = res.waGroupName || "Soporte en Sitio Akros";
        
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
            chrome.tabs.sendMessage(tab.id, { action: "getMessages", targetGroup: targetGroup, count: 1000 }, (response) => {
              let messagesToProcess = [];
              if (response && response.structuredMessages && response.structuredMessages.length > 0) {
                messagesToProcess = [...response.structuredMessages, ...storedLogs];
              } else if (response && response.messages && response.messages.length > 0) {
                messagesToProcess = [...response.messages, ...storedLogs];
              } else {
                messagesToProcess = storedLogs;
              }

              if (response && response.activeChat && lastTimestampInfo) {
                lastTimestampInfo.textContent = `Grupo: ${response.activeChat} | Sinc: ${new Date().toLocaleTimeString()}`;
              }

              renderAnalyticsReport(messagesToProcess);
              runAnalyticsBtn.textContent = 'Procesar Nuevos Mensajes';
              runAnalyticsBtn.disabled = false;
            });
          } else {
            renderAnalyticsReport(storedLogs);
            runAnalyticsBtn.textContent = 'Procesar Nuevos Mensajes';
            runAnalyticsBtn.disabled = false;
          }
        } catch (e) {
          renderAnalyticsReport(storedLogs);
          runAnalyticsBtn.textContent = 'Procesar Nuevos Mensajes';
          runAnalyticsBtn.disabled = false;
        }
      });
    });
  }

  // --- Funciones Manuales de IA (Pestaña Acciones) ---
  if (fetchMessagesBtn) {
    fetchMessagesBtn.addEventListener('click', async () => {
      fetchMessagesBtn.textContent = 'Obteniendo...';
      fetchMessagesBtn.disabled = true;
      fetchedMessages = [];
      selectedMessageIndices.clear();
      generatedText = '';
      displayInfoMessage(fetchedMessagesDiv, 'Obteniendo mensajes del chat...');

      let messageCount = parseInt(messageCountInput.value) || 10;
      messageCount = Math.max(1, Math.min(messageCount, 100));

      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url || !tab.url.includes('web.whatsapp.com')) {
          displayInfoMessage(fetchedMessagesDiv, '<p style="color: #d35400;"><strong>Por favor abre WhatsApp Web para usar esta extensi&oacute;n.</strong></p>');
          fetchMessagesBtn.disabled = false;
          fetchMessagesBtn.textContent = 'Obtener Mensajes';
          updateButtonStates();
          return;
        }

        const handleResponse = (response) => {
          if (response && response.messages && response.messages.length > 0) {
            fetchedMessages = response.messages;
            const messagesToShow = fetchedMessages.slice(-messageCount);

            let messageListHtml = '<ul style="margin:0; padding:0; list-style:none;">';
            messagesToShow.forEach((msg, index) => {
              const originalIndex = fetchedMessages.length - messageCount + index;
              const displayMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
              messageListHtml += `
                <li>
                  <input type="checkbox" id="msg-${originalIndex}" data-index="${originalIndex}">
                  <label for="msg-${originalIndex}">${displayMsg}</label>
                </li>
              `;
            });
            messageListHtml += '</ul>';

            fetchedMessagesDiv.innerHTML = `<p style="margin-bottom: 5px;"><strong>Mostrando ${messagesToShow.length} mensajes recientes:</strong></p>${messageListHtml}`;

            fetchedMessagesDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
              checkbox.addEventListener('change', (event) => {
                const idx = parseInt(event.target.getAttribute('data-index'));
                if (event.target.checked) selectedMessageIndices.add(idx);
                else selectedMessageIndices.delete(idx);
                updateButtonStates();
              });
            });
          } else {
            displayInfoMessage(fetchedMessagesDiv, '<p>No se encontraron mensajes o abre un chat en WhatsApp Web.</p>');
          }
        };

        const showReloadFriendlyMessage = () => {
          displayInfoMessage(
            fetchedMessagesDiv,
            '<p style="color: #c0392b; font-weight: bold;">⚠️ Por favor, recarga la pesta&ntilde;a de WhatsApp Web para activar la conexi&oacute;n.</p>'
          );
        };

        // Intentar enviar mensaje al content script
        chrome.tabs.sendMessage(tab.id, { action: "getMessages" }, async function (response) {
          if (chrome.runtime.lastError) {
            console.warn('[Popup] Error de conexión inicial con content.js:', chrome.runtime.lastError.message);
            // Intentar inyección dinámica de content.js mediante chrome.scripting
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              });
              // Esperar un breve momento y reintentar la comunicación
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, { action: "getMessages" }, function (retryResponse) {
                  if (chrome.runtime.lastError) {
                    console.error('[Popup] Reintento fallido:', chrome.runtime.lastError.message);
                    showReloadFriendlyMessage();
                  } else {
                    handleResponse(retryResponse);
                  }
                  fetchMessagesBtn.textContent = 'Obtener Mensajes';
                  fetchMessagesBtn.disabled = false;
                  updateButtonStates();
                });
              }, 300);
              return;
            } catch (injectErr) {
              console.error('[Popup] Error al inyectar script dinámicamente:', injectErr);
              showReloadFriendlyMessage();
            }
          } else {
            handleResponse(response);
          }

          fetchMessagesBtn.textContent = 'Obtener Mensajes';
          fetchMessagesBtn.disabled = false;
          updateButtonStates();
        });
      } catch (error) {
        console.error('[Popup] Excepción capturada:', error);
        displayInfoMessage(
          fetchedMessagesDiv,
          '<p style="color: #c0392b; font-weight: bold;">⚠️ Por favor, recarga la pesta&ntilde;a de WhatsApp Web para activar la conexi&oacute;n.</p>'
        );
        fetchMessagesBtn.textContent = 'Obtener Mensajes';
        fetchMessagesBtn.disabled = false;
        updateButtonStates();
      }
    });
  }
});