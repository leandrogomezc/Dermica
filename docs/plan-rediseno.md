# Plan de rediseño de dermica.lat

Dirección de marca: Clínica y científica, manual versión 1.0 (noviembre 2026). Este documento es solo el plan. El copy vigente y el comportamiento de la lista de espera quedan como están. La fase 0 (favicon) ya está aplicada en este mismo cambio; el resto no se implementa acá.

El tamaño de cada fase describe alcance técnico (archivos, riesgo), no un plazo.

## Alcance y límites

Dérmica es una plataforma profesional y distribuidora de productos de dermatología y medicina estética para médicos en Nicaragua. El sitio habla de igual a igual, con voseo, en tipo oración, y sin lenguaje de consumo masivo.

Respetá estas reglas en cualquier fase:

- El territorio visible es Nicaragua. No aparece una ciudad, ni Managua ni otra.
- La apertura se dice «marzo de 2027». No publiques un día.
- El cupo es de 30 médicos fundadores. El beneficio es acceso anticipado y precio de apertura. El monto no se publica.
- No agregues prueba social, contadores de personas, testimonios ni enlaces a redes.
- No inventes razón social, RUC, dirección, teléfono, sedes, envíos ni precios. El único correo sigue siendo gerencia@dermica.lat.
- Los ejemplos del manual («Sumate a la lista de espera», «Ciencia para tu práctica», «Unirme a la lista de espera») ilustran el tono. No reemplazan el copy del sitio. Los rótulos actuales («Avisame cuando abran», «Enterate primero», las preguntas frecuentes, la privacidad) se mantienen letra por letra.
- El formulario conserva campos, validación, casillas desmarcadas, honeypot, enlace de retiro, mensajes y endpoints.
- Los nombres, teléfonos y cargos de la papelería del manual son datos de ejemplo. No los pases al sitio.
- No redibujes el logo ni el favicon. Usá los archivos originales.

## Inventario del estado actual

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, `next/font`, Motion en el hero. El idioma del documento es `es-NI`. La URL canónica es `https://dermica.lat`.

### Tokens y tipografía vigentes

Están en `src/app/globals.css` y `src/app/layout.tsx`.

| Token | Valor | Uso |
| --- | --- | --- |
| cream | `#fbf7f4` | Fondo de página y header |
| cream-200 | `#f4ece6` | Bandas, chips, estados |
| plum | `#4a2c3a` | Títulos, botones, enlaces |
| plum-700 | `#3a2230` | Hover y error |
| plum-900 | `#2a1922` | Footer y bloque oscuro |
| blush | `#d9a7a0` | Acentos, hover de tarjetas, barrido del hero |
| blush-300 | `#e7c4bf` | Degradados |
| gold | `#7a5b12` | Etiquetas (eyebrow) y checks |
| ink | `#2a2127` | Texto |
| muted | `#6b6168` | Texto secundario |
| line | `#ece2da` | Bordes |

Títulos en Playfair Display (`font-display`). Cuerpo en Inter. Las etiquetas van en mayúsculas sostenidas con tracking ancho (`uppercase tracking-[0.22em] text-gold`), aunque el string de origen ya está en tipo oración. Los botones son píldora (`rounded-full`).

Esa paleta es cálida, de spa. La dirección nueva es fría, clínica y con mucho blanco. Playfair no está en el manual.

### Archivos de marca que ya existen en el repo

El set de favicon de este cambio, sin redibujar:

- `src/app/favicon.ico` (Next lo enlaza como `rel="icon"` y también responde en `/favicon.ico`; el archivo trae 16, 32 y 48 px)
- `public/favicon.svg`
- `public/favicon-16.png` (16×16)
- `public/favicon-32.png` (32×32)
- `public/favicon-48.png` (48×48)
- `public/apple-touch-icon-180.png` (180×180)
- `public/app-icon-192.png` (192×192)
- `public/app-icon-512.png` (512×512)

El SVG es el isotipo simplificado de dos capas (blanco y celeste dérmico) sobre un cuadrado azul clínico con esquinas redondeadas. Coincide con la regla de tamaños chicos: debajo de 24 px, dos capas y sin células. No hay `manifest.json` ni `manifest.ts`. Por eso estos archivos se enlazan en el `<head>` y no hay iconos de manifest que actualizar.

