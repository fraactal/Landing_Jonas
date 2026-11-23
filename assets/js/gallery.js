/* Spec 074: galería ampliada de proyectos (catálogos, aplicaciones y Vesta ESG).
   Mejora progresiva: sin JS las imágenes se ven igual que antes. */
(() => {
  "use strict";

  const GROUPS = ".catalog-card, .app-showcase__item, .featured-project";
  const IMG_BASE = "assets/images/products/";
  let dialog, titleEl, countEl, stage, imgEl, prevBtn, nextBtn, thumbs;
  let items = [];
  let index = 0;
  let touchX = null;

  const parseExtra = (value) =>
    (value || "").split(";;").map((part) => part.split("|")).filter((p) => p[0]).map(([src, alt]) => ({ src: IMG_BASE + src.trim(), alt: (alt || "").trim() }));

  const collect = (group) => {
    const explicit = parseExtra(group.dataset.gallery);
    if (explicit.length) return explicit;
    return [...group.querySelectorAll("img")].map((img) => ({ src: img.currentSrc || img.src, alt: img.alt }));
  };

  const build = () => {
    dialog = document.createElement("dialog");
    dialog.className = "gallery";
    dialog.setAttribute("aria-label", "Galería del proyecto");
    dialog.innerHTML =
      '<div class="gallery__bar"><div class="gallery__heading"><strong class="gallery__title"></strong><span class="gallery__count" aria-live="polite"></span></div>' +
      '<button type="button" class="gallery__close" aria-label="Cerrar galería">&times;</button></div>' +
      '<div class="gallery__body"><button type="button" class="gallery__nav gallery__nav--prev" aria-label="Imagen anterior">&#8249;</button>' +
      '<div class="gallery__stage"><img class="gallery__img" alt=""></div>' +
      '<button type="button" class="gallery__nav gallery__nav--next" aria-label="Imagen siguiente">&#8250;</button></div>' +
      '<div class="gallery__thumbs" role="list"></div>';
    document.body.append(dialog);
    titleEl = dialog.querySelector(".gallery__title");
    countEl = dialog.querySelector(".gallery__count");
    stage = dialog.querySelector(".gallery__stage");
    imgEl = dialog.querySelector(".gallery__img");
    prevBtn = dialog.querySelector(".gallery__nav--prev");
    nextBtn = dialog.querySelector(".gallery__nav--next");
    thumbs = dialog.querySelector(".gallery__thumbs");

    dialog.querySelector(".gallery__close").addEventListener("click", () => dialog.close());
    prevBtn.addEventListener("click", () => show(index - 1));
    nextBtn.addEventListener("click", () => show(index + 1));
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
    dialog.addEventListener("close", () => document.documentElement.classList.remove("has-gallery"));
    stage.addEventListener("touchstart", (event) => { touchX = event.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (event) => {
      if (touchX === null) return;
      const dx = event.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    });
    thumbs.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-i]");
      if (btn) show(Number(btn.dataset.i));
    });
  };

  const show = (next) => {
    if (!items.length) return;
    index = (next + items.length) % items.length;
    const item = items[index];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    stage.scrollTop = 0;
    countEl.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : "";
    thumbs.querySelectorAll("[data-i]").forEach((btn) => btn.setAttribute("aria-current", String(Number(btn.dataset.i) === index)));
  };

  const open = (group, start) => {
    if (!dialog) build();
    items = collect(group);
    if (!items.length) return;
    titleEl.textContent = group.querySelector("h4, h3")?.textContent.trim() || "Proyecto";
    const multi = items.length > 1;
    prevBtn.hidden = nextBtn.hidden = !multi;
    thumbs.hidden = !multi;
    thumbs.innerHTML = multi ? items.map((it, i) => `<button type="button" data-i="${i}" role="listitem" aria-label="Ver imagen ${i + 1}"><img src="${it.src}" alt="" loading="lazy"></button>`).join("") : "";
    document.documentElement.classList.add("has-gallery");
    dialog.showModal();
    show(start || 0);
  };

  const init = () => {
    if (typeof HTMLDialogElement === "undefined") return;
    document.querySelectorAll(GROUPS).forEach((group) => {
      const figures = group.querySelectorAll("figure");
      figures.forEach((figure, i) => {
        const label = (group.querySelector("h4, h3")?.textContent.trim() || "proyecto");
        figure.classList.add("is-zoomable");
        figure.setAttribute("role", "button");
        figure.tabIndex = 0;
        figure.setAttribute("aria-label", `Ampliar capturas de ${label}`);
        const go = () => {
          const explicit = parseExtra(group.dataset.gallery);
          const src = figure.querySelector("img")?.getAttribute("src") || "";
          let start = i;
          if (explicit.length) {
            const base = src.split("/").pop().replace(/\.webp$/, "");
            const found = explicit.findIndex((e) => e.src.split("/").pop().startsWith(base));
            start = found >= 0 ? found : 0;
          }
          open(group, start);
        };
        figure.addEventListener("click", go);
        figure.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); go(); }
        });
      });
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
