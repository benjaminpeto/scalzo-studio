import { connection } from "next/server";

import { getAdminTestimonialsListData } from "@/actions/admin/testimonials/get-admin-testimonials-list-data";
import { AdminTestimonialsList } from "@/components/admin/testimonials-list";

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    featured?: string;
    published?: string;
    q?: string;
    status?: string;
  }>;
}) {
  await connection();

  const resolvedSearchParams = (await searchParams) ?? {};
  const featuredFilter =
    typeof resolvedSearchParams.featured === "string"
      ? resolvedSearchParams.featured
      : "all";
  const publishedFilter =
    typeof resolvedSearchParams.published === "string"
      ? resolvedSearchParams.published
      : "all";
  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : undefined;
  const data = await getAdminTestimonialsListData({
    featuredFilter,
    publishedFilter,
    query,
  });

  return <AdminTestimonialsList data={data} status={status} />;
}
