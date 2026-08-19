/**
 * CLASE 4: Pipeline Completo — De Notebook a Producción con FastAPI
 * Lógica interactiva para simuladores, Swagger Playground, inyector de fallos y calculadora de latencia.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de KaTeX
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }

  // Barra de progreso de lectura
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // Motor de Quizzes
  initQuizEngine();

  // Motor de Glosario Filtrable
  initGlossary();

  // Banco 1.4.1: Simulador de Pipeline Integral en 4 Fases
  initPipelineFlowSimulator();

  // Banco 1.4.2: Playground Interactivo FastAPI / Swagger UI
  initFastApiSwaggerPlayground();

  // Banco 1.4.3: Inyector de Fallos Controlados y Auditor E2E
  initE2EFailureInjector();

  // Banco 1.4.4: Calculadora de Latencia MLOps y SLA
  initLatencySlaCalculator();
});

/* ==========================================================================
   MOTOR DE QUIZZES CON CONTADOR, FEEDBACK Y CERTIFICADO
   ========================================================================== */
function initQuizEngine() {
  const quizBoxes = document.querySelectorAll('.quiz-box');
  const certDate = document.getElementById('cert-date');
  if (certDate) {
    certDate.textContent = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function updateScore() {
    let correct = 0;
    quizBoxes.forEach(box => {
      if (box.querySelector('.quiz-option.correct')) correct++;
    });
    const certPanel = document.getElementById('certificate-panel');
    if (certPanel && correct >= quizBoxes.length && quizBoxes.length > 0) {
      certPanel.style.display = 'block';
    }
  }

  quizBoxes.forEach(box => {
    const options = box.querySelectorAll('.quiz-option');
    const feedback = box.querySelector('.quiz-feedback');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (box.classList.contains('answered')) return;
        box.classList.add('answered');

        const isCorrect = opt.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          opt.classList.add('correct');
          if (feedback) {
            feedback.innerHTML = '<span style="color:#059669; font-weight:700;">¡Respuesta Correcta!</span> Has identificado con precisión el principio de arquitectura productiva.';
            feedback.style.display = 'block';
          }
        } else {
          opt.classList.add('incorrect');
          options.forEach(o => {
            if (o.getAttribute('data-correct') === 'true') o.classList.add('correct');
          });
          if (feedback) {
            feedback.innerHTML = '<span style="color:#ef4444; font-weight:700;">Respuesta Incorrecta.</span> Revisa la justificación técnica y la opción marcada en verde.';
            feedback.style.display = 'block';
          }
        }
        updateScore();
      });
    });
  });
}

/* ==========================================================================
   MOTOR DE GLOSARIO TÉCNICO FILTRABLE Y BUSCADOR
   ========================================================================== */
function initGlossary() {
  const searchInput = document.getElementById('glossary-search-input');
  const filterBtns = document.querySelectorAll('.glossary-filter-pill');
  const rows = document.querySelectorAll('.glossary-row-item');

  function filterRows() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.glossary-filter-pill.active');
    const activeCat = activeBtn ? activeBtn.getAttribute('data-category') : 'todos';

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowCats = (row.getAttribute('data-category') || '').split(' ');
      const matchesSearch = query === '' || text.includes(query);
      const matchesCat = activeCat === 'todos' || rowCats.includes(activeCat);

      if (matchesSearch && matchesCat) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterRows);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterRows();
    });
  });
}

/* ==========================================================================
   BANCO 1.4.1: SIMULADOR DE PIPELINE INTEGRAL (4 ETAPAS)
   ========================================================================== */
