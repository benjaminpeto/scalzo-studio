import { notFound } from "next/navigation";
import { connection } from "next/server";

import { deleteAdminTestimonial } from "@/actions/admin/testimonials/delete-admin-testimonial";
import { getAdminTestimonialById } from "@/actions/admin/testimonials/get-admin-testimonial-by-id";
import { updateAdminTestimonial } from "@/actions/admin/testimonials/update-admin-testimonial";
import { AdminTestimonialEditor } from "@/components/admin/testimonial-editor";

export default async function AdminTestimonialEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string }>;
}) {
  await connection();

  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const testimonial = await getAdminTestimonialById(id);

  if (!testimonial) {
    notFound();
  }

  return (
    <AdminTestimonialEditor
      action={updateAdminTestimonial}
      deleteAction={deleteAdminTestimonial}
      mode="edit"
      status={status}
      testimonial={testimonial}
    />
  );
}
