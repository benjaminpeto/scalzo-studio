import {
  FoldOnScroll,
  HoverCard,
  StaggerGroup,
  StaggerItem,
} from "@/components/home/motion";
import { MarketingHero } from "@ui/components/marketing/hero";

export function Hero() {
  const showcase = [
    { src: "/placeholders/case-coastal.svg" },
    { src: "/placeholders/case-product.svg" },
    { src: "/placeholders/case-editorial.svg" },
    { src: "/placeholders/hero-editorial.svg" },
  ] as const;

  return (
    <MarketingHero
      kicker="Agence de branding strategy first"
      title="Open your brand wider and make the first scroll feel decisive."
      description={
        <>
          Strategy, design, and digital direction fused into a homepage that
          looks more established, reads more clearly, and moves people toward
          contact faster.
        </>
      }
      primaryAction={{
        href: "/#contact",
        label: "Parlez-nous de votre projet",
      }}
      secondaryAction={{ href: "/#projects", ariaLabel: "Scroll to projects" }}
      showcase={showcase}
      rootWrapper={FoldOnScroll}
      contentGroupWrapper={StaggerGroup}
      contentItemWrapper={StaggerItem}
      showcaseItemWrapper={StaggerItem}
      showcaseCardWrapper={HoverCard}
    />
  );
}
