# Spec 012 - Final CTA and Footer

## Estado

Implementada.

Esta spec define el cierre comercial de `jonathanvaldes.com` mediante CTA final y Footer. Fue implementada tras aprobacion explicita, sin JavaScript nuevo, sin dependencias, sin paginas legales, sin contacto real, sin formulario, sin backend y sin deploy.

## 1. Objetivo

Definir el cierre comercial de la landing mediante dos bloques finales:

1. CTA final.
2. Footer.

El modulo debe cerrar la experiencia iniciada en Hero y facilitar el siguiente paso sin conectar todavia infraestructura real de contacto, agenda, email o backend.

La idea central del cierre es:

```text
Cuéntanos qué necesitas resolver y evaluemos si tiene sentido construir una solución.
```

Debe sentirse como una invitacion a conversar, no como una venta agresiva.

## 2. Contexto

La landing ya presenta el problema, servicios, proceso, Demo / PoC, casos, Sobre mi y FAQ. Despues de esa secuencia, el visitante debe encontrar una accion clara y un cierre sobrio con identidad, canales futuros y rutas legales previstas.

Fase 1 define que la primera etapa comercial busca conversaciones cualificadas, no venta automatica ni promesas antes del diagnostico. Fase 3 reduce los CTA a expresiones concretas y Fase 4 define el wireframe final con CTA final y Footer.

M12 no debe resolver contacto real. Solo prepara el cierre visual y semantico de la landing con placeholders controlados.

## 3. Ubicacion

La implementacion futura debe ubicar el CTA final inmediatamente despues de FAQ y antes del Footer.

Orden esperado:

```text
FAQ
CTA final
Footer
```

El Footer debe ser el ultimo bloque visible del documento.

## 4. Alcance

La implementacion futura de esta spec debe:

- agregar una seccion de CTA final;
- usar `id="contacto"` en el CTA final;
- incluir titulo, copy, dos CTA y una linea de transparencia;
- mantener los CTA como placeholders controlados;
- agregar un `<footer>` semantico;
- incluir identidad, claim, canales futuros, enlaces legales previstos y copyright;
- mantener WhatsApp, Email, Privacidad y Terminos sin simular funcionalidades reales;
- resolver idealmente con HTML y CSS;
- reutilizar botones y tokens existentes;
- mantener responsive mobile first;
- mantener accesibilidad y buen contraste;
- no agregar dependencias ni backend.

## 5. Fuera de alcance

No forma parte de esta spec:

- WhatsApp real;
- email real;
- formulario;
- SES;
- Lambda;
- DynamoDB;
- Google Calendar;
- Meet;
- analytics;
- paginas de privacidad;
- paginas de terminos;
- `/cv`;
- backend;
- Spec 013;
- deploy;
- nuevas dependencias;
- JavaScript nuevo, salvo necesidad excepcional documentada.

No agregar LinkedIn, redes sociales, CV, clientes, metricas, testimonios ni datos de contacto inventados.

## 6. CTA final

### Anchor

La seccion debe usar:

```html
id="contacto"
```

Este anchor sera el destino comercial general de la landing mientras no exista un flujo real de contacto.

### Eyebrow opcional

Puede usarse si mejora la composicion:

```text
¿Tienes un problema por resolver?
```

### Titulo recomendado

Usar preferentemente:

```text
Conversemos sobre lo que necesitas resolver
```

### Funcion comercial

El CTA final debe responder a la pregunta:

```text
¿Que hago ahora si esto se parece a mi problema?
```

Respuesta esperada:

```text
Cuenta el caso, revisamos si tiene sentido y definimos el siguiente paso.
```

## 7. Copy

Copy base aprobado para el CTA final:

```text
Cuéntame qué está ocurriendo, qué proceso quieres mejorar o qué idea necesitas validar. Podemos revisar el caso y definir cuál sería el siguiente paso.
```

Se permite un ajuste minimo de fluidez sin cambiar el significado. La version recomendada para implementar es mantener el texto tal como esta.

