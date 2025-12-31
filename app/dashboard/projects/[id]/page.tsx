import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDevicesByType, getDeviceById } from "@/lib/devices";
import { ProjectEditor } from "./editor";
import type { Project } from "@/types";

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
    imageUrls: data.image_urls,
    deviceType: data.device_type,
    background: data.background,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const devices = getDevicesByType(project.deviceType as "iphone" | "android");
  const defaultDevice = devices[0];

  return (
    <ProjectEditor
      project={project}
      devices={devices}
      defaultDevice={defaultDevice}
    />
  );
}
