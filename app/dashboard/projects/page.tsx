import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectsGrid, ProjectsGridSkeleton } from "@/components/dashboard/projects-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { Project } from "@/types";

async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data.map((project) => ({
    id: project.id,
    userId: project.user_id,
    name: project.name,
    description: project.description,
    canvasJson: project.canvas_json,
    thumbnailUrl: project.thumbnail_url,
    imageUrls: project.image_urls,
    deviceType: project.device_type,
    background: project.background,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  }));
}

async function ProjectsList() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return <EmptyState />;
  }

  return <ProjectsGrid projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your app store preview projects
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
