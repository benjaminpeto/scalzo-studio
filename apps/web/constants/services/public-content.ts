import type {
  ServicePackageOption,
  ServicesFaqItem,
} from "@/interfaces/services/content";

const servicesPublicContentByLocale = {
  en: {
    cta: {
      briefItems: [
        "Which offer needs to feel clearer or more premium?",
        "Where is the current page making the sale harder than it should be?",
        "What should a stronger service page or homepage help you win next?",
      ],
      briefKicker: "Project brief",
      description:
        "If the service direction here feels close to the shift you need, the next step is a direct conversation about the current friction, the ambition, and the outcome the page should create.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Start a project",
      secondaryActionLabel: "See featured work",
      title:
        "Need the offer to feel clearer and the page to carry more authority?",
    },
    faq: {
      intro:
        "A short clarification layer for scope, fit, and what stays in this ticket versus later service-detail work.",
      items: [
        {
          answer:
            "Most engagements begin with one page or one offer problem, then expand once the direction is proven. The page does not have to be the entire website to justify the work.",
          question: "Do we need the full site figured out before starting?",
        },
        {
          answer:
            "Yes. The strongest fit is a business with a real offer that needs sharper positioning, stronger proof, and more deliberate page structure.",
          question:
            "Can this work for service businesses and product-led teams?",
        },
        {
          answer:
            "Yes. Each core service now has its own detail page with framing, deliverables, process, and a clearer CTA path.",
          question: "Will each service get its own detail page?",
        },
        {
          answer:
            "Usually with a short review of the current site, the current offer, and the moments where confidence drops for the buyer. That gives the work a clear commercial target from day one.",
          question: "What happens before design work starts?",
        },
      ] as const satisfies readonly ServicesFaqItem[],
    },
    hero: {
      intro:
        "Strategy, design direction, and rollout support for teams that need a sharper commercial story, stronger structure, and a more credible first impression.",
      kicker: "Services",
      sidePanelLabel: "What changes",
      sidePanelPoints: [
        "The message becomes easier to understand in the first scroll.",
        "The page structure starts supporting confidence instead of noise.",
        "The visual system has room to scale into launches, content, and follow-on pages.",
      ],
      title:
        "Services that clarify the offer before the page starts trying to perform.",
    },
    packages: [
      {
        bestFor: "Teams that need clarity before redesign decisions compound.",
        label: "Diagnostic sprint",
        summary:
          "A focused positioning and structure pass that identifies what the site needs to say earlier, clearer, and with more authority.",
        timeline: "1 week",
      },
      {
        bestFor:
          "Founders who need a new page direction with stronger commercial weight.",
        label: "Signature page build",
        summary:
          "Strategy, design direction, component language, and a high-trust service page or homepage system built as one coherent release.",
        timeline: "2-4 weeks",
      },
      {
        bestFor:
          "Studios that want continuity across launch, content, and follow-on pages.",
        label: "Ongoing design partner",
        summary:
          "A retained collaboration model for rollout assets, page refinements, and campaign support after the core direction lands.",
        timeline: "Monthly",
      },
    ] as const satisfies readonly ServicePackageOption[],
    packagesSection: {
      intro:
        "Some teams need a diagnostic reset. Others need a full page direction. Others need a consistent partner after the first release is live.",
      kicker: "Ways to work",
      title: "Choose the depth of support that matches the moment.",
    },
    servicesList: {
      ctaLabel: "Explore service",
      heading: "A compact service menu, oriented around outcomes.",
      intro:
        "Each engagement is structured to reduce ambiguity, sharpen decision-making, and give the site or launch a more coherent commercial role.",
      kicker: "Service list",
      metadata: "Scalzo Studio service",
    },
  },
  es: {
    cta: {
      briefItems: [
        "¿Qué oferta necesita sentirse más clara o más premium?",
        "¿Dónde está la página actual haciendo la venta más difícil de lo que debería?",
        "¿Qué debería ayudarte a ganar después una página de servicio o homepage más sólida?",
      ],
      briefKicker: "Brief del proyecto",
      description:
        "Si la dirección de servicio aquí se parece al cambio que necesitas, el siguiente paso es una conversación directa sobre la fricción actual, la ambición y el resultado que la página debería crear.",
      kicker: "Scalzo Studio",
      primaryActionLabel: "Empezar un proyecto",
      secondaryActionLabel: "Ver trabajo destacado",
      title:
        "¿Necesitas que la oferta se sienta más clara y que la página tenga más autoridad?",
    },
    faq: {
      intro:
        "Una capa breve de aclaración sobre alcance, encaje y qué entra aquí frente a lo que queda para páginas de servicio más detalladas.",
      items: [
        {
          answer:
            "La mayoría de encargos empiezan con una página o un problema de oferta y luego se expanden cuando la dirección queda demostrada. La página no tiene que ser todo el sitio para justificar el trabajo.",
          question:
            "¿Necesitamos tener resuelto todo el sitio antes de empezar?",
        },
        {
          answer:
            "Sí. El mejor encaje es un negocio con una oferta real que necesita un posicionamiento más preciso, mejores pruebas y una estructura de página más deliberada.",
          question:
            "¿Puede funcionar tanto para negocios de servicios como para equipos de producto?",
        },
        {
          answer:
            "Sí. Cada servicio principal tiene ahora su propia página de detalle con enfoque, entregables, proceso y una ruta de CTA más clara.",
          question: "¿Cada servicio tendrá su propia página de detalle?",
        },
        {
          answer:
            "Normalmente con una revisión breve del sitio actual, la oferta actual y los momentos donde cae la confianza para quien compra. Eso da al trabajo un objetivo comercial claro desde el primer día.",
          question: "¿Qué pasa antes de que empiece el trabajo de diseño?",
        },
      ] as const satisfies readonly ServicesFaqItem[],
    },
    hero: {
      intro:
        "Estrategia, dirección de diseño y apoyo de despliegue para equipos que necesitan una historia comercial más precisa, mejor estructura y una primera impresión más creíble.",
      kicker: "Servicios",
      sidePanelLabel: "Qué cambia",
      sidePanelPoints: [
        "El mensaje se entiende mejor en el primer scroll.",
        "La estructura de la página empieza a reforzar la confianza en lugar del ruido.",
        "El sistema visual gana margen para escalar hacia lanzamientos, contenido y páginas posteriores.",
      ],
      title:
        "Servicios que aclaran la oferta antes de que la página empiece a intentar rendir por sí sola.",
    },
    packages: [
      {
        bestFor:
          "Equipos que necesitan claridad antes de que se acumulen decisiones de rediseño.",
        label: "Sprint de diagnóstico",
        summary:
          "Una pasada enfocada de posicionamiento y estructura para identificar qué necesita decir antes la web, con más claridad y con más autoridad.",
        timeline: "1 semana",
      },
      {
        bestFor:
          "Fundadores que necesitan una nueva dirección de página con más peso comercial.",
        label: "Página insignia",
        summary:
          "Estrategia, dirección de diseño, lenguaje de componentes y un sistema de página de servicio u homepage de alta confianza construido como una sola entrega coherente.",
        timeline: "2-4 semanas",
      },
      {
        bestFor:
          "Estudios que quieren continuidad entre lanzamientos, contenido y páginas posteriores.",
        label: "Partner de diseño continuo",
        summary:
          "Un modelo de colaboración recurrente para activos de lanzamiento, refinamiento de páginas y soporte de campañas después de aterrizar la dirección central.",
        timeline: "Mensual",
      },
    ] as const satisfies readonly ServicePackageOption[],
    packagesSection: {
      intro:
        "Algunos equipos necesitan un reajuste diagnóstico. Otros necesitan una dirección completa de página. Otros necesitan un partner constante después del primer release.",
      kicker: "Formas de trabajar",
      title: "Elige la profundidad de apoyo que encaja con el momento.",
    },
    servicesList: {
      ctaLabel: "Explorar servicio",
      heading: "Un menú de servicios compacto, orientado a resultados.",
      intro:
        "Cada encargo se estructura para reducir ambigüedad, afinar decisiones y dar al sitio o al lanzamiento un papel comercial más coherente.",
      kicker: "Listado de servicios",
      metadata: "Servicio de Scalzo Studio",
    },
  },
} as const;

export function getServicesPublicContent(locale: string) {
  return servicesPublicContentByLocale[locale === "es" ? "es" : "en"];
}
