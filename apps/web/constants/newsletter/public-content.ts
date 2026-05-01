const newsletterPublicContentByLocale = {
  en: {
    shared: {
      buttonLabel: "Join the newsletter",
      inputLabel: "Email address",
      inputPlaceholder: "name@company.com",
      legalNote: "Short, occasional notes only. No automation-heavy cadence.",
    },
    placements: {
      footer: {
        intro:
          "A light-touch signup for editorial notes, product thinking, and brand clarity.",
        kicker: "Newsletter",
        title: "Quiet notes, sent occasionally.",
      },
      home: {
        intro:
          "Editorial notes on product, positioning, and content systems for studios and growing teams.",
        kicker: "Newsletter",
        title:
          "Quiet notes on product, brand, and content for studios and growing teams.",
      },
      "insights-detail": {
        intro:
          "If this article was useful, the newsletter is the lightest way to receive new notes without checking back manually.",
        kicker: "Newsletter",
        title: "Get the next note in your inbox.",
      },
      "insights-index": {
        intro:
          "Editorial notes on product, positioning, and content systems for studios and growing teams.",
        kicker: "Newsletter",
        title:
          "Quiet notes on product, brand, and content for studios and growing teams.",
      },
    },
    states: {
      alreadySubscribed:
        "This email is already subscribed. Future notes will land there automatically.",
      confirmed:
        "Your subscription is confirmed. You are on the list for future notes.",
      emailUnavailable:
        "Newsletter signup is temporarily unavailable. Please try again later.",
      invalidEmail: "Enter a valid email address to join the newsletter.",
      expired:
        "That confirmation link has expired. Submit your email again and we will send a fresh one.",
      invalid:
        "That confirmation link is not valid anymore. Submit your email again to get a fresh one.",
      pending:
        "Check your inbox and confirm your subscription to finish joining the newsletter.",
      providerError:
        "The signup could not be completed right now. Please try again in a moment.",
      sending: "Sending...",
    },
  },
  es: {
    shared: {
      buttonLabel: "Unirse al newsletter",
      inputLabel: "Correo electrónico",
      inputPlaceholder: "nombre@empresa.com",
      legalNote:
        "Notas breves y ocasionales. Sin cadencias automáticas pesadas.",
    },
    placements: {
      footer: {
        intro:
          "Una suscripción ligera para notas editoriales, pensamiento de producto y claridad de marca.",
        kicker: "Newsletter",
        title: "Notas calmadas, enviadas de vez en cuando.",
      },
      home: {
        intro:
          "Notas editoriales sobre producto, posicionamiento y sistemas de contenido para estudios y equipos en crecimiento.",
        kicker: "Newsletter",
        title:
          "Notas sobre producto, marca y contenido para estudios y equipos en crecimiento.",
      },
      "insights-detail": {
        intro:
          "Si este artículo te resultó útil, el newsletter es la forma más ligera de recibir nuevas notas sin tener que volver a comprobarlo a mano.",
        kicker: "Newsletter",
        title: "Recibe la próxima nota en tu inbox.",
      },
      "insights-index": {
        intro:
          "Notas editoriales sobre producto, posicionamiento y sistemas de contenido para estudios y equipos en crecimiento.",
        kicker: "Newsletter",
        title:
          "Notas sobre producto, marca y contenido para estudios y equipos en crecimiento.",
      },
    },
    states: {
      alreadySubscribed:
        "Este correo ya está suscrito. Las próximas notas llegarán ahí automáticamente.",
      confirmed:
        "Tu suscripción está confirmada. Ya estás en la lista para futuras notas.",
      emailUnavailable:
        "La suscripción al newsletter no está disponible temporalmente. Inténtalo más tarde.",
      invalidEmail:
        "Introduce un correo electrónico válido para unirte al newsletter.",
      expired:
        "Ese enlace de confirmación ha caducado. Envía tu correo de nuevo y te mandaremos uno nuevo.",
      invalid:
        "Ese enlace de confirmación ya no es válido. Envía tu correo otra vez para recibir uno nuevo.",
      pending:
        "Revisa tu inbox y confirma la suscripción para terminar de unirte al newsletter.",
      providerError:
        "No se ha podido completar la suscripción ahora mismo. Inténtalo de nuevo en un momento.",
      sending: "Enviando...",
    },
  },
} as const;

export function getNewsletterPublicContent(locale: string) {
  return newsletterPublicContentByLocale[locale === "es" ? "es" : "en"];
}
