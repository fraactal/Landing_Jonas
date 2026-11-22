# Spec 056 - S05.1: "Cómo trabajamos" como línea de tiempo viva

Estado: Implementada (textos "Recibes" pendientes de aprobación de Jonathan).

## Objetivo
Dar impacto a la sección: el panel izquierdo deja de repetir número/título y pasa a ser una línea de tiempo con los 7 pasos; los recorridos quedan marcados y la línea se llena al avanzar. Tarjetas más grandes con ícono, número gigante translúcido y una línea "Recibes".

## Alcance
- Aside (solo PC ≥64rem): "Tu camino" + 7 nombres, línea de progreso, pasos hechos/activo/pendientes.
- Tarjetas: ícono por paso, número de fondo, bloque "Recibes" (textos nuevos, a validar).
- Scroll más corto: alto mínimo por paso 34rem/68vh → 22rem/46vh.
- Móvil: tarjetas apiladas con el mismo estilo; sin barra de progreso (decisión simple, revisable).
- prefers-reduced-motion respetado (sin transiciones).

## Aceptación
Sin errores de consola; JS reutiliza el observer existente; accesibilidad: aside aria-hidden, lista ordenada de pasos intacta.
