/**
 * Meta AI - Módulo 2 · Tema 2: Diseño de Agentes Conversacionales Engine
 * Interactive Simulators:
 * 1. Memory State & Context Window Inspector (Stateless LLM vs Stateful Agent)
 * 2. Llama Stack Modular Architecture Builder (Memory, Tools, Safety)
 * 3. Hybrid Flow Router (Deterministic Hard Rules vs LLM Flexibility)
 * 4. Memory Compression & Sliding Window Token Optimizer
 * 5. Multi-User Session Isolation Simulator (SQLite / Redis)
 * 6. Interactive Quiz Engine & Exercises
 * 7. Searchable Technical Glossary
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initMemoryStateSimulator();
    initLlamaStackBuilder();
    initHybridRouterSimulator();
    initMemoryCompressor();
    initMultiUserSessions();
    initQuizEngine();
    initExerciseToggles();
    initGlossaryFilter();
  });

  /* ==========================================================================
     1. BANCO 2.2.1: SIMULADOR DE MEMORIA DE ESTADO Y VENTANA DE CONTEXTO
     ========================================================================== */
  function initMemoryStateSimulator() {
    const userMsgInput = document.getElementById("mem-user-input");
    const btnSend = document.getElementById("mem-btn-send");
    const btnReset = document.getElementById("mem-btn-reset");
    const chatContainer = document.getElementById("mem-chat-history");
    const stateDisplay = document.getElementById("mem-state-json");
    const promptDisplay = document.getElementById("mem-reconstructed-prompt");
    const contextBar = document.getElementById("mem-context-bar");
    const contextCount = document.getElementById("mem-context-count");
    const modeBadge = document.getElementById("mem-mode-badge");
    const modeStatefulBtn = document.getElementById("mem-mode-stateful-btn");
    const modeStatelessBtn = document.getElementById("mem-mode-stateless-btn");
    const chatStatusText = document.getElementById("mem-chat-status-text");
    const chatModeTag = document.getElementById("mem-chat-mode-tag");

    // Badges de entidad
    const badgeServicio = document.getElementById("badge-servicio");
    const badgeFecha = document.getElementById("badge-fecha");
    const badgeHora = document.getElementById("badge-hora");
    const badgeEstatus = document.getElementById("badge-estatus");

    if (!btnSend || !chatContainer) return;

    let currentMode = "stateful"; // "stateful" | "stateless"
    let conversationHistory = [];
    let sessionVariables = {
      user_id: "wa_5215587654321",
      cliente_nombre: "Lic. Jesús Olvera",
      servicio_detectado: null,
      fecha_mencionada: null,
      hora_seleccionada: null,
      doctor_asignado: null,
      estatus_cita: "INICIADA",
      folio_reserva: null,
      turno_actual: 0
    };

    const maxContextTokens = 2048;

    // Control de Modos: Stateful vs Stateless
    if (modeStatefulBtn && modeStatelessBtn) {
      modeStatefulBtn.addEventListener("click", function() {
        currentMode = "stateful";
        modeStatefulBtn.classList.add("active");
        modeStatelessBtn.classList.remove("active");
        if (modeBadge) {
          modeBadge.className = "bench-badge-status status-success";
          modeBadge.textContent = "MODO STATEFUL (CON MEMORIA)";
        }
        if (chatStatusText) chatStatusText.textContent = "En línea · Memoria de Estado Activa";
        if (chatModeTag) {
          chatModeTag.textContent = "STATEFUL";
          chatModeTag.style.background = "rgba(16,185,129,0.15)";
          chatModeTag.style.color = "#10b981";
          chatModeTag.style.borderColor = "#10b981";
        }
        resetState();
      });

      modeStatelessBtn.addEventListener("click", function() {
        currentMode = "stateless";
        modeStatelessBtn.classList.add("active");
        modeStatefulBtn.classList.remove("active");
        if (modeBadge) {
          modeBadge.className = "bench-badge-status status-error";
          modeBadge.textContent = "MODO STATELESS (AMNESIA TOTAL)";
        }
        if (chatStatusText) chatStatusText.textContent = "En línea · Sin Memoria (Aislado)";
        if (chatModeTag) {
          chatModeTag.textContent = "STATELESS";
          chatModeTag.style.background = "rgba(239,68,68,0.15)";
          chatModeTag.style.color = "#ef4444";
          chatModeTag.style.borderColor = "#ef4444";
        }
        resetState();
      });
    }

    // Botones de Paso Rápido
    const quickPills = document.querySelectorAll(".mem-quick-step");
    quickPills.forEach(pill => {
      pill.addEventListener("click", function() {
        const msg = this.getAttribute("data-msg");
        if (userMsgInput && msg) {
          userMsgInput.value = msg;
          userMsgInput.focus();
        }
      });
    });

    function escapeHtml(str) {
      if (!str) return "";
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function updateEntityBadges() {
      if (badgeServicio) badgeServicio.textContent = sessionVariables.servicio_detectado || "No definido";
      if (badgeFecha) badgeFecha.textContent = sessionVariables.fecha_mencionada || "No definida";
      if (badgeHora) {
        if (sessionVariables.hora_seleccionada) {
          badgeHora.textContent = `${sessionVariables.hora_seleccionada} (${sessionVariables.doctor_asignado || 'Dr. General'})`;
        } else {
          badgeHora.textContent = "No asignado";
        }
      }
      if (badgeEstatus) {
        badgeEstatus.textContent = sessionVariables.estatus_cita;
        badgeEstatus.style.color = sessionVariables.estatus_cita.includes("CONFIRMADA") ? "var(--accent-success)" : "#f59e0b";
      }
    }

    function renderChat() {
      chatContainer.innerHTML = "";
      if (conversationHistory.length === 0) {
        const welcome = document.createElement("div");
        welcome.className = "chat-bubble bot-bubble";
        const welcomeText = currentMode === "stateful" 
          ? "¡Hola! Bienvenido a Dental Clinic Meta. Cuento con memoria de estado para gestionar tu consulta. ¿Qué servicio requieres agendar hoy?"
          : "¡Hola! Bienvenido a Dental Clinic Meta (Modo Stateless). Cada mensaje que envíes será procesado de forma 100% aislada sin recordar turnos previos.";
        welcome.innerHTML = `<div class="bubble-text">${welcomeText}</div><div class="bubble-time">10:00 AM · Meta AI</div>`;
        chatContainer.appendChild(welcome);
      } else {
        conversationHistory.forEach(item => {
          const div = document.createElement("div");
          div.className = item.role === "user" ? "chat-bubble user-bubble" : "chat-bubble bot-bubble";
          div.innerHTML = `<div class="bubble-text">${escapeHtml(item.content)}</div><div class="bubble-time">${item.time} · ${item.role === "user" ? "Entregado" : "Meta AI"}</div>`;
          chatContainer.appendChild(div);
        });
      }
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Actualizar State JSON
      if (stateDisplay) {
        if (currentMode === "stateful") {
          stateDisplay.textContent = JSON.stringify(sessionVariables, null, 2);
        } else {
          stateDisplay.textContent = JSON.stringify({
            "modo": "STATELESS_LLM",
            "persistencia_sesion": false,
            "variables_recuperadas": null,
            "alerta": "Sin base de datos de estado: Cada invocación HTTP es atómica y sin historial."
          }, null, 2);
        }
      }

      // Reconstruir Prompt
      let fullPrompt = "";
      if (currentMode === "stateful") {
        fullPrompt = `<|start_header_id|>system<|end_header_id|>
Eres el asistente médico de Dental Clinic Meta.
[Estado de Sesión Inyectado desde Redis]:
- Usuario: ${sessionVariables.cliente_nombre} (${sessionVariables.user_id})
- Servicio: ${sessionVariables.servicio_detectado || 'Pendiente de definir'}
- Fecha: ${sessionVariables.fecha_mencionada || 'Pendiente de definir'}
- Horario / Médico: ${sessionVariables.hora_seleccionada || 'Pendiente'} (${sessionVariables.doctor_asignado || 'No asignado'})
- Estatus de Cita: ${sessionVariables.estatus_cita} ${sessionVariables.folio_reserva ? '(Folio: ' + sessionVariables.folio_reserva + ')' : ''}
<|eot_id|>\n`;

        conversationHistory.forEach(turn => {
          fullPrompt += `<|start_header_id|>${turn.role}<|end_header_id|>\n${turn.content}<|eot_id|>\n`;
        });
        fullPrompt += `<|start_header_id|>assistant<|end_header_id|>\n`;
      } else {
        // En Stateless solo viaja el último mensaje del usuario
        const lastUser = conversationHistory.filter(x => x.role === "user").slice(-1)[0];
        const lastText = lastUser ? lastUser.content : "Sin mensaje";
        fullPrompt = `<|start_header_id|>system<|end_header_id|>
Eres el asistente de Dental Clinic Meta.
[Advertencia: Modo Stateless sin historial previo ni variables de sesión]
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
${lastText}<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>\n`;
      }

      if (promptDisplay) {
        promptDisplay.textContent = fullPrompt;
      }

      updateEntityBadges();

      // Tokens Aprox
      const approxTokens = Math.round(fullPrompt.length / 3.8);
      const pct = Math.min(100, Math.round((approxTokens / maxContextTokens) * 100));
      if (contextBar) {
        contextBar.style.width = pct + "%";
        contextBar.style.background = pct > 80 ? "#ef4444" : (pct > 50 ? "#f59e0b" : "var(--accent-success)");
      }
      if (contextCount) contextCount.textContent = `${approxTokens} / ${maxContextTokens} tokens (${pct}%)`;
    }

    function processTurn(text) {
      if (!text) return;
      const timeStr = new Date().toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' });
      sessionVariables.turno_actual++;

      const lower = text.toLowerCase();

      // Extracción de Entidades NLU (Solo si es Stateful)
      if (currentMode === "stateful") {
        if (lower.includes("limpieza") || lower.includes("dental") || lower.includes("diente") || lower.includes("ortodoncia") || lower.includes("carillas") || lower.includes("muela") || lower.includes("revisión")) {
          if (lower.includes("limpieza")) sessionVariables.servicio_detectado = "Limpieza Dental & Profilaxis";
          else if (lower.includes("ortodoncia")) sessionVariables.servicio_detectado = "Ortodoncia / Brackets";
          else if (lower.includes("carillas")) sessionVariables.servicio_detectado = "Diseño de Sonrisa & Carillas";
          else sessionVariables.servicio_detectado = "Consulta Dental General";
        }

        if (lower.includes("sabado") || lower.includes("sábado") || lower.includes("jueves") || lower.includes("viernes") || lower.includes("lunes") || lower.includes("mañana")) {
          if (lower.includes("sabado") || lower.includes("sábado")) sessionVariables.fecha_mencionada = "Sábado 23 de Agosto";
          else if (lower.includes("viernes")) sessionVariables.fecha_mencionada = "Viernes 22 de Agosto";
          else if (lower.includes("jueves")) sessionVariables.fecha_mencionada = "Jueves 21 de Agosto";
          else sessionVariables.fecha_mencionada = "Mañana";
        }

        if (lower.includes("10") || lower.includes("12:30") || lower.includes("morales") || lower.includes("castillo")) {
          if (lower.includes("10")) sessionVariables.hora_seleccionada = "10:00 AM";
          else if (lower.includes("12:30")) sessionVariables.hora_seleccionada = "12:30 PM";
          
          if (lower.includes("morales")) sessionVariables.doctor_asignado = "Dra. Morales";
          else if (lower.includes("castillo")) sessionVariables.doctor_asignado = "Dr. Castillo";
          else sessionVariables.doctor_asignado = "Dra. Morales";
          
          sessionVariables.estatus_cita = "CONFIRMADA";
          sessionVariables.folio_reserva = "DEN-" + Math.floor(1000 + Math.random() * 9000);
        }
      }

      conversationHistory.push({ role: "user", content: text, time: timeStr });
      if (userMsgInput) userMsgInput.value = "";
      if (window.SOUND) window.SOUND.playPop(480);

      renderChat();

      // Generar Respuesta de IA con Simulador
      setTimeout(() => {
        let botReply = "";

        if (currentMode === "stateless") {
          // COMPORTAMIENTO STATELESS (AMNESIA DEMOSTRADA)
          if (lower.includes("limpieza") || lower.includes("dental")) {
            botReply = "Con gusto. En Dental Clinic Meta realizamos limpiezas dentales. ¿Para qué fecha deseas agendar tu cita?";
          } else if (lower.includes("sabado") || lower.includes("sábado") || lower.includes("mañana")) {
            botReply = "Hola. Para el sábado tenemos horarios disponibles. Sin embargo, ¿me puedes indicar tu nombre y qué servicio dental deseas agendar? (No tengo registro previo de tu mensaje anterior).";
          } else if (lower.includes("10") || lower.includes("morales") || lower.includes("confirmo")) {
            botReply = "No tengo contexto de qué servicio o cita estás solicitando. Por favor, indícame desde el inicio qué procedimiento dental necesitas para poder apoyarte.";
          } else if (lower.includes("hora") || lower.includes("quedó") || lower.includes("cita")) {
            botReply = "No tengo registro de ninguna cita previa en este mensaje. Como soy un sistema Stateless sin memoria, debes proporcionar todos tus datos en cada turno.";
          } else {
            botReply = "Hola, bienvenido a Dental Clinic Meta. ¿En qué servicio dental te podemos asesorar?";
          }
        } else {
          // COMPORTAMIENTO STATEFUL (MEMORIA PERSISTENTE COMPLETA)
          if (sessionVariables.estatus_cita.includes("CONFIRMADA")) {
            if (lower.includes("hora") || lower.includes("quedó") || lower.includes("servicio") || lower.includes("folio")) {
              botReply = `Estimado ${sessionVariables.cliente_nombre}, tu cita para ${sessionVariables.servicio_detectado} está confirmada para el ${sessionVariables.fecha_mencionada} a las ${sessionVariables.hora_seleccionada} con la ${sessionVariables.doctor_asignado}. Tu folio de atención es [${sessionVariables.folio_reserva}]. ¿Necesitas indicaciones de ubicación?`;
            } else {
              botReply = `¡Excelente elección! He reservado exitosamente tu cita para ${sessionVariables.servicio_detectado} el ${sessionVariables.fecha_mencionada} a las ${sessionVariables.hora_seleccionada} con la ${sessionVariables.doctor_asignado}. Tu folio de confirmación es [${sessionVariables.folio_reserva}]. Te enviaremos un recordatorio por WhatsApp.`;
            }
          } else if (sessionVariables.fecha_mencionada && sessionVariables.servicio_detectado) {
            botReply = `Para tu ${sessionVariables.servicio_detectado}, el ${sessionVariables.fecha_mencionada} tenemos espacios disponibles a las 10:00 AM (Dra. Morales) y a las 12:30 PM (Dr. Castillo). ¿Cuál horario prefieres?`;
          } else if (sessionVariables.servicio_detectado) {
            botReply = `Perfecto, con gusto te apoyamos con tu ${sessionVariables.servicio_detectado}. ¿Qué día te gustaría asistir? (Ej. "Este sábado" o "El jueves por la tarde").`;
          } else {
            botReply = `Entendido. Registré tu solicitud en el sistema. ¿Qué servicio dental te gustaría agendar hoy?`;
          }
        }

        const botTime = new Date().toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' });
        conversationHistory.push({ role: "assistant", content: botReply, time: botTime });
        renderChat();
        if (window.SOUND) window.SOUND.playChime();
      }, 450);
    }

    btnSend.addEventListener("click", function() {
      const text = userMsgInput ? userMsgInput.value.trim() : "";
      processTurn(text);
    });

    if (userMsgInput) {
      userMsgInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();
          const text = userMsgInput.value.trim();
          processTurn(text);
        }
      });
    }

    function resetState() {
      conversationHistory = [];
      sessionVariables = {
        user_id: "wa_5215587654321",
        cliente_nombre: "Lic. Jesús Olvera",
        servicio_detectado: null,
        fecha_mencionada: null,
        hora_seleccionada: null,
        doctor_asignado: null,
        estatus_cita: "INICIADA",
        folio_reserva: null,
        turno_actual: 0
      };
      if (userMsgInput) {
        userMsgInput.value = "Hola, quiero agendar una cita para limpieza dental";
      }
      renderChat();
      if (window.SOUND) window.SOUND.playPop(300);
    }

    if (btnReset) {
      btnReset.addEventListener("click", resetState);
    }

    renderChat();
  }

  /* ==========================================================================
     2. BANCO 2.2.2: PLAYGROUND LLAMA STACK (ARQUITECTURA MODULAR)
     ========================================================================== */
  function initLlamaStackBuilder() {
    const memorySelect = document.getElementById("stack-memory-select");
    const toolCheckboxes = document.querySelectorAll(".stack-tool-cb");
    const safetySelect = document.getElementById("stack-safety-select");
    const codeDisplay = document.getElementById("stack-code-output");

    if (!codeDisplay) return;

    function generateStackSpec() {
      const memoryType = memorySelect ? memorySelect.value : "sqlite";
      const safetyType = safetySelect ? safetySelect.value : "llama_guard_3";
      
      const activeTools = [];
      toolCheckboxes.forEach(cb => {
        if (cb.checked) activeTools.push(cb.value);
      });

      const spec = `from llama_stack import LlamaStackClient
from llama_stack.types import MemoryConfig, ToolDefinition, SafetyConfig

# 1. Configuración de Cliente Llama Stack
client = LlamaStackClient(base_url="http://localhost:5000")

# 2. Módulo de Memoria de Estado (${memoryType.toUpperCase()})
memory_config = MemoryConfig(
    provider="${memoryType}",
    session_ttl_seconds=86400,  # 24 horas de persistencia
    max_history_turns=10,
    compression_strategy="sliding_window_with_summary"
)

# 3. Registro de Herramientas Operativas (${activeTools.length} activas)
tools = [
${activeTools.map(t => `    ToolDefinition(name="${t}", description="Herramienta operativa ${t}")`).join(',\n')}
]

# 4. Capa de Blindaje y Seguridad (${safetyType})
safety_config = SafetyConfig(
    shield_model="${safetyType}",
    categories_blocked=["S1_Violent_Crimes", "S3_Sex_Related", "S9_Prompt_Injection"],
    action_on_violation="interrupt_and_fallback"
)

# 5. Inicialización del Agente Estandarizado
agent = client.agents.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    instructions="Eres el agente conversacional de WhatsApp.",
    memory=memory_config,
    tools=tools,
    safety=safety_config
)`;

      codeDisplay.textContent = spec;
    }

    if (memorySelect) memorySelect.addEventListener("change", generateStackSpec);
    if (safetySelect) safetySelect.addEventListener("change", generateStackSpec);
    toolCheckboxes.forEach(cb => cb.addEventListener("change", generateStackSpec));

    const btnResetStack = document.getElementById("stack-btn-reset");
    if (btnResetStack) {
      btnResetStack.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        if (memorySelect) memorySelect.value = "sqlite";
        if (safetySelect) safetySelect.value = "llama_guard_3";
        toolCheckboxes.forEach((cb, idx) => { cb.checked = idx < 2; });
        generateStackSpec();
      });
    }

    generateStackSpec();
  }

  /* ==========================================================================
     3. BANCO 2.2.3: ENRUTADOR DE FLUJO HÍBRIDO (REGLAS FIJAS VS LLM)
     ========================================================================== */
  function initHybridRouterSimulator() {
    const inputMsg = document.getElementById("hybrid-user-input");
    const btnRoute = document.getElementById("hybrid-btn-route");
    const routeDecision = document.getElementById("hybrid-decision-pill");
    const routeExplanation = document.getElementById("hybrid-explanation");
    const presetPills = document.querySelectorAll(".hybrid-preset-pill");

    if (!btnRoute || !routeDecision) return;

    function evaluateRoute() {
      const text = inputMsg ? inputMsg.value.trim() : "";
      if (!text) return;

      const lower = text.toLowerCase();
      let decision = "";
      let isHardRule = false;
      let reason = "";

      // Evaluación de Reglas Duras (Deterministic Hard Rules)
      if (lower.includes("humano") || lower.includes("asesor") || lower.includes("persona") || lower.includes("agente real")) {
        isHardRule = true;
        decision = "REGLA FIJA: Transferencia a Asesor Humano";
        reason = "El usuario solicita hablar con una persona real. Esta acción es crítica y jamás se delega al LLM para evitar que el modelo intente persuadir al usuario de no ser transferido.";
      } else if (lower.includes("cancelar") || lower.includes("eliminar mis datos") || lower.includes("derecho arco") || lower.includes("borrar cuenta")) {
        isHardRule = true;
        decision = "REGLA FIJA: Protocolo de Privacidad / Cancelación";
        reason = "Petición legal de eliminación de datos. Se activa la rutina de base de datos directamente con confirmación de doble factor sin interpretación generativa.";
      } else if (lower.includes("emergencia") || lower.includes("sangre") || lower.includes("desmayo") || lower.includes("infarto")) {
        isHardRule = true;
        decision = "REGLA FIJA: Alerta Médica de Emergencia (911)";
        reason = "Riesgo vital detectado. Se interrumpe el flujo conversacional y se proveen números de emergencia 911 y ubicación de urgencias de forma inmediata.";
      } else {
        isHardRule = false;
        decision = "FLEXIBILIDAD LLM: Inferencia con Meta Llama 3";
        reason = "Consulta sobre horarios, servicios, dudas generales o preguntas de lenguaje natural. Llama 3 procesa el contexto, interpreta la intención y genera una respuesta empática y precisa.";
      }

      routeDecision.textContent = decision;
      routeDecision.className = isHardRule ? "bench-badge-status status-error" : "bench-badge-status status-success";
      if (routeExplanation) routeExplanation.innerHTML = `<strong>Justificación Arquitectónica:</strong> ${reason}`;

      if (window.SOUND) isHardRule ? window.SOUND.playPop(320) : window.SOUND.playChime();
    }

    btnRoute.addEventListener("click", evaluateRoute);

    presetPills.forEach(pill => {
      pill.addEventListener("click", function(){
        if (inputMsg) inputMsg.value = pill.getAttribute("data-text");
        evaluateRoute();
      });
    });

    const btnResetHybrid = document.getElementById("hybrid-btn-reset");
    if (btnResetHybrid) {
      btnResetHybrid.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        if (inputMsg) inputMsg.value = "Quiero hablar con un asesor humano";
        evaluateRoute();
      });
    }
  }

  /* ==========================================================================
     4. BANCO 2.2.4: COMPRESOR DE HISTORIAL & SLIDING WINDOW OPTIMIZER
     ========================================================================== */
  function initMemoryCompressor() {
    const turnsSlider = document.getElementById("comp-turns-slider");
    const turnsValue = document.getElementById("comp-turns-val");
    const strategySelect = document.getElementById("comp-strategy-select");
    const tokenRaw = document.getElementById("comp-tokens-raw");
    const tokenComp = document.getElementById("comp-tokens-comp");
    const tokenSaving = document.getElementById("comp-tokens-saving");
    const outputConsole = document.getElementById("comp-preview-console");

    if (!turnsSlider || !strategySelect) return;

    function calculateCompression() {
      const turns = parseInt(turnsSlider.value);
      if (turnsValue) turnsValue.textContent = `${turns} turnos`;
      const strat = strategySelect.value;

      // Estimación de 120 tokens por turno promedio (Pregunta + Respuesta)
      const rawTokens = turns * 120;
      let compTokens = 0;
      let log = "";

      if (strat === "full") {
        compTokens = rawTokens;
        log = `[Estrategia: Memoria Completa (Sin Compresión)]\nSe reenvían los ${turns} turnos completos en cada llamada.\n- Riesgo: Desborde rápido de la ventana de contexto a partir del turno 15.\n- Latencia: Crecimiento lineal en el tiempo de procesamiento de prompt.`;
      } else if (strat === "sliding") {
        // Ventana deslizante: últimos 4 turnos fijos
        const windowSize = Math.min(turns, 4);
        compTokens = windowSize * 120;
        log = `[Estrategia: Ventana Deslizante (Sliding Window K=4)]\nSe conservan únicamente los últimos ${windowSize} turnos (${windowSize * 120} tokens).\n- Los primeros ${Math.max(0, turns - 4)} turnos se descartan para mantener la latencia constante y predecible.`;
      } else if (strat === "summary") {
        // Resumen jerárquico: Resumen comprimido (~80 tokens) + Últimos 3 turnos (360 tokens)
        const recentTurns = Math.min(turns, 3);
        const summaryTokens = turns > 3 ? 85 : 0;
        compTokens = (recentTurns * 120) + summaryTokens;
        log = `[Estrategia: Memoria Híbrida con Resumen de Llama]\n- Resumen consolidado del historial previo: ${summaryTokens} tokens.\n- Últimos ${recentTurns} turnos verbatim: ${recentTurns * 120} tokens.\n- Balance óptimo: Conserva hechos históricos críticos ahorrando cómputo.`;
      }

      const saved = Math.max(0, rawTokens - compTokens);
      const savedPct = rawTokens > 0 ? Math.round((saved / rawTokens) * 100) : 0;

      if (tokenRaw) tokenRaw.textContent = rawTokens + " tokens";
      if (tokenComp) tokenComp.textContent = compTokens + " tokens";
      if (tokenSaving) tokenSaving.textContent = `${saved} tokens (${savedPct}% ahorro)`;
      if (outputConsole) outputConsole.textContent = log;
    }

    turnsSlider.addEventListener("input", calculateCompression);
    strategySelect.addEventListener("change", calculateCompression);

    const btnResetComp = document.getElementById("comp-btn-reset");
    if (btnResetComp) {
      btnResetComp.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        turnsSlider.value = 12;
        strategySelect.value = "summary";
        calculateCompression();
      });
    }

    calculateCompression();
  }

  /* ==========================================================================
     5. BANCO 2.2.5: AISLAMIENTO DE SESIONES MULTI-USUARIO (SQLITE / REDIS)
     ========================================================================== */
  function initMultiUserSessions() {
    const userSelect = document.getElementById("multi-user-select");
    const outputConsole = document.getElementById("multi-session-view");

    if (!userSelect || !outputConsole) return;

    const mockDatabases = {
      user_1: {
        wa_id: "5215587654321",
        name: "Lic. Jesús Olvera",
        state: "AWAITING_TIME_CONFIRMATION",
        variables: { servicio: "Dental - Limpieza", fecha: "2026-08-23", doctor: "Dra. Morales" },
        last_turn: "Para Dental - Limpieza tenemos disponible el Sábado a las 10:00 AM. ¿Confirmas?"
      },
      user_2: {
        wa_id: "5215512345678",
        name: "Dra. Sofía Morales",
        state: "ORDER_TRACKING_RESOLVED",
        variables: { pedido_id: "45210", paqueteria: "DHL Express", guia: "984729104" },
        last_turn: "Tu pedido #45210 se encuentra en ruta para entrega mañana antes de las 14:00 hrs."
      },
      user_3: {
        wa_id: "5215599887766",
        name: "Ing. Carlos Mendoza",
        state: "AGENT_TRANSFERRED_HUMAN",
        variables: { ticket_id: "TCK-8891", motivo: "Reclamo de Facturación Electrónica" },
        last_turn: "Te he transferido con un asesor del área contable. En breve te contactará."
      }
    };

    function renderSession() {
      const selected = userSelect.value;
      const data = mockDatabases[selected];
      if (!data) return;

      const view = `// Registro aislado en Base de Datos (Clave: session:${data.wa_id})
{
  "usuario_id": "${data.wa_id}",
  "nombre_perfil": "${data.name}",
  "estado_maquina": "${data.state}",
  "variables_sesion": ${JSON.stringify(data.variables, null, 4)},
  "ultimo_mensaje_modelo": "${data.last_turn}"
}`;

      outputConsole.textContent = view;
      if (window.SOUND) window.SOUND.playPop(390);
    }

    userSelect.addEventListener("change", renderSession);

    const btnResetMulti = document.getElementById("multi-btn-reset");
    if (btnResetMulti) {
      btnResetMulti.addEventListener("click", () => {
        if (window.SOUND) window.SOUND.playPop(300);
        userSelect.value = "user_1";
        renderSession();
      });
    }

    renderSession();
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
              feedback.innerHTML = '<span style="color:#059669; font-weight:700;">¡Respuesta Correcta!</span> Has comprendido con precisión los principios de estado, memoria y Llama Stack.';
              feedback.style.display = "block";
            }
          } else {
            opt.classList.add("incorrect");
            if (window.SOUND) window.SOUND.playPop(220);
            if (feedback) {
              feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">Respuesta Incorrecta.</span> Revisa la justificación arquitectónica y vuelve a intentarlo.';
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

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

})();
