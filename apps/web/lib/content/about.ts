export interface AboutSignal {
  label: string;
  value: string;
}

export interface AboutPrinciple {
  eyebrow: string;
  title: string;
  body: string;
}

export const aboutPageContent = {
  hero: {
    kicker: "About Scalzo Studio",
    title:
      "A studio built to make strong businesses feel clearer, calmer, and more established from the first scroll.",
    intro:
      "Scalzo Studio works where positioning, interface design, and editorial structure meet. The goal is not to make a site busier. It is to make the right signals land earlier, with more confidence, and with less friction for the buyer.",
    supporting: [
      "The studio is based in the Canary Islands and shaped for businesses that need to speak both locally and internationally without flattening their character.",
      "Projects stay senior-led, compact, and commercially focused so the work can move quickly from diagnosis into something visible, usable, and easier to trust.",
    ],
    signals: [
      {
        label: "Base",
        value: "Canary Islands, working internationally",
      },
      {
        label: "Focus",
        value: "Product, brand, and content direction",
      },
      {
        label: "Fit",
        value: "Service brands, launches, and premium small teams",
      },
      {
        label: "Model",
        value: "Senior-led, small, and direct from start to ship",
      },
    ] satisfies readonly AboutSignal[],
  },
  story: {
    kicker: "Studio story",
    title:
      "Small enough to stay direct. Senior enough to make the right page decisions early.",
    paragraphs: [
      "Most businesses do not need more content blocks or more visual noise. They need a clearer story, a stronger hierarchy, and a page that behaves like a commercial surface instead of a placeholder.",
      "That is the space Scalzo Studio is built for. The work usually starts by reading where trust drops, where the offer blurs, and where the interface is making decisions harder than they need to be. From there, strategy and design are shaped together rather than treated like separate phases that lose momentum in handoff.",
    ],
  },
  principles: {
    kicker: "Principles",
    title:
      "What guides the work when taste, clarity, and conversion all matter.",
    items: [
      {
        eyebrow: "01",
        title: "Clarity before decoration",
        body: "Every project starts with the message, the reading order, and the proof the visitor needs first. Visual expression should strengthen that logic, not compete with it.",
      },
      {
        eyebrow: "02",
        title: "Editorial, not ornamental",
        body: "The pages are designed to feel edited. Typography, spacing, imagery, and motion are used with restraint so the brand feels more certain, not more crowded.",
      },
      {
        eyebrow: "03",
        title: "Commercial usefulness",
        body: "The outcome is not a pretty artefact in isolation. It is a page, launch, or system that makes conversations easier, trust faster, and next steps more legible.",
      },
    ] satisfies readonly AboutPrinciple[],
  },
  capabilities: {
    kicker: "Capabilities",
    title:
      "A focused service map for the moments when the current surface needs more authority.",
    intro:
      "Capabilities are structured around the main stages of commercial clarity: getting the offer sharper, giving the interface more coherence, and extending that direction into launches or ongoing content.",
  },
  workingModel: {
    kicker: "Working model",
    title: "A short route from diagnosis to launch-ready decisions.",
    intro:
      "The process stays compact on purpose. Read the friction clearly, shape the direction with intent, and land it in a surface the business can actually use.",
  },
  proof: {
    kicker: "Social proof",
    title:
      "The approach is meant to travel across sectors, team sizes, and different levels of market maturity.",
    intro:
      "Some projects need a stronger first impression. Others need better rollout discipline or a calmer sales story. The common thread is making the work easier to understand and easier to trust.",
    marksTitle:
      "A few of the sectors, clients, and contexts this direction is built to support.",
  },
  cta: {
    title:
      "Need the site to feel more established before the next conversation starts?",
    description:
      "If the studio approach feels close to the shift you need, the next move is a direct call about the current friction, the audience, and what the page should help you win next.",
    briefItems: [
      "Which page or offer currently feels less credible than the business behind it?",
      "Where is trust dropping too early in the current customer journey?",
      "What should a calmer, clearer first impression help you win next?",
    ],
  },
} as const;
