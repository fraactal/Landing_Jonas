# Spec 057 - S00.4 / S05.2: Menú móvil mejorado y revelado sin spoilers en "Cómo trabajamos"

Estado: Implementada.

## Objetivo
1. Menú móvil: ícono hamburguesa de 3 líneas que se transforma en X, etiqueta Menú/Cerrar, panel con filas grandes y separadores, botón "Háblanos hoy" a ancho completo, fondo atenuado y cierre al tocar fuera, con Escape o al elegir un enlace.
2. "Cómo trabajamos" (PC): los pasos que vienen no se ven hasta que se llega a ellos (aparecen con fade/desplazamiento); el panel lateral muestra "Cómo trabajamos" como contexto al bajar.

## Reglas
- Solo opacity/transform; prefers-reduced-motion sin transiciones.
- Sin JS todo visible. En móvil de "Cómo trabajamos" no se ocultan pasos (evita huecos en blanco).

## Aceptación
Sin errores de consola; foco y aria-expanded correctos; el panel no tapa el contenido al cerrarse.
