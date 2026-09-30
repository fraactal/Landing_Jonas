# Spec 013 - Legal Pages

Estado: Implementada.

## 1. Objetivo

Definir las paginas legales minimas de `jonathanvaldes.com` para acompanar la primera version publica de la landing comercial, sin sobredimensionar obligaciones ni declarar funcionalidades que todavia no existen.

Las paginas previstas son:

- `/privacidad`
- `/terminos`

El objetivo es entregar textos claros, proporcionales y compatibles con el estado actual del sitio: una landing estatica, sin formulario operativo, sin WhatsApp conectado, sin agenda conectada, sin analytics, sin backend, sin pagos y sin cuentas de usuario.

## 2. Contexto

La landing comercial actual presenta servicios de desarrollo, automatizacion, integraciones, cloud, datos, QA y monitoreo. Los CTAs existentes son placeholders controlados hasta que se implemente contacto real.

La arquitectura aprobada para esta fase es un sitio estatico en HTML, CSS y JavaScript minimo, con despliegue futuro compatible con S3/CloudFront. La fuente de verdad arquitectonica sigue siendo la Fase 2. Cualquier configuracion legacy del sitio anterior queda fuera de esta spec y no debe reutilizarse automaticamente.

## 3. Alcance

Esta spec define:

- Arquitectura de rutas para `/privacidad` y `/terminos`.
- Estructura y copy base para Politica de privacidad.
- Estructura y copy base para Terminos de servicio.
- Tratamiento explicito del estado actual versus funciones futuras.
- Criterios de diseno, responsive, accesibilidad, SEO y performance.
- Archivos previstos para la implementacion.
- Riesgos y deuda tecnica no bloqueante.
- Validaciones minimas.

## 4. Fuera de alcance

No se incluye en esta spec:

- Cookie banner.
- CMP o gestion avanzada de consentimiento.
- Politica de cookies independiente.
- Analytics o tracking.
- Formularios reales.
- WhatsApp real.
- Agenda real.
- Backend.
- Pagos.
- Cuentas de usuario.
- Contratos comerciales.
- Cotizaciones.
- Generacion de documentos legales definitivos.
- Spec 014 o modulos posteriores.

## 5. Arquitectura de rutas

La implementacion debe usar rutas compatibles con hosting estatico:

- `privacidad/index.html`
- `terminos/index.html`

Las URLs publicas esperadas son:

- `/privacidad`
- `/terminos`

Para compatibilidad con S3/CloudFront, se acepta que los enlaces usen la variante con slash final (`/privacidad/` y `/terminos/`) siempre que resuelvan como clean URLs y mantengan canonical coherente.

La landing principal debe enlazar estas paginas desde el footer:

- `Privacidad` hacia `/privacidad`
- `Terminos de servicio` hacia `/terminos`

No se deben modificar otros enlaces ni crear navegacion legal compleja.

## 6. Privacidad - estructura

La pagina de privacidad debe incluir:

1. Identidad.
2. Datos tratados actualmente.
3. Datos de contacto futuros.
4. Finalidades.
5. Conservacion.
6. Comparticion con terceros.
7. Seguridad.
8. Derechos de las personas.
9. Cambios en esta politica.
10. Contacto futuro.

Debe mantenerse breve, clara y comprensible. La extension recomendada para el texto final es menor a 1200 palabras.

## 7. Privacidad - copy propuesto

### Titulo

Politica de privacidad

### Ultima actualizacion

Ultima actualizacion: [fecha de publicacion]

### Introduccion

Esta Politica de privacidad explica como `jonathanvaldes.com` trata informacion relacionada con las personas que visitan el sitio o que, en el futuro, contacten a Jonathan Valdes a traves de los canales habilitados.

Actualmente el sitio funciona como una landing informativa estatica. No cuenta con formulario operativo, agenda conectada, WhatsApp conectado, cuentas de usuario, pagos, backend propio ni analytics configurado deliberadamente.

### 1. Identidad

Este sitio corresponde a Jonathan Valdes y se publica bajo el dominio `jonathanvaldes.com`.

### 2. Datos tratados actualmente

En el estado actual del sitio, no solicitamos datos personales mediante formularios, cuentas, pagos o sistemas de contacto conectados.

Como parte del funcionamiento tecnico normal de un sitio web, los proveedores de hosting, CDN o infraestructura pueden procesar datos tecnicos de navegacion, como direccion IP, fecha y hora de acceso, pagina solicitada, tipo de navegador, sistema operativo o registros tecnicos similares. Estos datos se utilizan para entregar el sitio, mantener seguridad basica, diagnosticar errores y operar la infraestructura.

