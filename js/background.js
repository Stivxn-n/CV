/* ==========================================================================
   background.js — Constelación de partículas conectadas
   ========================================================================== */

(() => {
  'use strict';

  const canvas = document.getElementById('fondo-particulas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const puntero = { x: 0, y: 0, activo: false };
  const paleta = ['34, 211, 238', '167, 139, 250', '244, 114, 182'];

  let ancho = 0;
  let alto = 0;
  let dpr = 1;
  let particulas = [];
  let raf = 0;
  let ultimo = 0;

  const LIMITE_ENLACE = 132;
  const LIMITE_CERCA = 68;
  const RADIO_PUNTERO = 140;

  /* ------------------------------------------------------------------ */

  function crearParticulas() {
    const cantidad = Math.max(26, Math.min(92, Math.round((ancho * alto) / 16000)));

    particulas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      vx: (Math.random() - 0.5) * 0.26,
      vy: (Math.random() - 0.5) * 0.26,
      radio: Math.random() * 1.4 + 0.7,
      color: paleta[Math.floor(Math.random() * paleta.length)],
      pulso: Math.random() * Math.PI * 2
    }));
  }

  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    crearParticulas();

    if (movimientoReducido.matches) dibujar();
  }

  /* ------------------------------------------------------------------ */

  function actualizar(dt) {
    const factor = Math.min(dt / 16.67, 2.5);

    for (const p of particulas) {
      p.x += p.vx * factor;
      p.y += p.vy * factor;

      if (p.x < -24) p.x = ancho + 24;
      else if (p.x > ancho + 24) p.x = -24;

      if (p.y < -24) p.y = alto + 24;
      else if (p.y > alto + 24) p.y = -24;

      if (puntero.activo) {
        const dx = p.x - puntero.x;
        const dy = p.y - puntero.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < RADIO_PUNTERO && distancia > 1) {
          const fuerza = (1 - distancia / RADIO_PUNTERO) * 0.75 * factor;
          p.x += (dx / distancia) * fuerza;
          p.y += (dy / distancia) * fuerza;
        }
      }

      p.pulso += 0.018 * factor;
    }
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);

    // Enlaces lejanos
    ctx.beginPath();
    for (let i = 0; i < particulas.length; i++) {
      const a = particulas[i];
      for (let j = i + 1; j < particulas.length; j++) {
        const b = particulas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < LIMITE_ENLACE) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(125, 180, 235, 0.11)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Enlaces cercanos
    ctx.beginPath();
    for (let i = 0; i < particulas.length; i++) {
      const a = particulas[i];
      for (let j = i + 1; j < particulas.length; j++) {
        const b = particulas[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < LIMITE_CERCA) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Conexión con el puntero
    if (puntero.activo) {
      ctx.beginPath();
      for (const p of particulas) {
        const distancia = Math.hypot(p.x - puntero.x, p.y - puntero.y);
        if (distancia < RADIO_PUNTERO + 60) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(puntero.x, puntero.y);
        }
      }
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.16)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Puntos
    for (const p of particulas) {
      const brillo = 0.45 + Math.sin(p.pulso) * 0.22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${brillo.toFixed(3)})`;
      ctx.fill();
    }
  }

  /* ------------------------------------------------------------------ */

  function bucle(t) {
    raf = requestAnimationFrame(bucle);

    if (document.hidden) return;
    if (t - ultimo < 33) return;

    const dt = ultimo === 0 ? 16.67 : t - ultimo;
    ultimo = t;

    actualizar(dt);
    dibujar();
  }

  function arrancar() {
    if (raf || movimientoReducido.matches) return;
    ultimo = 0;
    raf = requestAnimationFrame(bucle);
  }

  function parar() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  /* ------------------------------------------------------------------ */

  window.addEventListener(
    'pointermove',
    (evento) => {
      if (evento.pointerType === 'touch') return;
      puntero.x = evento.clientX;
      puntero.y = evento.clientY;
      puntero.activo = true;
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => {
    puntero.activo = false;
  });

  let redimensionando = false;
  window.addEventListener(
    'resize',
    () => {
      if (redimensionando) return;
      redimensionando = true;
      requestAnimationFrame(() => {
        redimensionando = false;
        medir();
      });
    },
    { passive: true }
  );

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar();
    else arrancar();
  });

  if (typeof movimientoReducido.addEventListener === 'function') {
    movimientoReducido.addEventListener('change', () => {
      if (movimientoReducido.matches) {
        parar();
        dibujar();
      } else {
        arrancar();
      }
    });
  }

  medir();
  arrancar();
})();
