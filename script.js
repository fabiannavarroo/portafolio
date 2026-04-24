const CONTENT = window.PORTFOLIO_CONTENT || {};
const LOCAL_KEY = "fabian-portfolio-projects";
const ADMIN_KEY = "fabian-portfolio-admin";
const ADMIN_PIN = CONTENT.admin?.pin || "fabian2026";

const DEFAULT_TEXT = {
  type: "proyecto",
  objective: "Explorar la solucion, estructura y codigo fuente del proyecto.",
  status: "Terminado"
};

const COLORS = ["#c9bbff", "#ffd156", "#bfe9c8", "#a9d6ff", "#ffb9b2", "#d5f0a5"];

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
const modalLive = document.getElementById("modal-live");
const modalCode = document.getElementById("modal-code");
const modalNote = document.getElementById("modal-note");

const adminPanel = document.getElementById("admin-panel");
const adminLogin = document.querySelector("[data-admin-login]");
const adminWorkspace = document.querySelector("[data-admin-workspace]");
const adminMessage = document.querySelector("[data-admin-message]");
const projectForm = document.querySelector("[data-project-form]");
const storedProjectsWrap = document.querySelector("[data-stored-projects]");
const exportBox = document.querySelector("[data-export-box]");

let projects = [];
let projectById = new Map();
let lastFocused = null;

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

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const setHighlightedText = (selector, value, highlight) => {
  const element = document.querySelector(selector);
  if (!element || !value) return;
  if (!highlight || !String(value).toLowerCase().includes(String(highlight).toLowerCase())) {
    element.textContent = value;
    return;
  }
  const escapedValue = escapeHtml(value);
  const escapedHighlight = escapeHtml(highlight);
  element.innerHTML = escapedValue.replace(new RegExp(`(${escapedHighlight})`, "i"), "<strong>$1</strong>");
};

const setLink = (selector, href, text) => {
  const link = document.querySelector(selector);
  if (!link) return;
  if (href) link.href = href;
  if (text) link.textContent = text;
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

const buildCaptureUrl = (liveUrl) => {
  if (!liveUrl) return "";
  return `https://image.thum.io/get/width/1200/noanimate/${liveUrl}`;
};

const inferType = (name) => {
  const key = toKey(name);
  if (key.includes("python")) return "python";
  if (key.includes("juego") || key.includes("games") || key.includes("pacman")) return "juego";
  if (key.includes("sub") || key.includes("app")) return "webapp";
  return DEFAULT_TEXT.type;
};

const inferTech = (name) => {
  const key = toKey(name);
  if (key.includes("python") || key.includes("pacman")) return key.includes("pacman") ? ["Python", "Pygame"] : ["Python"];
  if (key.includes("juego") || key.includes("games")) return ["HTML", "CSS", "JavaScript"];
  return ["JavaScript"];
};

const normalizeProject = (input, index) => {
  const base = typeof input === "string" ? { repo: input } : input || {};
  const repoMeta = parseRepoUrl(base.repo || base.codeUrl || "");
  const repoName = repoMeta?.repo || base.id || `proyecto-${index + 1}`;
  const name = base.name || toLabel(repoName);
  const tech = Array.isArray(base.tech) && base.tech.length ? base.tech : inferTech(repoName);

  return {
    id: base.id || toKey(repoName),
    name,
    shortDescription: base.shortDescription || base.description || `Proyecto ${name} desarrollado como parte de mi portfolio.`,
    type: base.type || inferType(repoName),
    tech,
    objective: base.objective || DEFAULT_TEXT.objective,
    features:
      Array.isArray(base.features) && base.features.length
        ? base.features
        : ["Interfaz principal implementada", "Repositorio disponible para revision", "Estructura preparada para evolucionar"],
    stack: Array.isArray(base.stack) && base.stack.length ? base.stack : tech,
    status: base.status || DEFAULT_TEXT.status,
    liveUrl: base.liveUrl || "",
    codeUrl: base.codeUrl || base.repo || "",
    previewImage: base.previewImage || "",
    year: base.year || "2026",
    source: base.source || "content"
  };
};

const readLocalProjects = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalProjects = (items) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items, null, 2));
};

const getAllProjects = () => {
  const contentProjects = Array.isArray(CONTENT.projects) ? CONTENT.projects : [];
  const localProjects = readLocalProjects().map((project) => ({ ...project, source: "local" }));
  return [...contentProjects, ...localProjects].map(normalizeProject);
};

