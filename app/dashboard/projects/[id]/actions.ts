"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState, Preview } from "@/types";
import { MAX_PREVIEWS_PER_PROJECT } from "@/types";

// ============================================
// Preview Actions
// ============================================

interface SavePreviewData {
  previewId: string;
  canvasJson: object;
  thumbnailUrl?: string;
  background?: string;
}

export async function savePreviewAction(
  data: SavePreviewData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to save a preview",
      success: false,
    };
  }

  // Get the preview to find its project_id
  const { data: preview } = await supabase
    .from("previews")
    .select("project_id")
    .eq("id", data.previewId)
    .eq("user_id", user.id)
    .single();

  if (!preview) {
    return {
      error: "Preview not found",
      success: false,
    };
  }

  const { error } = await supabase
    .from("previews")
    .update({
      canvas_json: data.canvasJson,
      thumbnail_url: data.thumbnailUrl,
      background: data.background,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.previewId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${preview.project_id}`);

  return {
    success: true,
    message: "Preview saved successfully",
  };
}

interface CreatePreviewData {
  projectId: string;
  name?: string;
}

export async function createPreviewAction(
  data: CreatePreviewData
): Promise<ActionState & { data?: { preview: Preview } }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to create a preview",
      success: false,
    };
  }

  // Check if project belongs to user
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", data.projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return {
      error: "Project not found",
      success: false,
    };
  }

  // Count existing previews
  const { count } = await supabase
    .from("previews")
    .select("*", { count: "exact", head: true })
    .eq("project_id", data.projectId);

  if (count !== null && count >= MAX_PREVIEWS_PER_PROJECT) {
    return {
      error: `Maximum of ${MAX_PREVIEWS_PER_PROJECT} previews per project reached`,
      success: false,
    };
  }

  // Get next sort order
  const { data: lastPreview } = await supabase
    .from("previews")
    .select("sort_order")
    .eq("project_id", data.projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextSortOrder = (lastPreview?.sort_order ?? -1) + 1;

  // Create new preview
  const { data: newPreview, error } = await supabase
    .from("previews")
    .insert({
      project_id: data.projectId,
      user_id: user.id,
      name: data.name || `Preview ${nextSortOrder + 1}`,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(`/dashboard/projects/${data.projectId}`);

  return {
    success: true,
    message: "Preview created successfully",
    data: {
      preview: {
        id: newPreview.id,
        projectId: newPreview.project_id,
        userId: newPreview.user_id,
        name: newPreview.name,
        canvasJson: newPreview.canvas_json,
        background: newPreview.background,
        thumbnailUrl: newPreview.thumbnail_url,
        sortOrder: newPreview.sort_order,
        createdAt: newPreview.created_at,
        updatedAt: newPreview.updated_at,
      },
    },
  };
}

export async function deletePreviewAction(
  previewId: string
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to delete a preview",
      success: false,
    };
  }

  // Get the preview to find its project_id
  const { data: preview } = await supabase
    .from("previews")
    .select("project_id")
    .eq("id", previewId)
    .eq("user_id", user.id)
    .single();

  if (!preview) {
    return {
      error: "Preview not found",
      success: false,
    };
  }

  // Check if this is the last preview
  const { count } = await supabase
    .from("previews")
    .select("*", { count: "exact", head: true })
    .eq("project_id", preview.project_id);

  if (count !== null && count <= 1) {
    return {
      error: "Cannot delete the last preview",
      success: false,
    };
  }

  const { error } = await supabase
    .from("previews")
    .delete()
    .eq("id", previewId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(`/dashboard/projects/${preview.project_id}`);

  return {
    success: true,
    message: "Preview deleted successfully",
  };
}

interface ReorderPreviewsData {
  projectId: string;
  previewIds: string[]; // Array of preview IDs in new order
}

export async function reorderPreviewsAction(
  data: ReorderPreviewsData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to reorder previews",
      success: false,
    };
  }

  // Update each preview's sort_order
  const updates = data.previewIds.map((id, index) => ({
    id,
    sort_order: index,
  }));

  // Use a transaction-like approach: update all at once
  for (const update of updates) {
    const { error } = await supabase
      .from("previews")
      .update({ sort_order: update.sort_order })
      .eq("id", update.id)
      .eq("user_id", user.id);

    if (error) {
      return {
        error: error.message,
        success: false,
      };
    }
  }

  revalidatePath(`/dashboard/projects/${data.projectId}`);

  return {
    success: true,
    message: "Previews reordered successfully",
  };
}

export async function updatePreviewNameAction(
  previewId: string,
  name: string
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be logged in to update a preview",
      success: false,
    };
  }

  const { data: preview } = await supabase
    .from("previews")
    .select("project_id")
    .eq("id", previewId)
    .eq("user_id", user.id)
    .single();

  if (!preview) {
    return {
      error: "Preview not found",
      success: false,
    };
  }

  const { error } = await supabase
    .from("previews")
    .update({ name })
    .eq("id", previewId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(`/dashboard/projects/${preview.project_id}`);

  return {
    success: true,
    message: "Preview name updated",
  };
}
