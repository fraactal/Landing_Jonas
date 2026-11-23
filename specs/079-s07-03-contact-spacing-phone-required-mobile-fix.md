# Spec 079 - S07.03: Contacto con más aire, teléfono obligatorio y formulario sin desbordes en móvil

Estado: Implementada.

- Escritorio: la columna de texto del contacto (título, bajada, botón de WhatsApp, correo y puntos) gana espaciado y tamaño de texto. El formulario no cambia.
- Teléfono obligatorio (8 a 15 dígitos, formato libre con +, espacios, paréntesis y guiones), junto con nombre y email, con mensaje de error propio.
- Móvil: el formulario ya no se ensancha por el widget de Turnstile; en contenedores de menos de 300 px el widget usa su tamaño compacto.
- La Lambda no se modifica: sigue sin exigir teléfono (la validación obligatoria es del formulario).
