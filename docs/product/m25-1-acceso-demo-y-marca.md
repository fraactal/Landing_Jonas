# M25.1 — Acceso futuro a demos y evolución de marca

## Contrato de API futuro: acceso a demostraciones

No existe endpoint ni almacenamiento en M25.1. Cuando se implemente, el frontend deberá enviar una solicitud explícita a una Lambda Function URL con un contrato equivalente a:

```json
{
  "action": "requestDemoAccess",
  "email": "persona@empresa.cl",
  "productInterest": "vesta-2",
  "commercialConsent": false,
  "privacyAccepted": true,
  "source": "website",
  "website": ""
}
```

Requisitos del backend futuro:

- validar y normalizar el correo en servidor;
- restringir `productInterest` a valores permitidos;
- evitar duplicados por combinación de correo y producto;
- registrar fecha de solicitud y consentimiento comercial separado;
- guardar solo datos mínimos en una persistencia apropiada, nunca archivos estáticos;
- confirmar autorización mediante token firmado y con expiración antes de emitir acceso;
- no usar `localStorage` como autenticación ni exponer URLs privadas;
- limitar abuso, sanitizar logs y aplicar CORS solo al dominio de producción.

La experiencia para aplicaciones públicas seguirá siendo acceso directo. Una invitación opcional a dejar correo requiere una spec propia, consentimiento claro y una infraestructura real antes de activarse.

## Separación futura de marca

JonathanValdes.com permanece como canal principal y personal: presenta el trabajo directo con Jonathan y los servicios tecnológicos. Conectiva no se adopta todavía como marca corporativa, razón social ni reemplazo de dominio.

Si una marca de servicios se formaliza posteriormente, se debe definir una arquitectura de marca, titularidad, dominios, aviso legal, datos de contacto, autorización de referencias y migración de contenido. Ninguno de esos cambios forma parte de M25.1.
