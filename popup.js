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
  const noTicketTab = document.getElementById('noTicketTab');

  const runAnalyticsBtn = document.getElementById('runAnalyticsBtn');
  const resetTimestampBtn = document.getElementById('resetTimestampBtn');
  const loadMockAnalyticsBtn = document.getElementById('loadMockAnalyticsBtn');
  const analyticsRegionFilter = document.getElementById('analyticsRegionFilter');
  const analyticsProviderFilter = document.getElementById('analyticsProviderFilter');
  const analyticsSearchInput = document.getElementById('analyticsSearchInput');
  const clearAnalyticsSearchBtn = document.getElementById('clearAnalyticsSearchBtn');
  const btnViewConsolidated = document.getElementById('btnViewConsolidated');
  const btnViewAgencyVsChat = document.getElementById('btnViewAgencyVsChat');
  const lastTimestampInfo = document.getElementById('lastTimestampInfo');
  const kpiTotalCount = document.getElementById('kpiTotalCount');
  const kpiAgenciesCount = document.getElementById('kpiAgenciesCount');
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
    renderAnalyticsReport([]);
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
      if (noTicketTab) noTicketTab.classList.add('hidden');
      if (settingsTab) settingsTab.classList.add('hidden');

      if (tabName === 'actions' && actionsTab) {
        actionsTab.classList.remove('hidden');
      } else if (tabName === 'automation' && automationTab) {
        automationTab.classList.remove('hidden');
        renderTicketLogs();
      } else if (tabName === 'analytics' && analyticsTab) {
        analyticsTab.classList.remove('hidden');
        renderAnalyticsReport(currentRawMessages);
      } else if (tabName === 'noTicket' && noTicketTab) {
        noTicketTab.classList.remove('hidden');
        populateNoTicketDropdowns();
        renderNoTicketTab();
      } else if (tabName === 'settings' && settingsTab) {
        settingsTab.classList.remove('hidden');
      }
    });
  });

  // --- Módulo de Visor Analítico Interno ---
  let currentRawMessages = [];
  let storedLastProcessedTimestamp = null;
  let currentActiveView = 'consolidated';

  // Poblar desplegable de proveedores dinámicamente desde el catálogo de la extensión
  function populateProviderDropdown() {
    if (!analyticsProviderFilter || !window.WhatsAppAnalyticsEngine) return;
    const engine = new window.WhatsAppAnalyticsEngine();
    const providers = engine.getUniqueProviders();
    const currentVal = analyticsProviderFilter.value || 'TODOS';
    let html = '<option value="TODOS">Todos los Proveedores</option>';
    providers.forEach(p => {
      html += `<option value="${p}">${p}</option>`;
    });
    analyticsProviderFilter.innerHTML = html;
    if (providers.includes(currentVal)) {
      analyticsProviderFilter.value = currentVal;
    } else {
      analyticsProviderFilter.value = 'TODOS';
    }
  }

  populateProviderDropdown();

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
    const selectedProvider = analyticsProviderFilter ? analyticsProviderFilter.value : 'TODOS';
    const searchTerm = analyticsSearchInput ? analyticsSearchInput.value.toLowerCase().trim() : '';
    const viewType = currentActiveView;

    toggleClearSearchButton();

    // Filtrar por término de búsqueda (técnico, proveedor, agencia, cantón, provincia, sección, banco o región)
    if (searchTerm) {
      extracted = extracted.filter(item => 
        item.agency.toLowerCase().includes(searchTerm) ||
        (item.canton || item.cantonName || '').toLowerCase().includes(searchTerm) ||
        (item.provincia || item.provinciaName || '').toLowerCase().includes(searchTerm) ||
        (item.seccion || item.seccionName || '').toLowerCase().includes(searchTerm) ||
        (item.regionNatural || '').toLowerCase().includes(searchTerm) ||
        (item.empresa || item.banco || item.bankName || '').toLowerCase().includes(searchTerm) ||
        (item.source || '').toLowerCase().includes(searchTerm) ||
        item.chatMention.toLowerCase().includes(searchTerm) ||
        item.technician.toLowerCase().includes(searchTerm) ||
        (item.technicianProvider || '').toLowerCase().includes(searchTerm) ||
        item.region.toLowerCase().includes(searchTerm)
      );
    }

    const reportData = engine.generateStrategicReport(extracted, selectedRegion, selectedProvider);

    const metrics = reportData.summaryMetrics;
    if (kpiTotalCount) kpiTotalCount.textContent = metrics.totalExtractedCount;
    if (kpiAgenciesCount) kpiAgenciesCount.textContent = metrics.affectedAgenciesCount;
    if (kpiTopTech) kpiTopTech.textContent = metrics.topNationalTech !== 'N/A' ? `${metrics.topNationalTech} (${metrics.topNationalSupports})` : 'N/A';

    if (!reportData.reportRows || reportData.reportRows.length === 0) {
      if (analyticsReportContainer) {
        analyticsReportContainer.innerHTML = '<em style="font-size: 11px; color: #666; padding: 8px; display: block;">No hay datos o atenciones registradas para los filtros aplicados.</em>';
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
              <th>Mención en Chat</th>
              <th>Técnico Asignado</th>
            </tr>
          </thead>
          <tbody>
      `;

      reportData.reportRows.forEach(row => {
        const bankBadge = row.bankName && row.bankName !== 'N/A' ? `<span class="bank-badge">${row.bankName}</span>` : '';
        const waBadge = row.hasWhatsApp ? `<span class="source-badge badge-whatsapp">WhatsApp</span>` : '';
        const arandaBadge = row.hasAranda ? `<span class="source-badge badge-aranda">Aranda</span>` : '';
        const sourceTags = `${waBadge}${arandaBadge}`;
        const confirmedBadge = row.confirmedByOutgoingCount > 0 ? `<span class="badge-confirmed">Confirmado</span>` : '';
        const providerText = row.frequentTechProvider || 'No está en lista';
        const isNotInList = providerText === 'No está en lista';
        const cloudHtml = `<div class="provider-cloud ${isNotInList ? 'not-in-list' : ''}">${providerText}</div>`;
        html += `
          <tr>
            <td><div><strong>${row.agencyName}</strong>${bankBadge}${sourceTags}</div></td>
            <td>${row.chatMentionName || row.agencyName}</td>
            <td>
              ${cloudHtml}
              <div><strong>${row.frequentTech}</strong>${confirmedBadge}</div>
            </td>
          </tr>
        `;
      });

      html += '</tbody></table>';
    } else {
      html = `
        <table class="analytics-table">
          <thead>
            <tr>
              <th>Agencia</th>
              <th>Técnico Frecuente</th>
              <th>Soportes</th>
            </tr>
          </thead>
          <tbody>
      `;

      reportData.reportRows.forEach(row => {
        const bankBadge = row.bankName && row.bankName !== 'N/A' ? `<span class="bank-badge">${row.bankName}</span>` : '';
        const waBadge = row.hasWhatsApp ? `<span class="source-badge badge-whatsapp">WhatsApp</span>` : '';
        const arandaBadge = row.hasAranda ? `<span class="source-badge badge-aranda">Aranda</span>` : '';
        const sourceTags = `${waBadge}${arandaBadge}`;
        
        const geoParts = [];
        if (row.cantonName && row.cantonName !== row.agencyName) geoParts.push(`Cantón ${row.cantonName}`);
        if (row.provinciaName) geoParts.push(`Prov. ${row.provinciaName}`);
        if (row.regionName && row.regionName !== 'N/A') geoParts.push(row.regionName);
        if (row.seccionName) geoParts.push(row.seccionName);
        const geoText = geoParts.length > 0 ? geoParts.join(' • ') : (row.regionName || '');
        const geoBadge = `<span style="font-size:8.5px; color:#555; display:block; margin-top:2px;">${geoText}</span>`;

        const confirmedBadge = row.confirmedByOutgoingCount > 0 ? `<span class="badge-confirmed">Confirmado</span>` : '';
        const providerText = row.frequentTechProvider || 'No está en lista';
        const isNotInList = providerText === 'No está en lista';
        const cloudHtml = `<div class="provider-cloud ${isNotInList ? 'not-in-list' : ''}">${providerText}</div>`;
        html += `
          <tr>
            <td>
              <div><strong>${row.agencyName}</strong>${bankBadge}${sourceTags}</div>
              ${geoBadge}
            </td>
            <td>
              ${cloudHtml}
              <div><strong>${row.frequentTech}</strong>${confirmedBadge}</div>
            </td>
            <td style="text-align: center; font-weight: bold;">${row.totalSupports}</td>
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

  if (analyticsProviderFilter) {
    analyticsProviderFilter.addEventListener('change', () => {
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (btnViewConsolidated) {
    btnViewConsolidated.addEventListener('click', () => {
      currentActiveView = 'consolidated';
      btnViewConsolidated.classList.add('active');
      if (btnViewAgencyVsChat) btnViewAgencyVsChat.classList.remove('active');
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (btnViewAgencyVsChat) {
    btnViewAgencyVsChat.addEventListener('click', () => {
      currentActiveView = 'agencyVsChat';
      btnViewAgencyVsChat.classList.add('active');
      if (btnViewConsolidated) btnViewConsolidated.classList.remove('active');
      renderAnalyticsReport(currentRawMessages);
    });
  }

  function toggleClearSearchButton() {
    if (!clearAnalyticsSearchBtn || !analyticsSearchInput) return;
    if (analyticsSearchInput.value.trim().length > 0) {
      clearAnalyticsSearchBtn.classList.remove('hidden');
    } else {
      clearAnalyticsSearchBtn.classList.add('hidden');
    }
  }

  if (analyticsSearchInput) {
    analyticsSearchInput.addEventListener('input', () => {
      toggleClearSearchButton();
      renderAnalyticsReport(currentRawMessages);
    });
  }

  if (clearAnalyticsSearchBtn) {
    clearAnalyticsSearchBtn.addEventListener('click', () => {
      if (analyticsSearchInput) {
        analyticsSearchInput.value = '';
        analyticsSearchInput.focus();
      }
      toggleClearSearchButton();
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

  // --- Sección de Acciones como Orquestador Central (Matriz de Ingreso & Hilos) ---
  let lastOrchestratedResult = null;

  const evaluateOrchestratorBtn = document.getElementById('evaluateOrchestratorBtn');
  const autoRoutePendingBtn = document.getElementById('autoRoutePendingBtn');
  const orchestratorGroupLabel = document.getElementById('orchestratorGroupLabel');
  const kpiMatrixTicket = document.getElementById('kpiMatrixTicket');
  const kpiMatrixPending = document.getElementById('kpiMatrixPending');
  const kpiMatrixNoise = document.getElementById('kpiMatrixNoise');
  const kpiMatrixFallback = document.getElementById('kpiMatrixFallback');

  function runOrchestratorEvaluation(messagesList) {
    if (!window.WhatsAppMessageOrchestrator || !messagesList || messagesList.length === 0) {
      if (fetchedMessagesDiv) {
        fetchedMessagesDiv.innerHTML = '<em style="color:#666; font-size:11px;">Obt&eacute;n mensajes de WhatsApp arriba para evaluar la matriz de ingreso.</em>';
      }
      return;
    }

    const engine = window.WhatsAppAnalyticsEngine ? new window.WhatsAppAnalyticsEngine() : null;
    const orchestrator = new window.WhatsAppMessageOrchestrator(engine);
    const targetGroup = waGroupInput ? waGroupInput.value.trim() : "Soporte en Sitio Akros";

    lastOrchestratedResult = orchestrator.evaluateMessages(messagesList, targetGroup);

    const stats = lastOrchestratedResult.stats;
    if (kpiMatrixTicket) kpiMatrixTicket.textContent = stats.withTicket;
    if (kpiMatrixPending) kpiMatrixPending.textContent = stats.pendingTicket;
    if (kpiMatrixNoise) kpiMatrixNoise.textContent = stats.discardedNoise;
    if (kpiMatrixFallback) kpiMatrixFallback.textContent = stats.fallbackDefault;
    if (orchestratorGroupLabel) orchestratorGroupLabel.textContent = targetGroup;

    let html = '<div style="display:flex; flex-direction:column; gap:6px;">';
    lastOrchestratedResult.evaluatedMessages.forEach((msg) => {
      const displayMsg = (msg.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const threadBadge = msg.threadContext 
        ? `<div class="thread-badge">🧵 Hilo: ${msg.threadContext}</div>` 
        : '';
      const bankBadge = msg.bank && msg.bank !== 'N/A' 
        ? `<span class="bank-badge">${msg.bank}</span>` 
        : '';

      html += `
        <div style="background:#ffffff; border:1px solid #cfd8dc; border-radius:6px; padding:6px 8px; font-size:11px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div style="display:flex; align-items:center; gap:4px;">
              <input type="checkbox" id="msg-${msg.index}" data-index="${msg.index}">
              <span class="matrix-badge ${msg.badgeClass}">${msg.categoryLabel}</span>
              ${bankBadge}
            </div>
            <span style="font-size:9.5px; color:#777;">${msg.sender}</span>
          </div>
          <div style="color:#222; margin-bottom:3px; font-weight:500;">${displayMsg}</div>
          ${threadBadge}
          <div style="font-size:9px; color:#555; margin-top:3px; font-style:italic;">
            📍 Decisi&oacute;n: ${msg.routingDecision}
          </div>
        </div>
      `;
    });
    html += '</div>';

    fetchedMessagesDiv.innerHTML = html;

    fetchedMessagesDiv.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        const idx = parseInt(event.target.getAttribute('data-index'));
        if (event.target.checked) selectedMessageIndices.add(idx);
        else selectedMessageIndices.delete(idx);
        updateButtonStates();
      });
    });
  }

  if (evaluateOrchestratorBtn) {
    evaluateOrchestratorBtn.addEventListener('click', () => {
      if (fetchedMessages && fetchedMessages.length > 0) {
        runOrchestratorEvaluation(fetchedMessages);
      } else if (fetchMessagesBtn) {
        fetchMessagesBtn.click();
      }
    });
  }

  if (autoRoutePendingBtn) {
    autoRoutePendingBtn.addEventListener('click', () => {
      if (!lastOrchestratedResult || !lastOrchestratedResult.evaluatedMessages) {
        alert("Por favor obtenga o evalúe mensajes primero con el Orquestador.");
        return;
      }

      const pendingMsgs = lastOrchestratedResult.evaluatedMessages.filter(m => m.category === 'TICKET_PENDIENTE');

      if (pendingMsgs.length === 0) {
        alert("No se encontraron mensajes clasificados como 'Ticket Pendiente' en la evaluación actual.");
        return;
      }

      let addedCount = 0;
      pendingMsgs.forEach(msg => {
        const timestamp = msg.timestamp || new Date().toISOString();
        const monthObj = getMonthNameKey(timestamp);
        const agencyVal = msg.agency || 'Sin Ubicación Especificada';
        const techVal = msg.technician || 'Por Asignar';

        let bankName = msg.bank || 'N/A';
        let cantonName = '';
        let provinciaName = '';
        let providerVal = msg.provider || 'No está en lista';

        if (window.WhatsAppAnalyticsEngine) {
          const engine = new window.WhatsAppAnalyticsEngine();
          const agencyObj = engine.agenciesCatalog.find(a => a.agencia === agencyVal);
          if (agencyObj) {
            bankName = engine.formatBankAbbreviation(agencyObj.empresa || agencyObj.banco);
            cantonName = agencyObj.canton || '';
            provinciaName = agencyObj.provincia || '';
          }
        }

        const newRecord = {
          id: 'nt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          timestamp: timestamp,
          monthKey: monthObj.key,
          monthName: monthObj.name,
          agencyName: agencyVal,
          bankName: bankName,
          cantonName: cantonName,
          provinciaName: provinciaName,
          technicianName: techVal,
          technicianProvider: providerVal,
          details: msg.text,
          status: 'PENDIENTE',
          ticketCode: null,
          source: 'WhatsApp Orquestador',
          createdAt: new Date().toISOString()
        };

        noTicketSupports.unshift(newRecord);
        addedCount++;
      });

      chrome.storage.local.set({ noTicketSupports: noTicketSupports }, () => {
        alert(`\u00a1\u00c9xito! Se derivaron ${addedCount} atenciones al m\u00f3dulo 'Sin Ticket' (${getMonthNameKey(new Date()).name}).`);
        populateNoTicketDropdowns();
        renderNoTicketTab();
      });
    });
  }

  // --- Funciones Manuales de IA & Captura de Mensajes ---
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
            runOrchestratorEvaluation(messagesToShow);
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

        chrome.tabs.sendMessage(tab.id, { action: "getMessages" }, async function (response) {
          if (chrome.runtime.lastError) {
            console.warn('[Popup] Error de conexión inicial con content.js:', chrome.runtime.lastError.message);
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              });
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

  // --- Módulo de Atenciones sin Ticket (Persistencia, Match Posterior & Exportación Excel) ---
  const noTicketDateTime = document.getElementById('noTicketDateTime');
  const noTicketTechSelect = document.getElementById('noTicketTechSelect');
  const noTicketAgencySelect = document.getElementById('noTicketAgencySelect');
  const noTicketDetails = document.getElementById('noTicketDetails');
  const addNoTicketBtn = document.getElementById('addNoTicketBtn');
  const exportNoTicketExcelBtn = document.getElementById('exportNoTicketExcelBtn');
  const autoMatchTicketsBtn = document.getElementById('autoMatchTicketsBtn');
  const noTicketMonthFilter = document.getElementById('noTicketMonthFilter');
  const noTicketSearchInput = document.getElementById('noTicketSearchInput');
  const clearNoTicketSearch = document.getElementById('clearNoTicketSearch');
  const kpiNoTicketTotal = document.getElementById('kpiNoTicketTotal');
  const kpiNoTicketPending = document.getElementById('kpiNoTicketPending');
  const kpiNoTicketMatched = document.getElementById('kpiNoTicketMatched');
  const noTicketListContainer = document.getElementById('noTicketListContainer');

  let noTicketSupports = [];

  // Cargar registros sin ticket guardados previamente
  chrome.storage.local.get(['noTicketSupports'], (res) => {
    if (res.noTicketSupports && Array.isArray(res.noTicketSupports)) {
      noTicketSupports = res.noTicketSupports;
    }
  });

  function populateNoTicketDropdowns() {
    if (!window.WhatsAppAnalyticsEngine) return;
    const engine = new window.WhatsAppAnalyticsEngine();
    
    if (noTicketTechSelect && noTicketTechSelect.options.length <= 1) {
      let techHtml = '<option value="">Seleccionar Técnico...</option>';
      engine.techniciansCatalog.forEach(t => {
        techHtml += `<option value="${t.nombre}">${t.nombre}</option>`;
      });
      noTicketTechSelect.innerHTML = techHtml;
    }

    if (noTicketAgencySelect && noTicketAgencySelect.options.length <= 1) {
      let agencyHtml = '<option value="">Seleccionar Agencia...</option>';
      engine.agenciesCatalog.forEach(a => {
        agencyHtml += `<option value="${a.nombre}">${a.nombre} (${a.banco})</option>`;
      });
      noTicketAgencySelect.innerHTML = agencyHtml;
    }
  }

  function getMonthNameKey(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { key: '2026-09', name: 'Septiembre 2026' };
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const monthsMap = {
      '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
      '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
      '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };
    const key = `${year}-${month}`;
    const name = `${monthsMap[month] || month} ${year}`;
    return { key, name };
  }

  function renderNoTicketTab() {
    if (!noTicketListContainer) return;

    const selectedMonth = noTicketMonthFilter ? noTicketMonthFilter.value : '2026-09';
    const searchTerm = noTicketSearchInput ? noTicketSearchInput.value.toLowerCase().trim() : '';

    let filtered = [...noTicketSupports];

    if (selectedMonth !== 'TODOS') {
      filtered = filtered.filter(item => {
        const itemKey = item.monthKey || (item.timestamp ? item.timestamp.slice(0, 7) : '');
        return itemKey === selectedMonth;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.technicianName || '').toLowerCase().includes(searchTerm) ||
        (item.agencyName || '').toLowerCase().includes(searchTerm) ||
        (item.details || '').toLowerCase().includes(searchTerm) ||
        (item.ticketCode || '').toLowerCase().includes(searchTerm) ||
        (item.bankName || '').toLowerCase().includes(searchTerm)
      );
    }

    // Actualizar KPIs
    const totalCount = filtered.length;
    const pendingCount = filtered.filter(i => i.status === 'PENDIENTE').length;
    const matchedCount = filtered.filter(i => i.status === 'ASIGNADO').length;

    if (kpiNoTicketTotal) kpiNoTicketTotal.textContent = totalCount;
    if (kpiNoTicketPending) kpiNoTicketPending.textContent = pendingCount;
    if (kpiNoTicketMatched) kpiNoTicketMatched.textContent = matchedCount;

    if (filtered.length === 0) {
      noTicketListContainer.innerHTML = '<em style="color:#666; font-size:11px; padding:8px; display:block;">No hay atenciones registradas para el periodo o filtro seleccionado.</em>';
      return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:6px;">';
    filtered.forEach((item) => {
      const isPending = item.status === 'PENDIENTE';
      const statusBadge = isPending
        ? `<span style="background-color: #e67e22; color: white; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold;">PENDIENTE TICKET</span>`
        : `<span style="background-color: #27ae60; color: white; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold;">TICKET: ${item.ticketCode}</span>`;

      const dateDisplay = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
      const providerText = item.technicianProvider || 'No está en lista';
      const bankBadge = item.bankName && item.bankName !== 'N/A' ? `<span class="bank-badge">${item.bankName}</span>` : '';

      html += `
        <div style="background:#ffffff; border:1px solid #cfd8dc; border-radius:6px; padding:6px 8px; font-size:11px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div>
              <strong>${item.agencyName}</strong> ${bankBadge}
            </div>
            ${statusBadge}
          </div>
          <div style="margin-bottom:3px; color:#333;">
            <strong>Técnico:</strong> ${item.technicianName} <span class="provider-cloud ${providerText === 'No está en lista' ? 'not-in-list' : ''}" style="margin-left:4px;">${providerText}</span>
          </div>
          <div style="font-size:10.5px; color:#555; background:#f9fbf9; padding:4px; border-radius:4px; margin-bottom:4px;">
            ${item.details || 'Sin observaciones'}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:9.5px; color:#777;">
            <span>📅 ${dateDisplay}</span>
            <div style="display:flex; gap:4px;">
              ${isPending ? `<button class="assign-ticket-btn" data-id="${item.id}" style="background:#075E54; color:white; border:none; padding:2px 6px; font-size:9px; border-radius:3px; cursor:pointer;">Asignar Ticket</button>` : ''}
              <button class="delete-noticket-btn" data-id="${item.id}" style="background:#c62828; color:white; border:none; padding:2px 6px; font-size:9px; border-radius:3px; cursor:pointer;">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    noTicketListContainer.innerHTML = html;

    // Asignar listeners a botones dinámicos
    noTicketListContainer.querySelectorAll('.assign-ticket-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-id');
        const code = prompt("Ingrese el número o código de ticket asignado:");
        if (code && code.trim()) {
          assignTicketToRecord(itemId, code.trim());
        }
      });
    });

    noTicketListContainer.querySelectorAll('.delete-noticket-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.getAttribute('data-id');
        deleteNoTicketRecord(itemId);
      });
    });
  }

  function assignTicketToRecord(itemId, ticketCode) {
    const idx = noTicketSupports.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      noTicketSupports[idx].status = 'ASIGNADO';
      noTicketSupports[idx].ticketCode = ticketCode;
      noTicketSupports[idx].matchedAt = new Date().toISOString();
      chrome.storage.local.set({ noTicketSupports: noTicketSupports }, () => {
        renderNoTicketTab();
      });
    }
  }

  function deleteNoTicketRecord(itemId) {
    noTicketSupports = noTicketSupports.filter(i => i.id !== itemId);
    chrome.storage.local.set({ noTicketSupports: noTicketSupports }, () => {
      renderNoTicketTab();
    });
  }

  if (addNoTicketBtn) {
    addNoTicketBtn.addEventListener('click', () => {
      const dtVal = noTicketDateTime ? noTicketDateTime.value : '';
      const techVal = noTicketTechSelect ? noTicketTechSelect.value : '';
      const agencyVal = noTicketAgencySelect ? noTicketAgencySelect.value : '';
      const detailsVal = noTicketDetails ? noTicketDetails.value.trim() : '';

      if (!techVal || !agencyVal) {
        alert("Por favor seleccione un Técnico y una Agencia.");
        return;
      }

      const timestamp = dtVal ? new Date(dtVal).toISOString() : new Date().toISOString();
      const monthObj = getMonthNameKey(timestamp);

      let bankName = 'N/A';
      let cantonName = '';
      let provinciaName = '';
      let providerVal = 'No está en lista';

      if (window.WhatsAppAnalyticsEngine) {
        const engine = new window.WhatsAppAnalyticsEngine();
        const agencyObj = engine.agenciesCatalog.find(a => a.nombre === agencyVal);
        if (agencyObj) {
          bankName = agencyObj.banco || 'N/A';
          cantonName = agencyObj.canton || '';
          provinciaName = agencyObj.provincia || '';
        }
        const techObj = engine.techniciansCatalog.find(t => t.nombre === techVal);
        if (techObj) {
          providerVal = techObj.proveedor || 'No está en lista';
        }
      }

      const newRecord = {
        id: 'nt_' + Date.now(),
        timestamp: timestamp,
        monthKey: monthObj.key,
        monthName: monthObj.name,
        agencyName: agencyVal,
        bankName: bankName,
        cantonName: cantonName,
        provinciaName: provinciaName,
        technicianName: techVal,
        technicianProvider: providerVal,
        details: detailsVal,
        status: 'PENDIENTE',
        ticketCode: null,
        source: 'WhatsApp / Manual',
        createdAt: new Date().toISOString()
      };

      noTicketSupports.unshift(newRecord);
      chrome.storage.local.set({ noTicketSupports: noTicketSupports }, () => {
        if (noTicketDetails) noTicketDetails.value = '';
        renderNoTicketTab();
      });
    });
  }

  if (autoMatchTicketsBtn) {
    autoMatchTicketsBtn.addEventListener('click', () => {
      chrome.storage.local.get(['activityLogs', 'ticketLogs'], (res) => {
        const logs = res.activityLogs || res.ticketLogs || [];
        let matchCount = 0;

        noTicketSupports.forEach(record => {
          if (record.status === 'PENDIENTE') {
            const matchingLog = logs.find(log => {
              if (!log.ticketCode) return false;
              const text = (log.text || '').toLowerCase();
              const tech = record.technicianName.toLowerCase();
              const agency = record.agencyName.toLowerCase();
              return text.includes(tech) || text.includes(agency);
            });

            if (matchingLog) {
              record.status = 'ASIGNADO';
              record.ticketCode = matchingLog.ticketCode;
              record.matchedAt = new Date().toISOString();
              matchCount++;
            }
          }
        });

        if (matchCount > 0) {
          chrome.storage.local.set({ noTicketSupports: noTicketSupports }, () => {
            alert(`Se emparejaron ${matchCount} atenciones con tickets de la bitácora.`);
            renderNoTicketTab();
          });
        } else {
          alert("No se encontraron nuevos emparejamientos automáticos en la bitácora.");
        }
      });
    });
  }

  if (exportNoTicketExcelBtn) {
    exportNoTicketExcelBtn.addEventListener('click', () => {
      if (!window.XLSX) {
        alert("Error: La librería SheetJS (XLSX) no está disponible.");
        return;
      }

      const selectedMonth = noTicketMonthFilter ? noTicketMonthFilter.value : '2026-09';
      let filtered = [...noTicketSupports];

      if (selectedMonth !== 'TODOS') {
        filtered = filtered.filter(item => {
          const itemKey = item.monthKey || (item.timestamp ? item.timestamp.slice(0, 7) : '');
          return itemKey === selectedMonth;
        });
      }

      if (filtered.length === 0) {
        alert("No hay atenciones registradas para exportar en el periodo seleccionado.");
        return;
      }

      const exportRows = filtered.map(r => {
        let bankAbbr = r.bankName || 'N/A';
        let canton = r.cantonName || '';
        let provincia = r.provinciaName || '';
        let region = '';
        let seccion = '';

        if (window.WhatsAppAnalyticsEngine) {
          const engine = new window.WhatsAppAnalyticsEngine();
          bankAbbr = engine.formatBankAbbreviation(r.bankName || engine.getAgencyBank(r.agencyName));
          const match = engine.agenciesCatalog.find(a => a.agencia === r.agencyName);
          if (match) {
            canton = canton || match.canton || '';
            provincia = provincia || match.provincia || '';
            region = match.region || '';
            seccion = match.seccion || '';
          }
        }

        const locationParts = [];
        if (canton) locationParts.push(`Cantón: ${canton}`);
        if (provincia) locationParts.push(`Prov: ${provincia}`);
        if (region) locationParts.push(region);
        if (seccion) locationParts.push(seccion);
        const locationStr = locationParts.join(' • ') || 'N/A';

        return {
          'ID Registro': r.id,
          'Fecha y Hora': r.timestamp ? new Date(r.timestamp).toLocaleString() : 'N/A',
          'Mes': r.monthName || 'Septiembre 2026',
          'Agencia': r.agencyName,
          'Banco': bankAbbr,
          'Ubicación Completa (Cantón / Prov / Región / Sección)': locationStr,
          'Técnico Asignado': r.technicianName,
          'Proveedor / Empresa': r.technicianProvider || 'No está en lista',
          'Detalles u Observaciones': r.details || '',
          'Estado Ticket': r.status === 'ASIGNADO' ? 'TICKET ASIGNADO' : 'PENDIENTE TICKET',
          'Código de Ticket': r.ticketCode || 'PENDIENTE',
          'Origen': r.source || 'WhatsApp Orquestador / Manual'
        };
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Atenciones Sin Ticket");

      const filename = `Reporte_Atenciones_Sin_Ticket_${selectedMonth}.xlsx`;
      XLSX.writeFile(wb, filename);
    });
  }

  if (noTicketMonthFilter) {
    noTicketMonthFilter.addEventListener('change', () => {
      renderNoTicketTab();
    });
  }

  if (clearNoTicketSearch && noTicketSearchInput) {
    noTicketSearchInput.addEventListener('input', () => {
      if (noTicketSearchInput.value.trim().length > 0) {
        clearNoTicketSearch.classList.remove('hidden');
      } else {
        clearNoTicketSearch.classList.add('hidden');
      }
      renderNoTicketTab();
    });
    clearNoTicketSearch.addEventListener('click', () => {
      noTicketSearchInput.value = '';
      clearNoTicketSearch.classList.add('hidden');
      renderNoTicketTab();
    });
  }
});