# Spec 014 - SEO, Performance and Accessibility

Estado: Implementada.

## 1. Objetivo

Definir una revision tecnica transversal y acotada de `jonathanvaldes.com` antes de avanzar a nuevos modulos. M14 debe mejorar la base de publicacion estatica sin redisenar la landing ni cambiar su propuesta comercial.

La revision cubre:

1. SEO tecnico y on-page basico.
2. Performance frontend.
3. Accesibilidad.
4. Metadatos sociales.
5. Indexacion basica.
6. Robustez progresiva de la landing.

El principio general es aplicar solo mejoras simples, justificadas, medibles y compatibles con un sitio estatico.

## 2. Contexto

El sitio ya incluye la landing comercial completa, paginas legales en `/privacidad` y `/terminos`, interacciones vanilla JS y estilos centralizados en `assets/css/styles.css`.

La arquitectura aprobada sigue siendo:

```text
Cloudflare DNS -> CloudFront -> S3 -> sitio estatico
```

No existe aun contacto real, WhatsApp conectado, agenda, analytics, backend, pagos, cuentas, foto profesional aprobada ni imagen social aprobada. Los CTAs comerciales convergen temporalmente a `#contacto`, lo que sigue siendo correcto hasta implementar un canal real.

## 3. Alcance

M14 debe definir y, cuando se implemente, aplicar mejoras acotadas en:

- metadata SEO de la home;
- metadata SEO basica de paginas legales;
- Open Graph basico;
- decision sobre Twitter/X Cards;
- decision sobre JSON-LD factual;
- `robots.txt`;
- `sitemap.xml`;
- posible `404.html` minima;
- correcciones pequenas de estructura HTML que afecten accesibilidad o robustez;
- validacion de headings, landmarks y anchors;
- revision de CSS sin refactor general;
- revision de JS sin reescritura amplia;
- revision de reduced motion, focus, touch targets y contraste;
- documentacion de deuda tecnica futura.

## 4. Fuera de alcance

No implementar en M14:

- analytics;
- Google Tag Manager;
- Google Analytics;
- Meta Pixel;
- cookies;
- CMP o banner de cookies;
- backend;
- Lambda;
- SES;
- Google Calendar;
- Meet;
- contacto real;
- WhatsApp real;
- agenda real;
- `/cv`;
- redisenos;
- frameworks;
- build pipeline;
- deploy;
- CSP compleja;
- WAF;
- rate limiting;
- CAPTCHA;
- imagen social inventada;
- favicon/logo inventado;
- nuevas dependencias.

## 5. Auditoria SEO actual

### Home

Estado actual observado:

- `lang="es"` presente.
- Existe un unico `h1` visible en Hero.
- Existe meta description basica.
- Existe `title`, pero puede ser mas comercial y especifico.
- No existe canonical.
- No existe `meta name="robots"`.
- No existen metadatos Open Graph.
- No existen Twitter/X cards.
- No existe JSON-LD.
- No existe `robots.txt`.
- No existe `sitemap.xml`.
- No hay imagen social aprobada.

### Paginas legales

Estado actual observado:

- `privacidad/index.html` y `terminos/index.html` existen.
- Ambas usan `lang="es"`.
- Ambas tienen un unico `h1`.
- Ambas tienen `title`, meta description y canonical.
- No necesitan optimizacion comercial agresiva.
- Pueden incorporar `meta name="robots" content="index, follow"` de forma consistente.

### Headings

La jerarquia general es correcta:

- Home: un `h1` en Hero.
- Secciones principales: `h2`.
- Cards/items: `h3`.

Hallazgo puntual: en `index.html`, la seccion FAQ no cierra explicitamente antes de la seccion `final-cta`. M14 debe corregir esa estructura agregando el cierre `</section>` correspondiente para mejorar robustez HTML y accesibilidad.

## 6. Meta title/description final

### Home title propuesto