const refreshProjectState = () => {
  projects = getAllProjects();
  projectById = new Map(projects.map((project) => [String(project.id || ""), project]));
};

const fillSiteContent = () => {
  const site = CONTENT.site || {};
  const links = CONTENT.links || {};
  const hero = CONTENT.hero || {};
  const sections = CONTENT.sections || {};
  const filters = CONTENT.filters || {};

  if (site.pageTitle) document.title = site.pageTitle;
  setText("#brand-name", site.brandName);
  setText("#footer-brand", site.brandName);
  setText("#hero-kicker", site.ownerRole ? `Hola! Soy ${site.ownerRole.replace(/web developer/i, "Fabian")}` : "Hola! Soy Fabian");
  setHighlightedText("#hero-title", hero.title, hero.highlightWord);
  setText("#hero-subtitle", hero.subtitle);
  setText("#projects-title", sections.projectsTitle);
  setText("#projects-description", sections.projectsDescription);
  setText("#about-title", sections.aboutTitle);
  setText("#about-description", sections.aboutDescription);
  setText("#footer-copy", site.copyright);

  setLink("#nav-github-link", links.github);
  setLink("#cta-github", links.github, hero.ctas?.github);
  setLink("#footer-github", links.github);
  setLink("#footer-linkedin", links.linkedin);

  const email = site.email || "fabynf31@gmail.com";
  setLink("#footer-email", `mailto:${email}`, "Enviar mensaje ->");
  setText("#cta-projects", hero.ctas?.projects);

  if (searchInput) searchInput.placeholder = filters.searchPlaceholder || "Busca por nombre...";
  setText("#tech-filter-label", filters.techLabel);
  setText("#type-filter-label", filters.typeLabel);

  const metricsWrap = document.getElementById("hero-metrics");
  if (metricsWrap) {
    metricsWrap.innerHTML = "";
    (hero.metrics || []).forEach((metric) => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>${metric.value || ""}</strong><span>${metric.label || ""}</span>`;
      metricsWrap.append(item);
    });
  }

  const aboutPoints = document.getElementById("about-points");
  if (aboutPoints) {
    aboutPoints.innerHTML = "";
    (sections.aboutPoints || []).forEach((point) => {
      const row = document.createElement("p");
      row.innerHTML = `<strong>${point.label || ""}</strong>${point.text || ""}`;
      aboutPoints.append(row);
    });
  }
};

const fillFeatured = () => {
  const featured = CONTENT.hero?.featured || projects[0] || {};
  const project = projects.find((item) => item.name === featured.title || item.liveUrl === featured.url) || projects[0] || {};
  const featuredUrl = featured.url || project.liveUrl || project.codeUrl || "#";

  setText("#featured-title", featured.title || project.name || "Proyecto destacado");
  setText("#featured-description", project.shortDescription || "Proyecto destacado del portfolio.");
  setLink("#featured-link", featuredUrl);

  const image = document.getElementById("featured-image");
  if (image) image.src = featured.previewImage || project.previewImage || buildCaptureUrl(project.liveUrl) || "./ico.png";

  const tags = document.getElementById("featured-tags");
  if (tags) {
    tags.innerHTML = "";
    (project.tech || []).slice(0, 3).forEach((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      tags.append(item);
    });
    const status = document.createElement("span");
    status.textContent = project.status || DEFAULT_TEXT.status;
    tags.append(status);
  }
};

const iconForProject = (project) => {
  const key = toKey(`${project.type} ${project.name} ${(project.tech || []).join(" ")}`);
  if (key.includes("python")) return "Py";
  if (key.includes("spotify") || key.includes("music") || key.includes("spoti")) return "M";
  if (key.includes("juego") || key.includes("game") || key.includes("pacman")) return "G";
  if (key.includes("firebase")) return "F";
  return "</>";
};

const createCard = (project, index) => {
  if (!projectTemplate) return null;
  const node = projectTemplate.content.firstElementChild.cloneNode(true);
  const preview = node.querySelector(".project-preview");
  const previewImage = node.querySelector(".preview-image");
  const badge = node.querySelector(".badge-featured");
  const icon = node.querySelector(".project-icon");
  const name = node.querySelector(".project-name");
  const description = node.querySelector(".project-description");
  const tags = node.querySelector(".project-tags");
  const status = node.querySelector(".project-status");
  const year = node.querySelector(".project-year");

  node.dataset.projectId = String(project.id || "");
  node.dataset.type = toKey(project.type);
  node.dataset.tech = (project.tech || []).map(toKey).join(" ");
  node.dataset.search = `${project.name || ""} ${project.shortDescription || ""}`.toLowerCase();
  node.setAttribute("tabindex", "0");
  node.setAttribute("role", "button");
  node.setAttribute("aria-label", `Abrir detalles de ${project.name || "proyecto"}`);
  if (index > 0) node.style.background = COLORS[(index - 1) % COLORS.length];

  if (badge) badge.hidden = index !== 0;
  if (icon) icon.textContent = iconForProject(project);
  if (name) name.textContent = project.name || "Proyecto";
  if (description) description.textContent = project.shortDescription || "";
  if (status) status.textContent = project.status || DEFAULT_TEXT.status;
  if (year) year.textContent = project.year || "2026";

  if (preview) {
    preview.href = project.liveUrl || project.codeUrl || "#";
    preview.setAttribute("aria-label", `Abrir ${project.name || "proyecto"}`);
  }

  if (previewImage) {
    previewImage.src = project.previewImage || buildCaptureUrl(project.liveUrl) || "./ico.png";
    previewImage.alt = "";
    previewImage.addEventListener("error", () => {
      previewImage.src = "./ico.png";
      previewImage.classList.add("is-fallback");
    });
  }

  if (tags) {
    tags.innerHTML = "";
    (project.tech || []).slice(0, 4).forEach((tech) => {
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
  animateCards();
};

const fillFilterOptions = () => {
  const currentTech = techSelect?.value || "all";
  const currentType = typeSelect?.value || "all";
  const techSet = new Set();
  const typeSet = new Set();

  projects.forEach((project) => {
    (project.tech || []).forEach((tech) => techSet.add(String(tech)));
    if (project.type) typeSet.add(String(project.type));
  });

  if (techSelect) {
    techSelect.innerHTML = '<option value="all">Todas</option>';
    [...techSet].sort((a, b) => a.localeCompare(b)).forEach((tech) => {
      const option = document.createElement("option");
      option.value = toKey(tech);
      option.textContent = tech;
      techSelect.append(option);
    });
    techSelect.value = [...techSelect.options].some((option) => option.value === currentTech) ? currentTech : "all";
  }

  if (typeSelect) {
    typeSelect.innerHTML = '<option value="all">Todos</option>';
    [...typeSet].sort((a, b) => a.localeCompare(b)).forEach((type) => {
      const option = document.createElement("option");
      option.value = toKey(type);
      option.textContent = toLabel(type);
      typeSelect.append(option);
    });
    typeSelect.value = [...typeSelect.options].some((option) => option.value === currentType) ? currentType : "all";
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
    return (!query || searchable.includes(query)) && (techValue === "all" || techKeys.includes(techValue)) && (typeValue === "all" || typeKey === typeValue);
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

const openLayer = (layer) => {
  if (!layer) return;
  lastFocused = document.activeElement;
  layer.hidden = false;
  requestAnimationFrame(() => {
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
  });
  document.body.style.overflow = "hidden";
};

const closeLayer = (layer) => {
  if (!layer || layer.hidden) return;
  layer.classList.remove("is-open");
  layer.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    layer.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }, 260);
};

const openModal = (projectId) => {
  const project = projectById.get(String(projectId || ""));
  if (!project) return;
  if (modalTitle) modalTitle.textContent = project.name || "Proyecto";
  if (modalStatus) modalStatus.textContent = project.status || DEFAULT_TEXT.status;
  if (modalObjective) modalObjective.textContent = project.objective || DEFAULT_TEXT.objective;
  if (modalCode) modalCode.href = project.codeUrl || "#";
  fillList(modalFeatures, project.features || []);
  fillList(modalStack, project.stack || project.tech || []);

  if (modalLive) {
    modalLive.hidden = !project.liveUrl;
    modalLive.href = project.liveUrl || "#";
    if (modalNote) modalNote.textContent = project.liveUrl ? "" : "Este proyecto no tiene deploy publico por ahora.";
  }

  openLayer(modal);
};

const setupMenu = () => {
  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("is-open");
  });

  siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
};

const setAdminState = (isAuthed) => {
  if (adminLogin) adminLogin.hidden = isAuthed;
  if (adminWorkspace) adminWorkspace.hidden = !isAuthed;
  if (isAuthed) renderStoredProjects();
};

const showAdminMessage = (message) => {
  if (adminMessage) adminMessage.textContent = message;
};

const openAdmin = () => {
  setAdminState(localStorage.getItem(ADMIN_KEY) === "true");
  openLayer(adminPanel);
};

const fetchGitHubProject = async (repoUrl) => {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) throw new Error("El enlace no parece un repositorio de GitHub.");

  const [repoResponse, languageResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`),
    fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/languages`)
  ]);

  if (!repoResponse.ok) throw new Error("No he podido leer ese repositorio de GitHub.");

  const repo = await repoResponse.json();
  const languages = languageResponse.ok ? Object.keys(await languageResponse.json()) : [];

  return {
    repo: repo.html_url,
    codeUrl: repo.html_url,
    name: repo.name ? toLabel(repo.name) : toLabel(parsed.repo),
    shortDescription: repo.description || "",
    liveUrl: repo.homepage || "",
    type: inferType(repo.name || parsed.repo),
    tech: languages.length ? languages : inferTech(repo.name || parsed.repo),
    stack: languages.length ? languages : inferTech(repo.name || parsed.repo),
    status: repo.archived ? "Archivado" : "Terminado",
    year: repo.created_at ? String(new Date(repo.created_at).getFullYear()) : "2026",
    objective: repo.description || DEFAULT_TEXT.objective,
    features: ["Datos importados desde GitHub", "Lenguajes detectados automaticamente", "Codigo fuente disponible"],
    source: "local"
  };
};

const fillForm = (project) => {
  if (!projectForm) return;
  projectForm.elements.repo.value = project.repo || project.codeUrl || "";
  projectForm.elements.name.value = project.name || "";
  projectForm.elements.liveUrl.value = project.liveUrl || "";
  projectForm.elements.shortDescription.value = project.shortDescription || "";
  projectForm.elements.type.value = project.type || "";
  projectForm.elements.status.value = project.status || DEFAULT_TEXT.status;
  projectForm.elements.previewImage.value = project.previewImage || "";
  projectForm.dataset.githubProject = JSON.stringify(project);
};

const saveProjectFromForm = () => {
  if (!projectForm) return;
  const formData = new FormData(projectForm);
  const imported = JSON.parse(projectForm.dataset.githubProject || "{}");
  const repo = String(formData.get("repo") || "").trim();
  const name = String(formData.get("name") || imported.name || "").trim();
  const local = readLocalProjects().filter((item) => toKey(item.id || item.name || item.repo) !== toKey(name || repo));
  const project = {
    ...imported,
    repo,
    codeUrl: repo,
    id: toKey(name || repo),
    name: name || imported.name || toLabel(parseRepoUrl(repo)?.repo || repo),
    liveUrl: String(formData.get("liveUrl") || imported.liveUrl || "").trim(),
    shortDescription: String(formData.get("shortDescription") || imported.shortDescription || "").trim(),
    type: String(formData.get("type") || imported.type || DEFAULT_TEXT.type).trim(),
    status: String(formData.get("status") || imported.status || DEFAULT_TEXT.status).trim(),
    previewImage: String(formData.get("previewImage") || imported.previewImage || "").trim(),
    source: "local"
  };

  writeLocalProjects([...local, project]);
  projectForm.reset();
  delete projectForm.dataset.githubProject;
  refreshProjectState();
  fillFilterOptions();
  applyFilters();
  fillFeatured();
  renderStoredProjects();
  showAdminMessage("Proyecto guardado en este navegador.");
};

const renderStoredProjects = () => {
  if (!storedProjectsWrap) return;
  const local = readLocalProjects();
  storedProjectsWrap.innerHTML = "";
  if (!local.length) {
    storedProjectsWrap.innerHTML = '<p class="admin-message">Aun no hay proyectos locales.</p>';
    return;
  }
  local.forEach((project) => {
    const row = document.createElement("div");
    row.className = "stored-project";
    row.innerHTML = `<span>${project.name || project.repo}</span><button class="btn btn-danger compact" type="button" data-remove-local="${toKey(project.id || project.name || project.repo)}">Eliminar</button>`;
    storedProjectsWrap.append(row);
  });
};

const setupAdmin = () => {
  document.querySelectorAll("[data-open-admin]").forEach((button) => button.addEventListener("click", openAdmin));
  document.querySelectorAll("[data-close-admin]").forEach((button) => button.addEventListener("click", () => closeLayer(adminPanel)));

  document.querySelector("[data-admin-enter]")?.addEventListener("click", () => {
    const pin = document.querySelector("[data-admin-pin]")?.value || "";
    if (pin !== ADMIN_PIN) {
      showAdminMessage("PIN incorrecto.");
      return;
    }
    localStorage.setItem(ADMIN_KEY, "true");
    setAdminState(true);
    showAdminMessage("");
  });

  document.querySelector("[data-admin-logout]")?.addEventListener("click", () => {
    localStorage.removeItem(ADMIN_KEY);
    setAdminState(false);
  });

  document.querySelector("[data-import-github]")?.addEventListener("click", async () => {
    const repo = projectForm?.elements.repo.value.trim();
    if (!repo) {
      showAdminMessage("Pega primero un enlace de GitHub.");
      return;
    }
    showAdminMessage("Leyendo repositorio y lenguajes desde GitHub...");
    try {
      const project = await fetchGitHubProject(repo);
      fillForm(project);
      showAdminMessage("Datos importados. Revisa y guarda.");
    } catch (error) {
      showAdminMessage(error.message || "No se ha podido importar.");
    }
  });

  projectForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProjectFromForm();
  });

  storedProjectsWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-local]");
    if (!button) return;
    const key = button.dataset.removeLocal;
    writeLocalProjects(readLocalProjects().filter((item) => toKey(item.id || item.name || item.repo) !== key));
    refreshProjectState();
    fillFilterOptions();
    applyFilters();
    renderStoredProjects();
  });

  document.querySelector("[data-export-projects]")?.addEventListener("click", () => {
    if (!exportBox) return;
    exportBox.hidden = false;
    exportBox.value = JSON.stringify(readLocalProjects(), null, 2);
    exportBox.select();
    showAdminMessage("JSON listo para pegar en content.js si quieres hacerlo permanente.");
  });

  document.querySelector("[data-clear-local]")?.addEventListener("click", () => {
    writeLocalProjects([]);
    refreshProjectState();
    fillFilterOptions();
    applyFilters();
    renderStoredProjects();
    showAdminMessage("Proyectos locales eliminados.");
  });
};

const setupEvents = () => {
  [searchInput, techSelect, typeSelect].forEach((control) => {
    control?.addEventListener("input", applyFilters);
    control?.addEventListener("change", applyFilters);
  });

  projectGrid?.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;
    if (event.target.closest(".project-preview")) {
      event.preventDefault();
    }
    openModal(card.dataset.projectId);
  });

  projectGrid?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".project-card");
    if (!card) return;
    event.preventDefault();
    openModal(card.dataset.projectId);
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeLayer(modal)));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLayer(modal);
      closeLayer(adminPanel);
    }
  });
};

const initAnimations = () => {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hasScrollTrigger = Boolean(window.ScrollTrigger);
  if (hasScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.from(".site-header", { y: -24, opacity: 0, duration: 0.6, ease: "power3.out" });
  window.gsap.from(".hero-copy > *", { y: 28, opacity: 0, duration: 0.75, stagger: 0.08, ease: "power3.out" });
  window.gsap.from(".hero-highlight", { x: 45, opacity: 0, duration: 0.8, delay: 0.12, ease: "power3.out" });
  if (!hasScrollTrigger) return;
  window.gsap.to(".shape-purple", {
    y: -28,
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  window.gsap.to(".shape-yellow", {
    y: 26,
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
  animateCards();
  document.querySelectorAll(".about-grid > *, .section-head, .filters").forEach((element) => {
    window.gsap.from(element, {
      y: 34,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: { trigger: element, start: "top 84%", once: true }
    });
  });
};

const animateCards = () => {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.gsap.fromTo(
    ".project-card",
    { y: 32 },
    {
      y: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
      overwrite: true,
      immediateRender: false,
      scrollTrigger: window.ScrollTrigger ? { trigger: ".project-grid", start: "top 88%", once: true } : undefined
    }
  );
};

const init = () => {
  refreshProjectState();
  setupMenu();
  fillSiteContent();
  fillFeatured();
  fillFilterOptions();
  setupEvents();
  setupAdmin();
  applyFilters();
  window.addEventListener("load", initAnimations);
  setTimeout(initAnimations, 1800);
};

init();
