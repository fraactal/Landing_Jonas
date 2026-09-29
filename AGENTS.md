# AGENTS.md — JonathanValdes.com

## 1. Propósito

Este repositorio implementa la nueva landing comercial de `jonathanvaldes.com`.

Objetivo principal:

> Generar conversaciones comerciales cualificadas con personas y organizaciones que tengan problemas tecnológicos reales que puedan resolverse mediante desarrollo, automatización, integraciones, cloud, QA, datos, monitoreo u otras soluciones tecnológicas.

Este proyecto NO es principalmente un CV ni un portafolio de búsqueda laboral.

El sitio profesional anterior se conservará en `/cv` y no debe formar parte del funnel comercial.

## 2. Metodología obligatoria

Trabajar con **Spec-Driven Development (SDD)**.

Reglas:
1. No implementar funcionalidades sin una especificación previa.
2. Trabajar módulo por módulo.
3. Cada spec debe definir objetivo, alcance, criterios de aceptación y fuera de alcance.
4. Finalizar un módulo antes de comenzar el siguiente.
5. Hacer cambios acotados al módulo activo.
6. No adelantar funcionalidades futuras.
7. No hacer refactorizaciones generales fuera de alcance.
8. Documentar deuda técnica no bloqueante.
9. Validaciones mínimas durante desarrollo.
10. Suite completa, hardening, seguridad y revisión integral al final.
11. No hacer push.
12. No hacer merge.
13. No crear tags salvo instrucción explícita.
14. No desplegar salvo instrucción explícita.
15. No cambiar decisiones arquitectónicas aprobadas sin documentar la necesidad.

## 3. Fuentes de verdad

Leer y respetar:
- `FASE-01-oferta-comercial.md`
- `FASE-02-arquitectura-jonathanvaldes.md`
- `FASE-03-copy-conversion-jonathanvaldes.md`
- `FASE-04-diseno-wireframe.md`
- spec del módulo activo.

Prioridad ante conflictos:
1. instrucción explícita más reciente del usuario;
2. spec activa;
3. documentos de fase;
4. este `AGENTS.md`;
5. implementación existente.

No reinterpretar decisiones aprobadas por preferencia personal.

## 4. Principios del producto

### Problema antes que tecnología
Hablar primero del problema del cliente. Las tecnologías son evidencia y herramientas.

### Conversión
CTA principales:
- `Háblanos hoy`
- `Agenda hoy mismo`

CTA contextuales:
- `Cuéntame tu caso`
- `Evaluar mi proyecto`

No introducir variantes innecesarias.

### Voz
Usar `nosotros` para método, proceso, solución y ejecución.
Usar `yo` solo cuando Jonathan habla de sí mismo o del trabajo directo con el cliente.
No fingir una empresa o equipo que no existe.

### Transparencia
No prometer resultados no demostrables.
No presentar una PoC/demo como producto gratuito automático.

## 5. Arquitectura aprobada

Frontend V1 preferentemente estática:
- HTML;
- CSS;
- JavaScript liviano.

No introducir React, Vue, Next.js, Astro u otro framework salvo necesidad explícita aprobada.

Hosting:
`Cloudflare DNS → CloudFront → S3`

Backend futuro:
`Frontend → Lambda Function URL → Lambda → SES / DynamoDB / Google Calendar API / Meet`

API Gateway NO forma parte de V1 salvo necesidad futura documentada.

No usar EC2 permanente para landing ni reservas.

No usar SQLite sobre S3 como base transaccional.

## 6. Rutas previstas

- `/` landing comercial
- `/privacidad/`
- `/terminos/`
- `/cv/` sitio profesional anterior

`/cv` debe conservarse, no enlazarse desde la landing y usarse solo cuando Jonathan comparte esa URL directamente.

## 7. Diseño aprobado

Dirección: Minimalista tecnológico premium.

Colores:
- `#0B0D10` fondo
- `#12161C` superficie
- `#F4F6F8` texto
- `#9AA4B2` texto secundario
- `#4F7CFF` acento
- `#8BA7FF` acento suave
- `#242A33` bordes

Tipografía:
- Manrope — títulos
- Inter — cuerpo

Componentes:
- bordes finos;
- cards oscuras;
- radios moderados;
- sombras mínimas;
- un solo acento dominante;
- iconos lineales;
- sin emojis en UI final.

## 8. Orden de la landing

No alterar sin spec:
1. Navbar
2. Hero
3. ¿Tu problema es...?
4. Selector de problemas
5. Servicios
6. Cómo trabajamos
7. Demo / PoC
8. Casos / ejemplos
9. Sobre mí
10. FAQ
11. CTA final
12. Footer

## 9. Interacciones aprobadas

Máximo tres interacciones visuales principales:
1. Texto dinámico “¿Tu problema es...?”
2. Selector interactivo de problemas.
3. Sticky scrollytelling en “Cómo trabajamos”.

Interacción secundaria:
4. FAQ accordion.

