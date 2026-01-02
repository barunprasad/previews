"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ActionState } from "@/types";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function resetPasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Validate input
  const result = resetPasswordSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  // Sign out after password reset to force re-login
  await supabase.auth.signOut();

  redirect("/login?message=Password+reset+successful.+Please+sign+in+with+your+new+password.");
}
