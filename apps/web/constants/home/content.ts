import type {
  CredibilityStat,
  FeaturedProject,
  FaqItem,
  FooterLinks,
  JournalEntry,
  NavigationLink,
  PrimaryCta,
  ProcessStep,
  ServiceGroup,
  StudioProfile,
  Testimonial,
  TrustMark,
} from "@/interfaces/home/content";

export const navigationLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
] as const satisfies readonly NavigationLink[];

export const primaryCta = {
  href: "/contact",
  label: "Book a call",
} as const satisfies PrimaryCta;

export const trustMarks = [
  { name: "Picture", note: "Outdoor hospitality" },
  { name: "Vacheron", note: "Luxury-led identity" },
  { name: "Ateliers", note: "Art direction systems" },
  { name: "Elthys", note: "Editorial positioning" },
  { name: "Catalyst", note: "Launch and growth" },
  { name: "Canary", note: "Local premium brands" },
] as const satisfies readonly TrustMark[];

export const featuredProjects = [
  {
    title: "A coastal stay reframed for direct bookings",
    category: "Brand and web direction",
    description:
      "Offer hierarchy, photography rhythm, and page pacing rebuilt so the business felt premium before the booking details even appeared.",
    metric: "+31% qualified enquiries",
    image: "/placeholders/case-coastal.svg",
    accent: "Clearer trust signals across the first scroll",
  },
  {
    title: "A startup product simplified before launch",
    category: "Product design sprint",
    description:
      "Messaging, navigation, and key flows restructured around confidence instead of novelty so the MVP could present itself more decisively.",
    metric: "2-week interface reset",
    image: "/placeholders/case-product.svg",
    accent: "Sharper onboarding and calmer decision points",
  },
  {
    title: "A local brand moved from ad hoc to editorial",
    category: "Content system",
    description:
      "A reusable content kit brought consistency to campaigns, launches, and social output without flattening the brand into templates.",
    metric: "4x faster campaign production",
    image: "/placeholders/case-editorial.svg",
    accent: "A repeatable publishing rhythm for small teams",
  },
  {
    title: "A service business turned its homepage into a sales asset",
    category: "Conversion redesign",
    description:
      "Sharper page order, quieter visuals, and stronger CTA framing made the business feel more established to first-time visitors.",
    metric: "Longer time on page",
    image: "/placeholders/hero-editorial.svg",
    accent: "A calmer route from proof to contact",
  },
] as const satisfies readonly FeaturedProject[];

export const serviceGroups = [
  {
    title: "Strategic framing",
    intro:
      "We identify the message, the audience, and the right visual level before the page starts trying to sell itself.",
    items: ["Offer positioning", "Conversion hierarchy", "Brand narrative"],
  },
  {
    title: "Design systems",
    intro:
      "The interface, typography, and asset logic are built to feel deliberate across desktop, mobile, and future additions.",
    items: ["Homepage composition", "Component styling", "Responsive behavior"],
  },
  {
    title: "Digital rollout",
    intro:
      "Once the homepage direction is right, the same language can extend into launch assets, content, and other commercial pages.",
    items: ["Editorial assets", "Campaign support", "Content structures"],
  },
] as const satisfies readonly ServiceGroup[];

export const journalEntries = [
  {
    title: "Why premium service brands need proof before explanation",
    date: "March 18, 2026",
    category: "Positioning",
    excerpt:
      "The first screen should reduce doubt quickly. Case signals, tone, and hierarchy matter before a long paragraph ever gets read.",
    image: "/placeholders/hero-editorial.svg",
    slug: "why-premium-service-brands-need-proof-before-explanation",
  },
  {
    title: "How to make a small studio site feel more established",
    date: "March 09, 2026",
    category: "Design systems",
    excerpt:
      "A more mature homepage usually comes from restraint: fewer competing actions, stronger spacing, and clearer content bands.",
    image: "/placeholders/case-product.svg",
    slug: "how-to-make-a-small-studio-site-feel-more-established",
  },
  {
    title: "What founders miss when they treat content like leftovers",
    date: "February 27, 2026",
    category: "Editorial",
    excerpt:
      "Content stops feeling secondary when the visual system gives it structure. That changes how often it gets used and maintained.",
    image: "/placeholders/case-editorial.svg",
    slug: "what-founders-miss-when-they-treat-content-like-leftovers",
  },
] as const satisfies readonly JournalEntry[];

