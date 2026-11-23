/* Spec 070: consentimiento de cookies y Meta Pixel.
   - Sin ID de Pixel configurado no se muestra aviso ni se carga nada.
   - El Pixel solo se carga después de aceptar explícitamente. */
(() => {
  "use strict";

  const STORAGE_KEY = "jv_cookie_consent";
  /* ID del Pixel de Meta (solo números). Vacío = sin Pixel, sin aviso y sin cookies. */
  const DEFAULT_PIXEL_ID = "";
  let pixelId = "";
  let pixelLoaded = false;
  let banner = null;

  const getChoice = () => {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
  };
  const setChoice = (value) => {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* sin almacenamiento */ }
  };

  const loadPixel = () => {
    if (pixelLoaded || !pixelId) return;
    pixelLoaded = true;
    /* Snippet estándar de Meta Pixel */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  };

  const track = (eventName) => {
    if (pixelLoaded && typeof window.fbq === "function") window.fbq("track", eventName);
  };

  const hideBanner = () => {
    if (banner) { banner.remove(); banner = null; }
  };

  const decide = (value) => {
    setChoice(value);
    hideBanner();
    if (value === "granted") loadPixel();
  };

  const showBanner = () => {
    if (banner || !pixelId) return;
    banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Preferencias de cookies");
    banner.innerHTML =
      '<p class="cookie-banner__text">Usamos Meta Pixel para medir el resultado de nuestros anuncios. Solo se activa si lo aceptas. ' +
      '<a href="/privacidad#privacy-cookies">Más información</a></p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="button button--secondary" data-cookie="denied">Rechazar</button>' +
      '<button type="button" class="button button--primary" data-cookie="granted">Aceptar</button></div>';
    banner.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-cookie]");
      if (btn) decide(btn.dataset.cookie);
    });
    document.body.append(banner);
  };

  const init = () => {
    pixelId = window.JV_PIXEL_ID || DEFAULT_PIXEL_ID;
    document.querySelectorAll("[data-cookie-settings]").forEach((el) => { el.hidden = !pixelId; });
    if (!pixelId) return;
    const choice = getChoice();
    if (choice === "granted") loadPixel();
    else if (choice !== "denied") showBanner();
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-cookie-settings]")) {
      showBanner();
      return;
    }
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href.startsWith("https://wa.me/") || href.startsWith("mailto:")) track("Contact");
  });
  document.addEventListener("jv:lead", () => track("Lead"));

  window.JVConsent = { init, decide, track };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
