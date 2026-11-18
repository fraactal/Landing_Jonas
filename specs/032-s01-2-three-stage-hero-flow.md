# Spec 032 - S01.2: Flujo de tres etapas en Hero

Estado: Implementada.

## Objetivo

Sustituir exclusivamente el dashboard conceptual de S01.1 por una tarjeta estática de tres etapas: Analizamos, Implementamos y Generamos resultados.

## Alcance

- Una tarjeta exterior blanca y tres bloques interiores verticales con iconos SVG inline, divisor interno y flechas turquesa.
- Reproducir los textos aprobados y el acento turquesa suave del tercer bloque.
- Usar HTML y CSS con tokens existentes; sin JavaScript, dependencias, métricas, gráficos, chips o contenido adicional.
- Mantenerla a la derecha en escritorio y bajo el contenido del Hero en móvil.

## Fuera de alcance

- Header, textos y CTAs del Hero, S02-S10, catálogo, `/cv`, tokens globales, funcionalidades, infraestructura y despliegues.

## Criterios de aceptación

- No permanecen elementos ni estilos exclusivos del dashboard anterior.
- Las tres etapas tienen los textos exactos, flechas centradas y composición equilibrada.
- No existe desbordamiento horizontal en 360, 390, 768 ni 1440 px.
