/**
 * Meta AI - Módulo 1 Tema 2: Prompt Engineering y RAG con Llama
 * Laboratorios Interactivos, Simuladores y Motor de Evaluación
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

  /* 2. MOTOR DE EVALUACIÓN DE QUIZZES (7 PREGUNTAS) CON FEEDBACK AUDITIVO & CERTIFICADO */
  var totalQuizzes = document.querySelectorAll(".quiz-box").length;
  var quizCounterText = document.getElementById("quiz-counter-text");
  var btnResetAllQuizzes = document.getElementById("btn-reset-all-quizzes");
  var certPanel = document.getElementById("certificate-panel");
  var certDate = document.getElementById("cert-date");

  if(certDate){
    certDate.textContent = new Date().toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' });
  }

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

    if(correctCount === totalQuizzes && certPanel){
      if(certPanel.style.display !== "block"){
        certPanel.style.display = "block";
        certPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if(window.celebrateConfetti) window.celebrateConfetti();
      }
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
      if(certPanel) certPanel.style.display = "none";
      updateQuizScore();
    });
  }

  /* 3. SIMULADOR 1.2.1: PLAYGROUND PROMPTING (ZERO-SHOT VS FEW-SHOT VS CHAIN-OF-THOUGHT) */
  (function initPromptingPlayground(){
    var strategyBtns = document.querySelectorAll(".prompt-strategy-btn");
    var taskSelector = document.getElementById("prompt-task-select");
    var promptInputView = document.getElementById("prompt-input-preview");
    var promptOutputView = document.getElementById("prompt-output-preview");
    var promptMetricsPill = document.getElementById("prompt-metrics-pill");
    var btnExecutePrompt = document.getElementById("btn-run-prompt-sim");

    if(!promptInputView || !promptOutputView) return;

    var tasksData = {
      math: {
        title: "Problema Aritmético Multi-Paso",
        zero: {
          input: "Pregunta: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?",
          output: "Resumen: Quedan 2,490 tornillos.",
          note: "Zero-Shot: El modelo intenta adivinar el resultado final en un solo salto probabilístico sin razonamiento intermedio. En tareas complejas suele equivocarse o aproximar.",
          status: "⚠️ Riesgo de error de cálculo (Salto directo sin verificación)"
        },
        few: {
          input: "Ejemplo 1:\nEntrada: Hay 10 cajas con 5 botellas. Vendo 2 cajas. ¿Cuántas botellas quedan?\nSalida: Quedan 40 botellas.\n\nEjemplo 2:\nEntrada: Tengo 8 bolsas con 4 manzanas. Regalo 3 bolsas y 2 manzanas. ¿Cuántas quedan?\nSalida: Quedan 18 manzanas.\n\nConsulta:\nEntrada: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?\nSalida: ",
          output: "Quedan 2,500 tornillos.",
          note: "Few-Shot: Calibra el formato de salida conciso, pero aún carece de pasos de razonamiento intermedio para operaciones numéricas complejas.",
          status: "⚡ Formato estandarizado (Alineado por demostraciones)"
        },
        cot: {
          input: "Pregunta: En un almacén hay 45 cajas. Cada caja tiene 12 paquetes y cada paquete tiene 5 tornillos. Si se venden 3 cajas completas y 4 paquetes sueltos, ¿cuántos tornillos quedan en el almacén?\nInstrucción: Piensa paso a paso antes de dar la respuesta final.",
          output: "Razonamiento paso a paso:\n1. Total inicial:\n   - Tornillos por caja = 12 paquetes × 5 tornillos = 60 tornillos.\n   - Total inicial = 45 cajas × 60 tornillos = 2,700 tornillos.\n2. Cantidad vendida:\n   - 3 cajas = 3 × 60 = 180 tornillos.\n   - 4 paquetes sueltos = 4 × 5 = 20 tornillos.\n   - Total vendido = 180 + 20 = 200 tornillos.\n3. Tornillos restantes:\n   - 2,700 - 200 = 2,500 tornillos.\n\nRespuesta final: Quedan exactamente 2,500 tornillos.",
          note: "Chain-of-Thought (CoT): El modelo descompone el problema en sub-cálculos secuenciales, garantizando una precisión matemática del 100%.",
          status: "✅ 100% Preciso & Verificable (Razonamiento deductivo paso a paso)"
        }
      },
      sentiment: {
        title: "Clasificación de Reseñas de Clientes",
        zero: {
          input: "Clasifica esta reseña: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'",
          output: "La reseña es de carácter negativo debido a la mala experiencia con el estado del producto y el servicio.",
          note: "Zero-Shot: Devuelve una respuesta conversacional y verbosa en lugar de una etiqueta estructurada fija.",
          status: "⚠️ Salida conversacional no normalizada"
        },
        few: {
          input: "Clasifica el sentimiento en una sola etiqueta: [Positiva, Negativa, Neutra]\n\nTexto: 'Excelente servicio, volvería a comprar.'\nSentimiento: Positiva\n\nTexto: 'El producto cumple su función básica.'\nSentimiento: Neutra\n\nTexto: 'No enciende y tardó 3 semanas.'\nSentimiento: Negativa\n\nTexto: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'\nSentimiento:",
          output: "Negativa",
          note: "Few-Shot: Al mostrarle 3 ejemplos, el modelo responde exactamente con la palabra clave requerida, listo para ingesta en bases de datos.",
          status: "✅ Salida 100% estructurada para integración en software"
        },
        cot: {
          input: "Clasifica esta reseña analizando pros y contras: 'El paquete llegó a tiempo, pero el producto venía roto y la atención fue pésima.'",
          output: "Análisis de aspectos:\n- Logística de entrega: Positiva ('llegó a tiempo').\n- Calidad del artículo: Negativa crítica ('venía roto').\n- Soporte al cliente: Negativa crítica ('atención pésima').\n\nBalance general: Negativa dominante (el fallo del producto y la mala atención superan la puntualidad del envío).\nClasificación final: Negativa",
          note: "Chain-of-Thought: Analiza sentimientos mixtos por aspectos antes de emitir la decisión final.",
          status: "✅ Análisis granular multi-aspecto"
        }
      },
      json: {
        title: "Extracción Estructurada de Datos JSON",
        zero: {
          input: "Extrae los datos de esta orden: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.' en formato JSON.",
          output: "Aquí tienes el JSON solicitado:\n```json\n{\n  \"comprador\": \"Juan Pérez\",\n  \"articulos\": \"2 laptops Dell XPS\",\n  \"precio_unitario\": \"1,200 USD\"\n}\n```",
          note: "Zero-Shot: Incluye texto explicativo antes del JSON y nombres de claves arbitrarios no normalizados.",
          status: "⚠️ Requiere regex o parsing adicional para extraer el bloque"
        },
        few: {
          input: "Extrae los datos siguiendo exactamente el esquema del ejemplo:\n\nTexto: 'Ana Gómez compró 1 monitor LG por 300 USD.'\nJSON: {\"customer\":\"Ana Gómez\",\"item\":\"Monitor LG\",\"quantity\":1,\"unit_price\":300.0,\"currency\":\"USD\"}\n\nTexto: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.'\nJSON:",
          output: "{\"customer\":\"Juan Pérez\",\"item\":\"Laptop Dell XPS\",\"quantity\":2,\"unit_price\":1200.0,\"currency\":\"USD\",\"date\":\"2024-03-15\"}",
          note: "Few-Shot: Respeta fielmente los tipos de datos (float, integer) y los nombres exactos de las claves.",
          status: "✅ JSON sintácticamente puro y compatible con Pydantic"
        },
        cot: {
          input: "Extrae los datos en JSON validando coherencia matemática:\nTexto: 'Cliente Juan Pérez compró 2 laptops Dell XPS a 1,200 USD cada una el 15 de marzo de 2024.'",
          output: "Validación de campos:\n- Nombre detectado: 'Juan Pérez'\n- Producto: 'Dell XPS' (Categoría: Laptop)\n- Cantidad: 2 unidades\n- Precio unitario: 1,200.00 USD\n- Total calculado: 2 × 1,200 = 2,400.00 USD\n\n```json\n{\n  \"customer\": \"Juan Pérez\",\n  \"product\": \"Dell XPS\",\n  \"quantity\": 2,\n  \"unit_price_usd\": 1200.0,\n  \"total_price_usd\": 2400.0,\n  \"transaction_date\": \"2024-03-15\"\n}\n```",
          note: "Chain-of-Thought: Calcula subtotales y valida la consistencia de los datos antes de emitir el objeto serializado.",
          status: "✅ Extracción con validación de integridad financiera"
        }
      }
    };

    var currentTask = "math";
    var currentStrategy = "few";

    function renderPromptPreview(){
      var data = tasksData[currentTask][currentStrategy];
      promptInputView.textContent = data.input;
      promptOutputView.textContent = data.output;
      if(promptMetricsPill){
        promptMetricsPill.innerHTML = "<b>Estrategia:</b> " + currentStrategy.toUpperCase() + " · <b>Estado:</b> " + data.status;
      }
    }

    strategyBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(420);
        strategyBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        currentStrategy = btn.getAttribute("data-strategy");
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

    renderPromptPreview();
  })();

  /* 4. SIMULADOR 1.2.2: MEMORIA PARAMÉTRICA VS RAG (DETECTOR DE ALUCINACIONES) */
  (function initHallucinationSimulator(){
    var testBtns = document.querySelectorAll(".hallucination-case-btn");
    var modelDirectBox = document.getElementById("model-direct-response");
    var modelRagBox = document.getElementById("model-rag-response");

    if(!modelDirectBox || !modelRagBox) return;

    var cases = {
      policy: {
        direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'Nuestra política de devolución permite reembolsos dentro de los primeros 30 días posteriores a la compra presentando el ticket original en sucursal.'",
        directStatus: "❌ ALUCINACIÓN FÁCTICA: La política cambió el 1 de enero a 15 días y trámite 100% digital. El modelo responde con datos viejos de su entrenamiento con total seguridad.",
        ragContext: "Documento Recuperado de Base Vectorial (Actualizado Q1 2024):\n'A partir del 1 de enero de 2024, el periodo de devolución es de 15 días naturales y debe solicitarse mediante el portal web de autogestión.'",
        rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'De acuerdo con la política vigente actualizada para 2024, tienes 15 días naturales desde tu compra para solicitar tu reembolso directamente a través de nuestro portal web de autogestión.'",
        ragStatus: "✅ 100% Fidedigna: Respuesta anclada a los documentos reales de la empresa."
      },
      medical: {
        direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'El medicamento Cardiopril no tiene contraindicaciones reportadas con antiácidos comunes.'",
        directStatus: "❌ ALUCINACIÓN PELIGROSA: La autoridad sanitaria emitió una alerta el mes pasado sobre inhibición de absorción con sales de magnesio.",
        ragContext: "Alerta Sanitaria Oficial (Boletín Farmacéutico - Mes en Curso):\n'Se restringe el uso simultáneo de Cardiopril con antiácidos a base de hidróxido de magnesio por reducción del 40% en biodisponibilidad.'",
        rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'Según la alerta sanitaria oficial más reciente, no debes tomar Cardiopril junto con antiácidos a base de hidróxido de magnesio, ya que disminuyen su absorción en un 40%.'",
        ragStatus: "✅ Cero Alucinación: Seguridad clínica garantizada con fuentes oficiales."
      },
      pricing: {
        direct: "Respuesta de Llama 3 (Solo Memoria Paramétrica):\n'El plan Pro cuesta $29 USD mensuales e incluye 5 usuarios.'",
        directStatus: "❌ INFORMACIÓN OBSOLETA: Los precios cambiaron a $39 USD hace 2 semanas.",
        ragContext: "Tarifario Vigente (Base de Datos Comercial):\n'Plan Pro: $39 USD/mes, incluye 10 usuarios y soporte prioritario 24/7.'",
        rag: "Respuesta de Llama 3 (Aumentada con RAG):\n'El Plan Pro tiene un costo vigente de $39 USD mensuales e incluye acceso para 10 usuarios con soporte prioritario 24/7.'",
        ragStatus: "✅ Precisión Financiera: Cotizaciones comerciales exactas al día de hoy."
      }
    };

    function renderCase(caseKey){
      var item = cases[caseKey];
      modelDirectBox.innerHTML = "<p style='margin:0;'>" + item.direct.replace(/\n/g, "<br>") + "</p><div style='margin-top:0.6rem; font-size:0.82rem; font-weight:700; color:#ef4444;'>" + item.directStatus + "</div>";
      modelRagBox.innerHTML = "<div style='background:rgba(59,130,246,0.08); border-left:3px solid var(--meta-blue); padding:0.6rem 0.8rem; border-radius:6px; font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.6rem;'><b>Contexto Inyectado:</b> " + item.ragContext + "</div><p style='margin:0;'>" + item.rag.replace(/\n/g, "<br>") + "</p><div style='margin-top:0.6rem; font-size:0.82rem; font-weight:700; color:var(--accent-success);'>" + item.ragStatus + "</div>";
    }

    testBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(440);
        testBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        renderCase(btn.getAttribute("data-case"));
      });
    });

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

    setPipelineStep(1);
  })();

  /* 6. SIMULADOR 1.2.4: CALCULADORA GEOMÉTRICA DE SIMILITUD COSENO & EMBEDDINGS 2D */
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
      var cssHeight = 270;

      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = cssWidth + "px";
      canvas.style.height = cssHeight + "px";

      if(ctx.resetTransform) { ctx.resetTransform(); } else { ctx.setTransform(1, 0, 0, 1, 0, 0); }
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var ox = 45, oy = cssHeight - 38;
      var scale = Math.min(cssWidth - 85, cssHeight - 65);

      // Cuadrícula sutil
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 1;
      for(var x = ox; x < cssWidth - 20; x += 40){ ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, oy); ctx.stroke(); }
      for(var y = 20; y <= oy; y += 40){ ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(cssWidth - 20, y); ctx.stroke(); }

      // Ejes coordenados principales
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(15, 23, 42, 0.25)";
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

      // Cabeza de flecha Vector A
      var angA = Math.atan2(pair.vecA[1], pair.vecA[0]);
      ctx.beginPath(); ctx.arc(ax, ay, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
      ctx.beginPath(); ctx.arc(ax, ay, 12, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
      ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("Vector u (Frase A)", ax + 12, ay - 6);

      // Vector B
      var bx = ox + pair.vecB[0] * scale;
      var by = oy - pair.vecB[1] * scale;
      ctx.strokeStyle = "#10b981";
      ctx.fillStyle = "#10b981";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy); ctx.lineTo(bx, by);
      ctx.stroke();

      // Cabeza de flecha Vector B
      var angB = Math.atan2(pair.vecB[1], pair.vecB[0]);
      ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
      ctx.fillText("Vector v (Frase B)", bx + 12, by + 14);

      // Cálculo matemático real
      var dot = pair.vecA[0] * pair.vecB[0] + pair.vecA[1] * pair.vecB[1];
      var normA = Math.sqrt(pair.vecA[0]*pair.vecA[0] + pair.vecA[1]*pair.vecA[1]);
      var normB = Math.sqrt(pair.vecB[0]*pair.vecB[0] + pair.vecB[1]*pair.vecB[1]);
      var cosSim = dot / (normA * normB);
      var angleDeg = (Math.acos(Math.min(1, Math.max(-1, cosSim))) * 180 / Math.PI);

      // Arco del ángulo theta
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(ox, oy, 42, -Math.max(angA, angB), -Math.min(angA, angB));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px 'Fira Code', monospace";
      ctx.fillText("θ = " + angleDeg.toFixed(1) + "°", ox + 48, oy - 24);

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
