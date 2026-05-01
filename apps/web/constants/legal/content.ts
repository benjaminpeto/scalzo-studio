import type {
  CookieCategoryDisclosure,
  LegalProcessorDisclosure,
  LegalSectionContent,
  LegalSummaryItem,
  PrivacyProcessingActivity,
} from "@/interfaces/legal/content";
import { publicFeatureFlags } from "@/lib/env/public";

export const legalControllerDetails = {
  address: "Spain, 35613, Tetir, Calle Tetir 59B",
  email: "ariana@scalzostudio.com",
  name: "Ariana Carmen Scalzo Dees",
  taxId: "XX23232323",
} as const;

export const legalPolicyEffectiveDate = "March 24, 2026";

export const complaintAuthority = {
  label: "Agencia Española de Protección de Datos (AEPD)",
  url: "https://www.aepd.es/",
} as const;

const bookingEnabled = publicFeatureFlags.calBookingEnabled;

export const privacyPageContent = {
  intro: {
    kicker: "Privacy",
    title:
      "A practical privacy notice for the way Scalzo Studio currently operates.",
    intro:
      "This page explains what personal data Scalzo Studio processes through the site, the lawful basis for each activity, and the rights you have under GDPR and Spanish data protection law.",
    lastUpdated: legalPolicyEffectiveDate,
    note: "Current scope: contact requests, admin authentication, essential operational processing, and consent-gated PostHog analytics. Conditional disclosures are clearly marked and are not treated as live unless the relevant feature is enabled.",
    summary: [
      {
        label: "Controller",
        value: legalControllerDetails.name,
        detail: `${legalControllerDetails.address} — Tax ID ${legalControllerDetails.taxId}`,
      },
      {
        label: "Privacy contact",
        value: legalControllerDetails.email,
        detail:
          "Use this address for access, correction, deletion, objection, or consent-related requests. We aim to respond within one calendar month.",
      },
      {
        label: "Analytics",
        value: "Consent-gated",
        detail:
          "PostHog analytics is live but only captures data after you explicitly accept via the cookie banner. You can withdraw consent at any time via the Cookie policy page.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "scope",
      title: "What this notice covers",
      paragraphs: [
        "This notice is prepared in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) and Organic Law 3/2018 of 5 December on the Protection of Personal Data and the Guarantee of Digital Rights (LOPDGDD). Both instruments apply to personal data processed in connection with this website.",
        "This notice applies to personal data processed through the Scalzo Studio website, especially quote requests, admin authentication and session handling, consent-gated analytics, and related operational follow-up.",
        `It is written to match the current implementation plus clearly labelled near-term services that may be enabled later, such as hCaptcha anti-spam checks${bookingEnabled ? ", alongside the live Cal.com booking flow." : ", or a future booking provider."}`,
      ],
      note: "If a new processor or new purpose is added, this notice must be updated before the feature is launched in production.",
    },
    {
      id: "transfers",
      title: "International transfers",
      paragraphs: [
        "Some service providers used for hosting, authentication, analytics, scheduling, or security process data outside Spain or the European Economic Area.",
        "When that happens, Scalzo Studio relies on the provider's GDPR transfer safeguards, such as Standard Contractual Clauses (SCCs) or equivalent legal mechanisms, and keeps the processor list on this page aligned with the live stack. You may request details of the specific safeguards in place by contacting the data controller.",
      ],
    },
    {
      id: "automated-decisions",
      title: "Automated decision-making",
      paragraphs: [
        "Scalzo Studio does not carry out automated decision-making or profiling that produces legal or similarly significant effects on individuals. No personal data collected through this site is used for automated individual decision-making within the meaning of Article 22 GDPR.",
      ],
    },
    {
      id: "rights",
      title: "Your data protection rights",
      paragraphs: [
        "Under GDPR and LOPDGDD you have the following rights in relation to personal data processed by Scalzo Studio. To exercise any of these rights, contact the data controller at the email address above.",
        "We will respond to all valid requests within one calendar month of receipt. In complex or high-volume cases this period may be extended by a further two months; you will be notified within the first month if that applies.",
        "If processing relies on consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.",
      ],
      items: [
        "Request a copy of the personal data held about you (right of access).",
        "Ask for inaccurate or incomplete data to be corrected (right to rectification).",
        "Ask for data to be erased when there is no valid reason to keep it (right to erasure).",
        "Object to processing based on legitimate interests where your rights override that interest (right to object).",
        "Request restriction of processing in certain circumstances (right to restriction).",
        "Receive your data in a portable format where applicable (right to portability).",
        "Withdraw consent for analytics at any time via the Cookie policy page. Withdrawal takes effect immediately.",
        "Not be subject to solely automated decision-making with legal or similarly significant effects. Scalzo Studio does not perform such processing.",
      ],
    },
    {
      id: "complaints",
      title: "Questions and complaints",
      paragraphs: [
        `Privacy requests can be sent to ${legalControllerDetails.email}. We aim to respond within one calendar month.`,
        "If you believe your data has been handled unlawfully, you have the right to lodge a complaint with the competent supervisory authority. In Spain this is the Agencia Española de Protección de Datos (AEPD). This right exists without prejudice to any other administrative or judicial remedy.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  activities: [
    {
      title: "Contact and quote requests",
      status: "Live",
      lawfulBasis:
        "Pre-contractual steps taken at your request (Article 6(1)(b) GDPR), and legitimate interests in handling inbound commercial enquiries (Article 6(1)(f) GDPR).",
      purpose:
        "To review scope, assess fit, reply to your request, and prepare a follow-up, quote, or call.",
      dataCategories: [
        "Name, email address, company, website or profile, and location",
        "Service interests, project type, primary goal, budget band, and timeline band",
        "Message content and any business context you submit in the brief",
        "Page path, referrer, and UTM parameters captured with the submission",
      ],
      recipients: ["Supabase"],
      retention:
        "Typically up to 12 months after the last substantive contact, unless a longer period is required to complete the requested work, maintain business records, or establish or defend legal claims.",
      note: undefined,
    },
    {
      title: "Admin authentication and session security",
      status: "Live",
      lawfulBasis:
        "Legitimate interests in securing the site and administering restricted internal routes (Article 6(1)(f) GDPR).",
      purpose:
        "To authenticate approved admins, maintain their session, and protect admin-only content and workflows.",
      dataCategories: [
        "Admin email address and authentication identifiers",
        "Session and security cookie data needed for Supabase authentication",
        "Basic technical metadata associated with login and session handling",
      ],
      recipients: ["Supabase"],
      retention:
        "Retention follows the relevant authentication and session lifecycle, plus any access records reasonably needed for security and troubleshooting.",
      note: undefined,
    },
    {
      title: "Anti-spam and abuse prevention",
      status: "Conditional",
      lawfulBasis:
        "Legitimate interests in protecting the site and forms from spam, abuse, and automated misuse (Article 6(1)(f) GDPR).",
      purpose:
        "To assess suspicious activity and block abusive form submissions if hCaptcha or a similar service is enabled.",
      dataCategories: [
        "IP address and browser or device signals",
        "Challenge, risk, or interaction data generated during abuse checks",
      ],
      recipients: ["hCaptcha or equivalent anti-spam provider"],
      retention:
        "Provider-dependent. Retention follows the live vendor configuration and documented provider terms when enabled.",
      note: "Not treated as active unless the production form is using the anti-spam service.",
    },
    {
      title: "Website analytics",
      status: "Live",
      lawfulBasis:
        "Consent (Article 6(1)(a) GDPR). PostHog analytics is only activated after you explicitly accept via the cookie consent banner.",
      purpose:
        "To understand site usage, page navigation, and conversion behaviour in order to improve the site experience. PostHog is initialised in opt-out mode by default and only begins capturing data after your explicit consent.",
      dataCategories: [
        "Page views, navigation events, and user interaction data",
        "Device type, browser, and operating system",
        "Approximate geographic location derived from IP address",
        "Session identifiers and anonymised event properties tied to site activity",
      ],
      recipients: ["PostHog"],
      retention:
        "PostHog session identifiers are stored for up to one year. You can remove them at any time by clearing your browser storage or withdrawing consent via the Cookie policy page.",
      note: "You can withdraw analytics consent at any time via the Cookie policy page. Withdrawal takes effect immediately and no further data will be captured.",
    },
    {
      title: "Newsletter signup",
      status: "Live",
      lawfulBasis: "Consent (Article 6(1)(a) GDPR).",
      purpose:
        "To send editorial or studio updates to users who actively subscribe and confirm their email address through a double opt-in flow.",
      dataCategories: [
        "Email address",
        "Signup placement and page path",
        "Confirmation token metadata, confirmation timestamps, and subscription status",
      ],
      recipients: ["Supabase", "Resend"],
      retention:
        "Until you unsubscribe, request deletion, or the newsletter channel is retired.",
      note: "Signup requests are stored in Supabase as pending until the email confirmation link is used. Resend is only updated after confirmation succeeds.",
    },
    {
      title: "Booking requests",
      status: bookingEnabled ? "Live" : "Conditional",
      lawfulBasis:
        "Pre-contractual steps taken at your request (Article 6(1)(b) GDPR) when you choose to arrange a discovery call.",
      purpose: bookingEnabled
        ? "To schedule, confirm, and prepare a discovery call through the embedded Cal.com booking flow."
        : "To schedule, confirm, and prepare a discovery call if a booking provider is enabled later.",
      dataCategories: [
        "Name, email address, scheduling preferences, and any notes you provide during booking",
      ],
      recipients: [bookingEnabled ? "Cal.com" : "Future booking provider"],
      retention: bookingEnabled
        ? "Depends on the Cal.com booking record lifecycle and any follow-up relationship created by the booking request."
        : "Depends on the chosen provider and the follow-up relationship created by the booking request.",
      note: bookingEnabled
        ? "The site uses an embedded Cal.com scheduler on the contact page and records only limited first-party booking completion metadata in Supabase."
        : "The current contact page uses an email fallback and does not yet rely on an embedded booking processor.",
    },
  ] as const satisfies readonly PrivacyProcessingActivity[],
  processors: [
    {
      name: "Supabase",
      status: "Live",
      role: "Hosting, database, and authentication processor",
      detail:
        "Used to store inbound lead records, newsletter signups, and support authenticated admin sessions. Data is processed under a Data Processing Agreement.",
      note: undefined,
    },
    {
      name: "PostHog",
      status: "Live",
      role: "Analytics processor",
      detail:
        "Used for consent-gated site analytics. PostHog is configured to start in opt-out mode and only activates after you explicitly accept via the cookie consent banner.",
      note: undefined,
    },
    {
      name: "hCaptcha",
      status: "Conditional",
      role: "Security and anti-spam processor",
      detail:
        "May be used to protect forms from abuse if anti-spam checks are enabled in production.",
      note: undefined,
    },
    {
      name: bookingEnabled ? "Cal.com" : "Booking provider",
      status: bookingEnabled ? "Live" : "Conditional",
      role: "Scheduling processor",
      detail: bookingEnabled
        ? "Used to host the embedded discovery-call scheduler and related booking confirmations."
        : "A booking tool may be added later for discovery calls. The provider is not yet finalised.",
      note: undefined,
    },
    {
      name: "Resend",
      status: "Live",
      role: "Email delivery processor",
      detail:
        "Used to send newsletter confirmation emails and deliver confirmed newsletter content to subscribers.",
      note: undefined,
    },
  ] as const satisfies readonly LegalProcessorDisclosure[],
} as const;

export const cookiesPageContent = {
  intro: {
    kicker: "Cookies",
    title: "Cookie notice aligned to GDPR and the Spanish LSSI-CE.",
    intro:
      "This page explains which cookies and similar storage technologies are active on this site, the legal basis for each, and how to manage your preferences.",
    lastUpdated: legalPolicyEffectiveDate,
    note: "Essential cookies are always active. Analytics cookies require your explicit consent and only fire after you accept via the banner. You can change your preference at any time.",
    summary: [
      {
        label: "Current status",
        value: "Essential + consent-gated analytics",
        detail:
          "Only cookies strictly necessary for security and authentication are active by default. PostHog analytics is optional and requires explicit consent.",
      },
      {
        label: "Preference centre",
        value: "Cookie banner",
        detail:
          "A consent banner on first visit lets you accept or decline PostHog analytics. You can change your preference at any time by clearing your browser storage or contacting us.",
      },
      {
        label: "Legal basis",
        value: "Consent (analytics) / Legitimate interest (essential)",
        detail:
          "Non-essential cookies require prior informed consent under GDPR Article 6(1)(a) and the Spanish LSSI-CE. Essential cookies rely on legitimate interests in site security and requested functionality.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "about-cookies",
      title: "What cookies and similar storage do",
      paragraphs: [
        "Cookies are small text files stored on your device by a website. Similar technologies include local storage, session storage, and authentication tokens used by embedded services.",
        "Some of these technologies are strictly necessary for the site to function securely. Others — such as analytics identifiers — are optional and under Spanish and EU law require your explicit prior consent before activation.",
        "Under the Spanish Law on Information Society Services and Electronic Commerce (LSSI-CE, implementing the EU ePrivacy Directive), websites must obtain informed prior consent before placing non-essential cookies. The cookie consent banner on this site fulfils that requirement.",
      ],
    },
    {
      id: "preferences",
      title: "Your cookie preferences",
      paragraphs: [
        "When you first visit this site, a cookie consent banner gives you a clear choice about analytics cookies before any non-essential tracking begins. You can accept or decline in one click.",
        "PostHog analytics is the only non-essential storage currently in use. It is initialised in opt-out mode by default and only activates after your explicit consent. Withdrawing consent is immediate — no further analytics data will be sent.",
        `To change your preference at any time, clear your browser storage for this site or contact us at ${legalControllerDetails.email}.`,
      ],
    },
    {
      id: "manage",
      title: "Managing cookies in your browser",
      paragraphs: [
        "Most browsers let you review, block, or delete cookies through their privacy or security settings. Consult your browser's help pages for instructions.",
        "Blocking essential cookies may affect admin login flows or other requested functionality that depends on secure session handling. Blocking analytics cookies has no effect on the core site experience.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  categories: [
    {
      title: "Strictly necessary cookies",
      status: "Active",
      purpose:
        "To keep the site secure, maintain requested sessions, and support core authentication behaviour.",
      legalBasis:
        "Legitimate interests in site security and providing the requested service (LSSI-CE Article 22.2 exemption for technically necessary cookies). Consent is not required for this category.",
      examples: [
        "Supabase authentication and session cookies for admin access",
        "Session or security tokens needed to protect restricted routes",
      ],
      note: "These cookies are exempt from consent requirements under the LSSI-CE because they are strictly necessary for the site to function as requested.",
    },
    {
      title: "Analytics cookies",
      status: "Active",
      purpose:
        "To measure page visits, navigation patterns, and conversion events using PostHog, in order to improve the site experience.",
      legalBasis:
        "Consent (GDPR Article 6(1)(a) and LSSI-CE Article 22.2). PostHog analytics only activates after you explicitly accept via the cookie consent banner. The PostHog session identifier is stored for up to one year.",
      examples: [
        "PostHog session identifier stored in local storage — up to 1 year",
        "PostHog event data and anonymised interaction properties",
      ],
      note: "Active only when you have accepted analytics cookies via the banner. If you decline or make no choice, PostHog remains in opt-out mode and no analytics data is captured or sent.",
    },
    {
      title: "Security and anti-spam cookies",
      status: "Inactive until enabled",
      purpose:
        "To distinguish human traffic from abusive traffic if hCaptcha or a similar anti-spam provider is enabled.",
      legalBasis:
        "Legitimate interests in site security (Article 6(1)(f) GDPR), subject to review against the live vendor behaviour when enabled.",
      examples: [
        "Risk, challenge, or security-related storage used by an anti-spam provider",
      ],
      note: "Not treated as active unless the form is protected by the provider in production.",
    },
    {
      title: "Booking and embedded service cookies",
      status: bookingEnabled ? "Active" : "Inactive until enabled",
      purpose: bookingEnabled
        ? "To support the embedded Cal.com booking experience used for discovery-call scheduling."
        : "To support a future embedded booking experience if a scheduling provider is added.",
      legalBasis: bookingEnabled
        ? "Necessary for the user-requested booking flow (LSSI-CE Article 22.2 exemption) where the Cal.com embed requires storage to operate."
        : "Depends on the final provider setup and whether the storage is strictly necessary for a user-requested booking flow.",
      examples: [
        bookingEnabled
          ? "Cookies or local storage created by the embedded Cal.com scheduler"
          : "Cookies or local storage created by a future booking embed",
      ],
      note: bookingEnabled
        ? "Treat this category as active only while the embedded booking flow remains live on the contact page."
        : undefined,
    },
  ] as const satisfies readonly CookieCategoryDisclosure[],
} as const;

const privacyPageContentEs = {
  intro: {
    kicker: "Privacidad",
    title:
      "Un aviso de privacidad práctico para la forma en que opera hoy Scalzo Studio.",
    intro:
      "Esta página explica qué datos personales trata Scalzo Studio a través del sitio, la base jurídica aplicable a cada actividad y los derechos que tienes conforme al RGPD y a la normativa española de protección de datos.",
    lastUpdated: "24 de marzo de 2026",
    note: "Alcance actual: solicitudes de contacto, autenticación de administradoras, tratamiento operativo esencial y analítica de PostHog activada solo con consentimiento. Las divulgaciones condicionales están claramente marcadas y no se consideran activas salvo que la función correspondiente esté habilitada.",
    summary: [
      {
        label: "Responsable",
        value: legalControllerDetails.name,
        detail: `${legalControllerDetails.address} — NIF ${legalControllerDetails.taxId}`,
      },
      {
        label: "Contacto de privacidad",
        value: legalControllerDetails.email,
        detail:
          "Usa esta dirección para solicitudes de acceso, rectificación, supresión, oposición o cuestiones relativas al consentimiento. Intentamos responder en el plazo de un mes natural.",
      },
      {
        label: "Analítica",
        value: "Con consentimiento previo",
        detail:
          "La analítica de PostHog está disponible, pero solo captura datos después de que aceptes explícitamente desde el banner de cookies. Puedes retirar el consentimiento en cualquier momento desde la página de Cookies.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "scope",
      title: "Qué cubre este aviso",
      paragraphs: [
        "Este aviso se prepara de conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD). Ambos marcos se aplican a los datos personales tratados en relación con este sitio web.",
        "Este aviso se aplica a los datos personales tratados a través del sitio web de Scalzo Studio, en especial solicitudes de presupuesto, autenticación administrativa y gestión de sesión, analítica activada con consentimiento y el seguimiento operativo relacionado.",
        `Está redactado para reflejar la implementación actual y también servicios cercanos claramente etiquetados que podrían activarse más adelante, como comprobaciones anti-spam con hCaptcha${bookingEnabled ? ", junto con el flujo activo de reservas de Cal.com." : ", o un futuro proveedor de reservas."}`,
      ],
      note: "Si se añade un nuevo proveedor o una nueva finalidad, este aviso debe actualizarse antes de que la funcionalidad se lance en producción.",
    },
    {
      id: "transfers",
      title: "Transferencias internacionales",
      paragraphs: [
        "Algunos proveedores utilizados para alojamiento, autenticación, analítica, reservas o seguridad tratan datos fuera de España o del Espacio Económico Europeo.",
        "Cuando esto ocurre, Scalzo Studio se apoya en las garantías de transferencia del RGPD del proveedor, como las Cláusulas Contractuales Tipo (SCC) u otros mecanismos jurídicos equivalentes, y mantiene en esta página una lista de encargados alineada con la pila real. Puedes solicitar detalles de las garantías concretas contactando con la responsable del tratamiento.",
      ],
    },
    {
      id: "automated-decisions",
      title: "Decisiones automatizadas",
      paragraphs: [
        "Scalzo Studio no realiza decisiones automatizadas ni perfiles que produzcan efectos jurídicos o efectos significativamente similares sobre las personas. Ningún dato personal recogido a través de este sitio se utiliza para decisiones individuales automatizadas en el sentido del artículo 22 del RGPD.",
      ],
    },
    {
      id: "rights",
      title: "Tus derechos de protección de datos",
      paragraphs: [
        "Conforme al RGPD y a la LOPDGDD tienes los siguientes derechos respecto a los datos personales tratados por Scalzo Studio. Para ejercer cualquiera de ellos, contacta con la responsable en la dirección de correo indicada arriba.",
        "Responderemos a todas las solicitudes válidas en el plazo de un mes natural desde su recepción. En casos complejos o de gran volumen, este plazo podrá ampliarse dos meses adicionales; si eso aplica, se te informará dentro del primer mes.",
        "Si el tratamiento se basa en el consentimiento, puedes retirarlo en cualquier momento. La retirada no afecta a la licitud del tratamiento realizado antes de dicha retirada.",
      ],
      items: [
        "Solicitar una copia de los datos personales que conservamos sobre ti (derecho de acceso).",
        "Pedir que se corrijan datos inexactos o incompletos (derecho de rectificación).",
        "Pedir que los datos se supriman cuando no exista una razón válida para conservarlos (derecho de supresión).",
        "Oponerte al tratamiento basado en interés legítimo cuando tus derechos prevalezcan sobre dicho interés (derecho de oposición).",
        "Solicitar la limitación del tratamiento en determinadas circunstancias (derecho de limitación).",
        "Recibir tus datos en un formato portable cuando sea aplicable (derecho a la portabilidad).",
        "Retirar en cualquier momento el consentimiento para analítica desde la página de Cookies. La retirada tiene efecto inmediato.",
        "No ser objeto de decisiones basadas únicamente en tratamientos automatizados con efectos jurídicos o significativamente similares. Scalzo Studio no realiza este tipo de tratamiento.",
      ],
    },
    {
      id: "complaints",
      title: "Preguntas y reclamaciones",
      paragraphs: [
        `Las solicitudes sobre privacidad pueden enviarse a ${legalControllerDetails.email}. Intentamos responder en el plazo de un mes natural.`,
        "Si consideras que tus datos se han tratado de forma ilícita, tienes derecho a presentar una reclamación ante la autoridad de control competente. En España, esta autoridad es la Agencia Española de Protección de Datos (AEPD). Este derecho existe sin perjuicio de cualquier otra vía administrativa o judicial.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  activities: [
    {
      title: "Solicitudes de contacto y presupuesto",
      status: "Live",
      lawfulBasis:
        "Aplicación de medidas precontractuales a petición tuya (artículo 6.1.b RGPD) e interés legítimo en gestionar consultas comerciales entrantes (artículo 6.1.f RGPD).",
      purpose:
        "Revisar el alcance, valorar el encaje, responder a tu solicitud y preparar un seguimiento, un presupuesto o una llamada.",
      dataCategories: [
        "Nombre, correo electrónico, empresa, web o perfil y ubicación",
        "Intereses de servicio, tipo de proyecto, objetivo principal, banda de presupuesto y banda de plazo",
        "Contenido del mensaje y cualquier contexto de negocio incluido en el brief",
        "Ruta de página, referencia y parámetros UTM capturados con el envío",
      ],
      recipients: ["Supabase"],
      retention:
        "Normalmente hasta 12 meses después del último contacto sustancial, salvo que se requiera más tiempo para completar el trabajo solicitado, mantener registros de negocio o formular o defender reclamaciones legales.",
      note: undefined,
    },
    {
      title: "Autenticación administrativa y seguridad de sesión",
      status: "Live",
      lawfulBasis:
        "Interés legítimo en proteger el sitio y administrar rutas internas restringidas (artículo 6.1.f RGPD).",
      purpose:
        "Autenticar a las administradoras aprobadas, mantener su sesión y proteger contenido y flujos reservados al área admin.",
      dataCategories: [
        "Dirección de correo de la administradora e identificadores de autenticación",
        "Cookies de sesión y seguridad necesarias para la autenticación con Supabase",
        "Metadatos técnicos básicos asociados al inicio de sesión y la gestión de sesión",
      ],
      recipients: ["Supabase"],
      retention:
        "La conservación sigue el ciclo de vida de la autenticación y la sesión correspondientes, además de cualquier registro de acceso razonablemente necesario para seguridad y resolución de incidencias.",
      note: undefined,
    },
    {
      title: "Prevención de spam y abuso",
      status: "Conditional",
      lawfulBasis:
        "Interés legítimo en proteger el sitio y los formularios frente a spam, abuso y uso automatizado indebido (artículo 6.1.f RGPD).",
      purpose:
        "Evaluar actividad sospechosa y bloquear envíos abusivos si se habilita hCaptcha o un servicio anti-spam similar.",
      dataCategories: [
        "Dirección IP y señales del navegador o dispositivo",
        "Datos de reto, riesgo o interacción generados durante las comprobaciones antiabuso",
      ],
      recipients: ["hCaptcha o proveedor anti-spam equivalente"],
      retention:
        "Depende del proveedor. La conservación sigue la configuración activa y las condiciones documentadas del proveedor cuando esté habilitado.",
      note: "No se considera activo salvo que el formulario de producción esté usando ese servicio anti-spam.",
    },
    {
      title: "Analítica del sitio web",
      status: "Live",
      lawfulBasis:
        "Consentimiento (artículo 6.1.a RGPD). La analítica de PostHog solo se activa después de que aceptes explícitamente desde el banner de cookies.",
      purpose:
        "Comprender el uso del sitio, la navegación entre páginas y el comportamiento de conversión para mejorar la experiencia. PostHog se inicializa por defecto en modo opt-out y solo empieza a capturar datos tras tu consentimiento explícito.",
      dataCategories: [
        "Vistas de página, eventos de navegación y datos de interacción",
        "Tipo de dispositivo, navegador y sistema operativo",
        "Ubicación geográfica aproximada derivada de la dirección IP",
        "Identificadores de sesión y propiedades de evento anonimizadas ligadas a la actividad del sitio",
      ],
      recipients: ["PostHog"],
      retention:
        "Los identificadores de sesión de PostHog se almacenan hasta un año. Puedes eliminarlos en cualquier momento borrando el almacenamiento del navegador o retirando el consentimiento desde la página de Cookies.",
      note: "Puedes retirar el consentimiento analítico en cualquier momento desde la página de Cookies. La retirada tiene efecto inmediato y no se capturarán más datos.",
    },
    {
      title: "Suscripción al newsletter",
      status: "Live",
      lawfulBasis: "Consentimiento (artículo 6.1.a RGPD).",
      purpose:
        "Enviar actualizaciones editoriales o del estudio a las personas que se suscriben activamente y confirman su dirección de correo mediante un flujo de doble opt-in.",
      dataCategories: [
        "Dirección de correo electrónico",
        "Ubicación del formulario y ruta de página",
        "Metadatos del token de confirmación, fechas de confirmación y estado de suscripción",
      ],
      recipients: ["Supabase", "Resend"],
      retention:
        "Hasta que te des de baja, solicites la supresión o el canal de newsletter deje de existir.",
      note: "Las solicitudes de alta se almacenan en Supabase como pendientes hasta que se usa el enlace de confirmación. Resend solo se actualiza después de que la confirmación se complete correctamente.",
    },
    {
      title: "Solicitudes de reserva",
      status: bookingEnabled ? "Live" : "Conditional",
      lawfulBasis:
        "Medidas precontractuales adoptadas a petición tuya (artículo 6.1.b RGPD) cuando eliges organizar una discovery call.",
      purpose: bookingEnabled
        ? "Programar, confirmar y preparar una discovery call a través del flujo de reserva embebido de Cal.com."
        : "Programar, confirmar y preparar una discovery call si se habilita más adelante un proveedor de reservas.",
      dataCategories: [
        "Nombre, correo electrónico, preferencias horarias y cualquier nota que facilites durante la reserva",
      ],
      recipients: [bookingEnabled ? "Cal.com" : "Futuro proveedor de reservas"],
      retention: bookingEnabled
        ? "Depende del ciclo de vida del registro de reserva en Cal.com y de cualquier relación posterior generada por la solicitud."
        : "Depende del proveedor elegido y de la relación de seguimiento creada por la solicitud de reserva.",
      note: bookingEnabled
        ? "El sitio utiliza un calendario embebido de Cal.com en la página de contacto y solo registra en Supabase metadatos limitados de primera parte sobre la finalización de la reserva."
        : "La página de contacto actual utiliza una alternativa por email y todavía no depende de un proveedor de reservas embebido.",
    },
  ] as const satisfies readonly PrivacyProcessingActivity[],
  processors: [
    {
      name: "Supabase",
      status: "Live",
      role: "Encargado de alojamiento, base de datos y autenticación",
      detail:
        "Se utiliza para almacenar registros de leads, altas al newsletter y dar soporte a sesiones autenticadas del área admin. Los datos se tratan bajo un acuerdo de encargo de tratamiento.",
      note: undefined,
    },
    {
      name: "PostHog",
      status: "Live",
      role: "Encargado de analítica",
      detail:
        "Se utiliza para analítica del sitio activada con consentimiento. PostHog se configura para iniciar en modo opt-out y solo se activa después de que aceptes explícitamente desde el banner de cookies.",
      note: undefined,
    },
    {
      name: "hCaptcha",
      status: "Conditional",
      role: "Encargado de seguridad y anti-spam",
      detail:
        "Puede utilizarse para proteger formularios frente a abuso si las comprobaciones anti-spam se habilitan en producción.",
      note: undefined,
    },
    {
      name: bookingEnabled ? "Cal.com" : "Proveedor de reservas",
      status: bookingEnabled ? "Live" : "Conditional",
      role: "Encargado de programación",
      detail: bookingEnabled
        ? "Se utiliza para alojar el programador embebido de discovery calls y las confirmaciones relacionadas."
        : "Más adelante podría añadirse una herramienta de reservas para discovery calls. El proveedor todavía no está cerrado.",
      note: undefined,
    },
    {
      name: "Resend",
      status: "Live",
      role: "Encargado de entrega de correo",
      detail:
        "Se utiliza para enviar emails de confirmación del newsletter y entregar el contenido confirmado a suscriptoras y suscriptores.",
      note: undefined,
    },
  ] as const satisfies readonly LegalProcessorDisclosure[],
} as const;

const cookiesPageContentEs = {
  intro: {
    kicker: "Cookies",
    title: "Aviso de cookies alineado con el RGPD y la LSSI-CE española.",
    intro:
      "Esta página explica qué cookies y tecnologías de almacenamiento similares están activas en este sitio, la base jurídica aplicable a cada una y cómo gestionar tus preferencias.",
    lastUpdated: "24 de marzo de 2026",
    note: "Las cookies esenciales están siempre activas. Las cookies analíticas requieren tu consentimiento explícito y solo se activan después de que aceptes desde el banner. Puedes cambiar tu preferencia en cualquier momento.",
    summary: [
      {
        label: "Estado actual",
        value: "Esenciales + analítica con consentimiento",
        detail:
          "Solo las cookies estrictamente necesarias para seguridad y autenticación están activas por defecto. La analítica de PostHog es opcional y requiere consentimiento explícito.",
      },
      {
        label: "Centro de preferencias",
        value: "Banner de cookies",
        detail:
          "Un banner de consentimiento en la primera visita te permite aceptar o rechazar la analítica de PostHog. Puedes cambiar tu preferencia en cualquier momento borrando el almacenamiento del navegador o contactando con nosotras.",
      },
      {
        label: "Base jurídica",
        value: "Consentimiento (analítica) / Interés legítimo (esenciales)",
        detail:
          "Las cookies no esenciales requieren consentimiento informado previo conforme al artículo 6.1.a del RGPD y a la LSSI-CE. Las cookies esenciales se apoyan en el interés legítimo de seguridad y funcionalidad solicitada.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "about-cookies",
      title: "Qué hacen las cookies y los almacenamientos similares",
      paragraphs: [
        "Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo. Las tecnologías similares incluyen local storage, session storage y tokens de autenticación utilizados por servicios embebidos.",
        "Algunas de estas tecnologías son estrictamente necesarias para que el sitio funcione de forma segura. Otras, como los identificadores analíticos, son opcionales y, según la normativa española y europea, requieren tu consentimiento previo y explícito antes de activarse.",
        "Bajo la Ley de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE, que aplica la Directiva europea de privacidad electrónica), los sitios web deben obtener consentimiento informado previo antes de instalar cookies no esenciales. El banner de consentimiento de este sitio cumple esa obligación.",
      ],
    },
    {
      id: "preferences",
      title: "Tus preferencias de cookies",
      paragraphs: [
        "Cuando visitas este sitio por primera vez, un banner de consentimiento te ofrece una elección clara sobre las cookies analíticas antes de que empiece cualquier seguimiento no esencial. Puedes aceptar o rechazar con un solo clic.",
        "La analítica de PostHog es el único almacenamiento no esencial utilizado actualmente. Se inicializa por defecto en modo opt-out y solo se activa después de tu consentimiento explícito. Retirar el consentimiento tiene efecto inmediato: no se enviarán más datos analíticos.",
        `Para cambiar tu preferencia en cualquier momento, borra el almacenamiento de tu navegador para este sitio o escríbenos a ${legalControllerDetails.email}.`,
      ],
    },
    {
      id: "manage",
      title: "Gestionar cookies en tu navegador",
      paragraphs: [
        "La mayoría de los navegadores permiten revisar, bloquear o eliminar cookies desde sus ajustes de privacidad o seguridad. Consulta las páginas de ayuda de tu navegador para ver las instrucciones.",
        "Bloquear cookies esenciales puede afectar a los flujos de inicio de sesión del área admin u otras funciones solicitadas que dependen de una sesión segura. Bloquear cookies analíticas no afecta a la experiencia principal del sitio.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  categories: [
    {
      title: "Cookies estrictamente necesarias",
      status: "Active",
      purpose:
        "Mantener la seguridad del sitio, conservar las sesiones solicitadas y dar soporte al comportamiento principal de autenticación.",
      legalBasis:
        "Interés legítimo en la seguridad del sitio y en la prestación del servicio solicitado (exención del artículo 22.2 LSSI-CE para cookies técnicamente necesarias). No se requiere consentimiento para esta categoría.",
      examples: [
        "Cookies de autenticación y sesión de Supabase para acceso admin",
        "Tokens de sesión o seguridad necesarios para proteger rutas restringidas",
      ],
      note: "Estas cookies están exentas de consentimiento según la LSSI-CE porque son estrictamente necesarias para que el sitio funcione tal como se solicita.",
    },
    {
      title: "Cookies analíticas",
      status: "Active",
      purpose:
        "Medir visitas, patrones de navegación y eventos de conversión usando PostHog para mejorar la experiencia del sitio.",
      legalBasis:
        "Consentimiento (artículo 6.1.a RGPD y artículo 22.2 LSSI-CE). La analítica de PostHog solo se activa después de que aceptes explícitamente desde el banner de cookies. El identificador de sesión de PostHog se almacena hasta un año.",
      examples: [
        "Identificador de sesión de PostHog almacenado en local storage — hasta 1 año",
        "Datos de eventos de PostHog y propiedades de interacción anonimizadas",
      ],
      note: "Solo está activa cuando has aceptado las cookies analíticas desde el banner. Si rechazas o no eliges, PostHog permanece en modo opt-out y no captura ni envía datos analíticos.",
    },
    {
      title: "Cookies de seguridad y anti-spam",
      status: "Inactive until enabled",
      purpose:
        "Distinguir tráfico humano de tráfico abusivo si se habilita hCaptcha o un proveedor anti-spam similar.",
      legalBasis:
        "Interés legítimo en la seguridad del sitio (artículo 6.1.f RGPD), sujeto a revisión según el comportamiento real del proveedor cuando se habilite.",
      examples: [
        "Almacenamiento de riesgo, reto o seguridad utilizado por un proveedor anti-spam",
      ],
      note: "No se considera activa salvo que el formulario esté protegido por el proveedor en producción.",
    },
    {
      title: "Cookies de reserva y servicios embebidos",
      status: bookingEnabled ? "Active" : "Inactive until enabled",
      purpose: bookingEnabled
        ? "Dar soporte a la experiencia de reserva embebida de Cal.com utilizada para programar discovery calls."
        : "Dar soporte a una futura experiencia de reserva embebida si se añade un proveedor de agenda.",
      legalBasis: bookingEnabled
        ? "Necesarias para el flujo de reserva solicitado por la usuaria o el usuario (exención del artículo 22.2 LSSI-CE) cuando el embed de Cal.com necesita almacenamiento para funcionar."
        : "Depende de la configuración final del proveedor y de si el almacenamiento es estrictamente necesario para un flujo de reserva solicitado por la usuaria o el usuario.",
      examples: [
        bookingEnabled
          ? "Cookies o local storage creados por el scheduler embebido de Cal.com"
          : "Cookies o local storage creados por un futuro embed de reservas",
      ],
      note: bookingEnabled
        ? "Esta categoría debe tratarse como activa solo mientras el flujo de reservas embebido siga disponible en la página de contacto."
        : undefined,
    },
  ] as const satisfies readonly CookieCategoryDisclosure[],
} as const;

const legalSharedContentByLocale = {
  en: {
    lastUpdatedLabel: "Last updated",
  },
  es: {
    lastUpdatedLabel: "Última actualización",
  },
} as const;

const privacyPageLabelsByLocale = {
  en: {
    activitiesTitle: "Processing activities and lawful bases",
    activitiesIntro:
      "Each activity below is aligned to the current site behaviour or clearly marked as conditional future processing.",
    authorityBody:
      "If you believe your data protection rights have been infringed, you may lodge a complaint with the Spanish supervisory authority.",
    authorityCta: "Visit the AEPD",
    authorityLabel: "Supervisory authority",
    contactBody:
      "Email this address for privacy requests or questions about how your personal data is used.",
    contactCta: "Email privacy contact",
    contactLabel: "Contact",
    dataInvolvedLabel: "Data involved",
    lawfulBasisLabel: "Lawful basis",
    processorsIntro:
      "The list below reflects the current live stack plus clearly labelled near-term services that are not yet treated as active.",
    processorsTitle: "Processors and service providers",
    purposeLabel: "Purpose",
    recipientsLabel: "Recipients",
    retentionLabel: "Retention",
    status: {
      Conditional: "Conditional",
      Live: "Live",
    },
  },
  es: {
    activitiesTitle: "Actividades de tratamiento y bases jurídicas",
    activitiesIntro:
      "Cada actividad indicada abajo se ajusta al comportamiento actual del sitio o está claramente marcada como tratamiento futuro condicional.",
    authorityBody:
      "Si consideras que se han vulnerado tus derechos de protección de datos, puedes presentar una reclamación ante la autoridad de control española.",
    authorityCta: "Visitar la AEPD",
    authorityLabel: "Autoridad de control",
    contactBody:
      "Escribe a esta dirección para solicitudes de privacidad o preguntas sobre cómo se usan tus datos personales.",
    contactCta: "Escribir al contacto de privacidad",
    contactLabel: "Contacto",
    dataInvolvedLabel: "Datos tratados",
    lawfulBasisLabel: "Base jurídica",
    processorsIntro:
      "La lista siguiente refleja la pila activa actual más servicios cercanos claramente etiquetados que todavía no se consideran activos.",
    processorsTitle: "Encargados y proveedores de servicio",
    purposeLabel: "Finalidad",
    recipientsLabel: "Destinatarios",
    retentionLabel: "Conservación",
    status: {
      Conditional: "Condicional",
      Live: "Activo",
    },
  },
} as const;

const cookiesPageLabelsByLocale = {
  en: {
    categoriesIntro:
      "The categories below distinguish between storage that is currently expected to be active and storage that must stay off until the relevant feature and legal basis exist.",
    categoriesTitle: "Cookie categories used or reserved for future features",
    ctaPrimary: "Read the privacy notice",
    ctaSecondary: "Contact Scalzo Studio",
    examplesLabel: "Examples",
    legalBasisLabel: "Legal basis",
    purposeLabel: "Purpose",
    status: {
      Active: "Active",
      "Inactive until enabled": "Inactive until enabled",
    },
  },
  es: {
    categoriesIntro:
      "Las categorías de abajo distinguen entre el almacenamiento que hoy se espera que esté activo y el que debe permanecer inactivo hasta que exista la funcionalidad y la base jurídica correspondiente.",
    categoriesTitle:
      "Categorías de cookies usadas o reservadas para futuras funcionalidades",
    ctaPrimary: "Leer el aviso de privacidad",
    ctaSecondary: "Contactar con Scalzo Studio",
    examplesLabel: "Ejemplos",
    legalBasisLabel: "Base jurídica",
    purposeLabel: "Finalidad",
    status: {
      Active: "Activo",
      "Inactive until enabled": "Inactivo hasta activación",
    },
  },
} as const;

export function getLegalSharedContent(locale: string) {
  return legalSharedContentByLocale[locale === "es" ? "es" : "en"];
}

export function getPrivacyPageContent(locale: string) {
  return locale === "es" ? privacyPageContentEs : privacyPageContent;
}

export function getPrivacyPageLabels(locale: string) {
  return privacyPageLabelsByLocale[locale === "es" ? "es" : "en"];
}

export function getCookiesPageContent(locale: string) {
  return locale === "es" ? cookiesPageContentEs : cookiesPageContent;
}

export function getCookiesPageLabels(locale: string) {
  return cookiesPageLabelsByLocale[locale === "es" ? "es" : "en"];
}