No usamos deliberadamente cookies comerciales, perfiles publicitarios ni analytics en esta version del sitio.

### 3. Datos de contacto futuros

Cuando se habiliten canales reales de contacto, el sitio podria solicitar o recibir informacion como nombre, correo electronico, telefono, mensaje y datos generales sobre el proyecto o problema que la persona quiera evaluar.

Estos datos solo deberian solicitarse cuando exista una funcionalidad activa y visible para ello.

### 4. Finalidades

La informacion que se reciba en el futuro podra usarse para responder consultas, evaluar proyectos, coordinar conversaciones, preparar propuestas, entregar servicios acordados y mantener comunicacion relacionada con una solicitud o relacion comercial.

Los datos tecnicos de navegacion pueden usarse para operar, proteger y mejorar el funcionamiento del sitio.

### 5. Conservacion

Los datos se conservaran durante el tiempo razonablemente necesario para cumplir la finalidad para la que fueron recibidos, responder solicitudes, mantener registros operativos o cumplir obligaciones aplicables.

No se establece en esta pagina un plazo legal especifico inventado. Los periodos definitivos deberan revisarse segun la operacion real y la normativa aplicable.

### 6. Comparticion con terceros

No vendemos datos personales.

La informacion podria ser tratada por proveedores tecnicos necesarios para operar el sitio, alojar infraestructura, entregar comunicaciones o prestar servicios relacionados. Estos proveedores deberian acceder solo a la informacion necesaria para cumplir su funcion.

### 7. Seguridad

Se aplicaran medidas razonables para proteger la informacion tratada por el sitio y sus canales asociados. Sin embargo, ningun sistema conectado a internet puede garantizar seguridad absoluta.

### 8. Derechos

Cuando corresponda, las personas podran solicitar acceso, correccion, actualizacion o eliminacion de sus datos personales, de acuerdo con la normativa aplicable y el contexto de la relacion existente.

### 9. Cambios en esta politica

Esta Politica de privacidad puede actualizarse cuando cambien las funcionalidades del sitio, los servicios ofrecidos o las obligaciones aplicables. La version publicada indicara su fecha de ultima actualizacion.

### 10. Contacto futuro

Cuando el canal de contacto este habilitado, las solicitudes relacionadas con privacidad podran enviarse al correo que se publique oficialmente en el sitio. El correo previsto para esa funcion es `info@jonathanvaldes.com`, pero no debe presentarse como canal activo hasta que la infraestructura correspondiente exista.

## 8. Terminos - estructura

La pagina de terminos debe incluir:

1. Proposito del sitio.
2. Informacion no contractual.
3. Evaluacion inicial.
4. Propuestas y acuerdos.
5. Pruebas de concepto.
6. Propiedad intelectual.
7. Disponibilidad del sitio.
8. Enlaces externos futuros.
9. Limitacion razonable.
10. Cambios.
11. Ley y jurisdiccion.

Debe evitar lenguaje extremo, abusivo o excesivamente legalista. La extension recomendada para el texto final es menor a 1200 palabras.

## 9. Terminos - copy propuesto

### Titulo

Terminos de servicio

### Ultima actualizacion

Ultima actualizacion: [fecha de publicacion]

### Introduccion

Estos Terminos de servicio regulan el uso informativo de `jonathanvaldes.com` y establecen criterios generales sobre la relacion comercial que podria iniciarse a partir de una consulta, evaluacion o propuesta.

Al usar este sitio, aceptas estos terminos en lo que resulte aplicable al uso del sitio. Cualquier proyecto, servicio o contratacion especifica debera acordarse por separado.

### 1. Proposito del sitio

`jonathanvaldes.com` presenta servicios profesionales relacionados con desarrollo de software, automatizacion, integraciones, cloud, datos, QA y monitoreo. Su finalidad es informar sobre capacidades, enfoque de trabajo y posibles formas de colaboracion.

### 2. Informacion no contractual

La informacion publicada en el sitio es general e informativa. No constituye una propuesta comercial vinculante, contrato, garantia de resultado ni compromiso de disponibilidad de servicios.

Los alcances, costos, plazos, entregables y condiciones de cada proyecto se definen caso a caso.

### 3. Evaluacion inicial