export const processSteps = [
  {
    step: "01",
    title: "Observe",
    description:
      "We read the market, the audience, and the friction points until the real problem is visible.",
  },
  {
    step: "02",
    title: "Position",
    description:
      "The message is placed where it carries the most weight and the brand has room to feel distinctive.",
  },
  {
    step: "03",
    title: "Express",
    description:
      "Words, visuals, and components are aligned so the page feels coherent, premium, and easier to trust.",
  },
  {
    step: "04",
    title: "Navigate",
    description:
      "The final system turns strategy into a usable structure that works across launch, growth, and maintenance.",
  },
] as const satisfies readonly ProcessStep[];

export const studioProfiles = [
  {
    title: "Research-first direction",
    role: "Strategy and positioning",
    image: "/placeholders/case-coastal.svg",
    description:
      "The first pass is never decoration. It starts with the message, the order of information, and the confidence the page needs to create.",
  },
  {
    title: "Strategic creative",
    role: "Design and rollout",
    image: "/placeholders/hero-editorial.svg",
    description:
      "The visual language stays simple, but the composition is intentionally shaped to make the studio feel more established and memorable.",
  },
] as const satisfies readonly StudioProfile[];

export const credibilityStats = [
  { value: "Product", label: "Clear UX and conversion thinking" },
  { value: "Brand", label: "Identity with more authority" },
  { value: "Content", label: "Editorial structure that lasts" },
] as const satisfies readonly CredibilityStat[];

export const testimonials = [
  {
    quote:
      "The homepage finally started sounding like the business we were already running behind the scenes.",
    name: "Marta R.",
    role: "Founder",
    company: "Coastal hospitality brand",
  },
  {
    quote:
      "What changed most was clarity. Prospects understood the offer faster and the team had a clearer story to support.",
    name: "Daniel V.",
    role: "Managing director",
    company: "Service-led growth studio",
  },
  {
    quote:
      "The new direction felt premium without becoming distant. It gave us a sharper first impression and a calmer sales conversation.",
    name: "Lucia P.",
    role: "Brand lead",
    company: "Launch-stage product team",
  },
] as const satisfies readonly Testimonial[];

export const faqItems = [
  {
    question: "What kind of homepage projects are the best fit?",
    answer:
      "The strongest fit is a business with a real offer and real proof, but a page that still feels too generic, too busy, or too weak in the first impression.",
  },
  {
    question: "Can this work for both local and international audiences?",
    answer:
      "Yes. The structure is designed to feel accessible for local service businesses while still reading as strategic and mature for international partners.",
  },
  {
    question: "Do you only redesign homepages?",
    answer:
      "No. The homepage is the most visible entry point, but the same visual and structural logic can extend into service pages, launch assets, and ongoing content.",
  },
  {
    question: "How do projects usually start?",
    answer:
      "With a short review of the current site, offer, and friction points. The first objective is identifying what the page needs to signal earlier and more clearly.",
  },
] as const satisfies readonly FaqItem[];

export const footerLinks = {
  primary: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/work", label: "Work" },
    { href: "/insights", label: "Insights" },
  ],
  secondary: [
    { href: "/#method", label: "Method" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/cookies", label: "Cookies" },
  ],
  social: [
    { href: "https://instagram.com", label: "Instagram" },
    { href: "https://www.linkedin.com", label: "LinkedIn" },
  ],
} as const satisfies FooterLinks;
