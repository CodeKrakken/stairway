"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);

    const { error: signOutError } = await createClient().auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}