```html
<title>Jonathan Valdés | Desarrollo, Automatización, Cloud y Soluciones Tecnológicas</title>
```

Razon:

- comunica identidad;
- resume servicios principales;
- evita keyword stuffing;
- mantiene foco comercial.

### Home meta description propuesta

```html
<meta name="description" content="Resolvemos problemas tecnológicos con desarrollo, automatización, integraciones, cloud, QA, datos y monitoreo para empresas que necesitan avanzar.">
```

Objetivo:

- mantener extension cercana a 140-160 caracteres;
- expresar problema y solucion;
- no prometer resultados no documentados;
- incluir areas clave sin saturar.

### Legales

Mantener titles actuales:

```html
<title>Política de Privacidad | Jonathan Valdés</title>
<title>Términos de Servicio | Jonathan Valdés</title>
```

Las meta descriptions actuales son coherentes. M14 puede mantenerlas y solo revisar consistencia de canonical/robots.

## 7. Canonical

Definir canonical en home:

```html
<link rel="canonical" href="https://jonathanvaldes.com/">
```

Mantener canonical en paginas legales:

```html
<link rel="canonical" href="https://jonathanvaldes.com/privacidad">
<link rel="canonical" href="https://jonathanvaldes.com/terminos">
```

Si durante deploy se decide forzar slash final en CloudFront/S3, revisar canonical en una spec o ajuste posterior para que coincida con la URL publica final. En M14 se acepta la variante sin slash porque coincide con las rutas objetivo documentadas.

## 8. Open Graph

Agregar Open Graph basico en home:

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Jonathan Valdés | Desarrollo, Automatización, Cloud y Soluciones Tecnológicas">
<meta property="og:description" content="Resolvemos problemas tecnológicos con desarrollo, automatización, integraciones, cloud, QA, datos y monitoreo para empresas que necesitan avanzar.">
<meta property="og:url" content="https://jonathanvaldes.com/">
<meta property="og:site_name" content="Jonathan Valdés">
```

No agregar `og:image` en M14 porque no existe imagen social aprobada. No usar imagen externa, stock ni generada.

Deuda futura:

- crear un asset social real, por ejemplo `assets/img/og-image.jpg` o WebP/JPG equivalente;
- dimensiones recomendadas: 1200 x 630;
- incluir texto/identidad aprobada;
- agregar `og:image`, `og:image:width`, `og:image:height` y `og:image:alt` cuando exista.

Paginas legales pueden omitir OG especifico en M14 o usar metadata minima solo si no aumenta ruido. La prioridad OG es la home.

## 9. Schema

Decision: implementar JSON-LD pequeno y factual en la home, sin inventar datos.

Tipo recomendado: `@graph` con `WebSite`, `Person` y `ProfessionalService` o `Service` simple.

Contenido permitido:

- nombre: `Jonathan Valdés`;
- url: `https://jonathanvaldes.com/`;
- descripcion general de servicios;
- areas de conocimiento/servicio: desarrollo de software, automatizacion, integraciones, cloud, QA, datos, monitoreo;
- idioma: `es`.

No incluir:

- direccion fisica;
- telefono;
- email operativo;
- redes sociales;
- ratings;
- reviews;
- precios;
- clientes;
- coordenadas;
- disponibilidad;
- imagen si no existe asset aprobado.

