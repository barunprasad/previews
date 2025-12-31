"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2, ImagePlus, Trash2, Save, Download, Undo2, Redo2 } from "lucide-react";
import { Canvas, FabricImage, FabricText, Gradient } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DevicePicker } from "@/components/editor/device-picker";
import { ExportDialog } from "@/components/editor/export-dialog";
import { BackgroundPicker } from "@/components/editor/background-picker";
import { TextTool } from "@/components/editor/text-tool";
import { useCanvasHistory } from "@/hooks/use-canvas-history";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveProjectAction } from "./actions";
import type { Project, DeviceFrame } from "@/types";
import { cn } from "@/lib/utils";

// Scale factor for working canvas
const CANVAS_SCALE = 1;

interface ProjectEditorProps {
  project: Project;
  devices: DeviceFrame[];
  defaultDevice: DeviceFrame;
}

export function ProjectEditor({
  project,
  devices,
  defaultDevice,
}: ProjectEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialBackgroundRef = useRef(true);
  const isUpdatingBackgroundRef = useRef(false);

  const [selectedDevice, setSelectedDevice] = useState(defaultDevice);
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [background, setBackground] = useState(project.background || "#0a0a0a");

  // History management for undo/redo
  const { saveState, undo, redo, initHistory, canUndo, canRedo } = useCanvasHistory();

  // Calculate scaled canvas dimensions
  const canvasWidth = Math.round(selectedDevice.width * CANVAS_SCALE);
  const canvasHeight = Math.round(selectedDevice.height * CANVAS_SCALE);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    let isDisposed = false;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#0a0a0a",
      preserveObjectStacking: true,
      selection: true,
    });

    fabricRef.current = canvas;
    setIsCanvasReady(true);

    // Set up event listeners for history tracking
    const handleStateChange = () => {
      // Skip if disposed or if we're updating background (handled separately)
      if (!isDisposed && !isUpdatingBackgroundRef.current) {
        saveState(canvas);
      }
    };

    canvas.on("object:added", handleStateChange);
    canvas.on("object:removed", handleStateChange);
    canvas.on("object:modified", handleStateChange);

    // Helper to apply background - inline because we can't use hooks in callback
    const applyBg = (c: Canvas, bg: string) => {
      const isGradient = bg.startsWith("linear-gradient");
      if (isGradient) {
        const match = bg.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
        if (match) {
          const angle = parseInt(match[1]);
          const colorStops = match[2].split(/,\s*(?=#)/).map((stop) => {
            const parts = stop.trim().split(/\s+/);
            const color = parts[0];
            const offset = parseInt(parts[1]) / 100;
            return { offset, color };
          });

          let x1 = 0, y1 = 0, x2 = c.width!, y2 = c.height!;
          if (angle === 90) {
            x1 = 0; y1 = c.height! / 2;
            x2 = c.width!; y2 = c.height! / 2;
          } else if (angle === 180) {
            x1 = c.width! / 2; y1 = 0;
            x2 = c.width! / 2; y2 = c.height!;
          } else if (angle === 0 || angle === 360) {
            x1 = c.width! / 2; y1 = c.height!;
            x2 = c.width! / 2; y2 = 0;
          }

          const gradient = new Gradient({
            type: "linear",
            coords: { x1, y1, x2, y2 },
            colorStops,
          });
          const canvasGradient = gradient.toLive(c.getContext());
          c.backgroundColor = canvasGradient as unknown as string;
        }
      } else {
        c.backgroundColor = bg;
      }
    };

    // Load existing canvas data if available
    if (project.canvasJson) {
      canvas.loadFromJSON(project.canvasJson).then(() => {
        // Check if canvas was disposed during async load
        if (isDisposed) return;

        const objects = canvas.getObjects();
        setHasScreenshot(objects.length > 0);

        // Apply background from saved project (gradients can't be serialized in canvas JSON)
        if (project.background) {
          applyBg(canvas, project.background);
        }

        canvas.renderAll();
        // Initialize history after loading
        initHistory(canvas);
      }).catch((err) => {
        // Ignore errors if canvas was disposed
        if (!isDisposed) {
          console.error("Error loading canvas:", err);
        }
      });
    } else {
      // Initialize history for new canvas
      initHistory(canvas);
    }

    return () => {
      isDisposed = true;
      canvas.off("object:added", handleStateChange);
      canvas.off("object:removed", handleStateChange);
      canvas.off("object:modified", handleStateChange);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update canvas dimensions when device changes
  useEffect(() => {
    if (!fabricRef.current) return;

    const newWidth = Math.round(selectedDevice.width * CANVAS_SCALE);
    const newHeight = Math.round(selectedDevice.height * CANVAS_SCALE);

    fabricRef.current.setDimensions({
      width: newWidth,
      height: newHeight,
    });
    fabricRef.current.renderAll();
  }, [selectedDevice.width, selectedDevice.height]);

  // Helper to parse CSS gradient to Fabric.js gradient
  const parseGradient = useCallback((gradientStr: string, width: number, height: number) => {
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
    // All our gradients use 135deg (diagonal top-left to bottom-right)
    // For simplicity, use corner-to-corner for 135deg
    let x1 = 0, y1 = 0, x2 = width, y2 = height;

    // Adjust based on angle if needed
    if (angle === 90) {
      // Left to right
      x1 = 0; y1 = height / 2;
      x2 = width; y2 = height / 2;
    } else if (angle === 180) {
      // Top to bottom
      x1 = width / 2; y1 = 0;
      x2 = width / 2; y2 = height;
    } else if (angle === 0 || angle === 360) {
      // Bottom to top
      x1 = width / 2; y1 = height;
      x2 = width / 2; y2 = 0;
    }
    // Default (135deg): top-left to bottom-right, already set

    return new Gradient({
      type: "linear",
      coords: { x1, y1, x2, y2 },
      colorStops,
    });
  }, []);

  // Helper to apply background to canvas
  const applyBackground = useCallback((canvas: Canvas, bg: string) => {
    const isGradient = bg.startsWith("linear-gradient");

    if (isGradient) {
      const gradient = parseGradient(bg, canvas.width!, canvas.height!);
      if (gradient) {
        const canvasGradient = gradient.toLive(canvas.getContext());
        canvas.backgroundColor = canvasGradient as unknown as string;
      } else {
        canvas.backgroundColor = "#0a0a0a";
      }
    } else {
      canvas.backgroundColor = bg;
    }

    canvas.renderAll();
  }, [parseGradient]);

  // Update canvas background when it changes
  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Prevent event-based history saves during background update
    isUpdatingBackgroundRef.current = true;

    applyBackground(canvas, background);

    // Re-enable event-based history saves
    isUpdatingBackgroundRef.current = false;

    // Save state for undo/redo (skip initial render)
    if (isCanvasReady && !isInitialBackgroundRef.current) {
      saveState(canvas);
    }
    isInitialBackgroundRef.current = false;
  }, [background, applyBackground, isCanvasReady, saveState]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricRef.current) return;

      // Check for Cmd/Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo(fabricRef.current);
        }
      }

      // Check for Cmd/Ctrl+Shift+Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        if (canRedo) {
          redo(fabricRef.current);
        }
      }

      // Also support Cmd/Ctrl+Y for redo
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        if (canRedo) {
          redo(fabricRef.current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Add screenshot to canvas
  const addScreenshot = useCallback(
    async (url: string) => {
      if (!fabricRef.current) return;

      const canvas = fabricRef.current;

      // Clear existing objects (background is preserved as canvas.backgroundColor)
      canvas.getObjects().forEach((obj) => canvas.remove(obj));

      try {
        const img = await FabricImage.fromURL(url, {
          crossOrigin: "anonymous",
        });

        const canvasWidth = canvas.width!;
        const canvasHeight = canvas.height!;
        const imgWidth = img.width!;
        const imgHeight = img.height!;

        // Scale to fit within 70% of canvas size (smaller initial size)
        const maxWidth = canvasWidth * 0.7;
        const maxHeight = canvasHeight * 0.7;
        const scaleX = maxWidth / imgWidth;
        const scaleY = maxHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        img.set({
          scaleX: scale,
          scaleY: scale,
        });

        // Center the image on the canvas
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        img.set({
          left: (canvasWidth - scaledWidth) / 2,
          top: (canvasHeight - scaledHeight) / 2,
          originX: "left",
          originY: "top",
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        setHasScreenshot(true);

        toast.success("Screenshot added");
      } catch (error) {
        console.error("Error loading screenshot:", error);
        toast.error("Failed to load screenshot");
      }
    },
    []
  );

  // Convert file to data URL for persistence
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      try {
        // Convert to data URL so it persists when saved
        const dataUrl = await fileToDataUrl(file);
        addScreenshot(dataUrl);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Failed to read image file");
      }
    },
    [addScreenshot]
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
      e.target.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  // Clear canvas (remove all objects, background is preserved)
  const handleClear = useCallback(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Remove all objects (background is preserved as canvas.backgroundColor)
    canvas.getObjects().forEach((obj) => canvas.remove(obj));

    canvas.renderAll();
    setHasScreenshot(false);
  }, []);

  // Add text to canvas
  const handleAddText = useCallback(
    (options: { text: string; fontSize: number; fontWeight: string; fill: string }) => {
      if (!fabricRef.current) return;

      const canvas = fabricRef.current;
      const text = new FabricText(options.text, {
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        fontSize: options.fontSize,
        fontWeight: options.fontWeight,
        fill: options.fill,
        fontFamily: "system-ui, -apple-system, sans-serif",
        originX: "center",
        originY: "center",
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      setHasScreenshot(true);

      toast.success("Text added");
    },
    []
  );

  // Helper to restore background state from canvas after undo/redo
  const restoreBackgroundState = useCallback((canvas: Canvas) => {
    // For solid colors, restore from canvas.backgroundColor
    // For gradients, the visual is restored but we can't easily reconstruct the CSS string
    if (canvas.backgroundColor && typeof canvas.backgroundColor === "string") {
      setBackground(canvas.backgroundColor);
    }
    // Note: Gradients are restored visually by loadFromJSON, but the picker won't show the exact gradient
  }, []);

  // Undo handler
  const handleUndo = useCallback(async () => {
    if (!fabricRef.current || !canUndo) return;
    await undo(fabricRef.current);
    restoreBackgroundState(fabricRef.current);
  }, [undo, canUndo, restoreBackgroundState]);

  // Redo handler
  const handleRedo = useCallback(async () => {
    if (!fabricRef.current || !canRedo) return;
    await redo(fabricRef.current);
    restoreBackgroundState(fabricRef.current);
  }, [redo, canRedo, restoreBackgroundState]);

  // Save project
  const handleSave = useCallback(() => {
    if (!fabricRef.current) return;

    const canvasJson = fabricRef.current.toJSON();
    const thumbnailUrl = fabricRef.current.toDataURL({
      format: "png",
      quality: 0.5,
      multiplier: 0.2,
    });

    startSaving(async () => {
      const result = await saveProjectAction({
        projectId: project.id,
        canvasJson,
        thumbnailUrl,
        background, // Save the background CSS string
      });

      if (result.success) {
        toast.success("Project saved");
      } else {
        toast.error(result.error || "Failed to save project");
      }
    });
  }, [project.id, background]);

  // Export canvas
  const handleExport = useCallback(
    (width: number, height: number, label: string) => {
      if (!fabricRef.current) return;

      const multiplier = width / fabricRef.current.width!;
      const dataUrl = fabricRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier,
      });

      // Download the image
      const link = document.createElement("a");
      link.download = `${project.name}-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success(`Exported ${label}`);
    },
    [project.name]
  );

  // Handle device change
  const handleDeviceChange = useCallback((device: DeviceFrame) => {
    setSelectedDevice(device);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      {/* Editor container - covers entire SidebarInset area */}
      <div className="absolute inset-0 z-50 flex flex-col bg-background">
        {/* Editor header with all controls */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Link>
            </Button>
            <div className="ml-2">
              <h1 className="text-sm font-semibold">{project.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DevicePicker
              deviceType={project.deviceType as "iphone" | "android"}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
            />

            <BackgroundPicker value={background} onChange={setBackground} />

            <Separator orientation="vertical" className="mx-2 h-6" />

            {/* Inline toolbar */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload screenshot</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TextTool onAddText={handleAddText} />
              </TooltipTrigger>
              <TooltipContent>Add text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  disabled={!hasScreenshot}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExportOpen(true)}
                  disabled={!hasScreenshot}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Canvas area */}
        <div
          ref={containerRef}
          className={cn(
            "relative flex flex-1 items-center justify-center overflow-auto bg-muted/50 p-4",
            isDragging && "ring-2 ring-inset ring-primary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Canvas wrapper */}
          <div
            className="relative shrink-0 overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: canvasWidth,
              height: canvasHeight,
            }}
          >
            <canvas ref={canvasRef} />

            {/* Empty state overlay */}
            {!hasScreenshot && isCanvasReady && (
              <div
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-neutral-900/90 transition-colors hover:bg-neutral-900/80"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800">
                  <Upload className="h-10 w-10 text-neutral-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-white">Drop screenshot here</p>
                  <p className="text-sm text-neutral-400">
                    or click to browse
                  </p>
                </div>
              </div>
            )}

            {/* Drag overlay */}
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-primary">
                  <Upload className="h-12 w-12" />
                  <p className="text-lg font-semibold">Drop to add screenshot</p>
                </div>
              </div>
            )}

            {/* Loading state */}
            {!isCanvasReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            )}
          </div>
        </div>

        {/* Export dialog */}
        <ExportDialog
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          device={selectedDevice}
          onExport={handleExport}
        />
      </div>
    </TooltipProvider>
  );
}
