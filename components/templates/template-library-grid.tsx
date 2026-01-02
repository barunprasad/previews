"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { TemplateSetCard } from "./template-set-card";
import { TemplatePreviewModal } from "./template-preview-modal";
import { filterTemplateSets } from "@/lib/templates";
import type { AppStoreCategory, TemplateSet } from "@/types";

interface TemplateLibraryGridProps {
  selectedCategory: AppStoreCategory | "all";
}

export function TemplateLibraryGrid({ selectedCategory }: TemplateLibraryGridProps) {
  const [selectedSet, setSelectedSet] = useState<TemplateSet | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter template sets based on selected category
  const filteredSets = useMemo(() => {
    return filterTemplateSets({
      appStoreCategory: selectedCategory,
    });
  }, [selectedCategory]);

  const handleSelectSet = (set: TemplateSet) => {
    setSelectedSet(set);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Fixed Header */}
        <div className="shrink-0 border-b bg-background/95 backdrop-blur-sm px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Template Library</h1>
              <p className="text-muted-foreground">
                Choose a template set to start your project
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredSets.length} template{filteredSets.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredSets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSets.map((set) => (
                <TemplateSetCard
                  key={set.id}
                  templateSet={set}
                  onClick={() => handleSelectSet(set)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No templates found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        templateSet={selectedSet}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </>
  );
}
