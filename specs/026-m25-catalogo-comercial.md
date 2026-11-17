# Spec 026 - M25: Catálogo comercial de aplicaciones

Estado: Implementada.

## Objetivo

Convertir la sección existente `#proyectos` en una vitrina comercial sobria de productos, soluciones para negocios y casos de estudio, sin crear rutas nuevas, repositorios nuevos, dependencias ni interacciones adicionales.

## Alcance

- Reutilizar la sección `#proyectos`, tarjetas, grillas, tokens y estilos actuales.
- Presentar únicamente aplicaciones con inventario factual documentado en `docs/product/catalogo-aplicaciones.md`.
- Organizar el contenido en Productos digitales, Soluciones para negocios y Casos de estudio.
- Mostrar nombre, problema, estado real, tecnologías cuando estén verificadas y una acción honesta.
- Enlazar solo la URL pública verificada de Cera & Aroma.
- Usar `Cuéntame tu caso` hacia WhatsApp para entradas sin demo pública verificable.

## Fuera de alcance

- Páginas de detalle, filtros, tabs, carruseles, modales, screenshots, analítica o backend nuevo.
- Publicar, modificar o enlazar demos no verificadas.
- Afirmar clientes, contratos, métricas, ventas, usuarios, resultados o confidencialidad no documentada.
- Modificar `/cv/`, infraestructura, Terraform, rutas legales o CTAs principales.

## Criterios de aceptación

- `#proyectos` conserva su ubicación y anchor.
- No se añade JavaScript ni dependencias.
- Toda aplicación incluida tiene un estado explícito y coherente con el inventario.
- Solo Cera & Aroma expone acceso público, porque su URL fue comprobada.
- Las demás tarjetas no prometen una demo disponible.
- El layout conserva una columna en móvil y dos columnas cuando el espacio lo permite.
- No se alteran los CTAs principales ni se enlaza `/cv/` desde la landing.

## Deuda técnica no bloqueante

- La disponibilidad, propiedad y material publicable de cada aplicación debe volver a verificarse antes de crear una página de detalle o enlazar demos adicionales.
- Fideliza NFC no tiene fuente local identificada; se presenta solamente como exploración comercial.
