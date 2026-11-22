# Spec 064 - S10.1: Footer rediseñado (PC y móvil)

Estado: Implementada.

## Objetivo
Footer según el diseño aprobado: PC en 4 columnas (marca, secciones, contacto, legal) + barra inferior; móvil centrado con botones WhatsApp/Correo, navegación en cuadrícula 2×2, enlaces legales en una fila y copyright.

## Alcance
- Marca con tagline "Software y automatización a medida." y botón "Háblanos hoy" (solo PC).
- Contacto: WhatsApp + info@jonathanvaldes.com (válido solo tras completar docs/guias/correo-info-cloudflare.md).
- Enlaces: Proyectos, Soluciones, Cómo trabajamos, FAQ, Privacidad, Términos, "Volver arriba".
- Se elimina el CSS antiguo del footer (grupos "Canales futuros").
- Páginas legales (privacidad/términos/404) siguen con su propio pie.

## Aceptación
Enlaces con área táctil ≥44 px en móvil, sin scroll horizontal, contraste legible, sin errores de consola.
