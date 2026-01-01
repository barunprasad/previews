"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, Loader2, Package, Check, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  IOS_EXPORT_SIZES,
  ANDROID_EXPORT_SIZES,
  type ExportSizeConfig,
} from "@/lib/export/export-sizes";
import {
  batchExport,
  type BatchExportProgress,
  type BatchExportResult,
} from "@/lib/export/batch-export";
import type { Preview } from "@/types";

interface BatchExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  previews: Preview[];
  canvasWidth: number;
  canvasHeight: number;
  deviceType: "iphone" | "android";
}

// Special ID for canvas size export
const CANVAS_SIZE_ID = "canvas-size";

export function BatchExportDialog({
  open,
  onOpenChange,
  projectName,
  previews,
  canvasWidth,
  canvasHeight,
  deviceType,
}: BatchExportDialogProps) {
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<BatchExportProgress | null>(null);
  const [result, setResult] = useState<BatchExportResult | null>(null);
  const [showOtherSizes, setShowOtherSizes] = useState(false);

  // Canvas size option - exports at exact design size (no scaling/clipping)
  const canvasSizeOption: ExportSizeConfig = {
    id: CANVAS_SIZE_ID,
    label: "Canvas Size (Recommended)",
    width: canvasWidth,
    height: canvasHeight,
    platform: deviceType === "iphone" ? "ios" : "android",
    required: true,
    description: `${canvasWidth} × ${canvasHeight}px — Exact size, no scaling`,
  };

  // Get other sizes for the current device type
  const otherSizes = deviceType === "iphone" ? IOS_EXPORT_SIZES : ANDROID_EXPORT_SIZES;

  // Reset when dialog opens - default to canvas size only
  useEffect(() => {
    if (open) {
      setSelectedSizes(new Set([CANVAS_SIZE_ID]));
      setShowOtherSizes(false);
      setProgress(null);
      setResult(null);
    }
  }, [open]);

  const toggleSize = (sizeId: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(sizeId)) {
        next.delete(sizeId);
      } else {
        next.add(sizeId);
      }
      return next;
    });
  };

  const handleProgress = useCallback((prog: BatchExportProgress) => {
    setProgress(prog);
  }, []);

  const handleExport = async () => {
    if (selectedSizes.size === 0) return;

    setIsExporting(true);
    setProgress(null);
    setResult(null);

    // Build sizes to export
    const sizesToExport: ExportSizeConfig[] = [];

    // Add canvas size if selected
    if (selectedSizes.has(CANVAS_SIZE_ID)) {
      sizesToExport.push(canvasSizeOption);
    }

    // Add other selected sizes
    otherSizes.forEach((s) => {
      if (selectedSizes.has(s.id)) {
        sizesToExport.push(s);
      }
    });

    const exportResult = await batchExport({
      projectName,
      previews,
      sizes: sizesToExport,
      canvasWidth,
      canvasHeight,
      onProgress: handleProgress,
    });

    setResult(exportResult);
    setIsExporting(false);
  };

  const handleClose = () => {
    if (isExporting) return;
    setProgress(null);
    setResult(null);
    onOpenChange(false);
  };

  const otherSelectedCount = otherSizes.filter((s) => selectedSizes.has(s.id)).length;
  const totalFiles = previews.length * selectedSizes.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch Export
          </DialogTitle>
          <DialogDescription>
            Export all {previews.length} preview{previews.length !== 1 ? "s" : ""} as a ZIP file
          </DialogDescription>
        </DialogHeader>

        {!isExporting && !result ? (
          <div className="space-y-4">
            {/* Canvas Size - Primary Option */}
            <label
              className={cn(
                "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                "hover:bg-accent",
                selectedSizes.has(CANVAS_SIZE_ID)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <Checkbox
                checked={selectedSizes.has(CANVAS_SIZE_ID)}
                onCheckedChange={() => toggleSize(CANVAS_SIZE_ID)}
              />
              <Monitor className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Canvas Size</span>
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {canvasWidth} × {canvasHeight}px — Exact size, no scaling or clipping
                </p>
              </div>
            </label>

            {/* Other Sizes - Expandable */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOtherSizes(!showOtherSizes)}
                className="w-full justify-between"
              >
                <span>Other sizes ({otherSelectedCount} selected)</span>
                <span className="text-muted-foreground">
                  {showOtherSizes ? "Hide" : "Show"}
                </span>
              </Button>

              {showOtherSizes && (
                <div className="grid gap-2 pl-2 border-l-2 border-muted">
                  {otherSizes.map((size) => (
                    <label
                      key={size.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        "hover:bg-accent",
                        selectedSizes.has(size.id) && "border-primary bg-primary/5"
                      )}
                    >
                      <Checkbox
                        checked={selectedSizes.has(size.id)}
                        onCheckedChange={() => toggleSize(size.id)}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-sm">{size.label}</span>
                        <p className="text-xs text-muted-foreground">
                          {size.width} × {size.height}px
                        </p>
                      </div>
                    </label>
                  ))}
                  <p className="text-xs text-muted-foreground px-2">
                    Note: Other sizes may clip content if aspect ratios differ
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <span className="font-medium">{totalFiles}</span> file{totalFiles !== 1 ? "s" : ""} will be exported
            </div>
          </div>
        ) : (
          /* Progress or Result View */
          <div className="space-y-4 py-4">
            {isExporting && progress && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{progress.overallProgress}%</span>
                  </div>
                  <Progress value={progress.overallProgress} />
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Preview {progress.currentPreview} of {progress.totalPreviews}
                  </p>
                  <p>
                    Size {progress.currentSize} of {progress.totalSizes}
                  </p>
                  <p className="font-mono text-xs truncate">
                    {progress.currentFile}
                  </p>
                </div>
              </>
            )}

            {result && (
              <div
                className={cn(
                  "flex flex-col items-center justify-center py-6 space-y-3",
                  result.success ? "text-green-500" : "text-destructive"
                )}
              >
                {result.success ? (
                  <>
                    <div className="rounded-full bg-green-500/10 p-3">
                      <Check className="h-8 w-8" />
                    </div>
                    <p className="text-lg font-medium">Export Complete!</p>
                    <p className="text-sm text-muted-foreground">
                      {result.totalFiles} files exported successfully
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">Export Failed</p>
                    <p className="text-sm">{result.error}</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!isExporting && !result && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedSizes.size === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export ZIP ({totalFiles} files)
              </Button>
            </>
          )}

          {isExporting && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </Button>
          )}

          {result && (
            <Button onClick={handleClose}>
              {result.success ? "Done" : "Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
