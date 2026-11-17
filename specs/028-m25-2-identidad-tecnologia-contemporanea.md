# Spec 028 - M25.2: identidad Tecnología contemporánea

Estado: Implementada.

## Objetivo

Sustituir la identidad visual de M25.1 por la paleta Tecnología contemporánea y dar ritmo mediante superficies diferenciadas, sin modificar contenido, estructura, interacciones ni arquitectura.

## Alcance

- Centralizar tokens para gris hielo, blanco, azul noche, azul eléctrico y turquesa, incluidos estados derivados accesibles.
- Refinar apariencia de botones, tarjetas, bordes, sombras, campos, enlaces y estados de foco/deshabilitado.
- Aplicar superficies visuales a header, hero, selector, servicios, PoC, catálogo, perfil, FAQ, contacto y footer.
- Mantener el proceso de siete pasos intacto en estructura, comportamiento, JavaScript y CSS específico; su mecánica no se altera.

## Fuera de alcance

- Cambios en textos, URLs, catálogo, DOM, JavaScript, `/cv/`, infraestructura, backend, captación de correos o dependencias.
- Nuevas animaciones, efectos visuales pesados o rediseños de flujo.

## Criterios de aceptación

- Los tokens usan como bases `#F3F6F9`, `#FFFFFF`, `#182B3D`, `#3268A8` y `#20A6A0`.
- Las superficies generan contraste entre secciones sin divisores decorativos adicionales.
- Textos y controles principales cumplen contraste AA aplicable.
- El catálogo conserva todos sus grupos, textos, URLs y estados.
- No hay cambios en `/cv/`, HTML ni JavaScript.
- No hay desborde horizontal en 360, 390, 768 y 1440 píxeles.

## Deuda técnica no bloqueante

- La revisión visual específica del proceso de siete pasos se mantiene como módulo posterior independiente.