`public/og.png` mide 1200×630 y es la pieza social de la paleta anterior. `public/hero-rostro.webp` es el retrato del hero.

En `public/` también están `file.svg`, `globe.svg`, `next.svg`, `vercel.svg` y `window.svg`. No los usa ninguna página. Son restos del arranque de Next, no iconos de marca.

No están en el repositorio los archivos de `/logos` (horizontal, vertical, isotipo completo, reverso, monocromo, blanco) ni el patrón de capas como SVG aparte. El manual prohíbe reconstruirlos.

### Páginas y secciones

El layout raíz (`src/app/layout.tsx`) envuelve todo: salto al contenido, JSON-LD, métricas anónimas, header sticky, `<main id="contenido">` y footer. El fondo es cream.

**Inicio (`src/app/page.tsx`).**

1. `HeroScan`. Titular partido en palabras («Insumos de medicina estética para médicos de Nicaragua»), badge «Para profesionales médicos», párrafo del cupo, dos botones y la aclaración de que todavía no se vende ni se atiende. A la derecha, el retrato con barrido blush y tres recuadros que enlazan a las categorías (ocultos debajo de `sm`). Tres datos: 3 categorías, 30 cupos, 2027. Halos blush y gold de fondo. Animación con Motion y respeto a `prefers-reduced-motion`.
2. Franja de tres propuestas: consulta, tres categorías, enterate primero.
3. Grilla de `CategoryCard`.
4. Banda «Si trabajás estética en tu consulta».
5. `WaitlistSection`.
6. `CtaBanner`.

**Categorías (`/catalogo`).** Encabezado, filtros por categoría (`CatalogFilters`, sticky en desktop) y `OfferingCard`. Estado vacío con el mismo llamado a la lista.

**Ficha (`/catalogo/[slug]`).** Tres fichas estáticas: ácido hialurónico, polirrevitalización, dermocosmética. Miga de pan, placeholder de color, puntos, guía en `src/lib/category-guides.ts`, bloque «Qué no promete esta ficha» y categorías relacionadas. JSON-LD de breadcrumb.

**Quiénes somos.** Encabezado, tres hechos, tres valores y el banner final.

**Apertura.** Encabezado, dos columnas («Lo que te llevás» / «Lo que todavía no está definido») y cierre hacia la lista.

**Contacto.** Texto con el correo y, debajo, la misma `WaitlistSection`.

**Preguntas frecuentes.** Nueve preguntas de `src/lib/faq.ts` y JSON-LD `FAQPage`.

**Privacidad.** Texto legal ya escrito. Declara que no hay razón social, dirección ni RUC.

**Retirar novedades (`/retirar-marketing`).** `noindex`. Botón que llama a `POST /api/lista-espera/retirar` con el token de la URL. No borra el aviso de apertura.

**404.** Título, vuelta al inicio y el mismo llamado.

**Redirecciones.** `/envios` → `/apertura`. `/producto/:slug` → `/catalogo`.

**APIs, sin UI de marca.** `POST/GET /api/lista-espera`, `POST /api/lista-espera/retirar`, `POST /api/medicion`. Los conteos no se muestran en ninguna página.

**SEO ya publicado.** `sitemap.ts`, `robots.ts` (bloquea `/api/` y `/retirar-marketing`), `public/llms.txt` más rewrite a `/.well-known/llms.txt`, metadatos por página en `src/lib/page-metadata.ts`, verificación opcional de Google y Bing. El sitemap no incluye retirar-marketing.

### Componentes

