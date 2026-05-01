import type { AboutPrinciple, AboutSignal } from "@/interfaces/about/content";

const aboutPublicContentByLocale = {
  en: {
    capabilitiesBrowseLabel: "Browse all services",
    cta: {
      briefItems: [
        "Which page or offer currently feels less credible than the business behind it?",
        "Where is trust dropping too early in the current customer journey?",
        "What should a calmer, clearer first impression help you win next?",
      ],
      briefKicker: "First conversation",
      description:
        "If the studio approach feels close to the shift you need, the next move is a direct call about the current friction, the audience, and what the page should help you win next.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Book a call",
      secondaryActionLabel: "Browse services",
      title:
        "Need the site to feel more established before the next conversation starts?",
    },
    capabilities: {
      intro:
        "Capabilities are structured around the main stages of commercial clarity: getting the offer sharper, giving the interface more coherence, and extending that direction into launches or ongoing content.",
      kicker: "Capabilities",
      title:
        "A focused service map for the moments when the current surface needs more authority.",
    },
    hero: {
      kicker: "About Scalzo Studio",
      panelTitle: "Studio signal",
      signals: [
        { label: "Base", value: "Canary Islands, working internationally" },
        { label: "Focus", value: "Product, brand, and content direction" },
        {
          label: "Fit",
          value: "Service brands, launches, and premium small teams",
        },
        {
          label: "Model",
          value: "Senior-led, small, and direct from start to ship",
        },
      ] as const satisfies readonly AboutSignal[],
      supporting: [
        "The studio is based in the Canary Islands and shaped for businesses that need to speak both locally and internationally without flattening their character.",
        "Projects stay senior-led, compact, and commercially focused so the work can move quickly from diagnosis into something visible, usable, and easier to trust.",
      ],
      intro:
        "Scalzo Studio works where positioning, interface design, and editorial structure meet. The goal is not to make a site busier. It is to make the right signals land earlier, with more confidence, and with less friction for the buyer.",
      title:
        "A studio built to make strong businesses feel clearer, calmer, and more established from the first scroll.",
    },
    principles: {
      items: [
        {
          eyebrow: "01",
          title: "Clarity before decoration",
          body: "Every project starts with the message, the reading order, and the proof the visitor needs first. Visual expression should strengthen that logic, not compete with it.",
        },
        {
          eyebrow: "02",
          title: "Editorial, not ornamental",
          body: "The pages are designed to feel edited. Typography, spacing, imagery, and motion are used with restraint so the brand feels more certain, not more crowded.",
        },
        {
          eyebrow: "03",
          title: "Commercial usefulness",
          body: "The outcome is not a pretty artefact in isolation. It is a page, launch, or system that makes conversations easier, trust faster, and next steps more legible.",
        },
      ] as const satisfies readonly AboutPrinciple[],
      kicker: "Principles",
      title:
        "What guides the work when taste, clarity, and conversion all matter.",
    },
    proof: {
      intro:
        "Some projects need a stronger first impression. Others need better rollout discipline or a calmer sales story. The common thread is making the work easier to understand and easier to trust.",
      kicker: "Social proof",
      marksTitle:
        "A few of the sectors, clients, and contexts this direction is built to support.",
      title:
        "The approach is meant to travel across sectors, team sizes, and different levels of market maturity.",
    },
    resultCard: {
      label: "The result",
      title:
        "A clearer commercial story, expressed with more editorial confidence and less friction.",
    },
    story: {
      kicker: "Studio story",
      paragraphs: [
        "Most businesses do not need more content blocks or more visual noise. They need a clearer story, a stronger hierarchy, and a page that behaves like a commercial surface instead of a placeholder.",
        "That is the space Scalzo Studio is built for. The work usually starts by reading where trust drops, where the offer blurs, and where the interface is making decisions harder than they need to be. From there, strategy and design are shaped together rather than treated like separate phases that lose momentum in handoff.",
      ],
      title:
        "Small enough to stay direct. Senior enough to make the right page decisions early.",
    },
    workingModel: {
      intro:
        "The process stays compact on purpose. Read the friction clearly, shape the direction with intent, and land it in a surface the business can actually use.",
      kicker: "Working model",
      title: "A short route from diagnosis to launch-ready decisions.",
    },
  },
  es: {
    capabilitiesBrowseLabel: "Ver todos los servicios",
    cta: {
      briefItems: [
        "¿Qué página u oferta se siente ahora menos creíble que el negocio que hay detrás?",
        "¿Dónde cae la confianza demasiado pronto en el recorrido actual del cliente?",
        "¿Qué debería ayudarte a ganar una primera impresión más calma y más clara?",
      ],
      briefKicker: "Primera conversación",
      description:
        "Si el enfoque del estudio se parece al cambio que necesitas, el siguiente paso es una llamada directa sobre la fricción actual, la audiencia y lo que la página debería ayudarte a ganar después.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Reservar una llamada",
      secondaryActionLabel: "Ver servicios",
      title:
        "¿Necesitas que la web se sienta más establecida antes de la próxima conversación?",
    },
    capabilities: {
      intro:
        "Las capacidades se organizan alrededor de las etapas principales de la claridad comercial: afinar la oferta, dar más coherencia a la interfaz y extender esa dirección a lanzamientos o contenido continuo.",
      kicker: "Capacidades",
      title:
        "Un mapa de servicios enfocado para los momentos en que la superficie actual necesita más autoridad.",
    },
    hero: {
      kicker: "Sobre Scalzo Studio",
      panelTitle: "Señales del estudio",
      signals: [
        { label: "Base", value: "Canarias, trabajando de forma internacional" },
        {
          label: "Enfoque",
          value: "Dirección de producto, marca y contenido",
        },
        {
          label: "Encaje",
          value: "Marcas de servicios, lanzamientos y equipos pequeños premium",
        },
        {
          label: "Modelo",
          value: "Senior, pequeño y directo desde el inicio hasta la entrega",
        },
      ] as const satisfies readonly AboutSignal[],
      supporting: [
        "El estudio está basado en Canarias y pensado para negocios que necesitan hablar tanto a nivel local como internacional sin perder su carácter.",
        "Los proyectos se mantienen liderados por perfil senior, compactos y orientados al negocio para avanzar rápido desde el diagnóstico hasta algo visible, usable y más fácil de confiar.",
      ],
      intro:
        "Scalzo Studio trabaja donde se encuentran el posicionamiento, el diseño de interfaz y la estructura editorial. El objetivo no es hacer una web más ruidosa. Es hacer que las señales correctas lleguen antes, con más confianza y con menos fricción para quien compra.",
      title:
        "Un estudio pensado para que buenos negocios se sientan más claros, más calmados y más establecidos desde el primer scroll.",
    },
    principles: {
      items: [
        {
          eyebrow: "01",
          title: "Claridad antes que decoración",
          body: "Todo proyecto empieza por el mensaje, el orden de lectura y la prueba que la persona necesita primero. La expresión visual debe reforzar esa lógica, no competir con ella.",
        },
        {
          eyebrow: "02",
          title: "Editorial, no ornamental",
          body: "Las páginas están diseñadas para sentirse editadas. Tipografía, espacio, imagen y movimiento se usan con contención para que la marca se sienta más segura, no más saturada.",
        },
        {
          eyebrow: "03",
          title: "Utilidad comercial",
          body: "El resultado no es una pieza bonita aislada. Es una página, un lanzamiento o un sistema que facilita conversaciones, acelera la confianza y vuelve más legibles los siguientes pasos.",
        },
      ] as const satisfies readonly AboutPrinciple[],
      kicker: "Principios",
      title:
        "Lo que guía el trabajo cuando importan el gusto, la claridad y la conversión.",
    },
    proof: {
      intro:
        "Algunos proyectos necesitan una primera impresión más fuerte. Otros necesitan mejor disciplina de despliegue o una narrativa comercial más calmada. El hilo común es hacer que el trabajo sea más fácil de entender y de confiar.",
      kicker: "Prueba social",
      marksTitle:
        "Algunos de los sectores, clientes y contextos para los que está pensada esta dirección.",
      title:
        "El enfoque está pensado para moverse entre sectores, tamaños de equipo y distintos niveles de madurez de mercado.",
    },
    resultCard: {
      label: "El resultado",
      title:
        "Una historia comercial más clara, expresada con más confianza editorial y menos fricción.",
    },
    story: {
      kicker: "Historia del estudio",
      paragraphs: [
        "La mayoría de negocios no necesitan más bloques de contenido ni más ruido visual. Necesitan una historia más clara, una jerarquía más fuerte y una página que se comporte como una superficie comercial en lugar de un simple placeholder.",
        "Ahí es donde Scalzo Studio está construido para intervenir. El trabajo suele empezar leyendo dónde cae la confianza, dónde se difumina la oferta y dónde la interfaz está haciendo más difíciles las decisiones de lo necesario. A partir de ahí, estrategia y diseño se construyen juntos en lugar de separarse en fases que pierden impulso en el traspaso.",
      ],
      title:
        "Lo bastante pequeño para seguir directo. Lo bastante senior para tomar pronto las decisiones correctas de página.",
    },
    workingModel: {
      intro:
        "El proceso se mantiene compacto a propósito. Leer bien la fricción, dar forma a la dirección con intención y aterrizarla en una superficie que el negocio pueda usar de verdad.",
      kicker: "Modelo de trabajo",
      title:
        "Una ruta corta desde el diagnóstico hasta decisiones listas para lanzar.",
    },
  },
} as const;

export function getAboutPublicContent(locale: string) {
  return aboutPublicContentByLocale[locale === "es" ? "es" : "en"];
}
