"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2, ImagePlus, Trash2, Save, Download, Undo2, Redo2, MoreHorizontal, Type, Palette, Smartphone, ZoomIn, ZoomOut, Maximize, LayoutTemplate } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { PreviewStrip } from "@/components/editor/preview-strip";
import { TemplatePicker } from "@/components/editor/template-picker";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import type { Project, DeviceFrame, Preview, PreviewTemplate } from "@/types";
import { cn } from "@/lib/utils";

// Zoom levels
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 0.85; // Start at 85%

interface ProjectEditorProps {
  project: Project;
  initialPreviews: Preview[];
  devices: DeviceFrame[];
  defaultDevice: DeviceFrame;
}

export function ProjectEditor({
  project,
  initialPreviews,
  devices,
  defaultDevice,
}: ProjectEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialBackgroundRef = useRef(true);
  const isUpdatingBackgroundRef = useRef(false);
  const isLoadingPreviewRef = useRef(false);
  const markDirtyRef = useRef<() => void>(() => {});

  const [selectedDevice, setSelectedDevice] = useState(defaultDevice);
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Preview state
  const [previews, setPreviews] = useState<Preview[]>(initialPreviews);
  const [activePreview, setActivePreview] = useState<Preview | null>(
    initialPreviews[0] || null
  );
  const [background, setBackground] = useState(
    initialPreviews[0]?.background || "#0a0a0a"
  );

  // Zoom state
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);

  // Track which previews have unsaved changes
  const [dirtyPreviewIds, setDirtyPreviewIds] = useState<Set<string>>(new Set());

  // Mark active preview as dirty
  const markDirty = useCallback(() => {
    if (activePreview && !isLoadingPreviewRef.current) {
      setDirtyPreviewIds((prev) => {
        if (prev.has(activePreview.id)) return prev;
        const next = new Set(prev);
        next.add(activePreview.id);
        return next;
      });
    }
  }, [activePreview]);

  // Keep ref updated for use in canvas event handlers
  markDirtyRef.current = markDirty;

  // History management for undo/redo
  const { saveState, undo, redo, initHistory, canUndo, canRedo } = useCanvasHistory();

  // Canvas dimensions are full device size (zoom is applied via CSS transform)
  const canvasWidth = selectedDevice.width;
  const canvasHeight = selectedDevice.height;

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

    // Set up event listeners for history tracking and dirty state
    const handleStateChange = () => {
      // Skip if disposed or if we're updating background (handled separately)
      if (!isDisposed && !isUpdatingBackgroundRef.current) {
        saveState(canvas);
        markDirtyRef.current();
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

    // Load existing canvas data from active preview
    const firstPreview = initialPreviews[0];
    if (firstPreview?.canvasJson) {
      canvas.loadFromJSON(firstPreview.canvasJson).then(() => {
        // Check if canvas was disposed during async load
        if (isDisposed) return;

        const objects = canvas.getObjects();
        setHasScreenshot(objects.length > 0);

        // Apply background from saved preview (gradients can't be serialized in canvas JSON)
        if (firstPreview.background) {
          applyBg(canvas, firstPreview.background);
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

    const newWidth = selectedDevice.width;
    const newHeight = selectedDevice.height;

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

    // Save state for undo/redo (skip initial render and preview loading)
    if (isCanvasReady && !isInitialBackgroundRef.current && !isLoadingPreviewRef.current) {
      saveState(canvas);
      markDirty();
    }
    isInitialBackgroundRef.current = false;
  }, [background, applyBackground, isCanvasReady, saveState, markDirty]);

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

  // Handle file upload - always use base64 initially, upload to Cloudinary on save
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      try {
        // Always use base64 for immediate display
        // Cloudinary upload happens during save to avoid orphaned images
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

  // Apply template to canvas
  const handleApplyTemplate = useCallback(
    async (template: PreviewTemplate) => {
      if (!fabricRef.current) return;

      const canvas = fabricRef.current;

      // Clear existing canvas
      canvas.clear();

      // Load template canvas JSON
      if (template.canvasJson) {
        await canvas.loadFromJSON(template.canvasJson);
      }

      // Apply background
      applyBackground(canvas, template.background);
      setBackground(template.background);

      // Check if there are objects
      const objects = canvas.getObjects();
      setHasScreenshot(objects.length > 0);

      canvas.renderAll();
      markDirty();
      initHistory(canvas);

      toast.success(`Applied "${template.name}" template`);
    },
    [applyBackground, markDirty, initHistory]
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

  // Helper to convert base64 data URL to Blob
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Helper to upload base64 images in canvas JSON to Cloudinary
  const uploadBase64ImagesToCloudinary = async (
    canvasJson: Record<string, unknown>,
    userId: string,
    projectId: string
  ): Promise<Record<string, unknown>> => {
    if (!isCloudinaryConfigured()) return canvasJson;

    const objects = canvasJson.objects as Array<Record<string, unknown>> | undefined;
    if (!objects) return canvasJson;

    const updatedObjects = await Promise.all(
      objects.map(async (obj, index) => {
        // Check if it's an image with base64 src
        if (obj.type === "image" && typeof obj.src === "string" && obj.src.startsWith("data:")) {
          try {
            const blob = dataUrlToBlob(obj.src);
            const result = await uploadToCloudinary(blob, userId, projectId, index);
            return { ...obj, src: result.secure_url };
          } catch (error) {
            console.error("Failed to upload image to Cloudinary:", error);
            return obj; // Keep base64 if upload fails
          }
        }
        return obj;
      })
    );

    return { ...canvasJson, objects: updatedObjects };
  };

  // Save all dirty previews
  const handleSave = useCallback(() => {
    if (!fabricRef.current || !activePreview) return;

    // First, update the active preview's current state
    const canvasJson = fabricRef.current.toJSON();
    const thumbnailUrl = fabricRef.current.toDataURL({
      format: "png",
      quality: 0.5,
      multiplier: 0.2,
    });

    // Update active preview in local state first
    const updatedPreviews = previews.map((p) =>
      p.id === activePreview.id
        ? { ...p, canvasJson, thumbnailUrl, background }
        : p
    );
    setPreviews(updatedPreviews);

    // Get all dirty previews to save
    const previewsToSave = updatedPreviews.filter((p) => dirtyPreviewIds.has(p.id));

    if (previewsToSave.length === 0) {
      toast.info("No changes to save");
      return;
    }

    startSaving(async () => {
      const supabase = createClient();

      // Get user for Cloudinary uploads
      const { data: { user } } = await supabase.auth.getUser();

      // Upload base64 images to Cloudinary and save previews
      const results = await Promise.all(
        previewsToSave.map(async (preview) => {
          // Upload base64 images to Cloudinary if configured
          let processedCanvasJson = preview.canvasJson;
          if (user && preview.canvasJson) {
            processedCanvasJson = await uploadBase64ImagesToCloudinary(
              preview.canvasJson as Record<string, unknown>,
              user.id,
              project.id
            );
          }

          return supabase
            .from("previews")
            .update({
              canvas_json: processedCanvasJson,
              thumbnail_url: preview.thumbnailUrl,
              background: preview.background,
              updated_at: new Date().toISOString(),
            })
            .eq("id", preview.id);
        })
      );

      const failed = results.filter((r) => r.error);

      if (failed.length === 0) {
        // Clear all dirty flags
        setDirtyPreviewIds(new Set());
        toast.success(`Saved ${previewsToSave.length} preview${previewsToSave.length > 1 ? "s" : ""}`);
      } else {
        toast.error(`Failed to save ${failed.length} preview(s)`);
      }
    });
  }, [activePreview, background, previews, dirtyPreviewIds, project.id]);

  // Handle preview selection
  const handlePreviewSelect = useCallback(
    async (preview: Preview) => {
      if (!fabricRef.current || preview.id === activePreview?.id) return;

      // Save current preview first (optional auto-save)
      const canvas = fabricRef.current;
      const canvasJson = canvas.toJSON();
      const thumbnailUrl = canvas.toDataURL({
        format: "png",
        quality: 0.5,
        multiplier: 0.2,
      });

      // Update current preview in local state
      setPreviews((prev) =>
        prev.map((p) =>
          p.id === activePreview?.id
            ? { ...p, canvasJson, thumbnailUrl, background }
            : p
        )
      );

      // Load new preview
      isLoadingPreviewRef.current = true;
      setActivePreview(preview);

      // Apply background first (before clearing, so we know what to restore)
      const newBg = preview.background || "#0a0a0a";

      // Clear canvas and load new preview data
      canvas.clear();

      // Immediately apply background after clear (clear() resets backgroundColor)
      applyBackground(canvas, newBg);

      if (preview.canvasJson) {
        await canvas.loadFromJSON(preview.canvasJson);
        // Re-apply background after loadFromJSON (it may override)
        applyBackground(canvas, newBg);
      }

      // Update React state to sync
      setBackground(newBg);

      const objects = canvas.getObjects();
      setHasScreenshot(objects.length > 0);

      canvas.renderAll();
      initHistory(canvas);

      isLoadingPreviewRef.current = false;
    },
    [activePreview, background, initHistory, applyBackground]
  );

  // Handle new preview created
  const handlePreviewCreated = useCallback((preview: Preview) => {
    setPreviews((prev) => [...prev, preview]);
    // Auto-switch to new preview
    handlePreviewSelect(preview);
  }, [handlePreviewSelect]);

  // Handle preview deleted
  const handlePreviewDeleted = useCallback(
    (previewId: string) => {
      setPreviews((prev) => prev.filter((p) => p.id !== previewId));

      // If deleted preview was active, switch to first remaining
      if (activePreview?.id === previewId) {
        const remaining = previews.filter((p) => p.id !== previewId);
        if (remaining.length > 0) {
          handlePreviewSelect(remaining[0]);
        }
      }
    },
    [activePreview, previews, handlePreviewSelect]
  );

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

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth - 32; // padding
    const containerHeight = containerRef.current.clientHeight - 32;

    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const fitZoom = Math.min(scaleX, scaleY, ZOOM_MAX);

    setZoom(Math.max(fitZoom, ZOOM_MIN));
  }, [canvasWidth, canvasHeight]);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom in: Cmd/Ctrl + =
      if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        handleZoomIn();
      }
      // Zoom out: Cmd/Ctrl + -
      if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault();
        handleZoomOut();
      }
      // Fit to screen: Cmd/Ctrl + 0
      if ((e.metaKey || e.ctrlKey) && e.key === "0") {
        e.preventDefault();
        handleFitToScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleFitToScreen]);

  return (
    <TooltipProvider delayDuration={300}>
      {/* Editor container - covers entire SidebarInset area */}
      <div className="absolute inset-0 z-50 flex flex-col bg-background">
        {/* Editor header with all controls */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-2 md:px-4">
          {/* Left side - consistent across breakpoints */}
          <div className="flex items-center gap-1 md:gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-1 md:mx-2 h-4" />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Link>
            </Button>
            <div className="ml-1 md:ml-2">
              <h1 className="text-sm font-semibold truncate max-w-[100px] sm:max-w-[200px] md:max-w-none">{project.name}</h1>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Desktop toolbar - hidden on mobile, scrollable */}
          <div className="hidden md:flex items-center overflow-x-auto">
            <div className="flex shrink-0 items-center gap-1">
            <DevicePicker
              deviceType={project.deviceType as "iphone" | "android"}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
            />

            <BackgroundPicker value={background} onChange={setBackground} />

            <TemplatePicker
              onSelectTemplate={handleApplyTemplate}
              currentDeviceType={project.deviceType as "iphone" | "android"}
            />

            <Separator orientation="vertical" className="mx-2 h-6" />

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

            {/* Zoom controls */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= ZOOM_MIN}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>

            <span className="w-12 text-center text-xs text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= ZOOM_MAX}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFitToScreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fit to screen</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="relative"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {dirtyPreviewIds.size > 0 && !isSaving && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dirtyPreviewIds.size > 0
                  ? `Save (${dirtyPreviewIds.size} unsaved)`
                  : "Save"}
              </TooltipContent>
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
          </div>

          {/* Mobile toolbar - visible only on mobile */}
          <div className="flex md:hidden items-center gap-1">
            {/* Hidden TextTool for mobile triggering */}
            <div className="hidden">
              <TextTool onAddText={handleAddText} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Tools menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" />
                  Upload Screenshot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // Trigger text tool - we'll need to handle this differently
                    const textToolButton = document.querySelector('[data-text-tool-trigger]') as HTMLButtonElement;
                    textToolButton?.click();
                  }}
                >
                  <Type className="h-4 w-4" />
                  Add Text
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleClear}
                  disabled={!hasScreenshot}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Canvas
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Smartphone className="h-4 w-4" />
                    Device: {selectedDevice.name}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {devices.map((device) => (
                      <DropdownMenuItem
                        key={device.id}
                        onClick={() => handleDeviceChange(device)}
                      >
                        {device.name}
                        {device.id === selectedDevice.id && " (current)"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                  Redo
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-sm text-muted-foreground">Zoom</span>
                  <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                </div>
                <DropdownMenuItem
                  onClick={handleZoomIn}
                  disabled={zoom >= ZOOM_MAX}
                >
                  <ZoomIn className="h-4 w-4" />
                  Zoom In
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleZoomOut}
                  disabled={zoom <= ZOOM_MIN}
                >
                  <ZoomOut className="h-4 w-4" />
                  Zoom Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFitToScreen}>
                  <Maximize className="h-4 w-4" />
                  Fit to Screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <BackgroundPicker value={background} onChange={setBackground} />

            <TemplatePicker
              onSelectTemplate={handleApplyTemplate}
              currentDeviceType={project.deviceType as "iphone" | "android"}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={isSaving}
              className="relative"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {dirtyPreviewIds.size > 0 && !isSaving && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExportOpen(true)}
              disabled={!hasScreenshot}
            >
              <Download className="h-4 w-4" />
            </Button>
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
          {/* Canvas wrapper with zoom transform */}
          <div
            className="relative shrink-0 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-150"
            style={{
              width: canvasWidth * zoom,
              height: canvasHeight * zoom,
            }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
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
        </div>

        {/* Preview strip at bottom */}
        <PreviewStrip
          projectId={project.id}
          previews={previews}
          activePreviewId={activePreview?.id || null}
          onPreviewSelect={handlePreviewSelect}
          onPreviewCreated={handlePreviewCreated}
          onPreviewDeleted={handlePreviewDeleted}
        />

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
