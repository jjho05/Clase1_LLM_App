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

    // Parser NLU para extracción de parámetros de restaurante / servicios
    function parseRestaurantNLU(text) {
      const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rawLower = text.toLowerCase();

      let args = {
        personas: 2,
        fecha: "Viernes",
        hora: "20:00",
        zona: "Interior"
      };

      // 1. Personas
      const numMatch = rawLower.match(/(\d+)\s*(?:personas?|comensales?|lugares?|adultos?|amigos?)|(?:somos\s+)(\d+)|(?:para\s+)(\d+)/i);
      if (numMatch) {
        args.personas = parseInt(numMatch[1] || numMatch[2] || numMatch[3], 10);
      } else if (lower.includes("una persona") || lower.includes("un lugar") || lower.includes("solo yo")) {
        args.personas = 1;
      } else if (lower.includes("pareja") || lower.includes("dos personas") || lower.includes("somos dos")) {
        args.personas = 2;
      } else if (lower.includes("tres")) {
        args.personas = 3;
      } else if (lower.includes("cuatro")) {
        args.personas = 4;
      } else if (lower.includes("cinco")) {
        args.personas = 5;
      } else if (lower.includes("seis")) {
        args.personas = 6;
      } else if (lower.includes("ocho")) {
        args.personas = 8;
      } else if (lower.includes("diez")) {
        args.personas = 10;
      }

      // 2. Fecha
      if (lower.includes("lunes")) args.fecha = "Lunes";
      else if (lower.includes("martes")) args.fecha = "Martes";
      else if (lower.includes("miercoles")) args.fecha = "Miércoles";
      else if (lower.includes("jueves")) args.fecha = "Jueves";
      else if (lower.includes("viernes")) args.fecha = "Viernes";
      else if (lower.includes("sabado")) args.fecha = "Sábado";
      else if (lower.includes("domingo")) args.fecha = "Domingo";
      else if (lower.includes("hoy")) args.fecha = "Hoy";
      else if (lower.includes("manana")) args.fecha = "Mañana";

      const dateMatch = rawLower.match(/(\d{1,2}\s+de\s+[a-záéíóú]+)/i);
      if (dateMatch) args.fecha = dateMatch[1];

      // 3. Hora
      const timePmMatch = rawLower.match(/(\d{1,2}(?::\d{2})?)\s*(?:pm|p\.m\.|de la tarde|de la noche|noche)/i);
      const timeAmMatch = rawLower.match(/(\d{1,2}(?::\d{2})?)\s*(?:am|a\.m\.|de la mañana|de la manana)/i);
      const militaryMatch = rawLower.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);

      if (timePmMatch) {
        let val = timePmMatch[1];
        if (!val.includes(":")) {
          let h = parseInt(val, 10);
          if (h < 12) h += 12;
          val = `${h}:00`;
        }
        args.hora = val;
      } else if (timeAmMatch) {
        let val = timeAmMatch[1];
        if (!val.includes(":")) {
          let h = parseInt(val, 10);
          val = `${h.toString().padStart(2, '0')}:00`;
        }
        args.hora = val;
      } else if (militaryMatch) {
        args.hora = militaryMatch[0];
      } else if (lower.includes("noche") || lower.includes("cenar")) {
        args.hora = "21:00";
      } else if (lower.includes("tarde") || lower.includes("comer")) {
        args.hora = "14:30";
      }

      // 4. Zona
      if (lower.includes("terraza") || lower.includes("balcon") || lower.includes("aire libre")) {
        args.zona = "Terraza Panorámica";
      } else if (lower.includes("jardin")) {
        args.zona = "Jardín";
      } else if (lower.includes("privado") || lower.includes("vip")) {
        args.zona = "Salón Privado VIP";
      } else if (lower.includes("barra")) {
        args.zona = "Barra de Mixología";
      } else {
        args.zona = "Salón Principal Interior";
      }

      return args;
    }

    function runToolExecution() {
      const text = userMsgInput ? userMsgInput.value.trim() : "";
      if (!text) return;

      btnExecute.disabled = true;
      stepCards.forEach(c => { if(c) c.className = "flow-step-tracker"; });
      logConsole.textContent = "// Iniciando ciclo de Function Calling con Meta Llama 3.1 8B...\n";

      // Paso 1: Recepción Webhook
      if (stepCards[0]) stepCards[0].className = "flow-step-tracker active";
      logConsole.textContent += `[Paso 1 - Webhook Entrante]\nRecibido mensaje de WhatsApp: "${text}"\nPayload validado con HMAC-SHA256 (OK)\n`;
      if (window.SOUND) window.SOUND.playPop(420);

      setTimeout(() => {
        if (stepCards[0]) stepCards[0].className = "flow-step-tracker completed";
        if (stepCards[1]) stepCards[1].className = "flow-step-tracker active";

        // Extracción NLU Dinámica
        const parsedArgs = parseRestaurantNLU(text);
        const toolCall = {
          id: "call_" + Math.random().toString(36).substring(2, 11),
          type: "function",
          function: {
            name: "consultar_disponibilidad_restaurante",
            arguments: JSON.stringify(parsedArgs)
          }
        };

        logConsole.textContent += `\n[Paso 2 - Inferencia Llama 3 (Tool Request)]\nLlama 3 detectó intención operativa y generó llamada estructurada:\n${JSON.stringify(toolCall, null, 2)}\n`;
        if (window.SOUND) window.SOUND.playPop(480);

        setTimeout(() => {
          if (stepCards[1]) stepCards[1].className = "flow-step-tracker completed";
          if (stepCards[2]) stepCards[2].className = "flow-step-tracker active";

          const folioId = "RES-" + Math.floor(10000 + Math.random() * 90000);
          const dbResult = {
            status: "SUCCESS",
            disponible: true,
            mesas_libres_zona: Math.floor(2 + Math.random() * 4),
            capacidad_confirmada: parsedArgs.personas,
            zona: parsedArgs.zona,
            fecha: parsedArgs.fecha,
            hora: parsedArgs.hora,
            bloqueo_temporal_id: folioId,
            tiempo_limite_confirmacion_min: 15
          };

          logConsole.textContent += `\n[Paso 3 - Ejecución de Backend / SQL Database]\nInvocando función backend: consultar_disponibilidad_restaurante(**args)\nRespuesta de PostgreSQL (Pool asyncpg en 120ms):\n${JSON.stringify(dbResult, null, 2)}\n`;
          if (window.SOUND) window.SOUND.playPop(540);

          setTimeout(() => {
            if (stepCards[2]) stepCards[2].className = "flow-step-tracker completed";
            if (stepCards[3]) stepCards[3].className = "flow-step-tracker completed";

            const finalReply = `¡Buenas noticias! Tenemos mesa disponible en ${parsedArgs.zona} para ${parsedArgs.personas} personas este ${parsedArgs.fecha} a las ${parsedArgs.hora}. He reservado el bloqueo temporal #${folioId}. ¿Deseas que confirme la reservación a tu nombre?`;

            logConsole.textContent += `\n[Paso 4 - Inferencia 2 & Despacho WhatsApp Graph API]\nLlama 3 sintetizó la respuesta empática con rol='tool':\n"${finalReply}"\n\nDespachado a Meta Graph API v20.0 (HTTP 200 OK en 1.76s)`;
            
            if (finalWhatsAppBubble) {
              finalWhatsAppBubble.textContent = finalReply;
            }

            btnExecute.disabled = false;
            if (window.SOUND) window.SOUND.playChime();
          }, 550);

        }, 550);

      }, 450);
    }

    btnExecute.addEventListener("click", runToolExecution);

    if (userMsgInput) {
      userMsgInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runToolExecution();
        }
      });
    }

    presetPills.forEach(pill => {
      pill.addEventListener("click", function(){
        if (userMsgInput) userMsgInput.value = pill.getAttribute("data-text");
        runToolExecution();
      });
    });

    const btnResetFc = document.getElementById("fc-btn-reset");
    if (btnResetFc) {
      btnResetFc.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        btnExecute.disabled = false;
        stepCards.forEach(c => { if(c) c.className = "flow-step-tracker"; });
        if (userMsgInput) userMsgInput.value = "Hola, quiero reservar una mesa para 4 personas este viernes a las 8 de la noche en la terraza";
        if (logConsole) logConsole.textContent = "// Simulador listo. Haz clic en 'Ejecutar Ciclo de Function Calling' para iniciar.";
        if (finalWhatsAppBubble) finalWhatsAppBubble.textContent = 'Haz clic en "Ejecutar Ciclo de Function Calling" para ver la respuesta en vivo...';
      });
    }
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

    const btnResetSchema = document.getElementById("schema-btn-reset");
    if (btnResetSchema) {
      btnResetSchema.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        if (fnNameInput) fnNameInput.value = "consultar_estatus_pedido";
        if (fnDescInput) fnDescInput.value = "Consulta el estatus de un envío de e-commerce mediante su número de guía.";
        if (paramNameInput) paramNameInput.value = "pedido_id";
        if (paramTypeSelect) paramTypeSelect.value = "string";
        if (paramRequiredCb) paramRequiredCb.checked = true;
        renderSchema();
      });
    }

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

    const btnResetLat = document.getElementById("lat-btn-reset");
    if (btnResetLat) {
      btnResetLat.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        if (sWebhook) sWebhook.value = 220;
        if (sInf1) sInf1.value = 850;
        if (sDb) sDb.value = 180;
        if (sInf2) sInf2.value = 950;
        if (sSend) sSend.value = 200;
        calculateLatency();
      });
    }

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
        renderLog(`MENSAJE NUEVO RECIBIDO -> wamid: ${wamid}\n  [OK] Verificado en Redis (SETNX exitoso: LLAVE_CREADA)\n  [OK] Procesando inferencia Llama 3 y ejecutando acción. Retornando HTTP 200 OK.`, false);
      }
    });

    btnSendDuplicate.addEventListener("click", function(){
      if (processedMessages.size === 0) {
        counter++;
        const wamid = `wamid.HBgLMjUyMTU1ODc2NTE2FQIAEhgg${counter}`;
        processedMessages.add(wamid);
      }
      const existing = Array.from(processedMessages)[processedMessages.size - 1];
      renderLog(`REINTENTO DUPLICADO DE META DETECTADO -> wamid: ${existing}\n  [BLOQUEADO] Bloqueado por filtro de idempotencia (Llave ya existe en Redis)\n  [OK] Retornando HTTP 200 OK inmediato sin re-ejecutar la acción para evitar cobro doble.`, true);
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

    const btnResetFb = document.getElementById("fb-btn-reset");
    if (btnResetFb) {
      btnResetFb.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        if (scenarioSelect) scenarioSelect.value = "db_timeout";
        renderScenario();
      });
    }

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
     7. CONTROLADOR DE EJERCICIOS PRÁCTICOS CON AUDIO FEEDBACK
     ========================================================================== */
  function initExerciseToggles() {
    const detailsList = document.querySelectorAll(".exercise-solution-details summary");
    detailsList.forEach(summary => {
      summary.addEventListener("click", function(){
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