function initPipelineFlowSimulator() {
  const stepPills = document.querySelectorAll('.pipeline-stage-pill');
  const stageTitle = document.getElementById('pipe-stage-title');
  const stageDesc = document.getElementById('pipe-stage-desc');
  const stageToolBadge = document.getElementById('pipe-stage-tool');
  const stageArtifact = document.getElementById('pipe-stage-artifact');
  const stageMetric = document.getElementById('pipe-stage-metric');
  const stageCode = document.getElementById('pipe-stage-code');

  if (!stageTitle) return;

  const STAGES = {
    '1': {
      title: 'Etapa 1: Ingesta, Limpieza y Formateo de Datos SFT',
      desc: 'Los datos crudos de clientes y bases de datos se filtran, anonimizan (PII) y transforman a registros JSONL con delimitadores oficiales de Meta Llama 3.',
      tool: 'Pandas / HuggingFace Datasets',
      artifact: 'train_sft_clean.jsonl (10,000 pares)',
      metric: '99.8% Integridad de Esquema Pydantic',
      code: `# 1. Validación de esquema JSONL con Pydantic
from pydantic import BaseModel, Field

class Turn(BaseModel):
    role: str
    content: str

class SFTRecord(BaseModel):
    messages: list[Turn] = Field(min_items=2)`
    },
    '2': {
      title: 'Etapa 2: Fine-Tuning PEFT con Adaptadores LoRA / QLoRA',
      desc: 'Entrenamiento supervisado de matrices de bajo rango ($W_0 + BA$) con Loss Masking en GPU NVIDIA comercial con cuantización NF4 en 4 bits.',
      tool: 'TRL / PEFT / SFTTrainer',
      artifact: 'adapter_model.safetensors (16 MB)',
      metric: 'Perplexity: 2.14 | Train Loss: 0.82',
      code: `# 2. Entrenamiento con SFTTrainer y LoRA
from trl import SFTTrainer
from peft import LoraConfig

lora_cfg = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
trainer = SFTTrainer(model=base, peft_config=lora_cfg, train_dataset=ds)`
    },
    '3': {
      title: 'Etapa 3: Evaluación Sistemática y Benchmarks Cuantitativos',
      desc: 'Validación en conjunto ciego de pruebas midiendo BLEU-4, ROUGE-L, Perplexity y auditoría de seguridad automatizada con Llama Guard 3.',
      tool: 'Evaluate / Llama Guard 3 / PyTest',
      artifact: 'eval_report_v1.json (Métricas SOTA)',
      metric: 'ROUGE-L: 0.89 | Llama Guard: 0% Violaciones',
      code: `# 3. Evaluación de exactitud y seguridad
from evaluate import load
rouge = load('rouge')
results = rouge.compute(predictions=preds, references=refs)
assert results['rougeL'] > 0.85, "Fallo de regresión en evaluación"`
    },
    '4': {
      title: 'Etapa 4: Empaquetado y Despliegue en Producción con FastAPI',
      desc: 'Fusión de pesos con merge_and_unload(), empaquetado en contenedor Docker multi-etapa y servicio asíncrono con Uvicorn y streaming SSE.',
      tool: 'FastAPI / Uvicorn / Docker',
      artifact: 'docker.io/enterprise/llama3-service:v1.0',
      metric: 'TTFT: 82ms | Throughput: 145 tok/s',
      code: `# 4. Microservicio FastAPI listo para WhatsApp y Web
from fastapi import FastAPI
app = FastAPI(title="Llama 3 SFT Microservice", version="1.0.0")

@app.post("/v1/chat/completions")
async def chat(req: ChatRequest):
    return await inference_engine.generate(req)`
    }
  };

  stepPills.forEach(pill => {
    pill.addEventListener('click', () => {
      stepPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const st = pill.getAttribute('data-stage');
      const data = STAGES[st];
      if (data) {
        stageTitle.textContent = data.title;
        stageDesc.textContent = data.desc;
        if (stageToolBadge) stageToolBadge.textContent = data.tool;
        if (stageArtifact) stageArtifact.textContent = data.artifact;
        if (stageMetric) stageMetric.textContent = data.metric;
        if (stageCode) stageCode.textContent = data.code;
      }
    });
  });
}

/* ==========================================================================
   BANCO 1.4.2: FASTAPI & SWAGGER UI PLAYGROUND EN VIVO
   ========================================================================== */