| Componente | Rol |
| --- | --- |
| `site-header.tsx` | Wordmark en Playfair, «Nicaragua», nav de `src/lib/site.ts`, botón a `#lista-espera`, menú móvil |
| `site-footer.tsx` | Cuatro columnas sobre plum-900: marca, navegación, categorías, apertura. Correo de privacidad |
| `ui.tsx` | `Container` (max-w-6xl), `Eyebrow`, `SectionHeading`, `ButtonLink` (primary, outline, ghost) |
| `hero-scan.tsx` | Hero con Motion |
| `category-card.tsx` | Tarjeta de categoría en el inicio |
| `product-card.tsx` | `ProductPlaceholder` y `OfferingCard`. Tonos plum, blush, gold, ink |
| `catalog-filters.tsx` | Filtro por query `categoria` |
| `waitlist-section.tsx` / `waitlist-form.tsx` | Lista. Correo y consentimiento obligatorios. Nombre, especialidad, ciudad y teléfono opcionales. Casilla de marketing aparte |
| `withdraw-marketing.tsx` | Retiro del consentimiento de novedades |
| `cta-banner.tsx` | Cierre plum con halos |
| `icons.tsx` | Trazo 1.6, esquinas redondas. Incluye WhatsApp, Instagram, Facebook, TikTok, estrella, pin, teléfono, reloj y camión, que ninguna página importa |
| `json-ld.tsx` | `Organization` y `WebSite`. Sin logo, sin dirección, sin `sameAs` |
| `site-metrics.tsx` | `page_view`, `cta_click` y, desde el form, `form_start`. Sin datos personales |
| `product-spotlight.tsx` | No lo importa ninguna página |

`Category.tone` en `src/lib/data.ts` solo elige el degradado del placeholder. El copy de las categorías vive en ese archivo y en `category-guides.ts`.

## Qué cambia en cada sección

El cambio es de sistema visual. El texto, el orden de la información y los destinos de los enlaces siguen.

### Header

Reemplazá el wordmark de texto por el logo horizontal oficial (wordmark a la izquierda, símbolo a la derecha), ancho mínimo 120 px en pantalla. Área de protección: 1x en los cuatro lados, donde x es la altura de la D mayúscula del archivo. Nada de nav, borde ni botón entra en esa zona. En viewports donde el horizontal no quepa junto al botón de menú sin bajar de 120 px, dejá el logo y pasá el llamado al menú (eso ya ocurre debajo de `lg`).

No armes el logo con el isotipo del favicon más la palabra «Dérmica» en Figtree. El manual lo marca como uso incorrecto: el wordmark es un dibujo vectorial basado en Figtree SemiBold ajustado, no texto vivo. Si el SVG horizontal todavía no está en el repo, esta pieza no se publica.

El fondo del header pasa a blanco (`#FFFFFF`) con divisoria en gris frío. El ítem activo y el texto usan azul clínico. «Nicaragua» puede quedar como texto de apoyo en Inter, separado del logo por fuera del área de protección, nunca dentro del archivo del logo.

El botón sigue diciendo «Avisame cuando abran» y sigue haciendo scroll al formulario, con el mismo foco en `#waitlist-email`.

### Hero

Aplicá la pieza digital del manual: titular en Figtree, llamado a la lista y el isotipo sobre el patrón de capas.

- El `<h1>` mantiene las mismas palabras. Pasa a Figtree SemiBold, azul clínico, tracking cercano a −2 %.
- Los dos botones y la aclaración («Todavía no vendemos ni atendemos pacientes…») quedan.
- Los tres datos (3, 30, 2027) quedan. Son hechos del prelanzamiento, no un contador de usuarios. No los conectes a `/api/medicion`.
- Retirá los halos blush y gold y el barrido del retrato. Esa imagen y el recuadro tipo escáner se leen como diagnóstico o tratamiento, y el tono cálido cae en el «no» de fotografía del manual.
- En su lugar, el patrón de capas: celeste dérmico sobre celeste claro, o celeste al 20–30 % sobre azul clínico. Sin texto largo encima del patrón y sin competir con el logo.
- El isotipo de esa franja sale del archivo oficial, no de un redibujo. El favicon SVG sirve como referencia de las dos capas, no como sustituto del isotipo completo cuando el espacio supera 32 px.
- Los tres enlaces a categorías que hoy flotan sobre la cara pasan a una lista de texto bajo el patrón, visible también en móvil (hoy los recuadros están en `hidden` hasta `sm`). Mismo destino, mismo rótulo.
- La animación palabra por palabra con blur se simplifica a una aparición corta. `prefers-reduced-motion` la apaga, como ahora.

