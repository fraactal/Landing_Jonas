# Lead API

Backend V1 para recibir leads del formulario de `jonathanvaldes.com` mediante AWS Lambda Function URL y persistirlos en DynamoDB.

## Alcance M19

Implementa localmente:

- handler Lambda Python;
- validación backend estricta;
- generación de `leadId` UUID v4;
- timestamp UTC;
- escritura en DynamoDB con `PutItem` condicional;
- respuestas JSON;
- CORS restringido mediante Terraform;
- tests unitarios con `unittest`.

No implementa:

- SES;
- envío de correos;
- conexión del formulario frontend mediante `fetch()`;
- Calendar/Meet;
- analytics;
- adjuntos/S3;
- API Gateway;
- deploy.

## Variables de entorno

- `LEADS_TABLE_NAME`: nombre de la tabla DynamoDB de leads.
- `ALLOWED_ORIGINS`: lista separada por coma para CORS en respuestas del handler. Producción debe usar `https://jonathanvaldes.com`.
- `ENVIRONMENT`: nombre del ambiente (`production`, `staging`, `local`, etc.).

M19 no requiere secretos.

## Contrato

Método permitido: `POST`.

Payload:

```json
{
  "action": "createLead",
  "name": "Juan Pérez",
  "company": "Empresa ABC",
  "email": "juan@empresa.cl",
  "phone": "+56...",
  "problemType": "Automatizar un proceso",
  "message": "Hoy realizamos...",
  "privacyAccepted": true,
  "source": "website",
  "sourceContext": "final-cta",
  "website": ""
}
```

`website` es honeypot y no se persiste.

## Persistencia

Se guardan únicamente:

- `leadId`;
- `createdAt`;
- `name`;
- `company` si viene con contenido;
- `email`;
- `phone` si viene con contenido;
- `problemType`;
- `message`;
- `privacyAccepted`;
- `source`;
- `sourceContext`;
- `status`.

No se guardan headers completos, IP, User-Agent completo, cookies, tokens ni honeypot.

## Tests locales

Desde la raíz del repo:

```powershell
python -m unittest discover -s backend/tests
```

Los tests mockean DynamoDB. No ejecutan llamadas AWS reales.

## Packaging local

La infraestructura Terraform espera un zip local en `build/lead_api.zip` por defecto.

Crear el paquete sin Docker ni dependencias externas:

```powershell
python backend/lead_api/package_lambda.py
```

No ejecutar deploy ni `terraform apply` sin una spec e instrucción explícita.

## SES futuro

Flujo futuro:

```text
DynamoDB persisted
        ↓
future M20
        ↓
SES
        ↓
jonathan.valdes.o@gmail.com
```

SES no existe en M19 y el Gmail no debe aparecer en frontend.