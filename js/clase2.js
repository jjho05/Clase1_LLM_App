/**
 * Meta AI - Módulo 1 Tema 2: Prompt Engineering y RAG con Llama
 * Laboratorios Interactivos Avanzados, Simuladores y Motor de Evaluación
 */

(function(){
 "use strict";

 /* 1. NAVEGACIÓN ACTIVA DE SUBTEMAS EN SCROLL */
 var navLinks = document.querySelectorAll(".nav-link-item");
 var modules = document.querySelectorAll(".module-block, .glossary-section, .sources-section, .tema-card");

 window.addEventListener("scroll", function(){
 var scrollPos = window.scrollY + 80;
 modules.forEach(function(mod){
 var top = mod.offsetTop;
 var height = mod.offsetHeight;
 if(scrollPos >= top && scrollPos < top + height){
 var targetHref = "#" + mod.id;
 navLinks.forEach(function(n){
 if(n.getAttribute("href") === targetHref){
 n.classList.add("active");
 } else if(n.getAttribute("href") && n.getAttribute("href").startsWith("#")) {
 n.classList.remove("active");
 }
 });
 }
 });
 }, { passive: true });

 /* 2. MOTOR DE EVALUACIÓN DE QUIZZES (8 PREGUNTAS) CON FEEDBACK AUDITIVO & CERTIFICADO */
 var totalQuizzes = document.querySelectorAll(".quiz-box").length;
 var quizCounterText = document.getElementById("quiz-counter-text");
 var btnResetAllQuizzes = document.getElementById("btn-reset-all-quizzes");


 function updateQuizScore(){
 var correctCount = 0;
 var answered = 0;
 document.querySelectorAll(".quiz-box").forEach(function(b){
 if(b.querySelector(".quiz-option.correct")){
 correctCount++;
 answered++;
 } else if(b.querySelector(".quiz-option.incorrect")){
 answered++;
 }
 });
 if(quizCounterText) quizCounterText.textContent = answered + " / " + totalQuizzes;

 if(correctCount === totalQuizzes){
 if(window.celebrateConfetti) window.celebrateConfetti();
 }
 }

 document.querySelectorAll(".quiz-box").forEach(function(box){
 var options = box.querySelectorAll(".quiz-option");
 var feedback = box.querySelector(".quiz-feedback");

 options.forEach(function(opt){
 opt.addEventListener("click", function(){
 var isCorrect = opt.getAttribute("data-correct") === "true";
 options.forEach(function(o){ o.classList.remove("correct", "incorrect"); });
 
 if(isCorrect){
 opt.classList.add("correct");
 if(window.SOUND) window.SOUND.playChime();
 if(feedback){
 feedback.style.display = "block";
 feedback.style.color = "var(--accent-success)";
 feedback.textContent = "Correcto: Has comprendido la idea central.";
 }
 } else {
 opt.classList.add("incorrect");
 if(window.SOUND) window.SOUND.playPop(220);
 if(feedback){
 feedback.style.display = "block";
 feedback.style.color = "#dc2626";
 feedback.textContent = "Incorrecto: Revisa la explicación del concepto arriba.";
 }
 }
 updateQuizScore();
 });
 });
 });

 if(btnResetAllQuizzes){
 btnResetAllQuizzes.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(300);
 document.querySelectorAll(".quiz-box").forEach(function(box){
 box.querySelectorAll(".quiz-option").forEach(function(o){ o.classList.remove("correct", "incorrect"); });
 var fb = box.querySelector(".quiz-feedback");
 if(fb) fb.style.display = "none";
 });
 updateQuizScore();
 });
 }

 /* 3. SIMULADOR 1.2.1: PLAYGROUND PROMPTING AVANZADO (ZERO-SHOT VS FEW-SHOT VS CHAIN-OF-THOUGHT) */
 (function initPromptingPlayground(){
 var strategyBtns = document.querySelectorAll(".prompt-strategy-btn");
 var taskSelector = document.getElementById("prompt-task-select");
 var promptInputView = document.getElementById("prompt-input-preview");
 var promptOutputView = document.getElementById("prompt-output-preview");
 var promptMetricsPill = document.getElementById("prompt-metrics-pill");
 var btnExecutePrompt = document.getElementById("btn-run-prompt-sim");
 var comparativeContainer = document.getElementById("prompt-comparative-grid");
 var singleViewContainer = document.getElementById("prompt-single-view");

 if(!promptInputView || !promptOutputView) return;

 var tasksData = {
 math: {
 title: "Problema Aritmético Multi-Paso",
 zero: {
 input: "Pregunta: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?",
 output: "Quedan 2,490 tornillos.",
 tokens: "Input: 46 | Output: 8 | Latencia: 140ms",
 status: " Riesgo de Error Aritmético: Salto directo sin pasos intermedios (Respuesta real: 2,500).",
 reasoningSteps: []
 },
 few: {
 input: "Ejemplo 1:\nEntrada: Hay 10 cajas con 5 botellas. Vendo 2 cajas. ¿Cuántas botellas quedan?\nSalida: Quedan 40 botellas.\n\nEjemplo 2:\nEntrada: Tengo 8 bolsas con 4 manzanas. Regalo 3 bolsas y 2 manzanas. ¿Cuántas quedan?\nSalida: Quedan 18 manzanas.\n\nConsulta:\nEntrada: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?\nSalida:",
 output: "Quedan 2,500 tornillos.",
 tokens: "Input: 128 | Output: 9 | Latencia: 195ms",
 status: " Formato Estandarizado: Salida limpia y consistente calibrada por demostraciones.",
 reasoningSteps: []
 },
 cot: {
 input: "Pregunta: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?\nInstrucción: Piensa paso a paso y desglosa cada sub-cálculo antes de emitir el resultado final.",
 output: "Razonamiento paso a paso:\n1. Total inicial de tornillos:\n - Tornillos por caja = 12 paquetes × 5 tornillos = 60 tornillos.\n - Total en inventario = 45 cajas × 60 tornillos = 2,700 tornillos.\n2. Cantidad total vendida:\n - 3 cajas vendidas = 3 × 60 = 180 tornillos.\n - 4 paquetes sueltos = 4 × 5 = 20 tornillos.\n - Total vendido = 180 + 20 = 200 tornillos.\n3. Inventario final restante:\n - 2,700 - 200 = 2,500 tornillos.\n\nRespuesta final: Quedan exactamente 2,500 tornillos.",
 tokens: "Input: 58 | Output: 142 | Latencia: 380ms",
 status: " 100% Preciso & Auditable: Deducción matemática secuencial paso a paso.",
 reasoningSteps: [
 "Paso 1: Multiplicación de inventario base (45 × 12 × 5 = 2,700)",
 "Paso 2: Suma de unidades despachadas (180 + 20 = 200)",
 "Paso 3: Sustracción final (2,700 - 200 = 2,500)"
 ]
 }
 },
 sentiment: {
 title: "Clasificación de Reseñas de Clientes",
 zero: {
 input: "Clasifica esta reseña: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'",
 output: "La reseña expresa una opinión negativa del cliente principalmente por el producto roto y el mal servicio de atención.",
 tokens: "Input: 28 | Output: 24 | Latencia: 155ms",
 status: " Salida Conversacional: Difícil de parsear en una base de datos.",
 reasoningSteps: []
 },
 few: {
 input: "Clasifica el sentimiento en una sola etiqueta: [Positiva, Negativa, Neutra]\n\nTexto: 'Excelente servicio, volvería a comprar.'\nSentimiento: Positiva\n\nTexto: 'El producto cumple su función básica.'\nSentimiento: Neutra\n\nTexto: 'No enciende y tardó 3 semanas.'\nSentimiento: Negativa\n\nTexto: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'\nSentimiento:",
 output: "Negativa",
 tokens: "Input: 94 | Output: 2 | Latencia: 90ms",
 status: " Formato Estricto: Etiqueta exacta lista para base de datos SQL/NoSQL.",
 reasoningSteps: []
 },
 cot: {
 input: "Analiza por aspectos y clasifica la reseña: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'",
 output: "Desglose por aspectos:\n- Logística: Positiva ('llegó a tiempo').\n- Calidad física: Negativa crítica ('venía roto').\n- Servicio al cliente: Negativa crítica ('atención pésima').\n\nPonderación: Los fallos críticos de producto y servicio superan la entrega puntual.\nSentimiento Dominante: Negativa",
 tokens: "Input: 36 | Output: 72 | Latencia: 240ms",
 status: " Análisis Granular Multi-Aspecto: Explica el porqué de la decisión.",
 reasoningSteps: [
 "Aspecto 1: Logística (+)",
 "Aspecto 2: Calidad Producto (-)",
 "Aspecto 3: Soporte (-)",
 "Conclusión: Negativa Dominante"
 ]
 }
 },
 json: {
 title: "Extracción Estructurada de Datos JSON",
 zero: {
 input: "Extrae los datos de esta orden en formato JSON: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.'",
 output: "```json\n{\n \"comprador\": \"Juan Pérez\",\n \"articulo\": \"2 laptops Dell XPS\",\n \"precio\": \"1,200 USD\"\n}\n```",
 tokens: "Input: 42 | Output: 38 | Latencia: 180ms",
 status: " Esquema Inconsistente: Claves no tipadas y valores mezclados con strings.",
 reasoningSteps: []
 },
 few: {
 input: "Extrae los datos siguiendo exactamente el esquema del ejemplo:\n\nTexto: 'Ana Gómez compró 1 monitor LG por 300 USD.'\nJSON: {\"customer\":\"Ana Gómez\",\"item\":\"Monitor LG\",\"quantity\":1,\"unit_price\":300.0,\"currency\":\"USD\"}\n\nTexto: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.'\nJSON:",
 output: "{\"customer\":\"Juan Pérez\",\"item\":\"Laptop Dell XPS\",\"quantity\":2,\"unit_price\":1200.0,\"currency\":\"USD\",\"date\":\"2024-03-15\"}",
 tokens: "Input: 110 | Output: 44 | Latencia: 190ms",
 status: " JSON Tipado & Puro: Totalmente compatible con validadores Pydantic.",
 reasoningSteps: []
 },
 cot: {
 input: "Extrae los datos en JSON calculando totales y validando consistencia:\nTexto: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.'",
 output: "Validación de campos:\n- Nombre: 'Juan Pérez'\n- Producto: 'Laptop Dell XPS' (Cantidad: 2)\n- Precio unitario: $1,200.00 USD\n- Total acumulado: 2 × $1,200 = $2,400.00 USD\n\n```json\n{\n \"customer\": \"Juan Pérez\",\n \"product\": \"Laptop Dell XPS\",\n \"quantity\": 2,\n \"unit_price_usd\": 1200.0,\n \"total_price_usd\": 2400.0,\n \"transaction_date\": \"2024-03-15\"\n}\n```",
 tokens: "Input: 48 | Output: 98 | Latencia: 290ms",
 status: " Validación Contable & JSON Completo: Calcula subtotales verificados.",
 reasoningSteps: [
 "Validación 1: Entidades reconocidas",
 "Validación 2: Cálculo de subtotal $2,400",
 "Validación 3: Serialización JSON estricta"
 ]
 }
 },
 logic: {
 title: "Diagnóstico Lógico & Reglas de Negocio",
 zero: {
 input: "Regla: Si un usuario tiene más de 5 años de antigüedad y gasta más de $500, aplica descuento VIP del 20%. Si tiene más de 2 años o gasta más de $1,000, aplica 10%. En otros casos 0%.\n\nUsuario: Carlos tiene 3 años de antigüedad y gastó $600. ¿Qué descuento recibe?",
 output: "Carlos recibe un 10% de descuento.",
 tokens: "Input: 84 | Output: 10 | Latencia: 130ms",
 status: " Acierto Rápido: El modelo infiere la regla correcta en un paso directo.",
 reasoningSteps: []
 },
 few: {
 input: "Regla: Antigüedad > 5 y Gasto > 500 => 20% | Antigüedad > 2 o Gasto > 1000 => 10% | Otros => 0%\n\nCaso: María (6 años, $300) => 10% (Antigüedad > 2)\nCaso: Pedro (1 año, $1200) => 10% (Gasto > 1000)\nCaso: Luis (7 años, $800) => 20% (VIP)\nCaso: Carlos (3 años, $600) =>",
 output: "10% (Cumple condición: Antigüedad > 2 años)",
 tokens: "Input: 122 | Output: 12 | Latencia: 110ms",
 status: " Salida Estandarizada con Justificación entre paréntesis.",
 reasoningSteps: []
 },
 cot: {
 input: "Evalúa las reglas de negocio paso a paso para el cliente:\nRegla VIP (20%): Antigüedad > 5 AND Gasto > $500.\nRegla Preferente (10%): Antigüedad > 2 OR Gasto > $1,000.\nRegla General: 0%.\n\nCliente: Carlos (Antigüedad = 3 años, Gasto = $600).",
 output: "Evaluación de Reglas:\n1. Regla VIP (20%):\n - Antigüedad = 3 (¿> 5? NO)\n - Gasto = $600 (¿> 500? SÍ)\n - Condición AND: Falso.\n2. Regla Preferente (10%):\n - Antigüedad = 3 (¿> 2? SÍ)\n - Condición OR: Verdadera.\n\nResultado Final: Carlos califica para la Regla Preferente con 10% de descuento.",
 tokens: "Input: 96 | Output: 115 | Latencia: 310ms",
 status: " Auditoría Lógica Formal: Verificación de condiciones booleanas.",
 reasoningSteps: [
 "Paso 1: Evaluación de Regla VIP (Falso)",
 "Paso 2: Evaluación de Regla Preferente (Verdadero)",
 "Paso 3: Asignación de 10%"
 ]
 }
 }
 };

 var currentTask = "math";
 var currentStrategy = "few";
 var isComparingAll = false;

 function renderPromptPreview(){
 if(isComparingAll){
 if(comparativeContainer) comparativeContainer.style.display = "grid";
 if(singleViewContainer) singleViewContainer.style.display = "none";
 renderComparativeView();
 return;
 }

 if(comparativeContainer) comparativeContainer.style.display = "none";
 if(singleViewContainer) singleViewContainer.style.display = "grid";

 var data = tasksData[currentTask][currentStrategy];
 promptInputView.textContent = data.input;
 promptOutputView.textContent = data.output;
 if(promptMetricsPill){
 promptMetricsPill.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;'><span><b>Métricas:</b> " + data.tokens + "</span><span style='font-weight:700; color:var(--meta-blue);'>" + data.status + "</span></div>";
 }
 }

 function renderComparativeView(){
 if(!comparativeContainer) return;
 var task = tasksData[currentTask];
 comparativeContainer.innerHTML = "";

 var strats = [
 { key: "zero", label: "Zero-Shot", color: "#f59e0b" },
 { key: "few", label: "Few-Shot", color: "var(--meta-blue)" },
 { key: "cot", label: "Chain-of-Thought", color: "var(--accent-success)" }
 ];

 strats.forEach(function(s){
 var item = task[s.key];
 var col = document.createElement("div");
 col.style.cssText = "background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:12px; padding:1.1rem; display:flex; flex-direction:column; justify-content:space-between;";
 col.innerHTML = "<div style='margin-bottom:0.8rem;'><div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;'><span style='font-size:0.8rem; font-weight:800; color:" + s.color + "; text-transform:uppercase;'>" + s.label + "</span><span style='font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);'>" + item.tokens.split("|")[2] + "</span></div><pre style='background:var(--bg-code); color:var(--text-primary); padding:0.75rem; border-radius:8px; font-size:0.8rem; line-height:1.55; height:150px; overflow-y:auto; white-space:pre-wrap; border:1px solid var(--border-subtle); font-family:var(--font-mono);'>" + item.output + "</pre></div><div style='font-size:0.78rem; font-weight:700; color:" + s.color + "; border-top:1px solid var(--border-subtle); padding-top:0.5rem;'>" + item.status + "</div>";
 comparativeContainer.appendChild(col);
 });
 }

 strategyBtns.forEach(function(btn){
 btn.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(420);
 strategyBtns.forEach(function(b){ b.classList.remove("active"); });
 btn.classList.add("active");
 var strat = btn.getAttribute("data-strategy");
 if(strat === "all"){
 isComparingAll = true;
 } else {
 isComparingAll = false;
 currentStrategy = strat;
 }
 renderPromptPreview();
 });
 });

 if(taskSelector){
 taskSelector.addEventListener("change", function(){
 if(window.SOUND) window.SOUND.playPop(360);
 currentTask = taskSelector.value;
 renderPromptPreview();
 });
 }

 if(btnExecutePrompt){
 btnExecutePrompt.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playChime();
 promptOutputView.style.opacity = "0.3";
 setTimeout(function(){
 promptOutputView.style.opacity = "1";
 renderPromptPreview();
 }, 180);
 });
 }
    var btnResetPromptSim = document.getElementById("btn-reset-prompt-sim");
    if(btnResetPromptSim){
      btnResetPromptSim.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        currentTask = "math";
        if(taskSelector) taskSelector.value = "math";
        currentStrategy = "few";
        isComparingAll = false;
        strategyBtns.forEach(function(b){
          b.classList.toggle("active", b.getAttribute("data-strategy") === "few");
        });
        renderPromptPreview();
      });
    }

    renderPromptPreview();
  })();

 /* 4. SIMULADOR 1.2.2: MEMORIA PARAMÉTRICA VS RAG (DETECTOR DE ALUCINACIONES CON TIMELINE) */
 (function initHallucinationSimulator(){
 var testBtns = document.querySelectorAll(".hallucination-case-btn");
 var modelDirectBox = document.getElementById("model-direct-response");
 var modelRagBox = document.getElementById("model-rag-response");
 var timelineCutoff = document.getElementById("hallucination-timeline-tag");

 if(!modelDirectBox || !modelRagBox) return;

 var cases = {
 policy: {
 title: "Política de Devoluciones (E-Commerce)",
 cutoffText: "Fecha de Corte Llama 3: Dic 2023 | Cambio de Política: 1 de Enero 2024",
 direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'Nuestra política de devolución permite reembolsos dentro de los primeros 30 días posteriores a la compra presentando el ticket original impreso en sucursal.'",
 directConfidence: "Confianza del Modelo: 99.4% (Alucinación Plausible)",
 directStatus: " ALUCINACIÓN FÁCTICA: La política cambió el 1 de enero a 15 días y trámite 100% digital. El modelo responde con datos viejos de su entrenamiento con total seguridad.",
 ragSource: " doc_politicas_q1_2024.pdf (Chunk #3 · Indexado en ChromaDB)",
 ragContext: "'A partir del 1 de enero de 2024, el periodo de devolución es de 15 días naturales y debe solicitarse mediante el portal web de autogestión.'",
 rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'De acuerdo con la política vigente para 2024, tienes 15 días naturales desde tu compra para solicitar tu reembolso directamente a través de nuestro portal web de autogestión.'",
 ragGrounding: "Fundamentación Fáctica: 100% (Verificado con Cita Directa)",
 ragStatus: " Cero Alucinación: Respuesta anclada a los documentos reales de la empresa."
 },
 medical: {
 title: "Alerta Farmacéutica y Contraindicación Clínica",
 cutoffText: "Fecha de Corte Llama 3: Dic 2023 | Alerta Sanitaria: Febrero 2024",
 direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'El medicamento Cardiopril no tiene contraindicaciones reportadas con antiácidos comunes.'",
 directConfidence: "Confianza del Modelo: 98.8% (Peligro Clínico)",
 directStatus: " ALUCINACIÓN PELIGROSA: La autoridad sanitaria emitió una alerta sobre reducción del 40% en absorción con sales de magnesio.",
 ragSource: " boletin_sanitario_feb_2024.pdf (Chunk #12 · Indexado en ChromaDB)",
 ragContext: "'Se restringe el uso simultáneo de Cardiopril con antiácidos a base de hidróxido de magnesio por reducción del 40% en biodisponibilidad plasmática.'",
 rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'Según el boletín sanitario oficial más reciente, no debes tomar Cardiopril junto con antiácidos a base de hidróxido de magnesio, ya que disminuyen su absorción en un 40%.'",
 ragGrounding: "Fundamentación Fáctica: 100% (Protección Sanitaria Activa)",
 ragStatus: " Seguridad Médica Garantizada con Fuentes Oficiales."
 },
 pricing: {
 title: "Tarifario y Límites de Suscripción Cloud",
 cutoffText: "Fecha de Corte Llama 3: Dic 2023 | Nueva Tarifa: Marzo 2024",
 direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'El plan Pro cuesta $29 USD mensuales e incluye hasta 5 usuarios.'",
 directConfidence: "Confianza del Modelo: 99.7% (Tarifa Desactualizada)",
 directStatus: " INFORMACIÓN OBSOLETA: Los precios cambiaron a $39 USD/mes con 10 usuarios.",
 ragSource: " tarifario_vigente_2024.json (Chunk #1 · Base Vectorial)",
 ragContext: "'Plan Pro 2024: $39 USD/mes, incluye 10 usuarios concurrentes y soporte prioritario 24/7.'",
 rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'El Plan Pro tiene un costo vigente de $39 USD mensuales e incluye acceso para 10 usuarios con soporte prioritario 24/7.'",
 ragGrounding: "Fundamentación Fáctica: 100% (Integridad Comercial)",
 ragStatus: " Precisión Financiera: Cotizaciones comerciales exactas al día de hoy."
 },
 tax: {
 title: "Regulación Fiscal y Deducciones Tributarias",
 cutoffText: "Fecha de Corte Llama 3: Dic 2023 | Reforma Fiscal: Ejercicio 2024",
 direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'El tope máximo de deducción para gastos médicos menores es del 15% del ingreso anual total.'",
 directConfidence: "Confianza del Modelo: 97.5% (Norma Derogada)",
 directStatus: " ALUCINACIÓN LEGAL: La reforma fiscal redujo el tope a 5 UMAs anualizadas.",
 ragSource: " codigo_fiscal_reforma_2024.pdf (Chunk #8 · Base Vectorial)",
 ragContext: "'Para el ejercicio fiscal 2024, el tope máximo de deducciones personales se limita a 5 Unidades de Medida y Actualización (UMA) anuales.'",
 rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'Para el ejercicio fiscal vigente, el límite máximo para deducciones personales corresponde a 5 UMAs anualizadas, conforme a la reforma tributaria reciente.'",
 ragGrounding: "Fundamentación Fáctica: 100% (Cumplimiento Legal)",
 ragStatus: " Certeza Jurídica: Basado estrictamente en la ley vigente."
 }
 };

 function renderCase(caseKey){
 var item = cases[caseKey];
 if(timelineCutoff) timelineCutoff.textContent = item.cutoffText;

 modelDirectBox.innerHTML = "<p style='margin:0; font-family:var(--font-mono); font-size:0.86rem;'>" + item.direct.replace(/\n/g, "<br>") + "</p><div style='margin-top:0.75rem; padding-top:0.6rem; border-top:1px solid rgba(239,68,68,0.2);'><div style='font-size:0.75rem; font-weight:800; color:#ef4444; margin-bottom:0.25rem;'>" + item.directConfidence + "</div><div style='font-size:0.8rem; font-weight:700; color:#dc2626;'>" + item.directStatus + "</div></div>";

 modelRagBox.innerHTML = "<div style='background:rgba(59,130,246,0.08); border:1px solid var(--meta-blue-border); padding:0.65rem 0.85rem; border-radius:8px; font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.75rem;'><div style='font-weight:800; color:var(--meta-blue); margin-bottom:0.2rem;'>" + item.ragSource + "</div><div><b>Contexto Recuperado:</b> " + item.ragContext + "</div></div><p style='margin:0; font-family:var(--font-mono); font-size:0.86rem;'>" + item.rag.replace(/\n/g, "<br>") + "</p><div style='margin-top:0.75rem; padding-top:0.6rem; border-top:1px solid rgba(16,185,129,0.2);'><div style='font-size:0.75rem; font-weight:800; color:var(--accent-success); margin-bottom:0.25rem;'>" + item.ragGrounding + "</div><div style='font-size:0.8rem; font-weight:700; color:var(--accent-success);'>" + item.ragStatus + "</div></div>";
 }

 testBtns.forEach(function(btn){
 btn.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(440);
 testBtns.forEach(function(b){ b.classList.remove("active"); });
 btn.classList.add("active");
 renderCase(btn.getAttribute("data-case"));
 });
 });

    var btnResetHallucination = document.getElementById("btn-reset-hallucination");
    if(btnResetHallucination){
      btnResetHallucination.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        testBtns.forEach(function(b){
          b.classList.toggle("active", b.getAttribute("data-case") === "policy");
        });
        renderCase("policy");
      });
    }

 renderCase("policy");
 })();

 /* 5. SIMULADOR 1.2.3: PIPELINE RAG INTERACTIVO PASO A PASO */
 (function initRagPipelineVisualizer(){
 var stepPills = document.querySelectorAll(".rag-step-pill");
 var stepDetailsBox = document.getElementById("rag-step-description");

 if(!stepDetailsBox) return;

 var stepInfo = {
 1: {
 title: "Paso 1: Ingesta & Extracción de Documentos",
 desc: "Se cargan manuales, PDFs, políticas o bases de datos relacionales en texto plano. Los documentos se limpian de caracteres espurios y se normaliza la codificación UTF-8.",
 badge: "Fase de Preparación Offline",
 formula: "$$\\text{Doc} = \\{d_1, d_2, \\dots, d_N\\}$$"
 },
 2: {
 title: "Paso 2: Chunking & Generación de Embeddings",
 desc: "Los documentos se dividen en fragmentos manejables (ej. 512 tokens con 64 tokens de solapamiento). Cada chunk se convierte en un vector denso $\\mathbf{e}_i \\in \\mathbb{R}^{d}$ mediante un modelo como BGE o OpenAI text-embedding-3.",
 badge: "Vectorización & Almacenamiento en ChromaDB / FAISS",
 formula: "$$\\mathbf{v}_i = \\text{EmbeddingModel}(\\text{Chunk}_i) \\in \\mathbb{R}^{1536}$$"
 },
 3: {
 title: "Paso 3: Búsqueda Semántica de Top-k Fragmentos",
 desc: "Cuando el usuario formula una consulta, esta se vectoriza en el mismo espacio geométrico. El motor busca los $k$ fragmentos más cercanos evaluando Similitud Coseno en el índice HNSW.",
 badge: "Recuperación Vectorial en Tiempo Real (< 15 ms)",
 formula: "$$\\text{Top-}k = \\arg\\max_{i \\in D}^{(k)} \\frac{\\mathbf{q} \\cdot \\mathbf{v}_i}{\\|\\mathbf{q}\\| \\|\\mathbf{v}_i\\|}$$"
 },
 4: {
 title: "Paso 4: Inyección en Prompt & Inferencia con Llama 3",
 desc: "Los fragmentos recuperados se concatenan en el prompt del sistema como evidencia empírica. Llama 3 sintetiza la respuesta final respaldándose exclusivamente en los hechos aportados.",
 badge: "Generación Anclada y Verificable",
 formula: "$$\\text{Prompt Final} = [\\text{Sistema}] + [\\text{Contexto: } \\text{Top-}k] + [\\text{Pregunta}]$$"
 }
 };

 function setPipelineStep(stepNum){
 var info = stepInfo[stepNum];
 stepDetailsBox.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.4rem;'><h4 style='font-family:var(--font-head); font-size:1.1rem; color:var(--text-primary); margin:0;'>" + info.title + "</h4><span style='font-size:0.75rem; font-weight:800; color:var(--meta-blue); background:var(--meta-blue-subtle); border:1px solid var(--meta-blue-border); padding:0.2rem 0.6rem; border-radius:20px;'>" + info.badge + "</span></div><p style='font-size:0.92rem; color:var(--text-secondary); line-height:1.65; margin-bottom:0.8rem;'>" + info.desc + "</p><div class='formula-block' style='margin:0.5rem 0; padding:0.8rem 1rem; font-size:0.95rem;'>" + info.formula + "</div>";
 if(window.renderMathInElement) window.renderMathInElement(stepDetailsBox, { delimiters: [{left: '$$', right: '$$', display: true}] });
 }

 stepPills.forEach(function(pill){
 pill.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(460);
 stepPills.forEach(function(p){ p.classList.remove("active"); });
 pill.classList.add("active");
 setPipelineStep(pill.getAttribute("data-step"));
 });
 });

    var btnResetRagStep = document.getElementById("btn-reset-rag-step");
    if(btnResetRagStep){
      btnResetRagStep.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        stepPills.forEach(function(p){
          p.classList.toggle("active", p.getAttribute("data-step") === "1");
        });
        setPipelineStep(1);
      });
    }

 setPipelineStep(1);
 })();

 /* 6. SIMULADOR 1.2.4: CALCULADORA GEOMÉTRICA DE SIMILITUD COSENO RETINA SIN EMPALMES */
 (function initCosineSimilarityVisualizer(){
 var sentencePairSelect = document.getElementById("sim-sentence-pair-select");
 var canvas = document.getElementById("vector-cosine-canvas");
 var simScoreDisplay = document.getElementById("cosine-sim-score");
 var angleDisplay = document.getElementById("cosine-angle-deg");
 var dotProductDisplay = document.getElementById("cosine-dot-product");
 var interpText = document.getElementById("cosine-interpretation-text");

 if(!canvas) return;
 var ctx = canvas.getContext("2d");

 var pairs = {
 synonyms: {
 textA: "El coche rojo avanza por la avenida.",
 textB: "El auto carmesí corre por la calzada.",
 vecA: [0.88, 0.45],
 vecB: [0.82, 0.55],
 desc: "Alta similitud semántica: Conceptos casi idénticos con vocabulario diferente (Similitud > 0.95)."
 },
 related: {
 textA: "Meta Llama 3 es un modelo de lenguaje de pesos abiertos.",
 textB: "Python permite entrenar redes neuronales con PyTorch.",
 vecA: [0.75, 0.65],
 vecB: [0.35, 0.92],
 desc: "Similitud moderada: Mismo dominio tecnológico (Inteligencia Artificial y Computación)."
 },
 unrelated: {
 textA: "La pizza napolitana lleva albahaca y queso mozzarella.",
 textB: "El cálculo cuántico utiliza cúbits en superposición.",
 vecA: [0.95, 0.15],
 vecB: [-0.2, 0.96],
 desc: "Baja similitud (Ortogonal): Dominios conceptualmente disjuntos (Gastronomía vs Física Cuántica)."
 }
 };

 function drawVectors(pairKey){
 var pair = pairs[pairKey];
 var dpr = window.devicePixelRatio || 1;
 var cssWidth = canvas.parentElement.clientWidth || 380;
 var cssHeight = 310;

 canvas.width = Math.round(cssWidth * dpr);
 canvas.height = Math.round(cssHeight * dpr);
 canvas.style.width = cssWidth + "px";
 canvas.style.height = cssHeight + "px";

 if(ctx.resetTransform) { ctx.resetTransform(); } else { ctx.setTransform(1, 0, 0, 1, 0, 0); }
 ctx.scale(dpr, dpr);
 ctx.clearRect(0, 0, cssWidth, cssHeight);

 var isDark = document.documentElement.getAttribute("data-theme") === "dark";
 var ox = 50, oy = cssHeight - 45;
 var scale = Math.min(cssWidth - 95, cssHeight - 75);

 // Cuadrícula y líneas de guía
 ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
 ctx.lineWidth = 1;
 for(var x = ox; x < cssWidth - 20; x += 40){ ctx.beginPath(); ctx.moveTo(x, 25); ctx.lineTo(x, oy); ctx.stroke(); }
 for(var y = 25; y <= oy; y += 40){ ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(cssWidth - 20, y); ctx.stroke(); }

 // Ejes coordenados principales
 ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(15, 23, 42, 0.35)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(ox, oy); ctx.lineTo(cssWidth - 15, oy);
 ctx.moveTo(ox, oy); ctx.lineTo(ox, 15);
 ctx.stroke();

 // Flechas de ejes
 ctx.fillStyle = ctx.strokeStyle;
 ctx.beginPath(); ctx.moveTo(cssWidth - 12, oy); ctx.lineTo(cssWidth - 20, oy - 4); ctx.lineTo(cssWidth - 20, oy + 4); ctx.fill();
 ctx.beginPath(); ctx.moveTo(ox, 12); ctx.lineTo(ox - 4, 20); ctx.lineTo(ox + 4, 20); ctx.fill();

 // Vector A
 var ax = ox + pair.vecA[0] * scale;
 var ay = oy - pair.vecA[1] * scale;
 ctx.strokeStyle = "#3b82f6";
 ctx.fillStyle = "#3b82f6";
 ctx.lineWidth = 3.5;
 ctx.beginPath();
 ctx.moveTo(ox, oy); ctx.lineTo(ax, ay);
 ctx.stroke();

 // Halo Vector A
 ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI*2); ctx.fill();
 ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
 ctx.beginPath(); ctx.arc(ax, ay, 13, 0, Math.PI*2); ctx.fill();

 // Vector B
 var bx = ox + pair.vecB[0] * scale;
 var by = oy - pair.vecB[1] * scale;
 ctx.strokeStyle = "#10b981";
 ctx.fillStyle = "#10b981";
 ctx.lineWidth = 3.5;
 ctx.beginPath();
 ctx.moveTo(ox, oy); ctx.lineTo(bx, by);
 ctx.stroke();

 // Halo Vector B
 ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI*2); ctx.fill();
 ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
 ctx.beginPath(); ctx.arc(bx, by, 13, 0, Math.PI*2); ctx.fill();

 // Cálculo matemático
 var dot = pair.vecA[0] * pair.vecB[0] + pair.vecA[1] * pair.vecB[1];
 var normA = Math.sqrt(pair.vecA[0]*pair.vecA[0] + pair.vecA[1]*pair.vecA[1]);
 var normB = Math.sqrt(pair.vecB[0]*pair.vecB[0] + pair.vecB[1]*pair.vecB[1]);
 var cosSim = dot / (normA * normB);
 var angleDeg = (Math.acos(Math.min(1, Math.max(-1, cosSim))) * 180 / Math.PI);

 // Arco del ángulo theta
 var angA = Math.atan2(pair.vecA[1], pair.vecA[0]);
 var angB = Math.atan2(pair.vecB[1], pair.vecB[0]);
 ctx.strokeStyle = "#f59e0b";
 ctx.lineWidth = 2;
 ctx.setLineDash([3, 3]);
 ctx.beginPath();
 ctx.arc(ox, oy, 45, -Math.max(angA, angB), -Math.min(angA, angB));
 ctx.stroke();
 ctx.setLineDash([]);
 ctx.fillStyle = "#f59e0b";
 ctx.font = "bold 12px 'Fira Code', monospace";
 ctx.fillText("θ = " + angleDeg.toFixed(1) + "°", ox + 50, oy - 26);

 // SISTEMA ANTI-EMPALME INTELIGENTE DE ETIQUETAS
 var distTips = Math.hypot(ax - bx, ay - by);
 var labelAy = ay - 12;
 var labelBy = by + 22;

 if(distTips < 45){
 // Si las puntas están muy cerca, separar verticalmente
 labelAy = Math.min(ay, by) - 18;
 labelBy = Math.max(ay, by) + 26;
 }

 // Etiqueta Vector A
 ctx.fillStyle = "#3b82f6";
 ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
 ctx.fillText("u: Frase A", ax + 14, labelAy);

 // Etiqueta Vector B
 ctx.fillStyle = "#10b981";
 ctx.fillText("v: Frase B", bx + 14, labelBy);

 if(simScoreDisplay) simScoreDisplay.textContent = cosSim.toFixed(4);
 if(angleDisplay) angleDisplay.textContent = angleDeg.toFixed(1) + "°";
 if(dotProductDisplay) dotProductDisplay.textContent = dot.toFixed(4);
 if(interpText) interpText.textContent = pair.desc;
 }

 if(sentencePairSelect){
 sentencePairSelect.addEventListener("change", function(){
 if(window.SOUND) window.SOUND.playPop(380);
 drawVectors(sentencePairSelect.value);
 });
 }

    var btnResetCosineSim = document.getElementById("btn-reset-cosine-sim");
    if(btnResetCosineSim){
      btnResetCosineSim.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        if(sentencePairSelect) sentencePairSelect.value = "synonyms";
        drawVectors("synonyms");
      });
    }

 window.addEventListener("resize", function(){
 if(sentencePairSelect) drawVectors(sentencePairSelect.value);
 });

 drawVectors("synonyms");
 })();

 /* 7. SIMULADOR 1.2.5: EXPLORADOR DE CHUNKING & BÚSQUEDA SEMÁNTICA VECTORIAL */
 (function initChunkingExplorer(){
 var chunkSlider = document.getElementById("chunk-size-slider");
 var overlapSlider = document.getElementById("chunk-overlap-slider");
 var chunkSizeVal = document.getElementById("chunk-size-val");
 var chunkOverlapVal = document.getElementById("chunk-overlap-val");
 var chunkOutputList = document.getElementById("chunk-visual-output");
 var searchInput = document.getElementById("vector-query-input");
 var btnSearch = document.getElementById("btn-exec-vector-search");
 var searchResultsContainer = document.getElementById("vector-search-results");

 if(!chunkOutputList) return;

 var sampleDoc = "Meta Llama 3 es la generación más avanzada de modelos de pesos abiertos desarrollada por Meta. Cuenta con arquitecturas de 8B, 70B y 405B parámetros entrenadas en más de 15 billones de tokens multilingües. Su ventana de contexto se extiende a 128k tokens mediante Rotary Position Embeddings (RoPE). La compresión de inferencia utiliza Grouped-Query Attention (GQA), reduciendo en un 75% el uso de VRAM durante la generación autoregresiva. Para conectar Llama a información empresarial actualizada se utiliza la arquitectura RAG, indexando documentos en bases de datos vectoriales como ChromaDB o FAISS mediante similitud coseno de embeddings.";

 function generateChunks(){
 var size = parseInt(chunkSlider.value, 10);
 var overlap = parseInt(overlapSlider.value, 10);
 if(chunkSizeVal) chunkSizeVal.textContent = size + " palabras";
 if(chunkOverlapVal) chunkOverlapVal.textContent = overlap + " palabras";

 var words = sampleDoc.split(" ");
 var chunks = [];
 var i = 0;
 var step = Math.max(1, size - overlap);

 while(i < words.length){
 var chunkWords = words.slice(i, i + size);
 chunks.push({
 id: chunks.length + 1,
 text: chunkWords.join(" "),
 start: i,
 end: i + chunkWords.length
 });
 i += step;
 }

 chunkOutputList.innerHTML = "";
 chunks.forEach(function(c){
 var div = document.createElement("div");
 div.className = "chunk-card-item";
 div.style.cssText = "background:var(--bg-surface); border:1px solid var(--border-subtle); padding:0.75rem 1rem; border-radius:8px; font-size:0.85rem; line-height:1.5; margin-bottom:0.5rem;";
 div.innerHTML = "<div style='display:flex; justify-content:space-between; margin-bottom:0.25rem;'><span style='font-weight:800; font-size:0.75rem; color:var(--meta-blue);'>Chunk #" + c.id + " (" + c.text.split(" ").length + " palabras)</span><span style='font-size:0.7rem; color:var(--text-muted);'>Rango [" + c.start + ":" + c.end + "]</span></div><div style='color:var(--text-secondary);'>" + c.text + "</div>";
 chunkOutputList.appendChild(div);
 });
 }

 if(chunkSlider) chunkSlider.addEventListener("input", generateChunks);
 if(overlapSlider) overlapSlider.addEventListener("input", generateChunks);

    var btnResetChunking = document.getElementById("btn-reset-chunking");
    if(btnResetChunking){
      btnResetChunking.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        if(chunkSlider) chunkSlider.value = "25";
        if(overlapSlider) overlapSlider.value = "5";
        if(searchInput) searchInput.value = "";
        if(searchResultsContainer) searchResultsContainer.innerHTML = "";
        generateChunks();
      });
    }

 if(btnSearch && searchInput && searchResultsContainer){
 btnSearch.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(520);
 var q = searchInput.value.toLowerCase().trim();
 if(!q) return;

 searchResultsContainer.innerHTML = "<div style='text-align:center; padding:1rem; color:var(--text-muted); font-size:0.85rem;'>Calculando Similitud Coseno de Embeddings en espacio $\\mathbb{R}^{1536}$...</div>";
 
 setTimeout(function(){
 var results = [
 { score: 0.9341, text: "La compresión de inferencia utiliza Grouped-Query Attention (GQA), reduciendo en un 75% el uso de VRAM durante la generación autoregresiva.", chunk: 3 },
 { score: 0.8812, text: "Para conectar Llama a información empresarial actualizada se utiliza la arquitectura RAG, indexando documentos en bases de datos vectoriales.", chunk: 4 },
 { score: 0.7620, text: "Su ventana de contexto se extiende a 128k tokens mediante Rotary Position Embeddings (RoPE).", chunk: 2 }
 ];

 searchResultsContainer.innerHTML = "";
 results.forEach(function(r, idx){
 var item = document.createElement("div");
 item.style.cssText = "background:var(--bg-subtle); border:1px solid " + (idx === 0 ? "var(--meta-blue)" : "var(--border-subtle)") + "; padding:0.85rem 1.1rem; border-radius:10px; margin-bottom:0.6rem;";
 item.innerHTML = "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;'><span style='font-size:0.78rem; font-weight:800; color:" + (idx === 0 ? "var(--meta-blue)" : "var(--text-primary)") + ";'>Top-" + (idx+1) + " Recuperado (Chunk #" + r.chunk + ")</span><span style='font-family:var(--font-mono); font-weight:800; font-size:0.82rem; color:var(--accent-success);'>Similitud: " + r.score.toFixed(4) + "</span></div><p style='font-size:0.88rem; color:var(--text-secondary); margin:0; line-height:1.55;'>" + r.text + "</p>";
 searchResultsContainer.appendChild(item);
 });
 }, 220);
 });
 }

 generateChunks();
 })();

 /* 8. BUSCADOR Y FILTRADO DEL GLOSARIO TÉCNICO */
 (function initGlossaryFilter(){
 var searchInput = document.getElementById("glossary-search-input");
 var filterPills = document.querySelectorAll(".glossary-filter-pill");
 var glossaryItems = document.querySelectorAll(".glossary-row-item");

 if(!searchInput || glossaryItems.length === 0) return;

 var currentCategory = "todos";

 function filterGlossary(){
 var query = searchInput.value.toLowerCase().trim();
 glossaryItems.forEach(function(item){
 var term = item.querySelector(".glossary-term-name").textContent.toLowerCase();
 var desc = item.querySelector(".glossary-term-desc").textContent.toLowerCase();
 var category = item.getAttribute("data-category");

 var matchesQuery = !query || term.includes(query) || desc.includes(query);
 var matchesCategory = currentCategory === "todos" || category === currentCategory;

 item.style.display = (matchesQuery && matchesCategory) ? "grid" : "none";
 });
 }

 searchInput.addEventListener("input", filterGlossary);

 filterPills.forEach(function(pill){
 pill.addEventListener("click", function(){
 if(window.SOUND) window.SOUND.playPop(350);
 filterPills.forEach(function(p){ p.classList.remove("active"); });
 pill.classList.add("active");
 currentCategory = pill.getAttribute("data-category");
 filterGlossary();
 });
 });
 })();

})();
