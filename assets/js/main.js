document.documentElement.classList.add("js");
const header = document.querySelector("[data-site-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (header && toggle && nav) {
  const setOpen = (isOpen) => {
    header.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 48rem)").matches) {
      setOpen(false);
    }
  });
}
const dynamicProblem = document.querySelector("[data-dynamic-problem]");

if (dynamicProblem) {
  const problems = [
    "un proceso manual?",
    "sistemas desconectados?",
    "falta de visibilidad?",
    "una aplicación pendiente?",
    "infraestructura inestable?",
    "datos que no estás aprovechando?",
    "demasiados errores o pruebas manuales?",
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let intervalId;

  const stopRotation = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const showNextProblem = () => {
    dynamicProblem.classList.add("is-changing");

    window.setTimeout(() => {
      index = (index + 1) % problems.length;
      dynamicProblem.textContent = problems[index];
      dynamicProblem.classList.remove("is-changing");
    }, 220);
  };

  const startRotation = () => {
    if (reduceMotion.matches || document.hidden || intervalId) {
      return;
    }

    intervalId = window.setInterval(showNextProblem, 2800);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRotation();
      return;
    }

    startRotation();
  });

  reduceMotion.addEventListener("change", () => {
    stopRotation();
    dynamicProblem.classList.remove("is-changing");

    if (reduceMotion.matches) {
      dynamicProblem.textContent = problems[0];
      index = 0;
      return;
    }

    startRotation();
  });

  startRotation();
}
const problemOptions = document.querySelectorAll("[data-problem-option]");
const problemDetailTitle = document.querySelector("[data-problem-detail-title]");
const problemDetailCopy = document.querySelector("[data-problem-detail-copy]");
const problemDetailCta = document.querySelector("[data-problem-detail-cta]");
const problemDetail = document.querySelector(".problem-detail");
const whatsappBaseUrl = "https://wa.me/56931367372?text=";
const fallbackWhatsappMessage = "Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico en mi empresa.";
const buildWhatsappUrl = (message) => `${whatsappBaseUrl}${encodeURIComponent(message || fallbackWhatsappMessage)}`;
const requestTimeoutMs = 12000;
const getRuntimeEndpoint = (globalName, metaName) => window[globalName] || document.querySelector(`meta[name="${metaName}"]`)?.content.trim() || "";
const contactForm = document.querySelector("[data-contact-form]");
const contactProblemType = document.querySelector("[data-contact-field=\"problemType\"]");
const bookingProblemType = document.querySelector("[data-booking-field=\"problemType\"]");
const contactSourceContext = document.querySelector("[data-contact-source-context]");

