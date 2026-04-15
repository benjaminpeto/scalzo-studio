import type { CmsImageAsset } from "@/interfaces/media-assets";

export interface NavigationLink {
  href: string;
  label: string;
}

export interface PrimaryCta {
  href: string;
  label: string;
}

export interface TrustMark {
  name: string;
  note: string;
}

export interface FeaturedProject {
  accent: string;
  category: string;
  description: string;
  image: CmsImageAsset;
  metric: string;
  title: string;
}

export interface ServiceGroup {
  intro: string;
  items: readonly string[];
  title: string;
}

export interface JournalEntry {
  category: string;
  date: string;
  excerpt: string;
  image: CmsImageAsset;
  slug: string;
  title: string;
}

export interface ProcessStep {
  description: string;
  step: string;
  title: string;
}

export interface StudioProfile {
  description: string;
  image: string;
  role: string;
  title: string;
}

export interface CredibilityStat {
  label: string;
  value: string;
}

export interface Testimonial {
  company: string;
  image?: CmsImageAsset;
  name: string;
  quote: string;
  role: string;
}

export interface FaqItem {
  answer: string;
  question: string;
}

export interface FooterLinks {
  legal: NavigationLink[];
  primary: NavigationLink[];
  secondary: NavigationLink[];
  social: NavigationLink[];
}
