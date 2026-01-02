"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { staggerContainerVariants } from "@/lib/animations/variants";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProjectAction, duplicateProjectAction } from "@/app/dashboard/projects/actions";
import type { Project } from "@/types";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;

    startTransition(async () => {
      const result = await deleteProjectAction(projectToDelete);
      if (result.success) {
        toast.success("Project deleted");
      } else {
        toast.error(result.error || "Failed to delete project");
      }
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
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

  // Get the project name for the delete dialog
  const projectToDeleteName = projectToDelete
    ? projects.find((p) => p.id === projectToDelete)?.name
    : null;

  return (
    <>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteClick}
            onDuplicate={handleDuplicate}
          />
        ))}
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              {projectToDeleteName ? `"${projectToDeleteName}"` : "this project"}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
