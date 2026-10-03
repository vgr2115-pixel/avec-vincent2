/* Coordonnées publiques : renseigner ici une seule fois. */
const CONFIG = {
  email: "",
  phone: "",
  city: "Lyon et alentours"
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = mobileMenu?.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(Boolean(open)));
  });
  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  document.querySelectorAll("[data-config]").forEach(element => {
    const key = element.dataset.config;
    const value = CONFIG[key];
    if (!value) {
      element.hidden = true;
      return;
    }
    if (element.matches("a")) {
      element.textContent = value;
      element.href = key === "email" ? `mailto:${value}` : `tel:${value.replace(/\s+/g, "")}`;
    } else element.textContent = value;
  });
  document.querySelectorAll("[data-city]").forEach(element => element.textContent = CONFIG.city);
  document.querySelectorAll("[data-year]").forEach(element => element.textContent = new Date().getFullYear());

  document.querySelectorAll(".contact-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      if (!CONFIG.email) {
        status.textContent = "Le formulaire est prêt. Renseignez d’abord votre e-mail dans script.js.";
        return;
      }
      const data = new FormData(form);
      const subject = `Demande de cours — ${data.get("name") || "nouveau contact"}`;
      const body = [
        `Nom : ${data.get("name") || ""}`,
        `E-mail : ${data.get("email") || ""}`,
        `Téléphone : ${data.get("phone") || ""}`,
        `Niveau : ${data.get("level") || ""}`,
        `Besoin : ${data.get("subject") || ""}`,
        "",
        data.get("message") || ""
      ].join("\n");
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Votre messagerie va s’ouvrir pour envoyer la demande.";
    });
  });
});
