const root = document.documentElement;
const body = document.body;
const CONTACT_ENDPOINT = String(window.PORTFOLIO_CONFIG?.contactEndpoint || "").trim();
const MAX_MESSAGE_LENGTH = 2000;
const CONTACT_FIELD_NAMES = ["name", "email", "service", "message", "consent"];
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const slideLinks = Array.from(document.querySelectorAll("[data-slide-target]"));
const slidesTrack = document.getElementById("slides-track");
const slides = Array.from(document.querySelectorAll(".slide[data-slide]"));
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const indicatorsWrap = document.getElementById("carousel-indicators");
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const contactSubmit = document.getElementById("contact-submit");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopMedia = window.matchMedia("(min-width: 961px)");

let activeIndex = 0;
let isDesktopSlider = desktopMedia.matches;
let indicatorButtons = [];
let observer;
let ignoreHashChange = false;
let hasTriedContactSubmit = false;

function getSlideIndexById(targetId) {
  if (!targetId) {
    return -1;
  }

  return slides.findIndex((slide) => slide.id === targetId);
}

function syncHash(index) {
  const slideId = slides[index]?.id;
  if (!slideId) {
    return;
  }

  const nextHash = `#${slideId}`;
  if (window.location.hash === nextHash) {
    return;
  }

  ignoreHashChange = true;
  window.history.replaceState(null, "", nextHash);
  window.setTimeout(() => {
    ignoreHashChange = false;
  }, 0);
}

