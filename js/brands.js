// 자사 브랜드와 수입 브랜드를 한 페이지에서 보여준다.
// 두 목록 모두 brands-content 문서 하나에 들어 있고(brands / importedBrands),
// 상단 탭으로 전체 / 자사 / 수입을 걸러본다.
let filter = "all";

const GROUP_COPY = {
  own: {
    title: "부명 자사 프리미엄 브랜드",
    titleEn: "BOOMYUNG Premium Brands",
    desc: "자체 R&D와 직영 제조 공장에서 원칙을 지켜 생산하는 대한민국 펫 케어 브랜드입니다.",
    descEn: "Korean pet care brands developed in our own R&D lab and produced in our own plants.",
  },
  imported: {
    title: "해외 수입 브랜드",
    titleEn: "Global Imported Brands",
    desc: "부명이 직접 선별해 국내에 공급하는 해외 프리미엄 브랜드입니다.",
    descEn: "Premium overseas brands hand-picked by BOOMYUNG for the Korean market.",
  },
};

const FILTER_LABELS = {
  all: { ko: "전체 브랜드", en: "All Brands" },
  own: { ko: "자사 브랜드", en: "Our Brands" },
  imported: { ko: "수입 브랜드", en: "Imported Brands" },
};

function renderPageHero(data, lang) {
  const root = document.getElementById("page-hero-root");
  if (data.image) root.querySelector("img.hero-bg").src = data.image;
  root.querySelector(".eyebrow span").textContent = t(data, "eyebrow", lang);
  root.querySelector("h1").textContent = t(data, "title", lang);
  root.querySelector(".hero-body").textContent = t(data, "body", lang);
}

function renderFilterBar(lang, ownCount, importedCount) {
  const counts = { all: ownCount + importedCount, own: ownCount, imported: importedCount };
  document.querySelectorAll(".brand-filter-btn").forEach((btn) => {
    const key = btn.dataset.filter;
    btn.querySelector(".label").textContent = FILTER_LABELS[key][lang === "en" ? "en" : "ko"];
    btn.querySelector(".count").textContent = counts[key];
    btn.classList.toggle("active", key === filter);
  });
}

function renderGroup(groupId, gridId, list, copy, anchorPrefix, lang) {
  const group = document.getElementById(groupId);
  group.querySelector(".brand-group-title").textContent = lang === "en" ? copy.titleEn : copy.title;
  group.querySelector(".brand-group-desc").textContent = lang === "en" ? copy.descEn : copy.desc;

  const grid = document.getElementById(gridId);
  grid.innerHTML = "";
  const catalogLabel = lang === "en" ? "View in product catalog" : "제품 카탈로그에서 보기";
  list.forEach((b) => {
    const name = lang === "en" ? b.nameEn || b.nameKo : b.nameKo;
    const desc = lang === "en" ? b.descriptionEn || b.descriptionKo : b.descriptionKo;
    const tagline = (lang === "en" ? b.taglineEn : b.tagline) || b.tagline;
    grid.appendChild(
      el(
        "a",
        {
          class: "brand-card",
          id: `${anchorPrefix}-${b.id}`,
          href: `catalog.html?brand=${b.id}`,
          style: `--accent:${b.color || "#1B3A91"}`,
          "data-reveal": "",
        },
        [
          el("div", { class: "brand-card-logo" }, b.logo ? [el("img", { src: b.logo, alt: name })] : [el("span", { text: name })]),
          el("div", { class: "brand-card-body" }, [
            tagline ? el("p", { class: "brand-card-tagline", text: tagline }) : null,
            el("h3", { class: "brand-card-name", text: name }),
            el("p", { class: "brand-card-desc", text: desc }),
          ]),
          el("span", { class: "brand-card-link", text: `${catalogLabel} →` }),
        ]
      )
    );
  });
}

function applyFilter() {
  document.getElementById("own-group").hidden = filter === "imported";
  document.getElementById("imported-group").hidden = filter === "own";
}

function render(content, lang) {
  renderFooter(content.footer, lang);
  renderPageHero(content.intro, lang);

  const own = content.brands || [];
  const imported = content.importedBrands || [];

  renderFilterBar(lang, own.length, imported.length);
  renderGroup("own-group", "own-grid", own, GROUP_COPY.own, "own", lang);
  renderGroup("imported-group", "imported-grid", imported, GROUP_COPY.imported, "imported", lang);
  applyFilter();
  observeReveals();
}

(async function init() {
  setupHeaderScroll();
  const content = await loadContent("/api/brands-content", "content/brands.json");

  document.getElementById("brand-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".brand-filter-btn");
    if (!btn) return;
    filter = btn.dataset.filter;
    document.querySelectorAll(".brand-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
    applyFilter();
  });

  setupLangToggle((lang) => render(content, lang));

  // 헤더 메뉴에서 특정 브랜드를 눌러 들어온 경우 해당 카드로 스크롤한다.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ block: "center" });
  }
})();