No uses fotos de personas, productos ni manos. El manual exige consentimiento escrito y aclara que sus recuadros son referencias de encuadre, no fotografías para publicar.

### Franja de propuestas, grilla de categorías y banda de audiencia

Fondo blanco o celeste claro, en bloques amplios. El icono de cada propuesta es lineal, trazo 2 px a 48 px, azul clínico, sin relleno ni degradado. El chip del icono puede ser celeste claro; el pictograma, azul.

Las tarjetas (`CategoryCard`) pierden el hover blush y la sombra plum. Borde en gris frío, fondo blanco, título en Figtree, cuerpo en Inter azul clínico. La flecha y «Ver esta categoría» se mantienen.

La banda «Para quién es Dérmica» deja el dorado. La etiqueta va en tipo oración e Inter SemiBold, color azul. El título sigue en Figtree.

### Lista de espera

Misma grilla: promesa a la izquierda, formulario a la derecha. En móvil, una columna, el formulario debajo del texto.

Cambios visuales únicamente:

- Tarjeta blanca, borde de campo en azul clínico (el gris frío contra blanco queda en 1,47:1 y no alcanza para un control).
- Foco visible: anillo azul clínico.
- Error y éxito en azul sobre blanco o blanco sobre azul. No agregues un rojo fuera de la paleta.
- Casillas con `accent-color: #1E3A5F`. Siguen desmarcadas.
- El botón de envío conserva el texto «Avisame cuando abran» / «Guardando…».

No toques `validateWaitlist`, el cuerpo del `POST`, el honeypot, `startedAt`, el enlace `withdrawPath` ni la nota de almacenamiento.

### Banner de cierre

Fondo azul clínico plano, texto blanco. Sin círculos blush ni gold. Botón principal blanco con texto azul; el secundario, borde blanco y texto blanco, con hover blanco / texto azul. Mismos rótulos y mismos `href`.

### Catálogo y ficha

El encabezado de página usa el mismo patrón que apertura y contacto: etiqueta en tipo oración, `<h1>` Figtree, bajada Inter.

Los placeholders de categoría dejan los degradados plum / blush / gold. Tres fondos planos de la paleta, con el nombre en el color de texto aprobado:

- Ácido hialurónico: fondo azul clínico, nombre en blanco.
- Polirrevitalización: fondo celeste claro, nombre en azul clínico.
- Dermocosmética: fondo gris frío, nombre en azul clínico.

El badge «En preparación» queda, en celeste claro con texto azul, o blanco con texto azul si el fondo ya es claro. El filtro activo pasa de plum a azul con texto blanco. El estado vacío conserva su texto y su botón.

En la ficha, la miga, los puntos, la guía y «Qué no promete esta ficha» solo cambian de color y de familia. El hover de las relacionadas deja de ser blush.

`tone` puede seguir existiendo como variante visual. El mapeo de clases se actualiza en `product-card.tsx`. No hace falta editar los párrafos de `data.ts`.

### Quiénes somos, apertura, contacto, preguntas, privacidad, retiro y 404

Misma estructura de bloques. Títulos a Figtree SemiBold azul. Cuerpo a Inter, interlineado 1,5, color azul clínico (el manual no tiene un gris de texto; la jerarquía se hace con tamaño y peso). Fondos alternados blanco y celeste claro. El bloque oscuro de apertura («Lo que todavía no está definido») pasa a azul clínico con texto blanco y checks en celeste dérmico, que sobre ese azul llega a 5,82:1. Los checks sobre blanco siguen en azul, no en celeste.

Contacto sigue teniendo un solo correo y la frase de que no hay teléfono ni dirección.

404 conserva sus dos acciones.

### Footer

Fondo azul clínico, texto blanco. El logo es la versión en reverso (wordmark blanco, capas celestes) o la versión blanca si el archivo viene así. Mínimo 120 px de ancho y la misma área de protección. Columnas actuales, mismos enlaces, mismo correo. La línea legal inferior se queda: año, nombre y «Próximamente en Nicaragua, para profesionales médicos.»

