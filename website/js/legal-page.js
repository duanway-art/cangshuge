(function () {
  const content = window.LEGAL_CONTENT;
  const kind = document.body.dataset.document;

  const UI = {
    "zh-Hans": { back: "返回首页", contact: "联系开发者" },
    "zh-Hant": { back: "返回首頁", contact: "聯絡開發者" },
    ja: { back: "ホームに戻る", contact: "開発者に連絡" },
    ko: { back: "홈으로 돌아가기", contact: "개발자에게 문의" },
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function sections(documentKind, lang) {
    const fragment = document.createDocumentFragment();
    content.documents[documentKind][lang].forEach(({ title, body }) => {
      const section = el("section", title ? "legal-section" : "legal-section legal-intro");
      if (title) section.append(el("h2", "", title));
      body.split("\n").filter(Boolean).forEach((line) => {
        section.append(el("p", line.startsWith("·") ? "legal-item" : "", line));
      });
      fragment.append(section);
    });
    return fragment;
  }

  function links(documentKind, lang) {
    const list = content.links[documentKind];
    if (!list) return null;
    const nav = el("nav", "legal-links");
    list.forEach(({ label, href }) => {
      const a = el("a", "", label[lang]);
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      nav.append(a);
    });
    return nav;
  }

  function render(lang) {
    const title = content.titles[kind][lang];
    const brand = content.brand[lang];
    document.title = `${title} · ${brand}`;

    document.getElementById("legal-brand").textContent = brand;
    document.getElementById("legal-title").textContent = title;
    document.getElementById("legal-updated").textContent = content.updated[lang];
    document.getElementById("legal-back").textContent = UI[lang].back;
    document.getElementById("legal-footer-brand").textContent = brand;
    document.getElementById("legal-link-privacy").textContent = content.titles.privacy[lang];
    document.getElementById("legal-link-terms").textContent = content.titles.terms[lang];
    document.getElementById("legal-link-contact").textContent = UI[lang].contact;

    const query = lang === window.SiteLang.DEFAULT_LANG ? "" : `?lang=${lang}`;
    document.getElementById("legal-back").href = `../${query}`;
    document.getElementById("legal-link-privacy").href = `../privacy/${query}`;
    document.getElementById("legal-link-terms").href = `../terms/${query}`;

    const body = document.getElementById("legal-sections");
    body.replaceChildren(sections(kind, lang));
    const extra = links(kind, lang);
    if (extra) body.append(extra);

    if (kind === "terms") {
      const appendix = el("section", "legal-appendix");
      appendix.id = "purchase";
      appendix.append(el("h2", "legal-appendix-title", content.titles.purchase[lang]));
      appendix.append(sections("purchase", lang));
      appendix.append(links("purchase", lang));
      body.append(appendix);
    }

    window.SiteLang.bindSwitcher(lang, render);
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  render(window.SiteLang.detect());
})();
