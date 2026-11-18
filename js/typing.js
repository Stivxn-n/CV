/* ==========================================================================
   typing.js — Efecto de escritura del rol principal
   ========================================================================== */

(() => {
  'use strict';

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (movimientoReducido.matches) return;

  const rol = document.getElementById('typing');
  if (!rol) return;

  const frases = [
    'Full Stack · Java + JavaScript',
    'Automatización e IA aplicada',
    'Flutter · MySQL · Railway'
  ];

  let indice = 0;
  let posicion = frases[0].length;
  let borrando = true;

  const paso = () => {
    const frase = frases[indice];

    if (borrando) {
      posicion -= 1;
      rol.textContent = frase.slice(0, Math.max(posicion, 0));

      if (posicion <= 0) {
        borrando = false;
        indice = (indice + 1) % frases.length;
        window.setTimeout(paso, 420);
        return;
      }

      window.setTimeout(paso, 22 + Math.random() * 18);
      return;
    }

    posicion += 1;
    rol.textContent = frase.slice(0, posicion);

    if (posicion >= frase.length) {
      borrando = true;
      window.setTimeout(paso, 2700);
      return;
    }

    window.setTimeout(paso, 48 + Math.random() * 45);
  };

  window.setTimeout(paso, 2800);
})();