### Iconografía

Rehacé el trazo de `icons.tsx` a 2 px sobre 48 px de viewBox, caps redondos, `currentColor`. Podés apoyarte en Lucide si el resultado es lineal y simple. Los pictogramas de categoría (gota, destello, hoja) pueden seguir, en azul, mientras no imiten el símbolo de la D.

No montes WhatsApp, Instagram, Facebook, TikTok ni la estrella. En una pasada de limpieza, borrá esas exportaciones y también pin, teléfono, reloj y camión, que hoy no se usan, para que nadie los enlace después. No agregues un teléfono ni un mapa.

Los puntos del símbolo, sueltos y en celeste, pueden ser un acento chico. No los uses como viñeta de un texto largo.

El patrón de capas es un archivo de diseño (líneas paralelas onduladas). Si no está exportado, no lo inventes con un SVG aproximado del símbolo: usá una franja plana de celeste claro hasta tener el archivo.

### Lo que se elimina del sistema visual

- Playfair y la variable `--font-playfair`.
- cream, plum, blush y gold como colores de interfaz.
- Mayúsculas sostenidas en etiquetas (el CSS `uppercase`, no el string).
- Halos, degradados cálidos y la sombra `shadow-plum`.
- `animate-marquee` y `animate-fade-up`, que nadie usa.
- `product-spotlight.tsx` si sigue sin referencias, para no reintroducir una grilla paralela.
- `hero-rostro.webp` cuando el hero nuevo esté publicado.
- Los SVG de arranque de Next, en la misma pasada de limpieza.

## Tokens a introducir

Definilos en `:root` y mapealos en `@theme` de Tailwind, como hoy. Nombres nuevos, para no dejar una clase `plum` que pinte azul.

| Token | Hex | Rol |
| --- | --- | --- |
| `--clinical` | `#1E3A5F` | Azul clínico. Texto, títulos, botón principal, footer, header de ícono, bordes de control |
| `--sky` | `#8BBDEF` | Celeste dérmico. Capas, acentos, líneas, checks sobre azul. Nunca párrafo sobre blanco |
| `--sky-100` | `#D6E6F5` | Celeste claro. Fondos suaves, chips, capa interna |
| `--mist` | `#D3D5DA` | Gris frío. Divisores decorativos y placeholders de fondo |
| `--white` | `#FFFFFF` | Base |

Proporción: dominan el azul y el blanco. Los celestes y el gris acompañan.

Tipografía, con `next/font/google` y `display: "swap"`:

- `--font-display`: Figtree, pesos 400, 500 y 600. Títulos y, cuando el archivo exista, no el wordmark (ese no se compone en vivo).
- `--font-sans`: Inter, pesos 400, 500 y 600. Cuerpo, datos, etiquetas y botones.
- Alternativa de sistema ya prevista por el manual: Arial, Helvetica, sans-serif, como fallback detrás de las variables.

Escala de pantalla (el 10–12 pt del manual es de papelería; en el sitio el cuerpo se queda en 16 px para seguir siendo legible):

| Rol | Familia | Peso | Tamaño | Interlineado |
| --- | --- | --- | --- | --- |
| H1 | Figtree | 600 | 40–60 px (`text-4xl` / `sm:text-6xl` donde el hero lo pida; 36 px mínimo en 320 px si 40 px desborda) | 1,05–1,15 |
| H2 | Figtree | 600 | 22–28 px | 1,2 |
| Cuerpo | Inter | 400 | 16 px | 1,5 |
| Secundario | Inter | 400 | 14 px | 1,5 |
| Etiqueta y botón | Inter | 500–600 | 14 px | 1,2 |

No declares un gris de texto «muted». El cuerpo va en azul clínico sobre blanco o sobre celeste claro. Esas dos combinaciones, más blanco sobre azul, son las únicas que el manual aprueba.

Hover del botón principal: el mismo azul con opacidad ligeramente menor, o un oscurecimiento documentado como estado de interfaz y no como color de marca. El texto del botón sigue en blanco. Medí el par antes de darlo por bueno (objetivo: blanco sobre ese fondo ≥ 4,5:1).

