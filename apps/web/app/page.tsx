import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/lib/supabase/user";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Stairway</h1>
      <p>Signed in as {authenticatedUser.applicationUser.name}.</p>
      <LogoutButton />
    </main>
  );
}
