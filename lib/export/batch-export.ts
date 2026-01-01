import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Canvas as FabricCanvas, Gradient } from "fabric";
import type { ExportSizeConfig } from "./export-sizes";
import type { Preview } from "@/types";

export interface BatchExportOptions {
  projectName: string;
  previews: Preview[];
  sizes: ExportSizeConfig[];
  canvasWidth: number;
  canvasHeight: number;
  onProgress?: (progress: BatchExportProgress) => void;
}

export interface BatchExportProgress {
  currentPreview: number;
  totalPreviews: number;
  currentSize: number;
  totalSizes: number;
  currentFile: string;
  overallProgress: number; // 0-100
}

export interface BatchExportResult {
  success: boolean;
  totalFiles: number;
  error?: string;
}

// Parse CSS gradient string to Fabric.js Gradient
function parseFabricGradient(gradientStr: string, width: number, height: number) {
  // Parse "linear-gradient(135deg, #color1 0%, #color2 50%, #color3 100%)"
  const match = gradientStr.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
  if (!match) return null;

  const angle = parseInt(match[1]);
  const colorStops = match[2].split(/,\s*(?=#)/).map((stop) => {
    const parts = stop.trim().split(/\s+/);
    const color = parts[0];
    const offset = parseInt(parts[1]) / 100;
    return { offset, color };
  });

  // Convert CSS angle to Fabric.js gradient coordinates
  let x1 = 0, y1 = 0, x2 = width, y2 = height;

  if (angle === 90) {
    x1 = 0; y1 = height / 2;
    x2 = width; y2 = height / 2;
  } else if (angle === 180) {
    x1 = width / 2; y1 = 0;
    x2 = width / 2; y2 = height;
  } else if (angle === 0 || angle === 360) {
    x1 = width / 2; y1 = height;
    x2 = width / 2; y2 = 0;
  }
  // Default (135deg): top-left to bottom-right

  return new Gradient({
    type: "linear",
    coords: { x1, y1, x2, y2 },
    colorStops,
  });
}

// Apply background to a Fabric canvas (handles both solid colors and gradients)
function applyBackgroundToCanvas(canvas: FabricCanvas, background: string | null | undefined): void {
  const bg = background || "#0a0a0a";
  const isGradient = bg.startsWith("linear-gradient");

  if (isGradient) {
    const gradient = parseFabricGradient(bg, canvas.width!, canvas.height!);
    if (gradient) {
      const canvasGradient = gradient.toLive(canvas.getContext());
      canvas.backgroundColor = canvasGradient as unknown as string;
    } else {
      canvas.backgroundColor = "#0a0a0a";
    }
  } else {
    canvas.backgroundColor = bg;
  }
}

// Export a preview at a specific size by creating a scaled Fabric canvas
// This renders text and shapes natively at target resolution for best quality
async function exportPreviewAtSize(
  preview: Preview,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Use uniform scale to maintain aspect ratio (no stretching)
      // Use "cover" behavior - scale to fill, center content
      const scaleX = targetWidth / sourceWidth;
      const scaleY = targetHeight / sourceHeight;
      const uniformScale = Math.max(scaleX, scaleY); // Cover - fills the target

      // Calculate offset to center the content
      const scaledWidth = sourceWidth * uniformScale;
      const scaledHeight = sourceHeight * uniformScale;
      const offsetX = (targetWidth - scaledWidth) / 2;
      const offsetY = (targetHeight - scaledHeight) / 2;

      // Create a new canvas at the target size
      const canvasEl = document.createElement("canvas");
      canvasEl.width = targetWidth;
      canvasEl.height = targetHeight;

      const exportCanvas = new FabricCanvas(canvasEl, {
        width: targetWidth,
        height: targetHeight,
        backgroundColor: "#0a0a0a",
      });

      // Apply background at target size
      applyBackgroundToCanvas(exportCanvas, preview.background);

      // Load canvas JSON if available
      if (preview.canvasJson && Object.keys(preview.canvasJson).length > 0) {
        await exportCanvas.loadFromJSON(preview.canvasJson);

        // Re-apply background after loading JSON
        applyBackgroundToCanvas(exportCanvas, preview.background);

        // Scale all objects with uniform scale (no distortion) and center
        const objects = exportCanvas.getObjects();
        objects.forEach((obj) => {
          obj.set({
            left: (obj.left || 0) * uniformScale + offsetX,
            top: (obj.top || 0) * uniformScale + offsetY,
            scaleX: (obj.scaleX || 1) * uniformScale,
            scaleY: (obj.scaleY || 1) * uniformScale,
          });
          obj.setCoords();
        });
      }

      // Wait for images to load
      const objects = exportCanvas.getObjects();
      const hasImages = objects.some((obj) => obj.type === "image" || obj.type === "group");

      if (hasImages) {
        await new Promise((res) => setTimeout(res, 500));
      }

      exportCanvas.renderAll();

      // Export at native resolution (no scaling needed - already at target size)
      const dataUrl = exportCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      });

      exportCanvas.dispose();

      // Convert dataURL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}

