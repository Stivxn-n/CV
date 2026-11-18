/* ==========================================================================
   matrix.js — Lluvia de código opcional (modo matrix)
   ========================================================================== */

(() => {
  'use strict';

  const canvas = document.getElementById('matrix');
  const botones = [
    document.getElementById('matrix-toggle'),
    document.getElementById('matrix-toggle-pie')
  ].filter(Boolean);

  if (!canvas || !botones.length) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const CARACTERES = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]/*+=$#';
  const COLORES = [
    'rgba(34, 211, 238, 0.85)',
    'rgba(167, 139, 250, 0.8)',
    'rgba(52, 211, 153, 0.7)'
  ];

  let activo = false;
  let raf = 0;
  let ultimo = 0;
  let ancho = 0;
  let alto = 0;
  let fuente = 16;
  let columnas = 0;
  let gotas = [];

  /* ------------------------------------------------------------------ */

  function medir() {
    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = ancho;
    canvas.height = alto;

    fuente = ancho < 640 ? 13 : 16;
    columnas = Math.ceil(ancho / fuente);
    gotas = Array.from({ length: columnas }, () => Math.random() * -40);

    ctx.font = `${fuente}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
  }

  function actualizarBotones() {
    botones.forEach((boton) => {
      boton.setAttribute('aria-pressed', String(activo));
      boton.setAttribute(
        'aria-label',
        activo ? 'Desactivar modo matrix' : 'Activar modo matrix'
      );
      boton.title = activo ? 'Desactivar modo matrix' : 'Activar modo matrix';
    });
  }

  function dibujar() {
    ctx.fillStyle = 'rgba(5, 6, 11, 0.09)';
    ctx.fillRect(0, 0, ancho, alto);

    for (let i = 0; i < columnas; i += 1) {
      const x = i * fuente;
      const y = gotas[i] * fuente;

      if (y > -fuente && y < alto) {
        const caracter = CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
        ctx.fillStyle =
          Math.random() > 0.985 ? 'rgba(240, 253, 255, 0.95)' : COLORES[i % COLORES.length];
        ctx.fillText(caracter, x, y);
      }

      gotas[i] += 0.62 + (i % 5) * 0.07;

      if (y > alto + 160 && Math.random() > 0.972) {
        gotas[i] = Math.random() * -24;
      }
    }
  }

  function bucle(t) {
    if (!activo) return;
    raf = requestAnimationFrame(bucle);

    if (t - ultimo < 33) return;
    ultimo = t;
    dibujar();
  }

  function iniciar() {
    activo = true;
    document.body.classList.add('matrix-activo');
    actualizarBotones();
    medir();
    ctx.clearRect(0, 0, ancho, alto);
    ultimo = 0;
    raf = requestAnimationFrame(bucle);
  }

  function detener() {
    activo = false;
    cancelAnimationFrame(raf);
    raf = 0;
    document.body.classList.remove('matrix-activo');
    actualizarBotones();
    ctx.clearRect(0, 0, ancho, alto);
  }

  function alternar() {
    if (activo) detener();
    else iniciar();
  }

  /* ------------------------------------------------------------------ */

  botones.forEach((boton) => boton.addEventListener('click', alternar));

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && activo) detener();
  });

  window.addEventListener(
    'resize',
    () => {
      if (activo) medir();
    },
    { passive: true }
  );

  actualizarBotones();
})();
