"use client";

import { Upload, ImagePlus, Eraser, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { BackgroundRemovalProgress } from "@/lib/image-processing/background-removal";

interface ScreenshotSectionProps {
  onUpload: () => void;
  hasSelectedImage?: boolean;
  onRemoveBackground?: () => void;
  isRemovingBackground?: boolean;
  backgroundRemovalProgress?: BackgroundRemovalProgress | null;
}

export function ScreenshotSection({
  onUpload,
  hasSelectedImage,
  onRemoveBackground,
  isRemovingBackground,
  backgroundRemovalProgress,
}: ScreenshotSectionProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onUpload} className="w-full" variant="outline">
        <ImagePlus className="mr-2 h-4 w-4" />
        Upload Screenshot
      </Button>

      {/* Background Removal */}
      {hasSelectedImage && onRemoveBackground && (
        <div className="space-y-2">
          <Button
            onClick={onRemoveBackground}
            className="w-full"
            variant="secondary"
            disabled={isRemovingBackground}
          >
            {isRemovingBackground ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Background...
              </>
            ) : (
              <>
                <Eraser className="mr-2 h-4 w-4" />
                Remove Background
              </>
            )}
          </Button>

          {isRemovingBackground && backgroundRemovalProgress && (
            <div className="space-y-1">
              <Progress value={backgroundRemovalProgress.progress} />
              <p className="text-xs text-muted-foreground text-center">
                {backgroundRemovalProgress.message}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-dashed p-4 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Drag & drop</p>
            <p className="text-xs">or click the button above</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Supports PNG, JPG, and WebP images. Drop directly onto the canvas for
        quick upload.
      </p>
    </div>
  );
}
