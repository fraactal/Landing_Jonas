# Spec 029 - S00–S01: Header y Hero

Estado: Implementada.

## Objetivo

Refinar exclusivamente el header, su navegación existente y el hero de JonathanValdes.com para presentar la identidad Jonathan Valdés con monograma `JV.` y comunicar la oferta aprobada de software, automatización e IA.

## Alcance

- Incorporar el monograma `JV.` con punto turquesa, nombre y descriptor `Software & Automatización` dentro de la marca existente.
- Mantener navegación, sticky header, menú móvil y destinos actuales; renombrar el CTA de WhatsApp a `Hablemos`.
- Reemplazar textos del hero por el titular y descripción aprobados.
- Cambiar CTAs del hero a `#soluciones` y `#contacto` sin crear rutas ni comportamiento nuevo.
- Ajustar solo estilos de header y hero para jerarquía, alineación, lectura y responsive.

## Fuera de alcance

- S02–S10, proceso de siete pasos, catálogo, `/cv/`, paleta, JavaScript, backend, dependencias, infraestructura o despliegue.

## Criterios de aceptación

- Monograma, nombre y descriptor visibles sin afectar el menú móvil.
- Hero conserva el diagrama existente y usa exactamente el titular y descripción aprobados.
- No hay desborde ni superposición a 360, 390, 768 y 1440 px.
- No cambian enlaces de navegación existentes, salvo los CTAs del hero según el alcance.
- El diff se limita al header, hero y esta spec.
