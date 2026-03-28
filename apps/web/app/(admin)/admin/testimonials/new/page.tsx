import { connection } from "next/server";

import { createAdminTestimonial } from "@/actions/admin/testimonials/create-admin-testimonial";
import { AdminTestimonialEditor } from "@/components/admin/testimonial-editor";

export default async function AdminTestimonialNewPage() {
  await connection();

  return (
    <AdminTestimonialEditor
      action={createAdminTestimonial}
      deleteAction={null}
      mode="create"
    />
  );
}
