import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDevicesByType } from "@/lib/devices";
import { ProjectEditor } from "./editor";
import type { Project, Preview } from "@/types";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description,
    canvasJson: data.canvas_json,
    thumbnailUrl: data.thumbnail_url,
    imageUrls: data.image_urls || [],
    deviceType: data.device_type,
    background: data.background,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

async function getPreviews(projectId: string, userId: string): Promise<Preview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("previews")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((preview) => ({
    id: preview.id,
    projectId: preview.project_id,
    userId: preview.user_id,
    name: preview.name,
    canvasJson: preview.canvas_json,
    background: preview.background,
    thumbnailUrl: preview.thumbnail_url,
    sortOrder: preview.sort_order,
    createdAt: preview.created_at,
    updatedAt: preview.updated_at,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const devices = getDevicesByType(project.deviceType as "iphone" | "android");
  const defaultDevice = devices[0];

  // Get previews for this project
  let previews = await getPreviews(id, project.userId);

  // If no previews exist, create a default one from legacy project data
  if (previews.length === 0) {
    const supabase = await createClient();
    const { data: newPreview } = await supabase
      .from("previews")
      .insert({
        project_id: id,
        user_id: project.userId,
        name: "Preview 1",
        canvas_json: project.canvasJson,
        background: project.background,
        thumbnail_url: project.thumbnailUrl,
        sort_order: 0,
      })
      .select()
      .single();

    if (newPreview) {
      previews = [{
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
      }];
    }
  }

  return (
    <ProjectEditor
      project={project}
      initialPreviews={previews}
      devices={devices}
      defaultDevice={defaultDevice}
    />
  );
}
