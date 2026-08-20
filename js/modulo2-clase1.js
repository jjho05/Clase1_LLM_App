/**
 * Meta AI - Módulo 2 · Tema 1: WhatsApp Cloud API Engine
 * Interactive Simulators:
 * 1. Webhook Handshake Validator (GET /webhook)
 * 2. Visual WhatsApp JSON Payload Parser
 * 3. Bidirectional Ping-Pong Flow Simulator (Mock vs Llama 3)
 * 4. WhatsApp Cloud API Dispatcher & Code Generator (POST /messages)
 * 5. HMAC SHA-256 Security Signature Verifier
 * 6. Interactive Quiz Engine & Exercises
 * 7. Searchable Technical Glossary
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initHandshakeSimulator();
    initPayloadParser();
    initBidirectionalSimulator();
    initApiDispatcher();
    initHmacVerifier();
    initPipelineSimulator();
    initQuizEngine();
    initExerciseToggles();
    initGlossaryFilter();
  });

  /* ==========================================================================
     1. BANCO 2.1.1: SIMULADOR VISUAL DE HANDSHAKE (META VS SERVIDOR)
     ========================================================================== */
  function initHandshakeSimulator() {
    const callbackUrlInput = document.getElementById("hs-callback-url");
    const tokenInput = document.getElementById("hs-token");
    const modeInput = document.getElementById("hs-mode");
    const challengeInput = document.getElementById("hs-challenge");
    const serverTokenInput = document.getElementById("hs-server-token");
    const responseFormatSelect = document.getElementById("hs-response-format");
    const casePresetSelect = document.getElementById("hs-case-preset-select");
    const btnTest = document.getElementById("hs-btn-test");
    const outputConsole = document.getElementById("hs-console");
    const statusPill = document.getElementById("hs-status-pill");
    const resultVisualCard = document.getElementById("hs-result-visual-card");
    const resultIcon = document.getElementById("hs-result-icon");
    const resultTitle = document.getElementById("hs-result-title");
    const resultDesc = document.getElementById("hs-result-desc");

    if (!btnTest || !outputConsole) return;

    function runVerification() {
      if (window.SOUND) window.SOUND.playPop(420);
      const url = callbackUrlInput ? callbackUrlInput.value.trim() : "https://a3f8-55-12.ngrok-free.app/webhook";
      const mode = modeInput ? modeInput.value.trim() : "subscribe";
      const token = tokenInput ? tokenInput.value.trim() : "";
      const challenge = challengeInput ? challengeInput.value.trim() : "1158201444";
      const serverToken = serverTokenInput ? serverTokenInput.value.trim() : "MI_TOKEN_SECRETO_2026";
      const format = responseFormatSelect ? responseFormatSelect.value : "plain";

      let log = "";
      const timestamp = new Date().toLocaleTimeString();

      log += `<span style="color:#64748b;">// [${timestamp}] 1. PETICIÓN HTTP GET DISPARADA POR META FOR DEVELOPERS</span>\n`;
      log += `<span style="color:#38bdf8; font-weight:700;">GET</span> ${escapeHtml(url)}?hub.mode=${encodeURIComponent(mode)}&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=${encodeURIComponent(challenge)} HTTP/1.1\n`;
      log += `<span style="color:#64748b;">Host:</span> a3f8-55-12.ngrok-free.app\n`;
      log += `<span style="color:#64748b;">User-Agent:</span> FacebookPlatform/1.0 (+http://developers.facebook.com)\n`;
      log += `<span style="color:#64748b;">Accept:</span> */*\n\n`;

      log += `<span style="color:#64748b;">// 2. PROCESAMIENTO Y EVALUACIÓN EN TU ENDPOINT FASTAPI</span>\n`;

      // CASO: Servidor Apagado
      if (format === "server_down") {
        log += `<span style="color:#ef4444;">[ERROR DE RED] No se pudo establecer conexión con http://localhost:8000</span>\n`;
        log += `<span style="color:#ef4444;">[NGROK] Error 502 Bad Gateway / 504 Gateway Timeout (Servidor Uvicorn no iniciado o caído)</span>\n\n`;
        log += `<span style="color:#ef4444; font-weight:700;">HTTP/1.1 504 Gateway Timeout</span>\n`;
        log += `Content-Type: text/html\n\n`;
        log += `<span style="color:#f87171;">&lt;html&gt;&lt;body&gt;ngrok: Gateway Timeout&lt;/body&gt;&lt;/html&gt;</span>\n\n`;
        log += `<span style="color:#ef4444; font-weight:700;">[DIAGNÓSTICO META]:</span> "The URL couldn't be validated. The server did not respond in time."`;

        updateResultUI("error", "Error 504 Gateway Timeout", "Meta no pudo contactar a tu servidor local. Inicia tu backend con 'uvicorn main:app --port 8000'.", "504 Gateway Timeout", "bench-badge-status status-error");
        outputConsole.innerHTML = log;
        return;
      }

      // Validación de modo y token
      const isModeValid = (mode === "subscribe");
      const isTokenValid = (token === serverToken && token !== "");

      if (isModeValid && isTokenValid) {
        log += `<span style="color:#22c55e;">[OK] hub.mode validado con éxito: '${mode}' === 'subscribe'</span>\n`;
        log += `<span style="color:#22c55e;">[OK] hub.verify_token validado: '${token}' coincide con VERIFY_TOKEN de tu entorno</span>\n`;

        if (format === "plain") {
          log += `<span style="color:#22c55e;">[OK] Retornando hub.challenge en texto plano (PlainTextResponse)</span>\n\n`;
          log += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span>\n`;
          log += `<span style="color:#94a3b8;">Content-Type: text/plain; charset=utf-8</span>\n`;
          log += `<span style="color:#94a3b8;">Content-Length: ${challenge.length}</span>\n\n`;
          log += `<span style="color:#38bdf8; font-weight:700;">${escapeHtml(challenge)}</span>\n\n`;
          log += `<span style="color:#22c55e; font-weight:700;">[DIAGNÓSTICO META]:</span> "✔ Webhook validado y guardado exitosamente. Tu suscripción a eventos 'messages' está lista."`;

          updateResultUI("success", "✔ Webhook Verificado Exitosamente (200 OK)", "Meta for Developers recibió el hub.challenge en texto plano exacto y activó la suscripción a eventos.", "200 OK · Verificado", "bench-badge-status status-success");
          if (window.SOUND) window.SOUND.playChime();
        } else if (format === "json") {
          log += `<span style="color:#f59e0b;">[ADVERTENCIA] Tu endpoint devolvió un JSON en vez de texto plano: '{"hub.challenge": "${challenge}"}'</span>\n\n`;
          log += `<span style="color:#f59e0b; font-weight:700;">HTTP/1.1 200 OK</span>\n`;
          log += `<span style="color:#94a3b8;">Content-Type: application/json</span>\n\n`;
          log += `<span style="color:#f87171;">{"hub.challenge": "${escapeHtml(challenge)}"}</span>\n\n`;
          log += `<span style="color:#ef4444; font-weight:700;">[ERROR EN META]:</span> "The URL couldn't be validated. The challenge response was not returned as plain text."`;

          updateResultUI("error", "⚠️ Fallo de Formato: Meta Espera Texto Plano", "Tu servidor devolvió código 200 pero en formato JSON. Meta requiere texto plano estricto: usa Response(content=hub_challenge, media_type='text/plain').", "Formato Inválido", "bench-badge-status status-warning");
        } else if (format === "html") {
          log += `<span style="color:#f59e0b;">[ADVERTENCIA] Tu endpoint devolvió HTML en vez de texto plano</span>\n\n`;
          log += `<span style="color:#f59e0b; font-weight:700;">HTTP/1.1 200 OK</span>\n`;
          log += `<span style="color:#94a3b8;">Content-Type: text/html</span>\n\n`;
          log += `<span style="color:#f87171;">&lt;html&gt;&lt;body&gt;${escapeHtml(challenge)}&lt;/body&gt;&lt;/html&gt;</span>\n\n`;
          log += `<span style="color:#ef4444; font-weight:700;">[ERROR EN META]:</span> "The URL couldn't be validated. Received HTML payload."`;

          updateResultUI("error", "⚠️ Fallo de Formato HTML", "Meta no acepta etiquetas HTML en el challenge. Debe retornarse la cadena numérica en texto plano sin etiquetas.", "Formato Inválido", "bench-badge-status status-warning");
        }
      } else {
        log += `<span style="color:#ef4444;">[FAIL] Fallo en la autenticación del handshake:</span>\n`;
        if (!isModeValid) {
          log += `<span style="color:#ef4444;">  - hub.mode inválido: esperado 'subscribe', recibido '${escapeHtml(mode)}'</span>\n`;
        }
        if (!isTokenValid) {
          log += `<span style="color:#ef4444;">  - hub.verify_token incorrecto: recibido '${escapeHtml(token)}', esperado '${escapeHtml(serverToken)}'</span>\n`;
        }
        log += `\n<span style="color:#ef4444; font-weight:700;">HTTP/1.1 403 Forbidden</span>\n`;
        log += `<span style="color:#94a3b8;">Content-Type: application/json</span>\n\n`;
        log += `<span style="color:#f87171;">{"detail": "Token de verificación inválido o modo incorrecto"}</span>\n\n`;
        log += `<span style="color:#ef4444; font-weight:700;">[DIAGNÓSTICO META]:</span> "The URL couldn't be validated. The server responded with HTTP 403 Forbidden."`;

        updateResultUI("error", "❌ 403 Forbidden · Token Rechazado", "El token enviado por Meta no coincide con el VERIFY_TOKEN de tu backend. Comprueba que ambas cadenas sean idénticas.", "403 Forbidden · Rechazado", "bench-badge-status status-error");
      }

      outputConsole.innerHTML = log;
    }

    function updateResultUI(type, title, desc, pillText, pillClass) {
      if (resultVisualCard) {
        resultVisualCard.className = `handshake-result-card result-${type}`;
      }
      if (resultIcon) {
        resultIcon.textContent = type === "success" ? "✔" : (type === "warning" ? "⚠️" : "❌");
      }
      if (resultTitle) resultTitle.textContent = title;
      if (resultDesc) resultDesc.textContent = desc;
      if (statusPill) {
        statusPill.textContent = pillText;
        statusPill.className = pillClass;
      }
    }

    if (casePresetSelect) {
      casePresetSelect.addEventListener("change", function(){
        const val = this.value;
        if (modeInput) modeInput.value = "subscribe";
        if (challengeInput) challengeInput.value = "1158201444";
        if (serverTokenInput) serverTokenInput.value = "MI_TOKEN_SECRETO_2026";

        if (val === "success") {
          if (tokenInput) tokenInput.value = "MI_TOKEN_SECRETO_2026";
          if (responseFormatSelect) responseFormatSelect.value = "plain";
        } else if (val === "token_mismatch") {
          if (tokenInput) tokenInput.value = "TOKEN_ERRONEO_XYZ_99";
          if (responseFormatSelect) responseFormatSelect.value = "plain";
        } else if (val === "invalid_mode") {
          if (modeInput) modeInput.value = "publish";
          if (tokenInput) tokenInput.value = "MI_TOKEN_SECRETO_2026";
          if (responseFormatSelect) responseFormatSelect.value = "plain";
        } else if (val === "json_error") {
          if (tokenInput) tokenInput.value = "MI_TOKEN_SECRETO_2026";
          if (responseFormatSelect) responseFormatSelect.value = "json";
        } else if (val === "server_down") {
          if (tokenInput) tokenInput.value = "MI_TOKEN_SECRETO_2026";
          if (responseFormatSelect) responseFormatSelect.value = "server_down";
        }
        runVerification();
      });
    }

    btnTest.addEventListener("click", runVerification);
  }

  /* ==========================================================================
     2. BANCO 2.1.2: INSPECTOR & PARSER VISUAL DE PAYLOAD JSON DE WHATSAPP
     ========================================================================== */
  function initPayloadParser() {
    const rawInput = document.getElementById("json-raw-input");
    const btnParse = document.getElementById("json-btn-parse");
    const presetSelect = document.getElementById("json-preset-select");
    const outSender = document.getElementById("out-sender-num");
    const outSenderName = document.getElementById("out-sender-name");
    const outMsgId = document.getElementById("out-msg-id");
    const outMsgBody = document.getElementById("out-msg-body");
    const outContentPath = document.getElementById("out-content-path");
    const outPhoneId = document.getElementById("out-phone-id");
    const outEventTypeBadge = document.getElementById("out-event-type-badge");
    const parseStatus = document.getElementById("json-parse-status");
    const chatUserLabel = document.getElementById("out-chat-user-label");
    const chatBubbleText = document.getElementById("out-chat-bubble-text");
    const pythonCodeView = document.getElementById("parser-python-code-view");

    const samplePayloads = {
      text: {
        "object": "whatsapp_business_account",
        "entry": [
          {
            "id": "104928374619283",
            "changes": [
              {
                "value": {
                  "messaging_product": "whatsapp",
                  "metadata": {
                    "display_phone_number": "+1 555-0199",
                    "phone_number_id": "109823746592831"
                  },
                  "contacts": [
                    {
                      "profile": { "name": "Lic. Jesús Olvera" },
                      "wa_id": "5215587654321"
                    }
                  ],
                  "messages": [
                    {
                      "from": "5215587654321",
                      "id": "wamid.HBgNNTIxNTU4NzY1NDMyMRUCABEYEjA5OEY3NDk2NkI2MzU2RDA3NwA=",
                      "timestamp": "1724089200",
                      "text": {
                        "body": "¿Hola! ¿Cuál es el estatus del pedido #45210?"
                      },
                      "type": "text"
                    }
                  ]
                },
                "field": "messages"
              }
            ]
          }
        ]
      },
      button_reply: {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "104928374619283",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": { "display_phone_number": "+1 555-0199", "phone_number_id": "109823746592831" },
              "contacts": [{ "profile": { "name": "Lic. Jesús Olvera" }, "wa_id": "5215587654321" }],
              "messages": [{
                "from": "5215587654321",
                "id": "wamid.HBgNNTIxNTU4NzY1NDMyMRUCABEYEjNDNDU2Nzg5MDEyMzQ1Njc4OQA=",
                "timestamp": "1724089500",
                "interactive": {
                  "type": "button_reply",
                  "button_reply": { "id": "btn_reagendar_cita", "title": "📅 Reagendar Cita para Mañana" }
                },
                "type": "interactive"
              }]
            },
            "field": "messages"
          }]
        }]
      },
      location: {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "104928374619283",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": { "display_phone_number": "+1 555-0199", "phone_number_id": "109823746592831" },
              "contacts": [{ "profile": { "name": "Dra. Sofía Morales" }, "wa_id": "5215512345678" }],
              "messages": [{
                "from": "5215512345678",
                "id": "wamid.HBgNNTIxNTUxMjM0NTY3OBUCABEYEjFCMTMyNDM1NDY1NzY4Nzk4NwA=",
                "timestamp": "1724089350",
                "location": { "latitude": 19.432608, "longitude": -99.133209, "name": "Sucursal Centro CDMX" },
                "type": "location"
              }]
            },
            "field": "messages"
          }]
        }]
      },
      audio: {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "104928374619283",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": { "display_phone_number": "+1 555-0199", "phone_number_id": "109823746592831" },
              "contacts": [{ "profile": { "name": "Ing. Carlos Mendoza" }, "wa_id": "5215599887766" }],
              "messages": [{
                "from": "5215599887766",
                "id": "wamid.HBgNNTIxNTU5OTg4Nzc2NgUCABEYEjVDNzg5MDEyMzQ1Njc4OTA5OAA=",
                "timestamp": "1724089600",
                "audio": { "id": "media_audio_9941827", "mime_type": "audio/ogg; codecs=opus", "voice": true },
                "type": "audio"
              }]
            },
            "field": "messages"
          }]
        }]
      },
      status_read: {
        "object": "whatsapp_business_account",
        "entry": [{
          "id": "104928374619283",
          "changes": [{
            "value": {
              "messaging_product": "whatsapp",
              "metadata": { "display_phone_number": "+1 555-0199", "phone_number_id": "109823746592831" },
              "statuses": [{
                "id": "wamid.HBgLMjUyMTU1ODc4NDk...",
                "status": "read",
                "timestamp": "1724089900",
                "recipient_id": "5215587654321",
                "conversation": { "id": "conv_991823", "origin": { "type": "user_initiated" } }
              }]
            },
            "field": "messages"
          }]
        }]
      }
    };

    function parsePayload() {
      if (!rawInput) return;
      try {
        const obj = JSON.parse(rawInput.value);
        const entry = obj.entry && obj.entry[0];
        const changes = entry && entry.changes && entry.changes[0];
        const val = changes && changes.value;
        const metadata = val && val.metadata;
        const contact = val && val.contacts && val.contacts[0];
        const msg = val && val.messages && val.messages[0];
        const status = val && val.statuses && val.statuses[0];

        if (status) {
          // Evento de Estado (Leído / Entregado)
          if (outEventTypeBadge) {
            outEventTypeBadge.textContent = `Status Callback: ${status.status.toUpperCase()}`;
            outEventTypeBadge.style.background = "rgba(139, 92, 246, 0.12)";
            outEventTypeBadge.style.color = "var(--meta-purple)";
          }
          if (outSender) outSender.textContent = status.recipient_id || "N/A";
          if (outSenderName) outSenderName.textContent = "(Notificación de lectura / entrega)";
          if (outMsgId) outMsgId.textContent = status.id || "N/A";
          if (outContentPath) outContentPath.textContent = "statuses[0].status";
          if (outMsgBody) outMsgBody.textContent = `👁️ El usuario leyó el mensaje (Status: "${status.status}")`;
          if (outPhoneId) outPhoneId.textContent = (metadata && metadata.phone_number_id) ? metadata.phone_number_id : "N/A";

          if (chatUserLabel) chatUserLabel.textContent = `Notificación de Meta (${status.recipient_id})`;
          if (chatBubbleText) chatBubbleText.textContent = `✔✔ Mensaje leído por el destinatario (status: ${status.status})`;

          if (pythonCodeView) {
            pythonCodeView.innerHTML = `<span style="color:#64748b;"># Manejo de Status Callback en FastAPI:</span>
<span style="color:#38bdf8;">if</span> <span style="color:#a78bfa;">"statuses"</span> <span style="color:#38bdf8;">in</span> value:
    status_event = value[<span style="color:#a78bfa;">"statuses"</span>][<span style="color:#f59e0b;">0</span>]
    wamid = status_event[<span style="color:#a78bfa;">"id"</span>]
    status_str = status_event[<span style="color:#a78bfa;">"status"</span>]  <span style="color:#64748b;"># 'sent', 'delivered', 'read'</span>
    print(f<span style="color:#22c55e;">"Mensaje {wamid} actualizado a: {status_str}"</span>)
    <span style="color:#38bdf8;">return</span> {<span style="color:#a78bfa;">"status"</span>: <span style="color:#22c55e;">"ok"</span>}`;
          }
        } else if (msg) {
          // Evento de Mensaje Entrante
          const senderPhone = msg.from || "Desconocido";
          const senderProfile = (contact && contact.profile && contact.profile.name) ? contact.profile.name : "Usuario WhatsApp";
          const messageId = msg.id || "N/A";
          const phoneId = (metadata && metadata.phone_number_id) ? metadata.phone_number_id : "N/A";

          if (outEventTypeBadge) {
            outEventTypeBadge.textContent = `Mensaje Entrante: ${msg.type.toUpperCase()}`;
            outEventTypeBadge.style.background = "rgba(5, 150, 105, 0.12)";
            outEventTypeBadge.style.color = "var(--accent-success)";
          }

          if (outSender) outSender.textContent = `+${senderPhone}`;
          if (outSenderName) outSenderName.textContent = senderProfile;
          if (outMsgId) outMsgId.textContent = messageId;
          if (outPhoneId) outPhoneId.textContent = phoneId;

          let bodyText = "";
          let pathText = `messages[0].${msg.type}`;

          if (msg.type === "text" && msg.text) {
            bodyText = msg.text.body;
            pathText = "messages[0].text.body";
          } else if (msg.type === "interactive" && msg.interactive) {
            bodyText = `🔘 [ID: ${msg.interactive.button_reply.id}] ${msg.interactive.button_reply.title}`;
            pathText = "messages[0].interactive.button_reply.title";
          } else if (msg.type === "location" && msg.location) {
            bodyText = `📍 Lat: ${msg.location.latitude}, Long: ${msg.location.longitude} (${msg.location.name || 'Ubicación'})`;
            pathText = "messages[0].location.latitude, longitude";
          } else if (msg.type === "audio" && msg.audio) {
            bodyText = `🎙️ Nota de Voz (Media ID: ${msg.audio.id}) [${msg.audio.mime_type}]`;
            pathText = "messages[0].audio.id";
          } else {
            bodyText = JSON.stringify(msg[msg.type] || msg);
          }

          if (outContentPath) outContentPath.textContent = pathText;
          if (outMsgBody) outMsgBody.textContent = bodyText;

          if (chatUserLabel) chatUserLabel.textContent = `${senderProfile} (+${senderPhone})`;
          if (chatBubbleText) chatBubbleText.textContent = bodyText;

          if (pythonCodeView) {
            pythonCodeView.innerHTML = `<span style="color:#64748b;"># Código FastAPI para extraer este mensaje:</span>
<span style="color:#38bdf8;">def</span> <span style="color:#a78bfa;">extraer_mensaje_whatsapp</span>(payload: dict):
    <span style="color:#38bdf8;">try</span>:
        entry = payload[<span style="color:#a78bfa;">"entry"</span>][<span style="color:#f59e0b;">0</span>][<span style="color:#a78bfa;">"changes"</span>][<span style="color:#f59e0b;">0</span>][<span style="color:#a78bfa;">"value"</span>]
        phone_id = entry[<span style="color:#a78bfa;">"metadata"</span>][<span style="color:#a78bfa;">"phone_number_id"</span>]  <span style="color:#64748b;"># -> "${phoneId}"</span>
        contact_name = entry[<span style="color:#a78bfa;">"contacts"</span>][<span style="color:#f59e0b;">0</span>][<span style="color:#a78bfa;">"profile"</span>][<span style="color:#a78bfa;">"name"</span>]  <span style="color:#64748b;"># -> "${senderProfile}"</span>
        msg = entry[<span style="color:#a78bfa;">"messages"</span>][<span style="color:#f59e0b;">0</span>]
        
        sender_phone = msg[<span style="color:#a78bfa;">"from"</span>]  <span style="color:#64748b;"># -> "${senderPhone}"</span>
        msg_id = msg[<span style="color:#a78bfa;">"id"</span>]        <span style="color:#64748b;"># -> "${messageId.substring(0, 20)}..."</span>
        msg_type = msg[<span style="color:#a78bfa;">"type"</span>]    <span style="color:#64748b;"># -> "${msg.type}"</span>
        
        <span style="color:#38bdf8;">if</span> msg_type == <span style="color:#22c55e;">"text"</span>:
            user_text = msg[<span style="color:#a78bfa;">"text"</span>][<span style="color:#a78bfa;">"body"</span>]
        <span style="color:#38bdf8;">elif</span> msg_type == <span style="color:#22c55e;">"interactive"</span>:
            user_text = msg[<span style="color:#a78bfa;">"interactive"</span>][<span style="color:#a78bfa;">"button_reply"</span>][<span style="color:#a78bfa;">"title"</span>]
        
        <span style="color:#38bdf8;">return</span> {<span style="color:#a78bfa;">"sender"</span>: sender_phone, <span style="color:#a78bfa;">"name"</span>: contact_name, <span style="color:#a78bfa;">"text"</span>: user_text, <span style="color:#a78bfa;">"phone_id"</span>: phone_id}
    <span style="color:#38bdf8;">except</span> (KeyError, IndexError) <span style="color:#38bdf8;">as</span> e:
        <span style="color:#38bdf8;">return</span> <span style="color:#a78bfa;">None</span>`;
          }
        } else {
          throw new Error("El JSON recibido no contiene la estructura esperada de 'messages' ni 'statuses'.");
        }

        if (parseStatus) {
          parseStatus.textContent = "✔ Payload desempaquetado y mapeado exitosamente a variables limpias.";
          parseStatus.style.color = "var(--accent-success)";
        }
        if (window.SOUND) window.SOUND.playPop(520);
      } catch (err) {
        if (parseStatus) {
          parseStatus.textContent = "❌ Error al parsear JSON: " + err.message;
          parseStatus.style.color = "#ef4444";
        }
      }
    }

    if (btnParse) btnParse.addEventListener("click", parsePayload);

    if (presetSelect && rawInput) {
      presetSelect.addEventListener("change", function(){
        const selected = presetSelect.value;
        if (samplePayloads[selected]) {
          rawInput.value = JSON.stringify(samplePayloads[selected], null, 2);
          parsePayload();
        }
      });
      // Inicializar con text
      rawInput.value = JSON.stringify(samplePayloads.text, null, 2);
      parsePayload();
    }
  }

  /* ==========================================================================
     3. BANCO 2.1.3: SIMULADOR DE FLUJO BIDIRECCIONAL COMPLETO (PING-PONG)
     ========================================================================== */
  function initBidirectionalSimulator() {
    const userMsgInput = document.getElementById("flow-user-msg");
    const modeSelect = document.getElementById("flow-agent-mode");
    const btnSend = document.getElementById("flow-btn-send");
    const chatContainer = document.getElementById("flow-chat-history");
    const stepCards = document.querySelectorAll(".flow-step-tracker");
    const logConsole = document.getElementById("flow-console-log");
    const metricsLatency = document.getElementById("flow-metric-latency");
    const metricsTokens = document.getElementById("flow-metric-tokens");

    if (!btnSend || !chatContainer) return;

    let isProcessing = false;

    btnSend.addEventListener("click", function(){
      if (isProcessing) return;
      const text = userMsgInput ? userMsgInput.value.trim() : "";
      if (!text) return;

      isProcessing = true;
      btnSend.disabled = true;
      const startTime = performance.now();

      // 1. Render mensaje de usuario en UI chat
      appendMessage("user", text);
      if (userMsgInput) userMsgInput.value = "";
      if (window.SOUND) window.SOUND.playPop(480);

      // Reset steps
      stepCards.forEach(s => s.classList.remove("active", "completed"));
      if (logConsole) logConsole.innerHTML = "";

      // Paso 1: WhatsApp emite Webhook
      setStepActive(0);
      appendLog("1. [META CLOUD API] Usuario envió mensaje. Generando webhook HTTP POST a tu backend...", "#38bdf8");

      setTimeout(() => {
        setStepCompleted(0);
        // Paso 2: Backend recibe y valida
        setStepActive(1);
        appendLog("2. [FASTAPI BACKEND] Webhook recibido. Validando firma HMAC SHA-256 y extrayendo 'from' y 'text.body'...", "#22c55e");

        setTimeout(() => {
          setStepCompleted(1);
          // Paso 3: Lógica del Agente / Llama 3
          setStepActive(2);
          const mode = modeSelect ? modeSelect.value : "mock";
          let replyText = "";
          let tokensCount = 0;

          if (mode === "mock") {
            appendLog("3. [RESPUESTA FIJA / ECHO] Modo de validación de pipeline activo. Retornando respuesta estática...", "#f59e0b");
            replyText = `[Echo de prueba] Hemos recibido tu solicitud sobre: "${text}". El puente bidireccional funciona correctamente.`;
            tokensCount = 0;
          } else {
            appendLog("3. [META LLAMA 3 INFERENCE] Prompting con contexto de pedido #45210. Temperatura T=0.2...", "#a855f7");
            if (text.toLowerCase().includes("pedido") || text.toLowerCase().includes("estatus")) {
              replyText = `¡Hola Jesús! Con gusto te informo que tu pedido #45210 fue despachado hoy a las 09:30 AM con DHL Express (Guía: 984729104). Se encuentra en ruta y la entrega estimada es mañana antes de las 14:00 hrs. 📦🚚`;
            } else if (text.toLowerCase().includes("precio") || text.toLowerCase().includes("costo")) {
              replyText = `El costo del servicio de auditoría de agentes con Meta Llama 3 es de $450 USD e incluye infraestructura en servidor y configuración de Llama Guard.`;
            } else {
              replyText = `¡Hola! Soy tu asistente inteligente con Meta Llama 3. He recibido tu mensaje: "${text}". ¿Deseas consultar el estado de tu pedido, agendar una cita o comunicarte con un asesor?`;
            }
            tokensCount = Math.round(replyText.length / 3.8);
          }

          setTimeout(() => {
            setStepCompleted(2);
            // Paso 4: Llamada de retorno a WhatsApp Cloud API
            setStepActive(3);
            appendLog("4. [POST /v20.0/PHONE_ID/messages] Enviando payload JSON con Bearer Token de Meta...", "#38bdf8");

            setTimeout(() => {
              setStepCompleted(3);
              const endTime = performance.now();
              const latencyMs = Math.round(endTime - startTime);

              // Render respuesta de WhatsApp
              appendMessage("bot", replyText);
              appendLog(`5. [ENTREGADO] Mensaje entregado en WhatsApp. Latencia Total E2E: ${latencyMs} ms.`, "#22c55e");
              if (window.SOUND) window.SOUND.playChime();

              if (metricsLatency) metricsLatency.textContent = latencyMs + " ms";
              if (metricsTokens) metricsTokens.textContent = tokensCount > 0 ? tokensCount + " tokens" : "N/A (Fijo)";

              isProcessing = false;
              btnSend.disabled = false;
            }, 600);
          }, 800);
        }, 500);
      }, 400);
    });

    function setStepActive(idx) {
      if (stepCards[idx]) {
        stepCards[idx].classList.add("active");
        stepCards[idx].classList.remove("completed");
      }
    }

    function setStepCompleted(idx) {
      if (stepCards[idx]) {
        stepCards[idx].classList.remove("active");
        stepCards[idx].classList.add("completed");
      }
    }

    function appendMessage(sender, msg) {
      const msgDiv = document.createElement("div");
      msgDiv.className = sender === "user" ? "chat-bubble user-bubble" : "chat-bubble bot-bubble";
      const timeStr = new Date().toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' });
      msgDiv.innerHTML = `<div class="bubble-text">${escapeHtml(msg)}</div><div class="bubble-time">${timeStr} · ${sender === "user" ? "✓✓" : "Meta AI"}</div>`;
      chatContainer.appendChild(msgDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function appendLog(line, color) {
      if (!logConsole) return;
      const span = document.createElement("div");
      span.style.color = color || "#cbd5e1";
      span.style.fontFamily = "var(--font-mono, monospace)";
      span.style.fontSize = "0.78rem";
      span.style.marginBottom = "0.25rem";
      span.textContent = line;
      logConsole.appendChild(span);
      logConsole.scrollTop = logConsole.scrollHeight;
    }
  }

  /* ==========================================================================
     4. BANCO 2.1.4: GENERADOR DE CÓDIGO & DISPATCHER DE LA WHATSAPP CLOUD API
     ========================================================================== */
  function initApiDispatcher() {
    const phoneIdInput = document.getElementById("api-phone-id");
    const recipientInput = document.getElementById("api-recipient");
    const tokenInput = document.getElementById("api-token");
    const messageInput = document.getElementById("api-message");
    const codeDisplay = document.getElementById("api-code-output");
    const tabBtns = document.querySelectorAll(".api-tab-btn");

    if (!codeDisplay) return;

    let activeLang = "python";

    function updateCode() {
      const phoneId = escapeHtml(phoneIdInput ? phoneIdInput.value.trim() : "109823746592831");
      const to = escapeHtml(recipientInput ? recipientInput.value.trim() : "5215587654321");
      const token = escapeHtml(tokenInput ? tokenInput.value.trim() : "EAAG...TU_TOKEN_DE_ACCESO");
      const body = escapeHtml(messageInput ? messageInput.value.trim() : "¡Hola desde Meta Llama 3!");

      let html = "";
      if (activeLang === "python") {
        html = `<span class="code-keyword">import</span> httpx
<span class="code-keyword">import</span> asyncio

<span class="code-keyword">async def</span> <span class="code-function">send_whatsapp_message</span>(to_number: <span class="code-type">str</span>, text_content: <span class="code-type">str</span>):
    url = <span class="code-string">f"https://graph.facebook.com/v20.0/${phoneId}/messages"</span>
    headers = {
        <span class="code-string">"Authorization"</span>: <span class="code-string">"Bearer ${token}"</span>,
        <span class="code-string">"Content-Type"</span>: <span class="code-string">"application/json"</span>
    }
    payload = {
        <span class="code-string">"messaging_product"</span>: <span class="code-string">"whatsapp"</span>,
        <span class="code-string">"recipient_type"</span>: <span class="code-string">"individual"</span>,
        <span class="code-string">"to"</span>: <span class="code-string">"${to}"</span>,
        <span class="code-string">"type"</span>: <span class="code-string">"text"</span>,
        <span class="code-string">"text"</span>: {
            <span class="code-string">"preview_url"</span>: <span class="code-bool">False</span>,
            <span class="code-string">"body"</span>: <span class="code-string">"""${body}"""</span>
        }
    }
    
    <span class="code-keyword">async with</span> httpx.AsyncClient(timeout=<span class="code-number">10.0</span>) <span class="code-keyword">as</span> client:
        response = <span class="code-keyword">await</span> client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        <span class="code-keyword">return</span> response.json()

<span class="code-comment"># Ejecución asíncrona en FastAPI:</span>
<span class="code-comment"># resultado = asyncio.run(send_whatsapp_message("${to}", "${body}"))</span>`;
      } else if (activeLang === "curl") {
        html = `<span class="code-function">curl</span> -X POST <span class="code-string">"https://graph.facebook.com/v20.0/${phoneId}/messages"</span> \\
  -H <span class="code-string">"Authorization: Bearer ${token}"</span> \\
  -H <span class="code-string">"Content-Type: application/json"</span> \\
  -d <span class="code-string">'{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "${to}",
    "type": "text",
    "text": {
      "preview_url": false,
      "body": "${body}"
    }
  }'</span>`;
      } else if (activeLang === "fastapi") {
        html = `<span class="code-keyword">from</span> fastapi <span class="code-keyword">import</span> <span class="code-type">FastAPI</span>, <span class="code-type">Request</span>, <span class="code-type">HTTPException</span>, <span class="code-type">BackgroundTasks</span>
<span class="code-keyword">import</span> httpx

app = <span class="code-type">FastAPI</span>(title=<span class="code-string">"WhatsApp Agent Microservice"</span>)

WHATSAPP_TOKEN = <span class="code-string">"${token}"</span>
PHONE_NUMBER_ID = <span class="code-string">"${phoneId}"</span>

<span class="code-decorator">@app.post</span>(<span class="code-string">"/webhook"</span>)
<span class="code-keyword">async def</span> <span class="code-function">receive_webhook</span>(request: <span class="code-type">Request</span>, background_tasks: <span class="code-type">BackgroundTasks</span>):
    data = <span class="code-keyword">await</span> request.json()
    <span class="code-keyword">try</span>:
        msg = data[<span class="code-string">"entry"</span>][<span class="code-number">0</span>][<span class="code-string">"changes"</span>][<span class="code-number">0</span>][<span class="code-string">"value"</span>][<span class="code-string">"messages"</span>][<span class="code-number">0</span>]
        sender_phone = msg[<span class="code-string">"from"</span>]
        incoming_text = msg[<span class="code-string">"text"</span>][<span class="code-string">"body"</span>]
        
        <span class="code-comment"># Procesar con Llama 3 en segundo plano (para responder a Meta en &lt; 3 seg)</span>
        background_tasks.add_task(process_with_llama_and_reply, sender_phone, incoming_text)
        <span class="code-keyword">return</span> {<span class="code-string">"status"</span>: <span class="code-string">"received"</span>}
    <span class="code-keyword">except</span> (KeyError, IndexError):
        <span class="code-keyword">return</span> {<span class="code-string">"status"</span>: <span class="code-string">"event_ignored"</span>}

<span class="code-keyword">async def</span> <span class="code-function">process_with_llama_and_reply</span>(sender: <span class="code-type">str</span>, text: <span class="code-type">str</span>):
    <span class="code-comment"># 1. Inferencia con Llama 3</span>
    reply_text = <span class="code-string">f"Procesado con Llama 3: {text}"</span>
    
    <span class="code-comment"># 2. Despachar a WhatsApp Cloud API</span>
    url = <span class="code-string">f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"</span>
    headers = {<span class="code-string">"Authorization"</span>: <span class="code-string">f"Bearer {WHATSAPP_TOKEN}"</span>}
    payload = {
        <span class="code-string">"messaging_product"</span>: <span class="code-string">"whatsapp"</span>,
        <span class="code-string">"to"</span>: sender,
        <span class="code-string">"type"</span>: <span class="code-string">"text"</span>,
        <span class="code-string">"text"</span>: {<span class="code-string">"body"</span>: reply_text}
    }
    <span class="code-keyword">async with</span> httpx.AsyncClient() <span class="code-keyword">as</span> client:
        <span class="code-keyword">await</span> client.post(url, json=payload, headers=headers)`;
      }

      codeDisplay.innerHTML = html;
    }

    [phoneIdInput, recipientInput, tokenInput, messageInput].forEach(el => {
      if (el) {
        el.addEventListener("input", updateCode);
        el.addEventListener("change", updateCode);
      }
    });

    tabBtns.forEach(btn => {
      btn.addEventListener("click", function(){
        if (window.SOUND) window.SOUND.playPop(380);
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLang = btn.getAttribute("data-lang");
        updateCode();
      });
    });

    updateCode();
  }

  /* ==========================================================================
     5. BANCO 2.1.5: VALIDADOR CRIPTOGRÁFICO DE FIRMA HMAC SHA-256
     ========================================================================== */
  function initHmacVerifier() {
    const payloadInput = document.getElementById("hmac-payload");
    const secretInput = document.getElementById("hmac-secret");
    const signatureInput = document.getElementById("hmac-signature");
    const btnCalc = document.getElementById("hmac-btn-calc");
    const btnVerify = document.getElementById("hmac-btn-verify");
    const outputConsole = document.getElementById("hmac-console");

    if (!btnCalc || !outputConsole) return;

    // Implementación de SHA-256 HMAC para demo didáctica en frontend
    async function computeHmacHex(key, message) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const msgData = encoder.encode(message);
      
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      );
      const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData);
      const hashArray = Array.from(new Uint8Array(signature));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    btnCalc.addEventListener("click", async function(){
      try {
        const payload = payloadInput ? payloadInput.value : "";
        const secret = secretInput ? secretInput.value : "";
        const hash = await computeHmacHex(secret, payload);
        if (signatureInput) signatureInput.value = "sha256=" + hash;
        
        outputConsole.innerHTML = `<span style="color:#22c55e;">[ÉXITO] Firma generada correctamente usando Web Crypto API:</span>\n` +
          `<span style="color:#38bdf8;">X-Hub-Signature-256:</span> sha256=${hash}\n\n` +
          `<span style="color:#64748b;">// En Python (FastAPI):</span>\n` +
          `expected_hash = hmac.new(APP_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()`;
        if (window.SOUND) window.SOUND.playChime();
      } catch(e) {
        outputConsole.innerHTML = `<span style="color:#ef4444;">Error al calcular HMAC: ${e.message}</span>`;
      }
    });

    if (btnVerify) {
      btnVerify.addEventListener("click", async function(){
        try {
          const payload = payloadInput ? payloadInput.value : "";
          const secret = secretInput ? secretInput.value : "";
          const sig = signatureInput ? signatureInput.value.trim() : "";
          const calculated = "sha256=" + (await computeHmacHex(secret, payload));

          let log = "";
          log += `<span style="color:#64748b;">// Validando cabecera de seguridad:</span>\n`;
          log += `Recibida:   <span style="color:#38bdf8;">${sig}</span>\n`;
          log += `Calculada:  <span style="color:#38bdf8;">${calculated}</span>\n\n`;

          if (sig === calculated) {
            log += `<span style="color:#22c55e; font-weight:700;">✓ FIRMA VÁLIDA (HTTP 200 OK): El mensaje proviene legítimamente de Meta.</span>`;
            if (window.SOUND) window.SOUND.playChime();
          } else {
            log += `<span style="color:#ef4444; font-weight:700;">✗ FIRMA INVÁLIDA (HTTP 401 Unauthorized): Posible ataque de suplantación o clave secreta incorrecta.</span>`;
            if (window.SOUND) window.SOUND.playPop(220);
          }
          outputConsole.innerHTML = log;
        } catch(e) {
          outputConsole.innerHTML = `<span style="color:#ef4444;">Error al verificar: ${e.message}</span>`;
        }
      });
    }
  }

  /* ==========================================================================
     6. MOTOR DE QUIZZES CON CONTADOR, FEEDBACK Y CELEBRACIÓN
     ========================================================================== */
  function initQuizEngine() {
    const quizBoxes = document.querySelectorAll(".quiz-box");
    if (quizBoxes.length === 0) return;

    function updateScore() {
      let correct = 0;
      quizBoxes.forEach(box => {
        if (box.querySelector(".quiz-option.correct")) correct++;
      });
      if (correct >= quizBoxes.length && quizBoxes.length > 0) {
        if (window.celebrateConfetti) window.celebrateConfetti();
      }
    }

    quizBoxes.forEach(box => {
      const options = box.querySelectorAll(".quiz-option");
      const feedback = box.querySelector(".quiz-feedback");

      options.forEach(opt => {
        opt.addEventListener("click", () => {
          const isCorrect = opt.getAttribute("data-correct") === "true";
          options.forEach(o => { o.classList.remove("correct", "incorrect"); });

          if (isCorrect) {
            opt.classList.add("correct");
            if (window.SOUND) window.SOUND.playChime();
            if (feedback) {
              feedback.innerHTML = '<span style="color:#059669; font-weight:700;">¡Respuesta Correcta!</span> Has comprendido con precisión el concepto de arquitectura de la WhatsApp Cloud API.';
              feedback.style.display = "block";
            }
          } else {
            opt.classList.add("incorrect");
            if (window.SOUND) window.SOUND.playPop(220);
            if (feedback) {
              feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">Respuesta Incorrecta.</span> Analiza la justificación técnica y vuelve a intentarlo.';
              feedback.style.display = "block";
            }
          }
          updateScore();
        });
      });
    });
  }

  /* ==========================================================================
     7. CONTROLADOR DE EJERCICIOS PRÁCTICOS (CURSO.MD)
     ========================================================================== */
  function initExerciseToggles() {
    const toggles = document.querySelectorAll(".exercise-solution-toggle");
    toggles.forEach(btn => {
      btn.addEventListener("click", function(){
        const content = btn.nextElementSibling;
        if (!content) return;
        const isHidden = content.style.display === "none" || !content.style.display;
        content.style.display = isHidden ? "block" : "none";
        btn.textContent = isHidden ? "Ocultar Solución Guiada" : "Ver Solución Guiada & Criterios de Evaluación";
        if (window.SOUND) window.SOUND.playPop(340);
      });
    });
  }

  /* ==========================================================================
     8. BUSCADOR Y FILTRADO DEL GLOSARIO TÉCNICO
     ========================================================================== */
  function initGlossaryFilter() {
    const searchInput = document.getElementById("glossary-search-input");
    const filterPills = document.querySelectorAll(".glossary-filter-pill");
    const glossaryItems = document.querySelectorAll(".glossary-row-item");

    if (!searchInput || glossaryItems.length === 0) return;

    let currentCategory = "todos";

    function filterGlossary() {
      const query = searchInput.value.toLowerCase().trim();
      glossaryItems.forEach(item => {
        const termEl = item.querySelector(".glossary-term-name");
        const descEl = item.querySelector(".glossary-term-desc");
        const term = termEl ? termEl.textContent.toLowerCase() : "";
        const desc = descEl ? descEl.textContent.toLowerCase() : "";
        const categoryAttr = item.getAttribute("data-category") || "";

        const matchesQuery = !query || term.includes(query) || desc.includes(query);
        const matchesCategory = currentCategory === "todos" || categoryAttr.includes(currentCategory);

        item.style.display = (matchesQuery && matchesCategory) ? "grid" : "none";
      });
    }

    searchInput.addEventListener("input", filterGlossary);

    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(350);
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentCategory = pill.getAttribute("data-category");
        filterGlossary();
      });
    });
  }

  /* ==========================================================================
     8. SIMULADOR DE PIPELINE DE LAS 5 FASES (LABORATORIO 2.1.5)
     ========================================================================== */
  function initPipelineSimulator() {
    const container = document.getElementById("pipeline-simulator-lab");
    if (!container) return;

    const navBtns = container.querySelectorAll(".pipeline-nav-btn");
    const statusBadge = document.getElementById("pipeline-status-badge");
    const panelName = document.getElementById("pipeline-panel-name");
    const panelMode = document.getElementById("pipeline-panel-mode");
    const explanationBox = document.getElementById("pipeline-explanation-box");
    const userMsgInput = document.getElementById("pipeline-user-msg");
    const btnRun = document.getElementById("pipeline-btn-run");
    const btnPresetEcho = document.getElementById("pipeline-btn-preset-echo");
    const btnPresetLlama = document.getElementById("pipeline-btn-preset-llama");
    const btnClear = document.getElementById("pipeline-btn-clear");
    const consoleLog = document.getElementById("pipeline-console-log");

    let currentPhase = "4";

    const phaseConfig = {
      "1": {
        name: "Fase 1: Meta App & Credenciales WABA",
        mode: "Aprovisionamiento",
        status: "Fase 1: Credenciales en Meta",
        badgeClass: "bench-badge-status status-info",
        explanation: "<strong>Objetivo de esta fase:</strong> Dar de alta la App en Meta for Developers, configurar WhatsApp Cloud API y obtener el PHONE_NUMBER_ID, WABA_ID y Token de acceso.",
        defaultMsg: "cURL POST /messages (hello_world template)"
      },
      "2": {
        name: "Fase 2: Servidor FastAPI Local & ngrok",
        mode: "Túnel Seguro TLS",
        status: "Fase 2: Túnel ngrok Activo",
        badgeClass: "bench-badge-status status-success",
        explanation: "<strong>Objetivo de esta fase:</strong> Exponer tu servidor local (http://localhost:8000) a internet con cifrado HTTPS obligatorio mediante el túnel seguro de ngrok.",
        defaultMsg: "ngrok http 8000 -> https://a3f8-55-12.ngrok-free.app"
      },
      "3": {
        name: "Fase 3: Handshake GET de Verificación",
        mode: "Suscripción Webhook",
        status: "Fase 3: Handshake GET Certificado",
        badgeClass: "bench-badge-status status-info",
        explanation: "<strong>Objetivo de esta fase:</strong> Validar el apretón de manos con Meta. Tu backend compara hub.verify_token y devuelve hub.challenge en texto plano con HTTP 200.",
        defaultMsg: "GET /webhook?hub.mode=subscribe&hub.challenge=1158201444"
      },
      "4": {
        name: "Fase 4: Test de Respuesta Fija (Echo)",
        mode: "Aislamiento de Transporte",
        status: "Fase 4: Modo Echo Activo",
        badgeClass: "bench-badge-status status-warning",
        explanation: "<strong>Objetivo de esta fase:</strong> Certificar el ciclo bidireccional completo respondiendo texto fijo sin IA. Si esto funciona, el cableado de red está 100% garantizado.",
        defaultMsg: "¿Cuál es el estatus de mi pedido #45210?"
      },
      "5": {
        name: "Fase 5: Inyección de Llama 3 con Base de Datos",
        mode: "Inteligencia Generativa",
        status: "Fase 5: Llama 3 Agent en Vivo",
        badgeClass: "bench-badge-status status-success",
        explanation: "<strong>Objetivo de esta fase:</strong> Conectar Llama 3 en segundo plano (BackgroundTasks). El modelo razona, consulta la base de datos de envíos y genera una respuesta personalizada.",
        defaultMsg: "¿Dónde viene mi pedido #45210?"
      }
    };

    function selectPhase(phaseKey) {
      if (window.SOUND) window.SOUND.playPop(380);
      currentPhase = String(phaseKey);
      navBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-phase") === currentPhase);
      });

      const conf = phaseConfig[currentPhase];
      if (conf) {
        if (panelName) panelName.textContent = conf.name;
        if (panelMode) panelMode.textContent = `Modo: ${conf.mode}`;
        if (statusBadge) {
          statusBadge.textContent = conf.status;
          statusBadge.className = conf.badgeClass;
        }
        if (explanationBox) explanationBox.innerHTML = conf.explanation;
        if (userMsgInput && !userMsgInput.value) userMsgInput.value = conf.defaultMsg;
      }
    }

    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        selectPhase(btn.getAttribute("data-phase"));
      });
    });

    if (btnPresetEcho) {
      btnPresetEcho.addEventListener("click", () => {
        if (userMsgInput) userMsgInput.value = "Hola, probando conexión del servidor";
        selectPhase("4");
        runSimulation();
      });
    }

    if (btnPresetLlama) {
      btnPresetLlama.addEventListener("click", () => {
        if (userMsgInput) userMsgInput.value = "¿Cuál es el estatus de mi pedido #45210?";
        selectPhase("5");
        runSimulation();
      });
    }

    if (btnClear && consoleLog) {
      btnClear.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(280);
        consoleLog.innerHTML = `<span style="color:#64748b;">// Consola reiniciada. Selecciona una fase y presiona "Ejecutar Simulación de Fase".</span>`;
      });
    }

    function runSimulation() {
      if (window.SOUND) window.SOUND.playPop(480);
      if (!consoleLog) return;

      const userText = userMsgInput ? userMsgInput.value.trim() : "¿Dónde está mi pedido #45210?";
      let out = "";
      const now = new Date().toLocaleTimeString();

      if (currentPhase === "1") {
        out += `<span style="color:#64748b;">[${now}] === FASE 1: APROVISIONAMIENTO EN META FOR DEVELOPERS ===</span>\n`;
        out += `<span style="color:#38bdf8;">[INIT]</span> Cargando variables desde .env local...\n`;
        out += `<span style="color:#22c55e;">[OK] PHONE_NUMBER_ID: 109823746592831</span>\n`;
        out += `<span style="color:#22c55e;">[OK] WABA_ID: 104928374659281</span>\n`;
        out += `<span style="color:#22c55e;">[OK] META_ACCESS_TOKEN: EAAQZ... (Validado con Graph API)</span>\n\n`;
        out += `<span style="color:#38bdf8;">[HTTP POST]</span> https://graph.facebook.com/v20.0/109823746592831/messages\n`;
        out += `<span style="color:#e2e8f0;">{"messaging_product":"whatsapp","to":"5215587654321","type":"template","template":{"name":"hello_world"}}</span>\n\n`;
        out += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span>\n`;
        out += `<span style="color:#22c55e;">{"messages":[{"id":"wamid.HBgLMjUyMTU1ODc4NDk..."}]}</span>\n`;
        out += `<span style="color:#38bdf8;">✔ FASE 1 CERTIFICADA: Plantilla recibida en WhatsApp Sandbox.</span>`;
      }
      else if (currentPhase === "2") {
        out += `<span style="color:#64748b;">[${now}] === FASE 2: SERVIDOR LOCAL & TÚNEL NGROK ===</span>\n`;
        out += `<span style="color:#38bdf8;">$ uvicorn main:app --port 8000 --reload</span>\n`;
        out += `<span style="color:#22c55e;">INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)</span>\n\n`;
        out += `<span style="color:#38bdf8;">$ ngrok http 8000</span>\n`;
        out += `<span style="color:#e2e8f0;">ngrok by @inconshreve                    (Ctrl+C to quit)\n`;
        out += `Session Status     online\n`;
        out += `Account            Lic. Jesús Olvera (Plan: Free)\n`;
        out += `Version            3.8.0\n`;
        out += `Region             United States (us)\n`;
        out += `Forwarding         https://a3f8-55-12.ngrok-free.app -> http://localhost:8000\n`;
        out += `Web Interface      http://127.0.0.1:4040</span>\n\n`;
        out += `<span style="color:#38bdf8;">✔ FASE 2 CERTIFICADA: Túnel TLS activo y listo para recibir peticiones de Meta.</span>`;
      }
      else if (currentPhase === "3") {
        out += `<span style="color:#64748b;">[${now}] === FASE 3: HANDSHAKE GET DE VERIFICACIÓN ===</span>\n`;
        out += `<span style="color:#38bdf8;">[INCOMING GET]</span> /webhook?hub.mode=subscribe&hub.verify_token=MI_TOKEN_SECRETO_2026&hub.challenge=1158201444\n`;
        out += `<span style="color:#22c55e;">[AUTH] Token coincide con VERIFY_TOKEN del entorno.</span>\n`;
        out += `<span style="color:#22c55e;">[RESP] Devolviendo hub.challenge='1158201444' (Content-Type: text/plain)</span>\n\n`;
        out += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span> (24ms)\n`;
        out += `<span style="color:#38bdf8;">✔ FASE 3 CERTIFICADA: Meta for Developers validó el webhook exitosamente (Checkmark Verde).</span>`;
      }
      else if (currentPhase === "4") {
        out += `<span style="color:#64748b;">[${now}] === FASE 4: VALIDACIÓN CON RESPUESTA FIJA (ECHO TEST) ===</span>\n`;
        out += `<span style="color:#f59e0b;">[WEBHOOK POST]</span> Mensaje entrante de +52 1 55 8765 4321\n`;
        out += `<span style="color:#e2e8f0;">Texto: "${escapeHtml(userText)}" | wamid: wamid.HBgL...</span>\n`;
        out += `<span style="color:#22c55e;">[FASTAPI] Retornando HTTP 200 OK a Meta en 38ms (Timeout Evitado)</span>\n\n`;
        out += `<span style="color:#f59e0b;">[DISPATCH ECHO]</span> Enviando respuesta estática a Graph API...\n`;
        out += `<span style="color:#e2e8f0;">Mensaje: " Echo Servidor: Hemos recibido tu consulta '${escapeHtml(userText)}' correctamente."</span>\n`;
        out += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span> (Meta Graph API)\n`;
        out += `<span style="color:#38bdf8;">✔ FASE 4 CERTIFICADA: Cableado 100% probado. Si falla después, el error es del LLM, no de red.</span>`;
      }
      else if (currentPhase === "5") {
        const orderMatch = userText.match(/#?(\d{5})/);
        const orderId = orderMatch ? orderMatch[1] : "45210";

        out += `<span style="color:#64748b;">[${now}] === FASE 5: INYECCIÓN DE LLAMA 3 + BASE DE DATOS E-COMMERCE ===</span>\n`;
        out += `<span style="color:#ec4899;">[WEBHOOK POST]</span> Mensaje de +52 1 55 8765 4321\n`;
        out += `<span style="color:#e2e8f0;">Texto: "${escapeHtml(userText)}"</span>\n`;
        out += `<span style="color:#22c55e;">[FASTAPI] HTTP 200 OK enviado a Meta en 32ms. Delegando a BackgroundTasks...</span>\n\n`;
        out += `<span style="color:#38bdf8;">[DATABASE]</span> Consultando pedido #${orderId} en base de datos PostgreSQL...\n`;
        out += `<span style="color:#e2e8f0;">DB Result: {"id":"${orderId}","estado":"En reparto","paqueteria":"DHL Express","guia":"DHL-9921","hora_estimada":"16:30 hrs"}</span>\n\n`;
        out += `<span style="color:#ec4899;">[LLAMA 3 INFERENCE]</span> Modelo: Meta-Llama-3.3-70B-Instruct (Prompt inyectado con datos reales)\n`;
        out += `<span style="color:#e2e8f0;">Respuesta generada (210ms):</span>\n`;
        out += `<span style="color:#a78bfa; font-weight:700;">"¡Hola Lic. Jesús!  Tu pedido #${orderId} va en camino con DHL Express (Guía: DHL-9921). La entrega estimada es hoy a las 4:30 PM. ¿Deseas que te enviemos una notificación en cuanto el repartidor esté a 5 minutos de tu domicilio?"</span>\n\n`;
        out += `<span style="color:#38bdf8;">[GRAPH API DISPATCH]</span> POST https://graph.facebook.com/v20.0/109823746592831/messages\n`;
        out += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span> (Entregado al chat de WhatsApp en 420ms totales)\n`;
        out += `<span style="color:#22c55e;">✔ FASE 5 CERTIFICADA: Agente de IA Llama 3 operando en producción con arquitectura sólida.</span>`;
      }

      consoleLog.innerHTML = out;
      if (window.SOUND) window.SOUND.playChime();
    }

    if (btnRun) {
      btnRun.addEventListener("click", runSimulation);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

})();