Botones con radio de 8 px, no píldora. Altura táctil mínima de 44 px. El botón de menú hoy mide 40 px (`h-10 w-10`): subilo a 44.

## Componentes a crear o a refactorizar

Crear:

- `Logo`. Recibe `variant: "horizontal" | "reverse" | "iso"` y renderiza el SVG oficial con `alt=""` si al lado hay texto de marca, o `alt="Dérmica"` si el logo es el único nombre en ese bloque. Ancho mínimo según variante (120 px horizontal, 70 px vertical, 32 px isotipo completo). Debajo de 24 px, el isotipo simplificado que ya está en el favicon.
- `LayerPattern`. Solo cuando exista el SVG del patrón. Props de tono: `onSky` o `onClinical` (20–30 %). `aria-hidden`.
- `PageHero`. Encabezado compartido de las páginas interiores (etiqueta, h1, bajada). Hoy está copiado en apertura, contacto, catálogo, quiénes, preguntas, privacidad y retiro.

Refactorizar, sin cambiar su contrato de datos:

- `globals.css` y `layout.tsx` (Figtree en lugar de Playfair).
- `ui.tsx`: `Eyebrow` en tipo oración; `ButtonLink` con los radios y colores nuevos; las variantes primary / outline / ghost se conservan.
- `site-header.tsx`, `site-footer.tsx`, `cta-banner.tsx`, `hero-scan.tsx`.
- `category-card.tsx`, `product-card.tsx`, `catalog-filters.tsx`.
- `waitlist-form.tsx` y `withdraw-marketing.tsx`: solo clases.
- `icons.tsx`: trazo y limpieza de los iconos sociales.

No hace falta un sistema de temas claro/oscuro. El manual no lo pide. El favicon tampoco trae variante `prefers-color-scheme`.

## Responsive y contraste

Anchos que ya cubre `tests/responsive-overflow.test.ts`: 320, 360, 375, 390, 414, 768, 1024, 1280 y 1440. Volvé a correr esa prueba en cada fase que toque layout o tipografía: Figtree no parte igual que Playfair y el hero es el punto frágil (palabras sueltas con `inline-block`).

Decisiones por corte:

- **320–767 px.** Una columna. Logo horizontal ≥ 120 px dentro del header de 64 px de alto; si el archivo oficial es más alto, crecé el header, no achiques el logo por debajo del mínimo. Menú desplegable como ahora. Los tres datos del hero en columna o en una grilla que no desborde. Formulario a ancho completo. Botones primarios a ancho completo donde ya lo están.
- **768–1023 px.** Grillas de dos columnas en categorías y en la lista. El filtro del catálogo puede quedar arriba, como hoy antes de `lg`.
- **1024 px y más.** Nav horizontal, hero en tres zonas, lista en dos columnas, filtro sticky.

Contraste medido con la fórmula WCAG:

| Par | Ratio | Uso |
| --- | --- | --- |
| `#1E3A5F` sobre `#FFFFFF` | 11,50:1 | Texto y UI. Pasa AAA |
| `#1E3A5F` sobre `#D6E6F5` | 9,04:1 | Texto sobre fondo suave. Pasa AAA |
| `#1E3A5F` sobre `#D3D5DA` | 7,83:1 | Texto sobre placeholder gris. Pasa AAA |
| `#FFFFFF` sobre `#1E3A5F` | 11,50:1 | Texto en footer, banner y botón. Pasa AAA |
| `#8BBDEF` sobre `#1E3A5F` | 5,82:1 | Acento sobre azul. Pasa AA de texto; el manual igual reserva el texto de ese fondo al blanco |
| `#8BBDEF` sobre `#FFFFFF` | 1,98:1 | No sirve para texto ni para un borde que sea la única pista del control |
| `#8BBDEF` sobre `#D6E6F5` | 1,55:1 | Solo patrón decorativo, nunca texto |
| `#D6E6F5` sobre `#FFFFFF` | 1,27:1 | Fondo contra fondo. No delimita un campo |
| `#D3D5DA` sobre `#FFFFFF` | 1,47:1 | Divisor decorativo. No es borde de input ni texto |

