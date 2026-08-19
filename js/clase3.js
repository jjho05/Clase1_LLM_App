/**
 * CLASE 3: FINE-TUNING Y EVALUACIÓN DE MODELOS LLAMA
 * Lógica Interactiva para Bancos de Pruebas 1.3.1 a 1.3.7
 * Curso: Inteligencia Artificial Aplicada con Llama
 */

(function () {
 'use strict';

 document.addEventListener('DOMContentLoaded', () => {
 initDecisionMatrix();
 initLoraCalculator();
 initVramSimulator();
 initDatasetValidator();
 initHyperparameterPlanner();
 initNlpMetricsCalculator();
 initLlmJudgeSimulator();
 });

 /* ==========================================================================
 BANCO 1.3.1: MATRIZ DE DECISIÓN (PROMPTING VS RAG VS FINE-TUNING)
 ========================================================================== */
 function initDecisionMatrix() {
 const caseSelect = document.getElementById('decision-case-select');
 const updateFreqSlider = document.getElementById('decision-freq-slider');
 const styleNeedSlider = document.getElementById('decision-style-slider');
 const budgetSlider = document.getElementById('decision-budget-slider');
 const hallucinationTolSlider = document.getElementById('decision-hallucination-slider');

 const recTitle = document.getElementById('decision-rec-title');
 const recBadge = document.getElementById('decision-rec-badge');
 const recDesc = document.getElementById('decision-rec-desc');
 const scoreRagEl = document.getElementById('decision-score-rag');
 const scoreFtEl = document.getElementById('decision-score-ft');
 const scorePromptEl = document.getElementById('decision-score-prompt');
 const scoreHybridEl = document.getElementById('decision-score-hybrid');

 if (!updateFreqSlider) return;

 const PRESET_CASES = {
 'custom': null,
 'support-docs': { freq: 90, style: 20, budget: 30, hall: 10 },
 'dsl-code': { freq: 10, style: 95, budget: 70, hall: 30 },
 'ticket-classifier': { freq: 15, style: 60, budget: 20, hall: 40 },
 'legal-advisor': { freq: 85, style: 75, budget: 85, hall: 5 },
 'brand-persona': { freq: 20, style: 90, budget: 50, hall: 50 }
 };

 function updateSlidersFromCase(caseKey) {
 const preset = PRESET_CASES[caseKey];
 if (preset) {
 updateFreqSlider.value = preset.freq;
 styleNeedSlider.value = preset.style;
 budgetSlider.value = preset.budget;
 hallucinationTolSlider.value = preset.hall;
 }
 // Actualizar píldoras activas
 const pills = document.querySelectorAll('#decision-preset-pills .preset-pill-btn');
 pills.forEach(btn => {
 if (btn.getAttribute('data-case') === caseKey) btn.classList.add('active');
 else btn.classList.remove('active');
 });
 calculateDecision();
 }

 function calculateDecision() {
 const freq = parseInt(updateFreqSlider.value, 10);
 const style = parseInt(styleNeedSlider.value, 10);
 const budget = parseInt(budgetSlider.value, 10);
 const hall = parseInt(hallucinationTolSlider.value, 10);

 // Actualizar etiquetas numéricas
 const freqValEl = document.getElementById('freq-val');
 const styleValEl = document.getElementById('style-val');
 const budgetValEl = document.getElementById('budget-val');
 const hallValEl = document.getElementById('hall-val');
 if (freqValEl) freqValEl.textContent = freq > 70 ? 'Muy Alta (Diaria)' : freq > 30 ? 'Media (Mensual)' : 'Baja (Estática)';
 if (styleValEl) styleValEl.textContent = style > 70 ? 'Extrema (Sintaxis Estricta)' : style > 30 ? 'Moderada' : 'Estándar';
 if (budgetValEl) budgetValEl.textContent = budget > 70 ? 'Alto (Cluster GPUs)' : budget > 30 ? 'Medio (1x GPU)' : 'Bajo ($0 / API)';
 if (hallValEl) hallValEl.textContent = hall < 20 ? 'Cero Tolerancia' : hall < 60 ? 'Baja / Media' : 'Alta (Creativo)';

 // Puntuaciones
 let ragScore = (freq * 0.45) + ((100 - hall) * 0.35) + ((100 - budget) * 0.20);
 let ftScore = (style * 0.50) + ((100 - freq) * 0.25) + (budget * 0.25);
 let promptScore = ((100 - style) * 0.35) + ((100 - freq) * 0.35) + ((100 - budget) * 0.30);
 let hybridScore = (ragScore * 0.5) + (ftScore * 0.5) + (budget > 60 ? 15 : -10);

 // Normalizar 0-100
 ragScore = Math.min(100, Math.max(10, Math.round(ragScore)));
 ftScore = Math.min(100, Math.max(10, Math.round(ftScore)));
 promptScore = Math.min(100, Math.max(10, Math.round(promptScore)));
 hybridScore = Math.min(100, Math.max(10, Math.round(hybridScore)));

 if (scoreRagEl) scoreRagEl.style.width = ragScore + '%';
 if (scoreFtEl) scoreFtEl.style.width = ftScore + '%';
 if (scorePromptEl) scorePromptEl.style.width = promptScore + '%';
 if (scoreHybridEl) scoreHybridEl.style.width = hybridScore + '%';

 const ragVal = document.getElementById('score-rag-val');
 const ftVal = document.getElementById('score-ft-val');
 const promptVal = document.getElementById('score-prompt-val');
 const hybridVal = document.getElementById('score-hybrid-val');
 if (ragVal) ragVal.textContent = ragScore + '%';
 if (ftVal) ftVal.textContent = ftScore + '%';
 if (promptVal) promptVal.textContent = promptScore + '%';
 if (hybridVal) hybridVal.textContent = hybridScore + '%';

 // Diagnóstico principal
 if (freq > 65 && style < 45) {
 recTitle.textContent = 'Enfoque Recomendado: RAG Semántico (Retrieval-Augmented Generation)';
 recBadge.textContent = '100% RAG Puro';
 recBadge.className = 'status-pill-safe';
 recDesc.innerHTML = 'Tus datos cambian frecuentemente y necesitas cero alucinaciones con citas exactas. Fine-tuning <b>no</b> es la herramienta para inyectar hechos dinámicos; RAG resuelve esto a costo casi nulo y actualización inmediata.';
 } else if (style > 70 && freq < 35 && budget > 25) {
 recTitle.textContent = 'Enfoque Recomendado: Fine-Tuning Eficiente (LoRA / QLoRA)';
 recBadge.textContent = 'Fine-Tuning PEFT';
 recBadge.className = 'status-pill-active';
 recDesc.innerHTML = 'Necesitas enseñar un formato de salida rígido, una sintaxis de programación propietaria o un tono de voz especializado que el prompt base no logra reproducir consistentemente.';
 } else if (freq > 60 && style > 60) {
 recTitle.textContent = 'Enfoque Recomendado: Arquitectura Híbrida (RAG + Adaptador LoRA)';
 recBadge.textContent = 'Híbrido SOTA';
 recBadge.className = 'status-pill-pro';
 recDesc.innerHTML = 'La solución de grado industrial: entrena un adaptador LoRA para que Llama 3 domine el formato y la jerga de tu empresa, y conecta un pipeline RAG para inyectar la documentación viva en tiempo real.';
 } else {
 recTitle.textContent = 'Enfoque Recomendado: Prompt Engineering Avanzado (Few-Shot + CoT)';
 recBadge.textContent = 'Prompting Puro';
 recBadge.className = 'status-pill-neutral';
 recDesc.innerHTML = 'No necesitas entrenar pesos ni montar bases vectoriales. Un system prompt estructurado con 3 a 5 ejemplos demostrativos (Few-Shot) resolverá tu caso con latencia mínima y cero infraestructura extra.';
 }
 }

 if (caseSelect) {
 caseSelect.addEventListener('change', (e) => updateSlidersFromCase(e.target.value));
 }

 // Listener para píldoras
 const pills = document.querySelectorAll('#decision-preset-pills .preset-pill-btn');
 pills.forEach(btn => {
 btn.addEventListener('click', () => {
 const caseKey = btn.getAttribute('data-case');
 if (caseSelect) caseSelect.value = caseKey;
 updateSlidersFromCase(caseKey);
 });
 });

 [updateFreqSlider, styleNeedSlider, budgetSlider, hallucinationTolSlider].forEach(slider => {
 slider.addEventListener('input', () => {
 if (caseSelect) caseSelect.value = 'custom';
 const customBtn = document.querySelector('#decision-preset-pills button[data-case="custom"]');
 if (customBtn) {
 pills.forEach(b => b.classList.remove('active'));
 customBtn.classList.add('active');
 }
 calculateDecision();
 });
 });

 calculateDecision();
 }

 /* ==========================================================================
  BANCO 1.3.2: CALCULADORA INTERACTIVA DE MATRICES LoRA & VISUALIZADOR
  ========================================================================== */
  function initLoraCalculator() {
    const modelSelect = document.getElementById('lora-model-select');
    const targetSelect = document.getElementById('lora-target-select');
    const rankSlider = document.getElementById('lora-rank-slider');
    const alphaSlider = document.getElementById('lora-alpha-slider');

    if (!rankSlider || !alphaSlider) return;

    function renderLora() {
      const model = modelSelect ? modelSelect.value : '8b'; // '8b', '70b', '405b'
      const target = targetSelect ? targetSelect.value : 'all-linear'; // 'qv', 'qkov', 'all-linear'
      const r = parseInt(rankSlider.value, 10);
      const alpha = parseInt(alphaSlider.value, 10);

      // Dimensiones de Llama 3
      let d_model = 4096;
      let num_layers = 32;
      let total_params = 8030000000;
      if (model === '70b') {
        d_model = 8192;
        num_layers = 80;
        total_params = 70600000000;
      } else if (model === '405b') {
        d_model = 16384;
        num_layers = 126;
        total_params = 405000000000;
      }

      // Conteo de matrices adaptadas por capa
      let matrices_per_layer = 2; // q, v
      if (target === 'qkov') matrices_per_layer = 4; // q, k, v, o
      if (target === 'all-linear') matrices_per_layer = 7; // q, k, v, o, gate, up, down

      // Parámetros LoRA por matriz: B (d x r) + A (r x d) = 2 * d * r
      const lora_params_per_matrix = 2 * d_model * r;
      const total_lora_params = lora_params_per_matrix * matrices_per_layer * num_layers;
      const lora_percent = (total_lora_params / total_params) * 100;
      const lora_vram_mb = (total_lora_params * 2) / (1024 * 1024); // FP16: 2 bytes
      const scaling_factor = alpha / r;

      // Actualizar Badges de Sliders
      const rValEl = document.getElementById('lora-rank-val');
      const aValEl = document.getElementById('lora-alpha-val');
      if (rValEl) rValEl.textContent = `r = ${r}`;
      if (aValEl) aValEl.textContent = `α = ${alpha}`;

      // Actualizar Diagrama DOM
      const scalingEl = document.getElementById('lora-scaling-factor');
      const dimW0 = document.getElementById('lora-dim-w0');
      const scaleVal = document.getElementById('lora-scale-val');
      const dimB = document.getElementById('lora-dim-b');
      const dimA = document.getElementById('lora-dim-a');
      const resultFormula = document.getElementById('lora-result-formula');
      const inlineTrainable = document.getElementById('lora-inline-trainable');
      const shapeB = document.getElementById('lora-shape-b');
      const shapeA = document.getElementById('lora-shape-a');

      if (scalingEl) scalingEl.textContent = `Escalado: ΔW = ${scaling_factor.toFixed(2)} · (B·A)`;
      if (dimW0) dimW0.textContent = `${d_model} × ${d_model}`;
      if (scaleVal) scaleVal.textContent = `α/r = ${scaling_factor.toFixed(2)}`;
      if (dimB) dimB.textContent = `${d_model} × ${r}`;
      if (dimA) dimA.textContent = `${r} × ${d_model}`;
      if (resultFormula) resultFormula.textContent = `h = W₀x + ${scaling_factor.toFixed(2)} · (B·A)x`;
      if (inlineTrainable) {
        inlineTrainable.textContent = total_lora_params >= 1e6 
          ? `${(total_lora_params / 1e6).toFixed(1)}M` 
          : `${(total_lora_params / 1e3).toFixed(0)}k`;
      }

      // Escala visual reactiva para matrices B y A
      if (shapeB) {
        const bWidth = Math.max(28, Math.min(50, 24 + r * 0.2));
        shapeB.style.width = `${bWidth}px`;
      }
      if (shapeA) {
        const aHeight = Math.max(28, Math.min(50, 24 + r * 0.2));
        shapeA.style.height = `${aHeight}px`;
      }

      // Actualizar Tarjetas de Métricas de Compresión
      const totalBaseEl = document.getElementById('lora-total-base');
      const totalTrainableEl = document.getElementById('lora-total-trainable');
      const percentEl = document.getElementById('lora-percent');
      const adapterVramEl = document.getElementById('lora-adapter-vram');

      if (totalBaseEl) totalBaseEl.textContent = (total_params / 1e9).toFixed(1) + 'B Parámetros';
      if (totalTrainableEl) totalTrainableEl.textContent = total_lora_params.toLocaleString() + ' params';
      if (percentEl) percentEl.textContent = lora_percent.toFixed(3) + '% del modelo';
      if (adapterVramEl) adapterVramEl.textContent = lora_vram_mb.toFixed(1) + ' MB (FP16)';
    }

    [rankSlider, alphaSlider].forEach(el => {
      el.addEventListener('input', renderLora);
      el.addEventListener('change', renderLora);
    });

    if (modelSelect) {
      modelSelect.addEventListener('change', renderLora);
    }
    if (targetSelect) {
      targetSelect.addEventListener('change', renderLora);
    }

    // Píldoras de Modelo LoRA
    const modelPills = document.querySelectorAll('#lora-model-pills .preset-pill-btn');
    modelPills.forEach(btn => {
      btn.addEventListener('click', () => {
        modelPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (modelSelect) modelSelect.value = btn.getAttribute('data-model');
        renderLora();
      });
    });

    // Píldoras de Módulos Objetivo LoRA
    const targetPills = document.querySelectorAll('#lora-target-pills .preset-pill-btn');
    targetPills.forEach(btn => {
      btn.addEventListener('click', () => {
        targetPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (targetSelect) targetSelect.value = btn.getAttribute('data-target');
        renderLora();
      });
    });

    renderLora();
  }

  /* ==========================================================================
 BANCO 1.3.3: SIMULADOR DE VRAM DE ENTRENAMIENTO (FULL VS LORA VS QLORA)
 ========================================================================== */
 function initVramSimulator() {
 const modelSelect = document.getElementById('vram-model-select');
 const methodSelect = document.getElementById('vram-method-select');
 const seqLenSlider = document.getElementById('vram-seq-slider');
 const gpuSelect = document.getElementById('vram-gpu-select');

 if (!modelSelect || !methodSelect || !gpuSelect) return;

 function calculateVram() {
 const model = modelSelect.value; // '8b', '70b'
 const method = methodSelect.value; // 'full-fp16', 'lora-fp16', 'qlora-int4'
 const seqLen = parseInt(seqLenSlider.value, 10); // 512, 1024, 2048, 4096, 8192
 const gpu = gpuSelect.value; // 'colab-15', 'rtx4060-8', 'rtx4090-24', 'a100-80', 'mac-36'

 let params = model === '8b' ? 8.03 : 70.6; // Billones
 let gpuVram = 24; // GB
 let gpuName = 'NVIDIA RTX 4090 (24 GB)';
 if (gpu === 'colab-15') { gpuVram = 15; gpuName = 'Google Colab Free (Tesla T4 15 GB)'; }
 if (gpu === 'rtx4060-8') { gpuVram = 8; gpuName = 'NVIDIA RTX 4060 (8 GB)'; }
 if (gpu === 'rtx4090-24') { gpuVram = 24; gpuName = 'NVIDIA RTX 4090 (24 GB)'; }
 if (gpu === 'a100-80') { gpuVram = 80; gpuName = 'NVIDIA A100 SXM (80 GB)'; }
 if (gpu === 'mac-36') { gpuVram = 36; gpuName = 'Apple Silicon M3 Max (36 GB UMA)'; }

 // 1. Memoria de Pesos Base
 let weightsGb = 0;
 if (method === 'full-fp16') weightsGb = params * 2.0; // 2 bytes (FP16)
 else if (method === 'lora-fp16') weightsGb = params * 2.0; // 2 bytes base
 else if (method === 'qlora-int4') weightsGb = params * 0.55; // 4 bits NF4 + Double Quant

 // 2. Memoria de Gradientes
 let gradientsGb = 0;
 if (method === 'full-fp16') gradientsGb = params * 2.0;
 else if (method === 'lora-fp16') gradientsGb = 0.08; // Solo adaptadores
 else if (method === 'qlora-int4') gradientsGb = 0.08; // Solo adaptadores

 // 3. Memoria de Estados del Optimizador (AdamW)
 let optimizerGb = 0;
 if (method === 'full-fp16') optimizerGb = params * 8.0; // 2 estados FP32 = 8 bytes/param
 else if (method === 'lora-fp16') optimizerGb = 0.32; // Solo adaptadores
 else if (method === 'qlora-int4') optimizerGb = 0.15; // Paged AdamW 8-bit

 // 4. Memoria de Activaciones (escala con seq_len y batch_size)
 const actFactor = seqLen / 2048;
 let activationsGb = 0;
 if (method === 'full-fp16') activationsGb = (model === '8b' ? 4.5 : 22.0) * actFactor;
 else activationsGb = (model === '8b' ? 1.8 : 8.5) * actFactor; // Con Gradient Checkpointing

 const totalVram = weightsGb + gradientsGb + optimizerGb + activationsGb;

 // Actualizar UI
 const seqValEl = document.getElementById('vram-seq-val');
 const totalVramEl = document.getElementById('vram-total-est');
 const gpuCapEl = document.getElementById('vram-gpu-cap');
 const badgeEl = document.getElementById('vram-status-badge');
 const descEl = document.getElementById('vram-status-desc');

 if (seqValEl) seqValEl.textContent = `${seqLen} tokens`;
 if (totalVramEl) totalVramEl.textContent = totalVram.toFixed(1) + ' GB';
 if (gpuCapEl) gpuCapEl.textContent = `Capacidad: ${gpuVram} GB (${gpuName})`;

 // Barras de desglose
 const barWeights = document.getElementById('bar-weights');
 const barGradients = document.getElementById('bar-gradients');
 const barOptimizer = document.getElementById('bar-optimizer');
 const barActivations = document.getElementById('bar-activations');

 if (barWeights) {
 barWeights.style.width = `${(weightsGb / gpuVram) * 100}%`;
 barWeights.title = `Pesos Base: ${weightsGb.toFixed(1)} GB`;
 }
 if (barGradients) {
 barGradients.style.width = `${(gradientsGb / gpuVram) * 100}%`;
 barGradients.title = `Gradientes: ${gradientsGb.toFixed(1)} GB`;
 }
 if (barOptimizer) {
 barOptimizer.style.width = `${(optimizerGb / gpuVram) * 100}%`;
 barOptimizer.title = `Optimizador: ${optimizerGb.toFixed(1)} GB`;
 }
 if (barActivations) {
 barActivations.style.width = `${(activationsGb / gpuVram) * 100}%`;
 barActivations.title = `Activaciones: ${activationsGb.toFixed(1)} GB`;
 }

 // Textos de desglose
 const txtWeights = document.getElementById('txt-weights');
 const txtGradients = document.getElementById('txt-gradients');
 const txtOptimizer = document.getElementById('txt-optimizer');
 const txtActivations = document.getElementById('txt-activations');
 if (txtWeights) txtWeights.textContent = `${weightsGb.toFixed(1)} GB`;
 if (txtGradients) txtGradients.textContent = `${gradientsGb.toFixed(2)} GB`;
 if (txtOptimizer) txtOptimizer.textContent = `${optimizerGb.toFixed(2)} GB`;
 if (txtActivations) txtActivations.textContent = `${activationsGb.toFixed(1)} GB`;

 // Diagnóstico de Viabilidad
 if (totalVram <= gpuVram * 0.85) {
 badgeEl.textContent = ' Viable y Estable (Holgura Segura)';
 badgeEl.className = 'status-pill-safe';
 descEl.innerHTML = `Excelente configuración. El entrenamiento de <b>Llama 3 ${model.toUpperCase()}</b> consumirá aproximadamente <b>${totalVram.toFixed(1)} GB</b> de los <b>${gpuVram} GB</b> disponibles en ${gpuName}. Margen libre: ${(gpuVram - totalVram).toFixed(1)} GB.`;
 } else if (totalVram <= gpuVram) {
 badgeEl.textContent = ' Límite Crítico (Riesgo de OOM)';
 badgeEl.className = 'status-pill-warning';
 descEl.innerHTML = `Consumo muy cercano al techo de memoria (${totalVram.toFixed(1)} / ${gpuVram} GB). Se recomienda reducir la longitud de contexto a ${Math.max(512, seqLen / 2)} tokens o habilitar <i>Paged Optimizers</i>.`;
 } else {
 badgeEl.textContent = ' Imposible: Error OOM (Out-Of-Memory)';
 badgeEl.className = 'status-pill-danger';
 descEl.innerHTML = `La configuración requiere <b>${totalVram.toFixed(1)} GB</b>, superando la capacidad física de ${gpuName} (${gpuVram} GB). Para entrenar este modelo, cambia el método a <b>QLoRA (4-bit NF4)</b> o utiliza una GPU de mayor capacidad.`;
 }
 }

 [modelSelect, methodSelect, seqLenSlider, gpuSelect].forEach(el => {
 el.addEventListener('input', calculateVram);
 el.addEventListener('change', calculateVram);
 });

 // Píldoras de Método de Entrenamiento
 const methodPills = document.querySelectorAll('#vram-method-pills .preset-pill-btn');
 methodPills.forEach(btn => {
 btn.addEventListener('click', () => {
 methodPills.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 methodSelect.value = btn.getAttribute('data-method');
 calculateVram();
 });
 });

 // Píldoras de Modelo VRAM
 const vramModelPills = document.querySelectorAll('#vram-model-pills .preset-pill-btn');
 vramModelPills.forEach(btn => {
 btn.addEventListener('click', () => {
 vramModelPills.forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 modelSelect.value = btn.getAttribute('data-model');
 calculateVram();
 });
 });

 calculateVram();
 }

 /* ==========================================================================
  BANCO 1.3.4: VALIDADOR JSONL & INSPECTOR DE LOSS MASKING CON EDITOR EN COLOR
  ========================================================================== */
  function initDatasetValidator() {
    const codeDisplay = document.getElementById('jsonl-code-display');
    const validateBtn = document.getElementById('jsonl-validate-btn');
    const formatBtn = document.getElementById('jsonl-format-btn');
    const copyBtn = document.getElementById('jsonl-copy-btn');
    const copyRawBtn = document.getElementById('jsonl-copy-raw-btn');
    const downloadBtn = document.getElementById('jsonl-download-btn');
    const statusBadge = document.getElementById('jsonl-status-badge');
    const streamContainer = document.getElementById('jsonl-rendered-preview');
    const tensorContainer = document.getElementById('jsonl-tensor-chips');
    const auditReport = document.getElementById('jsonl-audit-report');
    const auditDetail = document.getElementById('jsonl-audit-detail');
    const auditBadge = document.getElementById('jsonl-audit-badge');

    const metricTotal = document.getElementById('jsonl-metric-total');
    const metricMasked = document.getElementById('jsonl-metric-masked');
    const metricTrainable = document.getElementById('jsonl-metric-trainable');
    const metricEfficiency = document.getElementById('jsonl-metric-efficiency');

    if (!codeDisplay) return;

    // Presets como objetos JS para garantizar 100% JSON válido
    const PRESETS_DATA = {
      'support': {
        "messages": [
          {
            "role": "system",
            "content": "Eres un DBA senior experto en PostgreSQL. Proporciona diagnósticos con EXPLAIN ANALYZE e índices concisos."
          },
          {
            "role": "user",
            "content": "SELECT * FROM ordenes WHERE cliente_id=450 AND estado='PAGADO' tarda 4.2s con 10M filas. ¿Cómo la optimizo?"
          },
          {
            "role": "assistant",
            "content": "1. Crea índice compuesto B-Tree:\nCREATE INDEX idx_ord ON ordenes (cliente_id, estado);\n2. ANALYZE ordenes;\n3. El Seq Scan pasa a Index Scan en <5ms."
          }
        ]
      },
      'code': {
        "messages": [
          {
            "role": "system",
            "content": "Eres un arquitecto backend experto en FastAPI y Pydantic v2. Genera esquemas con tipado estricto."
          },
          {
            "role": "user",
            "content": "Crea un endpoint POST /transferencias con validación de saldo positivo y cuenta CLABE de 18 dígitos."
          },
          {
            "role": "assistant",
            "content": "from pydantic import BaseModel, Field\nfrom fastapi import FastAPI, HTTPException\n\nclass Transferencia(BaseModel):\n    monto: float = Field(gt=0, description='Monto mayor a cero')\n    clabe: str = Field(min_length=18, max_length=18, pattern=r'^\\d{18}$')\n\n@app.post('/transferencias')\nasync def procesar(t: Transferencia):\n    return {'status': 'success', 'monto': t.monto}"
          }
        ]
      },
      'medical': {
        "messages": [
          {
            "role": "system",
            "content": "Eres un sistema de triaje médico informativo. Siempre incluye clasificación de urgencia y descargo legal."
          },
          {
            "role": "user",
            "content": "Tengo dolor torácico opresivo que se irradia al brazo izquierdo y falta de aire desde hace 20 minutos."
          },
          {
            "role": "assistant",
            "content": "URGENCIA NIVEL 1 (Código Rojo - Posible Síndrome Coronario Agudo):\n1. Llama inmediatamente a emergencias (911) o acude a urgencias.\n2. Permanece en reposo absoluto.\n\n*Aviso médico obligatorio: Este asistente no reemplaza la atención médica presencial de urgencias.*"
          }
        ]
      }
    };

    // Función de resaltado de sintaxis JSON en HTML
    function colorizeJson(rawJsonStr) {
      const s = rawJsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const pattern = /(?:"(?:\u[a-zA-Z0-9]{4}|\[^u]|[^\"])*")\s*:|(?:"(?:\u[a-zA-Z0-9]{4}|\[^u]|[^\"])*")|(?:true|false|null|-?\d+(?:\.\d+)?)/g;
      return s.replace(pattern, match => {
        if (/:$/.test(match)) {
          return `<span class="code-var">${match.slice(0, -1)}</span>:`;
        } else if (/^"/.test(match)) {
          return `<span class="code-str">${match}</span>`;
        } else {
          return `<span class="code-num">${match}</span>`;
        }
      });
    }

    // Tokenizador aproximado BPE para Meta Llama 3
    function simulateTokenizer(text) {
      const rawTokens = text.match(/\w+|[^\w\s]|\s+/g) || [text];
      return rawTokens.filter(t => t.length > 0).map(tok => {
        let hash = 0;
        for (let i = 0; i < tok.length; i++) hash = (hash << 5) - hash + tok.charCodeAt(i);
        const inputId = Math.abs(hash % 128000) + 256;
        return { text: tok, inputId };
      });
    }

    let currentParsedObj = null;

    function renderFromObject(obj) {
      currentParsedObj = obj;
      const formattedJson = JSON.stringify(obj, null, 2);
      codeDisplay.innerHTML = colorizeJson(formattedJson);
      processDataset(obj);
    }

    function processDataset(parsed) {
      try {
        if (!parsed.messages || !Array.isArray(parsed.messages)) {
          throw new Error("El JSON debe contener un arreglo de 'messages'.");
        }

        if (statusBadge) {
          statusBadge.textContent = 'JSON Válido';
          statusBadge.style.color = '#34d399';
        }

        let totalTokens = 0;
        let maskedTokens = 0;
        let trainableTokens = 0;

        let streamHtml = '<div class="chat-timeline-container">';
        streamHtml += `
          <div class="sequence-boundary-chip">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L21 8l-9 9z"/></svg>
            <span>&lt;|begin_of_text|&gt; (Inicio de Secuencia)</span>
          </div>
        `;
        totalTokens += 1;
        maskedTokens += 1;

        let tensorHtml = '';
        tensorHtml += `<div class="tensor-token-chip masked" title="Token Especial: &lt;|begin_of_text|&gt;&#10;input_id: 128000&#10;labels: -100 (Ignorado)">&lt;|begin_of_text|&gt; <span class="chip-label">-100</span></div>`;

        parsed.messages.forEach(msg => {
          const role = msg.role || 'user';
          const content = msg.content || '';
          const isAssistant = role === 'assistant';
          const turnClass = role === 'system' ? 'system-turn' : isAssistant ? 'assistant-turn' : 'user-turn';

          // Turn Card
          streamHtml += `
            <div class="chat-turn-card ${turnClass}">
              <div class="chat-turn-header">
                <div class="chat-turn-role-group">
                  <span class="role-pill ${role}">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
                      ${role === 'system' ? '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>' : role === 'user' ? '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>' : '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'}
                    </svg>
                    <span>${role.toUpperCase()}</span>
                  </span>
                  <span class="special-token-tag">&lt;|start_header_id|&gt;${role}&lt;|end_header_id|&gt;</span>
                </div>
                <span class="loss-badge ${isAssistant ? 'badge-loss-active' : 'badge-loss-ignore'}">
                  ${isAssistant ? 'Gradiente Activo (Loss Target)' : 'Máscara: label = -100'}
                </span>
              </div>
              <div class="chat-turn-body">
                ${content.replace(/\n/g, '<br>')}
              </div>
              <div class="chat-turn-footer">
                <span class="special-token-tag">&lt;|eot_id|&gt;</span>
                <span style="font-size:0.72rem; color:var(--text-muted);">Fin de turno</span>
              </div>
            </div>
          `;

          // Tokenizer Simulation
          const tokens = simulateTokenizer(content);
          const headerTokens = 4;
          const eotTokens = 1;
          const count = tokens.length + headerTokens + eotTokens;

          totalTokens += count;
          if (isAssistant) {
            trainableTokens += tokens.length + eotTokens;
            maskedTokens += headerTokens;
          } else {
            maskedTokens += count;
          }

          // Tensor Chips
          tensorHtml += `<div class="tensor-token-chip masked" title="Header: &lt;|start_header_id|&gt;${role}&lt;|end_header_id|&gt;&#10;labels: -100">&lt;|${role}|&gt; <span class="chip-label">-100</span></div>`;
          tokens.forEach(tok => {
            if (isAssistant) {
              tensorHtml += `<div class="tensor-token-chip trainable" title="Token: '${tok.text}'&#10;input_id: ${tok.inputId}&#10;labels: ${tok.inputId} (Gradiente Activo)">${tok.text} <span class="chip-label">${tok.inputId}</span></div>`;
            } else {
              tensorHtml += `<div class="tensor-token-chip masked" title="Token: '${tok.text}'&#10;input_id: ${tok.inputId}&#10;labels: -100 (Ignorado)">${tok.text} <span class="chip-label">-100</span></div>`;
            }
          });
          tensorHtml += `<div class="tensor-token-chip ${isAssistant ? 'trainable' : 'masked'}" title="Token: &lt;|eot_id|&gt;&#10;input_id: 128009&#10;labels: ${isAssistant ? '128009' : '-100'}">&lt;|eot_id|&gt; <span class="chip-label">${isAssistant ? '128009' : '-100'}</span></div>`;
        });

        streamHtml += '</div>';

        if (streamContainer) streamContainer.innerHTML = streamHtml;
        if (tensorContainer) tensorContainer.innerHTML = tensorHtml;

        // Actualizar Métricas
        const efficiency = totalTokens > 0 ? ((trainableTokens / totalTokens) * 100).toFixed(0) : 0;
        if (metricTotal) metricTotal.textContent = totalTokens.toString();
        if (metricMasked) metricMasked.textContent = `${maskedTokens} (${(100 - efficiency)}%)`;
        if (metricTrainable) metricTrainable.textContent = `${trainableTokens} (${efficiency}%)`;
        if (metricEfficiency) metricEfficiency.textContent = `${efficiency}% Gradiente`;

        // Reporte de Auditoría
        if (auditReport && auditDetail && auditBadge) {
          auditReport.style.borderLeftColor = '#10b981';
          auditBadge.className = 'status-pill-safe';
          auditBadge.textContent = 'Auditoría Aprobada';
          auditDetail.innerHTML = `Total de <b>${totalTokens} tokens BPE</b> (${trainableTokens} con gradiente activo y ${maskedTokens} enmascarados con <code>label = -100</code>). Cumple con el estándar de Meta Llama 3.`;
        }

      } catch (err) {
        if (statusBadge) {
          statusBadge.textContent = 'Error de Sintaxis';
          statusBadge.style.color = '#ef4444';
        }
        if (auditReport && auditDetail && auditBadge) {
          auditReport.style.borderLeftColor = '#ef4444';
          auditBadge.className = 'status-pill-danger';
          auditBadge.textContent = 'Error en Formato';
          auditDetail.innerHTML = `<b>Fallo de Validación:</b> ${err.message}`;
        }
      }
    }

    // Evento de Auditoría y Tokenización (Botón Principal)
    if (validateBtn) {
      validateBtn.addEventListener('click', () => {
        try {
          const raw = codeDisplay.innerText;
          const parsed = JSON.parse(raw);
          renderFromObject(parsed);
          
          // Feedback visual
          const oldHtml = validateBtn.innerHTML;
          validateBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;"><path d="M20 6L9 17l-5-5"/></svg>
            <span>¡Dataset Auditado con Éxito!</span>
          `;
          validateBtn.style.background = '#059669';
          setTimeout(() => {
            validateBtn.innerHTML = oldHtml;
            validateBtn.style.background = '';
          }, 1800);
        } catch (e) {
          if (statusBadge) {
            statusBadge.textContent = 'JSON Inválido';
            statusBadge.style.color = '#ef4444';
          }
        }
      });
    }

    // Copiar JSON Formateado
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = codeDisplay.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const old = copyBtn.textContent;
          copyBtn.textContent = '¡Copiado!';
          copyBtn.style.background = '#059669';
          copyBtn.style.color = '#ffffff';
          setTimeout(() => {
            copyBtn.textContent = old;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 1800);
        });
      });
    }

    // Copiar 1 Línea JSONL (Formato de Producción SFT)
    if (copyRawBtn) {
      copyRawBtn.addEventListener('click', () => {
        try {
          const raw = codeDisplay.innerText;
          const parsed = JSON.parse(raw);
          const oneLineJsonl = JSON.stringify(parsed);
          navigator.clipboard.writeText(oneLineJsonl).then(() => {
            const old = copyRawBtn.textContent;
            copyRawBtn.textContent = '¡1 Línea JSONL Copiada!';
            copyRawBtn.style.background = '#059669';
            copyRawBtn.style.color = '#ffffff';
            setTimeout(() => {
              copyRawBtn.textContent = old;
              copyRawBtn.style.background = '';
              copyRawBtn.style.color = '';
            }, 1800);
          });
        } catch (e) {}
      });
    }

    // Descargar dataset_sft.jsonl
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        try {
          const raw = codeDisplay.innerText;
          const parsed = JSON.parse(raw);
          const oneLineJsonl = JSON.stringify(parsed) + '\n';
          const blob = new Blob([oneLineJsonl], { type: 'application/jsonl;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'dataset_sft_llama3.jsonl';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {}
      });
    }

    // Auto-formatear JSON
    if (formatBtn) {
      formatBtn.addEventListener('click', () => {
        try {
          const raw = codeDisplay.innerText;
          const parsed = JSON.parse(raw);
          renderFromObject(parsed);
        } catch (e) {}
      });
    }

    // Edición manual en vivo
    codeDisplay.addEventListener('input', () => {
      try {
        const raw = codeDisplay.innerText;
        const parsed = JSON.parse(raw);
        currentParsedObj = parsed;
        processDataset(parsed);
      } catch (e) {
        if (statusBadge) {
          statusBadge.textContent = 'JSON Inválido';
          statusBadge.style.color = '#ef4444';
        }
      }
    });

    // Pestañas (Chat Template, Tensores PyTorch, Comparativa)
    const tabBtns = document.querySelectorAll('.jsonl-tab-btn');
    const tabPanes = document.querySelectorAll('.jsonl-tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Píldoras de Presets
    const presetPills = document.querySelectorAll('#jsonl-preset-pills .jsonl-preset-card-btn');
    presetPills.forEach(btn => {
      btn.addEventListener('click', () => {
        presetPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sampleKey = btn.getAttribute('data-sample');
        if (PRESETS_DATA[sampleKey]) {
          renderFromObject(PRESETS_DATA[sampleKey]);
        }
      });
    });

    // Carga inicial
    renderFromObject(PRESETS_DATA['support']);
  }

  /* ==========================================================================
  BANCO 1.3.5: PLANIFICADOR DE HIPERPARÁMETROS & CURVA DE LEARNING RATE
  ========================================================================== */
  function initHyperparameterPlanner() {
  const datasetSizeSlider = document.getElementById('hp-dataset-slider');
  const microBatchSlider = document.getElementById('hp-microbatch-slider');
  const gradAccSlider = document.getElementById('hp-gradacc-slider');
  const epochsSlider = document.getElementById('hp-epochs-slider');
  const lrSelect = document.getElementById('hp-lr-select');
  const warmupSlider = document.getElementById('hp-warmup-slider');
  const canvas = document.getElementById('hp-schedule-canvas');

  if (!datasetSizeSlider || !canvas) return;

  function renderHyperparameters() {
    const N = parseInt(datasetSizeSlider.value, 10);
    const B = parseInt(microBatchSlider.value, 10);
    const G = parseInt(gradAccSlider.value, 10);
    const E = parseInt(epochsSlider.value, 10);
    const baseLr = parseFloat(lrSelect.value);
    const warmupRatio = parseFloat(warmupSlider.value);

    const effectiveBatch = B * G;
    const stepsPerEpoch = Math.ceil(N / effectiveBatch);
    const totalSteps = stepsPerEpoch * E;
    const warmupSteps = Math.ceil(totalSteps * warmupRatio);

    // Estimación de tiempo en 1x RTX 4090 (~0.18 seg por step con QLoRA)
    const totalSeconds = totalSteps * 0.18;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;

    // Actualizar UI
    const nVal = document.getElementById('hp-dataset-val');
    const bVal = document.getElementById('hp-microbatch-val');
    const gVal = document.getElementById('hp-gradacc-val');
    const eVal = document.getElementById('hp-epochs-val');
    const wVal = document.getElementById('hp-warmup-val');

    const effBatchEl = document.getElementById('hp-eff-batch');
    const totalStepsEl = document.getElementById('hp-total-steps');
    const warmupStepsEl = document.getElementById('hp-warmup-steps');
    const timeEstEl = document.getElementById('hp-time-est');

    const diagBadge = document.getElementById('hp-diagnosis-badge');
    const diagDesc = document.getElementById('hp-diagnosis-desc');
    const codeSnippet = document.getElementById('hp-code-snippet');

    if (nVal) nVal.textContent = `${N.toLocaleString()} ejemplos`;
    if (bVal) bVal.textContent = B.toString();
    if (gVal) gVal.textContent = G.toString();
    if (eVal) eVal.textContent = `${E} épocas`;
    if (wVal) wVal.textContent = `${(warmupRatio * 100).toFixed(0)}% (${warmupSteps} steps)`;

    if (effBatchEl) effBatchEl.textContent = `${effectiveBatch} ejemplos`;
    if (totalStepsEl) totalStepsEl.textContent = `${totalSteps.toLocaleString()} steps`;
    if (warmupStepsEl) warmupStepsEl.textContent = `${warmupSteps} steps`;
    if (timeEstEl) timeEstEl.textContent = `~${timeStr}`;

    // Diagnóstico MLOps
    if (diagBadge && diagDesc) {
      if (effectiveBatch < 8) {
        diagBadge.textContent = ' Batch Size Pequeño';
        diagBadge.className = 'status-pill-warning';
        diagDesc.innerHTML = `Un Batch Size Efectivo de <b>${effectiveBatch}</b> introduce alto ruido estocástico en AdamW. Aumenta <i>Gradient Accumulation</i> a mínimo 8 steps para estabilizar la convergencia.`;
      } else if (effectiveBatch > 128) {
        diagBadge.textContent = ' Batch Size Excesivo';
        diagBadge.className = 'status-pill-warning';
        diagDesc.innerHTML = `Un Batch Size Efectivo de <b>${effectiveBatch}</b> reduce los steps totales a solo <b>${totalSteps}</b>, lo que puede provocar subentrenamiento o menor generalización.`;
      } else if (totalSteps < 100) {
        diagBadge.textContent = ' Pocos Steps Totales';
        diagBadge.className = 'status-pill-warning';
        diagDesc.innerHTML = `Solo <b>${totalSteps} pasos</b> de entrenamiento. Aumenta las épocas a 3 o reduce el batch efectivo para permitir que el optimizador recorra el espacio latente.`;
      } else {
        diagBadge.textContent = 'Régimen Óptimo SFT';
        diagBadge.className = 'status-pill-safe';
        diagDesc.innerHTML = `Excelente configuración. Batch Size Efectivo de <b>${effectiveBatch} ejemplos</b> con <b>${totalSteps.toLocaleString()} pasos totales</b> y <b>${warmupSteps} steps de warmup (${(warmupRatio * 100).toFixed(0)}%)</b> garantiza máxima estabilidad en adaptadores LoRA.`;
      }
    }

    // Actualizar Code Snippet Hugging Face con colores
    if (codeSnippet) {
      const lrExp = baseLr < 1e-4 ? baseLr.toExponential(1) : baseLr.toExponential(0);
      codeSnippet.innerHTML = `<span class="code-kw">from</span> <span class="code-var">transformers</span> <span class="code-kw">import</span> <span class="code-fn">TrainingArguments</span>

<span class="code-var">training_args</span> = <span class="code-fn">TrainingArguments</span>(
    <span class="code-var">output_dir</span>=<span class="code-str">"./llama3-sft-checkpoint"</span>,
    <span class="code-var">per_device_train_batch_size</span>=<span class="code-num">${B}</span>,
    <span class="code-var">gradient_accumulation_steps</span>=<span class="code-num">${G}</span>,  <span class="code-cm"># Batch efectivo = ${effectiveBatch}</span>
    <span class="code-var">learning_rate</span>=<span class="code-num">${lrExp}</span>,
    <span class="code-var">num_train_epochs</span>=<span class="code-num">${E}</span>,
    <span class="code-var">warmup_ratio</span>=<span class="code-num">${warmupRatio.toFixed(2)}</span>,              <span class="code-cm"># ${warmupSteps} steps de calentamiento</span>
    <span class="code-var">lr_scheduler_type</span>=<span class="code-str">"cosine"</span>,
    <span class="code-var">fp16</span>=<span class="code-kw">True</span>,
    <span class="code-var">logging_steps</span>=<span class="code-num">10</span>,
    <span class="code-var">save_strategy</span>=<span class="code-str">"epoch"</span>,
)`;
    }

    drawScheduleCanvas(canvas, totalSteps, warmupSteps, baseLr);
  }

  function drawScheduleCanvas(cvs, totalSteps, warmupSteps, maxLr) {
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = cvs.getBoundingClientRect();
    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#1e293b';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const padL = 60;
    const padR = 30;
    const padT = 25;
    const padB = 35;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Ejes y Cuadrícula
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      const lrVal = maxLr * (1 - i / 4);
      ctx.fillStyle = mutedColor;
      ctx.font = '10px var(--font-mono, monospace)';
      ctx.textAlign = 'right';
      ctx.fillText(lrVal.toExponential(1), padL - 8, y + 3);
    }

    // Dibujar Curva Cosine Annealing con Warmup
    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2.5;

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const step = (totalSteps / points) * i;
      let lr = 0;
      if (step <= warmupSteps && warmupSteps > 0) {
        lr = maxLr * (step / warmupSteps);
      } else {
        const progress = (step - warmupSteps) / (totalSteps - warmupSteps);
        lr = maxLr * 0.5 * (1 + Math.cos(Math.PI * progress));
      }

      const px = padL + (step / totalSteps) * plotW;
      const py = padT + plotH - (lr / maxLr) * plotH;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Línea de Warmup vertical
    if (warmupSteps > 0) {
      const wx = padL + (warmupSteps / totalSteps) * plotW;
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(wx, padT);
      ctx.lineTo(wx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#eab308';
      ctx.font = '10px var(--font-sans, Inter, sans-serif)';
      ctx.textAlign = 'center';
      ctx.fillText('Fin Warmup', wx, padT - 8);
    }

    // Eje X: Steps
    ctx.fillStyle = mutedColor;
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.textAlign = 'left';
    ctx.fillText('0', padL, h - 12);
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(totalSteps / 2)} steps`, padL + plotW / 2, h - 12);
    ctx.textAlign = 'right';
    ctx.fillText(`${totalSteps} steps (Final)`, w - padR, h - 12);
  }

  [datasetSizeSlider, microBatchSlider, gradAccSlider, epochsSlider, warmupSlider].forEach(el => {
    if (el) {
      el.addEventListener('input', renderHyperparameters);
      el.addEventListener('change', renderHyperparameters);
    }
  });

  // Píldoras de Learning Rate
  const lrPills = document.querySelectorAll('#hp-lr-pills .preset-pill-btn');
  lrPills.forEach(btn => {
    btn.addEventListener('click', () => {
      lrPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lrSelect.value = btn.getAttribute('data-lr');
      renderHyperparameters();
    });
  });

  renderHyperparameters();
  }

  /* ==========================================================================
 BUSCADOR Y FILTRADO DEL GLOSARIO TÉCNICO
 ========================================================================== */
 (function initGlossaryFilter() {
 const searchInput = document.getElementById('glossary-search-input');
 const filterPills = document.querySelectorAll('.glossary-filter-pill');
 const glossaryItems = document.querySelectorAll('.glossary-row-item');

 if (!searchInput || glossaryItems.length === 0) return;

 let currentCategory = 'todos';

 function filterGlossary() {
 const query = searchInput.value.toLowerCase().trim();
 glossaryItems.forEach(item => {
 const termEl = item.querySelector('.glossary-term-name');
 const descEl = item.querySelector('.glossary-term-desc');
 const term = termEl ? termEl.textContent.toLowerCase() : '';
 const desc = descEl ? descEl.textContent.toLowerCase() : '';
 const categoryAttr = item.getAttribute('data-category') || '';

 const matchesQuery = !query || term.includes(query) || desc.includes(query);
 const matchesCategory = currentCategory === 'todos' || categoryAttr.includes(currentCategory);

 item.style.display = (matchesQuery && matchesCategory) ? 'grid' : 'none';
 });
 }

 searchInput.addEventListener('input', filterGlossary);

 filterPills.forEach(pill => {
 pill.addEventListener('click', () => {
 if (window.SOUND) window.SOUND.playPop(350);
 filterPills.forEach(p => p.classList.remove('active'));
 pill.classList.add('active');
 currentCategory = pill.getAttribute('data-category');
 filterGlossary();
 });
 });
 })();

})();
