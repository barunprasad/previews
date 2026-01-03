"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project";
import type { ActionState } from "@/types";

export async function createProjectAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    deviceType: formData.get("deviceType"),
  };

  const result = createProjectSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      success: false,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to create a project",
      success: false,
    };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: result.data.name,
      description: result.data.description,
      device_type: result.data.deviceType,
    })
    .select()
    .single();

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${data.id}`);
}

export async function deleteProjectAction(projectId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to delete a project",
      success: false,
    };
  }

  // Note: We do NOT delete Cloudinary images when deleting a project.
  // Images stay in the user's media library and can be reused across projects.
  // The media_asset_usages entries will be cleaned up automatically via cascade
  // when previews are deleted (which happens when the project is deleted).

  // Delete the project (cascades to previews and media_asset_usages via DB)
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/dashboard/projects");
  return {
    success: true,
    message: "Project deleted successfully",
  };
}

export async function duplicateProjectAction(projectId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to duplicate a project",
      success: false,
    };
  }

  // Get the original project
  const { data: original, error: fetchError } = await supabase
    .from("projects")
    .select()
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !original) {
    return {
      error: "Project not found",
      success: false,
    };
  }

  // Create a copy
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: `${original.name} (Copy)`,
      description: original.description,
      device_type: original.device_type,
      canvas_json: original.canvas_json,
    })
    .select()
    .single();

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/dashboard/projects");
  return {
    success: true,
    message: "Project duplicated successfully",
    data: { id: data.id },
  };
}