Foco: anillo de 2 px azul clínico, separado del control, visible sobre blanco y sobre celeste claro. No uses el celeste dérmico como anillo sobre blanco (no llega a 3:1). El enlace «Saltar al contenido» mantiene el contraste (fondo azul, texto blanco).

Movimiento: conservá la anulación bajo `prefers-reduced-motion`. No agregues un marquee.

## SEO, metadatos e imagen social

No cambies títulos, descripciones, canónicas, `llms.txt`, el sitemap ni los textos de JSON-LD. El alt vigente de la imagen social se queda: «Dérmica. Insumos de medicina estética para médicos en Nicaragua.»

Cuando el logo horizontal esté en `public/` con URL estable:

- Regenerá `public/og.png` a 1200×630. Fondo blanco o azul clínico, logo oficial con su área de protección, y ese mismo texto. Sin precio, sin cupo en cifras sueltas que parezcan oferta, sin foto de stock, sin redes.
- `openGraph.images` y `twitter.images` siguen apuntando a `/og.png` (`summary_large_image`). Actualizá ancho, alto y alt solo si el archivo cambia de medida; la medida se mantiene.
- En `json-ld.tsx`, sumá `logo` con la URL absoluta del archivo (`https://dermica.lat/...`). No agregues `sameAs`, `address`, `telephone` ni `foundingLocation` de ciudad.
- `themeColor` del viewport: `#1E3A5F`, en el export `viewport` de `layout.tsx`. Es el color de la UI del navegador, no un dato de negocio.

El favicon de la fase 0 ya alimenta la pestaña, el touch icon de Apple y los PNG de 192 y 512 enlazados como `rel="icon"`. Un manifest web queda fuera de este plan: no existe uno y el manual no pide una app instalable. Si más adelante se crea, los `src` tienen que ser estos mismos archivos (`app-icon-192.png`, `app-icon-512.png`, `favicon.svg`), con `background_color` y `theme_color` en `#1E3A5F`.

IndexNow y las metas opcionales de Google y Bing no cambian con el rediseño visual.

## Orden de implementación

Cada fase deja lint, pruebas y build en verde. La prueba de overflow corre después de cualquier cambio de CSS o de tipografía. El copy se puede vigilar con una búsqueda de «Managua», montos, «testimonio», «instagram», «facebook», «tiktok» y «wa.me»: el resultado esperado es cero.

### Fase 0. Favicon

Hecha en este cambio. Alcance chico: un `.ico` en `app/` y siete archivos en `public/`, enlazados desde `metadata.icons`. El `.ico` anterior (25 KB, paleta vieja) quedó reemplazado. Riesgo residual: ninguno de copy. No hay manifest que actualizar.

### Fase 1. Tokens y tipografía de interfaz

Archivos: `globals.css`, `layout.tsx`, y un barrido de clases `plum`, `cream`, `blush`, `gold`, `font-display` y `uppercase` en componentes y páginas.

Alcance medio por la cantidad de clases, riesgo bajo si el barrido es completo. No edites strings de `site.ts`, `data.ts`, `faq.ts`, `category-guides.ts` ni los literales de las páginas. No cambies el wordmark del header por texto en Figtree: hasta la fase 2 el header puede conservar el texto actual en la fuente de cuerpo, o esperar. Playfair sale de los títulos de sección en esta fase.

Riesgo: un token viejo olvidado, o un título que desborde en 320 px. Lo cubre la prueba de anchos.

### Fase 2. Logo oficial

Bloqueada hasta recibir los SVG de `/logos`: horizontal a color, horizontal en reverso, vertical, isotipo completo, isotipo simplificado, monocromo azul y blanco. Alcance chico cuando estén: componente `Logo`, header, footer y el `logo` del JSON-LD.

Riesgo alto si se recompone el wordmark o se ignora el mínimo de 120 px. No publiques esta fase con un sustituto dibujado.

### Fase 3. Cromado compartido

Header (cromado, todavía con la salvedad del logo), footer, botones, tarjetas, filtros, formulario y retiro (solo clases), iconos, banner. Crear `PageHero` y usarlo donde el encabezado está duplicado.

