# Spec 033 - S01.3: Proporciones y espaciado del Hero

Estado: Implementada.

## Objetivo

Equilibrar exclusivamente la composición de escritorio del Hero reduciendo escala y espacio vertical sin modificar contenido ni el diseño interno del flujo de tres etapas.

## Alcance

- Desde 768 px, reducir aproximadamente 9% la escala máxima del H1.
- Ajustar el ancho de lectura del H1 y reducir aproximadamente 16% el padding vertical del Hero.
- Aumentar ligeramente la columna visual derecha y alinear su panel con el inicio del contenido.
- Conservar las reglas mobile existentes.

## Fuera de alcance

- Header, contenido y CTAs del Hero, flujo interno de tres etapas, S02-S10, tokens globales, `/cv`, infraestructura y funcionalidades.

## Criterios de aceptación

- Hero más compacto y equilibrado en 1440 px sin altura fija.
- Sin superposiciones ni desbordamiento horizontal en 360, 390, 768 y 1440 px.
- H1, CTAs, textos de apoyo y tarjetas del flujo se mantienen legibles.
