import type { Metadata } from "next";

import { buildRouteMetadata } from "./route-metadata";

const marketingRouteMetadataEntriesByLocale = {
  en: {
    about: {
      canonical: "/about",
      description:
        "About Scalzo Studio: a Canary Islands-based editorial design studio focused on clearer positioning, stronger digital surfaces, and calmer commercial decisions.",
      title: "About | Scalzo Studio",
    },
    contact: {
      canonical: "/contact",
      description:
        "Contact Scalzo Studio to request a quote or book a discovery call for positioning, design systems, and digital rollout work.",
      title: "Contact | Scalzo Studio",
    },
    contactThankYou: {
      canonical: "/contact/thank-you",
      description:
        "Thanks for contacting Scalzo Studio. Review the next steps or book a discovery call while your quote request is being reviewed.",
      noIndex: true,
      title: "Thanks | Scalzo Studio",
    },
    cookies: {
      canonical: "/cookies",
      description:
        "Cookie notice for Scalzo Studio covering essential session cookies, conditional future analytics or anti-spam storage, and the current consent-first EU launch posture.",
      title: "Cookies | Scalzo Studio",
    },
    home: {
      canonical: "/",
      description:
        "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
      title: "Scalzo Studio",
    },
    insights: {
      canonical: "/insights",
      description:
        "Editorial notes on positioning, page structure, design systems, and the visual signals that make service businesses easier to trust.",
      title: "Insights | Scalzo Studio",
    },
    newsletterConfirmed: {
      canonical: "/newsletter/confirmed",
      description:
        "Newsletter confirmation state for Scalzo Studio editorial updates.",
      noIndex: true,
      title: "Newsletter confirmation | Scalzo Studio",
    },
    privacy: {
      canonical: "/privacy",
      description:
        "Privacy notice for Scalzo Studio covering contact requests, admin authentication, conditional future processors, and the current essential-only EU launch posture.",
      title: "Privacy | Scalzo Studio",
    },
    services: {
      canonical: "/services",
      description:
        "Outcome-focused strategy, design, and rollout services for businesses that need clearer positioning and stronger page confidence.",
      title: "Services | Scalzo Studio",
    },
    work: {
      canonical: "/work",
      description:
        "Published case studies showing how clearer positioning, stronger design direction, and calmer digital systems improve commercial outcomes.",
      title: "Work | Scalzo Studio",
    },
  },
  es: {
    about: {
      canonical: "/about",
      description:
        "Sobre Scalzo Studio: un estudio editorial de diseño en Canarias centrado en un posicionamiento más claro, superficies digitales más sólidas y decisiones comerciales más calmadas.",
      title: "Acerca de | Scalzo Studio",
    },
    contact: {
      canonical: "/contact",
      description:
        "Contacta con Scalzo Studio para pedir presupuesto o reservar una discovery call sobre posicionamiento, sistemas de diseño y despliegue digital.",
      title: "Contacto | Scalzo Studio",
    },
    contactThankYou: {
      canonical: "/contact/thank-you",
      description:
        "Gracias por contactar con Scalzo Studio. Revisa los siguientes pasos o reserva una discovery call mientras se revisa tu solicitud.",
      noIndex: true,
      title: "Gracias | Scalzo Studio",
    },
    cookies: {
      canonical: "/cookies",
      description:
        "Aviso de cookies de Scalzo Studio sobre cookies esenciales de sesión, almacenamiento analítico o anti-spam condicional y el enfoque actual de consentimiento previo en la UE.",
      title: "Cookies | Scalzo Studio",
    },
    home: {
      canonical: "/",
      description:
        "Diseño editorial de producto, marca y contenido para negocios en crecimiento en Canarias y más allá.",
      title: "Scalzo Studio",
    },
    insights: {
      canonical: "/insights",
      description:
        "Notas editoriales sobre posicionamiento, estructura de página, sistemas de diseño y las señales visuales que hacen más confiables a los negocios de servicios.",
      title: "Artículos | Scalzo Studio",
    },
    newsletterConfirmed: {
      canonical: "/newsletter/confirmed",
      description: "Estado de confirmación del newsletter de Scalzo Studio.",
      noIndex: true,
      title: "Confirmación del newsletter | Scalzo Studio",
    },
    privacy: {
      canonical: "/privacy",
      description:
        "Aviso de privacidad de Scalzo Studio sobre solicitudes de contacto, autenticación administrativa, proveedores condicionales y el enfoque actual de operaciones esenciales.",
      title: "Privacidad | Scalzo Studio",
    },
    services: {
      canonical: "/services",
      description:
        "Servicios de estrategia, dirección de diseño y despliegue para negocios que necesitan un posicionamiento más claro y páginas con mayor autoridad.",
      title: "Servicios | Scalzo Studio",
    },
    work: {
      canonical: "/work",
      description:
        "Casos publicados que muestran cómo un posicionamiento más claro, una dirección de diseño más fuerte y sistemas digitales más calmados mejoran resultados comerciales.",
      title: "Trabajo | Scalzo Studio",
    },
  },
} as const;

export const marketingRouteMetadataEntriesByKey =
  marketingRouteMetadataEntriesByLocale.en;

export const marketingRouteMetadata = Object.fromEntries(
  Object.entries(marketingRouteMetadataEntriesByKey).map(([key, entry]) => [
    key,
    buildRouteMetadata({ ...entry, locale: "en" }),
  ]),
) as Record<keyof typeof marketingRouteMetadataEntriesByKey, Metadata>;

export type MarketingRouteMetadataKey =
  keyof (typeof marketingRouteMetadataEntriesByLocale)["en"];

export function getMarketingRouteMetadata(
  locale: string,
  key: MarketingRouteMetadataKey,
): Metadata {
  const entrySet =
    marketingRouteMetadataEntriesByLocale[locale === "es" ? "es" : "en"];

  return buildRouteMetadata({ ...entrySet[key], locale });
}
