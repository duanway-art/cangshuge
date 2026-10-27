window.SiteLang = (function () {
  const STORAGE_KEY = "cangshuge.lang";
  const SUPPORTED = ["zh-Hans", "zh-Hant", "en", "ja", "ko"];
  const DEFAULT_LANG = "zh-Hans";
  const HTML_LANG = { "zh-Hans": "zh-CN", "zh-Hant": "zh-TW", en: "en", ja: "ja", ko: "ko" };

  function normalize(raw) {
    if (!raw) return null;
    const value = String(raw).toLowerCase().replace(/_/g, "-");
    if (/^zh-(hant|tw|hk|mo)/.test(value)) return "zh-Hant";
    if (value.startsWith("zh")) return "zh-Hans";
    if (value.startsWith("en")) return "en";
    if (value.startsWith("ja")) return "ja";
    if (value.startsWith("ko")) return "ko";
    return null;
  }

  function stored() {
    try {
      return normalize(localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return null;
    }
  }

  function detect() {
    const fromQuery = normalize(new URLSearchParams(window.location.search).get("lang"));
    if (fromQuery) return fromQuery;
    const fromStorage = stored();
    if (fromStorage) return fromStorage;
    for (const lang of navigator.languages || [navigator.language]) {
      const normalized = normalize(lang);
      if (normalized) return normalized;
    }
    return DEFAULT_LANG;
  }

  function remember(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
  }

  function bindSwitcher(current, onChange) {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      const active = button.dataset.lang === current;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.onclick = () => {
        remember(button.dataset.lang);
        onChange(button.dataset.lang);
      };
    });
    document.documentElement.lang = HTML_LANG[current];
    document.documentElement.dataset.lang = current;
  }

  return { SUPPORTED, DEFAULT_LANG, detect, bindSwitcher };
})();
