# FASE 2 — Arquitectura de JonathanValdes.com

**Proyecto:** JonathanValdes.com — Captación de clientes para servicios tecnológicos  
**Estado:** CERRADA / APROBADA  
**Objetivo:** Definir la arquitectura funcional, técnica y de conversión antes de escribir el copy definitivo o implementar.

## 1. Principio arquitectónico

> Serverless primero y complejidad solo cuando sea necesaria.

La V1 debe ser simple, rápida, económica, segura y fácil de mantener.

Se evita sobrearquitectura y servicios permanentes cuando no son necesarios.

## 2. Separación de audiencias

### Landing comercial
**URL:** `https://jonathanvaldes.com/`

Objetivo: captar clientes y convertir visitas en conversaciones comerciales.

### CV / portafolio profesional
**URL:** `https://jonathanvaldes.com/cv`

Objetivo: uso exclusivo para procesos laborales, entrevistas y reclutadores.

Reglas:

- `/cv` se conserva como respaldo del sitio existente.
- `/cv` NO se enlaza desde la landing comercial.
- No aparece en navbar, footer ni CTA comerciales.
- Jonathan podrá compartir esa URL directamente cuando lo estime conveniente.

## 3. Respaldo del sitio existente

Antes de reemplazar la home:

1. Inventariar el sitio existente.
2. Documentar despliegue e infraestructura actuales.
3. Crear respaldo Git/branch/tag antes de modificaciones.
4. Conservar assets y configuración necesaria.
5. Migrar el portafolio actual a `/cv`.
6. Verificar que `/cv` funciona correctamente.
7. Recién después publicar la nueva landing en `/`.

No se debe destruir ni sobrescribir el sitio existente sin respaldo verificable.

## 4. Arquitectura web

La V1 será preferentemente estática:

- HTML
- CSS
- JavaScript liviano

No se agregará React u otro framework solo por disponibilidad técnica. Un framework se utilizará únicamente si aporta una ventaja concreta.

Prioridades:

- mobile first;
- carga rápida;
- SEO;
- accesibilidad;
- JavaScript mínimo;
- mantenimiento simple.

## 5. Infraestructura objetivo

Arquitectura principal:

```text
Internet
   |
Cloudflare
   |
CloudFront
   |
S3
   |
Landing
```

S3 aloja:

- landing;
- assets;
- contenido estático;
- `/cv`;
- archivos estáticos asociados.

CloudFront entrega contenido y caching.

Cloudflare mantiene DNS del dominio.

## 6. Estructura comercial de la landing

Orden conceptual:

1. Navbar
2. Hero
3. Problemas / dolores
4. Soluciones
5. Cómo trabajamos
6. Demo / validación
7. Proyectos / casos
8. Tecnologías como respaldo
9. Sobre el profesional/equipo
10. CTA final
11. Contacto
12. Footer

No se enlazará el CV.

## 7. Conversión

La V1 tendrá dos CTA principales:

### WhatsApp
Objetivo: conversación inmediata.

El enlace debe poder iniciar un mensaje prellenado, por ejemplo:

> Hola Jonathan, llegué desde jonathanvaldes.com. Tengo un proyecto o problema que me gustaría evaluar.

### Agendar conversación
Objetivo: reservar una conversación inicial de aproximadamente 30 minutos.

Nombre sugerido del evento:

> Diagnóstico tecnológico

La reserva debe poder evolucionar a un sistema propio y serverless.

## 8. Sistema de reservas serverless

No se mantendrá una EC2 encendida exclusivamente para reservas.

Flujo objetivo:

```text
Landing
  |
Selector de fecha/hora
  |
Lambda Function URL
  |
Lambda
  |---- Google Calendar API
  |          |
  |       Google Meet
  |
  |---- DynamoDB
  |
  |---- SES
```

Responsabilidades:

- consultar disponibilidad;
- validar horario solicitado;
- evitar doble reserva;
- crear evento;
- crear Google Meet cuando corresponda;
- guardar información mínima de la reserva;
- enviar confirmación por correo.

Google Calendar se integra mediante su API.

## 9. Backend V1

### Decisión

No usar API Gateway inicialmente.

Se utilizará:

> AWS Lambda Function URL

Razón:

- pocas operaciones;
- menor complejidad;
- sin costo adicional específico por el endpoint Function URL;
- pago normal de Lambda por uso;
- suficiente para la V1.

Operaciones previstas:

- contacto;
- disponibilidad;
- reserva;
- métricas comerciales puntuales.

La separación en múltiples Lambdas se evaluará cuando exista una razón concreta. Inicialmente se favorece una implementación simple.

## 10. Criterio de evolución hacia API Gateway

API Gateway queda documentado como evolución futura, no requisito de V1.

Se considerará si aparecen necesidades como:

- muchas rutas;
- API pública para terceros;
- autenticación avanzada;
- API keys;
- distintos consumidores;
- stages;
- rate limiting diferenciado;
- WebSockets;
- versionado formal;
- políticas empresariales específicas.

## 11. Persistencia

### No usar SQLite sobre S3 como base transaccional

S3 es almacenamiento de objetos y no debe utilizarse como filesystem de una base SQLite concurrente para leads o reservas.

### S3
Usos:

- sitio;
- assets;
- datos estáticos;
- exports;
- futuros datasets/archivos analíticos.

### DynamoDB
Usos previstos:

- leads;
- reservas;
- métricas comerciales pequeñas;
- eventual CRM-lite.

Se prioriza On-Demand en la etapa inicial por su modelo serverless y pago por uso.

## 12. Contacto

Flujo:

```text
Formulario
   |
Lambda Function URL
   |
Lambda
   |---- validación
   |---- sanitización
   |---- control antispam
   |
SES
   |
Correo
```

No se agregará una base de datos si no es necesaria para la primera versión, aunque DynamoDB queda disponible para almacenar leads si aporta valor.

## 13. Analítica y métricas

### Métricas internas

Se medirán al menos:

- visitas;
- fuente de tráfico;
- dispositivo;
- click en WhatsApp;
- inicio de reserva;
- reserva completada;
- inicio de formulario;
- formulario enviado;
- interacción con proyectos/servicios cuando sea útil.

### Contador visible

Es técnicamente posible implementar un contador público, pero:

> No se mostrará inicialmente.

Razón: un número pequeño de visitas no aporta credibilidad y puede generar el efecto contrario.

Primero se recopilarán métricas internamente.

### Principio

No utilizar Lambda/DynamoDB para registrar eventos irrelevantes como scroll o movimiento del mouse.

Se reservará el backend propio para eventos comerciales de alto valor.

## 14. Evolución Data / Analytics

La arquitectura queda preparada para crecer:

```text
DynamoDB / fuentes
       |
       S3
       |
      Glue
       |
     Athena
       |
Power BI / QuickSight
```

Esto puede convertirse más adelante en un caso real de Data & BI del propio negocio.

## 15. SEO

Requisitos desde V1:

- title;
- meta description;
- canonical;
- OpenGraph;
- metadata social;
- robots.txt;
- sitemap.xml;
- structured data cuando corresponda;
- HTML semántico;
- URLs simples.

La estrategia SEO debe ser natural y basada en problemas/servicios, evitando saturación de keywords.

## 16. Performance

Objetivos:

- sitio estático;
- imágenes optimizadas WebP/AVIF cuando corresponda;
- lazy loading;
- CSS liviano;
- JavaScript mínimo;
- caching CloudFront;
- fuentes optimizadas;
- mobile first.

## 17. Seguridad

La implementación completa se realizará en la Fase 7, pero la arquitectura debe contemplarla desde el inicio.

Controles previstos:

- HTTPS;
- CORS restringido;
- validación server-side;
- sanitización;
- límite de payload;
- honeypot y/o CAPTCHA;
- control de abuso/rate limiting;
- logs;
- alertas;
- IAM con mínimo privilegio;
- secretos fuera del frontend;
- credenciales de Google y AWS nunca expuestas en JavaScript;
- headers de seguridad;
- CSP;
- HSTS;
- X-Content-Type-Options;
- Referrer-Policy.

La Function URL será pública cuando deba ser consumida por el navegador, por lo que conocer la URL nunca se considerará un mecanismo de seguridad.

## 18. Demo en la landing

La landing sí comunicará la posibilidad de demo/PoC, pero no especificará límites técnicos rígidos.

Texto conceptual:

> Cuando el problema lo permite, podemos construir una prueba de concepto acotada para validar la solución propuesta. El alcance se define después de la conversación inicial y no implica el desarrollo completo del proyecto.

Aclaración:

> Sujeta a evaluación técnica y alcance.

Las condiciones detalladas se definirán en el playbook comercial de fases posteriores.

## 19. Decisiones descartadas para V1

- EC2 permanente para la landing.
- EC2 permanente para reservas.
- SQLite dentro de S3 como base transaccional.
- API Gateway sin necesidad concreta.
- backend tradicional siempre encendido.
- mostrar contador público de visitas desde el lanzamiento.
- enlazar `/cv` desde la landing.
- frameworks pesados sin beneficio claro.
- tracking excesivo mediante Lambda.

## 20. Arquitectura consolidada

```text
                         Internet
                            |
                        Cloudflare
                            |
                        CloudFront
                            |
                            S3
                            |
                          Landing
                            |
          +-----------------+-----------------+
          |                 |                 |
       WhatsApp         Formulario          Agenda
                            |                 |
                            +--------+--------+
                                     |
                           Lambda Function URL
                                     |
                                   Lambda
                       +-------------+-------------+
                       |             |             |
                      SES         DynamoDB    Google Calendar
                                                   |
                                              Google Meet
```

Ruta separada:

```text
jonathanvaldes.com/cv
        |
Portafolio profesional existente
        |
No forma parte del funnel comercial
```

## 21. Criterio de éxito de la Fase 2

La fase está cerrada cuando podemos responder con claridad:

- qué ocurre con el sitio existente;
- cuál es el propósito de `/` y `/cv`;
- dónde se aloja la V1;
- cómo contacta el prospecto;
- cómo reserva una reunión;
- dónde se guardan leads/reservas;
- cómo enviamos correos;
- cómo medimos conversiones;
- cómo evitamos EC2 permanente;
- cuándo sería justificable incorporar API Gateway;
- cómo queda preparada la solución para escalar.

**Estado final:** APROBADA.
