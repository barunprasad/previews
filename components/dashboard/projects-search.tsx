"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, SearchX } from "lucide-react";
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
    <div className="space-y-6">
      {/* Search input - enhanced */}
      <div className="relative max-w-md group">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-xl border-2 border-transparent bg-muted/50 backdrop-blur-sm focus:border-orange-500/50 focus:bg-background transition-all duration-200"
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count when searching */}
      <AnimatePresence>
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-muted-foreground"
          >
            {filteredProjects.length === 0 ? (
              "No projects found"
            ) : (
              <>
                <span className="font-medium text-foreground">{filteredProjects.length}</span>{" "}
                project{filteredProjects.length === 1 ? "" : "s"} found
              </>
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Projects grid or empty search state */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-orange-500/10 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <p className="mt-6 text-lg font-medium">No projects match your search</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or{" "}
            <button
              onClick={() => setSearchQuery("")}
              className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
            >
              clear the search
            </button>
          </p>
        </motion.div>
      ) : (
        <ProjectsGrid projects={filteredProjects} />
      )}
    </div>
  );
}
