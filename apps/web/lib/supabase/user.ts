import type { User } from "@stairway/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

type ApplicationUserRow = {
  id: string;
  organisation_id: string;
  name: string;
  email: string;
  role: User["role"];
  created_at: string;
  updated_at: string;
};

export type AuthenticatedUser = {
  authUser: SupabaseUser;
  applicationUser: User;
  organisationId: string;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, organisation_id, name, email, role, created_at, updated_at")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const row = data as ApplicationUserRow;

  return {
    authUser,
    applicationUser: {
      id: row.id,
      organisationId: row.organisation_id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
    organisationId: row.organisation_id,
  };
}