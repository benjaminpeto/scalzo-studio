const workPublicContentByLocale = {
  en: {
    cta: {
      briefItems: [
        "Which page or offer currently feels weaker than the business behind it?",
        "What should stronger positioning or a better first impression help you win next?",
        "Where is the current site making trust harder than it needs to be?",
      ],
      briefKicker: "Project brief",
      description:
        "If the work here feels close to the shift you need, the next step is a direct conversation about the current friction, the ambition, and the outcome the page should create.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Start a similar project",
      secondaryActionLabel: "Browse services",
      title:
        "Need a page or launch to feel more established in the first impression?",
    },
    grid: {
      ctaLabel: "Read case study",
      intro:
        "Each case study is listed with the sector or service context and one key metric or outcome so the commercial shift is visible at a glance.",
      title: "The work index.",
    },
    hero: {
      intro:
        "A published index of projects where positioning, page structure, and visual direction were sharpened to make the work feel more credible and commercially useful.",
      kicker: "Selected work",
      sidePanelLabel: "What to look for",
      sidePanelPoints: [
        "How the offer becomes easier to understand in the first scroll.",
        "How trust, proof, and pacing are reorganized into a calmer decision path.",
        "How strategy becomes visible in the actual interface, not just the pitch.",
      ],
      title:
        "Case studies that show what stronger clarity looks like once it is live.",
    },
  },
  es: {
    cta: {
      briefItems: [
        "¿Qué página u oferta se siente ahora más débil que el negocio que hay detrás?",
        "¿Qué debería ayudarte a ganar después un posicionamiento más fuerte o una mejor primera impresión?",
        "¿Dónde está la web actual poniendo más difícil la confianza de lo necesario?",
      ],
      briefKicker: "Brief del proyecto",
      description:
        "Si el trabajo aquí se parece al cambio que necesitas, el siguiente paso es una conversación directa sobre la fricción actual, la ambición y el resultado que la página debería generar.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Iniciar un proyecto similar",
      secondaryActionLabel: "Ver servicios",
      title:
        "¿Necesitas que una página o lanzamiento se sienta más establecido desde la primera impresión?",
    },
    grid: {
      ctaLabel: "Leer caso",
      intro:
        "Cada caso se lista con el contexto sectorial o de servicio y una métrica o resultado clave para que el cambio comercial se vea de un vistazo.",
      title: "Índice de trabajo.",
    },
    hero: {
      intro:
        "Un índice publicado de proyectos donde se afinó el posicionamiento, la estructura de página y la dirección visual para que el trabajo se sintiera más creíble y comercialmente útil.",
      kicker: "Trabajo seleccionado",
      sidePanelLabel: "Qué observar",
      sidePanelPoints: [
        "Cómo la oferta se entiende mejor en el primer scroll.",
        "Cómo la confianza, la prueba y el ritmo se reorganizan en un recorrido de decisión más calmado.",
        "Cómo la estrategia se vuelve visible en la interfaz real y no solo en el discurso.",
      ],
      title:
        "Casos que muestran cómo se ve una claridad más fuerte cuando ya está viva.",
    },
  },
} as const;

export function getWorkPublicContent(locale: string) {
  return workPublicContentByLocale[locale === "es" ? "es" : "en"];
}
