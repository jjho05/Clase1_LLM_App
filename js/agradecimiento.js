/**
 * Meta AI - Agradecimiento & Graduación Engine
 * Interactivity:
 * - Dynamic Certificate Name customization
 * - Confetti Celebration trigger
 * - Print / PDF export
 * - Cryptographic Hash Verification copy
 */

(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    initCertificateInteractions();
    triggerWelcomeCelebration();
  });

  function triggerWelcomeCelebration() {
    setTimeout(function(){
      if (typeof window.celebrateConfetti === "function") {
        window.celebrateConfetti();
      }
    }, 600);
  }

  function initCertificateInteractions() {
    const btnConfetti = document.getElementById("btn-cert-confetti");
    const btnPrint = document.getElementById("btn-cert-print");
    const btnCopyHash = document.getElementById("btn-cert-copy-hash");
    const nameField = document.getElementById("cert-name-field");
    const hashDisplay = document.getElementById("cert-hash-display");

    // 1. Botón Confeti
    if (btnConfetti) {
      btnConfetti.addEventListener("click", function(){
        if (window.SOUND) window.SOUND.playChime();
        if (typeof window.celebrateConfetti === "function") {
          window.celebrateConfetti();
        }
      });
    }

    // 2. Botón Imprimir / PDF
    if (btnPrint) {
      btnPrint.addEventListener("click", function(){
        if (window.SOUND) window.SOUND.playPop(440);
        window.print();
      });
    }

    // 3. Botón Copiar Hash
    if (btnCopyHash && hashDisplay) {
      btnCopyHash.addEventListener("click", function(){
        const hash = "e0392b10-85f9-4a37-a665-d379ba0d0bf2-dcb5569-842371e-META-LLAMA3-2026";
        if (navigator.clipboard) {
          navigator.clipboard.writeText(hash).then(function(){
            if (window.SOUND) window.SOUND.playPop(520);
            const originalText = btnCopyHash.innerHTML;
            btnCopyHash.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>Hash Copiado al Portapapeles</span>`;
            setTimeout(function(){
              btnCopyHash.innerHTML = originalText;
            }, 2500);
          });
        }
      });
    }

    // 4. Edición de Nombre en el Certificado con audio sutil
    if (nameField) {
      nameField.addEventListener("focus", function(){
        if (window.SOUND) window.SOUND.playPop(300);
      });
    }
  }

})();
