import { createCmsImageAsset } from "@/lib/media-assets/shared";
import type {
  InsightDetailPageData,
  InsightIndexEntry,
} from "@/interfaces/insights/content";

type FallbackInsightArticle = Omit<
  InsightDetailPageData,
  "headings" | "published"
>;

function staticImage(src: string, alt: string) {
  return createCmsImageAsset({ alt, src });
}

export const fallbackInsightArticles = [
  {
    content: `Premium service sites usually try to explain too much before they prove anything. That creates a familiar problem: the visitor is asked to process offer details before the page has created enough confidence to make those details matter.

## Proof should arrive before the long explanation

Trust is often decided in the first screen, not at the end of the copy. The first task is to show enough clarity, specificity, and taste that the rest of the page feels worth reading.

![A calmer editorial homepage direction](/placeholders/hero-editorial.svg)

If the visitor can already see what kind of business this is, who it is for, and whether it feels credible, the supporting copy starts working much harder for less effort.

## The first screen only needs to answer a few questions

Most service pages improve when the opening sequence answers these points quickly:

- What does this business actually help with?
- Why should this feel more credible than the alternatives?
- What signal makes the work feel specific instead of generic?

### Clarity is often a pacing problem

When proof is delayed, even good writing starts feeling heavier than it is. A better first screen uses hierarchy, restraint, and evidence to remove doubt earlier.

## Explanation works better once the page has earned attention

Longer copy still matters. It just performs better after the page has already made the visitor feel oriented. In practice, that means stronger proof placement, a calmer type rhythm, and fewer competing ideas in the opening sequence.`,
    date: "March 18, 2026",
    excerpt:
      "The first screen should reduce doubt quickly. Case signals, tone, and hierarchy matter before a long paragraph ever gets read.",
    contentImages: {},
    image: staticImage(
      "/placeholders/hero-editorial.svg",
      "Editorial article cover artwork",
    ),
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    slug: "why-premium-service-brands-need-proof-before-explanation",
    tags: ["Positioning", "Trust", "Homepage strategy"],
    title: "Why premium service brands need proof before explanation",
    updatedAt: null,
  },
  {
    content: `A small studio site rarely needs to look bigger. It needs to feel more deliberate. Authority usually comes from restraint, from stronger spacing, and from a page structure that knows what to emphasise first.

## Established does not mean complicated

Many studio sites lose credibility by over-explaining or over-decorating. A more mature impression often comes from fewer moves, not more.

![A sharper product-led visual system](/placeholders/case-product.svg)

The first pass is usually about reducing noise: fewer competing highlights, stronger type contrast, and clearer transitions between proof, offer, and action.

## The page has to hold a stronger point of view

When every section is weighted the same, the visitor is left doing the editorial work themselves. A stronger page makes it obvious what matters most.

### Repetition creates maturity

Spacing, corner logic, image treatment, and copy pacing need to feel like they belong to one system. That repetition is what makes a small team appear established rather than improvised.

## Better structure raises the perceived level of the work

A studio site can feel more expensive before anything in the portfolio changes. The shift usually comes from pacing, hierarchy, and a better relationship between tone and proof.`,
    date: "March 09, 2026",
    excerpt:
      "A more mature homepage usually comes from restraint: fewer competing actions, stronger spacing, and clearer content bands.",
    contentImages: {},
    image: staticImage(
      "/placeholders/case-product.svg",
      "Article artwork about product-led clarity",
    ),
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    slug: "how-to-make-a-small-studio-site-feel-more-established",
    tags: ["Design systems", "Authority", "Web design"],
    title: "How to make a small studio site feel more established",
    updatedAt: null,
  },
  {
    content: `Founders often treat content like the final layer, something to be dropped into the design once everything else is done. That usually leads to strained layouts, generic writing, and a publishing rhythm that never stabilises.

## Content needs a system, not a leftover slot

If the visual language does not help structure ideas, content becomes harder to maintain. Every new campaign, page, or launch turns into a fresh formatting problem.

![An editorial content system in use](/placeholders/case-editorial.svg)

What fixes this is not only better writing. It is a framework for how the writing, imagery, and hierarchy should land together.

## Reusable patterns remove decision fatigue

When teams know how a headline should behave, how supporting copy should sit, and what image rhythm makes sense, publishing becomes more consistent and much faster.

### The system should feel flexible, not templated

A useful content system creates continuity without flattening the brand. It gives the team enough structure to move quickly while leaving room for emphasis and variation.

## The quality of the publishing rhythm changes

Once content has a real system underneath it, it stops feeling like a burden. It becomes easier to plan, easier to review, and more likely to stay aligned with the level of the brand.`,
    date: "February 27, 2026",
    excerpt:
      "Content stops feeling secondary when the visual system gives it structure. That changes how often it gets used and maintained.",
    contentImages: {},
    image: staticImage(
      "/placeholders/case-editorial.svg",
      "Article artwork about editorial systems",
    ),
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    slug: "what-founders-miss-when-they-treat-content-like-leftovers",
    tags: ["Editorial", "Content systems", "Strategy"],
    title: "What founders miss when they treat content like leftovers",
    updatedAt: null,
  },
  {
    content: `A service page often fails by trying to sound comprehensive too early. The page starts with abstract claims, feature-like copy, and long explanations before it has created enough belief.

## The visitor needs proof before they need detail

The strongest service pages usually lead with a clear problem, a credible signal, and a more specific picture of what changes after the work is done.

![A calmer service-page composition](/placeholders/case-coastal.svg)

That sequence helps the visitor feel oriented. Without it, even accurate copy can feel too dense because it arrives before the page has earned attention.

## Too much explanation flattens the offer

When every paragraph carries the same weight, the offer loses shape. The page starts sounding broad instead of decisive.

### Better sequencing makes the CTA feel easier

The call to action works better when the visitor has already seen a believable problem, a believable method, and at least one believable signal of proof.

## Most pages improve by saying less, more clearly

The useful move is usually not adding more copy. It is reorganising the copy, sharpening the proof, and giving the service a more confident route from introduction to action.`,
    date: "February 11, 2026",
    excerpt:
      "Most service pages do not need more copy. They need a better sequence for proof, offer clarity, and the next step.",
    contentImages: {},
    image: staticImage(
      "/placeholders/case-coastal.svg",
      "Article artwork about service-page proof",
    ),
    publishedAt: null,
    seoDescription: null,
    seoTitle: null,
    slug: "when-a-service-page-says-too-much-before-it-proves-anything",
    tags: ["Service pages", "Conversion", "Messaging"],
    title: "When a service page says too much before it proves anything",
    updatedAt: null,
  },
] as const satisfies readonly FallbackInsightArticle[];

export const fallbackInsightIndexEntries: readonly InsightIndexEntry[] =
  fallbackInsightArticles.map((entry) => ({
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    seoDescription: entry.seoDescription,
    seoTitle: entry.seoTitle,
    slug: entry.slug,
    tags: entry.tags,
    title: entry.title,
  }));

export const fallbackInsightImage = staticImage(
  "/placeholders/hero-editorial.svg",
  "Generic insight placeholder artwork",
);
