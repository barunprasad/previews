"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import type { ActionState } from "@/types";

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate input
  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  // Get redirect URL from search params or default to dashboard
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const url = new URL(referer);
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";

  redirect(redirectTo);
}

export async function loginWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Something went wrong" };
}
