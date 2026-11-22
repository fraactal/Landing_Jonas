# Spec 059 - S05.4: Tarjetas de "Cómo trabajamos" con el mismo alto

Estado: Implementada.

## Objetivo
Que las 7 tarjetas midan lo mismo (hoy cambian según la cantidad de texto), para que el contenedor, los botones y el scroll no "salten" entre pasos.

## Alcance
- Móvil: las tarjetas se apilan en la misma celda de una grilla; el alto lo fija la más alta y las ocultas usan visibility (no display), con aria-hidden desde JS.
- PC: alto mínimo común en las tarjetas.

## Aceptación
Al pasar de paso 1 a 7 el alto de la tarjeta y la posición de Anterior/Siguiente no cambian; sin errores de consola.
