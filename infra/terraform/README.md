# Terraform - Lead Capture Backend

Infraestructura para el backend V1 de leads de `jonathanvaldes.com`.

## Recursos

- DynamoDB table `jonathanvaldes-leads` en modo `PAY_PER_REQUEST`.
- IAM role para Lambda.
- IAM policy mínima con `dynamodb:PutItem` sobre la tabla concreta.
- IAM policy mínima con `ses:SendEmail` sobre la identidad SES del dominio.
- Lambda Python para recepción de leads.
- Lambda Function URL con `AuthType = NONE` y CORS restringido.
- SES domain identity para `jonathanvaldes.com`.
- Easy DKIM tokens para configuración DNS posterior.

No crea:

- API Gateway;
- Cloudflare DNS records;
- S3 para leads;
- adjuntos;
- WAF;
- CAPTCHA;
- Calendar/Meet;
- analytics.

## Packaging

Desde la raíz del repo:

```powershell
python backend/lead_api/package_lambda.py
```

Esto crea `build/lead_api.zip`, ignorado por Git.

## Variables

- `lead_notification_to`: destino operativo interno. V1 usa `jonathan.valdes.o@gmail.com` como configuración, no como branding público.
- `lead_notification_from`: remitente técnico SES, por defecto `notificaciones@jonathanvaldes.com`.
- `ses_domain_identity`: dominio a verificar en SES, por defecto `jonathanvaldes.com`.
- `allowed_origins`: orígenes permitidos para la Function URL.

## SES y DNS

Terraform define la identidad SES del dominio y expone outputs para verificación/DKIM.

Los registros DNS deben publicarse posteriormente en Cloudflare en un paso controlado. Este módulo no modifica Cloudflare ni inventa registros manuales.

Outputs relevantes:

- `ses_identity_domain`;
- `ses_domain_verification_token`;
- `ses_dkim_tokens`;
- `ses_dkim_cname_records`.

## SPF / DMARC

Antes de madurez productiva se debe revisar:

- DKIM;
- SPF según la configuración real de envío;
- DMARC sin aplicar una política agresiva automáticamente.

No agregar registros TXT no validados.

## SES sandbox

SES sandbox es regional. En sandbox solo se puede enviar desde y hacia identidades verificadas. El destino operativo puede requerir verificación durante pruebas, y production access debe evaluarse antes de producción abierta.

## Validación local

```powershell
terraform fmt -check
```

`terraform validate` requiere `terraform init` para descargar el provider AWS si no está inicializado. No ejecutar `terraform apply`, deploy, verificaciones SES reales ni cambios DNS sin instrucción explícita.

## CORS

El origen productivo por defecto es:

```text
https://jonathanvaldes.com
```

Para desarrollo local, usar un archivo `terraform.tfvars` no versionado o variables de entorno, por ejemplo:

```hcl
allowed_origins = [
  "https://jonathanvaldes.com",
  "http://localhost:3000"
]
```

No usar wildcard en producción.