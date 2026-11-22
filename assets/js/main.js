document.documentElement.classList.add("js");
const header = document.querySelector("[data-site-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-site-nav]");

if (header && toggle && nav) {
  const setOpen = (isOpen) => {
    header.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    const navLabel = toggle.querySelector("[data-nav-label]");
    if (navLabel) navLabel.textContent = isOpen ? "Cerrar" : "Menú";
  };

  document.addEventListener("click", (event) => {
    if (toggle.getAttribute("aria-expanded") === "true" && event.target instanceof Node && !header.contains(event.target)) {
      setOpen(false);
    }
  });

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
const problemDetailSolution = document.querySelector("[data-problem-detail-solution]");
const problemDetailCta = document.querySelector("[data-problem-detail-cta]");
const problemDetailInitial = document.querySelector("[data-problem-detail-initial]");
const problemDetailSelected = document.querySelector("[data-problem-detail-selected]");
const problemDetailIcon = document.querySelector("[data-problem-detail-icon]");
const problemDetail = document.querySelector(".problem-detail");
const whatsappBaseUrl = "https://wa.me/56931367372?text=";
const fallbackWhatsappMessage = "Hola Jonathan, vi tu sitio y quiero conversar sobre un problema tecnológico en mi empresa.";
const buildWhatsappUrl = (message) => `${whatsappBaseUrl}${encodeURIComponent(message || fallbackWhatsappMessage)}`;
const requestTimeoutMs = 12000;
const getRuntimeEndpoint = (globalName, metaName) => window[globalName] || document.querySelector(`meta[name="${metaName}"]`)?.content.trim() || "";
const contactForm = document.querySelector("[data-contact-form]");
const contactProblemType = document.querySelector("[data-contact-field=\"problemType\"]");
const contactSourceContext = document.querySelector("[data-contact-source-context]");
const mobileQuery = window.matchMedia("(max-width: 47.99rem)");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (problemOptions.length && problemDetailTitle && problemDetailCopy && problemDetailSolution && problemDetailCta && problemDetail && problemDetailInitial && problemDetailSelected && problemDetailIcon) {
  let selectedProblemKey = "";

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
      solution: "Propuesta: revisar el proceso y definir un primer flujo acotado para automatizar.",
    },
    app: {
      title: "Crear una aplicación",
      description: "Podemos ayudarte a definir, diseñar y construir una aplicación, sistema interno, API o MVP que resuelva una necesidad concreta sin sobredimensionar el proyecto.",
      solution: "Propuesta: definir un alcance inicial claro para una aplicación, sistema interno, API o MVP.",
    },
    integration: {
      title: "Conectar sistemas",
      description: "Podemos ayudarte a integrar plataformas, APIs, bases de datos o servicios que hoy funcionan separados para que la información fluya con menos trabajo manual.",
      solution: "Propuesta: revisar los sistemas involucrados y diseñar una integración proporcional al caso.",
    },
    data: {
      title: "Trabajar con datos",
      description: "Podemos ayudarte a consolidar, transformar y visualizar datos mediante reportes, dashboards o flujos que apoyen mejores decisiones del negocio.",
      solution: "Propuesta: ordenar las fuentes prioritarias y definir un primer reporte, dashboard o flujo de datos.",
    },
    infrastructure: {
      title: "Mejorar infraestructura",
      description: "Podemos ayudarte a ordenar despliegues, cloud, Docker, CI/CD y automatización para que tu infraestructura sea más confiable y fácil de operar.",
      solution: "Propuesta: identificar el punto operativo más crítico y plantear una mejora gradual de infraestructura.",
    },
    quality: {
      title: "Mejorar calidad",
      description: "Podemos ayudarte a reducir errores con pruebas funcionales, automatización, regresión y controles que den más confianza antes de publicar cambios.",
      solution: "Propuesta: acordar un conjunto inicial de pruebas y controles antes de publicar cambios.",
    },
    monitoring: {
      title: "Mejorar monitoreo / visibilidad",
      description: "Podemos ayudarte a implementar métricas, logs, alertas y dashboards para entender qué está ocurriendo en tus sistemas y operación.",
      solution: "Propuesta: priorizar las señales que necesitas ver y diseñar un primer tablero, alerta o métrica.",
    },
    unsure: {
      title: "No estoy seguro",
      description: "No necesitas saber la solución técnica. Podemos empezar entendiendo qué ocurre, qué necesitas lograr y qué alternativas tienen sentido para tu caso.",
      solution: "Propuesta: comenzar con una conversación breve para ordenar el problema y evaluar alternativas.",
    },
  };

  const problemIcons = {
    automation: '<svg viewBox="0 0 24 24" focusable="false"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"></path></svg>',
    app: '<svg viewBox="0 0 24 24" focusable="false"><path d="m8 7-5 5 5 5"></path><path d="m16 7 5 5-5 5"></path><path d="m14 4-4 16"></path></svg>',
    integration: '<svg viewBox="0 0 24 24" focusable="false"><path d="m10.5 13.5 3-3"></path><path d="m7.8 16.2-1.5 1.5a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0"></path><path d="m16.2 7.8 1.5-1.5a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0"></path></svg>',
    data: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 19V11"></path><path d="M11 19V5"></path><path d="M17 19v-8"></path><path d="M3 19h18"></path></svg>',
    infrastructure: '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.16 8.2 4.9 4.9 0 0 0 7 18Z"></path></svg>',
    quality: '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.5"></circle><path d="m8.2 12.1 2.5 2.6 5.2-5.5"></path></svg>',
    monitoring: '<svg viewBox="0 0 24 24" focusable="false"><path d="M3 12h4l2.2-5 4 10 2.2-5H21"></path></svg>',
    unsure: '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.5"></circle><path d="M9.8 9.4a2.4 2.4 0 1 1 4.1 1.7c-.9.8-1.9 1.3-1.9 2.9"></path><path d="M12 17.5h.01"></path></svg>',
  };

  const setSelectedProblem = (selectedButton) => {
    const content = problemContent[selectedButton.dataset.problemOption] || {
      title: selectedButton.textContent.trim() || "Cuéntame tu caso",
      description: "Podemos empezar entendiendo qué ocurre y qué alternativa tiene sentido para tu caso.",
      solution: "Propuesta: revisar el caso y definir un siguiente paso proporcional.",
    };

    if (mobileQuery.matches && selectedButton.classList.contains("is-selected")) {
      collapseProblemMobile();
      return;
    }

    selectedProblemKey = selectedButton.dataset.problemOption || "";

    problemOptions.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    if (mobileQuery.matches) {
      selectedButton.after(problemDetail);
      problemDetail.classList.remove("is-mobile-collapsed");
      problemOptions.forEach((button) => button.setAttribute("aria-expanded", String(button === selectedButton)));
      selectedButton.scrollIntoView({ block: "start", behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    }

    problemDetail.classList.add("is-changing");
    window.setTimeout(() => {
      problemDetailTitle.textContent = content.title;
      problemDetailCopy.textContent = content.description;
      problemDetailSolution.textContent = content.solution;
      problemDetailIcon.innerHTML = problemIcons[selectedProblemKey] || "";
      problemDetailInitial.hidden = true;
      problemDetailSelected.hidden = false;
      problemDetail.classList.remove("is-changing");
    }, 120);
  };

  problemOptions.forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedProblem(button);
    });
  });

  const problemGrid = document.querySelector(".problem-selector__grid");

  const collapseProblemMobile = () => {
    problemOptions.forEach((button) => {
      button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-expanded", "false");
    });
    selectedProblemKey = "";
    problemDetail.classList.add("is-mobile-collapsed");
  };

  const syncProblemLayout = () => {
    const selectedButton = Array.from(problemOptions).find((button) => button.classList.contains("is-selected"));

    if (mobileQuery.matches) {
      problemOptions.forEach((button) => button.setAttribute("aria-expanded", String(button === selectedButton)));
      if (selectedButton) {
        selectedButton.after(problemDetail);
        problemDetail.classList.remove("is-mobile-collapsed");
      } else {
        problemDetail.classList.add("is-mobile-collapsed");
      }
      return;
    }

    problemOptions.forEach((button) => button.removeAttribute("aria-expanded"));
    if (problemGrid) problemGrid.after(problemDetail);
    problemDetail.classList.remove("is-mobile-collapsed");
  };

  syncProblemLayout();
  mobileQuery.addEventListener("change", syncProblemLayout);

  problemDetailCta.addEventListener("click", () => {
    const formValue = problemOptionToFormValue[selectedProblemKey];

    if (contactProblemType && !contactProblemType.value && formValue) {
      contactProblemType.value = formValue;

      if (contactSourceContext?.value === "form") {
        contactSourceContext.value = "problem-selector";
      }
    }
  });
}