No agregar sliders, carruseles, 3D, WebGL, video background, parallax decorativo ni animaciones complejas sin spec explícita.

## 10. Sticky scrollytelling

Solo para “Cómo trabajamos”.

Pasos:
1. Entendemos
2. Analizamos
3. Proponemos
4. Validamos
5. Definimos
6. Construimos
7. Acompañamos

Desktop:
- sticky;
- progreso visible;
- transición de paso con scroll.

Mobile:
- fallback lineal o versión simplificada;
- priorizar accesibilidad.

Respetar `prefers-reduced-motion`.

## 11. FAQ

Accordion accesible:
- pregunta visible;
- respuesta oculta inicialmente;
- click/teclado;
- `aria-expanded`;
- relación control/panel;
- transición 200–300 ms;
- sin JS innecesario.

## 12. Performance

- JavaScript mínimo;
- HTML semántico;
- CSS limpio;
- SVG para diagramas;
- lazy loading;
- imágenes WebP/AVIF cuando corresponda;
- no instalar librerías para efectos resolubles con CSS/JS nativo;
- cuidar LCP, CLS e INP;
- evitar layout shifts.

## 13. Accesibilidad

Obligatorio:
- mobile first;
- navegación por teclado;
- focus visible;
- contraste suficiente;
- `prefers-reduced-motion`;
- HTML semántico;
- ARIA solo donde corresponda;
- alt text;
- botones y enlaces semánticos;
- labels reales en formularios.

## 14. SEO

Preparar desde V1:
- `<title>`;
- meta description;
- canonical;
- OpenGraph;
- metadata social;
- `robots.txt`;
- `sitemap.xml`;
- structured data cuando corresponda;
- headings semánticos;
- URLs limpias.

No hacer keyword stuffing.

## 15. Seguridad

No implementar secretos en frontend.

Nunca exponer credenciales AWS, tokens, claves Google, secretos SES o claves privadas.

En backend futuro:
- validación server-side;
- sanitización;
- CORS restringido;
- límites de payload;
- antispam;
- rate limiting cuando corresponda;
- mínimo privilegio IAM;
- secretos protegidos.

## 16. Datos y analytics

No crear tracking excesivo.

Eventos relevantes futuros:
- `click_whatsapp`
- `problem_selected`
- `booking_started`
- `booking_completed`
- `form_started`
- `form_submitted`

No registrar movimientos de mouse o scroll granular mediante backend propio.
No mostrar contador público de visitas en V1.

## 17. Footer

Versión inicial:

```text
Jonathan Valdés

Tecnología para convertir problemas, procesos e ideas
en soluciones que funcionan.

WhatsApp · Email

Privacidad · Términos de servicio

© 2026 Jonathan Valdés. Todos los derechos reservados.
```

No inventar emails ni números.

Hasta que exista configuración real:
- usar placeholders controlados;
- no publicar valores ficticios.

Correo objetivo futuro:
`info@jonathanvaldes.com`

## 18. Contenido

No inventar:
- clientes;
- testimonios;
- métricas;
- ahorros;
- resultados;
- certificaciones;
- casos comerciales.

Los ejemplos pueden marcarse como:
- Proyecto;
- Caso de estudio;
- Demo tecnológica.

## 19. Git

Antes de modificar:
`git status --short --branch`

No asumir branch limpia.
No borrar cambios del usuario.

Commits:
- uno por módulo completo;
- mensaje claro;
- no commit parcial salvo instrucción.

No push.
No merge.

## 20. Validación durante implementación

Por defecto:
- validaciones mínimas y rápidas;
- no ejecutar suites largas sin necesidad;
- no desplegar;
- no ejecutar auditorías extensas en cada módulo.

Al finalizar el proyecto:
- revisión responsive;
- performance;
- accesibilidad;
- SEO;
- seguridad;
- links;
- formularios;
- navegadores principales;
- hardening.

## 21. Regla de bloqueo

Si una implementación exige cambiar una decisión aprobada:
1. detener ese cambio;
2. documentar el motivo;
3. proponer alternativa;
4. no aplicar cambio arquitectónico sin aprobación.

Si el mismo tipo de error/corrección se repite aproximadamente 5 veces:
- detener el enfoque;
- explicar la causa probable;
- proponer una alternativa más simple.

## 22. Criterio de calidad

Antes de declarar un módulo terminado:
- cumplir la spec activa;
- no introducir funcionalidades futuras;
- no romper rutas existentes;
- responsive básico;
- accesibilidad razonable;
- sin errores de consola evidentes;
- sin secretos;
- cambios acotados;
- documentación actualizada si corresponde.

## 23. Objetivo final

La experiencia debe hacer sentir al visitante:

> “Tengo un problema tecnológico. Puedo contarles mi caso, evaluarlo con Jonathan y decidir si vale la pena construir una solución.”

La implementación debe ser clara, rápida, profesional, elegante, mantenible y proporcional al problema.

No buscar perfección antes de validar el negocio.
