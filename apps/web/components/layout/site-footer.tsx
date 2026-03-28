import Link from "next/link";

import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { footerLinks } from "@/components/home/content";

export function SiteFooter() {
  return (
    <footer className="pb-0 pt-14">
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1fr_0.7fr_0.7fr_0.9fr]">
        <div className="max-w-md">
          <p className="section-kicker">Scalzo Studio</p>
          <p className="mt-5 font-display text-[4.5rem] leading-[0.88] tracking-[-0.08em] text-foreground sm:text-[5.4rem]">
            scalzo.
          </p>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Built for businesses that need a homepage with more authority,
            clearer structure, and less noise.
          </p>
        </div>

        <div>
          <p className="section-kicker">Explore</p>
          <ul className="mt-5 space-y-3">
            {footerLinks.primary.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-kicker">Action</p>
          <ul className="mt-5 space-y-3">
            {footerLinks.secondary.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-kicker">Elsewhere</p>
          <ul className="mt-5 space-y-3">
            {footerLinks.social.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-border/70 pt-5">
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <NewsletterSignup placement="footer" />
      </div>
      <div className="mt-14 bg-[#0d0f0c] py-4">
        <div className="section-shell flex flex-col gap-3 text-xs uppercase tracking-[0.18em] text-white/52 sm:flex-row sm:items-center sm:justify-between">
          <p>Scalzo Studio</p>
          <p>Editorial product, brand, and digital direction</p>
        </div>
      </div>
    </footer>
  );
}