const serviceOptions = document.querySelectorAll("[data-service-option]");
const servicePanel = document.querySelector("[data-service-panel]");
const servicePanelIcon = document.querySelector("[data-service-panel-icon]");
const servicePanelTitle = document.querySelector("[data-service-panel-title]");
const servicePanelDescription = document.querySelector("[data-service-panel-description]");
const servicePanelBenefit = document.querySelector("[data-service-panel-benefit]");

if (serviceOptions.length && servicePanel && servicePanelIcon && servicePanelTitle && servicePanelDescription && servicePanelBenefit) {
  const serviceIcons = {
    applications: '<svg viewBox="0 0 24 24" focusable="false"><path d="m8 7-5 5 5 5"></path><path d="m16 7 5 5-5 5"></path><path d="m14 4-4 16"></path></svg>',
    automation: '<svg viewBox="0 0 24 24" focusable="false"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"></path></svg>',
    integrations: '<svg viewBox="0 0 24 24" focusable="false"><path d="m10.5 13.5 3-3"></path><path d="m7.8 16.2-1.5 1.5a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0"></path><path d="m16.2 7.8 1.5-1.5a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0"></path></svg>',
    infrastructure: '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.16 8.2 4.9 4.9 0 0 0 7 18Z"></path><path d="M12 11v5"></path><path d="m10 13 2-2 2 2"></path></svg>',
    quality: '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.5"></circle><path d="m8.2 12.1 2.5 2.6 5.2-5.5"></path></svg>',
    data: '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 19V11"></path><path d="M11 19V5"></path><path d="M17 19v-8"></path><path d="M3 19h18"></path></svg>',
    monitoring: '<svg viewBox="0 0 24 24" focusable="false"><path d="M3 12h4l2.2-5 4 10 2.2-5H21"></path></svg>',
  };

  const serviceList = document.querySelector(".service-explorer__list");
  let serviceMobileOpen = null;

  const applyServiceMode = () => {
    const isMobile = mobileQuery.matches;

    if (isMobile) {
      serviceList.removeAttribute("role");
      serviceList.removeAttribute("aria-orientation");
      servicePanel.setAttribute("role", "region");
      servicePanel.removeAttribute("tabindex");
      serviceOptions.forEach((option) => {
        option.removeAttribute("role");
        option.removeAttribute("aria-selected");
        option.removeAttribute("tabindex");
        option.setAttribute("aria-controls", "service-panel");
        option.setAttribute("aria-expanded", String(option === serviceMobileOpen));
        option.classList.toggle("is-active", option === serviceMobileOpen);
      });
      if (serviceMobileOpen) {
        serviceMobileOpen.after(servicePanel);
        servicePanel.classList.remove("is-mobile-collapsed");
      } else {
        servicePanel.classList.add("is-mobile-collapsed");
      }
      return;
    }

    serviceList.setAttribute("role", "tablist");
    serviceList.setAttribute("aria-orientation", "vertical");
    servicePanel.setAttribute("role", "tabpanel");
    servicePanel.setAttribute("tabindex", "0");
    servicePanel.classList.remove("is-mobile-collapsed");
    serviceList.after(servicePanel);
    const current = serviceMobileOpen || serviceOptions[0];
    serviceOptions.forEach((option) => {
      option.setAttribute("role", "tab");
      option.removeAttribute("aria-expanded");
      const isSelected = option === current;
      option.classList.toggle("is-active", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
      option.tabIndex = isSelected ? 0 : -1;
    });
    servicePanel.setAttribute("aria-labelledby", current.id);
  };

  const fillServicePanel = (selectedOption) => {
    servicePanelTitle.textContent = selectedOption.querySelector(".service-explorer__title")?.textContent.trim() || "Solución";
    servicePanelDescription.textContent = selectedOption.dataset.serviceDescription || "";
    servicePanelBenefit.textContent = selectedOption.dataset.serviceBenefit || "";
    servicePanelIcon.innerHTML = serviceIcons[selectedOption.dataset.serviceOption] || "";
  };

  const toggleServiceMobile = (option) => {
    if (serviceMobileOpen === option) {
      serviceMobileOpen = null;
    } else {
      serviceMobileOpen = option;
      fillServicePanel(option);
      servicePanel.setAttribute("aria-labelledby", option.id);
    }
    applyServiceMode();
    if (serviceMobileOpen) {
      option.scrollIntoView({ block: "start", behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    }
  };

  const setSelectedService = (selectedOption, shouldFocus = false) => {
    serviceMobileOpen = selectedOption;
    serviceOptions.forEach((option) => {
      const isSelected = option === selectedOption;
      option.classList.toggle("is-active", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
      option.tabIndex = isSelected ? 0 : -1;
    });

    servicePanel.setAttribute("aria-labelledby", selectedOption.id);
    servicePanelTitle.textContent = selectedOption.querySelector(".service-explorer__title")?.textContent.trim() || "Solución";
    servicePanelDescription.textContent = selectedOption.dataset.serviceDescription || "";
    servicePanelBenefit.textContent = selectedOption.dataset.serviceBenefit || "";
    servicePanelIcon.innerHTML = serviceIcons[selectedOption.dataset.serviceOption] || "";

    if (shouldFocus) {
      selectedOption.focus();
    }
  };

  applyServiceMode();
  mobileQuery.addEventListener("change", applyServiceMode);

  serviceOptions.forEach((option, index) => {
    option.addEventListener("click", () => {
      if (mobileQuery.matches) {
        toggleServiceMobile(option);
        return;
      }
      setSelectedService(option);
    });
    option.addEventListener("keydown", (event) => {
      const navigationKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (mobileQuery.matches || !navigationKeys.includes(event.key)) return;

      event.preventDefault();
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? serviceOptions.length - 1 : (index + (event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1) + serviceOptions.length) % serviceOptions.length;
      setSelectedService(serviceOptions[nextIndex], true);
    });
  });
}
const heroFlow = document.querySelector(".hero-flow");

if (heroFlow && !prefersReducedMotion.matches) {
  heroFlow.classList.add("hero-flow--anim");
  const playHeroFlow = () => heroFlow.classList.add("is-playing");

  if ("IntersectionObserver" in window) {
    const flowObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        playHeroFlow();
        flowObserver.disconnect();
      }
    }, { threshold: 0.4 });
    flowObserver.observe(heroFlow);
  } else {
    playHeroFlow();
  }
}

const catalogCarousel = document.querySelector("[data-carousel]");

if (catalogCarousel) {
  const track = catalogCarousel.querySelector("[data-carousel-track]");
  const dots = catalogCarousel.querySelector("[data-carousel-dots]");
  const prevButton = catalogCarousel.querySelector("[data-carousel-prev]");
  const nextButton = catalogCarousel.querySelector("[data-carousel-next]");
  const cards = Array.from(track.children);

  cards.forEach(() => dots.appendChild(document.createElement("i")));

  const cardStep = () => {
    const first = cards[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first ? first.getBoundingClientRect().width + gap : track.clientWidth;
  };

  const updateCarousel = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, track.scrollLeft / maxScroll)) : 0;
    const index = Math.round(progress * (cards.length - 1));
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    prevButton.disabled = track.scrollLeft <= 2;
    nextButton.disabled = track.scrollLeft >= maxScroll;
  };

  const scrollByCards = (direction) => {
    track.scrollBy({ left: direction * cardStep() * 2, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  };

  prevButton.addEventListener("click", () => scrollByCards(-1));
  nextButton.addEventListener("click", () => scrollByCards(1));
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateCarousel), { passive: true });
  window.addEventListener("resize", updateCarousel);
  updateCarousel();
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
      const position = Number(indicator.dataset.processIndicator);
      indicator.classList.toggle("is-active", position === Number(stepNumber));
      indicator.classList.toggle("is-done", position < Number(stepNumber));
    });
    processSteps.forEach((step) => {
      step.classList.toggle("is-reached", Number(step.dataset.processStep) <= Number(stepNumber));
    });
    processScrolly.style.setProperty("--process-progress", String((Number(stepNumber) - 1) / Math.max(1, processSteps.length - 1)));

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

  const stepperBars = Array.from(processScrolly.querySelectorAll(".process__stepper-bar i"));
  const stepperCount = processScrolly.querySelector("[data-process-count]");
  const prevStep = processScrolly.querySelector("[data-process-prev]");
  const nextStep = processScrolly.querySelector("[data-process-next]");
  const stepsList = processScrolly.querySelector(".process__steps");
  let mobileStepIndex = 0;

  const showMobileStep = (index, userAction = false) => {
    mobileStepIndex = Math.max(0, Math.min(processSteps.length - 1, index));
    processSteps.forEach((step, i) => {
      step.classList.toggle("is-mobile-hidden", i !== mobileStepIndex);
      if (i !== mobileStepIndex) step.setAttribute("aria-hidden", "true"); else step.removeAttribute("aria-hidden");
    });
    stepperBars.forEach((bar, i) => bar.classList.toggle("is-on", i <= mobileStepIndex));
    if (stepperCount) stepperCount.textContent = "Paso " + (mobileStepIndex + 1) + " de " + processSteps.length;
    if (prevStep) prevStep.disabled = mobileStepIndex === 0;
    if (nextStep) nextStep.disabled = mobileStepIndex === processSteps.length - 1;
    setActiveProcessStep(processSteps[mobileStepIndex]);
    if (userAction) {
      const top = processScrolly.querySelector(".process__stepper").getBoundingClientRect().top;
      if (top < 72) window.scrollBy({ top: top - 88, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    }
  };

  const applyProcessMode = () => {
    if (mobileQuery.matches) {
      processScrolly.classList.add("process--stepper");
      showMobileStep(mobileStepIndex);
    } else {
      processScrolly.classList.remove("process--stepper");
      processSteps.forEach((step) => { step.classList.remove("is-mobile-hidden"); step.removeAttribute("aria-hidden"); });
    }
  };

  if (prevStep && nextStep && stepsList) {
    prevStep.addEventListener("click", () => showMobileStep(mobileStepIndex - 1, true));
    nextStep.addEventListener("click", () => showMobileStep(mobileStepIndex + 1, true));
    let touchStartX = 0;
    stepsList.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    stepsList.addEventListener("touchend", (event) => {
      if (!processScrolly.classList.contains("process--stepper")) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) showMobileStep(mobileStepIndex + (delta < 0 ? 1 : -1), true);
    }, { passive: true });
    mobileQuery.addEventListener("change", applyProcessMode);
  }

  processScrolly.classList.add("process--reveal");
  processSteps.forEach((step) => {
    processObserver.observe(step);
  });
  if (processSteps[0]) setActiveProcessStep(processSteps[0]);
  applyProcessMode();
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
      const name = fields.name.value.trim();
      const company = fields.company?.value.trim() || "";
      const phone = fields.phone?.value.trim() || "";
      const whatsappMessage = [
        `Hola Jonathan, soy ${name}${company ? ` de ${company}` : ""}.`,
        `Necesito: ${fields.problemType.value}.`,
        fields.message.value.trim().slice(0, 900),
        `Contacto: ${fields.email.value.trim()}${phone ? ` / ${phone}` : ""}`,
      ].join("\n");
      window.open(buildWhatsappUrl(whatsappMessage), "_blank", "noopener,noreferrer");
      setContactStatus("Abrimos WhatsApp con tu mensaje para que puedas enviarlo. Si no se abrió, abre", { includeWhatsapp: true });
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
  if (bookingEndpoint) {
    bookingPanel.hidden = false;
  }
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
