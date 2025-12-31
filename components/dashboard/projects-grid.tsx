"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";
import { deleteProjectAction, duplicateProjectAction } from "@/app/dashboard/projects/actions";
import type { Project } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    startTransition(async () => {
      const result = await deleteProjectAction(id);
      if (result.success) {
        toast.success("Project deleted");
      } else {
        toast.error(result.error || "Failed to delete project");
      }
    });
  };

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const result = await duplicateProjectAction(id);
      if (result.success) {
        toast.success("Project duplicated");
      } else {
        toast.error(result.error || "Failed to duplicate project");
      }
    });
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ))}
    </div>
  );
}

export function ProjectsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
