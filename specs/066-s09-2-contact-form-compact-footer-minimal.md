# Spec 066 - S09.2: Formulario compacto y footer móvil mínimo

Estado: Implementada.

## Objetivo
- Alinear y compactar el formulario web (PC y móvil) y acortar los textos.
- Footer móvil mínimo (opción A): marca, tagline, teléfono y correo como texto, enlaces legales y copyright. PC se mantiene en 4 columnas.

## Cambios
- Causa de la desalineación: los `<p>` de error vacíos de Nombre/Email añadían espacio; ahora `:empty { display: none }`.
- Inputs 2.75rem, textarea 4 filas, panel con menos padding; checkbox alineado con su texto.
- Móvil: se oculta el título del formulario (queda para lectores de pantalla), el texto de ayuda y la nota inferior.
- Textos: "Cuéntame qué quieres resolver y definimos el siguiente paso." / "Cuéntame tu caso" / "Qué ocurre y qué resultado esperas. No necesitas definir la solución." / "Si el envío falla, abrimos WhatsApp con tu mensaje."
- Footer: número +56 9 3136 7372 en lugar de "WhatsApp"; sin secciones ni "Volver arriba" en móvil.

## Aceptación
Campos Nombre, Empresa, Email, Teléfono, ¿Qué necesitas resolver? y mensaje intactos; sin scroll horizontal en 390 px.
