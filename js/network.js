let lang = "ko";

function renderPageHero(data) {
  const root = document.getElementById("page-hero-root");
  if (data.image) root.querySelector("img.hero-bg").src = data.image;
  root.querySelector(".eyebrow span").textContent = t(data, "eyebrow", lang);
  root.querySelector("h1").textContent = t(data, "title", lang);
  root.querySelector(".hero-body").textContent = t(data, "body", lang);
}

function renderExhibitions(intro, list) {
  document.querySelector("#expo-root .section-title").textContent = t(intro, "title");
  const root = document.getElementById("expo-list");
  root.innerHTML = "";
  list.forEach((expo) => {
    root.appendChild(
      el("div", { class: "expo-block", "data-reveal": "" }, [
        el("div", { class: "expo-head" }, [
          el("h3", { text: t(expo, "title") }),
          el("span", { class: "expo-location", text: t(expo, "location") }),
        ]),
        el(
          "div",
          { class: "expo-gallery" },
          expo.photos.map((src) => el("div", { class: "expo-photo" }, [el("img", { src, alt: t(expo, "title"), loading: "lazy" })]))
        ),
      ])
    );
  });
}

function renderLogoSection(rootId, gridId, intro, list, muted) {
  const root = document.getElementById(rootId);
  root.querySelector(".section-title").textContent = t(intro, "title");
  const bodyEl = root.querySelector(".section-body");
  if (bodyEl) bodyEl.textContent = t(intro, "body");
  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  list.forEach((item) => {
    grid.appendChild(
      item.logo
        ? el("div", { class: "logo-card" + (muted ? " muted" : "") }, [el("img", { src: item.logo, alt: item.name, loading: "lazy" })])
        : el("div", { class: "logo-card placeholder" }, [el("span", { text: lang === "en" ? "Logo coming soon" : "로고 추가 예정" })])
    );
  });
}

function render(content, newLang) {
  lang = newLang;
  renderFooter(content.footer, lang);
  renderPageHero(content.hero);
  renderExhibitions(content.expoIntro, content.exhibitions);
  renderLogoSection("retail-root", "retail-grid", content.retailIntro, content.retailers, false);
  renderLogoSection("distributors-root", "distributor-grid", content.distributorIntro, content.distributors, true);
  observeReveals();
}

(async function init() {
  setupHeaderScroll();
  const content = await loadContent("/api/network-content", "content/network.json");
  setupLangToggle((newLang) => render(content, newLang));
})();
