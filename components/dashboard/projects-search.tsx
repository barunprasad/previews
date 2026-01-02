"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectsGrid } from "./projects-grid";
import { EmptyState } from "./empty-state";
import type { Project } from "@/types";

interface ProjectsSearchProps {
  projects: Project[];
}

export function ProjectsSearch({ projects }: ProjectsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase();
    return projects.filter((project) =>
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Results count when searching */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length === 0
            ? "No projects found"
            : `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"} found`}
        </p>
      )}

      {/* Projects grid or empty state */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No projects match your search</p>
          <p className="text-sm text-muted-foreground">
            Try a different search term or{" "}
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline"
            >
              clear the search
            </button>
          </p>
        </div>
      ) : (
        <ProjectsGrid projects={filteredProjects} />
      )}
    </div>
  );
}
