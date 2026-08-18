# Mini-Curso Interactivo: Arquitectura de LLMs y Meta Llama 3

[![Meta AI](https://img.shields.io/badge/Meta_AI-Llama_3-0866FF?style=for-the-badge&logo=meta&logoColor=white)](https://ai.meta.com/llama/)
[![HTML5 / CSS3 / Vanilla JS](https://img.shields.io/badge/Stack-Vanilla_Web-059669?style=for-the-badge)](https://developer.mozilla.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Plataforma educativa interactiva y técnica diseñada para comprender a fondo los fundamentos matemáticos, la ingeniería de tensores, la tokenización BPE, los espacios vectoriales, la auto-atención Transformer y la inferencia local cuantizada con **Meta Llama 3**.

---

## 📚 Estructura Modular del Curso

### 🔹 Módulo 1: Fundamentos & Procesamiento de Lenguaje Natural (NLP)
- **Tema 1.1:** Modelado de Lenguaje Autoregresivo & Distribución de Probabilidades con Temperatura.
- **Tema 1.2:** El Pipeline de NLP (Cadena de texto $\rightarrow$ IDs de token $\rightarrow$ Proyecciones de tensores).

### 🔹 Módulo 2: Representación de Datos (Tokens & Embeddings)
- **Tema 2.1:** Segmentación BPE (Byte-Pair Encoding), vocabulario de 128k de Llama 3 y costos de inferencia.
- **Tema 2.2:** Espacios Métricos, Geometría Semántica, Similitud Coseno y Álgebra Vectorial ($Rey - Hombre + Mujer \approx Reina$).

### 🔹 Módulo 3: Arquitectura Transformer & Multi-Head Attention
- **Tema 3.1:** Mecanismo de Auto-Atención Escalada ($Q, K, V$), resolución de correferencias y Grouped-Query Attention (GQA).
- **Tema 3.2:** Leyes de Escala (8B, 70B, 405B) y Calculadora de VRAM para cuantizaciones FP16, INT8 e INT4 (GGUF).

### 🔹 Módulo 4: Soberanía Tecnológica & Inferencia Local
- **Tema 4.1:** Modelos de Pesos Abiertos (Open Weights) vs APIs Centralizadas en la Nube.
- **Tema 4.2:** Laboratorio de Inferencia Streaming Local con telemetría en tiempo real (TTFT y Tokens/segundo).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, CSS3 Moderno (Variables CSS, Flexbox, CSS Grid, Glassmorphism).
- **Lógica & Motores Interactivos:** JavaScript Vanilla (sin dependencias externas).
- **Audio Engine:** Sintetizador nativo con Web Audio API.
- **Gráficos & Geometría:** HTML5 Canvas interactivo con soporte táctil y de ratón.
- **Diseño de Marca:** Meta AI Brand Guidelines con soporte nativo para **Modo Claro** (por defecto) y **Modo Oscuro**.

---

## 🚀 Cómo Ejecutar en Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/jjho05/Clase1_LLM_App.git
   cd Clase1_LLM_App
   ```

2. Inicia un servidor web local sencillo (por ejemplo, con Python):
   ```bash
   python3 -m http.server 8080
   ```

3. Abre tu navegador en:
   ```
   http://localhost:8080/
   ```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
