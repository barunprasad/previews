"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
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

  const canAddMore = previews.length < MAX_PREVIEWS_PER_PROJECT;
  const canDelete = previews.length > 1;

  return (
    <div className="flex h-24 shrink-0 items-center gap-2 overflow-x-auto border-t bg-background px-4">
      {/* Preview thumbnails */}
      {previews.map((preview, index) => {
        const isActive = preview.id === activePreviewId;
        const isHovered = hoveredId === preview.id;
        const isDeleting = deletingId === preview.id;

        return (
          <div
            key={preview.id}
            className="relative shrink-0"
            onMouseEnter={() => setHoveredId(preview.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => onPreviewSelect(preview)}
              className={cn(
                "relative h-16 w-12 overflow-hidden rounded-lg border-2 transition-all",
                isActive
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              disabled={isDeleting}
            >
              {preview.thumbnailUrl ? (
                <img
                  src={preview.thumbnailUrl}
                  alt={preview.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: preview.background || "#0a0a0a",
                  }}
                />
              )}

              {/* Preview number badge */}
              <div className="absolute bottom-0.5 left-0.5 flex h-4 w-4 items-center justify-center rounded bg-black/70 text-[10px] font-medium text-white">
                {index + 1}
              </div>

              {/* Loading overlay */}
              {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
            </button>

            {/* Delete button - show on hover if can delete */}
            {canDelete && isHovered && !isDeleting && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-transform hover:scale-110"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Preview</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{preview.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeletePreview(preview.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      })}

      {/* Add preview button */}
      {canAddMore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-12 shrink-0 border-dashed"
              onClick={handleCreatePreview}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Add preview ({previews.length}/{MAX_PREVIEWS_PER_PROJECT})
          </TooltipContent>
        </Tooltip>
      )}

      {/* Max reached indicator */}
      {!canAddMore && (
        <div className="shrink-0 px-2 text-xs text-muted-foreground">
          Max {MAX_PREVIEWS_PER_PROJECT} previews
        </div>
      )}
    </div>
  );
}