Alcance medio. Riesgo: alterar el foco del formulario, el `aria` o el área táctil. La lógica de `waitlist-form.tsx` y de `withdraw-marketing.tsx` no se mueve de sitio; si una clase obliga a tocar JSX de estado, parás y lo dejás para revisión. Las pruebas `tests/waitlist.test.ts`, `tests/marketing.test.ts` y `tests/waitlist-postgres.test.ts` tienen que seguir pasando sin cambios de comportamiento.

### Fase 4. Páginas

Inicio (hero nuevo), catálogo, tres fichas, quiénes somos, apertura, contacto, preguntas, privacidad, retiro y 404. Es el sistema de la fase 3 aplicado sección por sección.

Alcance amplio. Riesgo principal: el hero en 320 px y los placeholders con texto blanco sobre azul que queden cortados. Misma prueba de overflow. No reescribas las guías de categoría.

### Fase 5. Imagen social y metadatos visuales

Regenerar `og.png`, `themeColor` y `logo` en JSON-LD. Depende de la fase 2. Alcance chico.

Riesgo: publicar una OG con un logo redibujado o con un dato que el sitio no afirma (precio, sede, día de apertura). Usá solo el alt y el copy que ya están en `page-metadata.ts`.

Retirá `hero-rostro.webp` en esta fase si la fase 4 ya no lo referencia. Borrá también los SVG de arranque que sigan sin uso y `product-spotlight.tsx` si sigue huérfano.

### Fase 6. Cierre de cada fase

Lint, `npm test` y `npm run build`. Revisión manual del formulario: casillas desmarcadas, error de correo, éxito con enlace de retiro, y la página de retiro sin token. Revisión de contraste con los pares de la tabla. Búsqueda del copy prohibido. No hace falta un deploy de producción para cerrar la fase.

## Riesgos

- **Logo ausente.** Sin los SVG de `/logos` y sin el patrón, el header y el hero nuevos no se pueden terminar bien. Esperá los archivos. Un wordmark en Figtree vivo contradice el manual.
- **Contraste del celeste.** Es el error fácil: usarlo en etiquetas, placeholders o bordes de campo sobre blanco. La tabla de arriba marca los pares que no sirven.
- **Copy arrastrado por el manual.** Los ejemplos de tono y los datos de papelería no son el texto del sitio. Un rediseño que «mejore» frases cambia el alcance.
- **Formulario.** El estado, las dos casillas, el honeypot y el retiro ya tienen pruebas. Un restyle que reordene inputs o cambie `name` las rompe y, peor, cambia el consentimiento.
- **Tipografía y overflow.** Figtree SemiBold en el h1 partido por palabras puede generar scroll horizontal en 320 px. La prueba puppeteer es la red de seguridad; hace falta Chrome local para que no se saltee.
- **Fotografía.** Sumar un banco de imágenes o dejar el retrato cálido deshace la dirección. Hasta tener fotos con consentimiento, el sitio vive de color, patrón y logo.
- **Iconos sociales dormidos.** Están en `icons.tsx` y no se renderizan. El riesgo es «aprovecharlos» en el footer. No van.
- **Métricas visibles.** `SiteMetrics` cuenta visitas y clics sin identificar personas, y la privacidad dice que no hay un listado público. No muestres esos números como prueba social.
- **OG vieja.** Hasta la fase 5, la miniatura social sigue en la paleta anterior aunque el sitio ya sea azul. Es un desfase aceptable y acotado; no bloquea las fases 1 a 4.
- **Favicon y manifest.** El set nuevo ya está enlazado. Crear un manifest en medio del rediseño no aporta y puede cachear iconos de más. Dejalo fuera.

## Qué queda quieto

Copy de páginas, FAQ, guías, `llms.txt` y metadatos de texto. Validación y almacenamiento de la lista. Consentimiento de apertura y consentimiento de marketing, por separado. APIs. Sitemap, robots, redirecciones e IndexNow. El correo gerencia@dermica.lat. La ausencia de teléfono, dirección, RUC y precio. El favicon de la fase 0, que no se vuelve a exportar a mano.
