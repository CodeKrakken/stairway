import { redirect } from "next/navigation";

import { MaintenanceRequests } from "@/components/maintenance-requests";
import { createClient } from "@/lib/supabase/server";
import { listMaintenanceRequests } from "@/lib/maintenance-requests";
import { getAuthenticatedUser } from "@/lib/supabase/user";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select("id, name")
    .order("name");

  if (propertiesError) {
    throw propertiesError;
  }

  const requests = await listMaintenanceRequests();

  return (
    <main>
      <h1>Stairway</h1>
      <p>Signed in as {authenticatedUser.applicationUser.name}.</p>
      <LogoutButton />
      <MaintenanceRequests properties={properties ?? []} requests={requests} />
    </main>
  );
}
