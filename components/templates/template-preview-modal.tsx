"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createProjectFromTemplateAction } from "@/app/dashboard/templates/actions";
import type { TemplateSet, PreviewTemplate } from "@/types";

// Canvas dimensions for scaling calculations
const CANVAS_WIDTH = 440;
const CANVAS_HEIGHT = 880;

// Render a simplified preview of template content
function TemplatePreviewContent({ template }: { template: PreviewTemplate }) {
  const objects = (template.canvasJson.objects || []) as Array<{
    type: string;
    text?: string;
    fontSize?: number;
    fontWeight?: string;
    fill?: string;
    left?: number;
    top?: number;
    width?: number;
    originX?: string;
    originY?: string;
    textAlign?: string;
    angle?: number;
    charSpacing?: number;
    scaleX?: number;
    scaleY?: number;
  }>;

  // Scale factor for preview (preview width ~224px vs canvas 440px)
  const scale = 224 / CANVAS_WIDTH;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {objects.map((obj, idx) => {
        if (obj.type === "textbox" && obj.text) {
          // Calculate position
          let left = (obj.left || 0) * scale;
          const top = (obj.top || 0) * scale;
          const width = (obj.width || 200) * scale;
          const fontSize = Math.max(6, (obj.fontSize || 16) * scale * 0.9);

          // Handle originX center
          if (obj.originX === "center") {
            left = left - width / 2;
          }

          return (
            <div
              key={idx}
              className="absolute leading-tight"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                fontSize: `${fontSize}px`,
                fontWeight: obj.fontWeight || "400",
                color: obj.fill || "#ffffff",
                textAlign: (obj.textAlign as "left" | "center" | "right") || "left",
                letterSpacing: obj.charSpacing ? `${obj.charSpacing / 100}px` : undefined,
                lineHeight: 1.2,
              }}
            >
              {obj.text}
            </div>
          );
        }

        if (obj.type === "image") {
          // Calculate position for image placeholder
          let left = (obj.left || 0) * scale;
          let top = (obj.top || 0) * scale;
          const imgScale = obj.scaleX || 0.5;
          const width = 180 * imgScale * scale; // Approximate image width
          const height = 320 * imgScale * scale; // Approximate image height
          const angle = obj.angle || 0;

          // Handle originX/Y center
          if (obj.originX === "center") {
            left = left - width / 2;
          }
          if (obj.originY === "center") {
            top = top - height / 2;
          }

          return (
            <div
              key={idx}
              className="absolute flex items-center justify-center rounded-lg border border-white/20 bg-white/10"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: angle ? `rotate(${angle}deg)` : undefined,
              }}
            >
              <ImageIcon className="h-6 w-6 text-white/40" />
            </div>
          );
        }

        if (obj.type === "rect") {
          // Render rectangles (like accent lines)
          let left = (obj.left || 0) * scale;
          const top = (obj.top || 0) * scale;
          const width = ((obj as { width?: number }).width || 40) * scale;
          const height = ((obj as { height?: number }).height || 3) * scale;

          return (
            <div
              key={idx}
              className="absolute rounded-sm"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: obj.fill || "#ffffff",
              }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

interface TemplatePreviewModalProps {
  templateSet: TemplateSet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewModal({
  templateSet,
  open,
  onOpenChange,
}: TemplatePreviewModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projectName, setProjectName] = useState("");

  // Reset state when modal opens with new template
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && templateSet) {
      setProjectName("");
    }
    onOpenChange(newOpen);
  };

  const handleCreateProject = () => {
    if (!templateSet || !projectName.trim()) return;

    startTransition(async () => {
      const result = await createProjectFromTemplateAction(
        templateSet.id,
        projectName.trim(),
        "" // Theme color reserved for future use
      );

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.projectId) {
        toast.success(`Created "${projectName}" with ${templateSet.previewCount} previews`);
        onOpenChange(false);
        router.push(`/dashboard/projects/${result.projectId}`);
      }
    });
  };

  if (!templateSet) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{templateSet.name}</DialogTitle>
          <DialogDescription>
            Preview all {templateSet.previewCount} screens and customize before creating your project
          </DialogDescription>
        </DialogHeader>

        {/* Preview Carousel */}
        <ScrollArea className="flex-1">
          <div className="flex gap-4 pb-4 px-1">
            {templateSet.templates.map((template, idx) => (
              <div key={template.id} className="shrink-0 w-56 space-y-2">
                <div
                  className="aspect-[9/16] overflow-hidden rounded-xl border-2 shadow-lg transition-shadow hover:shadow-xl"
                  style={{
                    background: template.background,
                  }}
                >
                  <TemplatePreviewContent template={template} />
                </div>
                <p className="text-center text-sm font-medium">
                  {idx + 1}. {template.name}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Project Name */}
        <div className="space-y-2 border-t pt-4">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="My Awesome App"
            autoFocus
          />
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={!projectName.trim() || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              `Create Project (${templateSet.previewCount} screens)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
