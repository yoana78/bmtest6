let lang = "ko";

function renderPageHero(data) {
  const root = document.getElementById("page-hero-root");
  const img = root.querySelector("img.hero-bg");
  const video = document.getElementById("mfg-hero-video");
  if (data.image) img.src = data.image;
  // 공장 가동 영상이 등록되어 있으면 배경 이미지 대신 영상을 재생한다.
  if (data.video) {
    video.src = data.video;
    if (data.image) video.poster = data.image;
    video.hidden = false;
    video.play().catch(() => {});
  } else {
    video.hidden = true;
    video.removeAttribute("src");
  }
  root.querySelector(".eyebrow span").textContent = t(data, "eyebrow", lang);
  root.querySelector("h1").textContent = t(data, "title", lang);
  root.querySelector(".hero-body").textContent = t(data, "body", lang);
}

function openLightbox(src, alt, caption) {
  const box = document.getElementById("image-lightbox");
  const img = document.getElementById("lightbox-img");
  img.src = src;
  img.alt = alt || "";
  document.getElementById("lightbox-caption-title").textContent = caption || alt || "";
  box.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("image-lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

function setupLightbox() {
  const box = document.getElementById("image-lightbox");
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  box.addEventListener("click", (e) => {
    if (e.target === box) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// ---------- 공장 섹션 (사료 / 모래 공용) ----------

function renderSectionIntro(rootId, eyebrowId, intro) {
  const root = document.getElementById(rootId);
  document.getElementById(eyebrowId).textContent = t(intro, "eyebrow", lang);
  root.querySelector(".section-title").textContent = t(intro, "title", lang);
  root.querySelector(".section-body").textContent = t(intro, "body", lang);
}

function renderCapabilities(rootId, list) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  (list || []).forEach((c) => {
    root.appendChild(
      el("div", { class: "mfg-capability", "data-reveal": "" }, [
        el("h3", { text: t(c, "title", lang) }),
        el("p", { text: t(c, "body", lang) }),
      ])
    );
  });
}

// 모래 공장 제조 단계: 번호가 붙은 카드가 화살표로 이어진다.
function renderSteps(rootId, list) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  (list || []).forEach((c, i) => {
    root.appendChild(
      el("div", { class: "mfg-step", "data-reveal": "" }, [
        el("span", { class: "mfg-step-num", text: `STEP ${String(i + 1).padStart(2, "0")}` }),
        el("h3", { text: t(c, "title", lang) }),
        el("p", { text: t(c, "body", lang) }),
      ])
    );
  });
}

// 대표 매체 한 칸: 영상이 있으면 영상을, 없으면 사진을 보여준다.
function renderMedia(rootId, intro) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  if (intro && intro.video) {
    const video = el("video", { class: "mfg-video", muted: "", loop: "", playsinline: "", autoplay: "", preload: "metadata" });
    if (intro.image) video.poster = intro.image;
    video.src = intro.video;
    video.muted = true;
    root.appendChild(video);
    video.play().catch(() => {});
  } else if (intro && intro.image) {
    root.appendChild(el("img", { class: "mfg-photo", src: intro.image, alt: t(intro, "title", lang), loading: "lazy" }));
  }
}

function renderGallery(rootId, list, captionFallback, numbered) {
  const root = document.getElementById(rootId);
  root.innerHTML = "";
  (list || []).forEach((item) => {
    const src = typeof item === "string" ? item : item.image;
    if (!src) return;
    const caption = typeof item === "string" ? "" : t(item, "caption", lang);
    const card = el("figure", { class: "mfg-gallery-item clickable", "data-reveal": "" }, [
      el("img", { src, alt: caption || captionFallback, loading: "lazy" }),
    ]);
    if (numbered) card.appendChild(el("span", { class: "mfg-gallery-step", text: String(root.children.length + 1).padStart(2, "0") }));
    if (caption) card.appendChild(el("figcaption", { text: caption }));
    card.addEventListener("click", () => openLightbox(src, caption || captionFallback, caption));
    root.appendChild(card);
  });
}

// ---------- 품질 인증 / 지식재산권 ----------

const CERT_LOGO_MAP = {
  "ISO 14001": "assets/cert_logos/iso14001.png",
  "ISO 22000": "assets/cert_logos/iso22000.png",
  "HACCP": "assets/cert_logos/haccp.png",
  "AAFCO": "assets/cert_logos/aafco.png",
};

function renderCertifications(intro, list) {
  document.querySelector("#cert-root .bm-trust-title").textContent = t(intro, "title", lang);
  document.querySelector("#cert-root .bm-trust-desc").textContent = t(intro, "body", lang);
  const grid = document.getElementById("cert-grid");
  grid.innerHTML = "";
  list.forEach((c) => {
    const logo = CERT_LOGO_MAP[c.code];
    const badgeClass = "bm-cert-logo-badge" + (c.code === "AAFCO" ? " aafco" : "");
    const currentImg = (lang === "en" && c.imageEn) || c.image;
    const card = el("div", { class: "bm-cert-card" + (currentImg ? " clickable" : ""), "data-reveal": "" }, [
      el("div", { class: "bm-cert-badge-wrap" }, [
        el("span", { class: "bm-cert-code", text: c.code }),
        el("div", { class: badgeClass }, logo ? [el("img", { src: logo, alt: c.code })] : []),
      ]),
      el("h3", { class: "bm-cert-card-title", text: t(c, "title", lang) }),
      el("p", { class: "bm-cert-card-desc", text: t(c, "body", lang) }),
    ]);
    if (currentImg) card.addEventListener("click", () => openLightbox(currentImg, c.code, `${c.code} — ${t(c, "title", lang)}`));
    grid.appendChild(card);
  });
}

function renderPatents(intro, list) {
  document.querySelector("#ip-root .section-title").textContent = t(intro, "title", lang);
  document.querySelector("#ip-root .section-body").textContent = t(intro, "body", lang);
  const grid = document.getElementById("patent-grid");
  grid.innerHTML = "";
  // 등록 종류는 데이터에 한글로만 들어있어서, 영어 모드 표시용 라벨을 여기서 매핑한다
  const typeEnMap = { "특허": "Patent", "디자인등록": "Design Registration" };
  list.forEach((p) => {
    const typeLabel = lang === "en" ? typeEnMap[p.type] || p.type : p.type;
    const card = el("div", { class: "patent-card", "data-reveal": "" }, [
      el("div", { class: "thumb" }, [el("img", { src: p.image, alt: t(p, "title", lang), loading: "lazy" })]),
      el("div", { class: "cap" }, [
        el("div", { class: "type", text: `${typeLabel} ${p.number}` }),
        el("div", { class: "num", text: t(p, "title", lang) }),
      ]),
    ]);
    if (p.image) {
      card.classList.add("clickable");
      card.addEventListener("click", () => openLightbox(p.image, t(p, "title", lang)));
    }
    grid.appendChild(card);
  });
}

function render(content, newLang) {
  lang = newLang;
  renderFooter(content.footer, lang);
  renderPageHero(content.hero);

  renderSectionIntro("feed-root", "feed-eyebrow", content.feedIntro);
  renderMedia("feed-media", content.feedIntro);
  renderCapabilities("feed-capabilities", content.feedCapabilities);
  renderGallery("feed-gallery", content.feedGallery, t(content.feedIntro, "title", lang));

  renderCertifications(content.certIntro, content.certifications);
  renderPatents(content.ipIntro, content.patents);

  renderSectionIntro("litter-root", "litter-eyebrow", content.litterIntro);
  renderMedia("litter-media", content.litterIntro);
  renderSteps("litter-capabilities", content.litterCapabilities);
  renderGallery("litter-gallery", content.litterGallery, t(content.litterIntro, "title", lang), true);

  observeReveals();
}

(async function init() {
  setupHeaderScroll();
  setupLightbox();
  const content = await loadContent("/api/manufacturing-content", "content/manufacturing.json");
  setupLangToggle((newLang) => render(content, newLang));
})();