function initFastApiSwaggerPlayground() {
  const payloadEditor = document.getElementById('api-payload-editor');
  const sendBtn = document.getElementById('api-send-btn');
  const statusCodeBadge = document.getElementById('api-status-code');
  const responseTimeBadge = document.getElementById('api-response-time');
  const responseBody = document.getElementById('api-response-body');
  const headerDetails = document.getElementById('api-response-headers');

  if (!sendBtn || !payloadEditor) return;

  const PRESET_PAYLOADS = {
    'valid': {
      "model": "meta-llama/Meta-Llama-3-8B-Instruct",
      "messages": [
        { "role": "system", "content": "Eres un asistente financiero corporativo experto." },
        { "role": "user", "content": "¿Cuál es la fórmula del Valor Presente Neto (VPN)?" }
      ],
      "temperature": 0.2,
      "max_tokens": 150
    },
    'invalid-types': {
      "model": "meta-llama/Meta-Llama-3-8B-Instruct",
      "messages": "Esto debería ser un arreglo de mensajes, no un string",
      "temperature": 4.5,
      "max_tokens": -20
    },
    'empty-prompt': {
      "model": "meta-llama/Meta-Llama-3-8B-Instruct",
      "messages": []
    }
  };

  const presetBtns = document.querySelectorAll('.api-preset-pill');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-payload');
      if (PRESET_PAYLOADS[key]) {
        payloadEditor.value = JSON.stringify(PRESET_PAYLOADS[key], null, 2);
      }
    });
  });

  sendBtn.addEventListener('click', () => {
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="loading-spinner"></span> Procesando Request...';

    const startTime = performance.now();

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style="margin-right:4px;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        <span>Enviar HTTP Request</span>
      `;

      const raw = payloadEditor.value.trim();
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        renderError(400, "Bad Request: JSON malformado sintácticamente.", startTime);
        return;
      }

      // Validar esquema Pydantic
      if (!parsed.messages || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
        renderPydanticValidationError(startTime, "messages", "field required / value must be a non-empty list");
        return;
      }
      if (parsed.temperature !== undefined && (parsed.temperature < 0 || parsed.temperature > 2.0)) {
        renderPydanticValidationError(startTime, "temperature", "ensure this value is between 0.0 and 2.0");
        return;
      }
      if (parsed.max_tokens !== undefined && parsed.max_tokens <= 0) {
        renderPydanticValidationError(startTime, "max_tokens", "ensure this value is greater than 0");
        return;
      }

      // 200 OK Exitoso
      renderSuccess(parsed, startTime);
    }, 450);
  });

  function renderSuccess(req, startTime) {
    const elapsed = Math.round(performance.now() - startTime + 85);
    if (statusCodeBadge) {
      statusCodeBadge.textContent = '200 OK';
      statusCodeBadge.className = 'status-pill-safe';
    }
    if (responseTimeBadge) responseTimeBadge.textContent = `${elapsed} ms (TTFT: 78ms)`;

    const mockResponse = {
      "id": "chatcmpl-" + Math.random().toString(36).substring(2, 11),
      "object": "chat.completion",
      "created": Math.floor(Date.now() / 1000),
      "model": req.model || "meta-llama/Meta-Llama-3-8B-Instruct",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "La fórmula del Valor Presente Neto (VPN) es:\n\nVPN = \\sum_{t=1}^{n} \\frac{R_t}{(1 + k)^t} - I_0\n\nDonde R_t son los flujos de caja en el período t, k es la tasa de descuento e I_0 es la inversión inicial."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 32,
        "completion_tokens": 58,
        "total_tokens": 90
      }
    };

    if (responseBody) responseBody.textContent = JSON.stringify(mockResponse, null, 2);
    if (headerDetails) {
      headerDetails.innerHTML = `
content-type: application/json; charset=utf-8
server: uvicorn / fastapi
x-process-time: ${elapsed}ms
x-llama-engine: vLLM PagedAttention
      `.trim();
    }
  }

  function renderPydanticValidationError(startTime, field, msg) {
    const elapsed = Math.round(performance.now() - startTime + 12);
    if (statusCodeBadge) {
      statusCodeBadge.textContent = '422 Unprocessable Entity';
      statusCodeBadge.className = 'status-pill-danger';
    }
    if (responseTimeBadge) responseTimeBadge.textContent = `${elapsed} ms`;

    const errorResp = {
      "detail": [
        {
          "loc": ["body", field],
          "msg": msg,
          "type": "value_error"
        }
      ]
    };
    if (responseBody) responseBody.textContent = JSON.stringify(errorResp, null, 2);
    if (headerDetails) {
      headerDetails.innerHTML = `
content-type: application/json
server: uvicorn / fastapi
x-validation-error: pydantic_v2
      `.trim();
    }
  }

  function renderError(code, detail, startTime) {
    const elapsed = Math.round(performance.now() - startTime + 8);
    if (statusCodeBadge) {
      statusCodeBadge.textContent = `${code} Error`;
      statusCodeBadge.className = 'status-pill-danger';
    }
    if (responseTimeBadge) responseTimeBadge.textContent = `${elapsed} ms`;
    if (responseBody) responseBody.textContent = JSON.stringify({ "error": detail }, null, 2);
  }
}

/* ==========================================================================
   BANCO 1.4.3: INYECTOR DE FALLOS CONTROLADOS & AUDITOR E2E
   ========================================================================== */
function initE2EFailureInjector() {
  const failureButtons = document.querySelectorAll('.failure-scenario-btn');
  const reportContainer = document.getElementById('failure-test-report');
  const badgeResult = document.getElementById('failure-badge-result');
  const traceTerminal = document.getElementById('failure-trace-terminal');

  if (!reportContainer) return;

  const SCENARIOS = {
    'chroma-down': {
      title: 'Fallo Inyectado: Base Vectorial ChromaDB no responde (Connection Refused)',
      verdict: 'Manejado Gracefully (HTTP 503 con Fallback)',
      badgeClass: 'status-pill-safe',
      desc: 'El microservicio detectó la caída de la base vectorial en <15ms y ejecutó el fallback de degradación controlada respondiendo con la memoria paramétrica del modelo base sin lanzar 500 Internal Server Error no capturado.',
      trace: `[CRITICAL] 2026-08-18 21:14:02 - httpx.ConnectError: [Errno 111] Connection refused (chromadb:8000)\n[INFO] Activando Circuit Breaker: Fallback a Llama 3 Base sin contexto RAG.\n[200 OK] Response entregada al usuario con aviso de degradación en 98ms.`
    },
    'empty-docs': {
      title: 'Fallo Inyectado: Documento buscado no existe en el corpus (Score Similitud < 0.35)',
      verdict: 'Manejado Gracefully (Respuesta Informativa)',
      badgeClass: 'status-pill-safe',
      desc: 'El filtro de similitud coseno detectó score = 0.18. En lugar de alucinar o inventar una respuesta, el sistema emitió: "No se encontró información oficial en el repositorio corporativo para responder con certeza."',
      trace: `[DEBUG] Vector query: "política de viajes internacionales 2027"\n[WARN] Top-1 chunk cosine similarity = 0.182 (< umbral 0.35)\n[INFO] Bloqueando alucinación paramétrica -> Emitiendo template de abstención segura.`
    },
    'rate-limit': {
      title: 'Fallo Inyectado: Ráfaga de 250 requests concurrentes (Exceso de Concurrencia)',
      verdict: 'Manejado Gracefully (HTTP 429 Too Many Requests)',
      badgeClass: 'status-pill-safe',
      desc: 'El middleware de Token Bucket rate-limiting protegió la memoria VRAM de la GPU rechazando el exceso con cabecera Retry-After: 5s, evitando que el servidor colapsara por Out-Of-Memory (OOM).',
      trace: `[WARN] RateLimiter: IP 192.168.1.105 excedió 100 req/min (actual: 250 req/min)\n[429] Too Many Requests emitido con Retry-After: 5s.\n[METRICS] GPU VRAM estable en 5.2 GB / 24 GB.`
    },
    'timeout': {
      title: 'Fallo Inyectado: Inferencia Lenta / Timeout en Generación (> 10.0s)',
      verdict: 'Manejado Gracefully (HTTP 504 Gateway Timeout)',
      badgeClass: 'status-pill-safe',
      desc: 'El asyncio.timeout(10.0) canceló la tarea pendiente para no retener el worker ASGI liberando el slot para la siguiente petición de usuario.',
      trace: `[ERROR] asyncio.TimeoutError: Llama 3 inference superó límite de 10.0s\n[504] Gateway Timeout entregado al cliente en 10.01s.\n[INFO] Worker ASGI liberado y listo para nuevas peticiones.`
    }
  };

  failureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      failureButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const scKey = btn.getAttribute('data-failure');
      const data = SCENARIOS[scKey];
      if (data) {
        reportContainer.innerHTML = `
          <div style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">
            ${data.title}
          </div>
          <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.55; margin:0 0 0.8rem 0;">
            ${data.desc}
          </p>
        `;
        if (badgeResult) {
          badgeResult.textContent = data.verdict;
          badgeResult.className = data.badgeClass;
        }
        if (traceTerminal) {
          traceTerminal.textContent = data.trace;
        }
      }
    });
  });
}

/* ==========================================================================
   BANCO 1.4.4: CALCULADORA DE LATENCIA MLOps & SLA
   ========================================================================== */
function initLatencySlaCalculator() {
  const usersSlider = document.getElementById('calc-users-slider');
  const tokensSlider = document.getElementById('calc-tokens-slider');
  const hwSelect = document.getElementById('calc-hw-select');

  const usersVal = document.getElementById('calc-users-val');
  const tokensVal = document.getElementById('calc-tokens-val');

  const metricTtft = document.getElementById('calc-metric-ttft');
  const metricTotalTime = document.getElementById('calc-metric-total-time');
  const metricThroughput = document.getElementById('calc-metric-throughput');
  const metricSla = document.getElementById('calc-metric-sla');
  const diagnosisText = document.getElementById('calc-diagnosis-text');

  if (!usersSlider || !tokensSlider) return;

  function recalculate() {
    const users = parseInt(usersSlider.value, 10);
    const tokens = parseInt(tokensSlider.value, 10);
    const hwFactor = parseFloat(hwSelect ? hwSelect.value : '1.0');

    if (usersVal) usersVal.textContent = `${users} usuarios concurrentes`;
    if (tokensVal) tokensVal.textContent = `${tokens} tokens generados`;

    // TTFT base: 60ms * hwFactor + congestión por usuarios
    const baseTtft = Math.round(55 * hwFactor + (users * 2.8));
    // Velocidad de generación por usuario (tokens/s)
    const genSpeed = Math.max(15, Math.round((120 / hwFactor) / Math.sqrt(users)));
    // Tiempo de decodificación
    const decodeTimeMs = Math.round((tokens / genSpeed) * 1000);
    // Latencia Total E2E
    const totalLatencyMs = baseTtft + decodeTimeMs + 25; // +25ms red/FastAPI
    // Throughput total del cluster
    const clusterThroughput = Math.round(genSpeed * users);

    // Estimación de SLA de latencia (< 2.0s objetivo)
    const slaPass = totalLatencyMs <= 2000;
    const slaPercent = Math.max(92.0, (100 - (totalLatencyMs > 2000 ? (totalLatencyMs - 2000) / 100 : 0))).toFixed(1);

    if (metricTtft) metricTtft.textContent = `${baseTtft} ms`;
    if (metricTotalTime) metricTotalTime.textContent = `${(totalLatencyMs / 1000).toFixed(2)} s`;
    if (metricThroughput) metricThroughput.textContent = `${clusterThroughput} tok/s`;
    if (metricSla) {
      metricSla.textContent = `${slaPercent}% SLA`;
      metricSla.style.color = slaPass ? '#059669' : '#eab308';
    }

    if (diagnosisText) {
      if (totalLatencyMs < 1500) {
        diagnosisText.innerHTML = `<b>Régimen de Excelencia:</b> Latencia total de <b>${(totalLatencyMs/1000).toFixed(2)}s</b> para ${users} usuarios simultáneos. La experiencia conversacional es instantánea y fluida para canales como WhatsApp o Web.`;
      } else if (totalLatencyMs <= 3000) {
        diagnosisText.innerHTML = `<b>Régimen Aceptable con Streaming:</b> Latencia de <b>${(totalLatencyMs/1000).toFixed(2)}s</b>. Es mandatorio utilizar <i>Server-Sent Events (SSE)</i> para que el usuario reciba el primer token en ${baseTtft}ms sin percibir demora.`;
      } else {
        diagnosisText.innerHTML = `<b>Alerta de Congestión MLOps:</b> Latencia de <b>${(totalLatencyMs/1000).toFixed(2)}s</b> supera el umbral conversacional. Se recomienda escalar a réplicas vLLM con Tensor Parallelism o habilitar cuantización AWQ/GGUF.`;
      }
    }
  }

  usersSlider.addEventListener('input', recalculate);
  tokensSlider.addEventListener('input', recalculate);
  if (hwSelect) hwSelect.addEventListener('change', recalculate);

  recalculate();
}
