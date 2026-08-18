/**
 * Meta AI - Core Shared Application Engine
 * Includes: KaTeX auto-render, Interactive Particle Canvas, Web Audio API Synthesizer,
 * Dark/Light Theme Switcher with SVG vectors, Progress Bar, and Copy Code helper.
 */

(function(){
 "use strict";

 /* 0. RENDERIZADOR KATEX AUTOMÁTICO */
 function renderLatex(){
 if(typeof renderMathInElement !== "undefined"){
 renderMathInElement(document.body, {
 delimiters: [
 {left: '$$', right: '$$', display: true},
 {left: '$', right: '$', display: false},
 {left: '\\[', right: '\\]', display: true},
 {left: '\\(', right: '\\)', display: false}
 ],
 throwOnError: false
 });
 } else {
 setTimeout(renderLatex, 150);
 }
 }
 document.addEventListener("DOMContentLoaded", renderLatex);
 setTimeout(renderLatex, 300);

 /* 1. CANVAS DE PARTÍCULAS */
 (function initCanvas(){
 var canvas = document.getElementById("bg-canvas");
 if(!canvas) return;
 var ctx = canvas.getContext("2d");
 var w, h;
 var pts = [];

 function resize(){
 w = canvas.width = window.innerWidth;
 h = canvas.height = window.innerHeight;
 pts = [];
 var count = Math.min(45, Math.floor((w * h) / 35000));
 for(var i = 0; i < count; i++){
 pts.push({
 x: Math.random() * w,
 y: Math.random() * h,
 vx: (Math.random() - 0.5) * 0.35,
 vy: (Math.random() - 0.5) * 0.35,
 r: Math.random() * 1.8 + 1
 });
 }
 }
 window.addEventListener("resize", resize);
 resize();

 function loop(){
 ctx.clearRect(0, 0, w, h);
 var isDark = document.documentElement.getAttribute("data-theme") === "dark";
 
 // Partículas
 ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(8, 102, 255, 0.2)";
 for(var i = 0; i < pts.length; i++){
 var p = pts[i];
 p.x += p.vx; p.y += p.vy;
 if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
 if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
 ctx.beginPath();
 ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
 ctx.fill();

 // Conexiones de red neuronal en modo oscuro
 if(isDark){
 for(var j = i + 1; j < pts.length; j++){
 var p2 = pts[j];
 var dx = p.x - p2.x;
 var dy = p.y - p2.y;
 var dist = Math.sqrt(dx*dx + dy*dy);
 if(dist < 125){
 ctx.beginPath();
 ctx.strokeStyle = "rgba(59, 130, 246, " + (0.15 * (1 - dist / 125)) + ")";
 ctx.lineWidth = 0.75;
 ctx.moveTo(p.x, p.y);
 ctx.lineTo(p2.x, p2.y);
 ctx.stroke();
 }
 }
 }
 }
 requestAnimationFrame(loop);
 }
 loop();
 })();

 /* 2. SELECTOR DE TEMA CON ICONOS SVG VECTORIALES */
 var themeBtn = document.getElementById("theme-btn");
 var themeIconContainer = document.getElementById("theme-icon-container");
 var themeLabel = document.getElementById("theme-label");

 var sunSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 000-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 000-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
 var moonSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.4-11.4A10 10 0 0 0 12.3 2zm-1 17.8A8 8 0 0 1 9.5 4a8.2 8.2 0 0 0 8.7 8.7 8 8 0 0 1-6.9 7.1z"/></svg>';

 var savedTheme = localStorage.getItem("meta_theme") || "light";
 document.documentElement.setAttribute("data-theme", savedTheme);
 updateThemeState(savedTheme);

 if(themeBtn){
 themeBtn.addEventListener("click", function(){
 var curr = document.documentElement.getAttribute("data-theme");
 var next = curr === "light" ? "dark" : "light";
 document.documentElement.setAttribute("data-theme", next);
 localStorage.setItem("meta_theme", next);
 updateThemeState(next);
 });
 }

 function updateThemeState(t){
 if(themeIconContainer) themeIconContainer.innerHTML = t === "light" ? sunSvg : moonSvg;
 if(themeLabel) themeLabel.textContent = t === "light" ? "Modo Claro" : "Modo Oscuro";
 }

 /* 3. SINTETIZADOR DE AUDIO */
 window.SOUND = (function(){
 var ctx = null;
 var muted = false;
 function init(){ if(!ctx && typeof AudioContext !== "undefined"){ ctx = new (window.AudioContext || window.webkitAudioContext)(); } }
 return {
 toggle: function(){ muted = !muted; return muted; },
 playPop: function(f){
 if(muted) return;
 init();
 if(!ctx) return;
 try {
 var osc = ctx.createOscillator(), g = ctx.createGain();
 osc.type = "sine";
 osc.frequency.setValueAtTime(f || 440, ctx.currentTime);
 g.gain.setValueAtTime(0.08, ctx.currentTime);
 g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
 osc.connect(g); g.connect(ctx.destination);
 osc.start(); osc.stop(ctx.currentTime + 0.06);
 } catch(e){}
 },
 playChime: function(){
 if(muted) return;
 init();
 if(!ctx) return;
 try {
 var osc = ctx.createOscillator(), g = ctx.createGain();
 osc.type = "triangle";
 osc.frequency.setValueAtTime(587.33, ctx.currentTime);
 g.gain.setValueAtTime(0.06, ctx.currentTime);
 g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
 osc.connect(g); g.connect(ctx.destination);
 osc.start(); osc.stop(ctx.currentTime + 0.2);
 } catch(e){}
 }
 };
 })();

 var soundBtn = document.getElementById("sound-btn");
 var soundIconContainer = document.getElementById("sound-icon-container");
 var soundLabel = document.getElementById("sound-label");

 if(soundBtn){
 soundBtn.addEventListener("click", function(){
 var isMuted = window.SOUND.toggle();
 if(soundLabel) soundLabel.textContent = isMuted ? "Audio OFF" : "Audio ON";
 });
 }

 /* 4. BARRA DE PROGRESO DE SCROLL */
 var progressBar = document.getElementById("progress-bar");
 window.addEventListener("scroll", function(){
 var h = document.documentElement;
 var max = h.scrollHeight - h.clientHeight;
 var pct = max > 0 ? (h.scrollTop / max * 100) : 0;
 if(progressBar) progressBar.style.width = pct + "%";
 }, { passive: true });

 /* 5. MOTOR DE ENTRADA SUAVE POR SCROLL (SCROLL REVEAL) */
 function initScrollReveal(){
 var targets = document.querySelectorAll(
 ".course-hero, .tema-card, .workbench-section, .quiz-box, .stat-card-clean, .example-card, .step-flow-item, .formula-card, .arch-detail-panel, .module-card, .easy-explainer-box, .conclusion-box, .code-box"
 );

 if(!("IntersectionObserver" in window)){
 targets.forEach(function(el){ el.classList.add("reveal-visible"); });
 return;
 }

 var observer = new IntersectionObserver(function(entries){
 entries.forEach(function(entry){
 if(entry.isIntersecting){
 entry.target.classList.add("reveal-visible");
 observer.unobserve(entry.target);
 }
 });
 }, {
 threshold: 0.08,
 rootMargin: "0px 0px -40px 0px"
 });

 targets.forEach(function(el){
 el.classList.add("reveal-init");
 observer.observe(el);
 });
 }

 if(document.readyState === "loading"){
 document.addEventListener("DOMContentLoaded", initScrollReveal);
 } else {
 initScrollReveal();
 }

 /* 6. MOTOR DE CELEBRACIÓN DE CONFETI */
 window.celebrateConfetti = function(){
 if(window.SOUND) window.SOUND.playChime();
 var canvas = document.createElement("canvas");
 canvas.style.position = "fixed";
 canvas.style.top = "0";
 canvas.style.left = "0";
 canvas.style.width = "100vw";
 canvas.style.height = "100vh";
 canvas.style.zIndex = "99999";
 canvas.style.pointerEvents = "none";
 document.body.appendChild(canvas);

 var ctx = canvas.getContext("2d");
 var w = canvas.width = window.innerWidth;
 var h = canvas.height = window.innerHeight;

 var colors = ["#0866ff", "#00c3ff", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
 var pieces = [];
 for(var i = 0; i < 90; i++){
 pieces.push({
 x: w / 2 + (Math.random() - 0.5) * 200,
 y: h / 2 - 100,
 vx: (Math.random() - 0.5) * 14,
 vy: (Math.random() - 0.8) * 14,
 size: Math.random() * 8 + 4,
 color: colors[Math.floor(Math.random() * colors.length)],
 rotation: Math.random() * 360,
 rotationSpeed: (Math.random() - 0.5) * 10,
 opacity: 1
 });
 }

 var startTime = Date.now();
 function animate(){
 var elapsed = Date.now() - startTime;
 ctx.clearRect(0, 0, w, h);

 pieces.forEach(function(p){
 p.x += p.vx;
 p.y += p.vy;
 p.vy += 0.35; // Gravedad
 p.rotation += p.rotationSpeed;
 p.opacity = Math.max(0, 1 - elapsed / 2600);

 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.rotate((p.rotation * Math.PI) / 180);
 ctx.globalAlpha = p.opacity;
 ctx.fillStyle = p.color;
 ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
 ctx.restore();
 });

 if(elapsed < 2600){
 requestAnimationFrame(animate);
 } else {
 if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
 }
 }
 requestAnimationFrame(animate);
 };

 /* 7. CONTROLADOR DE ACORDEÓN SUAVE PARA <details> */
 function initSmoothAccordions(){
 var accordions = document.querySelectorAll(".formula-breakdown-details, .faq-item");
 accordions.forEach(function(details){
 var summary = details.querySelector("summary");
 if(!summary) return;

 var isAnimating = false;

 summary.addEventListener("click", function(e){
 e.preventDefault();
 if(isAnimating) return;

 var content = summary.nextElementSibling;
 if(!content) return;

 if(window.SOUND) window.SOUND.playPop(details.hasAttribute("open") ? 340 : 420);

 if(details.hasAttribute("open")){
 // CERRAR SUAVEMENTE
 isAnimating = true;
 var startHeight = content.offsetHeight;
 content.style.overflow = "hidden";

 var closingAnim = content.animate([
 { height: startHeight + "px", opacity: 1, transform: "translateY(0)" },
 { height: "0px", opacity: 0, transform: "translateY(-6px)" }
 ], {
 duration: 240,
 easing: "cubic-bezier(0.16, 1, 0.3, 1)"
 });

 closingAnim.onfinish = function(){
 details.removeAttribute("open");
 content.style.overflow = "";
 content.style.height = "";
 content.style.opacity = "";
 content.style.transform = "";
 isAnimating = false;
 };
 } else {
 // ABRIR SUAVEMENTE
 isAnimating = true;
 details.setAttribute("open", "");
 content.style.overflow = "hidden";
 var targetHeight = content.scrollHeight;

 var openingAnim = content.animate([
 { height: "0px", opacity: 0, transform: "translateY(-6px)" },
 { height: targetHeight + "px", opacity: 1, transform: "translateY(0)" }
 ], {
 duration: 270,
 easing: "cubic-bezier(0.16, 1, 0.3, 1)"
 });

 openingAnim.onfinish = function(){
 content.style.overflow = "";
 content.style.height = "";
 content.style.opacity = "";
 content.style.transform = "";
 isAnimating = false;
 };
 }
 });
 });
 }

 /* 7. MOTOR DE TRANSICIONES ENTRE PÁGINAS */
 function initPageTransitions(){
 document.addEventListener("click", function(e){
 var link = e.target.closest("a");
 if(!link) return;
 var href = link.getAttribute("href");
 if(!href) return;
 
 // Ignorar saltos dentro de la misma página (anclas con #)
 if(href.startsWith("#")) return;
 
 // Ignorar enlaces externos o especiales
 if(href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
 if(link.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey) return;
 
 // Transición fluida para navegación a páginas internas HTML
 if(href.endsWith(".html") || href.includes(".html#") || href === "index.html" || href === "/"){
 e.preventDefault();
 if(window.SOUND) window.SOUND.playPop(460);
 var main = document.querySelector(".main-container");
 if(main) main.classList.add("page-is-exiting");
 setTimeout(function(){
 window.location.href = href;
 }, 160);
 }
 });

 window.addEventListener("pageshow", function(){
 var main = document.querySelector(".main-container");
 if(main) main.classList.remove("page-is-exiting");
 });
 }

 /* 8. GESTOR DE MENÚ HAMBURGUESA MÓVIL Y DRAWER FLUIDO */
 function initMobileDrawer(){
 var toggleBtn = document.getElementById("menu-toggle-btn");
 var drawer = document.getElementById("mobile-drawer");
 var backdrop = document.getElementById("mobile-backdrop");
 var closeBtn = document.getElementById("mobile-drawer-close");
 var drawerNav = document.getElementById("mobile-drawer-nav");
 var headerNav = document.querySelector(".nav-links");

 if(!toggleBtn || !drawer) return;

 // Si el contenedor del drawer está vacío, clonar dinámicamente los enlaces del header
 if(drawerNav && headerNav && drawerNav.children.length === 0){
 var links = headerNav.querySelectorAll(".nav-link-item");
 links.forEach(function(link){
 var a = document.createElement("a");
 a.className = "mobile-drawer-link";
 a.href = link.getAttribute("href");
 if(link.classList.contains("active")) a.classList.add("active");
 a.innerHTML = "<span>" + link.textContent + "</span><span class='link-badge'>&rarr;</span>";
 a.addEventListener("click", function(){
 closeDrawer();
 });
 drawerNav.appendChild(a);
 });
 }

 function openDrawer(){
 if(window.SOUND) window.SOUND.playPop(480);
 drawer.classList.add("is-open");
 if(backdrop) backdrop.classList.add("is-open");
 document.body.style.overflow = "hidden";
 toggleBtn.setAttribute("aria-expanded", "true");
 }

 function closeDrawer(){
 if(window.SOUND) window.SOUND.playPop(320);
 drawer.classList.remove("is-open");
 if(backdrop) backdrop.classList.remove("is-open");
 document.body.style.overflow = "";
 toggleBtn.setAttribute("aria-expanded", "false");
 }

 toggleBtn.addEventListener("click", function(){
 if(drawer.classList.contains("is-open")){
 closeDrawer();
 } else {
 openDrawer();
 }
 });

 if(closeBtn) closeBtn.addEventListener("click", closeDrawer);
 if(backdrop) backdrop.addEventListener("click", closeDrawer);

 window.addEventListener("keydown", function(e){
 if(e.key === "Escape" && drawer.classList.contains("is-open")){
 closeDrawer();
 }
 });
 }

 if(document.readyState === "loading"){
 document.addEventListener("DOMContentLoaded", function(){
 initSmoothAccordions();
 initPageTransitions();
 initMobileDrawer();
 });
 } else {
 initSmoothAccordions();
 initPageTransitions();
 initMobileDrawer();
 }

})();

/* 7. FUNCIÓN GLOBAL DE COPIAR CÓDIGO */
function copyCode(btn){
 var codeBlock = btn.parentElement.nextElementSibling ? btn.parentElement.nextElementSibling.querySelector("code") : null;
 if(!codeBlock) {
 codeBlock = btn.closest(".code-box").querySelector(".code-content");
 }
 if(!codeBlock) return;
 var text = codeBlock.innerText;
 navigator.clipboard.writeText(text).then(function(){
 if(window.SOUND) window.SOUND.playPop(580);
 var oldText = btn.textContent;
 btn.textContent = "¡Copiado!";
 btn.style.background = "#059669";
 btn.style.color = "#ffffff";
 setTimeout(function(){
 btn.textContent = oldText;
 btn.style.background = "";
 btn.style.color = "";
 }, 2000);
 });
}
