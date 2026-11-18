/* ==========================================================================
   interactions.js — Navegación, revelado, inclinación y cursor
   ========================================================================== */

(() => {
  'use strict';

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ------------------------------------------------------------------
     Año del pie
     ------------------------------------------------------------------ */

  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Barra de progreso, navegación compacta y enlace activo
     ------------------------------------------------------------------ */

  const nav = document.getElementById('nav');
  const barra = document.getElementById('progreso-barra');
  const enlacesNav = Array.from(document.querySelectorAll('.nav__enlace'));
  const destinos = enlacesNav
    .map((enlace) => document.querySelector(enlace.getAttribute('href')))
    .filter(Boolean);

  let cuadroPendiente = false;

  const actualizarScroll = () => {
    cuadroPendiente = false;

    const desplazamiento = window.scrollY;
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;

    if (barra) {
      const porcentaje = recorrido > 0 ? (desplazamiento / recorrido) * 100 : 0;
      barra.style.width = `${Math.min(Math.max(porcentaje, 0), 100)}%`;
    }

    if (nav) nav.classList.toggle('nav--compacto', desplazamiento > 24);

    const referencia = desplazamiento + 160;
    let seccionActiva = '';

    for (const seccion of destinos) {
      const inicio = seccion.getBoundingClientRect().top + desplazamiento;
      if (inicio <= referencia) seccionActiva = seccion.id;
    }

    enlacesNav.forEach((enlace) => {
      const esActivo = enlace.getAttribute('href') === `#${seccionActiva}`;
      enlace.classList.toggle('activo', esActivo);

      if (esActivo) enlace.setAttribute('aria-current', 'true');
      else enlace.removeAttribute('aria-current');
    });

    // Si el usuario salta de sección, lo que quedó arriba se marca como visible
    document.querySelectorAll('[data-reveal]:not(.revelado)').forEach((elemento) => {
      if (elemento.getBoundingClientRect().bottom < 0) {
        elemento.classList.add('revelado');
      }
    });
  };

  const pedirScroll = () => {
    if (cuadroPendiente) return;
    cuadroPendiente = true;
    requestAnimationFrame(actualizarScroll);
  };

  window.addEventListener('scroll', pedirScroll, { passive: true });
  window.addEventListener('resize', pedirScroll, { passive: true });
  window.addEventListener('load', pedirScroll);
  actualizarScroll();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(pedirScroll).catch(() => {});
  }

  /* ------------------------------------------------------------------
     Menú móvil
     ------------------------------------------------------------------ */

  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menu-toggle');

  const cerrarMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove('abierto');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-abierto');
  };

  if (menu && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const abierto = menuToggle.getAttribute('aria-expanded') === 'true';

      if (abierto) {
        cerrarMenu();
        return;
      }

      menu.classList.add('abierto');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('menu-abierto');
    });

    menu.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') cerrarMenu();
    });

    document.addEventListener('click', (evento) => {
      if (!menu.classList.contains('abierto')) return;
      if (menu.contains(evento.target) || menuToggle.contains(evento.target)) return;
      cerrarMenu();
    });

    window.addEventListener(
      'resize',
      () => {
        if (window.innerWidth > 900) cerrarMenu();
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
     Revelado al hacer scroll
     ------------------------------------------------------------------ */

  const revelables = Array.from(document.querySelectorAll('[data-reveal]'));

  if (revelables.length) {
    if ('IntersectionObserver' in window && !movimientoReducido.matches) {
      const observador = new IntersectionObserver(
        (entradas, obs) => {
          entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            entrada.target.classList.add('revelado');
            obs.unobserve(entrada.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );

      revelables.forEach((elemento) => observador.observe(elemento));
    } else {
      revelables.forEach((elemento) => elemento.classList.add('revelado'));
    }
  }

  /* ------------------------------------------------------------------
     Inclinación 3D
     ------------------------------------------------------------------ */

  if (punteroFino.matches && !movimientoReducido.matches) {
    const inclinables = Array.from(document.querySelectorAll('[data-tilt]'));

    inclinables.forEach((elemento) => {
      elemento.addEventListener('pointermove', (evento) => {
        const caja = elemento.getBoundingClientRect();
        const x = (evento.clientX - caja.left) / caja.width;
        const y = (evento.clientY - caja.top) / caja.height;
        const giroX = (0.5 - y) * 5;
        const giroY = (x - 0.5) * 5;

        elemento.style.transform = `perspective(900px) rotateX(${giroX.toFixed(2)}deg) rotateY(${giroY.toFixed(2)}deg)`;
        elemento.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        elemento.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });

      elemento.addEventListener('pointerleave', () => {
        elemento.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     Cursor personalizado
     ------------------------------------------------------------------ */

  const cursor = document.getElementById('cursor');

  if (cursor && punteroFino.matches && !movimientoReducido.matches) {
    document.body.classList.add('cursor-activo');

    let destinoX = window.innerWidth / 2;
    let destinoY = window.innerHeight / 2;
    let actualX = destinoX;
    let actualY = destinoY;
    let animacion = 0;

    const animar = () => {
      actualX += (destinoX - actualX) * 0.2;
      actualY += (destinoY - actualY) * 0.2;

      cursor.style.setProperty('--x', `${actualX.toFixed(1)}px`);
      cursor.style.setProperty('--y', `${actualY.toFixed(1)}px`);

      if (Math.abs(destinoX - actualX) < 0.2 && Math.abs(destinoY - actualY) < 0.2) {
        animacion = 0;
        return;
      }

      animacion = requestAnimationFrame(animar);
    };

    document.addEventListener(
      'pointermove',
      (evento) => {
        destinoX = evento.clientX;
        destinoY = evento.clientY;

        if (!animacion) animacion = requestAnimationFrame(animar);
      },
      { passive: true }
    );

    const interactivos = document.querySelectorAll('a, button, [data-tilt]');

    interactivos.forEach((elemento) => {
      elemento.addEventListener('pointerenter', () => {
        document.body.classList.add('cursor-enlace');
      });

      elemento.addEventListener('pointerleave', () => {
        document.body.classList.remove('cursor-enlace');
      });
    });
  }

  /* ------------------------------------------------------------------
     Foto de perfil: si assets/foto.jpg falta, usa el avatar de respaldo
     ------------------------------------------------------------------ */

  const foto = document.getElementById('foto-perfil');

  if (foto) {
    foto.addEventListener(
      'error',
      () => {
        const respaldo = foto.dataset.fallback;
        if (!respaldo || foto.getAttribute('src') === respaldo) return;
        foto.src = respaldo;
      },
      { once: true }
    );
  }
})();
