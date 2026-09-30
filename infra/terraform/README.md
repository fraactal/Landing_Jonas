# Terraform - Lead Capture Backend

Infraestructura M19 para el backend V1 de leads de `jonathanvaldes.com`.

## Recursos

- DynamoDB table `jonathanvaldes-leads` en modo `PAY_PER_REQUEST`.
- IAM role para Lambda.
- IAM policy mínima con `dynamodb:PutItem` sobre la tabla concreta.
- Lambda Python para recepción de leads.
- Lambda Function URL con `AuthType = NONE` y CORS restringido.

No crea:

- API Gateway;
- SES;
- S3 para leads;
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

## Validación local

```powershell
terraform fmt -check
```

`terraform validate` requiere `terraform init` para descargar el provider AWS si no está inicializado. No ejecutar `terraform apply` ni deploy sin instrucción explícita.

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