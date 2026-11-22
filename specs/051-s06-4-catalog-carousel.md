# Spec 051 - S06.4: Catálogos en carrusel con marcos compactos

Estado: Implementada.

## Objetivo
Reducir el alto de la sección de catálogos y mostrar las capturas (de celular, verticales) como tarjetas compactas en un carrusel.

## Alcance
- Carrusel horizontal nativo (CSS scroll-snap) con flechas (PC), puntos indicadores y teclado; sin librerías.
- Tarjetas de 256 px (226 px en móvil), imagen recortada arriba, nombre, línea breve y enlace.
- Quinta tarjeta "Ejemplo" (Conectiva) con CTA a contacto.
- Imágenes WebP con width/height (menos peso y sin saltos de diseño).
- Excepción explícita al AGENTS.md (sin carruseles sin spec): pedido por Jonathan el 22 nov 2026 y registrado aquí.

## Criterios de aceptación
- Alto de la sección notablemente menor que la grilla anterior.
- Flechas, puntos y arrastre/scroll táctil funcionan; flechas deshabilitadas en los extremos.
- prefers-reduced-motion respetado; sin errores de consola; sin desborde horizontal de la página.

## Fuera de alcance
Autoplay, otras secciones, cambios de contenido de los catálogos.
