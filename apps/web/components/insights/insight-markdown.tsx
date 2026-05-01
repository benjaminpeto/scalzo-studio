import ReactMarkdown from "react-markdown";

import type { CmsImageAsset } from "@/interfaces/media-assets";
import { createInsightMarkdownComponents } from "./create-insight-markdown-components";

export function InsightMarkdown({
  content,
  imageAssets = {},
}: {
  content: string;
  imageAssets?: Record<string, CmsImageAsset>;
}) {
  return (
    <ReactMarkdown
      skipHtml
      components={createInsightMarkdownComponents(imageAssets)}
    >
      {content}
    </ReactMarkdown>
  );
}
