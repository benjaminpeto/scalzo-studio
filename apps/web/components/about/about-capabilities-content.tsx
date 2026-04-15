import { getServicesIndexEntries } from "@/actions/services/get-services-index-entries";

import { AboutCapabilitiesGrid } from "./about-capabilities-grid";

export async function AboutCapabilitiesContent() {
  const services = await getServicesIndexEntries();

  return <AboutCapabilitiesGrid services={services} />;
}
