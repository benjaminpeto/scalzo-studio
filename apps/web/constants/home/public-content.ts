import type {
  CredibilityStat,
  FaqItem,
  ProcessStep,
  StudioProfile,
  TrustMark,
} from "@/interfaces/home/content";

const homePublicContentByLocale = {
  en: {
    ctaBand: {
      briefItems: [
        "What is the business trying to look like?",
        "Where does the current homepage lose confidence?",
        "What should a better first impression help you win?",
      ],
      briefKicker: "Quick brief",
      description:
        "The first step is a direct conversation about the current page, the level of ambition, and what needs to feel more premium or more convincing.",
      kicker: "Brand direction",
      primaryActionLabel: "Book a discovery call",
      secondaryActionLabel: "Read the journal",
      title: "Ready to sharpen the homepage and the brand behind it?",
    },
    faq: {
      intro:
        "The final objections are handled here with a minimal accordion layout, generous spacing, and a clear route back to contact.",
      items: [
        {
          answer:
            "The strongest fit is a business with a real offer and real proof, but a page that still feels too generic, too busy, or too weak in the first impression.",
          question: "What kind of homepage projects are the best fit?",
        },
        {
          answer:
            "Yes. The structure is designed to feel accessible for local service businesses while still reading as strategic and mature for international partners.",
          question: "Can this work for both local and international audiences?",
        },
        {
          answer:
            "No. The homepage is the most visible entry point, but the same visual and structural logic can extend into service pages, launch assets, and ongoing content.",
          question: "Do you only redesign homepages?",
        },
        {
          answer:
            "With a short review of the current site, offer, and friction points. The first objective is identifying what the page needs to signal earlier and more clearly.",
          question: "How do projects usually start?",
        },
      ] as const satisfies readonly FaqItem[],
    },
    featuredWork: {
      ctaLabel: "Start a similar project",
      eyebrow: "Selected work",
      intro:
        "Editorial case studies with one large visual rhythm, a quieter text line, and enough asymmetry to feel designed rather than templated.",
      kicker: "Projects.",
      supporting: "Ambition made visible.",
    },
    hero: {
      description:
        "Strategy, design, and digital direction fused into a homepage that looks more established, reads more clearly, and moves people toward contact faster.",
      kicker: "Brand strategy, shaped into interface",
      primaryActionLabel: "Tell us about the project",
      secondaryActionAriaLabel: "Scroll to projects",
      title: "Open the brand wider and make the first scroll feel decisive.",
    },
    journal: {
      ctaLabel: "Read article",
      intro:
        "Notes on positioning, design systems, and the visual signals that make commercial pages feel more convincing.",
      title: "Journal.",
    },
    processMethod: {
      intro:
        "The method rests on four pillars. We read the context, position the message, express the brand through the interface, and shape the navigation so the ambition becomes more legible.",
      title: "Every strong homepage starts with sharper meaning.",
    },
    processSteps: [
      {
        step: "01",
        title: "Observe",
        description:
          "We read the market, the audience, and the friction points until the real problem is visible.",
      },
      {
        step: "02",
        title: "Position",
        description:
          "The message is placed where it carries the most weight and the brand has room to feel distinctive.",
      },
      {
        step: "03",
        title: "Express",
        description:
          "Words, visuals, and components are aligned so the page feels coherent, premium, and easier to trust.",
      },
      {
        step: "04",
        title: "Navigate",
        description:
          "The final system turns strategy into a usable structure that works across launch, growth, and maintenance.",
      },
    ] as const satisfies readonly ProcessStep[],
    servicesPreview: {
      kicker: "Scalzo Studio",
      title: "Strategy • Design • Digital",
    },
    studioCredibility: {
      body: "Based in the Canary Islands, the studio helps ambitious brands move from visually acceptable to commercially memorable.",
      featuredStatement: "Two disciplines,\none editorial vision.",
      profiles: [
        {
          title: "Research-first direction",
          role: "Strategy and positioning",
          image: "/placeholders/case-coastal.svg",
          description:
            "The first pass is never decoration. It starts with the message, the order of information, and the confidence the page needs to create.",
        },
        {
          title: "Strategic creative",
          role: "Design and rollout",
          image: "/placeholders/hero-editorial.svg",
          description:
            "The visual language stays simple, but the composition is intentionally shaped to make the studio feel more established and memorable.",
        },
      ] as const satisfies readonly StudioProfile[],
      stats: [
        { value: "Product", label: "Clear UX and conversion thinking" },
        { value: "Brand", label: "Identity with more authority" },
        { value: "Content", label: "Editorial structure that lasts" },
      ] as const satisfies readonly CredibilityStat[],
      title: "More than logos, we give the brand a clearer commercial role.",
    },
    testimonials: {
      intro:
        "Short reflections from teams that needed a homepage to look more established, explain itself faster, and support better conversations after the first visit.",
      kicker: "Selected words",
      title: "The page feels more certain when the proof sounds human.",
    },
    trustMarks: [
      { name: "Picture", note: "Outdoor hospitality" },
      { name: "Vacheron", note: "Luxury-led identity" },
      { name: "Ateliers", note: "Art direction systems" },
      { name: "Elthys", note: "Editorial positioning" },
      { name: "Catalyst", note: "Launch and growth" },
      { name: "Canary", note: "Local premium brands" },
    ] as const satisfies readonly TrustMark[],
    trustStripAriaLabel: "Studio proof",
  },
  es: {
    ctaBand: {
      briefItems: [
        "¿Qué imagen quiere proyectar realmente el negocio?",
        "¿Dónde pierde fuerza o confianza la página actual?",
        "¿Qué debería ayudarte a ganar una mejor primera impresión?",
      ],
      briefKicker: "Brief rápido",
      description:
        "El primer paso es una conversación directa sobre la página actual, el nivel de ambición y qué necesita sentirse más sólido o más convincente.",
      kicker: "Dirección de marca",
      primaryActionLabel: "Reservar una llamada de descubrimiento",
      secondaryActionLabel: "Leer el journal",
      title: "¿Listo para afinar la homepage y la marca que hay detrás?",
    },
    faq: {
      intro:
        "Las objeciones finales se resuelven aquí con un acordeón sobrio, buen espacio y una ruta clara de vuelta al contacto.",
      items: [
        {
          answer:
            "El mejor encaje es un negocio con una oferta real y pruebas reales, pero con una página que todavía se siente demasiado genérica, demasiado cargada o demasiado débil en la primera impresión.",
          question: "¿Qué tipo de proyectos de homepage encajan mejor?",
        },
        {
          answer:
            "Sí. La estructura está pensada para funcionar con negocios locales de servicios y seguir leyéndose como estratégica y madura para partners internacionales.",
          question:
            "¿Puede funcionar tanto para audiencias locales como internacionales?",
        },
        {
          answer:
            "No. La homepage es el punto de entrada más visible, pero la misma lógica visual y estructural puede extenderse a páginas de servicio, lanzamientos y contenido continuo.",
          question: "¿Solo rediseñas homepages?",
        },
        {
          answer:
            "Con una revisión breve del sitio actual, la oferta y los puntos de fricción. El primer objetivo es detectar qué debe comunicarse antes y con más claridad.",
          question: "¿Cómo suelen empezar los proyectos?",
        },
      ] as const satisfies readonly FaqItem[],
    },
    featuredWork: {
      ctaLabel: "Iniciar un proyecto similar",
      eyebrow: "Trabajo seleccionado",
      intro:
        "Casos editoriales con una gran cadencia visual, una línea de texto más calmada y la asimetría justa para sentirse diseñados y no plantillados.",
      kicker: "Proyectos.",
      supporting: "La ambición, hecha visible.",
    },
    hero: {
      description:
        "Estrategia, diseño y dirección digital reunidos en una homepage que se siente más establecida, se entiende con más claridad y acerca antes al contacto.",
      kicker: "Estrategia de marca convertida en interfaz",
      primaryActionLabel: "Cuéntanos el proyecto",
      secondaryActionAriaLabel: "Ir a proyectos",
      title:
        "Abrir mejor la marca y hacer que el primer scroll se sienta decisivo.",
    },
    journal: {
      ctaLabel: "Leer artículo",
      intro:
        "Notas sobre posicionamiento, sistemas de diseño y las señales visuales que hacen que una página comercial resulte más convincente.",
      title: "Journal.",
    },
    processMethod: {
      intro:
        "El método se apoya en cuatro pilares. Leemos el contexto, colocamos el mensaje, expresamos la marca en la interfaz y damos forma a la navegación para que la ambición se entienda mejor.",
      title: "Toda homepage sólida empieza con un significado más preciso.",
    },
    processSteps: [
      {
        step: "01",
        title: "Observar",
        description:
          "Leemos el mercado, la audiencia y los puntos de fricción hasta que el problema real se vuelve visible.",
      },
      {
        step: "02",
        title: "Posicionar",
        description:
          "El mensaje se coloca donde puede cargar más peso y donde la marca tiene espacio para sentirse distinta.",
      },
      {
        step: "03",
        title: "Expresar",
        description:
          "Alineamos palabras, visuales y componentes para que la página se sienta coherente, premium y más fácil de confiar.",
      },
      {
        step: "04",
        title: "Guiar",
        description:
          "El sistema final convierte la estrategia en una estructura utilizable para lanzamiento, crecimiento y mantenimiento.",
      },
    ] as const satisfies readonly ProcessStep[],
    servicesPreview: {
      kicker: "Scalzo Studio",
      title: "Estrategia • Diseño • Digital",
    },
    studioCredibility: {
      body: "Desde Canarias, el estudio ayuda a marcas ambiciosas a pasar de verse correctas a sentirse memorables en lo comercial.",
      featuredStatement: "Dos disciplinas,\nuna visión editorial.",
      profiles: [
        {
          title: "Dirección basada en investigación",
          role: "Estrategia y posicionamiento",
          image: "/placeholders/case-coastal.svg",
          description:
            "La primera pasada nunca es decoración. Empieza con el mensaje, el orden de lectura y la confianza que la página debe generar.",
        },
        {
          title: "Creatividad estratégica",
          role: "Diseño y despliegue",
          image: "/placeholders/hero-editorial.svg",
          description:
            "El lenguaje visual se mantiene simple, pero la composición se trabaja con intención para que el estudio se sienta más establecido y memorable.",
        },
      ] as const satisfies readonly StudioProfile[],
      stats: [
        { value: "Producto", label: "UX clara y criterio de conversión" },
        { value: "Marca", label: "Identidad con más autoridad" },
        { value: "Contenido", label: "Estructura editorial duradera" },
      ] as const satisfies readonly CredibilityStat[],
      title: "Más que logos, damos a la marca un papel comercial más claro.",
    },
    testimonials: {
      intro:
        "Reflexiones breves de equipos que necesitaban que su homepage pareciera más consolidada, se explicara antes y facilitara mejores conversaciones tras la primera visita.",
      kicker: "Voces seleccionadas",
      title: "La página se siente más segura cuando la prueba suena humana.",
    },
    trustMarks: [
      { name: "Picture", note: "Hospitalidad exterior" },
      { name: "Vacheron", note: "Identidad de enfoque lujo" },
      { name: "Ateliers", note: "Sistemas de dirección de arte" },
      { name: "Elthys", note: "Posicionamiento editorial" },
      { name: "Catalyst", note: "Lanzamiento y crecimiento" },
      { name: "Canary", note: "Marcas premium locales" },
    ] as const satisfies readonly TrustMark[],
    trustStripAriaLabel: "Prueba del estudio",
  },
} as const;

export function getHomePublicContent(locale: string) {
  return homePublicContentByLocale[locale === "es" ? "es" : "en"];
}
