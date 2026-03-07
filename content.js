window.PORTFOLIO_CONTENT = {
  site: {
    pageTitle: "Portfolio Hub | Fabian Navarro",
    brandName: "Fabian Portfolio",
    copyright: "Fabian Portfolio (c) 2026",
    email: "fabynf31@gmail.com",
    ownerRole: "Web Developer"
  },

  links: {
    github: "https://github.com/fabiannavarroo",
    linkedin: "https://www.linkedin.com/"
  },

  hero: {
    title: "Mis Proyectos Web en un solo lugar",
    subtitle:
      "Explora mis proyectos, revisa detalles tecnicos y abre el codigo en GitHub desde un panel visual limpio y profesional.",
    ctas: {
      projects: "Ver proyectos",
      github: "Mi GitHub",
      contact: "Contacto"
    },
    metrics: [
      { value: "5", label: "Repos principales" },
      { value: "Python + JS", label: "Stack principal" },
      { value: "100%", label: "Hecho por mi" }
    ],
    featured: {
      title: "Python Master",
      url: "https://python-master-two.vercel.app/",
      previewImage: "./assets/previews/pythonmaster.png",
      previewTheme: "code"
    }
  },

  filters: {
    searchPlaceholder: "Busca por nombre o descripcion...",
    techLabel: "Filtrar por tecnologia",
    typeLabel: "Tipo de proyecto"
  },

  sections: {
    projectsEyebrow: "Proyectos",
    projectsTitle: "Galeria de proyectos",
    projectsDescription:
      "Haz clic en cualquier tarjeta para abrir una vista de detalle con informacion del proyecto, stack y enlace al codigo.",
    aboutEyebrow: "Sobre mi",
    aboutTitle: "Desarrollo productos web claros, utiles y bien ejecutados",
    aboutDescription:
      "Me enfoco en construir experiencias web funcionales con buen diseno visual y base tecnica solida. Disfruto crear productos que se entiendan rapido y funcionen bien.",
    aboutPoints: [
      { label: "Especialidad", text: "Frontend, UX UI y proyectos web interactivos." },
      { label: "Enfoque", text: "Codigo limpio, estructura clara y resultados visuales fuertes." },
      { label: "Objetivo", text: "Convertir ideas en productos digitales reales y usables." }
    ]
  },

  /*
    EDITA SOLO ESTE BLOQUE para cambiar o agregar proyectos.
    El frontend lee estos datos y genera cards, filtros y modal automaticamente.

    Puedes agregar proyectos de 2 formas:
    1) Minima (solo repo):
       { repo: "https://github.com/usuario/repo" }
    2) Con datos extra opcionales:
       {
         repo: "https://github.com/usuario/repo",
         shortDescription: "Descripcion corta",
         type: "juego",
         tech: ["HTML", "CSS", "JavaScript"],
         status: "Terminado",
         liveUrl: "https://tu-deploy.com",
         objective: "Objetivo del proyecto",
         features: ["Feature 1", "Feature 2"],
         stack: ["HTML", "CSS", "JavaScript"],
         shots: ["Pantalla 1", "Pantalla 2"],
         previewTheme: "gaming"
       }
  */
  projects: [
    {
      repo: "https://github.com/fabiannavarroo/python-master",
      liveUrl: "https://python-master-two.vercel.app/",
      previewImage: "./assets/previews/pythonmaster.png",
      shortDescription: "Coleccion de practicas y ejercicios en Python.",
      type: "python",
      tech: ["Python"],
      status: "Terminado",
      objective: "Consolidar logica de programacion y fundamentos con Python.",
      features: ["Ejercicios practicos", "Retos de logica", "Scripts utilitarios"],
      previewTheme: "code"
    },
    {
      repo: "https://github.com/fabiannavarroo/adivina-juego",
      liveUrl: "https://adivina-juego.onrender.com/",
      previewImage: "./assets/previews/adivinajuego.png",
      shortDescription: "Juego de adivinanza con dinamica simple y rapida.",
      type: "juego",
      tech: ["HTML", "CSS", "JavaScript"],
      status: "Terminado",
      objective: "Crear un juego web ligero y entretenido.",
      features: ["Mecanica de adivinanza", "Interfaz simple", "Feedback inmediato"],
      previewTheme: "gaming"
    },
    {
      repo: "https://github.com/fabiannavarroo/mini-juegos",
      liveUrl: "https://juegos-faby.dev/",
      previewImage: "./assets/previews/minijeugos.png",
      shortDescription: "Pack de mini juegos web para practicar interaccion y logica.",
      type: "juego",
      tech: ["HTML", "CSS", "JavaScript"],
      status: "Terminado",
      objective: "Reunir varios juegos pequenos en una sola coleccion.",
      features: ["Varios modos", "UI sencilla", "Aprendizaje por practica"],
      previewTheme: "gaming"
    },
    {
      repo: "https://github.com/fabiannavarroo/spoti-games",
      liveUrl: "https://spoti-games-hazel.vercel.app/",
      shortDescription: "Proyecto de juegos inspirado en dinamicas relacionadas con musica.",
      type: "juego",
      tech: ["JavaScript", "HTML", "CSS"],
      status: "En progreso",
      objective: "Combinar experiencia musical con interacciones de juego.",
      features: ["Flujo tipo trivia", "Interaccion dinamica", "Diseno tematico"],
      previewTheme: "music"
    },
    {
      repo: "https://github.com/fabiannavarroo/PROYECTO-FINAL-PACMAN",
      shortDescription: "Version web de Pacman como proyecto final.",
      type: "python",
      tech: ["Python", "Pygame"],
      status: "Terminado",
      objective: "Implementar una experiencia clasica de arcade con python.",
      features: ["Movimiento de personaje", "Sistema de puntos", "Logica de colisiones"],
      previewTheme: "code"
    },
    {
      repo: "https://github.com/fabiannavarroo/spoti-sub",
      liveUrl: "https://faby-spotify.web.app",
      name: "Spoti Sub",
      shortDescription: "Web de suscripcion para contenido relacionado con Spotify.",
      type: "webapp",
      tech: ["JavaScript", "Firebase", "HTML", "CSS"],
      status: "Terminado",
      objective: "Gestionar suscripcion y acceso a funcionalidades premium.",
      features: ["Registro de usuarios", "Flujo de suscripcion", "Panel de acceso"],
      previewTheme: "music"
    }
  ]
};
