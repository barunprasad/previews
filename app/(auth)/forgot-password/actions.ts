"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ActionState } from "@/types";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function forgotPasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
  };

  // Validate input
  const result = forgotPasswordSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    success: true,
    message: "Check your email for a password reset link",
  };
}