No usar lenguaje de urgencia, descuentos ni promesas de resultado.

## 8. CTA principal

Texto exacto:

```text
Háblanos hoy
```

Destino temporal recomendado:

```text
#contacto
```

Razon: mientras no exista WhatsApp real, mantener el CTA dentro del bloque comercial evita enviar al usuario a un anchor tecnico inexistente o a una funcionalidad simulada.

Cuando se implemente contacto real, este CTA podra cambiar a WhatsApp o al canal aprobado.

## 9. CTA secundario

Texto exacto:

```text
Agenda hoy mismo
```

Destino temporal recomendado:

```text
#contacto
```

Razon: todavia no existe agenda real, Google Calendar, Meet ni sistema de reservas. El CTA debe permanecer visible como intencion comercial futura, pero sin fingir una reserva disponible.

Cuando se implemente el sistema de agenda, este CTA podra apuntar al flujo real aprobado.

## 10. Transparencia

Incluir una linea breve:

```text
Evaluación inicial sin compromiso.
```

No agregar:

- respuesta garantizada;
- `agenda gratis`;
- desarrollo gratuito;
- disponibilidad 24/7;
- urgencia falsa;
- descuentos;
- promesas de tiempos o resultados.

## 11. Tratamiento de placeholders

Se recomienda la opcion C:

```text
href="#contacto" temporal controlado
```

Esta es la solucion mas simple y correcta para M12 porque:

- evita anchors rotos como `#contacto-pendiente` o `#agenda-pendiente`;
- no simula WhatsApp, agenda, email ni formulario;
- mantiene al usuario en el bloque comercial real;
- no requiere JavaScript;
- permite que CTA anteriores converjan conceptualmente hacia el cierre.

Durante la implementacion futura de M12, puede corregirse de forma minima los CTA previos que hoy apuntan a `#contacto-pendiente` o `#agenda-pendiente`, cambiandolos a `#contacto`, si esa correccion evita anchors rotos y no altera el alcance.

No crear targets ocultos ni botones deshabilitados salvo que aparezca una razon concreta. Los enlaces deben seguir siendo comprensibles y operables.

## 12. Consistencia con CTAs anteriores

Existen CTA previos:

- `Háblanos hoy`;
- `Agenda hoy mismo`;
- `Cuéntame tu caso`;
- `Evaluar mi proyecto`.

Conceptualmente todos deben converger hacia el futuro sistema de contacto o evaluacion. En M12, la recomendacion es:

- mantener los textos existentes;
- no conectar canales reales;
- usar `#contacto` como destino temporal controlado cuando sea necesario evitar anchors rotos;
- no agregar variantes nuevas de CTA;
- no modificar comportamiento de secciones anteriores salvo correccion minima de destino temporal.

En una spec posterior, los CTA podran conectarse a:

- WhatsApp real;
- agenda real;
- formulario;
- backend;
- analytics.

## 13. Footer

El Footer debe cerrar la pagina de manera sobria con:

- identidad;
- propuesta breve;
- futuros canales de contacto;
- paginas legales previstas;
- copyright.

Debe usarse `<footer>` semantico y mantenerse pequeno. No debe duplicar todo el navbar ni funcionar como mapa completo del sitio.

## 14. Contenido del footer

Contenido aprobado:

```text
Jonathan Valdés
```

Claim:

```text
Tecnología para convertir problemas, procesos e ideas en soluciones que funcionan.
```

Canales:

```text
WhatsApp · Email
```

Legales:

```text
Privacidad · Términos de servicio
```

Copyright:

```text
© 2026 Jonathan Valdés. Todos los derechos reservados.
```

No agregar LinkedIn, CV, redes sociales, clientes, badges ni certificaciones.

## 15. Contacto futuro

WhatsApp y Email son canales futuros aprobados como copy, pero no deben conectarse todavia.

Reglas para M12:

- no inventar numero de telefono;
- no inventar email publicado;
- no usar `mailto:`;
- no usar links externos;
- no publicar `info@jonathanvaldes.com` como canal operativo hasta que la infraestructura exista;
- distinguir visual o semanticamente que son canales previstos o placeholders.

Email objetivo futuro:

```text
info@jonathanvaldes.com
```

La infraestructura para ese correo se implementara en una etapa posterior.

## 16. Legales futuros

Rutas previstas:

```text
/privacidad
/terminos
```

Estas paginas todavia no existen y no deben crearse en M12.

Para M12 se recomienda:

- mostrar `Privacidad` y `Términos de servicio` como enlaces placeholder controlados hacia `#legal-pendiente`, o como elementos claramente pendientes sin URL real;
- evitar que parezcan paginas funcionales antes de Spec 013;
- documentar que las rutas finales seran `/privacidad` y `/terminos`;
- no crear archivos, carpetas ni contenido legal en esta spec.

La implementacion futura puede usar un pequeno texto oculto o visible de estado pendiente si ayuda a que el placeholder no sea confuso, pero no debe saturar el Footer.

## 17. Layout

### CTA final mobile

- una columna;
- titulo protagonista;
- copy breve;
- botones apilados o en wrap;
- area tactil comoda;
- sin overflow horizontal;
- espacio suficiente antes del Footer.

### CTA final desktop

- composicion centrada o split muy simple;
- ancho de lectura controlado;
- dos botones juntos;
- superficie diferenciada con borde/acento;
- suficiente espacio vertical.

### Footer mobile

- contenido apilado;
- buena separacion entre identidad, canales y legales;
- enlaces faciles de tocar;
- copyright visible.

### Footer desktop

- distribucion horizontal simple si el espacio lo permite;
- identidad y claim a un lado;
- canales/legales/copyright ordenados al otro lado o en filas discretas;
- no duplicar el navbar.

## 18. Diseño

CTA final:

- debe ser una de las secciones mas claras del sitio;
- puede usar superficie diferenciada;
- puede usar borde/acento;
- debe mantener minimalismo tecnologico premium;
- debe evitar parecer banner promocional agresivo.

Footer:

- sobrio;
- compacto;
- buen contraste;
- separadores finos si aportan claridad;
- coherente con dark mode.

No usar:

- imagenes de fondo;
- particulas;
- video;
- animaciones continuas;
- gradientes excesivos;
- decoracion sin proposito;
- iconografia promocional.

## 19. Accesibilidad

CTA final:

- seccion semantica con heading claro;
- enlaces con etiquetas visibles y comprensibles;
- foco visible;
- targets de CTA comprensibles;
- no depender solo del color;
- copy completo visible en DOM.

Footer:

- usar `<footer>`;
- usar navegacion legal semantica si corresponde;
- enlaces distinguibles;
- buen contraste;
- orden DOM logico;
- no exponer datos de contacto falsos;
- no usar `aria-live`.

Si los enlaces legales son placeholders, deben evitar confundir a tecnologias asistivas como paginas ya disponibles.

## 20. Responsive

Enfoque obligatorio: mobile first.

CTA:

- botones comodos para touch;
- wrap o apilado en pantallas pequenas;
- titulo legible;
- sin overflow.

Footer:

- apilado en mobile;
- puede distribuirse horizontalmente en desktop;
- mantener separacion clara sin ocupar demasiado alto.

Usar breakpoints existentes alrededor de `48rem` y `64rem` si hace falta. No agregar breakpoints nuevos salvo necesidad concreta.

## 21. Performance

M12 debe resolverse con:

- HTML;
- CSS;
- componentes existentes.

Idealmente:

- sin JavaScript nuevo;
- sin imagenes;
- sin dependencias;
- sin nuevas fuentes;
- sin fetch;
- sin llamadas externas;
- sin animaciones continuas.

No deberia modificarse `assets/js/main.js`.

## 22. Criterios de aceptacion

### CTA final

La implementacion futura se considera aceptada si:

- aparece despues de FAQ;
- aparece antes del Footer;
- usa `id="contacto"`;
- tiene titulo claro, preferentemente `Conversemos sobre lo que necesitas resolver`;
- usa el copy aprobado o ajuste minimo equivalente;
- incluye CTA `Háblanos hoy`;
- incluye CTA `Agenda hoy mismo`;
- incluye `Evaluación inicial sin compromiso.`;
- no comunica gratuidad de desarrollo;
- no promete respuesta garantizada ni disponibilidad 24/7;
- usa placeholders controlados;
- no conecta WhatsApp, agenda, formulario ni backend.

### Footer

La implementacion futura se considera aceptada si:

- usa `<footer>` semantico;
- incluye `Jonathan Valdés`;
- incluye el claim aprobado;
- muestra `WhatsApp` y `Email` como canales futuros o placeholders;
- no inventa telefono ni correo operativo;
- incluye `Privacidad` y `Términos de servicio` como legales futuros o placeholders controlados;
- incluye `© 2026 Jonathan Valdés. Todos los derechos reservados.`;
- no incluye LinkedIn;
- no incluye `/cv`;
- no incluye redes sociales inventadas;
- no duplica todo el navbar.

### Tecnico

La implementacion futura se considera aceptada si:

- es responsive;
- es accesible;
- no agrega dependencias;
- idealmente no modifica JavaScript;
- no implementa Spec 013;
- no crea paginas legales;
- no despliega;
- mantiene cambios acotados a M12.

## 23. Archivos previstos

La implementacion futura probablemente modificara:

```text
index.html
assets/css/sections.css
specs/012-final-cta-footer.md
```

Opcionalmente podria modificar:

```text
assets/css/components.css
```

Solo si aparece un patron reusable real para botones, enlaces legales o layout comun.

No deberia modificarse:

```text
assets/js/main.js
```

No modificar en esta spec:

- `AGENTS.md`;
- documentos de fase aprobados;
- paginas legales;
- `/cv`;
- infraestructura;
- Terraform;
- backend;
- secretos;
- dependencias.

## 24. Riesgos / deuda tecnica

- Los CTA seguiran siendo placeholders hasta implementar contacto real.
- Si no se corrigen anchors antiguos, `#contacto-pendiente` y `#agenda-pendiente` pueden quedar como destinos inexistentes; M12 permite corregirlos a `#contacto` como cambio minimo.
- Mostrar WhatsApp y Email sin conexion real puede confundir si no se trata claramente como canal futuro o placeholder.
- Las rutas legales finales `/privacidad` y `/terminos` aun no existiran hasta Spec 013.
- El Footer no debe crecer hasta parecer una navegacion secundaria completa.
- Publicar `info@jonathanvaldes.com` antes de tener infraestructura podria crear una expectativa operativa falsa.

## 25. Validaciones minimas

Durante la futura implementacion ejecutar solo validaciones rapidas:

- `git status --short --branch` antes de modificar;
- verificar que CTA final aparece despues de FAQ;
- verificar `id="contacto"`;
- verificar CTA `Háblanos hoy`;
- verificar CTA `Agenda hoy mismo`;
- verificar `Evaluación inicial sin compromiso.`;
- verificar ausencia de WhatsApp real, email real, formulario, agenda y backend;
- verificar placeholders controlados;
- verificar que no se crea Spec 013;
- verificar que no se crean paginas legales;
- verificar `<footer>` semantico;
- verificar contenido aprobado del Footer;
- verificar ausencia de LinkedIn y `/cv`;
- verificar responsive basico mobile y desktop;
- verificar accesibilidad basica y foco visible;
- verificar que no se agregaron dependencias;
- verificar que no se modifico `assets/js/main.js`, salvo excepcion justificada;
- `git diff --check`;
- `git diff --stat` al finalizar.

No ejecutar:

- deploy;
- Terraform;
- Lighthouse;
- auditorias extensas;
- suites largas;
- instalacion de dependencias.
