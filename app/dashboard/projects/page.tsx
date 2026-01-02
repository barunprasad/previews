import { Suspense } from "react";
import Link from "next/link";
import { Plus, LayoutTemplate, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProjectsGridSkeleton } from "@/components/dashboard/projects-grid";
import { ProjectsSearch } from "@/components/dashboard/projects-search";
import type { Project, Preview } from "@/types";

async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Fetch projects with their previews
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      previews (
        id,
        name,
        thumbnail_url,
        sort_order
      )
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data.map((project) => {
    // Sort previews by sort_order
    const sortedPreviews = (project.previews || [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((p: { id: string; name: string; thumbnail_url: string | null; sort_order: number }) => ({
        id: p.id,
        thumbnailUrl: p.thumbnail_url,
        name: p.name,
        sortOrder: p.sort_order,
      }));

    return {
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
      previews: sortedPreviews,
    };
  });
}

async function ProjectsList() {
  const projects = await getProjects();
  return <ProjectsSearch projects={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Projects
            </h1>
            <Sparkles className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-muted-foreground">
            Create stunning app store screenshots for your apps
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-2 border-dashed hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300"
          >
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Blank
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
          >
            <Link href="/dashboard/templates">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              Use Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}
