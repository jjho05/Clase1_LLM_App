/**
 * Meta AI - Página de Agradecimiento
 * Interactivity:
 * - Celebración de confeti al cargar
 * - Animación de contadores de métricas del sitio
 * - Botón de regreso con efecto
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    triggerWelcomeCelebration();
    animateCounters();
  });

  // Lanzar confeti suave al entrar a la página
  function triggerWelcomeCelebration() {
    setTimeout(function(){
      if (typeof window.celebrateConfetti === "function") {
        window.celebrateConfetti();
      }
    }, 700);
  }

  // Animar los contadores de métricas del sitio
  function animateCounters() {
    const counters = document.querySelectorAll(".agr-counter-val[data-target]");
    counters.forEach(function(el) {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(function() {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current + (el.getAttribute("data-suffix") || "");
      }, 35);
    });
  }

})();
