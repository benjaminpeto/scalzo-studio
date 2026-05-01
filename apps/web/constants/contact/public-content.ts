import type { ContactOption, ContactStep } from "@/interfaces/contact/content";

const contactPublicContentByLocale = {
  en: {
    booking: {
      ctaPrimaryLabel: "Book a discovery call",
      ctaSecondaryLabel: "Request a quote instead",
      fallbackLabel: "Arrange a call by email",
      frameTitle: "Discovery call booking",
      intro:
        "If the scope is still moving or the right service is not obvious yet, a short discovery call is usually the faster route.",
      kicker: "Booking option",
      notes: [
        "Useful when the work needs scoping before it can be priced.",
        "Best for active launches, urgent homepage shifts, or unclear fit.",
        "A short call usually replaces multiple rounds of abstract briefing.",
      ],
      title: "Prefer to talk before filling a longer brief?",
    },
    captcha: {
      errorLoad: "The anti-spam check failed to load. Try again.",
      help: "Complete the hCaptcha check before sending the request.",
      label: "Anti-spam check",
      unavailable:
        "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.",
    },
    consent: {
      bodyPrefix:
        "I agree to be contacted about this request and understand that my details will be handled in accordance with the",
      conjunction: "and",
      cookiesLabel: "Cookie policy",
      privacyLabel: "Privacy notice",
    },
    form: {
      intro:
        "The form is split into a few short steps so the essentials arrive clearly: the type of work, the business context, the budget or timing, and the actual brief.",
      kicker: "Quote request",
      newsletterOptInLabel:
        "Sign me up for occasional editorial notes and studio updates by email. You can unsubscribe at any time.",
      responseNote:
        "Quote requests are reviewed manually. Expect a reply within two business days.",
      title: "A structured brief that keeps the first pass focused.",
    },
    hero: {
      bookingLabel: "Book a call",
      kicker: "Contact",
      quoteLabel: "Request a quote",
      sidePanelTitle: "What this page handles",
      signals: [
        "Short quote form, structured around four steps.",
        "Discovery-call option for faster scoping and fit checks.",
        "Best for premium service brands, launches, and page direction work.",
      ],
      intro:
        "Use the form when you already know the problem, scope, or timing. Use the booking option when the work is easier to shape in conversation. Both routes are designed to get to the real decision quickly.",
      title:
        "Request a quote or book a first call, depending on how defined the project already is.",
    },
    labels: {
      back: "Back",
      budgetBand: "Budget band",
      briefLegend: "Brief and consent",
      briefPlaceholder:
        "What needs to feel clearer, more premium, or more commercially useful?",
      company: "Company or brand",
      contactStepLegend: "Context",
      continue: "Continue",
      email: "Email",
      location: "Where are you based?",
      name: "Name",
      needLegend: "What do you need?",
      pending: "Submitting the request...",
      primaryGoal: "Primary goal",
      primaryGoalPlaceholder:
        "More qualified leads, clearer positioning, a stronger launch...",
      projectBrief: "Project brief",
      projectType: "Project type",
      servicesNeeded: "Services needed",
      submit: "Submit request",
      timeline: "Timeline",
      timelineLegend: "Budget and timeline",
      website: "Website or Instagram",
    },
    options: {
      budget: [
        { value: "under-1000", label: "Under EUR 1,000" },
        { value: "1000-3000", label: "EUR 1,000 - 3,000" },
        { value: "3000-7500", label: "EUR 3,000 - 7,500" },
        { value: "7500-15000", label: "EUR 7,500 - 15,000" },
        { value: "15000-plus", label: "EUR 15,000+" },
        { value: "not-sure-yet", label: "Not sure yet" },
      ] as const satisfies readonly ContactOption[],
      location: [
        { value: "canary-islands", label: "Canary Islands" },
        { value: "uk-europe", label: "UK / Europe" },
        { value: "north-america", label: "North America" },
        { value: "other", label: "Other" },
      ] as const satisfies readonly ContactOption[],
      projectType: [
        { value: "homepage", label: "Homepage" },
        { value: "service-page", label: "Service page" },
        { value: "launch", label: "Launch or campaign page" },
        { value: "editorial-system", label: "Editorial or content system" },
        { value: "ongoing-support", label: "Ongoing design support" },
      ] as const satisfies readonly ContactOption[],
      services: [
        {
          value: "strategic-framing",
          label: "Strategic framing",
          description: "Clarify the offer, hierarchy, and commercial story.",
        },
        {
          value: "design-systems",
          label: "Design systems",
          description:
            "Strengthen the interface, rhythm, and responsive system.",
        },
        {
          value: "digital-rollout",
          label: "Digital rollout",
          description:
            "Extend the direction into launches, campaigns, and content.",
        },
        {
          value: "not-sure-yet",
          label: "Not sure yet",
          description: "Use the first call to help define the right route.",
        },
      ] as const satisfies readonly ContactOption[],
      timeline: [
        { value: "asap", label: "ASAP (1-2 weeks)" },
        { value: "2-4-weeks", label: "2-4 weeks" },
        { value: "1-2-months", label: "1-2 months" },
        { value: "3-plus-months", label: "3+ months" },
        { value: "not-sure-yet", label: "Not sure yet" },
      ] as const satisfies readonly ContactOption[],
    },
    steps: [
      {
        step: "01",
        title: "Need",
        description: "Choose the work surface and define the main goal.",
      },
      {
        step: "02",
        title: "Context",
        description: "Share the practical details that shape the fit.",
      },
      {
        step: "03",
        title: "Budget",
        description: "Set the rough band and timing expectations.",
      },
      {
        step: "04",
        title: "Brief",
        description: "Add the detail and confirm consent to be contacted.",
      },
    ] as const satisfies readonly ContactStep[],
    success: {
      body: "The next step is a manual review of the scope, timing, and fit. If the project would move faster through conversation, you can also use the booking option now.",
      ctaPrimaryLabel: "Book a call",
      ctaSecondaryLabel: "Start another request",
      kicker: "Submission received",
      title: "Thanks. The request is in.",
    },
    thankYouPage: {
      body: "The quote request has been saved and queued for manual review. Use the booking option if the project would move faster through a short conversation while the first response is being prepared.",
      kicker: "Contact",
      title: "Thanks. Your request is with us.",
    },
    errors: {
      budgetBand: "Choose the budget band that feels closest to the project.",
      captchaRequired: "Complete the hCaptcha check before submitting.",
      captchaRetry: "Complete the anti-spam check and try again.",
      captchaUnavailable:
        "The anti-spam check could not be verified. Try again.",
      consent: "Consent is required before submitting the request.",
      email: "Enter a valid email address.",
      formUnavailable:
        "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.",
      general: "Check the highlighted fields and try again.",
      message: "Add a bit more detail so the first response can be useful.",
      name: "Enter the name of the main contact.",
      requestFailed:
        "The request could not be saved right now. Please try again or email hello@scalzostudio.com.",
      requestUnverified:
        "The request could not be verified right now. Please try again or email hello@scalzostudio.com.",
      servicesInterest: "Choose at least one service area.",
      success: "Thanks. The request is in and will be reviewed shortly.",
      timelineBand:
        "Choose the timeline that feels closest to the current plan.",
      primaryGoal: "Add the main goal or commercial shift you want.",
    },
  },
  es: {
    booking: {
      ctaPrimaryLabel: "Reservar una discovery call",
      ctaSecondaryLabel: "Pedir presupuesto en su lugar",
      fallbackLabel: "Organizar una llamada por email",
      frameTitle: "Reserva de llamada de descubrimiento",
      intro:
        "Si el alcance todavía está moviéndose o el servicio adecuado no está claro, una llamada breve de descubrimiento suele ser la vía más rápida.",
      kicker: "Opción de llamada",
      notes: [
        "Útil cuando el trabajo necesita definirse antes de poder presupuestarse.",
        "Ideal para lanzamientos activos, cambios urgentes en la homepage o encaje todavía poco claro.",
        "Una llamada corta suele sustituir varias rondas de briefing abstracto.",
      ],
      title: "¿Prefieres hablar antes de completar un brief más largo?",
    },
    captcha: {
      errorLoad:
        "La comprobación anti-spam no pudo cargarse. Inténtalo de nuevo.",
      help: "Completa la comprobación de hCaptcha antes de enviar la solicitud.",
      label: "Comprobación anti-spam",
      unavailable:
        "El formulario de contacto no está disponible temporalmente. Escribe a hello@scalzostudio.com.",
    },
    consent: {
      bodyPrefix:
        "Acepto que se me contacte sobre esta solicitud y entiendo que mis datos se tratarán de acuerdo con el",
      conjunction: "y",
      cookiesLabel: "Aviso de cookies",
      privacyLabel: "Aviso de privacidad",
    },
    form: {
      intro:
        "El formulario se divide en unos pocos pasos cortos para que lo esencial llegue con claridad: el tipo de trabajo, el contexto del negocio, el presupuesto o el plazo y el brief real.",
      kicker: "Solicitud de presupuesto",
      newsletterOptInLabel:
        "Quiero recibir por email notas editoriales ocasionales y actualizaciones del estudio. Puedo darme de baja en cualquier momento.",
      responseNote:
        "Las solicitudes de presupuesto se revisan manualmente. La respuesta suele llegar en un máximo de dos días laborables.",
      title:
        "Un brief estructurado para que la primera lectura se mantenga enfocada.",
    },
    hero: {
      bookingLabel: "Reservar llamada",
      kicker: "Contacto",
      quoteLabel: "Pedir presupuesto",
      sidePanelTitle: "Qué resuelve esta página",
      signals: [
        "Formulario breve de presupuesto, organizado en cuatro pasos.",
        "Opción de discovery call para acotar alcance y encaje más rápido.",
        "Pensado para marcas de servicios premium, lanzamientos y trabajo de dirección de páginas.",
      ],
      intro:
        "Usa el formulario cuando ya conoces el problema, el alcance o el timing. Usa la opción de llamada cuando el trabajo se define mejor conversando. Ambos caminos están pensados para llegar rápido a la decisión real.",
      title:
        "Pide presupuesto o reserva una primera llamada, según lo definido que esté ya el proyecto.",
    },
    labels: {
      back: "Volver",
      budgetBand: "Banda de presupuesto",
      briefLegend: "Brief y consentimiento",
      briefPlaceholder:
        "¿Qué necesita sentirse más claro, más premium o más útil a nivel comercial?",
      company: "Empresa o marca",
      contactStepLegend: "Contexto",
      continue: "Continuar",
      email: "Email",
      location: "¿Dónde estáis basados?",
      name: "Nombre",
      needLegend: "¿Qué necesitas?",
      pending: "Enviando la solicitud...",
      primaryGoal: "Objetivo principal",
      primaryGoalPlaceholder:
        "Más leads cualificados, un posicionamiento más claro, un lanzamiento más sólido...",
      projectBrief: "Brief del proyecto",
      projectType: "Tipo de proyecto",
      servicesNeeded: "Servicios necesarios",
      submit: "Enviar solicitud",
      timeline: "Plazo",
      timelineLegend: "Presupuesto y plazo",
      website: "Web o Instagram",
    },
    options: {
      budget: [
        { value: "under-1000", label: "Menos de 1.000 EUR" },
        { value: "1000-3000", label: "1.000 - 3.000 EUR" },
        { value: "3000-7500", label: "3.000 - 7.500 EUR" },
        { value: "7500-15000", label: "7.500 - 15.000 EUR" },
        { value: "15000-plus", label: "15.000 EUR o más" },
        { value: "not-sure-yet", label: "Aún no lo sé" },
      ] as const satisfies readonly ContactOption[],
      location: [
        { value: "canary-islands", label: "Canarias" },
        { value: "uk-europe", label: "Reino Unido / Europa" },
        { value: "north-america", label: "Norteamérica" },
        { value: "other", label: "Otro" },
      ] as const satisfies readonly ContactOption[],
      projectType: [
        { value: "homepage", label: "Homepage" },
        { value: "service-page", label: "Página de servicio" },
        { value: "launch", label: "Página de lanzamiento o campaña" },
        {
          value: "editorial-system",
          label: "Sistema editorial o de contenido",
        },
        { value: "ongoing-support", label: "Soporte de diseño continuo" },
      ] as const satisfies readonly ContactOption[],
      services: [
        {
          value: "strategic-framing",
          label: "Enfoque estratégico",
          description:
            "Aclarar la oferta, la jerarquía y la historia comercial.",
        },
        {
          value: "design-systems",
          label: "Sistemas de diseño",
          description:
            "Reforzar la interfaz, el ritmo y el sistema responsive.",
        },
        {
          value: "digital-rollout",
          label: "Despliegue digital",
          description:
            "Extender la dirección a lanzamientos, campañas y contenido.",
        },
        {
          value: "not-sure-yet",
          label: "Todavía no lo sé",
          description: "Usar la primera llamada para definir la ruta adecuada.",
        },
      ] as const satisfies readonly ContactOption[],
      timeline: [
        { value: "asap", label: "Lo antes posible (1-2 semanas)" },
        { value: "2-4-weeks", label: "2-4 semanas" },
        { value: "1-2-months", label: "1-2 meses" },
        { value: "3-plus-months", label: "3 meses o más" },
        { value: "not-sure-yet", label: "Aún no lo sé" },
      ] as const satisfies readonly ContactOption[],
    },
    steps: [
      {
        step: "01",
        title: "Necesidad",
        description:
          "Elige la superficie de trabajo y define el objetivo principal.",
      },
      {
        step: "02",
        title: "Contexto",
        description:
          "Comparte los detalles prácticos que determinan el encaje.",
      },
      {
        step: "03",
        title: "Presupuesto",
        description: "Marca una banda aproximada y las expectativas de plazo.",
      },
      {
        step: "04",
        title: "Brief",
        description:
          "Añade el detalle y confirma el consentimiento para ser contactado.",
      },
    ] as const satisfies readonly ContactStep[],
    success: {
      body: "El siguiente paso es una revisión manual del alcance, el plazo y el encaje. Si el proyecto avanzaría mejor conversando, también puedes usar ahora la opción de llamada.",
      ctaPrimaryLabel: "Reservar llamada",
      ctaSecondaryLabel: "Empezar otra solicitud",
      kicker: "Solicitud recibida",
      title: "Gracias. La solicitud ya está enviada.",
    },
    thankYouPage: {
      body: "La solicitud de presupuesto se ha guardado y ha quedado en cola para una revisión manual. Usa la opción de llamada si el proyecto avanzaría más rápido con una conversación breve mientras se prepara la primera respuesta.",
      kicker: "Contacto",
      title: "Gracias. Tu solicitud ya está con nosotras.",
    },
    errors: {
      budgetBand:
        "Elige la banda de presupuesto que más se acerque al proyecto.",
      captchaRequired: "Completa la comprobación de hCaptcha antes de enviar.",
      captchaRetry: "Completa la comprobación anti-spam e inténtalo de nuevo.",
      captchaUnavailable:
        "No se pudo verificar la comprobación anti-spam. Inténtalo otra vez.",
      consent:
        "Es necesario aceptar el consentimiento antes de enviar la solicitud.",
      email: "Introduce un correo electrónico válido.",
      formUnavailable:
        "El formulario de contacto no está disponible temporalmente. Escribe a hello@scalzostudio.com.",
      general: "Revisa los campos marcados e inténtalo de nuevo.",
      message:
        "Añade un poco más de detalle para que la primera respuesta sea útil.",
      name: "Introduce el nombre de la persona de contacto principal.",
      requestFailed:
        "No se ha podido guardar la solicitud ahora mismo. Inténtalo de nuevo o escribe a hello@scalzostudio.com.",
      requestUnverified:
        "No se ha podido verificar la solicitud ahora mismo. Inténtalo de nuevo o escribe a hello@scalzostudio.com.",
      servicesInterest: "Elige al menos un área de servicio.",
      success: "Gracias. La solicitud ya está enviada y se revisará en breve.",
      timelineBand: "Elige el plazo que más se acerque al plan actual.",
      primaryGoal:
        "Añade el objetivo principal o el cambio comercial que buscas.",
    },
  },
} as const;

export function getContactPublicContent(locale: string) {
  return contactPublicContentByLocale[locale === "es" ? "es" : "en"];
}
