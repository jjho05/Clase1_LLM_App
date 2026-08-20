/**
 * Meta AI - Módulo 2 · Tema 4: Proyecto Integrador: Despliegue en Producción & Llama Guard Engine
 * Interactive Simulators:
 * 1. Dual Safety Shield: Llama Guard 3 & Prompt Guard Inspector
 * 2. E2E Production Architecture Pipeline Visualizer
 * 3. Production Config & Deployment Artifact Generator (Docker Compose & Systemd)
 * 4. Real-time Telemetry & p95 Latency Metrics Dashboard
 * 5. Automated Disaster Recovery & Circuit Breaker Simulator
 * 6. Interactive Quiz Engine & Exercises
 * 7. Searchable Technical Glossary
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initSafetyShieldSimulator();
    initArchitectureInspector();
    initDeploymentConfigGenerator();
    initTelemetryDashboard();
    initDisasterRecoverySimulator();
    initQuizEngine();
    initExerciseToggles();
    initGlossaryFilter();
  });

  /* ==========================================================================
     1. BANCO 2.4.1: BLINDAJE CON LLAMA GUARD 3 & PROMPT GUARD
     ========================================================================== */
  function initSafetyShieldSimulator() {
    const inputMsg = document.getElementById("shield-user-input");
    const btnEvaluate = document.getElementById("shield-btn-eval");
    const decisionPill = document.getElementById("shield-decision-pill");
    const categoryBadge = document.getElementById("shield-category-badge");
    const consoleOutput = document.getElementById("shield-console-output");
    const presetPills = document.querySelectorAll(".shield-preset-pill");

    if (!btnEvaluate || !consoleOutput) return;

    function evaluateShield() {
      const text = inputMsg ? inputMsg.value.trim() : "";
      if (!text) return;

      const lower = text.toLowerCase();
      let isUnsafe = false;
      let category = "Ninguna (Tráfico Legítimo)";
      let score = 0.99;
      let reason = "";

      if (lower.includes("ignore previous instructions") || lower.includes("ignora tus instrucciones") || lower.includes("dan mode") || lower.includes("modo desarrollador sin reglas")) {
        isUnsafe = true;
        category = "S9_Prompt_Injection / Jailbreak (Prompt Guard)";
        score = 0.98;
        reason = "Ataque de inyección de prompt detectado. El usuario intenta sobreescribir el System Prompt del agente.";
      } else if (lower.includes("droga") || lower.includes("fabricar") || lower.includes("veneno") || lower.includes("explosivo") || lower.includes("hackear")) {
        isUnsafe = true;
        category = "S2_Harmful_Substances / S10_CBRN (Llama Guard 3)";
        score = 0.96;
        reason = "Solicitud de sustancias ilícitas o acciones cibernéticas dañinas bloqueadas bajo la taxonomía S2 de Llama Guard.";
      } else if (lower.includes("tarjeta de crédito") || lower.includes("cvv") || lower.includes("password") || lower.includes("contraseña")) {
        isUnsafe = true;
        category = "S14_Data_Privacy_PII_Violation (Llama Guard 3)";
        score = 0.94;
        reason = "Extracción o transmisión insegura de información financiera sensible (PII / PCI-DSS).";
      } else {
        isUnsafe = false;
        category = "SAFE (Llama Guard 3 Verdict)";
        score = 0.01;
        reason = "Mensaje verificado. No infringe ninguna de las 14 categorías de riesgo de Meta AI.";
      }

      if (decisionPill) {
        decisionPill.textContent = isUnsafe ? "BLINDAJE ACTIVADO: UNSAFE" : "TRÁFICO VERIFICADO: SAFE";
        decisionPill.className = isUnsafe ? "bench-badge-status status-error" : "bench-badge-status status-success";
      }

      if (categoryBadge) {
        categoryBadge.textContent = category;
      }

      const log = `[Meta Llama Guard 3 & Prompt Guard Inspector]
Texto Evaluado: "${text}"
Resultado: ${isUnsafe ? '⛔ UNSAFE (Interrumpir Pipeline)' : '✔ SAFE (Continuar a Inferencia)'}
Categoría Asignada: ${category}
Nivel de Confianza de Seguridad: ${(score * 100).toFixed(1)}%

Acción Tomada por el Backend:
${isUnsafe ? '-> El mensaje fue bloqueado en la capa 1 de seguridad. Se devuelve al usuario un mensaje neutral de política sin consumir tokens de Llama 3.' : '-> El mensaje superó los filtros y avanza al módulo de memoria y generación de Llama 3.'}`;

      consoleOutput.textContent = log;
      if (window.SOUND) isUnsafe ? window.SOUND.playPop(230) : window.SOUND.playChime();
    }

    btnEvaluate.addEventListener("click", evaluateShield);

    presetPills.forEach(pill => {
      pill.addEventListener("click", function(){
        if (inputMsg) inputMsg.value = pill.getAttribute("data-text");
        evaluateShield();
      });
    });
  }

  /* ==========================================================================
     2. BANCO 2.4.2: INSPECTOR DE ARQUITECTURA DE PRODUCCIÓN
     ========================================================================== */
  function initArchitectureInspector() {
    const nodes = document.querySelectorAll(".arch-node-item");
    const detailTitle = document.getElementById("arch-detail-title");
    const detailDesc = document.getElementById("arch-detail-desc");
    const detailMetrics = document.getElementById("arch-detail-metrics");

    if (nodes.length === 0 || !detailTitle) return;

    const nodeData = {
      meta_cloud: {
        title: "Capa 1: WhatsApp Cloud Infrastructure (Meta)",
        desc: "Alojamiento global de números de WhatsApp Business, cifrado E2E y generador de webhooks HTTP POST hacia tu backend.",
        metrics: "SLA: 99.95% | Latencia de Red: ~180ms | Tipo: Infraestructura Gestionada"
      },
      nginx_ssl: {
        title: "Capa 2: NGINX Reverse Proxy + SSL Let's Encrypt",
        desc: "Terminación TLS 1.3, balanceo de carga, rate limiting anti-DDoS y reenvío seguro mediante sockets Unix a Uvicorn.",
        metrics: "Certificado: Auto-renew Certbot | Conexiones concurrentes: 10,000+ | Header: X-Hub-Signature-256 pass-through"
      },
      llama_guard: {
        title: "Capa 3: Llama Guard 3 Shield & Safety Interceptor",
        desc: "Filtro de seguridad en microsegundos que intercepta inyecciones de prompt y contenido malicioso antes de la inferencia.",
        metrics: "Modelo: Llama-Guard-3-1B | Latencia: ~45ms | Clasificación: 14 categorías"
      },
      fastapi_core: {
        title: "Capa 4: Microservicio FastAPI (Python Asíncrono)",
        desc: "Orquestador principal con Pydantic, BackgroundTasks para respuestas no bloqueantes y validación criptográfica HMAC.",
        metrics: "Workers: 4 Uvicorn | Tiempo de respuesta a Webhook: <120ms (HTTP 200)"
      },
      state_db: {
        title: "Capa 5: Memoria de Estado (Redis + PostgreSQL)",
        desc: "Redis para caché ultra-rápida de idempotencia (wamid) y TTL de 24h; PostgreSQL para historial y perfiles transaccionales.",
        metrics: "Latencia Redis: <2ms | Deduplicación wamid: SETNX 86400s | Backup: Automático"
      },
      llama_engine: {
        title: "Capa 6: Motor de Inferencia Meta Llama 3.1 8B",
        desc: "Servidor de inferencia optimizado con vLLM / TensorRT-LLM con soporte de Tool Calling, KV Cache y cuantización AWQ/FP8.",
        metrics: "Throughput: 85 tokens/seg | Latencia Prefill: 420ms | GPU VRAM: 16 GB"
      }
    };

    nodes.forEach(node => {
      node.addEventListener("click", function(){
        nodes.forEach(n => n.classList.remove("active"));
        node.classList.add("active");
        const key = node.getAttribute("data-node");
        const info = nodeData[key];
        if (info) {
          detailTitle.textContent = info.title;
          detailDesc.textContent = info.desc;
          detailMetrics.textContent = info.metrics;
        }
        if (window.SOUND) window.SOUND.playPop(390);
      });
    });
  }

  /* ==========================================================================
     3. BANCO 2.4.3: GENERADOR DE CONFIGURACIÓN DE DESPLIEGUE
     ========================================================================== */
  function initDeploymentConfigGenerator() {
    const tabBtns = document.querySelectorAll(".deploy-tab-btn");
    const codeDisplay = document.getElementById("deploy-code-output");

    if (!codeDisplay) return;

    const templates = {
      docker: `version: '3.8'

services:
  # 1. Reverse Proxy con SSL Automático
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - fastapi_app
    restart: always

  # 2. Backend FastAPI + Llama Agent
  fastapi_app:
    build: .
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
    environment:
      - WHATSAPP_TOKEN=\${WHATSAPP_TOKEN}
      - PHONE_NUMBER_ID=\${PHONE_NUMBER_ID}
      - APP_SECRET=\${APP_SECRET}
      - REDIS_URL=redis://redis_cache:6379/0
      - LLAMA_BASE_URL=http://vllm_engine:8000/v1
    depends_on:
      - redis_cache
    restart: always

  # 3. Caché de Idempotencia y Estado
  redis_cache:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: always

volumes:
  redis_data:`,

      systemd: `[Unit]
Description=Meta Llama 3 WhatsApp Production Agent
After=network.target redis.service

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/llama-whatsapp-production
ExecStart=/home/ubuntu/llama-whatsapp-production/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000
Restart=always
RestartSec=5
EnvironmentFile=/home/ubuntu/llama-whatsapp-production/.env

[Install]
WantedBy=multi-user.target`,

      nginx: `server {
    listen 80;
    server_name whatsapp.tuempresa.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name whatsapp.tuempresa.com;

    ssl_certificate /etc/letsencrypt/live/whatsapp.tuempresa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/whatsapp.tuempresa.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /webhook {
        proxy_pass http://127.0.0.1:8000/webhook;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
        proxy_read_timeout 10s;
    }
}`
    };

    tabBtns.forEach(btn => {
      btn.addEventListener("click", function(){
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-type");
        codeDisplay.textContent = templates[type] || templates.docker;
        if (window.SOUND) window.SOUND.playPop(340);
      });
    });

    codeDisplay.textContent = templates.docker;
  }

  /* ==========================================================================
     4. BANCO 2.4.4: DASHBOARD DE TELEMETRÍA EN TIEMPO REAL
     ========================================================================== */
  function initTelemetryDashboard() {
    const metricP95 = document.getElementById("dash-p95");
    const metricDelivery = document.getElementById("dash-delivery");
    const metricTokens = document.getElementById("dash-tokens");
    const metricCost = document.getElementById("dash-cost");
    const btnSimulateBurst = document.getElementById("dash-btn-burst");

    if (!metricP95) return;

    let baseP95 = 2.14;
    let baseDelivery = 99.8;
    let baseTokens = 142800;

    function renderMetrics() {
      if (metricP95) metricP95.textContent = `${baseP95.toFixed(2)}s`;
      if (metricDelivery) metricDelivery.textContent = `${baseDelivery.toFixed(1)}%`;
      if (metricTokens) metricTokens.textContent = baseTokens.toLocaleString() + " tk";
      if (metricCost) metricCost.textContent = `$${(baseTokens * 0.0000008).toFixed(4)} USD`;
    }

    if (btnSimulateBurst) {
      btnSimulateBurst.addEventListener("click", function(){
        baseP95 = 2.85;
        baseDelivery = 99.4;
        baseTokens += 25400;
        renderMetrics();
        if (window.SOUND) window.SOUND.playPop(480);
        setTimeout(() => {
          baseP95 = 2.18;
          baseDelivery = 99.8;
          renderMetrics();
        }, 3000);
      });
    }

    renderMetrics();
  }

  /* ==========================================================================
     5. BANCO 2.4.5: SIMULADOR DE PLAN DE CONTINGENCIA Y FAILOVER
     ========================================================================== */
  function initDisasterRecoverySimulator() {
    const failTypeSelect = document.getElementById("dr-fail-select");
    const btnTrigger = document.getElementById("dr-btn-trigger");
    const outputConsole = document.getElementById("dr-console-output");

    if (!btnTrigger || !outputConsole) return;

    const failures = {
      gpu_oom: {
        title: "Caída de Motor de Inferencia Llama (GPU Out of Memory)",
        procedure: `[1. Alerta Crítica Detectada]\nvLLM Engine returned HTTP 503 Service Unavailable (VRAM 100% Exhausted)\n\n[2. Protocolo de Failover Automático Activado]\n- El Circuit Breaker conmuta las peticiones a un modelo ligero de respaldo (Llama-3.1-8B cuantizado en FP8).\n- Se despacha mensaje empático a WhatsApp: "Estamos actualizando nuestro asistente, tu mensaje está en cola y será atendido en unos segundos."\n- Notificación push enviada a PagerDuty / Canal Slack de DevOps.\n- Reinicio automático del contenedor Docker de inferencia.`
      },
      meta_timeout: {
        title: "Degradación de Red en Graph API de Meta (HTTP 504)",
        procedure: `[1. Alerta de Envío Detectada]\nPOST https://graph.facebook.com/v20.0/messages timed out after 5000ms\n\n[2. Protocolo de Tolerancia a Fallos]\n- La respuesta generada por Llama 3 se encola en Redis (Queue: pending_whatsapp_messages).\n- Tarea Celery / Background Task ejecuta reintento con Retroceso Exponencial (Exponential Backoff: 1s, 2s, 4s, 8s).\n- El mensaje se entrega exitosamente al normalizarse la red sin pérdida de datos.`
      }
    };

    btnTrigger.addEventListener("click", function(){
      const val = failTypeSelect.value;
      const data = failures[val];
      if (!data) return;

      outputConsole.textContent = `=== SIMULACIÓN DE CONTINGENCIA EN PRODUCCIÓN ===\nEscenario: ${data.title}\n\n${data.procedure}`;
      if (window.SOUND) window.SOUND.playPop(310);
    });
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
              feedback.innerHTML = '<span style="color:#059669; font-weight:700;">¡Respuesta Correcta!</span> Has demostrado dominio completo sobre seguridad, despliegue continuo y telemetría.';
              feedback.style.display = "block";
            }
          } else {
            opt.classList.add("incorrect");
            if (window.SOUND) window.SOUND.playPop(220);
            if (feedback) {
              feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">Respuesta Incorrecta.</span> Revisa los estándares de producción de Meta AI y vuelve a intentarlo.';
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
