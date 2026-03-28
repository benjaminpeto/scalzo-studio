import type { ContactOption, ContactStep } from "@/interfaces/contact/content";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";

export const contactServiceOptions = [
  {
    value: "strategic-framing",
    label: "Strategic framing",
    description: "Clarify the offer, hierarchy, and commercial story.",
  },
  {
    value: "design-systems",
    label: "Design systems",
    description: "Strengthen the interface, rhythm, and responsive system.",
  },
  {
    value: "digital-rollout",
    label: "Digital rollout",
    description: "Extend the direction into launches, campaigns, and content.",
  },
  {
    value: "not-sure-yet",
    label: "Not sure yet",
    description: "Use the first call to help define the right route.",
  },
] as const satisfies readonly ContactOption[];

export const contactProjectTypeOptions = [
  { value: "homepage", label: "Homepage" },
  { value: "service-page", label: "Service page" },
  { value: "launch", label: "Launch or campaign page" },
  { value: "editorial-system", label: "Editorial or content system" },
  { value: "ongoing-support", label: "Ongoing design support" },
] as const satisfies readonly ContactOption[];

export const contactLocationOptions = [
  { value: "canary-islands", label: "Canary Islands" },
  { value: "uk-europe", label: "UK / Europe" },
  { value: "north-america", label: "North America" },
  { value: "other", label: "Other" },
] as const satisfies readonly ContactOption[];

export const contactBudgetOptions = [
  { value: "under-1000", label: "Under EUR 1,000" },
  { value: "1000-3000", label: "EUR 1,000 - 3,000" },
  { value: "3000-7500", label: "EUR 3,000 - 7,500" },
  { value: "7500-15000", label: "EUR 7,500 - 15,000" },
  { value: "15000-plus", label: "EUR 15,000+" },
  { value: "not-sure-yet", label: "Not sure yet" },
] as const satisfies readonly ContactOption[];

export const contactTimelineOptions = [
  { value: "asap", label: "ASAP (1-2 weeks)" },
  { value: "2-4-weeks", label: "2-4 weeks" },
  { value: "1-2-months", label: "1-2 months" },
  { value: "3-plus-months", label: "3+ months" },
  { value: "not-sure-yet", label: "Not sure yet" },
] as const satisfies readonly ContactOption[];

export const contactFormSteps = [
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
] as const satisfies readonly ContactStep[];

export const contactFieldStepMap = {
  budgetBand: 2,
  company: 1,
  consent: 3,
  email: 1,
  location: 1,
  message: 3,
  name: 1,
  primaryGoal: 0,
  projectType: 0,
  servicesInterest: 0,
  timelineBand: 2,
  website: 1,
} as const;

export const initialSubmitQuoteRequestState: SubmitQuoteRequestState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export const contactPageContent = {
  hero: {
    kicker: "Contact",
    title:
      "Request a quote or book a first call, depending on how defined the project already is.",
    intro:
      "Use the form when you already know the problem, scope, or timing. Use the booking option when the work is easier to shape in conversation. Both routes are designed to get to the real decision quickly.",
    signals: [
      "Short quote form, structured around four steps.",
      "Discovery-call option for faster scoping and fit checks.",
      "Best for premium service brands, launches, and page direction work.",
    ],
  },
  form: {
    kicker: "Quote request",
    title: "A structured brief that keeps the first pass focused.",
    intro:
      "The form is split into a few short steps so the essentials arrive clearly: the type of work, the business context, the budget or timing, and the actual brief.",
    responseNote:
      "Quote requests are reviewed manually. Expect a reply within two business days.",
    newsletterOptInLabel:
      "Sign me up for occasional editorial notes and studio updates by email. You can unsubscribe at any time.",
  },
  booking: {
    kicker: "Booking option",
    title: "Prefer to talk before filling a longer brief?",
    intro:
      "If the scope is still moving or the right service is not obvious yet, a short discovery call is usually the faster route.",
    embedUrl: null as string | null,
    frameTitle: "Discovery call booking",
    fallbackHref:
      "mailto:hello@scalzostudio.com?subject=Discovery%20call%20request",
    fallbackLabel: "Arrange a call by email",
    notes: [
      "Useful when the work needs scoping before it can be priced.",
      "Best for active launches, urgent homepage shifts, or unclear fit.",
      "A short call usually replaces multiple rounds of abstract briefing.",
    ],
  },
  success: {
    title: "Thanks. The request is in.",
    body: "The next step is a manual review of the scope, timing, and fit. If the project would move faster through conversation, you can also use the booking option now.",
  },
} as const;
