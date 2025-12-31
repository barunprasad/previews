"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

interface SaveProjectData {
  projectId: string;
  canvasJson: object;
  thumbnailUrl?: string;
  imageUrls?: string[];
  background?: string;
}

export async function saveProjectAction(
  data: SaveProjectData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to save a project",
      success: false,
    };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      canvas_json: data.canvasJson,
      thumbnail_url: data.thumbnailUrl,
      image_urls: data.imageUrls,
      background: data.background,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.projectId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${data.projectId}`);

  return {
    success: true,
    message: "Project saved successfully",
  };
}
