const CONTENT = window.PORTFOLIO_CONTENT || {};

const PREVIEW_THEMES = [
  "commerce",
  "dashboard",
  "realestate",
  "events",
  "agency",
  "eco",
  "gaming",
  "music",
  "code",
  "generic"
];

const PREVIEW_ROTATION = ["gaming", "dashboard", "agency", "music", "code", "eco", "generic"];

const DEFAULT_TEXT = {
  type: "proyecto",
  objective: "Explorar la solucion, estructura y codigo fuente del proyecto.",
  status: "Terminado"
};

const navToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const projectGrid = document.querySelector("[data-project-grid]");
const projectTemplate = document.getElementById("project-card-template");
const emptyState = document.querySelector("[data-empty-state]");

const searchInput = document.querySelector('[data-filter="search"]');
const techSelect = document.querySelector('[data-filter="tech"]');
const typeSelect = document.querySelector('[data-filter="type"]');

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalStatus = document.getElementById("modal-status");
const modalObjective = document.getElementById("modal-objective");
const modalFeatures = document.getElementById("modal-features");
const modalStack = document.getElementById("modal-stack");
const modalShots = document.getElementById("modal-shots");
const modalLive = document.getElementById("modal-live");
const modalCode = document.getElementById("modal-code");
const modalNote = document.getElementById("modal-note");
const closeButtons = document.querySelectorAll("[data-close-modal]");

let lastFocused = null;
let closeTimer = null;

const toKey = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toLabel = (value) =>
  String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const setLink = (selector, href, text) => {
  const link = document.querySelector(selector);
  if (!link) return;
  if (href) link.href = href;
  if (text) link.textContent = text;
};

const setPreviewTheme = (element, theme, index = 0) => {
  if (!element) return;
  PREVIEW_THEMES.forEach((item) => element.classList.remove(`preview-${item}`));
  const key = PREVIEW_THEMES.includes(toKey(theme))
    ? toKey(theme)
    : PREVIEW_ROTATION[index % PREVIEW_ROTATION.length];
  element.classList.add(`preview-${key}`);
};

// Fallback de preview: captura remota cuando no hay imagen local definida.
const buildCaptureUrl = (liveUrl) => {
  if (!liveUrl) return "";
  return `https://image.thum.io/get/width/1600/noanimate/${liveUrl}`;
};

const applyCapturePreview = (previewElement, liveUrl, localImageUrl = "") => {
  if (!previewElement) return;

  const oldImage = previewElement.querySelector(".preview-image");
  if (oldImage) oldImage.remove();
  previewElement.classList.remove("has-live-preview");

  // Prioridad: imagen local subida por el usuario > captura automatica.
  const sourceUrl = localImageUrl || buildCaptureUrl(liveUrl);
  if (!sourceUrl) return;

  const image = document.createElement("img");
  image.className = "preview-image";
  image.src = sourceUrl;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.referrerPolicy = "no-referrer";

  image.addEventListener("error", () => {
    image.remove();
    previewElement.classList.remove("has-live-preview");
  });

  const previewUi = previewElement.querySelector(".preview-ui");
  if (previewUi) {
    previewElement.insertBefore(image, previewUi);
  } else {
    previewElement.append(image);
  }

  previewElement.classList.add("has-live-preview");
};

