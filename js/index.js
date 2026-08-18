/**
 * Meta AI - Portal Maestro (Index)
 * Controladores interactivos: Selector de Capas de Arquitectura, Inspector de Hitos del Roadmap y Acordeón FAQ
 */

(function(){
  "use strict";

  /* 1. SELECTOR INTERACTIVO DE CAPAS DE ARQUITECTURA */
  var layerData = {
    base: {
      title: "Capa 1: Modelo Base de Pesos Abiertos (Llama 3)",
      badge: "Inferencia Local · Parámetros Sinápticos",
      desc: "El cimiento del sistema: modelos Llama 3 (8B, 70B y 405B) con vocabulario BPE extendido de 128k tokens, compresión Grouped-Query Attention (GQA) y soporte nativo para inferencia cuantizada en 4-bit (NF4/AWQ/GGUF) a más de 48 tokens/segundo en GPUs comerciales sin costo por token.",
      tech: ["PyTorch 2.4", "Transformers", "BPE 128k", "GQA", "AWQ / NF4"],
      deliverable: "Motor de inferencia soberano desplegado 100% en local con latencia ultrabaja."
    },
    rag: {
      title: "Capa 2: Adaptación con RAG & LoRA / QLoRA",
      badge: "Búsqueda Semántica · Fine-Tuning Eficiente",
      desc: "Especialización dual del modelo: inyección de conocimiento dinámico mediante RAG (embeddings densos en base vectorial para políticas corporativas actualizables) y ajuste fino de tono y estilo con LoRA/QLoRA entrenando menos del 1% de parámetros en una sola GPU.",
      tech: ["LoRA / QLoRA", "LlamaIndex", "Embeddings BGE", "ChromaDB / Qdrant", "PEFT"],
      deliverable: "Pipeline RAG con cero alucinaciones y adaptadores LoRA especializados por dominio."
    },
    fastapi: {
      title: "Capa 3: Microservicio de Inferencia Asíncrono",
      badge: "API REST · Streaming SSE · Tipado Zod/Pydantic",
      desc: "Servidor de producción construido con FastAPI que expone endpoints HTTP robustos con validación estricta de esquemas, streaming de tokens Server-Sent Events (SSE), colas asíncronas de tareas en segundo plano y suite de pruebas automatizadas end-to-end.",
      tech: ["FastAPI", "Uvicorn", "Pydantic V2", "PyTest", "Streaming SSE"],
      deliverable: "Endpoint HTTP con contrato OpenAPI listo para ser consumido por cualquier cliente."
    },
    agent: {
      title: "Capa 4: Agentes WhatsApp & Seguridad Llama Guard",
      badge: "WhatsApp Cloud API · Tools · Llama Guard 3",
      desc: "Orquestación del agente conversacional empresarial: recepción de webhooks de Meta con firma criptográfica X-Hub-Signature, gestión de estado y memoria de sesión por número telefónico con Llama Stack, Function Calling en Python para bases de datos y barreras Prompt Guard + Llama Guard 3.",
      tech: ["WhatsApp Cloud API", "Llama Stack", "Function Calling", "Llama Guard 3", "Prompt Guard"],
      deliverable: "Agente autónomo empresarial en WhatsApp con memoria persistente y seguridad blindada."
    }
  };

  var layerBtns = document.querySelectorAll(".arch-layer-btn");
  var layerTitle = document.getElementById("layer-dyn-title");
  var layerBadge = document.getElementById("layer-dyn-badge");
  var layerDesc = document.getElementById("layer-dyn-desc");
  var layerTech = document.getElementById("layer-dyn-tech");
  var layerDeliv = document.getElementById("layer-dyn-deliv");
  var detailPanel = document.querySelector(".arch-detail-panel");

  function setLayer(key){
    var d = layerData[key];
    if(!d) return;

    if(layerTitle) layerTitle.textContent = d.title;
    if(layerBadge) layerBadge.textContent = d.badge;
    if(layerDesc) layerDesc.textContent = d.desc;
    if(layerDeliv) layerDeliv.innerHTML = "<b>Entregable:</b> " + d.deliverable;

    if(layerTech){
      layerTech.innerHTML = "";
      d.tech.forEach(function(t, idx){
        var span = document.createElement("span");
        span.className = "tech-pill";
        span.textContent = t;
        span.style.animation = "chipPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) backwards";
        span.style.animationDelay = (idx * 40) + "ms";
        layerTech.appendChild(span);
      });
    }

    if(detailPanel && typeof detailPanel.animate === "function"){
      detailPanel.animate([
        { opacity: 0.4, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], {
        duration: 250,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)"
      });
    }
  }

  layerBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(440);
      layerBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var key = btn.getAttribute("data-layer");
      setLayer(key);
    });
  });

  // Inicializar primera capa
  setLayer("base");

  /* 2. EFECTO DE SONIDO EN FAQ */
  document.querySelectorAll(".faq-item summary").forEach(function(el){
    el.addEventListener("click", function(){
      if(window.SOUND) window.SOUND.playPop(360);
    });
  });

})();