function buildIndicators() {
  if (!indicatorsWrap) {
    return;
  }

  indicatorsWrap.innerHTML = "";
  indicatorButtons = slides.map((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Ir a ${slide.id}`);
    button.addEventListener("click", () => goToSlide(index, { userTriggered: true, updateHash: true }));
    indicatorsWrap.appendChild(button);
    return button;
  });
}

function updateNavState() {
  const currentId = slides[activeIndex]?.id;

  slideLinks.forEach((link) => {
    const isActive = link.dataset.slideTarget === currentId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  indicatorButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === activeIndex);
  });
}

function updateControls() {
  if (prevButton) {
    prevButton.disabled = activeIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled = activeIndex === slides.length - 1;
  }
}

function applySlideTransform() {
  if (!slidesTrack || !isDesktopSlider) {
    return;
  }

  slidesTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
}

function closeSidebar() {
  if (!sidebar || !menuToggle || !sidebarOverlay) {
    return;
  }

  sidebar.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  sidebarOverlay.classList.remove("is-open");
  sidebarOverlay.hidden = true;
}

function openSidebar() {
  if (!sidebar || !menuToggle || !sidebarOverlay) {
    return;
  }

  sidebar.classList.add("is-open");
  menuToggle.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  sidebarOverlay.hidden = false;
  sidebarOverlay.classList.add("is-open");
}

function toggleSidebar() {
  if (!sidebar) {
    return;
  }

  if (sidebar.classList.contains("is-open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function goToSlide(index, options = {}) {
  const normalizedIndex = Number(index);
  const { userTriggered = false, updateHash = false } = options;

  if (!Number.isInteger(normalizedIndex) || normalizedIndex < 0 || normalizedIndex >= slides.length) {
    return;
  }

  activeIndex = normalizedIndex;
  updateNavState();
  updateControls();

  if (updateHash) {
    syncHash(activeIndex);
  }

  if (isDesktopSlider) {
    applySlideTransform();
    return;
  }

  if (userTriggered) {
    slides[activeIndex].scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  }
}

function handleNavClick(event) {
  const link = event.currentTarget;
  const targetId = link.dataset.slideTarget;
  const targetIndex = getSlideIndexById(targetId);

  if (targetIndex === -1) {
    return;
  }

  event.preventDefault();
  goToSlide(targetIndex, { userTriggered: true, updateHash: true });

  if (!isDesktopSlider) {
    closeSidebar();
  }
}

function observeSections() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (isDesktopSlider) {
        return;
      }

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      const index = slides.findIndex((slide) => slide.id === visible.target.id);
      if (index >= 0) {
        activeIndex = index;
        updateNavState();
        updateControls();
      }
    },
    {
      rootMargin: "-25% 0px -45% 0px",
      threshold: [0.25, 0.5, 0.7],
    }
  );

  slides.forEach((slide) => observer.observe(slide));
}

function syncMode() {
  isDesktopSlider = desktopMedia.matches;
  body.classList.toggle("is-desktop-slider", isDesktopSlider);
  slidesTrack?.style.removeProperty("transform");

  if (isDesktopSlider) {
    closeSidebar();
    applySlideTransform();
  }
}

function handleHashChange() {
  if (ignoreHashChange) {
    return;
  }

  const targetId = window.location.hash.replace("#", "");
  const targetIndex = getSlideIndexById(targetId);

  if (targetIndex === -1) {
    return;
  }

  goToSlide(targetIndex, { userTriggered: false, updateHash: false });
}

function handleKeyboard(event) {
  if (!isDesktopSlider) {
    return;
  }

  const targetTag = document.activeElement?.tagName;
  if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") {
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToSlide(Math.min(activeIndex + 1, slides.length - 1), { userTriggered: true, updateHash: true });
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToSlide(Math.max(activeIndex - 1, 0), { userTriggered: true, updateHash: true });
  }
}

function setContactStatus(message, type = "") {
  if (!contactStatus) {
    return;
  }

  contactStatus.textContent = message;
  contactStatus.classList.remove("is-success", "is-error");

  if (type) {
    contactStatus.classList.add(type);
  }
}

function getContactFieldControl(fieldName) {
  if (!contactForm) {
    return null;
  }

  return contactForm.elements.namedItem(fieldName);
}

function getContactFieldWrapper(fieldName) {
  const control = getContactFieldControl(fieldName);

  if (!control) {
    return null;
  }

  return fieldName === "consent" ? control.closest(".form-consent") : control.closest(".form-field");
}

function getContactFieldErrorId(fieldName) {
  const control = getContactFieldControl(fieldName);
  const fallbackId = `contact-${fieldName}`;
  return `${control?.id || fallbackId}-error`;
}

function setFieldError(fieldName, message) {
  const control = getContactFieldControl(fieldName);
  const wrapper = getContactFieldWrapper(fieldName);

  if (!control || !wrapper) {
    return;
  }

  wrapper.classList.add("is-invalid");
  control.setAttribute("aria-invalid", "true");

  const errorId = getContactFieldErrorId(fieldName);
  let errorNode = wrapper.querySelector(`#${errorId}`);

  if (!errorNode) {
    errorNode = document.createElement("p");
    errorNode.className = "field-error";
    errorNode.id = errorId;
    wrapper.appendChild(errorNode);
  }

  errorNode.textContent = message;
  control.setAttribute("aria-describedby", errorId);
}

function clearFieldError(fieldName) {
  const control = getContactFieldControl(fieldName);
  const wrapper = getContactFieldWrapper(fieldName);

  if (!control || !wrapper) {
    return;
  }

  wrapper.classList.remove("is-invalid");
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-describedby");
  wrapper.querySelector(`#${getContactFieldErrorId(fieldName)}`)?.remove();
}

function clearAllFieldErrors() {
  CONTACT_FIELD_NAMES.forEach(clearFieldError);
}

function readContactPayload() {
  if (!contactForm) {
    return null;
  }

  const formData = new FormData(contactForm);
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    reason: String(formData.get("service") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    consent: formData.get("consent") === "on",
    source: window.location.origin || "jonathanvaldes.com",
  };
}

function getContactFieldError(fieldName, payload) {
  switch (fieldName) {
    case "name":
      return payload.name ? "" : "Ingresa tu nombre.";
    case "email":
      if (!payload.email) {
        return "Ingresa tu correo electronico.";
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ? "" : "Ingresa un correo electronico valido.";
    case "service":
      return payload.reason ? "" : "Selecciona un motivo de contacto.";
    case "message":
      if (!payload.message) {
        return "Escribe un mensaje para continuar.";
      }
      return payload.message.length > MAX_MESSAGE_LENGTH ? `El mensaje no puede superar los ${MAX_MESSAGE_LENGTH} caracteres.` : "";
    case "consent":
      return payload.consent ? "" : "Debes aceptar el uso de tus datos para enviar el mensaje.";
    default:
      return "";
  }
}

function validateContactForm(payload) {
  const errors = {};

  CONTACT_FIELD_NAMES.forEach((fieldName) => {
    const message = getContactFieldError(fieldName, payload);
    if (message) {
      errors[fieldName] = message;
      setFieldError(fieldName, message);
    } else {
      clearFieldError(fieldName);
    }
  });

  return errors;
}

function bindContactFieldValidation() {
  CONTACT_FIELD_NAMES.forEach((fieldName) => {
    const control = getContactFieldControl(fieldName);
    if (!control) {
      return;
    }

    const eventName = fieldName === "service" || fieldName === "consent" ? "change" : "input";
    control.addEventListener(eventName, () => {
      if (!hasTriedContactSubmit) {
        return;
      }

      const payload = readContactPayload();
      if (!payload) {
        return;
      }

      const message = getContactFieldError(fieldName, payload);
      if (message) {
        setFieldError(fieldName, message);
      } else {
        clearFieldError(fieldName);
        const hasErrors = Object.keys(validateContactForm(payload)).length > 0;
        if (!hasErrors) {
          setContactStatus("", "");
        }
      }
    });
  });
}

function hasValidContactEndpoint() {
  return /^https?:\/\//i.test(CONTACT_ENDPOINT);
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!contactForm) {
    return;
  }

  hasTriedContactSubmit = true;
  const payload = readContactPayload();
  if (!payload) {
    return;
  }

  const errors = validateContactForm(payload);
  const firstInvalidField = CONTACT_FIELD_NAMES.find((fieldName) => errors[fieldName]);

  if (firstInvalidField) {
    setContactStatus("Revisa los campos marcados para continuar.", "is-error");
    getContactFieldControl(firstInvalidField)?.focus();
    return;
  }

  try {
    contactSubmit?.setAttribute("disabled", "true");
    setContactStatus("Enviando...");

    if (!hasValidContactEndpoint()) {
      setContactStatus("El formulario no esta configurado para recibir mensajes todavia.", "is-error");
      return;
    }

    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        reason: payload.reason,
        message: payload.message,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Error al enviar.");
    }

    contactForm.reset();
    clearAllFieldErrors();
    hasTriedContactSubmit = false;
    setContactStatus("Mensaje enviado correctamente.", "is-success");
  } catch (error) {
    setContactStatus(error.message || "Error al enviar.", "is-error");
  } finally {
    contactSubmit?.removeAttribute("disabled");
  }
}

function init() {
  root.classList.add("js");
  buildIndicators();
  observeSections();
  syncMode();

  const initialIndex = getSlideIndexById(window.location.hash.replace("#", ""));
  if (initialIndex >= 0) {
    goToSlide(initialIndex, { updateHash: false });
  } else {
    goToSlide(0, { updateHash: false });
  }

  slideLinks.forEach((link) => link.addEventListener("click", handleNavClick));

  menuToggle?.addEventListener("click", toggleSidebar);
  sidebarOverlay?.addEventListener("click", closeSidebar);
  prevButton?.addEventListener("click", () => goToSlide(activeIndex - 1, { userTriggered: true, updateHash: true }));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1, { userTriggered: true, updateHash: true }));

  desktopMedia.addEventListener("change", syncMode);
  window.addEventListener("resize", () => {
    if (isDesktopSlider) {
      applySlideTransform();
    }
  });
  window.addEventListener("keydown", handleKeyboard);
  window.addEventListener("hashchange", handleHashChange);
  contactForm?.addEventListener("submit", handleContactSubmit);
  bindContactFieldValidation();

  document.addEventListener("click", (event) => {
    if (isDesktopSlider || !sidebar || !menuToggle) {
      return;
    }

    const clickedInside = sidebar.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) {
      closeSidebar();
    }
  });
}

init();
