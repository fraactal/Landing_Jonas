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
