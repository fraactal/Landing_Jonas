# Spec 049 - S00.1: Vista previa social, favicon y sitemap

Estado: Implementada.

## Objetivo
Que el enlace se vea profesional al compartirlo (WhatsApp, Meta, redes) y que el sitemap refleje solo el embudo comercial.

## Alcance
- Imagen Open Graph 1200x630 (assets/images/og-image.png), og:image con alt y dimensiones, og:locale es_CL y twitter:card summary_large_image.
- Favicon SVG (assets/images/favicon.svg) en landing, /privacidad, /terminos y 404.
- Se quita /cv/ del sitemap.xml (el CV no forma parte del funnel).

## Criterios de aceptación
- Las metas existen y las rutas de imagen apuntan a https://jonathanvaldes.com/assets/images/...
- El favicon carga en las cuatro páginas.
- Sin errores de consola.

## Nota
La vista previa solo funcionará cuando el sitio se despliegue con la carpeta assets/ (el despliegue está fuera de alcance). Se recomienda validar con el depurador de compartidos de Meta tras publicar.

## Fuera de alcance
Apple touch icon, favicon PNG/ICO, cambio de /cv.