// Sanitize filename
function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
}

// Main batch export function
export async function batchExport(
  options: BatchExportOptions
): Promise<BatchExportResult> {
  const { projectName, previews, sizes, canvasWidth, canvasHeight, onProgress } =
    options;

  const zip = new JSZip();
  const totalOperations = previews.length * sizes.length;
  let completedOperations = 0;
  let totalFiles = 0;

  try {
    // Group sizes by platform
    const iosSizes = sizes.filter((s) => s.platform === "ios");
    const androidSizes = sizes.filter((s) => s.platform === "android");

    // Create folders
    const iosFolder = iosSizes.length > 0 ? zip.folder("ios") : null;
    const androidFolder = androidSizes.length > 0 ? zip.folder("android") : null;

    // Process each preview
    for (let previewIndex = 0; previewIndex < previews.length; previewIndex++) {
      const preview = previews[previewIndex];
      const previewName = sanitizeFilename(preview.name || `preview-${previewIndex + 1}`);

      // Export at each size (creates a fresh canvas at target size for best quality)
      for (let sizeIndex = 0; sizeIndex < sizes.length; sizeIndex++) {
        const size = sizes[sizeIndex];
        const fileName = `${previewName}-${size.id}.png`;

        // Report progress
        if (onProgress) {
          onProgress({
            currentPreview: previewIndex + 1,
            totalPreviews: previews.length,
            currentSize: sizeIndex + 1,
            totalSizes: sizes.length,
            currentFile: fileName,
            overallProgress: Math.round(
              (completedOperations / totalOperations) * 100
            ),
          });
        }

        // Export preview at target size - creates canvas at native target resolution
        const blob = await exportPreviewAtSize(
          preview,
          canvasWidth,
          canvasHeight,
          size.width,
          size.height
        );

        // Add to appropriate folder
        const folder = size.platform === "ios" ? iosFolder : androidFolder;
        const previewFolder = folder?.folder(previewName);
        if (previewFolder) {
          previewFolder.file(fileName, blob);
        } else if (folder) {
          folder.file(fileName, blob);
        } else {
          zip.file(fileName, blob);
        }

        totalFiles++;
        completedOperations++;
      }
    }

    // Generate ZIP file
    if (onProgress) {
      onProgress({
        currentPreview: previews.length,
        totalPreviews: previews.length,
        currentSize: sizes.length,
        totalSizes: sizes.length,
        currentFile: "Creating ZIP file...",
        overallProgress: 95,
      });
    }

    const content = await zip.generateAsync({ type: "blob" });

    // Save the file
    const zipFileName = `${sanitizeFilename(projectName)}-screenshots.zip`;
    saveAs(content, zipFileName);

    if (onProgress) {
      onProgress({
        currentPreview: previews.length,
        totalPreviews: previews.length,
        currentSize: sizes.length,
        totalSizes: sizes.length,
        currentFile: "Complete!",
        overallProgress: 100,
      });
    }

    return {
      success: true,
      totalFiles,
    };
  } catch (error) {
    console.error("Batch export error:", error);
    return {
      success: false,
      totalFiles,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