Ejemplo conceptual para implementar:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://jonathanvaldes.com/#website",
      "name": "Jonathan Valdés",
      "url": "https://jonathanvaldes.com/",
      "inLanguage": "es"
    },
    {
      "@type": "Person",
      "@id": "https://jonathanvaldes.com/#person",
      "name": "Jonathan Valdés",
      "url": "https://jonathanvaldes.com/",
      "jobTitle": "Ingeniero en Informática",
      "knowsAbout": [
        "Desarrollo de software",
        "Automatización",
        "Integraciones",
        "Cloud",
        "QA",
        "Datos",
        "Monitoreo"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://jonathanvaldes.com/#service",
      "name": "Jonathan Valdés - Soluciones tecnológicas",
      "url": "https://jonathanvaldes.com/",
      "description": "Desarrollo, automatización, integraciones, cloud, QA, datos y monitoreo para empresas que necesitan resolver problemas tecnológicos.",
      "provider": { "@id": "https://jonathanvaldes.com/#person" },
      "areaServed": "Chile"
    }
  ]
}
</script>
```

`areaServed: Chile` se permite solo si Jonathan valida que el sitio apunta comercialmente a Chile. Si se prefiere evitar esa precision, omitir `areaServed`.

## 10. Sitemap

Crear `sitemap.xml` estatico con URLs reales existentes:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jonathanvaldes.com/</loc>
  </url>
  <url>
    <loc>https://jonathanvaldes.com/privacidad</loc>
  </url>
  <url>
    <loc>https://jonathanvaldes.com/terminos</loc>
  </url>
</urlset>
```

No incluir:

- `/cv`;
- anchors;
- rutas futuras;
- archivos CSS/JS;
- paginas no existentes.

No agregar `lastmod` si no se va a mantener de forma confiable.

## 11. Robots

Crear `robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://jonathanvaldes.com/sitemap.xml
```

No bloquear CSS, JS ni paginas legales.

Agregar en home y legales:

```html
<meta name="robots" content="index, follow">
```

## 12. 404

Decision: incluir `404.html` minima en M14 como parte de robustez estatica.

Motivo:

- hosting S3/CloudFront suele necesitar pagina de error estatica;
- evita una experiencia rota si el usuario abre una ruta inexistente;
- no requiere backend ni nueva interaccion;
- aporta robustez sin convertirse en modulo grande.

Contenido minimo:

- mismo sistema visual;
- `title`: `Página no encontrada | Jonathan Valdés`;
- un unico `h1`: `Página no encontrada`;
- texto breve;
- enlace `Volver al inicio` hacia `/`;
- sin JS nuevo;
- sin sitemap inclusion por defecto.

No crear busqueda interna ni recomendaciones complejas.

## 13. Auditoria performance

Estado actual:

- Sitio estatico.
- Sin imagenes pesadas.
- Sin dependencias JS externas.
- JS vanilla pequeno en `assets/js/main.js`.
- CSS centralizado via `styles.css` con imports.
- Google Fonts se carga con `preconnect` y `display=swap`.
- El script principal usa `defer`.

Mejoras M14 recomendadas:

- No introducir build pipeline.
- No minificar manualmente en esta etapa.
- Mantener `defer` en JS.
- Mantener interacciones como progressive enhancement.
- Evitar refactor grande de CSS.
- Corregir estructura HTML de FAQ para evitar DOM inesperado.
- Verificar anchors internos existentes.
- Ejecutar `node --check assets/js/main.js`.

Lighthouse queda fuera de M14 o como validacion opcional posterior. No bloquear M14 por scores.

## 14. CSS

Estado actual:

- `tokens.css`, `base.css` y `components.css` son pequenos y razonables.
- `sections.css` ha crecido y concentra estilos de muchas secciones, incluida la parte legal.
- Hay patrones repetidos de eyebrow, headings, cards y grids, pero no justifican un refactor amplio en M14.

Alcance M14:

- No hacer refactor general.
- No crear arquitectura CSS nueva.
- Corregir solo reglas pequenas si afectan accesibilidad, overflow, focus, reduced motion o touch targets.
- Considerar limpiar reglas muertas relacionadas con `[aria-disabled="true"]` en footer si ya no existen placeholders legales, solo si se toca esa zona.
- Mantener `sections.css` como archivo principal por ahora.

Deuda futura:

- evaluar separar estilos de paginas legales o patrones repetidos cuando exista build/organizacion final;
- revisar duplicacion de clases `__eyebrow` si el archivo crece mas.

## 15. JS

Estado actual:

- Menu mobile usa `aria-expanded`, Escape, cierre por click y resize.
- Texto dinamico respeta `prefers-reduced-motion` y `document.hidden`.
- Selector de problemas usa botones y actualiza `aria-pressed`.
- Proceso usa `IntersectionObserver` y no usa listener continuo de scroll.
- FAQ usa botones, `aria-expanded`, `aria-controls` y permite multiples abiertas.

Alcance M14:

- No reescribir modulos existentes.
- Ejecutar `node --check assets/js/main.js`.
- Revisar si `reduceMotion.addEventListener` requiere fallback para navegadores antiguos; documentarlo como deuda si no se toca.
- Verificar que los bloques se inicializan solo si existen nodos, lo cual ya ocurre.
- No agregar analytics ni eventos nuevos.

Posible mejora pequena si se justifica durante implementacion:

- envolver cada modulo en scopes o comentarios breves solo si mejora mantenibilidad sin cambiar comportamiento;
- no convertir a framework ni clase global.

## 16. Fuentes

Estado actual:

- Google Fonts: Inter + Manrope.
- `display=swap` presente.
- `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com` presente.

Decision M14:

- Mantener Google Fonts por ahora.
- No descargar/self-host en M14.
- Documentar self-hosting como deuda futura de performance/privacidad si el sitio pasa a produccion o requiere maxima independencia.

No agregar fuentes nuevas.

## 17. Imagenes futuras

Estado actual:

- No hay foto profesional aprobada.
- No hay OG image aprobada.
- Visuales actuales son HTML/CSS/SVG inline.

Estrategia futura:

- Foto de Jonathan: usar WebP/AVIF cuando exista asset real aprobado.
- Incluir `width` y `height`.
- Usar `loading="lazy"` si no es LCP.
- Usar `decoding="async"` si corresponde.
- Usar `srcset` para responsive si se publican varias versiones.
- No usar stock ni foto generada falsa.

M14 no debe agregar imagenes nuevas.

## 18. CLS/layout

Estado actual:

- El texto dinamico reserva altura mediante `min-height`.
- El placeholder `JV` usa dimensiones estables.
- Las cards usan grillas y alturas/min-heights razonables.
- No hay imagenes sin dimensiones.
- FAQ colapsa/expande por interaccion del usuario, por lo que no representa CLS inesperado de carga.

Mejoras M14:

- Verificar que el cierre faltante de FAQ no afecte layout/DOM.
- Revisar responsive basico en mobile/desktop tras correcciones.
- No introducir recursos que cambien layout tarde.

## 19. Auditoria accesibilidad

Estado actual positivo:

- Existe skip link en home y legales.
- Existen landmarks `header`, `nav`, `main`, `footer`.
- La home tiene un solo `h1`.
- Las paginas legales tienen un solo `h1`.
- Menu mobile usa boton real con `aria-expanded` y `aria-controls`.
- Selector usa botones reales y `aria-pressed`.
- FAQ usa botones reales con `aria-expanded` y `aria-controls`.
- Proceso mantiene pasos en DOM y usa lista ordenada.
- `:focus-visible` global existe.
- `prefers-reduced-motion` existe a nivel global y por secciones.

Hallazgos a corregir en M14:

- Falta cierre explicito de `</section>` para FAQ antes de `final-cta` en `index.html`.
- Los paneles FAQ usan `aria-hidden`; confirmar que el estado se actualiza siempre con apertura/cierre y no deja contenido abierto oculto.
- El contraste de `#9AA4B2` sobre `#12161C` y `#0B0D10` parece razonable, pero debe revisarse en combinaciones pequenas como footer, labels y legal links.
- `#242A33` como borde no debe ser el unico indicador de estado.

## 20. Skip link

Decision: ya existe y debe conservarse.

Validar en M14:

- `href="#main-content"` apunta a un `id` existente en home y legales.
- Aparece al recibir foco.
- Tiene contraste suficiente.
- No queda detras del header sticky.

