"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Preview } from "@/types";
import { MAX_PREVIEWS_PER_PROJECT } from "@/types";

interface PreviewStripProps {
  projectId: string;
  previews: Preview[];
  activePreviewId: string | null;
  onPreviewSelect: (preview: Preview) => void;
  onPreviewCreated: (preview: Preview) => void;
  onPreviewDeleted: (previewId: string) => void;
}

export function PreviewStrip({
  projectId,
  previews,
  activePreviewId,
  onPreviewSelect,
  onPreviewCreated,
  onPreviewDeleted,
}: PreviewStripProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCreatePreview = async () => {
    setIsCreating(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Get next sort order
      const maxSortOrder = Math.max(...previews.map((p) => p.sortOrder), -1);
      const nextSortOrder = maxSortOrder + 1;

      const { data, error } = await supabase
        .from("previews")
        .insert({
          project_id: projectId,
          user_id: user.id,
          name: `Preview ${nextSortOrder + 1}`,
          sort_order: nextSortOrder,
        })
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      const newPreview: Preview = {
        id: data.id,
        projectId: data.project_id,
        userId: data.user_id,
        name: data.name,
        canvasJson: data.canvas_json,
        background: data.background,
        thumbnailUrl: data.thumbnail_url,
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      toast.success("Preview created");
      onPreviewCreated(newPreview);
    } catch {
      toast.error("Failed to create preview");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePreview = async (previewId: string) => {
    if (previews.length <= 1) {
      toast.error("Cannot delete the last preview");
      return;
    }

    setDeletingId(previewId);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("previews")
        .delete()
        .eq("id", previewId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Preview deleted");
      onPreviewDeleted(previewId);
    } catch {
      toast.error("Failed to delete preview");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicatePreview = async (preview: Preview) => {
    if (previews.length >= MAX_PREVIEWS_PER_PROJECT) {
      toast.error(`Maximum ${MAX_PREVIEWS_PER_PROJECT} previews allowed`);
      return;
    }

    setDuplicatingId(preview.id);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Get next sort order
      const maxSortOrder = Math.max(...previews.map((p) => p.sortOrder), -1);
      const nextSortOrder = maxSortOrder + 1;

      const { data, error } = await supabase
        .from("previews")
        .insert({
          project_id: projectId,
          user_id: user.id,
          name: `${preview.name} (Copy)`,
          sort_order: nextSortOrder,
          canvas_json: preview.canvasJson,
          background: preview.background,
        })
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        return;
      }

      const newPreview: Preview = {
        id: data.id,
        projectId: data.project_id,
        userId: data.user_id,
        name: data.name,
        canvasJson: data.canvas_json,
        background: data.background,
        thumbnailUrl: null, // Will generate on first save
        sortOrder: data.sort_order,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      toast.success("Preview duplicated");
      onPreviewCreated(newPreview);
    } catch {
      toast.error("Failed to duplicate preview");
    } finally {
      setDuplicatingId(null);
    }
  };

  const canAddMore = previews.length < MAX_PREVIEWS_PER_PROJECT;
  const canDelete = previews.length > 1;

  return (
    <div className="flex h-24 flex-1 shrink-0 items-center gap-3 overflow-x-auto px-4">
      {/* Fade edges for scroll indication */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Preview thumbnails */}
      {previews.map((preview, index) => {
        const isActive = preview.id === activePreviewId;
        const isHovered = hoveredId === preview.id;
        const isDeleting = deletingId === preview.id;
        const isDuplicating = duplicatingId === preview.id;
        const isLoading = isDeleting || isDuplicating;

        return (
          <div
            key={preview.id}
            className="relative shrink-0 group"
            onMouseEnter={() => setHoveredId(preview.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Active glow effect */}
            {isActive && (
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-50 blur-sm" />
            )}

            {/* Hover glow effect */}
            {isHovered && !isActive && (
              <div className="absolute -inset-0.5 rounded-lg bg-orange-500/20 blur-sm transition-opacity" />
            )}

            <button
              onClick={() => onPreviewSelect(preview)}
              className={cn(
                "relative h-16 w-12 overflow-hidden rounded-lg transition-all duration-200",
                isActive
                  ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/25"
                  : "ring-1 ring-border/50 hover:ring-orange-500/50 hover:shadow-md",
                "bg-neutral-900"
              )}
              disabled={isLoading}
            >
              {preview.thumbnailUrl ? (
                <img
                  src={preview.thumbnailUrl}
                  alt={preview.name}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-200",
                    isHovered && "scale-105"
                  )}
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: preview.background || "#0a0a0a",
                  }}
                />
              )}

              {/* Preview number badge - enhanced */}
              <div className={cn(
                "absolute bottom-0.5 left-0.5 flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-semibold transition-colors",
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-black/60 text-white/80 backdrop-blur-sm"
              )}>
                {index + 1}
              </div>

              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                </div>
              )}
            </button>

            {/* Action buttons - show on hover with enhanced styling */}
            {isHovered && !isLoading && (
              <>
                {/* Duplicate button */}
                {canAddMore && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-110 hover:shadow-orange-500/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicatePreview(preview);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Duplicate</TooltipContent>
                  </Tooltip>
                )}

                {/* Delete button */}
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all hover:scale-110 hover:bg-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-0 bg-card/95 backdrop-blur-xl shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Preview</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{preview.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePreview(preview.id)}
                          className="rounded-xl bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Add preview button - enhanced */}
      {canAddMore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-16 w-12 shrink-0 rounded-lg border-2 border-dashed transition-all duration-200",
                "border-muted-foreground/30 hover:border-orange-500/50 hover:bg-orange-500/5",
                "group/add"
              )}
              onClick={handleCreatePreview}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground group-hover/add:text-orange-500 transition-colors" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Add preview ({previews.length}/{MAX_PREVIEWS_PER_PROJECT})
          </TooltipContent>
        </Tooltip>
      )}

      {/* Max reached indicator - enhanced */}
      {!canAddMore && (
        <div className="shrink-0 px-3 py-1.5 text-xs text-muted-foreground rounded-full bg-muted/50">
          Max {MAX_PREVIEWS_PER_PROJECT} previews
        </div>
      )}
    </div>
  );
}
