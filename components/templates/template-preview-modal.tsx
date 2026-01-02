"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { TemplateCanvasPreview } from "./template-canvas-preview";
import { createProjectFromTemplateAction } from "@/app/dashboard/templates/actions";
import type { TemplateSet } from "@/types";

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
      <DialogContent className="!max-w-4xl !w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{templateSet.name}</DialogTitle>
          <DialogDescription>
            Preview all {templateSet.previewCount} screens and customize before creating your project
          </DialogDescription>
        </DialogHeader>

        {/* Preview Carousel - Horizontal Scroll */}
        <div className="flex-1 -mx-6 px-6 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 pb-4 min-w-max">
            {templateSet.templates.map((template, idx) => (
              <div key={template.id} className="shrink-0 space-y-2">
                <div className="border-2 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
                  <TemplateCanvasPreview template={template} width={180} />
                </div>
                <p className="text-center text-sm font-medium truncate max-w-[180px]">
                  {idx + 1}. {template.name}
                </p>
              </div>
            ))}
          </div>
        </div>

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
