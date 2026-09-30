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
const contactForm = document.querySelector("[data-contact-form]");
const contactProblemType = document.querySelector("[data-contact-field=\"problemType\"]");
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
    email: contactForm.querySelector("[data-contact-field=\"email\"]"),
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

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (contactStatus) {
      contactStatus.textContent = "";
    }

    const { isValid, firstInvalidField } = validateContactForm();

    if (!isValid) {
      firstInvalidField?.focus();
      return;
    }

    if (contactSubmit) {
      contactSubmit.textContent = "Enviar mi caso";
      contactSubmit.disabled = false;
    }

    if (contactStatus) {
      contactStatus.innerHTML = `El formulario estará disponible próximamente. Mientras tanto puedes contactarme por <a href="${buildWhatsappUrl("Hola Jonathan, vi tu sitio y quiero conversar sobre una solución tecnológica para mi empresa.")}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.`;
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
