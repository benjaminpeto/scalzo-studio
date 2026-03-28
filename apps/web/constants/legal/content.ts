import type {
  CookieCategoryDisclosure,
  LegalProcessorDisclosure,
  LegalSectionContent,
  LegalSummaryItem,
  PrivacyProcessingActivity,
} from "@/interfaces/legal/content";

export const legalControllerDetails = {
  address: "Spain, 35613, Tetir, Calle Tetir 59B",
  email: "ariana@scalzostudio.com",
  name: "Ariana Carmen Scalzo Dees",
  taxId: "XX23232323",
} as const;

export const legalPolicyEffectiveDate = "March 24, 2026";

export const complaintAuthority = {
  label: "Agencia Espanola de Proteccion de Datos (AEPD)",
  url: "https://www.aepd.es/",
} as const;

export const privacyPageContent = {
  intro: {
    kicker: "Privacy",
    title:
      "A practical privacy notice for the way Scalzo Studio currently operates.",
    intro:
      "This page explains what personal data Scalzo Studio processes through the site today, what may be added later, and the GDPR rules that apply before any non-essential tracking goes live.",
    lastUpdated: legalPolicyEffectiveDate,
    note: "Current scope: contact requests, admin authentication, and essential operational processing. Conditional disclosures below are clearly marked and are not treated as live unless the relevant feature is enabled.",
    summary: [
      {
        label: "Controller",
        value: legalControllerDetails.name,
        detail: `${legalControllerDetails.address} - Tax ID ${legalControllerDetails.taxId}`,
      },
      {
        label: "Privacy contact",
        value: legalControllerDetails.email,
        detail:
          "Use this address for access, correction, deletion, objection, or consent-related requests.",
      },
      {
        label: "Launch posture",
        value: "Essential-only first",
        detail:
          "No non-essential analytics or marketing cookies should be activated before a separate consent/preferences implementation is added.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "scope",
      title: "What this notice covers",
      paragraphs: [
        "This notice applies to personal data processed through the Scalzo Studio website, especially quote requests, admin authentication and session handling, and related operational follow-up.",
        "It is written to match the current implementation plus clearly labelled near-term services that may be enabled later, such as PostHog analytics, hCaptcha anti-spam checks, a booking provider, or a newsletter backend.",
      ],
      note: "If a new processor or new purpose is added, this notice should be updated before the feature is launched in production.",
    },
    {
      id: "transfers",
      title: "International transfers",
      paragraphs: [
        "Some service providers used for hosting, authentication, analytics, scheduling, or security may process data outside Spain or the European Economic Area.",
        "When that happens, Scalzo Studio should rely on the provider's GDPR transfer safeguards, such as Standard Contractual Clauses or equivalent legal mechanisms, and keep the processor list on this page aligned with the live stack.",
      ],
    },
    {
      id: "rights",
      title: "Your GDPR rights",
      paragraphs: [
        "Depending on the context, you may ask for access to your data, correction of inaccurate data, deletion, restriction of processing, objection to processing based on legitimate interests, or data portability where applicable.",
        "If processing relies on consent in the future, you may withdraw that consent at any time. Withdrawal does not affect processing that happened before it was withdrawn.",
      ],
      items: [
        "Request a copy of the personal data held about you.",
        "Ask for inaccurate or incomplete data to be corrected.",
        "Ask for data to be deleted when there is no valid reason to keep it.",
        "Object to processing based on legitimate interests where your rights override that interest.",
        "Request restriction or portability where the GDPR gives you that right.",
      ],
    },
    {
      id: "complaints",
      title: "Questions and complaints",
      paragraphs: [
        `Privacy requests can be sent to ${legalControllerDetails.email}.`,
        "If you believe your data has been handled unlawfully, you also have the right to complain to the Spanish supervisory authority.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  activities: [
    {
      title: "Contact and quote requests",
      status: "Live",
      lawfulBasis:
        "Pre-contract steps taken at your request, plus legitimate interests in handling inbound commercial enquiries.",
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
        "Typically up to 12 months after the last substantive contact unless a longer period is required to complete the requested work, keep business records, or establish or defend legal claims.",
      note: undefined,
    },
    {
      title: "Admin authentication and session security",
      status: "Live",
      lawfulBasis:
        "Legitimate interests in securing the site and administering restricted internal routes.",
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
        "Legitimate interests in protecting the site and forms from spam, abuse, and automated misuse.",
      purpose:
        "To assess suspicious activity and block abusive form submissions if hCaptcha or a similar service is enabled later.",
      dataCategories: [
        "IP address and browser or device signals",
        "Challenge, risk, or interaction data generated during abuse checks",
      ],
      recipients: ["hCaptcha or equivalent anti-spam provider"],
      retention:
        "Provider-dependent. Retention should follow the live vendor configuration and documented provider terms when enabled.",
      note: "This is not currently treated as active unless the production form is actually using the anti-spam service.",
    },
    {
      title: "Website analytics",
      status: "Conditional",
      lawfulBasis: "Consent, if non-essential analytics are enabled later.",
      purpose:
        "To understand site usage, page performance, and conversion behavior if PostHog is added with consent controls.",
      dataCategories: [
        "Page views, navigation events, device and browser details, and event properties tied to site activity",
      ],
      recipients: ["PostHog"],
      retention:
        "Subject to the final analytics configuration and consent policy. Analytics should not go live before a separate preferences mechanism exists.",
      note: "Under the current launch posture, non-essential analytics are not treated as active.",
    },
    {
      title: "Newsletter signup",
      status: "Conditional",
      lawfulBasis:
        "Consent, once a real signup backend or provider is connected.",
      purpose:
        "To send editorial or studio updates to users who actively subscribe.",
      dataCategories: ["Email address and basic signup metadata"],
      recipients: ["Future newsletter provider"],
      retention:
        "Until you unsubscribe, request deletion, or the newsletter channel is retired.",
      note: "The current newsletter component is a frontend-only shell and does not yet submit personal data to a live provider.",
    },
    {
      title: "Booking requests",
      status: "Conditional",
      lawfulBasis:
        "Pre-contract steps taken at your request when you choose to arrange a discovery call.",
      purpose:
        "To schedule, confirm, and prepare a discovery call if a booking provider is enabled later.",
      dataCategories: [
        "Name, email address, scheduling preferences, and any notes you provide during booking",
      ],
      recipients: ["Future booking provider"],
      retention:
        "Depends on the chosen provider and the follow-up relationship created by the booking request.",
      note: "The current contact page uses an email fallback and does not yet rely on an embedded booking processor.",
    },
  ] as const satisfies readonly PrivacyProcessingActivity[],
  processors: [
    {
      name: "Supabase",
      status: "Live",
      role: "Hosting, database, and authentication processor",
      detail:
        "Used to store inbound lead records and support authenticated admin sessions.",
      note: undefined,
    },
    {
      name: "PostHog",
      status: "Conditional",
      role: "Analytics processor",
      detail:
        "Planned analytics provider if analytics are introduced with consent controls.",
      note: "Not treated as live under the current essential-only launch posture.",
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
      name: "Booking provider",
      status: "Conditional",
      role: "Scheduling processor",
      detail:
        "A booking tool may be added later for discovery calls. The provider is not yet finalised.",
      note: undefined,
    },
    {
      name: "Newsletter provider",
      status: "Conditional",
      role: "Email marketing or editorial distribution processor",
      detail:
        "Will only be added once the newsletter form is connected to a real backend or delivery platform.",
      note: undefined,
    },
  ] as const satisfies readonly LegalProcessorDisclosure[],
} as const;

export const cookiesPageContent = {
  intro: {
    kicker: "Cookies",
    title:
      "A cookie notice aligned to the current site and the intended EU launch posture.",
    intro:
      "This page explains which cookies or similar storage technologies are currently expected, which ones are not active yet, and what must happen before any non-essential tracking is enabled.",
    lastUpdated: legalPolicyEffectiveDate,
    note: "Current posture: only essential operational cookies should be considered active. Any future analytics or marketing storage requires a separate consent mechanism before production launch.",
    summary: [
      {
        label: "Current status",
        value: "Essential cookies only",
        detail:
          "The live site should rely on cookies that are necessary for security, authentication, or requested functionality.",
      },
      {
        label: "Preference centre",
        value: "Not needed yet",
        detail:
          "There is no separate cookie-preferences panel yet because non-essential cookies are not treated as active.",
      },
      {
        label: "Future constraint",
        value: "Consent required first",
        detail:
          "If PostHog or similar analytics are added later, they must stay off until a consent tool is implemented.",
      },
    ] as const satisfies readonly LegalSummaryItem[],
  },
  sections: [
    {
      id: "about-cookies",
      title: "What cookies and similar storage do",
      paragraphs: [
        "Cookies are small text files stored on your device. Similar storage technologies can also include local storage, session storage, or security tokens used by authentication and embedded services.",
        "Some of these technologies are necessary for a site to function. Others are optional and should only be activated when the legal basis and user controls are in place.",
      ],
    },
    {
      id: "preferences",
      title: "Cookie preferences",
      paragraphs: [
        "Under the current launch posture, Scalzo Studio does not treat non-essential analytics or marketing cookies as active, so there is no separate cookie-preferences centre yet.",
        "If that changes, a dedicated consent and preferences flow must be implemented before the related scripts are activated in production.",
      ],
      note: "This ticket does not add a cookie banner or consent manager. It documents the constraint so future tracking work does not go live without consent controls.",
    },
    {
      id: "manage",
      title: "Managing cookies in your browser",
      paragraphs: [
        "Most browsers let you review, block, or delete cookies in their privacy or security settings.",
        "Blocking essential cookies may affect admin login flows or other requested functionality that depends on secure session handling.",
      ],
    },
  ] as const satisfies readonly LegalSectionContent[],
  categories: [
    {
      title: "Strictly necessary cookies",
      status: "Active",
      purpose:
        "To keep the site secure, maintain requested sessions, and support core authentication behavior.",
      legalBasis:
        "Necessary for the requested service and for legitimate security-related site operation.",
      examples: [
        "Supabase authentication and session cookies for admin access",
        "Session or security tokens needed to protect restricted routes",
      ],
      note: "These are the only cookies that should be treated as active under the current launch posture.",
    },
    {
      title: "Analytics cookies",
      status: "Inactive until enabled",
      purpose:
        "To measure usage, navigation patterns, and conversion events if PostHog or a similar analytics tool is added later.",
      legalBasis: "Consent before activation.",
      examples: [
        "Future PostHog analytics cookies or local storage identifiers",
      ],
      note: "These must remain off until a separate consent and preferences implementation exists.",
    },
    {
      title: "Security and anti-spam cookies",
      status: "Inactive until enabled",
      purpose:
        "To help distinguish human traffic from abusive traffic if hCaptcha or a similar anti-spam provider is enabled later.",
      legalBasis:
        "Legitimate interests in site security, but the final setup must be reviewed against the live vendor behaviour.",
      examples: [
        "Risk, challenge, or security-related storage used by an anti-spam provider",
      ],
      note: "This category is not treated as active unless the form is actually protected by the provider in production.",
    },
    {
      title: "Booking and embedded service cookies",
      status: "Inactive until enabled",
      purpose:
        "To support a future embedded booking experience if a scheduling provider is added later.",
      legalBasis:
        "Depends on the final provider setup and whether the storage is strictly necessary for a user-requested booking flow.",
      examples: ["Cookies or local storage created by a future booking embed"],
      note: undefined,
    },
  ] as const satisfies readonly CookieCategoryDisclosure[],
} as const;
