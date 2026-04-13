import { ImageResponse } from "next/og";

import { siteSeo } from "./site";

export const socialImageSize = {
  height: 630,
  width: 1200,
} as const;

export const socialImageContentType = "image/png";

interface RenderBrandedSocialImageInput {
  eyebrow: string;
  summary: string;
  title: string;
}

export function renderBrandedSocialImage({
  eyebrow,
  summary,
  title,
}: RenderBrandedSocialImageInput) {
  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #f6f1e7 0%, #ebe1cf 52%, #d8c7ab 100%)",
        color: "#111411",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "56px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "18px",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(17, 20, 17, 0.18)",
            borderRadius: "999px",
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.24em",
            padding: "12px 20px",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.2em",
            opacity: 0.72,
            textTransform: "uppercase",
          }}
        >
          {siteSeo.name}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "26px",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: "-0.07em",
            lineHeight: 0.92,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: "860px",
            opacity: 0.78,
          }}
        >
          {summary}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid rgba(17, 20, 17, 0.16)",
          display: "flex",
          fontSize: 24,
          justifyContent: "space-between",
          letterSpacing: "0.12em",
          opacity: 0.76,
          paddingTop: "24px",
          textTransform: "uppercase",
          width: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          Editorial product, brand, and content design
        </div>
        <div style={{ display: "flex" }}>scalzostudio.com</div>
      </div>
    </div>,
    socialImageSize,
  );
}