La evaluacion inicial de un problema o proyecto no genera por si sola una obligacion de contratar, ejecutar, reservar disponibilidad o entregar una solucion definitiva.

Su finalidad es entender el contexto, identificar alternativas y decidir si tiene sentido avanzar a una propuesta o siguiente etapa.

### 4. Propuestas y acuerdos

Cuando corresponda, cualquier propuesta comercial debera definir por separado alcance, entregables, responsabilidades, costos, plazos, condiciones de pago, supuestos y exclusiones relevantes.

Ningun contenido general del sitio reemplaza esos acuerdos especificos.

### 5. Pruebas de concepto

Cuando tenga sentido tecnicamente, se podra proponer una prueba de concepto acotada para validar una integracion, automatizacion, flujo de datos, dashboard, API o prototipo.

Una prueba de concepto no representa el desarrollo completo de un producto, no garantiza la ejecucion posterior del proyecto y no debe entenderse como desarrollo gratuito por defecto. Su alcance y condiciones deben acordarse previamente.

### 6. Propiedad intelectual

Los textos, estructura, diseno y contenido de este sitio pertenecen a Jonathan Valdes o se usan con autorizacion, salvo indicacion contraria.

La propiedad intelectual de entregables, codigo, documentacion, configuraciones u otros resultados de un proyecto futuro debera definirse expresamente en la propuesta o contrato correspondiente.

### 7. Disponibilidad del sitio

El sitio puede actualizarse, cambiar o estar temporalmente no disponible por mantenimiento, cambios tecnicos, fallas de infraestructura u otras razones operativas. No se garantiza disponibilidad absoluta o ininterrumpida.

### 8. Enlaces externos

En el futuro, el sitio podria incluir enlaces a servicios externos, herramientas de agenda, canales de contacto, repositorios, plataformas o recursos de terceros. Esos servicios tendran sus propias condiciones y politicas.

### 9. Limitacion razonable

El uso del sitio es responsabilidad de cada visitante. En la medida permitida por la normativa aplicable, no se respondera por danos indirectos, perdida de informacion, interrupciones o decisiones tomadas exclusivamente sobre la base de informacion general publicada en el sitio.

Esta limitacion no busca excluir responsabilidades que no puedan limitarse legalmente.

### 10. Cambios

Estos Terminos de servicio pueden actualizarse cuando cambien el sitio, los servicios, los canales de contacto o las condiciones operativas. La version publicada indicara su fecha de ultima actualizacion.

### 11. Ley y jurisdiccion

Estos terminos pueden contemplar la aplicacion de la normativa chilena y la competencia de tribunales chilenos, pero la redaccion definitiva debe validarse profesionalmente antes de uso comercial definitivo.

## 10. Estado actual vs funcionalidades futuras

La implementacion debe distinguir claramente entre el estado actual y funciones futuras.

Estado actual:

- Sitio estatico informativo.
- Sin formulario operativo.
- Sin WhatsApp conectado.
- Sin agenda conectada.
- Sin analytics.
- Sin backend.
- Sin pagos.
- Sin cuentas de usuario.
- Sin cookies comerciales deliberadas.

Funciones futuras posibles:

- Formulario de contacto.
- Email publicado.
- WhatsApp.
- Agenda.
- Analytics.
- Backend.
- Gestion de leads.

Las paginas legales no deben declarar como activas las funcionalidades futuras. Deben mencionarlas solo de manera condicional cuando sea necesario.

## 11. Disclaimer de revision legal

El contenido definido por esta spec es una base informativa inicial y no constituye asesoria legal. Antes de usarlo como documentacion comercial definitiva, debe ser revisado por una persona profesional competente segun la jurisdiccion y la operacion real del sitio.

La implementacion puede incluir este enfoque internamente en la spec, pero no necesariamente debe mostrar un disclaimer visible al usuario final si se decide que afectaria innecesariamente la experiencia publica. La necesidad de mostrarlo publicamente debe evaluarse antes de publicar la version final.

## 12. Navegacion

Durante la implementacion:

- El footer debe activar el enlace `Privacidad` hacia `/privacidad`.
- El footer debe activar el enlace `Terminos de servicio` hacia `/terminos`.
- Cada pagina legal debe incluir un enlace claro `Volver al inicio` hacia `/`.
- No se debe agregar la navegacion legal al navbar principal.
- No se debe enlazar `/cv`.

## 13. Diseno

Las paginas legales deben reutilizar el sistema visual existente:

- Fondo oscuro.
- Tipografia actual.
- `.container`.
- Links y focus visibles existentes.
- Boton o enlace sobrio para `Volver al inicio`.
- Ancho de lectura controlado.
- Espaciado amplio.
- Jerarquia clara de titulos.

No se debe crear una segunda identidad visual ni una plantilla legal ajena a la landing.

Se puede agregar CSS especifico minimo solo si el sistema actual no resuelve correctamente la lectura legal. Preferencia: reutilizar `base.css`, `components.css` y `sections.css` existentes.

## 14. Responsive

Las paginas deben ser mobile first:

- Lectura comoda en una columna.
- Sin overflow horizontal.
- Lineas de texto con ancho razonable en desktop.
- Espaciado suficiente entre secciones.
- Links tactiles faciles de usar.

## 15. Accesibilidad

Cada pagina legal debe cumplir:

- Un unico `h1`.
- Headings en orden logico.
- Links descriptivos.
- Focus visible.
- Contraste suficiente.
- Line length controlado.
- Contenido disponible sin JavaScript.
- Sin `aria-live` ni interacciones innecesarias.

## 16. SEO

Cada pagina debe incluir SEO simple:

- `title` unico.
- `meta description` especifica.
- `canonical` coherente con la URL publica.
- Idioma `es`.
- No se requieren datos estructurados en esta version.

Las paginas pueden ser indexables salvo que una decision posterior indique lo contrario.

## 17. Performance

La implementacion debe mantener:

- HTML + CSS.
- Sin JavaScript nuevo.
- Sin imagenes.
- Sin fuentes nuevas.
- Sin dependencias.
- Sin llamadas externas adicionales.

## 18. Criterios de aceptacion

La spec se considera implementada cuando:

- Existen las rutas `/privacidad` y `/terminos` mediante estructura compatible con hosting estatico.
- `privacidad/index.html` existe.
- `terminos/index.html` existe.
- El footer de la landing enlaza correctamente `Privacidad` y `Terminos de servicio`.
- Las paginas legales incluyen link `Volver al inicio`.
- La Politica de privacidad no declara formularios, analytics, WhatsApp, agenda, backend, pagos o cuentas como activos.
- Los Terminos no declaran compromisos contractuales generales no acordados.
- No se inventan periodos legales especificos de conservacion.
- No se promete seguridad absoluta.
- La PoC queda explicada como alcance acotado, no como producto completo ni desarrollo gratuito por defecto.
- El contenido es breve, claro y comprensible.
- La spec deja constancia de que el contenido requiere revision legal profesional antes de uso definitivo.
- El diseno es consistente con la landing.
- Las paginas son responsive y accesibles.
- No se agrega JavaScript nuevo.
- No se agrega backend.
- No se inicia Spec 014.

## 19. Archivos previstos

Archivos a crear:

- `privacidad/index.html`
- `terminos/index.html`

Archivos a modificar:

- `index.html` para activar enlaces legales del footer.

Archivos opcionales:

- `assets/css/legal.css` solo si el sistema actual no permite una lectura legal correcta sin mezclar responsabilidades. La preferencia es no crearlo.

Archivos que no deben modificarse:

- `assets/js/main.js`

## 20. Riesgos / deuda tecnica

- El contenido legal debe revisarse profesionalmente antes de publicarse como base definitiva de una operacion comercial.
- Cuando se agreguen formulario, WhatsApp, agenda, analytics o backend, la Politica de privacidad debera actualizarse.
- Si se agregan cookies o tracking, podria requerirse una politica de cookies o mecanismo de consentimiento.
- Si se contratan servicios con alcance formal, los terminos generales no reemplazan contratos, propuestas ni anexos especificos.
- La estrategia exacta de redireccion entre `/privacidad`, `/privacidad/` y `privacidad/index.html` podria requerir configuracion en CloudFront/S3.

## 21. Validaciones minimas

Durante la implementacion se debe validar:

- Existen `privacidad/index.html` y `terminos/index.html`.
- Los enlaces del footer resuelven a las rutas legales.
- Cada pagina tiene un solo `h1`.
- Cada pagina tiene `title`, `meta description` y `canonical`.
- No se modifico `assets/js/main.js`.
- No hay menciones que declaren activas funciones futuras inexistentes.
- No hay lenguaje de gratuidad, garantias absolutas ni plazos legales inventados.
- No hay overflow horizontal en revision responsive basica.
- `git diff --check` no reporta problemas.
- No se ejecuta deploy.
- No se inicia Spec 014.