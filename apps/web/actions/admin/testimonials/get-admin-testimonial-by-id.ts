"use server";

import "server-only";

import { requireCurrentAdminAccess } from "@/actions/admin/server";
import type { AdminTestimonialEditorRecord } from "@/interfaces/admin/testimonial-editor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminTestimonialById(
  id: string,
): Promise<AdminTestimonialEditorRecord | null> {
  await requireCurrentAdminAccess(`/admin/testimonials/${id}`);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "avatar_url, company, featured, id, name, published, quote, role, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    avatarUrl: data.avatar_url,
    company: data.company ?? "",
    featured: data.featured,
    id: data.id,
    name: data.name,
    published: data.published,
    quote: data.quote,
    role: data.role ?? "",
    updatedAt: data.updated_at,
  };
}