if (problemOptions.length && problemDetailTitle && problemDetailCopy && problemDetailCta && problemDetail) {
  const problemOptionToFormValue = {
    automation: "Automatizar un proceso",
    app: "Crear una aplicación",
    integration: "Conectar sistemas",
    data: "Trabajar con mis datos",
    infrastructure: "Mejorar infraestructura",
    quality: "Mejorar calidad",
    monitoring: "Mejorar monitoreo / visibilidad",
    unsure: "No estoy seguro",
  };

  const problemContent = {
    automation: {
      title: "Automatizar un proceso",
      description: "Podemos ayudarte a identificar tareas repetitivas, diseñar el flujo y evaluar qué partes pueden automatizarse sin complicar innecesariamente la operación.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre automatizar un proceso en mi empresa.",
    },
    app: {
      title: "Crear una aplicación",
      description: "Podemos ayudarte a definir, diseñar y construir una aplicación, sistema interno, API o MVP que resuelva una necesidad concreta sin sobredimensionar el proyecto.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre crear una aplicación en mi empresa.",
    },
    integration: {
      title: "Conectar sistemas",
      description: "Podemos ayudarte a integrar plataformas, APIs, bases de datos o servicios que hoy funcionan separados para que la información fluya con menos trabajo manual.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre conectar sistemas en mi empresa.",
    },
    data: {
      title: "Trabajar con mis datos",
      description: "Podemos ayudarte a consolidar, transformar y visualizar datos mediante reportes, dashboards o flujos que apoyen mejores decisiones del negocio.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre trabajar con mis datos en mi empresa.",
    },
    infrastructure: {
      title: "Mejorar infraestructura",
      description: "Podemos ayudarte a ordenar despliegues, cloud, Docker, CI/CD y automatización para que tu infraestructura sea más confiable y fácil de operar.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre mejorar infraestructura en mi empresa.",
    },
    quality: {
      title: "Mejorar calidad",
      description: "Podemos ayudarte a reducir errores con pruebas funcionales, automatización, regresión y controles que den más confianza antes de publicar cambios.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre mejorar calidad en mi empresa.",
    },
    monitoring: {
      title: "Mejorar monitoreo / visibilidad",
      description: "Podemos ayudarte a implementar métricas, logs, alertas y dashboards para entender qué está ocurriendo en tus sistemas y operación.",
      whatsappMessage: "Hola Jonathan, quiero conversar sobre mejorar monitoreo o visibilidad en mi empresa.",
    },
    unsure: {
      title: "No estoy seguro",
      description: "No necesitas saber la solución técnica. Podemos empezar entendiendo qué ocurre, qué necesitas lograr y qué alternativas tienen sentido para tu caso.",
      whatsappMessage: "Hola Jonathan, tengo un problema tecnológico en mi empresa pero todavía no tengo claro qué tipo de solución necesito.",
    },
  };

  const setSelectedProblem = (selectedButton) => {
    const content = problemContent[selectedButton.dataset.problemOption] || {
      title: selectedButton.textContent.trim() || "Cuéntame tu caso",
      description: "Podemos empezar entendiendo qué ocurre y qué alternativa tiene sentido para tu caso.",
      whatsappMessage: fallbackWhatsappMessage,
    };

    problemOptions.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    problemDetail.classList.add("is-changing");
    window.setTimeout(() => {
      problemDetailTitle.textContent = content.title;
      problemDetailCopy.textContent = content.description;
      problemDetailCta.href = buildWhatsappUrl(content.whatsappMessage);
      if (contactProblemType && problemOptionToFormValue[selectedButton.dataset.problemOption]) {
        contactProblemType.value = problemOptionToFormValue[selectedButton.dataset.problemOption];
      }
      if (bookingProblemType && problemOptionToFormValue[selectedButton.dataset.problemOption]) {
        bookingProblemType.value = problemOptionToFormValue[selectedButton.dataset.problemOption];
      }
      if (contactSourceContext && problemOptionToFormValue[selectedButton.dataset.problemOption]) {
        contactSourceContext.value = "problem-selector";
      }
      problemDetailCta.hidden = false;
      problemDetail.classList.remove("is-changing");
    }, 120);
  };

  problemOptions.forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedProblem(button);
    });
  });
}
const processScrolly = document.querySelector("[data-process-scrolly]");

if (processScrolly && "IntersectionObserver" in window) {
  const processSteps = processScrolly.querySelectorAll("[data-process-step]");
  const processIndicators = processScrolly.querySelectorAll("[data-process-indicator]");
  const activeNumber = processScrolly.querySelector("[data-process-active-number]");
  const activeTitle = processScrolly.querySelector("[data-process-active-title]");

  const setActiveProcessStep = (activeStep) => {
    const stepNumber = activeStep.dataset.processStep;
    const stepTitle = activeStep.querySelector("h3")?.textContent || "";

    processSteps.forEach((step) => {
      const isActive = step === activeStep;
      step.classList.toggle("is-active", isActive);
      if (isActive) {
        step.setAttribute("aria-current", "step");
      } else {
        step.removeAttribute("aria-current");
      }
    });

    processIndicators.forEach((indicator) => {
      indicator.classList.toggle("is-active", indicator.dataset.processIndicator === stepNumber);
    });

    if (activeNumber && stepNumber) {
      activeNumber.textContent = stepNumber.padStart(2, "0");
    }

    if (activeTitle) {
      activeTitle.textContent = stepTitle;
    }
  };

  const processObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveProcessStep(visibleEntry.target);
    }
  }, {
    root: null,
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.2, 0.45, 0.7],
  });

  processSteps.forEach((step) => {
    processObserver.observe(step);
  });
}
const faqTriggers = document.querySelectorAll("[data-faq-trigger]");

if (faqTriggers.length) {
  faqTriggers.forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const icon = trigger.querySelector(".faq__icon");

    if (!panel) {
      return;
    }

    trigger.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");

    if (icon) {
      icon.textContent = "+";
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      const nextOpen = !isOpen;

      trigger.setAttribute("aria-expanded", String(nextOpen));
      panel.classList.toggle("is-open", nextOpen);
      panel.setAttribute("aria-hidden", String(!nextOpen));

      if (icon) {
        icon.textContent = nextOpen ? "−" : "+";
      }
    });
  });
}

