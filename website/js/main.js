(function () {
  // Fill in the numeric Apple ID from App Store Connect once the App is live.
  // Leave empty before release: the download buttons then read "coming soon" and link nowhere.
  const APP_STORE_ID = "";
  const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/id${APP_STORE_ID}` : null;
  const SITE_ORIGIN = "https://cangshuge.nonoor.com";

  function setMeta(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  function render(lang) {
    const copy = window.SITE_I18N[lang];

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = copy[node.dataset.i18n];
      if (typeof value === "string") node.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const value = copy[node.dataset.i18nHtml];
      if (typeof value === "string") node.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-list]").forEach((node) => {
      const items = copy[node.dataset.i18nList] || [];
      node.replaceChildren(...items.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }));
    });
    document.querySelectorAll("img[data-shot]").forEach((img) => {
      img.src = `./assets/screenshots/${lang}/${img.dataset.shot}.jpg`;
    });

    document.title = copy.metaTitle;
    setMeta('meta[name="description"]', copy.metaDescription);
    setMeta('meta[property="og:title"]', copy.metaTitle);
    setMeta('meta[property="og:description"]', copy.metaDescription);
    setMeta('meta[property="og:image"]', `${SITE_ORIGIN}/assets/og-${lang}.jpg`);

    document.querySelectorAll("[data-app-store]").forEach((link) => {
      const label = link.querySelector("span");
      if (APP_STORE_URL) {
        link.href = APP_STORE_URL;
        label.textContent = copy.download;
      } else {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.classList.add("is-pending");
        label.textContent = copy.comingSoon;
      }
    });

    const query = lang === window.SiteLang.DEFAULT_LANG ? "" : `?lang=${lang}`;
    document.querySelectorAll("[data-legal-link]").forEach((link) => {
      link.href = `./${link.dataset.legalLink}/${query}`;
    });

    window.SiteLang.bindSwitcher(lang, render);
  }

  function revealOnScroll() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    targets.forEach((node) => observer.observe(node));
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  render(window.SiteLang.detect());
  revealOnScroll();
})();
