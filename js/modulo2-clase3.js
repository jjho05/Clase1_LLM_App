/**
 * Meta AI - Módulo 2 · Tema 3: Integración Llama + WhatsApp: Function Calling Engine
 * Interactive Simulators:
 * 1. Visual Function Calling Flow Simulator (Two-Pass Inference Engine)
 * 2. Interactive JSON Tool Schema Designer & Validator
 * 3. End-to-End Latency Waterfall Calculator
 * 4. Webhook Idempotency & Deduplication Engine (wamid filter)
 * 5. Resilient Error Handling & Fallback Playground
 * 6. Interactive Quiz Engine & Exercises
 * 7. Searchable Technical Glossary
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initFunctionCallingSimulator();
    initToolSchemaDesigner();
    initLatencyCalculator();
    initIdempotencySimulator();
    initFallbackPlayground();
    initQuizEngine();
    initExerciseToggles();
    initGlossaryFilter();
  });

  /* ==========================================================================
     1. BANCO 2.3.1: SIMULADOR DE FUNCTION CALLING (CICLO DE DOS PASOS)
     ========================================================================== */
  function initFunctionCallingSimulator() {
    const userMsgInput = document.getElementById("fc-user-input");
    const btnExecute = document.getElementById("fc-btn-execute");
    const stepCards = [
      document.getElementById("fc-step-1"),
      document.getElementById("fc-step-2"),
      document.getElementById("fc-step-3"),
      document.getElementById("fc-step-4")
    ];
    const logConsole = document.getElementById("fc-console-log");
    const finalWhatsAppBubble = document.getElementById("fc-final-reply");
    const presetPills = document.querySelectorAll(".fc-preset-pill");

    if (!btnExecute || !logConsole) return;

    function runToolExecution() {
      const text = userMsgInput ? userMsgInput.value.trim() : "";
      if (!text) return;

      btnExecute.disabled = true;
      stepCards.forEach(c => { if(c) c.className = "flow-step-tracker"; });
      logConsole.textContent = "// Iniciando ciclo de Function Calling con Meta Llama 3.1 8B...\n";

      // Paso 1: Recepción Webhook
      if (stepCards[0]) stepCards[0].className = "flow-step-tracker active";
      logConsole.textContent += `[Paso 1 - Webhook Entrante]\nRecibido mensaje de WhatsApp: "${text}"\n`;
      if (window.SOUND) window.SOUND.playPop(420);

      setTimeout(() => {
        if (stepCards[0]) stepCards[0].className = "flow-step-tracker completed";
        if (stepCards[1]) stepCards[1].className = "flow-step-tracker active";

        // Parseo de entidades e intención
        let toolCall = {
          name: "consultar_disponibilidad_restaurante",
          arguments: { personas: 4, fecha: "2026-08-22", hora: "20:00", zona: "Terraza" }
        };

        if (text.toLowerCase().includes("2") || text.toLowerCase().includes("dos")) toolCall.arguments.personas = 2;
        if (text.toLowerCase().includes("8") || text.toLowerCase().includes("ocho")) toolCall.arguments.personas = 8;
        if (text.toLowerCase().includes("9") || text.toLowerCase().includes("21:00")) toolCall.arguments.hora = "21:00";

        logConsole.textContent += `\n[Paso 2 - Inferencia Llama 3 (Tool Request)]\nEl modelo detectó intención de reserva. Generó Tool Call JSON:\n${JSON.stringify(toolCall, null, 2)}\n`;
        if (window.SOUND) window.SOUND.playPop(480);

        setTimeout(() => {
          if (stepCards[1]) stepCards[1].className = "flow-step-tracker completed";
          if (stepCards[2]) stepCards[2].className = "flow-step-tracker active";

          // Simulación de Base de Datos
          const dbResult = {
            status: "SUCCESS",
            disponible: true,
            mesas_libres: 2,
            zona_confirmada: toolCall.arguments.zona,
            id_bloqueo_temporal: "RES-99482"
          };

          logConsole.textContent += `\n[Paso 3 - Ejecución de Backend / Base de Datos]\nLlamada a execute_function("${toolCall.name}")\nRetorno de DB: ${JSON.stringify(dbResult, null, 2)}\n`;
          if (window.SOUND) window.SOUND.playPop(540);

          setTimeout(() => {
            if (stepCards[2]) stepCards[2].className = "flow-step-tracker completed";
            if (stepCards[3]) stepCards[3].className = "flow-step-tracker completed";

            const finalReply = `¡Excelente noticia! Tenemos mesa disponible en ${toolCall.arguments.zona} para ${toolCall.arguments.personas} personas este ${toolCall.arguments.fecha} a las ${toolCall.arguments.hora}. He creado el bloqueo temporal #RES-99482. ¿Deseas que confirme la reserva a tu nombre?`;

            logConsole.textContent += `\n[Paso 4 - Inferencia Final y Despacho WhatsApp]\nLlama 3 sintetizó la respuesta final:\n"${finalReply}"\n\nDespachado a Meta Graph API (HTTP 200 OK en 1.84s)`;
            
            if (finalWhatsAppBubble) {
              finalWhatsAppBubble.textContent = finalReply;
            }

            btnExecute.disabled = false;
            if (window.SOUND) window.SOUND.playChime();
          }, 600);

        }, 600);

      }, 500);
    }

    btnExecute.addEventListener("click", runToolExecution);

    presetPills.forEach(pill => {
      pill.addEventListener("click", function(){
        if (userMsgInput) userMsgInput.value = pill.getAttribute("data-text");
        runToolExecution();
      });
    });
  }

  /* ==========================================================================
     2. BANCO 2.3.2: DISEÑADOR & VALIDADOR DE ESQUEMA JSON SCHEMA
     ========================================================================== */
  function initToolSchemaDesigner() {
    const fnNameInput = document.getElementById("schema-fn-name");
    const fnDescInput = document.getElementById("schema-fn-desc");
    const paramNameInput = document.getElementById("schema-param-name");
    const paramTypeSelect = document.getElementById("schema-param-type");
    const paramRequiredCb = document.getElementById("schema-param-required");
    const codeDisplay = document.getElementById("schema-code-output");

    if (!codeDisplay) return;

    function renderSchema() {
      const name = fnNameInput ? fnNameInput.value.trim() || "consultar_estatus_pedido" : "consultar_estatus_pedido";
      const desc = fnDescInput ? fnDescInput.value.trim() || "Consulta el estatus de un envío de e-commerce mediante su número de guía." : "";
      const pName = paramNameInput ? paramNameInput.value.trim() || "pedido_id" : "pedido_id";
      const pType = paramTypeSelect ? paramTypeSelect.value : "string";
      const isReq = paramRequiredCb ? paramRequiredCb.checked : true;

      const toolSpec = {
        type: "function",
        function: {
          name: name,
          description: desc,
          parameters: {
            type: "object",
            properties: {
              [pName]: {
                type: pType,
                description: `Identificador del ${pName} a consultar en el sistema central.`
              },
              "motivo_consulta": {
                type: "string",
                description: "Contexto adicional del usuario (opcional)."
              }
            },
            required: isReq ? [pName] : []
          }
        }
      };

      codeDisplay.textContent = JSON.stringify(toolSpec, null, 2);
    }

    if (fnNameInput) fnNameInput.addEventListener("input", renderSchema);
    if (fnDescInput) fnDescInput.addEventListener("input", renderSchema);
    if (paramNameInput) paramNameInput.addEventListener("input", renderSchema);
    if (paramTypeSelect) paramTypeSelect.addEventListener("change", renderSchema);
    if (paramRequiredCb) paramRequiredCb.addEventListener("change", renderSchema);

    renderSchema();
  }

  /* ==========================================================================
     3. BANCO 2.3.3: CALCULADORA DE LATENCIA WATERFALL E2E
     ========================================================================== */
  function initLatencyCalculator() {
    const sWebhook = document.getElementById("lat-webhook");
    const sInf1 = document.getElementById("lat-inf1");
    const sDb = document.getElementById("lat-db");
    const sInf2 = document.getElementById("lat-inf2");
    const sSend = document.getElementById("lat-send");
    const totalDisplay = document.getElementById("lat-total-time");
    const statusPill = document.getElementById("lat-status-pill");
    const barWebhook = document.getElementById("lat-bar-webhook");
    const barInf1 = document.getElementById("lat-bar-inf1");
    const barDb = document.getElementById("lat-bar-db");
    const barInf2 = document.getElementById("lat-bar-inf2");
    const barSend = document.getElementById("lat-bar-send");

    if (!totalDisplay) return;

    function calculateLatency() {
      const vWebhook = parseInt(sWebhook.value);
      const vInf1 = parseInt(sInf1.value);
      const vDb = parseInt(sDb.value);
      const vInf2 = parseInt(sInf2.value);
      const vSend = parseInt(sSend.value);

      const total = vWebhook + vInf1 + vDb + vInf2 + vSend;
      const totalSec = (total / 1000).toFixed(2);
      totalDisplay.textContent = `${total} ms (${totalSec}s)`;

      // Actualizar barras relativas
      if (barWebhook) barWebhook.style.width = ((vWebhook / total) * 100) + "%";
      if (barInf1) barInf1.style.width = ((vInf1 / total) * 100) + "%";
      if (barDb) barDb.style.width = ((vDb / total) * 100) + "%";
      if (barInf2) barInf2.style.width = ((vInf2 / total) * 100) + "%";
      if (barSend) barSend.style.width = ((vSend / total) * 100) + "%";

      if (statusPill) {
        if (total < 2500) {
          statusPill.textContent = "ÓPTIMO (<2.5s)";
          statusPill.className = "bench-badge-status status-success";
        } else if (total < 4000) {
          statusPill.textContent = "ACEPTABLE (<4.0s)";
          statusPill.className = "bench-badge-status status-info";
        } else {
          statusPill.textContent = "CRÍTICO (>4.0s · Requiere mensaje intermedio)";
          statusPill.className = "bench-badge-status status-error";
        }
      }
    }

    [sWebhook, sInf1, sDb, sInf2, sSend].forEach(s => {
      if (s) s.addEventListener("input", calculateLatency);
    });

    calculateLatency();
  }

  /* ==========================================================================
     4. BANCO 2.3.4: SIMULADOR DE IDEMPOTENCIA & DEDUPLICACIÓN DE WAMID
     ========================================================================== */
  function initIdempotencySimulator() {
    const btnSendUnique = document.getElementById("idem-btn-send-unique");
    const btnSendDuplicate = document.getElementById("idem-btn-send-duplicate");
    const btnResetCache = document.getElementById("idem-btn-reset");
    const consoleLog = document.getElementById("idem-console-log");
    const cacheCountDisplay = document.getElementById("idem-cache-count");

    if (!btnSendUnique || !consoleLog) return;

    let processedMessages = new Set();
    let counter = 1001;

    function renderLog(msg, isDupe) {
      const time = new Date().toLocaleTimeString("es-MX");
      consoleLog.textContent += `[${time}] ${msg}\n`;
      consoleLog.scrollTop = consoleLog.scrollHeight;
      if (cacheCountDisplay) cacheCountDisplay.textContent = `${processedMessages.size} wamid en caché`;
      if (window.SOUND) isDupe ? window.SOUND.playPop(260) : window.SOUND.playChime();
    }

    btnSendUnique.addEventListener("click", function(){
      counter++;
      const wamid = `wamid.HBgLMjUyMTU1ODc2NTE2FQIAEhgg${counter}`;
      if (!processedMessages.has(wamid)) {
        processedMessages.add(wamid);
        renderLog(`MENSAJE NUEVO RECIBIDO -> wamid: ${wamid}\n  ✔ Verificado en Redis (SETNX exitoso: LLAVE_CREADA)\n  ✔ Procesando inferencia Llama 3 y ejecutando acción. Retornando HTTP 200 OK.`, false);
      }
    });

    btnSendDuplicate.addEventListener("click", function(){
      if (processedMessages.size === 0) {
        counter++;
        const wamid = `wamid.HBgLMjUyMTU1ODc2NTE2FQIAEhgg${counter}`;
        processedMessages.add(wamid);
      }
      const existing = Array.from(processedMessages)[processedMessages.size - 1];
      renderLog(`REINTENTO DUPLICADO DE META DETECTADO -> wamid: ${existing}\n  ⛔ Bloqueado por filtro de idempotencia (Llave ya existe en Redis)\n  ✔ Retornando HTTP 200 OK inmediato sin re-ejecutar la acción para evitar cobro doble.`, true);
    });

    if (btnResetCache) {
      btnResetCache.addEventListener("click", function(){
        processedMessages.clear();
        consoleLog.textContent = "// Caché de idempotencia en Redis limpiada.\n";
        if (cacheCountDisplay) cacheCountDisplay.textContent = "0 wamid en caché";
        if (window.SOUND) window.SOUND.playPop(300);
      });
    }
  }

  /* ==========================================================================
     5. BANCO 2.3.5: LABORATORIO DE MANEJO DE EXCEPCIONES Y FALLBACKS
     ========================================================================== */
  function initFallbackPlayground() {
    const scenarioSelect = document.getElementById("fb-scenario-select");
    const outputConsole = document.getElementById("fb-console-output");

    if (!scenarioSelect || !outputConsole) return;

    const scenarios = {
      db_timeout: {
        error: "DatabaseConnectionTimeoutError: Connection pool exhausted after 3000ms",
        bad_response: "HTTP 500 Internal Server Error (El usuario de WhatsApp se queda sin respuesta y Meta reintenta)",
        graceful_response: `¡Hola! En este momento nuestro sistema de reservas está experimentando una breve saturación. He guardado tu solicitud y te confirmaremos en este mismo chat en menos de 10 minutos. Gracias por tu paciencia.`
      },
      invalid_params: {
        error: "ValidationError: fecha '2026-02-30' is not a valid calendar day",
        bad_response: "JSON parse exception: Invalid ISO date format (Crash del proceso)",
        graceful_response: `Noto que la fecha indicada (30 de febrero) no existe en el calendario. ¿Te gustaría agendar para el viernes 27 de febrero o el sábado 28 de febrero?`
      },
      no_availability: {
        error: "BusinessLogicError: Zero tables available for party_size=8 at 20:00",
        bad_response: "Reserva rechazada: No hay cupo.",
        graceful_response: `Lamentablemente ya no tenemos mesas para 8 personas a las 8:00 PM. Sin embargo, tenemos disponibilidad a las 6:30 PM o a las 9:45 PM en el área principal. ¿Te funciona alguno de estos horarios?`
      }
    };

    function renderScenario() {
      const val = scenarioSelect.value;
      const data = scenarios[val];
      if (!data) return;

      const log = `[1. Excepción Interna Capturada por Backend]\n${data.error}\n\n[2. Respuesta Incorrecta / Anti-patrón]\n${data.bad_response}\n\n[3. Respuesta Empática Generada por Llama (Graceful Fallback)]\n"${data.graceful_response}"`;
      outputConsole.textContent = log;
      if (window.SOUND) window.SOUND.playPop(380);
    }

    scenarioSelect.addEventListener("change", renderScenario);
    renderScenario();
  }

  /* ==========================================================================
     6. MOTOR DE QUIZZES
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
              feedback.innerHTML = '<span style="color:#059669; font-weight:700;">¡Respuesta Correcta!</span> Has dominado el mecanismo de Function Calling y la arquitectura de Tool Calling.';
              feedback.style.display = "block";
            }
          } else {
            opt.classList.add("incorrect");
            if (window.SOUND) window.SOUND.playPop(220);
            if (feedback) {
              feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">Respuesta Incorrecta.</span> Recuerda que el LLM genera el JSON de la llamada pero no ejecuta código directamente en el servidor.';
              feedback.style.display = "block";
            }
          }
          updateScore();
        });
      });
    });
  }

  /* ==========================================================================
     7. CONTROLADOR DE EJERCICIOS PRÁCTICOS
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

})();
