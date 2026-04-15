import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminInsightMediaState } from "@/interfaces/admin/insight-editor";

import {
  createMediaErrorState,
  createMediaSuccessState,
  isFileEntry,
  normalizeStringEntry,
  readContentImageUploadFormData,
} from "./helpers";
import { uploadBlogImage } from "./storage";
import { contentImageUploadSchema } from "./schemas";

export async function uploadAdminInsightContentImage(
  _prevState: AdminInsightMediaState,
  formData: FormData,
): Promise<AdminInsightMediaState> {
  "use server";

  const rawInput = readContentImageUploadFormData(formData);
  const currentSlug = normalizeStringEntry(rawInput.currentSlug);

  await requireCurrentAdminAccess(
    currentSlug ? `/admin/insights/${currentSlug}` : "/admin/insights",
  );

  const parsedInput = contentImageUploadSchema.safeParse({
    contentImageAlt: normalizeStringEntry(rawInput.contentImageAlt),
    currentSlug,
  });

  if (!parsedInput.success) {
    return createMediaErrorState(
      "Check the image upload fields and try again.",
    );
  }

  const contentImageFile = isFileEntry(rawInput.contentImage)
    ? rawInput.contentImage
    : null;

  if (!contentImageFile) {
    return createMediaErrorState("Choose an image file before uploading.");
  }

  try {
    const uploadResult = await uploadBlogImage({
      altText: parsedInput.data.contentImageAlt.trim(),
      file: contentImageFile,
      kind: "content",
      slug: parsedInput.data.currentSlug,
    });
    const altText = parsedInput.data.contentImageAlt.trim();

    return createMediaSuccessState({
      message:
        "Image uploaded. Insert the markdown snippet into the article body.",
      snippet: `![${altText}](${uploadResult.publicUrl})`,
      uploadedUrl: uploadResult.publicUrl,
    });
  } catch (error) {
    console.error("Admin insight content image upload failed", error);

    return createMediaErrorState(
      error instanceof Error
        ? error.message
        : "The image could not be uploaded right now. Try again.",
    );
  }
}