const parseRepoUrl = (repoUrl) => {
  try {
    const url = new URL(repoUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (!url.hostname.includes("github.com") || parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
  } catch {
    return null;
  }
};

const inferType = (name) => {
  const key = toKey(name);
  if (key.includes("python")) return "python";
  if (key.includes("juego") || key.includes("games") || key.includes("pacman")) return "juego";
  return DEFAULT_TEXT.type;
};

const inferTech = (name) => {
  const key = toKey(name);
  if (key.includes("python")) return ["Python"];
  if (key.includes("juego") || key.includes("games") || key.includes("pacman")) {
    return ["HTML", "CSS", "JavaScript"];
  }
  return ["JavaScript"];
};

const inferDescription = (name) => {
  const label = toLabel(name);
  return `Proyecto ${label} desarrollado como parte de mi portfolio.`;
};

const inferFeatures = (project) => {
  return [
    `Estructura organizada de ${project.name}`,
    "Interaccion principal implementada",
    "Repositorio listo para revision de codigo"
  ];
};

const inferShots = (project) => {
  return ["Vista principal", "Flujo de interaccion", "Detalle tecnico"];
};

const normalizeProject = (input, index) => {
  const base = typeof input === "string" ? { repo: input } : input || {};
  const repoMeta = parseRepoUrl(base.repo || base.codeUrl || "");
  const repoName = repoMeta?.repo || base.id || `proyecto-${index + 1}`;

  const name = base.name || toLabel(repoName);
  const type = base.type || inferType(repoName);
  const tech = Array.isArray(base.tech) && base.tech.length ? base.tech : inferTech(repoName);
  const codeUrl = base.codeUrl || base.repo || "";

  // Normaliza estructura para permitir configuracion minima en content.js.
  return {
    id: base.id || toKey(repoName),
    name,
    shortDescription: base.shortDescription || inferDescription(repoName),
    type,
    tech,
    objective: base.objective || DEFAULT_TEXT.objective,
    features: Array.isArray(base.features) && base.features.length ? base.features : inferFeatures({ name }),
    stack: Array.isArray(base.stack) && base.stack.length ? base.stack : tech,
    shots: Array.isArray(base.shots) && base.shots.length ? base.shots : inferShots({ name }),
    status: base.status || DEFAULT_TEXT.status,
    liveUrl: base.liveUrl || "",
    codeUrl,
    previewImage: base.previewImage || "",
    previewTheme: base.previewTheme || ""
  };
};

const projects = (Array.isArray(CONTENT.projects) ? CONTENT.projects : []).map(normalizeProject);
const projectById = new Map(projects.map((project) => [String(project.id || ""), project]));

const fillSiteContent = () => {
  const site = CONTENT.site || {};
  const links = CONTENT.links || {};
  const hero = CONTENT.hero || {};
  const sections = CONTENT.sections || {};
  const filters = CONTENT.filters || {};

  if (site.pageTitle) document.title = site.pageTitle;

  setText("#brand-name", site.brandName);
  setText("#hero-kicker", site.ownerRole);
  setText("#hero-title", hero.title);
  setText("#hero-subtitle", hero.subtitle);

  setText("#projects-eyebrow", sections.projectsEyebrow);
  setText("#projects-title", sections.projectsTitle);
  setText("#projects-description", sections.projectsDescription);

  setText("#about-eyebrow", sections.aboutEyebrow);
  setText("#about-title", sections.aboutTitle);
  setText("#about-description", sections.aboutDescription);
  setText("#footer-copy", site.copyright);

  setLink("#nav-github-link", links.github);
  setLink("#cta-github", links.github, hero.ctas?.github);
  setLink("#footer-github", links.github);
  setLink("#footer-linkedin", links.linkedin);

  const email = site.email || "fabynf31@gmail.com";
  setLink("#footer-email", `mailto:${email}`, email);

  setText("#cta-projects", hero.ctas?.projects);
  setText("#cta-contact", hero.ctas?.contact);

  if (searchInput) searchInput.placeholder = filters.searchPlaceholder || "Busca...";
  setText("#tech-filter-label", filters.techLabel);
  setText("#type-filter-label", filters.typeLabel);

  const metricsWrap = document.getElementById("hero-metrics");
  if (metricsWrap) {
    metricsWrap.innerHTML = "";
    (hero.metrics || []).forEach((metric) => {
      const item = document.createElement("li");
      const value = document.createElement("strong");
      const label = document.createElement("span");
      value.textContent = metric.value || "";
      label.textContent = metric.label || "";
      item.append(value, label);
      metricsWrap.append(item);
    });
  }

  const featured = hero.featured || projects[0] || {};
  const featuredLink = document.getElementById("featured-link");
  const featuredUrl = featured.url || featured.liveUrl || featured.codeUrl;
  setLink("#featured-link", featuredUrl);
  setText("#featured-title", featured.title || featured.name || "Proyecto destacado");
  setPreviewTheme(featuredLink, featured.previewTheme, 0);
  applyCapturePreview(featuredLink, featuredUrl, featured.previewImage || "");

  const aboutPoints = document.getElementById("about-points");
  if (aboutPoints) {
    aboutPoints.innerHTML = "";
    (sections.aboutPoints || []).forEach((point) => {
      const row = document.createElement("p");
      row.innerHTML = `<strong>${point.label || ""}:</strong> ${point.text || ""}`;
      aboutPoints.append(row);
    });
  }
};

const createCard = (project, index) => {
  if (!projectTemplate) return null;

  const node = projectTemplate.content.firstElementChild.cloneNode(true);
  const preview = node.querySelector(".project-preview");
  const name = node.querySelector(".project-name");
  const description = node.querySelector(".project-description");
  const tags = node.querySelector(".project-tags");
  const status = node.querySelector(".project-status");

  node.dataset.projectId = String(project.id || "");
  node.dataset.search = `${project.name || ""} ${project.shortDescription || ""}`.toLowerCase();
  node.dataset.type = toKey(project.type);
  node.dataset.tech = (project.tech || []).map(toKey).join(" ");
  node.setAttribute("tabindex", "0");
  node.setAttribute("role", "button");
  node.setAttribute("aria-label", `Abrir detalles de ${project.name || "proyecto"}`);

  if (name) name.textContent = project.name || "Proyecto";
  if (description) description.textContent = project.shortDescription || "";
  if (status) status.textContent = project.status || DEFAULT_TEXT.status;

  if (preview) {
    setPreviewTheme(preview, project.previewTheme, index);
    preview.href = project.liveUrl || "#";
    preview.setAttribute("aria-label", `Abrir web de ${project.name || "proyecto"}`);
    preview.dataset.hasLive = project.liveUrl ? "true" : "false";
    applyCapturePreview(preview, project.liveUrl, project.previewImage || "");
  }

  if (tags) {
    tags.innerHTML = "";
    (project.tech || []).forEach((tech) => {
      const tag = document.createElement("li");
      tag.textContent = tech;
      tags.append(tag);
    });
  }

  return node;
};

const renderProjects = (items) => {
  if (!projectGrid) return;
  projectGrid.innerHTML = "";

  const fragment = document.createDocumentFragment();
  items.forEach((project, index) => {
    const card = createCard(project, index);
    if (card) fragment.append(card);
  });
  projectGrid.append(fragment);

  if (emptyState) emptyState.hidden = items.length !== 0;
};

const fillFilterOptions = () => {
  const techSet = new Set();
  const typeSet = new Set();

  projects.forEach((project) => {
    (project.tech || []).forEach((tech) => techSet.add(String(tech)));
    if (project.type) typeSet.add(String(project.type));
  });

  if (techSelect) {
    [...techSet]
      .sort((a, b) => a.localeCompare(b))
      .forEach((tech) => {
        const option = document.createElement("option");
        option.value = toKey(tech);
        option.textContent = tech;
        techSelect.append(option);
      });
  }

  if (typeSelect) {
    [...typeSet]
      .sort((a, b) => a.localeCompare(b))
      .forEach((type) => {
        const option = document.createElement("option");
        option.value = toKey(type);
        option.textContent = toLabel(type);
        typeSelect.append(option);
      });
  }
};

const applyFilters = () => {
  const query = String(searchInput?.value || "").toLowerCase().trim();
  const techValue = toKey(techSelect?.value || "all");
  const typeValue = toKey(typeSelect?.value || "all");

  const filtered = projects.filter((project) => {
    const searchable = `${project.name || ""} ${project.shortDescription || ""}`.toLowerCase();
    const techKeys = (project.tech || []).map(toKey);
    const typeKey = toKey(project.type);

    const matchQuery = !query || searchable.includes(query);
    const matchTech = techValue === "all" || techKeys.includes(techValue);
    const matchType = typeValue === "all" || typeKey === typeValue;
    return matchQuery && matchTech && matchType;
  });

  renderProjects(filtered);
};

const fillList = (target, values) => {
  if (!target) return;
  target.innerHTML = "";
  (values || []).forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    target.append(item);
  });
};

