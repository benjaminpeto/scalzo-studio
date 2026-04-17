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
