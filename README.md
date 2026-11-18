# Hoja de Vida — Eison Stiven Ramírez Vásquez

Portafolio y hoja de vida web de una sola página, con tema oscuro tipo terminal,
fondo animado de partículas, efectos de escritura y un modo matrix opcional.

**Perfil:** Desarrollador de Software Junior · Full Stack e IA
**Ubicación:** Bogotá, Colombia

## Ver el sitio

Abre `index.html` directamente en el navegador o sirve la carpeta con un servidor local:

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node
npx serve .
```

Luego visita `http://localhost:8080`.

## Cambiar la foto

La página usa tu retrato en `assets/foto.jpg`.

1. Guarda la foto con el nombre `assets/foto.jpg` (idealmente 800 × 800 px o más).
2. Recarga la página. No hay que tocar el código.

El marco es circular, así que la imagen se recorta en cuadrado. El encuadre vertical
se ajusta con `object-position` en `css/components.css` (por defecto `50% 10%`):
sube el segundo valor para bajar la cara y bájalo para subirla.

Si la imagen falta o no carga, el sitio usa automáticamente `assets/avatar.svg`
como respaldo. Para usar otro nombre o formato, cambia el `src` y el `data-fallback`
de la etiqueta `<img id="foto-perfil">` en `index.html`.

## Imprimir o guardar en PDF

El sitio no tiene botón de descarga: la hoja de vida se ve y se comparte desde la
página. Si necesitas una versión en papel o PDF, usa `Ctrl + P` (o `Cmd + P` en
macOS) y elige *Guardar como PDF*. La hoja de estilos `css/print.css` adapta el
diseño a papel (oculta animaciones, menú y fondos, y reordena el contenido).

## Estructura

```text
Hoja_de_Vida/
├─ index.html            Contenido y estructura de la página
├─ css/
│  ├─ base.css           Reset, variables y tipografía
│  ├─ layout.css         Portada, secciones, navegación y pie
│  ├─ components.css     Tarjetas, botones, avatar, chips, etc.
│  ├─ animations.css     Keyframes, scroll reveal y efectos
│  ├─ responsive.css     Adaptación a tablet y móvil
│  └─ print.css          Versión imprimible / PDF
├─ js/
│  ├─ background.js      Canvas de partículas conectadas
│  ├─ typing.js          Rol rotativo del héroe
│  ├─ matrix.js          Lluvia de código opcional
│  └─ interactions.js    Navegación, reveal, tilt, cursor y progreso
└─ assets/
   ├─ foto.jpg           Foto de perfil
   ├─ avatar.svg         Respaldo si la foto no carga
   └─ favicon.svg        Icono del sitio
```

## Detalles técnicos

- HTML, CSS y JavaScript sin dependencias ni proceso de compilación.
- Accesibilidad: enlaces de salto, foco visible, etiquetas ARIA y contraste cuidado.
- Respeta `prefers-reduced-motion`: desactiva animaciones y deja el contenido visible.
- El sitio funciona sin JavaScript; las animaciones son una mejora progresiva.

## Historial

El repositorio se publica con dos commits:

1. **CV** — sitio completo: contenido, estilos, animaciones e interacciones.
2. **avatar** — foto de perfil usada en la portada.

---

Hecho con dedicación. Si algo se puede mejorar, se mejora.
