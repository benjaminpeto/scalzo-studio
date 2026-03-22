import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  href?: unknown;
};

type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  fill?: boolean;
  priority?: boolean;
  src?: unknown;
};

function resolveHref(href: MockLinkProps["href"]) {
  if (typeof href === "string") {
    return href;
  }

  if (href && typeof href === "object") {
    const hrefObject = href as { pathname?: unknown };

    if (typeof hrefObject.pathname === "string") {
      return hrefObject.pathname;
    }
  }

  return "";
}

function resolveImageSrc(src: MockImageProps["src"]) {
  if (typeof src === "string") {
    return src;
  }

  if (src && typeof src === "object") {
    const srcObject = src as { src?: unknown };

    if (typeof srcObject.src === "string") {
      return srcObject.src;
    }
  }

  return "";
}

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: MockLinkProps) => (
    <a href={resolveHref(href)} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, fill, priority, src, ...props }: MockImageProps) => {
    void fill;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={resolveImageSrc(src)} {...props} />;
  },
}));
