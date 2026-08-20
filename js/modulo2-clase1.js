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
    initQuizEngine();
    initExerciseToggles();
    initGlossaryFilter();
  });

  /* ==========================================================================
     1. BANCO 2.1.1: SIMULADOR DE HANDSHAKE DE VERIFICACIÓN (GET /webhook)
     ========================================================================== */
  function initHandshakeSimulator() {
    const modeInput = document.getElementById("hs-mode");
    const tokenInput = document.getElementById("hs-token");
    const challengeInput = document.getElementById("hs-challenge");
    const serverTokenInput = document.getElementById("hs-server-token");
    const btnTest = document.getElementById("hs-btn-test");
    const btnPresetSuccess = document.getElementById("hs-preset-success");
    const btnPresetFail = document.getElementById("hs-preset-fail");
    const outputConsole = document.getElementById("hs-console");
    const statusPill = document.getElementById("hs-status-pill");

    if (!btnTest || !outputConsole) return;

    function runVerification() {
      if (window.SOUND) window.SOUND.playPop(420);
      const mode = modeInput ? modeInput.value.trim() : "subscribe";
      const token = tokenInput ? tokenInput.value.trim() : "";
      const challenge = challengeInput ? challengeInput.value.trim() : "1158201444";
      const serverToken = serverTokenInput ? serverTokenInput.value.trim() : "MI_TOKEN_SECRETO_2026";

      let log = "";
      log += `<span style="color:#64748b;">// 1. Solicitud entrante desde servidores de Meta (Facebook Graph API)</span>\n`;
      log += `<span style="color:#38bdf8;">GET</span> /webhook?hub.mode=${encodeURIComponent(mode)}&hub.verify_token=${encodeURIComponent(token)}&hub.challenge=${encodeURIComponent(challenge)} HTTP/1.1\n`;
      log += `<span style="color:#64748b;">Host:</span> api.mi-empresa.com\n`;
      log += `<span style="color:#64748b;">User-Agent:</span> FacebookPlatform/1.0 (+http://developers.facebook.com)\n\n`;

      log += `<span style="color:#64748b;">// 2. Procesamiento en backend FastAPI</span>\n`;
      if (mode === "subscribe" && token === serverToken) {
        log += `<span style="color:#22c55e;">[OK] Modo verificado: '${mode}' === 'subscribe'</span>\n`;
        log += `<span style="color:#22c55e;">[OK] Token verificado: '${token}' === server_secret_token</span>\n`;
        log += `<span style="color:#22c55e;">[OK] Retornando hub.challenge como texto plano: '${challenge}'</span>\n\n`;
        log += `<span style="color:#22c55e; font-weight:700;">HTTP/1.1 200 OK</span>\n`;
        log += `Content-Type: text/plain; charset=utf-8\n`;
        log += `Content-Length: ${challenge.length}\n\n`;
        log += `<span style="color:#38bdf8; font-weight:700;">${challenge}</span>`;

        if (statusPill) {
          statusPill.textContent = "200 OK · Webhook Verificado";
          statusPill.className = "bench-badge-status status-success";
        }
        if (window.SOUND) window.SOUND.playChime();
      } else {
        log += `<span style="color:#ef4444;">[FAIL] Fallo en la autenticación del handshake:</span>\n`;
        if (mode !== "subscribe") log += `<span style="color:#ef4444;">  - hub.mode inválido: esperado 'subscribe', recibido '${mode}'</span>\n`;
        if (token !== serverToken) log += `<span style="color:#ef4444;">  - hub.verify_token incorrecto: recibido '${token}', esperado '${serverToken}'</span>\n`;
        log += `\n<span style="color:#ef4444; font-weight:700;">HTTP/1.1 403 Forbidden</span>\n`;
        log += `Content-Type: application/json\n\n`;
        log += `<span style="color:#f87171;">{"error": "Verification token mismatch or invalid mode"}</span>`;

        if (statusPill) {
          statusPill.textContent = "403 Forbidden · Rechazado";
          statusPill.className = "bench-badge-status status-error";
        }
      }

      outputConsole.innerHTML = log;
    }

    btnTest.addEventListener("click", runVerification);

    if (btnPresetSuccess) {
      btnPresetSuccess.addEventListener("click", function(){
        if (modeInput) modeInput.value = "subscribe";
        if (tokenInput) tokenInput.value = "MI_TOKEN_SECRETO_2026";
        if (challengeInput) challengeInput.value = "1158201444";
        if (serverTokenInput) serverTokenInput.value = "MI_TOKEN_SECRETO_2026";
        runVerification();
      });
    }

    if (btnPresetFail) {
      btnPresetFail.addEventListener("click", function(){
        if (modeInput) modeInput.value = "subscribe";
        if (tokenInput) tokenInput.value = "TOKEN_EQUIVOCADO_XYZ";
        if (challengeInput) challengeInput.value = "1158201444";
        if (serverTokenInput) serverTokenInput.value = "MI_TOKEN_SECRETO_2026";
        runVerification();
      });
    }
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
    const outMsgType = document.getElementById("out-msg-type");
    const outMsgBody = document.getElementById("out-msg-body");
    const outPhoneId = document.getElementById("out-phone-id");
    const outTimestamp = document.getElementById("out-timestamp");
    const parseStatus = document.getElementById("json-parse-status");

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
                "location": { "latitude": 19.432608, "longitude": -99.133209, "name": "Centro Histórico CDMX" },
                "type": "location"
              }]
            },
            "field": "messages"
          }]
        }]
      },
      button_reply: {
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
                "id": "wamid.HBgNNTIxNTU5OTg4Nzc2NgUCABEYEjNDNDU2Nzg5MDEyMzQ1Njc4OQA=",
                "timestamp": "1724089500",
                "interactive": {
                  "type": "button_reply",
                  "button_reply": { "id": "btn_reagendar_cita", "title": "Reagendar Cita" }
                },
                "type": "interactive"
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

        if (!msg) {
          throw new Error("No se encontró el objeto 'messages[0]' en el payload recibido.");
        }

        if (outSender) outSender.textContent = msg.from || "Desconocido";
        if (outSenderName) outSenderName.textContent = (contact && contact.profile && contact.profile.name) ? contact.profile.name : "Sin perfil";
        if (outMsgId) outMsgId.textContent = msg.id || "N/A";
        if (outMsgType) outMsgType.textContent = msg.type || "text";
        
        let bodyText = "";
        if (msg.type === "text" && msg.text) {
          bodyText = msg.text.body;
        } else if (msg.type === "location" && msg.location) {
          bodyText = `📍 Lat: ${msg.location.latitude}, Long: ${msg.location.longitude} (${msg.location.name || 'Sin nombre'})`;
        } else if (msg.type === "interactive" && msg.interactive) {
          bodyText = `🔘 Botón: [${msg.interactive.button_reply.id}] "${msg.interactive.button_reply.title}"`;
        } else {
          bodyText = JSON.stringify(msg[msg.type] || msg);
        }
        if (outMsgBody) outMsgBody.textContent = bodyText;

        if (outPhoneId) outPhoneId.textContent = (metadata && metadata.phone_number_id) ? metadata.phone_number_id : "N/A";
        if (outTimestamp) {
          const date = new Date(parseInt(msg.timestamp) * 1000);
          outTimestamp.textContent = isNaN(date.getTime()) ? msg.timestamp : date.toLocaleString("es-MX");
        }

        if (parseStatus) {
          parseStatus.textContent = "Payload Válido (Estructura Meta WhatsApp Oficial)";
          parseStatus.style.color = "var(--accent-success)";
        }
        if (window.SOUND) window.SOUND.playPop(520);
      } catch (err) {
        if (parseStatus) {
          parseStatus.textContent = "Error al parsear JSON: " + err.message;
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
      const phoneId = phoneIdInput ? phoneIdInput.value.trim() : "109823746592831";
      const to = recipientInput ? recipientInput.value.trim() : "5215587654321";
      const token = tokenInput ? tokenInput.value.trim() : "EAAG...TU_TOKEN_DE_ACCESO";
      const body = messageInput ? messageInput.value.trim() : "¡Hola desde Meta Llama 3!";

      let code = "";
      if (activeLang === "python") {
        code = `import httpx
import asyncio

async def send_whatsapp_message(to_number: str, text_content: str):
    url = "https://graph.facebook.com/v20.0/${phoneId}/messages"
    headers = {
        "Authorization": "Bearer ${token}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "${to}",
        "type": "text",
        "text": {
            "preview_url": False,
            "body": """${body}"""
        }
    }
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()

# Ejecución asíncrona en FastAPI
# resultado = asyncio.run(send_whatsapp_message("${to}", "${body}"))`;
      } else if (activeLang === "curl") {
        code = `curl -X POST "https://graph.facebook.com/v20.0/${phoneId}/messages" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "${to}",
    "type": "text",
    "text": {
      "preview_url": false,
      "body": "${body.replace(/"/g, '\\"')}"
    }
  }'`;
      } else if (activeLang === "fastapi") {
        code = `from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
import httpx

app = FastAPI(title="WhatsApp Agent Microservice")

WHATSAPP_TOKEN = "${token}"
PHONE_NUMBER_ID = "${phoneId}"

@app.post("/webhook")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    data = await request.json()
    try:
        msg = data["entry"][0]["changes"][0]["value"]["messages"][0]
        sender_phone = msg["from"]
        incoming_text = msg["text"]["body"]
        
        # Procesar con Llama 3 en segundo plano (para no bloquear el webhook < 3s)
        background_tasks.add_task(process_with_llama_and_reply, sender_phone, incoming_text)
        return {"status": "received"}
    except (KeyError, IndexError):
        return {"status": "event_ignored"}

async def process_with_llama_and_reply(sender: str, text: str):
    # 1. Inferencia con Llama 3
    reply_text = f"Procesado con Llama 3: {text}"
    
    # 2. Despachar a WhatsApp
    url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}"}
    payload = {
        "messaging_product": "whatsapp",
        "to": sender,
        "type": "text",
        "text": {"body": reply_text}
    }
    async with httpx.AsyncClient() as client:
        await client.post(url, json=payload, headers=headers)`;
      }

      codeDisplay.textContent = code;
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

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

})();
