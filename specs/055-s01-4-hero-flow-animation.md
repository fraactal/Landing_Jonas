# Spec 055 - S01.4: Animación secuencial del flujo del hero + ícono junto al título en Soluciones

Estado: Implementada.

## Objetivo
1. Animar una sola vez (≈3 s) la tarjeta Analizamos → Implementamos → Generamos resultados: cada paso aparece tras el anterior; las flechas se dibujan y quedan fijas; el último paso resalta su borde.
2. En "Soluciones" (PC y móvil) el ícono del panel va al lado del título para ahorrar alto.

## Reglas
- Solo opacity/transform/stroke; sin loop; sin librerías.
- prefers-reduced-motion: todo visible de inmediato.
- Sin JS el contenido se ve igual (estado oculto solo con clase puesta por JS).
- Parte al entrar la tarjeta en pantalla (IntersectionObserver).

## Aceptación
Sin errores de consola, sin saltos de layout, estado final idéntico al diseño actual.