const contactStatus = document.querySelector("[data-contact-status]");
const contactSubmit = document.querySelector("[data-contact-submit]");

if (contactForm) {
  const fields = {
    name: contactForm.querySelector("[data-contact-field=\"name\"]"),
    company: contactForm.querySelector("[data-contact-field=\"company\"]"),
    email: contactForm.querySelector("[data-contact-field=\"email\"]"),
    phone: contactForm.querySelector("[data-contact-field=\"phone\"]"),
    problemType: contactForm.querySelector("[data-contact-field=\"problemType\"]"),
    message: contactForm.querySelector("[data-contact-field=\"message\"]"),
    privacyAccepted: contactForm.querySelector("[data-contact-field=\"privacyAccepted\"]"),
    website: contactForm.querySelector("[data-contact-field=\"website\"]"),
  };

  const allowedProblemTypes = new Set([
    "Automatizar un proceso",
    "Crear una aplicación",
    "Conectar sistemas",
    "Trabajar con mis datos",
    "Mejorar infraestructura",
    "Mejorar calidad",
    "Mejorar monitoreo / visibilidad",
    "No estoy seguro",
    "Otro",
  ]);

  const messages = {
    name: "Ingresa tu nombre.",
    email: "Ingresa un email válido.",
    problemType: "Selecciona qué necesitas resolver.",
    message: "Cuéntame brevemente tu problema.",
    privacyAccepted: "Debes aceptar la Política de Privacidad para continuar.",
  };

  const setFieldError = (fieldName, message = "") => {
    const error = contactForm.querySelector(`[data-contact-error="${fieldName}"]`);
    const field = fields[fieldName];
    const wrapper = field?.closest(".contact-field");

    if (error) {
      error.textContent = message;
    }

    if (field) {
      field.toggleAttribute("aria-invalid", Boolean(message));
    }

    if (wrapper) {
      wrapper.classList.toggle("is-invalid", Boolean(message));
    }
  };

  const validateContactForm = () => {
    let firstInvalidField;

    Object.keys(messages).forEach((fieldName) => setFieldError(fieldName));

    const name = fields.name?.value.trim() || "";
    const email = fields.email?.value.trim() || "";
    const problemType = fields.problemType?.value || "";
    const message = fields.message?.value.trim() || "";
    const website = fields.website?.value.trim() || "";

    if (fields.name) {
      fields.name.value = name;
    }
    if (fields.email) {
      fields.email.value = email;
    }
    if (fields.company) {
      fields.company.value = fields.company.value.trim();
    }
    if (fields.phone) {
      fields.phone.value = fields.phone.value.trim();
    }
    if (fields.message) {
      fields.message.value = message;
    }

    const markInvalid = (fieldName) => {
      setFieldError(fieldName, messages[fieldName]);
      if (!firstInvalidField) {
        firstInvalidField = fields[fieldName];
      }
    };

    if (!name) {
      markInvalid("name");
    }

    if (!email || !fields.email.checkValidity()) {
      markInvalid("email");
    }

    if (!problemType || !allowedProblemTypes.has(problemType)) {
      markInvalid("problemType");
    }

    if (!message) {
      markInvalid("message");
    }

    if (!fields.privacyAccepted?.checked) {
      markInvalid("privacyAccepted");
    }

    if (website) {
      return { isValid: false, firstInvalidField: null };
    }

    return { isValid: !firstInvalidField, firstInvalidField };
  };

  const leadEndpoint = getRuntimeEndpoint("JV_LEAD_ENDPOINT", "lead-endpoint");
  const setContactStatus = (message, { includeWhatsapp = false } = {}) => {
    if (!contactStatus) {
      return;
    }

    contactStatus.textContent = message;

    if (includeWhatsapp) {
      contactStatus.append(" ");
      const whatsappLink = document.createElement("a");
      whatsappLink.href = buildWhatsappUrl("Hola Jonathan, vi tu sitio y quiero conversar sobre una solución tecnológica para mi empresa.");
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.textContent = "WhatsApp";
      contactStatus.append(whatsappLink, ".");
    }
  };

  const postLead = async (payload) => {
    if (!leadEndpoint) {
      throw new Error("missing_lead_endpoint");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    let response;

    try {
      response = await fetch(leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    const data = await response.json().catch(() => ({}));

    if (response.status !== 201 || data.ok !== true) {
      const error = new Error(data.error || "lead_request_failed");
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setContactStatus("");

    const { isValid, firstInvalidField } = validateContactForm();

    if (!isValid) {
      firstInvalidField?.focus();
      return;
    }

    if (!leadEndpoint) {
      setContactStatus("El formulario quedará disponible cuando se configure el endpoint de contacto.", { includeWhatsapp: true });
      return;
    }

    if (contactSubmit) {
      contactSubmit.textContent = "Enviando...";
      contactSubmit.disabled = true;
    }

    const payload = {
      action: "createLead",
      name: fields.name.value.trim(),
      company: fields.company?.value.trim() || "",
      email: fields.email.value.trim(),
      phone: fields.phone?.value.trim() || "",
      problemType: fields.problemType.value,
      message: fields.message.value.trim(),
      privacyAccepted: fields.privacyAccepted.checked,
      source: "website",
      sourceContext: contactSourceContext?.value || "form",
      website: fields.website?.value.trim() || "",
    };

    try {
      await postLead(payload);
      contactForm.reset();
      if (contactSourceContext) {
        contactSourceContext.value = "form";
      }
      Object.keys(messages).forEach((fieldName) => setFieldError(fieldName));
      setContactStatus("Gracias. Recibimos tu mensaje y revisaremos el caso para definir el siguiente paso.");
    } catch (error) {
      setContactStatus("No pudimos enviar tu mensaje. Intenta nuevamente o contáctame por WhatsApp.", { includeWhatsapp: true });
    } finally {
      if (contactSubmit) {
        contactSubmit.textContent = "Enviar mi caso";
        contactSubmit.disabled = false;
      }
    }
  });

  contactForm.addEventListener("input", (event) => {
    const fieldName = event.target?.dataset?.contactField;
    if (fieldName && messages[fieldName]) {
      setFieldError(fieldName);
    }
  });

  contactForm.addEventListener("change", (event) => {
    const fieldName = event.target?.dataset?.contactField;
    if (fieldName && messages[fieldName]) {
      setFieldError(fieldName);
    }
  });
}

const bookingPanel = document.querySelector("[data-booking-panel]");
const bookingForm = document.querySelector("[data-booking-form]");
const bookingLoad = document.querySelector("[data-booking-load]");
const bookingSlots = document.querySelector("[data-booking-slots]");
const bookingStatus = document.querySelector("[data-booking-status]");
const bookingSelected = document.querySelector("[data-booking-selected]");
const bookingResult = document.querySelector("[data-booking-result]");
const bookingSubmit = document.querySelector("[data-booking-submit]");
const bookingOpenLinks = document.querySelectorAll("[data-booking-open]");

if (bookingPanel && bookingForm) {
  const bookingEndpoint = getRuntimeEndpoint("JV_BOOKING_ENDPOINT", "booking-endpoint");
  const bookingFields = {
    name: bookingForm.querySelector('[data-booking-field="name"]'),
    company: bookingForm.querySelector('[data-booking-field="company"]'),
    email: bookingForm.querySelector('[data-booking-field="email"]'),
    phone: bookingForm.querySelector('[data-booking-field="phone"]'),
    problemType: bookingForm.querySelector('[data-booking-field="problemType"]'),
    message: bookingForm.querySelector('[data-booking-field="message"]'),
    privacyAccepted: bookingForm.querySelector('[data-booking-field="privacyAccepted"]'),
    startAt: bookingForm.querySelector('[data-booking-field="startAt"]'),
    clientRequestId: bookingForm.querySelector('[data-booking-field="clientRequestId"]'),
    website: bookingForm.querySelector('[data-booking-field="website"]'),
  };
  const bookingAllowedProblemTypes = new Set([
    "Automatizar un proceso",
    "Crear una aplicación",
    "Conectar sistemas",
    "Trabajar con mis datos",
    "Mejorar infraestructura",
    "Mejorar calidad",
    "Mejorar monitoreo / visibilidad",
    "No estoy seguro",
    "Otro",
  ]);
  const bookingMessages = {
    name: "Ingresa tu nombre.",
    email: "Ingresa un email válido.",
    problemType: "Selecciona qué necesitas conversar.",
    message: "Cuéntame brevemente el contexto.",
    privacyAccepted: "Debes aceptar la Política de Privacidad para continuar.",
    startAt: "Selecciona un horario disponible.",
  };
  const dateFormatter = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago",
  });
  const timeFormatter = new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Santiago",
  });
  let selectedSlotButton;
  let availabilityLoaded = false;

  const setBookingStatus = (message) => {
    if (bookingStatus) {
      bookingStatus.textContent = message;
    }
  };

  const setBookingResult = (message) => {
    if (bookingResult) {
      bookingResult.textContent = message;
    }
  };

  const setBookingError = (fieldName, message = "") => {
    const error = bookingForm.querySelector(`[data-booking-error="${fieldName}"]`);
    const field = bookingFields[fieldName];
    const wrapper = field?.closest(".contact-field");

    if (error) {
      error.textContent = message;
    }

    if (field) {
      field.toggleAttribute("aria-invalid", Boolean(message));
    }

    if (wrapper) {
      wrapper.classList.toggle("is-invalid", Boolean(message));
    }
  };

  const buildClientRequestId = () => {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `booking-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const postBookingAction = async (payload) => {
    if (!bookingEndpoint) {
      throw new Error("missing_booking_endpoint");
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    let response;

    try {
      response = await fetch(bookingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
    } finally {
      window.clearTimeout(timeoutId);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      const error = new Error(data.error || "booking_request_failed");
      error.status = response.status;
      error.payload = data;
      throw error;
    }
    return data;
  };

  const selectSlot = (button, slot) => {
    if (selectedSlotButton) {
      selectedSlotButton.setAttribute("aria-pressed", "false");
    }
    selectedSlotButton = button;
    selectedSlotButton.setAttribute("aria-pressed", "true");
    bookingFields.startAt.value = slot.startAt;
    bookingFields.clientRequestId.value = buildClientRequestId();
    if (bookingSelected) {
      bookingSelected.textContent = `Horario seleccionado: ${dateFormatter.format(new Date(slot.startAt))}, ${timeFormatter.format(new Date(slot.startAt))} hrs. Horarios de Santiago, Chile.`;
    }
    setBookingError("startAt");
    setBookingResult("");
  };

  const renderSlots = (slots) => {
    if (!bookingSlots) {
      return;
    }
    bookingSlots.innerHTML = "";
    selectedSlotButton = undefined;
    bookingFields.startAt.value = "";
    if (bookingSelected) {
      bookingSelected.textContent = "No has seleccionado un horario.";
    }

    if (!slots.length) {
      setBookingStatus("No hay horarios disponibles para este período.");
      return;
    }

    const groups = new Map();
    slots.forEach((slot) => {
      const dateKey = slot.displayDate || slot.startAt.slice(0, 10);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(slot);
    });

    groups.forEach((groupSlots) => {
      const group = document.createElement("div");
      group.className = "booking-slot-group";

      const title = document.createElement("p");
      title.className = "booking-slot-group__date";
      title.textContent = dateFormatter.format(new Date(groupSlots[0].startAt));
      group.append(title);

      const slotWrap = document.createElement("div");
      slotWrap.className = "booking-slot-group__slots";

      groupSlots.forEach((slot) => {
        const button = document.createElement("button");
        button.className = "booking-slot";
        button.type = "button";
        button.setAttribute("aria-pressed", "false");
        button.textContent = `${timeFormatter.format(new Date(slot.startAt))} hrs`;
        button.addEventListener("click", () => selectSlot(button, slot));
        slotWrap.append(button);
      });

      group.append(slotWrap);
      bookingSlots.append(group);
    });

    setBookingStatus("Selecciona un horario disponible. Horarios de Santiago, Chile.");
  };

  const loadAvailability = async () => {
    setBookingResult("");
    setBookingStatus("Cargando horarios disponibles...");
    if (bookingLoad) {
      bookingLoad.disabled = true;
    }

    try {
      const data = await postBookingAction({ action: "getAvailability", website: "" });
      renderSlots(Array.isArray(data.slots) ? data.slots : []);
      availabilityLoaded = true;
    } catch (error) {
      if (error.message === "missing_booking_endpoint") {
        setBookingStatus("La agenda quedará disponible cuando se configure el endpoint de reservas.");
      } else {
        setBookingStatus("No pudimos cargar horarios disponibles. Intenta nuevamente.");
      }
    } finally {
      if (bookingLoad) {
        bookingLoad.disabled = false;
      }
    }
  };

  const validateBookingForm = () => {
    let firstInvalidField;
    Object.keys(bookingMessages).forEach((fieldName) => setBookingError(fieldName));

    const name = bookingFields.name?.value.trim() || "";
    const email = bookingFields.email?.value.trim() || "";
    const company = bookingFields.company?.value.trim() || "";
    const phone = bookingFields.phone?.value.trim() || "";
    const problemType = bookingFields.problemType?.value || "";
    const message = bookingFields.message?.value.trim() || "";
    const website = bookingFields.website?.value.trim() || "";
    const startAt = bookingFields.startAt?.value || "";

    if (bookingFields.name) bookingFields.name.value = name;
    if (bookingFields.email) bookingFields.email.value = email;
    if (bookingFields.company) bookingFields.company.value = company;
    if (bookingFields.phone) bookingFields.phone.value = phone;
    if (bookingFields.message) bookingFields.message.value = message;

    const markInvalid = (fieldName) => {
      setBookingError(fieldName, bookingMessages[fieldName]);
      if (!firstInvalidField) {
        firstInvalidField = bookingFields[fieldName];
      }
    };

    if (!startAt) markInvalid("startAt");
    if (!name) markInvalid("name");
    if (!email || !bookingFields.email.checkValidity()) markInvalid("email");
    if (!problemType || !bookingAllowedProblemTypes.has(problemType)) markInvalid("problemType");
    if (!message) markInvalid("message");
    if (!bookingFields.privacyAccepted?.checked) markInvalid("privacyAccepted");
    if (website) return { isValid: false, firstInvalidField: null };

    return { isValid: !firstInvalidField, firstInvalidField };
  };

  bookingOpenLinks.forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => {
        bookingPanel.querySelector("button, input, select, textarea")?.focus({ preventScroll: true });
        if (!availabilityLoaded) {
          loadAvailability();
        }
      }, 120);
    });
  });

  bookingLoad?.addEventListener("click", loadAvailability);

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBookingResult("");

    const { isValid, firstInvalidField } = validateBookingForm();
    if (!isValid) {
      firstInvalidField?.focus();
      if (!firstInvalidField && bookingFields.website?.value.trim()) {
        setBookingResult("No pudimos agendar la reunión. Intenta nuevamente.");
      }
      return;
    }

    if (bookingSubmit) {
      bookingSubmit.disabled = true;
      bookingSubmit.textContent = "Agendando...";
    }

    const payload = {
      action: "createBooking",
      name: bookingFields.name.value.trim(),
      email: bookingFields.email.value.trim(),
      company: bookingFields.company?.value.trim() || "",
      phone: bookingFields.phone?.value.trim() || "",
      problemType: bookingFields.problemType.value,
      message: bookingFields.message.value.trim(),
      startAt: bookingFields.startAt.value,
      privacyAccepted: bookingFields.privacyAccepted.checked,
      source: "website",
      clientRequestId: bookingFields.clientRequestId.value || buildClientRequestId(),
      website: bookingFields.website.value.trim(),
    };

    if (bookingFields.company.value.trim()) payload.company = bookingFields.company.value.trim();
    if (bookingFields.phone.value.trim()) payload.phone = bookingFields.phone.value.trim();

    try {
      const data = await postBookingAction(payload);
      const message = data.meetUrl
        ? "Tu reunión quedó agendada. Revisa la invitación de Google Calendar para acceder mediante Google Meet."
        : "Tu reunión quedó agendada. Revisa la invitación de Google Calendar para acceder mediante Google Meet.";
      setBookingResult(message);
      bookingForm.reset();
      bookingFields.startAt.value = "";
      bookingFields.clientRequestId.value = "";
      if (selectedSlotButton) selectedSlotButton.setAttribute("aria-pressed", "false");
      selectedSlotButton = undefined;
      if (bookingSelected) bookingSelected.textContent = "No has seleccionado un horario.";
      loadAvailability();
    } catch (error) {
      if (error.status === 409 || error.payload?.error === "slot_unavailable") {
        setBookingResult("Ese horario acaba de dejar de estar disponible. Selecciona otro.");
        loadAvailability();
      } else if (error.message === "missing_booking_endpoint") {
        setBookingResult("La agenda quedará disponible cuando se configure el endpoint de reservas.");
      } else {
        setBookingResult("No pudimos agendar la reunión. Intenta nuevamente.");
      }
    } finally {
      if (bookingSubmit) {
        bookingSubmit.disabled = false;
        bookingSubmit.textContent = "Agendar diagnóstico";
      }
    }
  });

  bookingForm.addEventListener("input", (event) => {
    const fieldName = event.target?.dataset?.bookingField;
    if (fieldName && bookingMessages[fieldName]) {
      setBookingError(fieldName);
    }
  });

  bookingForm.addEventListener("change", (event) => {
    const fieldName = event.target?.dataset?.bookingField;
    if (fieldName && bookingMessages[fieldName]) {
      setBookingError(fieldName);
    }
  });
}