No crear otro skip link duplicado.

## 21. Navegacion

Validar:

- Navbar desktop conserva links a `#soluciones`, `#como-trabajamos`, `#proyectos`, `#faq`.
- CTAs temporales apuntan a `#contacto`.
- Boton mobile mantiene `aria-expanded` correcto.
- Escape cierra menu y devuelve foco al boton.
- Cierre al seleccionar un link sigue funcionando.
- No se enlaza `/cv`.

M14 no debe conectar WhatsApp, agenda ni email reales.

## 22. Formularios/controles actuales

No existen formularios activos.

Controles existentes:

- boton menu mobile;
- botones del selector de problemas;
- botones FAQ;
- enlaces CTA;
- links legales.

Revisar en M14:

- todos tienen focus visible;
- targets tactiles razonables;
- botones no se usan como enlaces externos;
- enlaces no simulan acciones locales;
- CTAs a `#contacto` siguen siendo placeholders controlados.

## 23. Contraste

Tokens principales:

- fondo: `#0B0D10`;
- superficie: `#12161C`;
- texto: `#F4F6F8`;
- muted: `#9AA4B2`;
- acento: `#4F7CFF`;
- acento suave: `#8BA7FF`;
- borde: `#242A33`.

Evaluacion preliminar:

- `#F4F6F8` sobre fondos oscuros: correcto.
- `#9AA4B2` sobre `#0B0D10` y `#12161C`: probablemente correcto para texto secundario, pero validar especialmente en tamanos pequenos.
- `#4F7CFF` con texto blanco: revisar contraste del boton primario; si no alcanza en algun estado, ajustar solo el estado problematico.
- `#242A33` no debe usarse como unico indicador visual.

No cambiar la paleta completa en M14 salvo hallazgo concreto.

## 24. Focus

Estado actual:

```css
:focus-visible {
  outline: 2px solid var(--color-accent-soft);
  outline-offset: 3px;
}
```

Decision:

- Mantener focus global.
- Verificar que componentes con overflow, cards o botones no recorten el outline.
- Verificar focus en links legales, CTA, menu, selector y FAQ.

## 25. Touch targets

Objetivo:

- controles principales cercanos o superiores a 44 x 44 px cuando sea razonable.

Estado actual:

- `.button` tiene `min-height: 2.875rem`, correcto.
- `.nav-toggle` tiene `min-height: 2.75rem`, correcto.
- FAQ trigger tiene `min-height: 4.75rem`, correcto.
- Problem options tienen `min-height: 5.5rem`, correcto.
- Links legales del footer pueden depender de padding/line-height; revisar si conviene ampliar area tactil sin cambiar visualmente demasiado.

## 26. Reduced motion

Estado actual:

- Base CSS reduce animaciones/transiciones.
- Dynamic problem evita rotacion cuando `prefers-reduced-motion: reduce`.
- Sections CSS desactiva transiciones clave.
- FAQ y proceso tienen transiciones desactivadas en reduced motion.

Validar en M14:

- que no existan animaciones continuas nuevas;
- que sticky process siga legible sin depender del movimiento;
- que hover transforms no sean esenciales;
- que el usuario con reduced motion no reciba rotacion automatica.

## 27. Seguridad frontend basica

Estado actual:

- No se observaron secretos en HTML revisado.
- No hay keys, tokens ni endpoints backend.
- No hay inline scripts excepto el futuro JSON-LD si se implementa.
- No hay enlaces externos de contacto activos.

Alcance M14:

- No implementar CSP compleja.
- No implementar headers porque corresponden a CloudFront/S3/Fase 7.
- Si se agregan enlaces externos futuros, usar `rel="noopener noreferrer"` cuando abran en nueva pestana.
- Mantener JSON-LD como unico script inline permitido por SEO, si se implementa.

## 28. Archivos previstos

Archivos que probablemente se modificaran en M14:

```text
index.html
privacidad/index.html
terminos/index.html
assets/css/sections.css
specs/014-seo-performance-accessibility.md
```

Archivos que probablemente se crearan:

```text
robots.txt
sitemap.xml
404.html
```

Archivo a revisar/validar, pero no necesariamente modificar:

```text
assets/js/main.js
```

No se espera modificar:

```text
assets/css/tokens.css
assets/css/base.css
assets/css/components.css
```

salvo hallazgo concreto de accesibilidad o performance.

## 29. Criterios de aceptacion

M14 se considera implementada cuando:

- Home tiene title comercial final.
- Home tiene meta description final.
- Home tiene canonical.
- Home tiene `meta name="robots" content="index, follow"`.
- Home tiene Open Graph basico.
- No se agrega `og:image` si no existe asset aprobado.
- Twitter/X cards quedan omitidas o definidas de forma coherente sin imagen falsa.
- JSON-LD factual queda implementado o explicitamente omitido si se decide no hacerlo durante implementacion.
- No se inventan telefono, email operativo, direccion, redes, reviews, ratings, precios ni clientes.
- Paginas legales mantienen title, description, canonical, `lang` y heading correctos.
- `sitemap.xml` existe e incluye solo `/`, `/privacidad` y `/terminos`.
- `robots.txt` existe, permite indexacion y referencia el sitemap.
- Si se crea `404.html`, tiene un solo `h1`, link al inicio y usa sistema visual existente.
- Se corrige la estructura HTML de FAQ/final CTA.
- Hay un solo `h1` en cada pagina HTML revisada.
- Skip link funciona y apunta a `#main-content`.
- Focus visible se mantiene.
- Controles actuales se revisan sin romper comportamiento.
- Reduced motion se mantiene.
- No se redisenia el sitio.
- No se agregan dependencias.
- No se agrega analytics.
- No se agrega backend.
- No se conecta contacto real.
- No se inicia Spec 015.

## 30. Riesgos / deuda tecnica

- No existe imagen social aprobada; `og:image` queda pendiente.
- No existe favicon/logo aprobado; no crear uno en M14.
- Google Fonts sigue siendo dependencia externa; self-hosting queda como deuda futura.
- La decision final de canonical con o sin slash debe alinearse con la configuracion real de CloudFront/S3 al desplegar.
- CSS esta creciendo en `sections.css`; refactor modular queda para una etapa posterior si el archivo se vuelve dificil de mantener.
- Legal copy requiere revision profesional antes de uso comercial definitivo.
- Lighthouse y auditoria completa quedan para una validacion posterior, no para bloquear M14.
- Headers de seguridad, CSP, HSTS y politica de cache corresponden a infraestructura/Fase 7 o despliegue, no a M14.

## 31. Validaciones minimas

Durante la implementacion de M14 realizar solo validaciones rapidas:

- `git status --short --branch` antes de modificar.
- Comprobar title/meta/canonical/robots en home.
- Comprobar Open Graph basico.
- Comprobar que no exista `og:image` sin asset real.
- Comprobar JSON-LD valido si se implementa.
- Comprobar existencia y contenido de `robots.txt`.
- Comprobar existencia y contenido de `sitemap.xml`.
- Comprobar existencia y estructura de `404.html` si se crea.
- Buscar anchors internos principales: `#soluciones`, `#como-trabajamos`, `#proyectos`, `#faq`, `#contacto`, `#main-content`.
- Verificar un solo `<h1>` en home, privacidad, terminos y 404 si existe.
- Verificar cierre estructural de FAQ antes de `final-cta`.
- Ejecutar `node --check assets/js/main.js`.
- Ejecutar `git diff --check`.
- Revision manual responsive basica.
- Revision manual sin JS basica.
- No ejecutar deploy.
- No ejecutar pruebas AWS.
- No ejecutar suites end-to-end pesadas.
- Lighthouse queda fuera o como revision posterior opcional.