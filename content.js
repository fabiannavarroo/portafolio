window.PORTFOLIO_CONTENT = {
  site: {
    pageTitle: "Fabian Portfolio | Proyectos Web",
    brandName: "Fabian Portfolio",
    copyright: "Fabian Portfolio (c) 2026",
    email: "fabynf31@gmail.com",
    ownerRole: "Web Developer"
  },

  admin: {
    pin: "fabian2026"
  },

  links: {
    github: "https://github.com/fabiannavarroo",
    linkedin: "https://www.linkedin.com/"
  },

  hero: {
    title: "Construyo experiencias web claras, utiles y memorables.",
    highlightWord: "utiles",
    subtitle:
      "Desarrollo productos digitales con foco en frontend, UX/UI y codigo limpio. Me gusta convertir ideas en interfaces simples, interactivas y bien ejecutadas.",
    ctas: {
      projects: "Ver proyectos",
      github: "Mi GitHub",
      contact: "Contacto"
    },
    metrics: [
      { value: "11+", label: "Proyectos" },
      { value: "100%", label: "Hecho por mi" },
      { value: "GitHub", label: "Lenguajes auto" }
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
    projectsTitle: "Mis Proyectos",
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
      isPrivate: true,
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
      isPrivate: true,
      liveUrl: "https://adivina-juego.onrender.com/",
      previewImage: "./assets/previews/adivinajuego.png",
      logoImage: "./assets/github/adivina-github.svg",
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
      isPrivate: true,
      liveUrl: "https://mini-juegos-neon.vercel.app",
      previewImage: "./assets/github/mini-juegos-cover.png",
      logoImage: "./assets/github/mini-juegos-cover.png",
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
      isPrivate: true,
      liveUrl: "https://spoti-games-hazel.vercel.app/",
      previewImage: "./assets/github/spoti-games-ico.png",
      logoImage: "./assets/github/spoti-games-ico.png",
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
      previewImage: "./assets/previews/pythonmaster.png",
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
      isPrivate: true,
      liveUrl: "https://faby-spotify.web.app",
      name: "Spoti Sub",
      previewImage: "./assets/github/spoti-sub-logo.png",
      logoImage: "./assets/github/spoti-sub-logo.png",
      shortDescription: "Web de suscripcion para contenido relacionado con Spotify.",
      type: "webapp",
      tech: ["TypeScript", "Firebase", "HTML", "CSS"],
      status: "Terminado",
      objective: "Gestionar suscripcion y acceso a funcionalidades premium.",
      features: ["Registro de usuarios", "Flujo de suscripcion", "Panel de acceso"],
      previewTheme: "music"
    },
    {
      repo: "https://github.com/fabiannavarroo/vuelos-barquitos",
      isPrivate: true,
      name: "Vuelos Barquitos",
      shortDescription:
        "Tracker 3D en tiempo real para aviones y barcos sobre un globo CesiumJS.",
      type: "experimento 3D",
      tech: ["TypeScript", "CesiumJS", "WebSocket", "Next.js"],
      status: "Incompleto",
      objective:
        "Visualizar posiciones de aeronaves y barcos en tiempo real con una experiencia 3D.",
      features: ["Globo 3D", "Streaming WebSocket", "Filtros por entidad", "Panel de detalle"],
      previewTheme: "dashboard"
    },
    {
      repo: "https://github.com/fabiannavarroo/gastos",
      isPrivate: true,
      liveUrl: "https://gastos-wine.vercel.app",
      name: "Gastos",
      previewImage: "./assets/github/gastos-icon.png",
      logoImage: "./assets/github/gastos-icon.png",
      shortDescription: "App para controlar gastos y visualizar movimientos personales.",
      type: "webapp",
      tech: ["TypeScript", "JavaScript", "HTML", "CSS"],
      status: "En progreso",
      objective: "Organizar gastos con una interfaz clara y rapida.",
      features: ["Registro de movimientos", "Resumen visual", "Persistencia de datos"],
      previewTheme: "dashboard"
    },
    {
      repo: "https://github.com/fabiannavarroo/menu-web",
      isPrivate: true,
      liveUrl: "https://menu-pruebas-faby.vercel.app/",
      name: "Menu Web",
      shortDescription: "Prueba de menu digital desplegable para una experiencia rapida.",
      type: "webapp",
      tech: ["TypeScript", "JavaScript", "HTML", "CSS"],
      status: "En progreso",
      objective: "Probar una carta digital usable desde movil.",
      features: ["Categorias", "Vista responsive", "Deploy publico"],
      previewTheme: "agency"
    },
    {
      repo: "https://github.com/fabiannavarroo/Web--Regalo",
      isPrivate: true,
      liveUrl: "https://feliz-cumple-albita.vercel.app",
      name: "Web Regalo",
      shortDescription: "Landing personal de felicitacion con una experiencia visual sencilla.",
      type: "landing",
      tech: ["HTML", "CSS", "JavaScript"],
      status: "Terminado",
      objective: "Crear una pagina regalo personalizada y publica.",
      features: ["Animacion visual", "Diseno responsive", "Deploy en Vercel"],
      previewTheme: "agency"
    },
    {
      repo: "https://github.com/Lucacas05/flowpal",
      isPrivate: true,
      liveUrl: "https://flowpal-teal.vercel.app",
      name: "FlowPal",
      previewImage: "./assets/github/flowpal-concert-stage.jpg",
      logoImage: "./assets/github/flowpal-concert-stage.jpg",
      shortDescription: "App React + Supabase para convertir prompts de ambiente en playlists.",
      type: "hackathon",
      tech: ["TypeScript", "React", "Supabase", "Vite"],
      status: "En progreso",
      objective: "Generar playlists con un flujo musical intencional a partir de lenguaje natural.",
      features: ["Landing pulida", "Demo IA", "Playlists por mood", "Base colaborativa"],
      previewTheme: "music"
    }
  ]
};
