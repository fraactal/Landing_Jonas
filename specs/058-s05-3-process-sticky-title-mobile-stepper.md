# Spec 058 - S05.3: Título fijo en PC y paso a paso en móvil

Estado: Implementada.

## Objetivo
- PC: el título + bajada + línea de tiempo quedan fijos mientras avanzan los pasos; se sueltan al terminar el paso 7 (sticky limitado al contenedor del layout).
- Móvil (<48rem): en vez de 7 tarjetas apiladas (~2.500 px), una sola tarjeta con el paso actual, barra de 7 segmentos, contador "Paso X de 7", botones Anterior/Siguiente y deslizar con el dedo.
- Revisar posible desborde horizontal en móvil (tarjetas cortadas a la derecha).

## Reglas
- Sin librerías; aria-live en la lista de pasos; botones con foco visible; reduced-motion sin transiciones.
- Sin JS: los 7 pasos apilados como antes.

## Aceptación
Sin errores de consola; sin scroll horizontal a 390 px; navegación con botones y swipe; en PC el bloque se libera al final.
