/**
 * Meta AI - Módulo 1 Tema 1: Fundamentos de LLMs y Arquitectura de Llama
 * Laboratorios Interactivos, Simuladores y Motor de Evaluación
 */

(function(){
  "use strict";

  /* 1. NAVEGACIÓN ACTIVA DE MÓDULOS EN SCROLL */
  var navLinks = document.querySelectorAll(".nav-link-item");
  var modules = document.querySelectorAll(".module-block, .glossary-section, .sources-section");

  window.addEventListener("scroll", function(){
    var scrollPos = window.scrollY + 75;
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

  /* 2. MOTOR DE QUIZZES CON CONTADOR, RESET Y CERTIFICADO */
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

  /* 3. BANCO 1.1: PREDICCIÓN DE PALABRAS */
  (function initLab11(){
    var pText = document.getElementById("p-text");
    var pPreds = document.getElementById("p-preds");
    var pFinalContainer = document.getElementById("p-final-container");
    var pStepCounter = document.getElementById("p-step-counter");
    var pReplay = document.getElementById("p-replay");
    var pReplayTop = document.getElementById("p-replay-top");
    var tempSlider = document.getElementById("temp-slider");
    var tempIndicator = document.getElementById("temp-val-indicator");

    if(!pText || !pPreds) return;

    var basePrompt = "El modelo Llama";
    var currentSentence = basePrompt;

    var steps = [
      {
        candidates: [
          { word: "aprende", prob: 62, tag: "Verbo (Frecuente)", rationale: "El modelo asocia 'aprender' con optimización de gradiente descendente." },
          { word: "procesa", prob: 24, tag: "Verbo (Técnico)", rationale: "Describe el flujo de datos de tensores en capas de atención." },
          { word: "genera", prob: 14, tag: "Verbo (Generativo)", rationale: "Enfocado en la salida de tokens de texto." }
        ]
      },
      {
        candidates: [
          { word: "información con", prob: 58, tag: "Complemento Directo", rationale: "Conecta la acción con la estructura de datos." },
          { word: "parámetros de", prob: 27, tag: "Término de Redes", rationale: "Alude a los pesos sinápticos de la red." },
          { word: "respuestas mediante", prob: 15, tag: "Inferencia", rationale: "Describe la interacción con el usuario." }
        ]
      },
      {
        candidates: [
          { word: "alta precisión y velocidad.", prob: 70, tag: "Cierre Óptimo", rationale: "Secuencia de alta probabilidad estadística en el corpus de Meta." },
          { word: "inferencia local autónoma.", prob: 20, tag: "Soberanía", rationale: "Destaca la ejecución sin conexión en hardware local." },
          { word: "atención agrupada GQA.", prob: 10, tag: "Arquitectura", rationale: "Enfoque en la eficiencia de memoria KV Cache." }
        ]
      }
    ];

    var currentStep = 0;
    var chosenWords = [];

    if(tempSlider){
      tempSlider.addEventListener("input", function(){
        if(tempIndicator) tempIndicator.textContent = tempSlider.value;
        renderStep();
      });
    }

    var pInstruction = document.getElementById("p-instruction");

    function renderStep(){
      // Actualizamos siempre el texto acumulado para que incluya la última palabra seleccionada
      if(pText) pText.textContent = currentSentence;

      if(currentStep >= steps.length){
        pPreds.innerHTML = "";
        pFinalContainer.style.display = "block";
        if(pInstruction) pInstruction.style.display = "none";
        if(pStepCounter) pStepCounter.textContent = "3 / 3 (Completado)";
        
        var tempUsed = tempSlider ? parseFloat(tempSlider.value) : 0.7;
        pFinalContainer.innerHTML = `
          <div class="final-result-card">
            <div class="title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>¡Frase Completada Exitosamente por la IA!</span>
            </div>
            <p style="font-size: 1.18rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.9rem; line-height: 1.5;">
              "${currentSentence}"
            </p>
            <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7; background: var(--bg-surface); padding: 1rem 1.2rem; border-radius: 10px; border: 1px solid var(--border-subtle);">
              <b>Análisis de la Inferencia:</b> El modelo construyó la frase token por token usando una <b>Temperatura de ${tempUsed}</b>. Cada palabra seleccionada aportó contexto en cada paso, alterando los logits de las opciones posteriores mediante la matriz de auto-atención.
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.6rem;">
              <button class="btn-primary" onclick="document.getElementById('p-replay').click()" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5"/></svg>
                <span>Simular Otra Frase</span>
              </button>
            </div>
          </div>
        `;
        return;
      }

      if(pInstruction) pInstruction.style.display = "block";
      pFinalContainer.style.display = "none";
      if(pStepCounter) pStepCounter.textContent = (currentStep + 1) + " / " + steps.length;
      pPreds.innerHTML = "";
      
      var temp = tempSlider ? parseFloat(tempSlider.value) : 0.7;
      var s = steps[currentStep];

      s.candidates.forEach(function(cand, idx){
        var adjustedProb = Math.round(cand.prob * (1.2 - temp * 0.2));
        if(adjustedProb > 95) adjustedProb = 95;
        if(adjustedProb < 5) adjustedProb = 5;

        var card = document.createElement("div");
        card.className = "token-prob-card";
        card.style.animation = "chipPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) backwards";
        card.style.animationDelay = (idx * 45) + "ms";
        card.innerHTML = `
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <b style="font-size: 1.05rem; color: var(--text-primary);">${cand.word}</b>
              <span style="font-size: 0.72rem; color: var(--meta-blue); background: var(--meta-blue-subtle); padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 700;">${cand.tag}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem;">${cand.rationale}</div>
            <div class='prob-fill' style='width:${adjustedProb}%'></div>
          </div>
          <span style='font-size: 0.95rem; font-weight: 800; color: var(--meta-blue); font-family: var(--font-mono); margin-left: 1rem;'>${adjustedProb}%</span>
        `;
        card.addEventListener("click", function(){
          if(window.SOUND) window.SOUND.playPop(520 + currentStep * 80);
          chosenWords.push(cand.word);
          currentSentence += " " + cand.word;
          currentStep++;
          renderStep();
        });
        pPreds.appendChild(card);
      });
    }

    function resetSteps(){
      if(window.SOUND) window.SOUND.playPop(400);
      currentStep = 0;
      chosenWords = [];
      currentSentence = basePrompt;
      renderStep();
    }

    if(pReplay) pReplay.addEventListener("click", resetSteps);
    if(pReplayTop) pReplayTop.addEventListener("click", resetSteps);

    renderStep();
  })();

  /* 4. BANCO 1.2: NLP PIPELINE */
  (function initLab12(){
    var data = {
      voice: { txt: "reproducir música", tensors: "[4120, 892, 104]", out: "Ejecutando streaming de audio" },
      translate: { txt: "Good morning", tensors: "[612, 2043]", out: "Buenos días" },
      assistant: { txt: "¿cuál es el estado?", tensors: "[71, 900, 355]", out: "Todos los servicios en línea" },
      code: { txt: "def fibonacci(n):", tensors: "[944, 45192, 7, 89, 29]", out: "Función recursiva en Python" }
    };
    var chips = document.querySelectorAll(".nlp-chip");

    function applyData(d){
      var humanTxt = document.getElementById("nlp-human-txt");
      var tensorBox = document.getElementById("nlp-tensor-box");
      var outTxt = document.getElementById("nlp-out-txt");
      
      [humanTxt, tensorBox, outTxt].forEach(function(el){
        if(el && typeof el.animate === "function"){
          el.animate([
            { opacity: 0.3, transform: "translateY(5px)" },
            { opacity: 1, transform: "translateY(0)" }
          ], { duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        }
      });

      if(humanTxt) humanTxt.textContent = d.txt;
      if(tensorBox) tensorBox.textContent = d.tensors;
      if(outTxt) outTxt.textContent = d.out;
    }

    chips.forEach(function(btn){
      btn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(480);
        chips.forEach(function(c){ c.classList.remove("active"); });
        btn.classList.add("active");
        var key = btn.getAttribute("data-ex");
        var d = data[key] || data.voice;
        applyData(d);
      });
    });

    var resetBtn = document.getElementById("nlp-reset-btn");
    if(resetBtn){
      resetBtn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(350);
        chips.forEach(function(c){ c.classList.remove("active"); });
        if(chips[0]) chips[0].classList.add("active");
        applyData(data.voice);
      });
    }
  })();

  /* 5. BANCO 2.1: TOKENIZADOR CON LIMPIAR Y RESETEAR */
  (function initLab21(){
    var input = document.getElementById("tk-input-box");
    var output = document.getElementById("tk-output-chips");
    var valCount = document.getElementById("tk-val-count");
    var valChars = document.getElementById("tk-val-chars");
    var valCost = document.getElementById("tk-val-cost");
    var btnClear = document.getElementById("btn-clear-tokens");
    var btnReset = document.getElementById("btn-reset-tokens");

    if(!input || !output) return;

    var defaultSample = "Meta Llama 3 impulsa el desarrollo de Inteligencia Artificial";

    function tokenize(t){
      if(!t) return [];
      var parts = t.split(/(\s+|[.,!?:;¡¿])/g).filter(Boolean);
      var res = [];
      var hash = 2048;
      parts.forEach(function(p){
        if(!p.trim()) return;
        if(p.length > 7){
          res.push({ txt: p.slice(0, 5), id: (hash += 31) % 128000 });
          res.push({ txt: p.slice(5), id: (hash += 47) % 128000 });
        } else {
          res.push({ txt: p, id: (hash += 19) % 128000 });
        }
      });
      return res;
    }

    function update(){
      var val = input.value;
      var toks = tokenize(val);
      output.innerHTML = "";
      if(toks.length === 0){
        output.innerHTML = "<span style='color:var(--text-muted); font-size:0.9rem;'>Escribe un texto arriba para generar tokens...</span>";
      } else {
        toks.forEach(function(tok, idx){
          var badge = document.createElement("div");
          badge.className = "tok-badge";
          badge.style.animation = "chipPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) backwards";
          badge.style.animationDelay = (idx * 25) + "ms";
          badge.innerHTML = "<span class='txt'>" + tok.txt + "</span><span class='id'>ID " + tok.id + "</span>";
          output.appendChild(badge);
        });
      }
      if(valCount) valCount.textContent = toks.length;
      if(valChars) valChars.textContent = val.length;
      if(valCost) valCost.textContent = "$" + (toks.length * 0.0000002).toFixed(6);
    }

    input.addEventListener("input", function(){
      if(window.SOUND) window.SOUND.playPop(340);
      update();
    });

    if(btnClear){
      btnClear.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(250);
        input.value = "";
        update();
        input.focus();
      });
    }

    if(btnReset){
      btnReset.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(420);
        input.value = defaultSample;
        update();
      });
    }

    update();
  })();

  /* 6. BANCO 2.2: ESPACIO VECTORIAL 2D */
  (function initLab22(){
    var canvas = document.getElementById("vec-canvas");
    if(!canvas) return;
    var ctx = canvas.getContext("2d");
    var simVal = document.getElementById("vec-sim-val");
    var btnResetCanvas = document.getElementById("btn-reset-canvas");
    var width, height;

    var defaultNodes = [
      { id: "rey", name: "Rey", x: 0.28, y: 0.3 },
      { id: "hombre", name: "Hombre", x: 0.28, y: 0.7 },
      { id: "mujer", name: "Mujer", x: 0.72, y: 0.7 },
      { id: "reina", name: "Reina", x: 0.72, y: 0.3 }
    ];
    var nodes = JSON.parse(JSON.stringify(defaultNodes));
    var dragNode = null;

    function resize(){
      var rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      draw();
    }
    window.addEventListener("resize", resize);

    function calcSim(){
      var n1 = nodes[0], n2 = nodes[3];
      var dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
      var sim = Math.max(0.1, (1 - dist * 0.8)).toFixed(2);
      if(simVal) simVal.textContent = sim;
    }

    function draw(){
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
      ctx.lineWidth = 1;
      for(var x = 0; x < width; x += 35){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke(); }
      for(var y = 0; y < height; y += 35){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke(); }

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#0866ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x * width, nodes[0].y * height);
      ctx.lineTo(nodes[1].x * width, nodes[1].y * height);
      ctx.lineTo(nodes[2].x * width, nodes[2].y * height);
      ctx.lineTo(nodes[3].x * width, nodes[3].y * height);
      ctx.stroke();
      ctx.setLineDash([]);

      nodes.forEach(function(n){
        var px = n.x * width, py = n.y * height;
        ctx.fillStyle = "#0866ff";
        ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI*2); ctx.fill();

        ctx.fillStyle = document.documentElement.getAttribute("data-theme") === "dark" ? "#ffffff" : "#0f172a";
        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText(n.name, px + 15, py + 4);
      });
      calcSim();
    }

    function handleStart(clientX, clientY){
      var rect = canvas.getBoundingClientRect();
      var mx = clientX - rect.left, my = clientY - rect.top;
      nodes.forEach(function(n){
        if(Math.hypot(mx - n.x * width, my - n.y * height) < 24){ dragNode = n; }
      });
    }

    function handleMove(clientX, clientY){
      if(!dragNode) return;
      var rect = canvas.getBoundingClientRect();
      dragNode.x = Math.max(0.05, Math.min(0.95, (clientX - rect.left) / width));
      dragNode.y = Math.max(0.05, Math.min(0.95, (clientY - rect.top) / height));
      draw();
    }

    canvas.addEventListener("mousedown", function(e){ handleStart(e.clientX, e.clientY); });
    canvas.addEventListener("mousemove", function(e){ handleMove(e.clientX, e.clientY); });
    window.addEventListener("mouseup", function(){ dragNode = null; });

    canvas.addEventListener("touchstart", function(e){
      if(e.touches.length > 0){ handleStart(e.touches[0].clientX, e.touches[0].clientY); }
    }, { passive: true });
    canvas.addEventListener("touchmove", function(e){
      if(e.touches.length > 0){ handleMove(e.touches[0].clientX, e.touches[0].clientY); }
    }, { passive: true });
    window.addEventListener("touchend", function(){ dragNode = null; });

    var btnKing = document.getElementById("btn-vec-king");
    var btnCapital = document.getElementById("btn-vec-capital");

    if(btnKing){
      btnKing.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playChime();
        nodes[0].name = "Rey"; nodes[0].x = 0.25; nodes[0].y = 0.3;
        nodes[1].name = "Hombre"; nodes[1].x = 0.25; nodes[1].y = 0.7;
        nodes[2].name = "Mujer"; nodes[2].x = 0.75; nodes[2].y = 0.7;
        nodes[3].name = "Reina"; nodes[3].x = 0.75; nodes[3].y = 0.3;
        draw();
      });
    }

    if(btnCapital){
      btnCapital.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playChime();
        nodes[0].name = "París"; nodes[0].x = 0.3; nodes[0].y = 0.35;
        nodes[1].name = "Francia"; nodes[1].x = 0.3; nodes[1].y = 0.65;
        nodes[2].name = "España"; nodes[2].x = 0.7; nodes[2].y = 0.65;
        nodes[3].name = "Madrid"; nodes[3].x = 0.7; nodes[3].y = 0.35;
        draw();
      });
    }

    if(btnResetCanvas){
      btnResetCanvas.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(320);
        nodes = JSON.parse(JSON.stringify(defaultNodes));
        draw();
      });
    }

    setTimeout(resize, 100);
  })();

  /* 7. BANCO 3.1: ATENCIÓN */
  (function initLab31(){
    var container = document.getElementById("attn-tokens-container");
    var feedback = document.getElementById("attn-feedback-text");
    var btnResetAttn = document.getElementById("btn-reset-attn");
    if(!container || !feedback) return;

    var words = ["El", "perro", "no", "cruzó", "la", "calle", "porque", "estaba", "cansado"];
    var rels = {
      7: "El token <b>'estaba'</b> apunta un 85% de atención a <b>'perro'</b> para saber quién realiza la acción.",
      1: "El token <b>'perro'</b> se relaciona principalmente con 'cruzó' y 'cansado'."
    };

    words.forEach(function(w, idx){
      var btn = document.createElement("div");
      btn.className = "attention-token";
      btn.textContent = w;
      btn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(500 + idx * 30);
        document.querySelectorAll(".attention-token").forEach(function(b, i){
          b.classList.toggle("active", i === idx);
        });
        if(feedback && typeof feedback.animate === "function"){
          feedback.animate([
            { opacity: 0.3, transform: "translateY(4px)" },
            { opacity: 1, transform: "translateY(0)" }
          ], { duration: 220, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        }
        feedback.innerHTML = rels[idx] || "La IA evalúa la relación de la palabra <b>'" + w + "'</b> con el resto de la frase.";
      });
      container.appendChild(btn);
    });

    if(btnResetAttn){
      btnResetAttn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(300);
        document.querySelectorAll(".attention-token").forEach(function(b){ b.classList.remove("active"); });
        feedback.textContent = "Haz clic en una palabra arriba para inspeccionar.";
      });
    }
  })();

  /* 8. BANCO 3.2: CALCULADORA DE HARDWARE */
  (function initLab32(){
    var slider = document.getElementById("scale-range-slider");
    var quantSelect = document.getElementById("quant-select");
    var title = document.getElementById("scale-model-title");
    var vram = document.getElementById("scale-vram-val");
    var hw = document.getElementById("scale-hw-val");
    var btnResetScale = document.getElementById("btn-reset-scale");

    if(!slider || !quantSelect || !vram) return;

    var models = [
      { name: "8B Parámetros", baseGrams: 8 },
      { name: "70B Parámetros", baseGrams: 70 },
      { name: "405B Parámetros", baseGrams: 405 }
    ];

    var currentDisplayVram = 5.5;
    var animFrame = null;

    function animateNumber(target){
      if(animFrame) cancelAnimationFrame(animFrame);
      var start = currentDisplayVram;
      var startTime = performance.now();
      var duration = 220;

      function step(now){
        var progress = Math.min((now - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        currentDisplayVram = start + (target - start) * ease;
        vram.textContent = currentDisplayVram.toFixed(1) + " GB";

        if(progress < 1){
          animFrame = requestAnimationFrame(step);
        } else {
          currentDisplayVram = target;
          vram.textContent = target.toFixed(1) + " GB";
        }
      }
      animFrame = requestAnimationFrame(step);
    }

    function calculateVRAM(isInitial){
      var m = models[slider.value] || models[0];
      var bits = parseInt(quantSelect.value, 10);
      var bytesPerParam = bits / 8;
      var targetVRAM = parseFloat((m.baseGrams * bytesPerParam * 1.25).toFixed(1));
      
      if(title) {
        title.textContent = m.name;
        if(!isInitial && typeof title.animate === "function"){
          title.animate([
            { opacity: 0.4, transform: "scale(0.95)" },
            { opacity: 1, transform: "scale(1)" }
          ], { duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        }
      }

      if(isInitial){
        vram.textContent = targetVRAM.toFixed(1) + " GB";
        currentDisplayVram = targetVRAM;
      } else {
        animateNumber(targetVRAM);
      }

      if(!hw) return;
      var newHwText = "";
      if(targetVRAM <= 8){
        newHwText = "1x RTX 3060 (8GB) o Laptop";
      } else if(targetVRAM <= 16){
        newHwText = "1x RTX 4080 (16GB) / Mac M-Series";
      } else if(targetVRAM <= 48){
        newHwText = "2x RTX 3090/4090 (48GB) / Mac Studio";
      } else {
        newHwText = "Clúster 8x NVIDIA H100 (80GB)";
      }

      if(hw.textContent !== newHwText){
        hw.textContent = newHwText;
        if(!isInitial && typeof hw.animate === "function"){
          hw.animate([
            { opacity: 0.3, transform: "translateY(4px)" },
            { opacity: 1, transform: "translateY(0)" }
          ], { duration: 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        }
      }
    }

    slider.addEventListener("input", function(){
      if(window.SOUND) window.SOUND.playPop(380 + slider.value * 100);
      calculateVRAM(false);
    });
    quantSelect.addEventListener("change", function(){
      if(window.SOUND) window.SOUND.playPop(450);
      calculateVRAM(false);
    });

    if(btnResetScale){
      btnResetScale.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(350);
        slider.value = 0;
        quantSelect.value = "4";
        calculateVRAM(false);
      });
    }

    calculateVRAM(true);
  })();

  /* 9. BANCO 4.2: INFERENCIA STREAMING */
  (function initLab42(){
    var output = document.getElementById("term-stream-output");
    var speedVal = document.getElementById("term-val-speed");
    var tokVal = document.getElementById("term-val-tokens");
    var ttftVal = document.getElementById("term-val-ttft");
    var btnRun = document.getElementById("btn-run-stream");
    var btnStop = document.getElementById("btn-stop-stream");
    var btnClearTerm = document.getElementById("btn-clear-terminal");

    if(!output || !btnRun) return;

    var isRunning = false;
    var timer = null;
    var sample = "Meta Llama 3 ejecuta inferencia local con alta velocidad y privacidad absoluta, respondiendo tus preguntas palabra por palabra en tiempo real.";

    btnRun.addEventListener("click", function(){
      if(isRunning) return;
      isRunning = true;
      if(window.SOUND) window.SOUND.playChime();
      output.textContent = "> Conectando con servidor local Llama-3-8B-Instruct...\n> Prompt: '¿Cómo funciona la arquitectura Transformer?'\n\n";
      if(ttftVal) ttftVal.textContent = "38 ms";

      var idx = 0, tokCount = 0;
      var words = sample.split(" ");

      timer = setInterval(function(){
        if(idx < words.length){
          output.textContent += words[idx++] + " ";
          tokCount += 1.3;
          if(tokVal) tokVal.textContent = Math.round(tokCount);
          if(speedVal) speedVal.textContent = (48 + Math.random() * 8).toFixed(1) + " t/s";
          if(window.SOUND) window.SOUND.playPop(680);
        } else {
          clearInterval(timer);
          isRunning = false;
          output.textContent += "\n\n[Respuesta completada en 1.8 segundos · 100% en local]";
        }
      }, 60);
    });

    if(btnStop){
      btnStop.addEventListener("click", function(){
        if(timer) clearInterval(timer);
        isRunning = false;
        output.textContent += "\n\n[Generación detenida por el usuario]";
      });
    }

    if(btnClearTerm){
      btnClearTerm.addEventListener("click", function(){
        if(timer) clearInterval(timer);
        isRunning = false;
        if(window.SOUND) window.SOUND.playPop(280);
        output.textContent = "> Consola limpia. Presiona 'Ejecutar Inferencia' para transmitir tokens...";
        if(tokVal) tokVal.textContent = "0";
        if(speedVal) speedVal.textContent = "0 t/s";
        if(ttftVal) ttftVal.textContent = "0 ms";
      });
    }
  })();

  /* 10. GLOSARIO TÉCNICO EN FORMATO DE LISTA */
  (function initGlossary(){
    var searchInput = document.getElementById("glossary-search");
    var filterBtns = document.querySelectorAll(".glossary-pill-btn");
    var items = document.querySelectorAll(".glossary-row-item");

    var currentFilter = "all";

    function filterGlossary(){
      var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

      items.forEach(function(item){
        var cat = item.getAttribute("data-category");
        var text = item.innerText.toLowerCase();
        
        var matchesCat = (currentFilter === "all" || cat === currentFilter);
        var matchesQuery = (query === "" || text.indexOf(query) !== -1);

        if(matchesCat && matchesQuery){
          item.style.display = "grid";
          item.style.animation = "fadeIn 0.25s ease backwards";
        } else {
          item.style.display = "none";
        }
      });
    }

    if(searchInput){
      searchInput.addEventListener("input", filterGlossary);
    }

    filterBtns.forEach(function(btn){
      btn.addEventListener("click", function(){
        if(window.SOUND) window.SOUND.playPop(360);
        filterBtns.forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-cat");
        filterGlossary();
      });
    });
  })();

  /* 11. FEEDBACK DE AUDIO PARA ACORDEÓN DE FÓRMULAS */
  document.querySelectorAll(".formula-breakdown-summary").forEach(function(summary){
    summary.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(390);
    });
  });

})();
