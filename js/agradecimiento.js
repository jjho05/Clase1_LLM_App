/**
 * Meta AI - Página de Agradecimiento & Cierre
 * Interactivity:
 * - Celebración de confeti al cargar y por botón
 * - Copiado al portapapeles de resumen curricular para LinkedIn / CV
 * - Disparo de impresión / guardado en PDF
 * - Animación de contadores de métricas del sitio
 * - Feedback acústico Web Audio API
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    triggerWelcomeCelebration();
    animateCounters();
    initUtilityButtons();
  });

  // Lanzar confeti al entrar a la página
  function triggerWelcomeCelebration() {
    setTimeout(function(){
      if (typeof window.celebrateConfetti === "function") {
        window.celebrateConfetti();
      }
    }, 600);
  }

  // Animar los contadores de métricas del sitio
  function animateCounters() {
    var counters = document.querySelectorAll(".agr-counter-val[data-target]");
    counters.forEach(function(el) {
      var target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 30));
      var interval = setInterval(function() {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current + (el.getAttribute("data-suffix") || "");
      }, 40);
    });
  }

  // Inicializar botones de utilidad
  function initUtilityButtons() {
    var btnConfetti = document.getElementById("btn-confetti-trigger");
    var btnCopy = document.getElementById("btn-copy-summary");
    var btnPrint = document.getElementById("btn-print-summary");
    var toast = document.getElementById("agr-toast");

    // 1. Botón de Confeti
    if (btnConfetti) {
      btnConfetti.addEventListener("click", function(){
        if (window.SOUND && typeof window.SOUND.playChime === "function") {
          window.SOUND.playChime();
        }
        if (typeof window.celebrateConfetti === "function") {
          window.celebrateConfetti();
        }
      });
    }

    // 2. Botón Copiar Resumen para LinkedIn / CV
    if (btnCopy) {
      btnCopy.addEventListener("click", function(){
        var summaryText = [
          "Formación Especializada en Inteligencia Artificial Aplicada & Meta Llama 3",
          "Autor del programa: Ing. Jesús Javier Hernandez Olvera",
          "",
          "Competencias Técnicas Dominadas:",
          "• Arquitectura Transformer: Multi-Head Attention, Rotary Positional Embedding (RoPE), KV Cache y Grouped-Query Attention (GQA).",
          "• Fine-Tuning PEFT: Ajuste de bajo rango con LoRA/QLoRA en 4-bit (NF4) y Unsloth.",
          "• Agentes Autónomos con WhatsApp Cloud API: Conexión asíncrona mediante webhooks HMAC SHA-256 en FastAPI.",
          "• Memoria de Estado: Persistencia multi-tenant en Redis con TTL dinámico, sliding window y compresión de resumen.",
          "• Function Calling: Inferencia en dos pasos (Two-Pass), esquemas JSON Schema y validación defensiva con Pydantic V2.",
          "• Blindaje y Moderación: Dual-Shield con Llama Guard 3 (14 categorías de riesgo) y Prompt Guard 86M.",
          "• Infraestructura de Producción: Despliegue con Docker Compose, NGINX SSL reverse proxy, observabilidad SRE y métricas P95/P99 en Prometheus/Grafana."
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(summaryText).then(function(){
            showToast("Resumen copiado al portapapeles con éxito");
            if (window.SOUND && typeof window.SOUND.playPop === "function") {
              window.SOUND.playPop(520);
            }
          }).catch(function(){
            fallbackCopy(summaryText);
          });
        } else {
          fallbackCopy(summaryText);
        }
      });
    }

    function fallbackCopy(text) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        showToast("Resumen copiado al portapapeles");
      } catch (err) {
        showToast("Selecciona el texto manualmente");
      }
      document.body.removeChild(textarea);
    }

    function showToast(msg) {
      if (!toast) return;
      var msgEl = document.getElementById("agr-toast-msg");
      if (msgEl) msgEl.textContent = msg;
      toast.classList.add("show");
      setTimeout(function(){
        toast.classList.remove("show");
      }, 3200);
    }

    // 3. Botón Imprimir / PDF
    if (btnPrint) {
      btnPrint.addEventListener("click", function(){
        if (window.SOUND && typeof window.SOUND.playPop === "function") {
          window.SOUND.playPop(440);
        }
        window.print();
      });
    }
  }

})();
