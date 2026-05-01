import {
  FoldOnScroll,
  HoverCard,
  StaggerGroup,
  StaggerItem,
} from "@/components/home/motion";
import { getHomePublicContent } from "@/constants/home/public-content";
import { MarketingHero } from "@ui/components/marketing/hero";

export function Hero({ locale }: { locale: string }) {
  const showcase = [
    { src: "/placeholders/case-coastal.svg" },
    { src: "/placeholders/case-product.svg" },
    { src: "/placeholders/case-editorial.svg" },
    { src: "/placeholders/hero-editorial.svg" },
  ] as const;
  const content = getHomePublicContent(locale).hero;

  return (
    <MarketingHero
      kicker={content.kicker}
      title={content.title}
      description={content.description}
      primaryAction={{
        href: "/#contact",
        label: content.primaryActionLabel,
      }}
      secondaryAction={{
        href: "/#projects",
        ariaLabel: content.secondaryActionAriaLabel,
      }}
      showcase={showcase}
      rootWrapper={FoldOnScroll}
      contentGroupWrapper={StaggerGroup}
      contentItemWrapper={StaggerItem}
      showcaseItemWrapper={StaggerItem}
      showcaseCardWrapper={HoverCard}
    />
  );
}
