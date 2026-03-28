import type { SubmitNewsletterSignupState } from "@/interfaces/newsletter/form";

export const initialSubmitNewsletterSignupState: SubmitNewsletterSignupState = {
  fieldErrors: {},
  message: null,
  status: "idle",
};

export const newsletterSignupContent = {
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
    emailUnavailable:
      "Newsletter signup is temporarily unavailable. Please try again later.",
    invalid:
      "That confirmation link is not valid anymore. Submit your email again to get a fresh one.",
    pending:
      "Check your inbox and confirm your subscription to finish joining the newsletter.",
    providerError:
      "The signup could not be completed right now. Please try again in a moment.",
    expired:
      "That confirmation link has expired. Submit your email again and we will send a fresh one.",
    confirmed:
      "Your subscription is confirmed. You are on the list for future notes.",
  },
} as const;