const openModal = (projectId) => {
  if (!modal) return;
  const project = projectById.get(String(projectId || ""));
  if (!project) return;

  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }

  lastFocused = document.activeElement;

  if (modalTitle) modalTitle.textContent = project.name || "Proyecto";
  if (modalStatus) modalStatus.textContent = project.status || DEFAULT_TEXT.status;
  if (modalObjective) modalObjective.textContent = project.objective || DEFAULT_TEXT.objective;
  if (modalCode) modalCode.href = project.codeUrl || "#";

  fillList(modalFeatures, project.features || []);
  fillList(modalStack, project.stack || project.tech || []);

  if (modalShots) {
    modalShots.innerHTML = "";
    (project.shots || []).forEach((shot) => {
      const block = document.createElement("div");
      block.className = "shot";
      block.textContent = shot;
      modalShots.append(block);
    });
  }

  if (modalLive) {
    if (project.liveUrl) {
      modalLive.href = project.liveUrl;
      modalLive.hidden = false;
      if (modalNote) modalNote.textContent = "";
    } else {
      modalLive.hidden = true;
      if (modalNote) modalNote.textContent = "Este proyecto no tiene deploy publico por ahora.";
    }
  }

  modal.hidden = false;
  modal.classList.remove("is-closing");
  // Force reflow to ensure transition runs after hidden change.
  void modal.offsetWidth;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  if (!modal || modal.hidden) return;

  modal.classList.remove("is-open");
  modal.classList.add("is-closing");
  modal.setAttribute("aria-hidden", "true");

  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    modal.hidden = true;
    modal.classList.remove("is-closing");
    document.body.style.overflow = "";
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }, 320);
};

const setupMenu = () => {
  if (!navToggle || !siteNav) return;

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
};

const setupEvents = () => {
  [searchInput, techSelect, typeSelect].forEach((control) => {
    control?.addEventListener("input", applyFilters);
    control?.addEventListener("change", applyFilters);
  });

  if (projectGrid) {
    projectGrid.addEventListener("click", (event) => {
      const previewLink = event.target.closest(".project-preview");
      if (previewLink) {
        const card = previewLink.closest(".project-card");
        if (!card) return;
        const project = projectById.get(card.dataset.projectId);
        if (!project?.liveUrl) {
          event.preventDefault();
          openModal(card.dataset.projectId);
        }
        return;
      }

      const card = event.target.closest(".project-card");
      if (!card) return;
      openModal(card.dataset.projectId);
    });

    projectGrid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest(".project-preview")) return;
      const card = event.target.closest(".project-card");
      if (!card) return;
      event.preventDefault();
      openModal(card.dataset.projectId);
    });
  }

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
};

setupMenu();
fillSiteContent();
fillFilterOptions();
setupEvents();
applyFilters();
