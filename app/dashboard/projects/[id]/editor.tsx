"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2, Trash2, Save, Download, Undo2, Redo2, MoreHorizontal, ZoomIn, ZoomOut, Maximize, PanelRight, Package, ChevronDown, Smartphone } from "lucide-react";
import { Canvas, FabricImage, FabricText, Gradient, Rect, Group, Shadow } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExportDialog } from "@/components/editor/export-dialog";
import { BatchExportDialog } from "@/components/editor/batch-export-dialog";
import { DeviceMockup, getDeviceMockup } from "@/lib/devices/frames";
import { BezelConfig, getBezelById, allBezels } from "@/lib/devices/bezels";
import { RightPanel } from "@/components/editor/right-panel";
import { useCanvasHistory } from "@/hooks/use-canvas-history";
import { useBackgroundRemoval } from "@/hooks/use-background-removal";
import { getDevicesByType } from "@/lib/devices";
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
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { PreviewStrip } from "@/components/editor/preview-strip";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import type { Project, DeviceFrame, Preview, PreviewTemplate, TemplateSet } from "@/types";
import { cn } from "@/lib/utils";
import { findReplaceableObjects, replaceScreenshot, type FabricImageWithData } from "@/lib/templates/replacement";

// Zoom levels
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.05;
const ZOOM_DEFAULT = 0.25; // Start at 25% for full-resolution canvas

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
  const backgroundRef = useRef<string>("#0a0a0a");

  const [selectedDevice, setSelectedDevice] = useState(defaultDevice);
  const [hasScreenshot, setHasScreenshot] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBatchExportOpen, setIsBatchExportOpen] = useState(false);
  const [currentMockup, setCurrentMockup] = useState<DeviceMockup | null>(null);
  const [currentBezel, setCurrentBezel] = useState<BezelConfig | null>(null);
  const deviceFrameRef = useRef<Group | null>(null);
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

  // Right panel visibility (desktop only, always visible by default)
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Get all devices for the current device type
  const allDevices = getDevicesByType(project.deviceType as "iphone" | "android");

  // Selected text style for the right panel
  const [selectedTextStyle, setSelectedTextStyle] = useState<{
    fontSize: number;
    fontWeight: string;
    fill: string;
  } | null>(null);

  // Track if an image is currently selected
  const [hasSelectedImage, setHasSelectedImage] = useState(false);

  // Background removal hook
  const {
    isProcessing: isRemovingBackground,
    progress: backgroundRemovalProgress,
    removeBackground: removeBackgroundFromImage,
  } = useBackgroundRemoval();

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

  // Mark all previews as dirty (used when applying changes to all previews)
  const markAllDirty = useCallback(() => {
    setDirtyPreviewIds(new Set(previews.map((p) => p.id)));
  }, [previews]);

  // Keep refs updated for use in canvas event handlers
  markDirtyRef.current = markDirty;
  backgroundRef.current = background;

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
        saveState(canvas, backgroundRef.current);
        markDirtyRef.current();
      }
    };

    canvas.on("object:added", handleStateChange);
    canvas.on("object:removed", handleStateChange);
    canvas.on("object:modified", handleStateChange);

    // Selection event handlers for text styling
    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject.type === "Text" || activeObject.type === "Textbox" || activeObject.type === "IText")) {
        const textObj = activeObject as FabricText;
        setSelectedTextStyle({
          fontSize: textObj.fontSize || 48,
          fontWeight: String(textObj.fontWeight || "normal"),
          fill: String(textObj.fill || "#ffffff"),
        });
        setHasSelectedImage(false);
      } else if (activeObject && activeObject.type === "Image") {
        setSelectedTextStyle(null);
        setHasSelectedImage(true);
      } else {
        setSelectedTextStyle(null);
        setHasSelectedImage(false);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedTextStyle(null);
      setHasSelectedImage(false);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);

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
        const hasObjects = objects.length > 0;
        setHasScreenshot(hasObjects);

        // Detect existing device frame and restore state
        if (hasObjects) {
          const { mockup, bezel } = detectDeviceFrameOnCanvas(canvas);
          if (bezel) {
            setCurrentBezel(bezel);
            setCurrentMockup(null);
          } else if (mockup) {
            setCurrentMockup(mockup);
            setCurrentBezel(null);
          }
        }

        // Apply background from saved preview (gradients can't be serialized in canvas JSON)
        if (firstPreview.background) {
          applyBg(canvas, firstPreview.background);
        }

        canvas.renderAll();
        // Initialize history after loading
        initHistory(canvas, firstPreview.background || "#0a0a0a");
      }).catch((err) => {
        // Ignore errors if canvas was disposed
        if (!isDisposed) {
          console.error("Error loading canvas:", err);
        }
      });
    } else {
      // Initialize history for new canvas
      initHistory(canvas, "#0a0a0a");
    }

    return () => {
      isDisposed = true;
      canvas.off("object:added", handleStateChange);
      canvas.off("object:removed", handleStateChange);
      canvas.off("object:modified", handleStateChange);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelectionCleared);
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
      saveState(canvas, background);
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

  // Helper function to create a device frame group (programmatic)
  const createDeviceFrameGroup = useCallback((image: FabricImage, mockup: DeviceMockup): Group => {
    // Get image dimensions (without rotation affecting them)
    const imgWidth = (image.width || 0) * (image.scaleX || 1);
    const imgHeight = (image.height || 0) * (image.scaleY || 1);

    // Get the image's rotation angle
    const imageAngle = image.angle || 0;

    // Get the center point of the image
    const centerPoint = image.getCenterPoint();

    // Scale bezel based on image size (base size is for ~400px width)
    const scaleFactor = imgWidth / 400;
    const bezel = {
      top: mockup.bezel.top * scaleFactor,
      bottom: mockup.bezel.bottom * scaleFactor,
      left: mockup.bezel.left * scaleFactor,
      right: mockup.bezel.right * scaleFactor,
    };
    const cornerRadius = mockup.cornerRadius * scaleFactor;

    // Calculate frame dimensions
    const frameWidth = imgWidth + bezel.left + bezel.right;
    const frameHeight = imgHeight + bezel.top + bezel.bottom;

    // Create device frame (bezel) - position relative to group center
    const frame = new Rect({
      left: -frameWidth / 2,
      top: -frameHeight / 2,
      width: frameWidth,
      height: frameHeight,
      fill: mockup.frameColor,
      rx: cornerRadius,
      ry: cornerRadius,
      originX: "left",
      originY: "top",
      strokeWidth: 1,
      stroke: "#333333",
      shadow: new Shadow({
        color: "rgba(0,0,0,0.5)",
        blur: 25 * scaleFactor,
        offsetX: 0,
        offsetY: 8 * scaleFactor,
      }),
    });

    // Clone the image for the group (positioned relative to group center, without rotation)
    const clonedImage = new FabricImage(image.getElement(), {
      left: -imgWidth / 2 + (bezel.left - bezel.right) / 2,
      top: -imgHeight / 2 + (bezel.top - bezel.bottom) / 2,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      originX: "left",
      originY: "top",
      angle: 0, // Reset angle - the group will handle rotation
    });

    // Build group objects array
    const groupObjects: (Rect | FabricImage)[] = [frame, clonedImage];

    // Add Dynamic Island if applicable
    if (mockup.hasDynamicIsland) {
      const islandWidth = 95 * scaleFactor;
      const islandHeight = 28 * scaleFactor;

      const island = new Rect({
        left: -islandWidth / 2 + (bezel.left - bezel.right) / 2,
        top: -imgHeight / 2 + (8 * scaleFactor) + (bezel.top - bezel.bottom) / 2,
        width: islandWidth,
        height: islandHeight,
        fill: "#000000",
        rx: islandHeight / 2,
        ry: islandHeight / 2,
        originX: "left",
        originY: "top",
      });
      groupObjects.push(island);
    }

    // Add notch if applicable
    if (mockup.hasNotch) {
      const notchWidth = 150 * scaleFactor;
      const notchHeight = 30 * scaleFactor;

      const notch = new Rect({
        left: -notchWidth / 2 + (bezel.left - bezel.right) / 2,
        top: -imgHeight / 2 + (bezel.top - bezel.bottom) / 2,
        width: notchWidth,
        height: notchHeight,
        fill: "#000000",
        rx: 0,
        ry: 0,
        originX: "left",
        originY: "top",
      });
      groupObjects.push(notch);
    }

    // Create the group with the image's rotation
    const deviceGroup = new Group(groupObjects, {
      left: centerPoint.x,
      top: centerPoint.y,
      originX: "center",
      originY: "center",
      angle: imageAngle, // Apply the image's rotation to the entire group
    });

    // Store mockup ID as direct property
    (deviceGroup as Group & { deviceMockupId?: string }).deviceMockupId = mockup.id;

    return deviceGroup;
  }, []);

  // Helper function to create a device frame group using SVG bezel
  const createDeviceFrameWithBezel = useCallback(async (image: FabricImage, bezel: BezelConfig): Promise<Group> => {
    // Get image dimensions (without rotation affecting them)
    const imgWidth = (image.width || 0) * (image.scaleX || 1);
    const imgHeight = (image.height || 0) * (image.scaleY || 1);

    // Get the image's rotation angle
    const imageAngle = image.angle || 0;

    // Get the center point of the image
    const centerPoint = image.getCenterPoint();

    // Load the bezel SVG as a FabricImage
    const bezelImage = await FabricImage.fromURL(bezel.bezelPath, {
      crossOrigin: "anonymous",
    });

    // Calculate scaling for the bezel to match the image size
    // The bezel's screen area should contain the image
    const screenWidthRatio = imgWidth / bezel.screen.width;
    const screenHeightRatio = imgHeight / bezel.screen.height;

    // Use the larger ratio to ensure image fills the screen area
    // (or use Math.min to fit within, depending on desired behavior)
    const bezelScale = Math.max(screenWidthRatio, screenHeightRatio);

    // Scale the bezel
    const scaledBezelWidth = bezel.bezelWidth * bezelScale;
    const scaledBezelHeight = bezel.bezelHeight * bezelScale;
    const scaledScreenX = bezel.screen.x * bezelScale;
    const scaledScreenY = bezel.screen.y * bezelScale;
    const scaledScreenWidth = bezel.screen.width * bezelScale;
    const scaledScreenHeight = bezel.screen.height * bezelScale;

    // Position bezel image (relative to group center)
    bezelImage.set({
      left: -scaledBezelWidth / 2,
      top: -scaledBezelHeight / 2,
      scaleX: bezelScale,
      scaleY: bezelScale,
      originX: "left",
      originY: "top",
    });

    // Calculate image position within the bezel's screen area
    // Image should be centered within the screen area
    const imageOffsetX = -scaledBezelWidth / 2 + scaledScreenX + (scaledScreenWidth - imgWidth) / 2;
    const imageOffsetY = -scaledBezelHeight / 2 + scaledScreenY + (scaledScreenHeight - imgHeight) / 2;

    // Scale the corner radius - but adjust for image's scale since clipPath is in local coords
    const scaledCornerRadius = bezel.screen.cornerRadius * bezelScale;
    const imageScaleX = image.scaleX || 1;
    const imageScaleY = image.scaleY || 1;

    // Clip path uses the image's natural (unscaled) dimensions
    // Corner radius needs to be in unscaled coordinates
    const naturalWidth = image.width || 1;
    const naturalHeight = image.height || 1;
    const clipCornerRadiusX = scaledCornerRadius / imageScaleX;
    const clipCornerRadiusY = scaledCornerRadius / imageScaleY;

    // Create a clip path with rounded corners to match the screen area
    const clipPath = new Rect({
      width: naturalWidth,
      height: naturalHeight,
      rx: clipCornerRadiusX,
      ry: clipCornerRadiusY,
      originX: "center",
      originY: "center",
      left: 0,
      top: 0,
    });

    // Clone the image for the group
    const clonedImage = new FabricImage(image.getElement(), {
      left: imageOffsetX,
      top: imageOffsetY,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      originX: "left",
      originY: "top",
      angle: 0, // Reset angle - the group will handle rotation
      clipPath: clipPath,
    });

    // Create the group with screenshot BEHIND bezel (bezel on top)
    // Actually, screenshot should be behind the bezel frame
    // But since the bezel has transparent screen area, order matters:
    // Screenshot first, then bezel on top
    const deviceGroup = new Group([clonedImage, bezelImage], {
      left: centerPoint.x,
      top: centerPoint.y,
      originX: "center",
      originY: "center",
      angle: imageAngle, // Apply the image's rotation to the entire group
    });

    // Store bezel ID - set both ways for compatibility
    (deviceGroup as Group & { bezelId?: string }).bezelId = bezel.id;

    return deviceGroup;
  }, []);

  // Add screenshot to canvas - replaces placeholder or existing image if present
  const addScreenshot = useCallback(
    async (url: string) => {
      if (!fabricRef.current) return;

      const canvas = fabricRef.current;

      // Check for placeholder images first (from templates)
      const placeholders = findReplaceableObjects(canvas);

      if (placeholders.length > 0) {
        // Replace the first placeholder (primary slot)
        try {
          await replaceScreenshot(canvas, placeholders[0], url, FabricImage);
          setHasScreenshot(true);
          toast.success("Screenshot replaced");
          return;
        } catch (error) {
          console.error("Error replacing placeholder:", error);
          toast.error("Failed to replace screenshot");
          return;
        }
      }

      // Helper to check type (handles both v5 lowercase and v6+ uppercase)
      const isGroup = (o: { type?: string }) => o.type === "Group" || o.type === "group";
      const isImage = (o: { type?: string }) => o.type === "Image" || o.type === "image";

      // Check for device frame group (any group containing an image)
      const allObjects = canvas.getObjects();
      for (const obj of allObjects) {
        if (isGroup(obj)) {
          const group = obj as Group & { bezelId?: string; deviceMockupId?: string };
          const groupObjects = group.getObjects();
          const imageInGroup = groupObjects.find((o) => isImage(o)) as FabricImage | undefined;

          if (imageInGroup) {
            try {
              // Get the group's current transform (position, angle, scale)
              const groupCenter = group.getCenterPoint();
              const groupAngle = group.angle || 0;
              const groupScaleX = group.scaleX || 1;
              const groupScaleY = group.scaleY || 1;

              // Calculate displayed size of the image inside the group
              // Must account for group's scale as well
              const displayWidth = (imageInGroup.width || 0) * (imageInGroup.scaleX || 1) * groupScaleX;
              const displayHeight = (imageInGroup.height || 0) * (imageInGroup.scaleY || 1) * groupScaleY;

              // Load new image
              const newImg = await FabricImage.fromURL(url, {
                crossOrigin: "anonymous",
              });

              // Calculate scale to match the displayed size
              const newImgWidth = newImg.width || 1;
              const newImgHeight = newImg.height || 1;
              const scaleToFitWidth = displayWidth / newImgWidth;
              const scaleToFitHeight = displayHeight / newImgHeight;
              const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

              // Create standalone image at group's position with correct scale
              const standaloneImg = new FabricImage(newImg.getElement(), {
                left: groupCenter.x,
                top: groupCenter.y,
                scaleX: scale,
                scaleY: scale,
                angle: groupAngle,
                originX: "center",
                originY: "center",
              });

              // Remove old group
              canvas.remove(group);

              // Add standalone image and render to initialize it
              canvas.add(standaloneImg);
              canvas.renderAll();
              standaloneImg.setCoords();

              // Check if this was a bezel frame or a programmatic mockup frame
              // Access custom properties directly on the group object
              const bezelId = group.bezelId;
              const mockupId = group.deviceMockupId;

              if (bezelId || currentBezel) {
                // Re-apply bezel frame
                const bezel = bezelId ? getBezelById(bezelId) : currentBezel;
                if (bezel) {
                  const newGroup = await createDeviceFrameWithBezel(standaloneImg, bezel);
                  canvas.remove(standaloneImg);
                  canvas.add(newGroup);
                  canvas.setActiveObject(newGroup);
                  deviceFrameRef.current = newGroup;
                  setCurrentBezel(bezel);
                  setCurrentMockup(null);
                } else {
                  // Fallback: just keep the standalone image
                  canvas.setActiveObject(standaloneImg);
                  deviceFrameRef.current = null;
                  setCurrentBezel(null);
                }
              } else {
                // Re-apply programmatic mockup frame
                const mockup = mockupId
                  ? getDeviceMockup(mockupId)
                  : (currentMockup || getDeviceMockup("generic"));

                const newGroup = createDeviceFrameGroup(standaloneImg, mockup);

                if (!newGroup) {
                  // Fallback: just keep the standalone image
                  console.error("Failed to create device frame group");
                  canvas.setActiveObject(standaloneImg);
                  deviceFrameRef.current = null;
                  setCurrentMockup(null);
                } else {
                  // Remove standalone and add group
                  canvas.remove(standaloneImg);
                  canvas.add(newGroup);
                  canvas.setActiveObject(newGroup);

                  // Update refs
                  deviceFrameRef.current = newGroup;
                  setCurrentMockup(mockup);
                }
              }

              canvas.renderAll();
              setHasScreenshot(true);
              toast.success("Screenshot replaced");
              return;
            } catch (error) {
              console.error("Error replacing image in device frame:", error);
              toast.error("Failed to replace screenshot");
              return;
            }
          }
        }
      }

      // Check for any existing standalone image to replace (non-placeholder)
      const existingImages = canvas.getObjects().filter((obj) => isImage(obj)) as FabricImage[];

      if (existingImages.length > 0) {
        // Replace the first existing image, scaling to match its displayed size
        const targetImage = existingImages[0];

        // Calculate the displayed size of the existing image
        const displayWidth = (targetImage.width || 0) * (targetImage.scaleX || 1);
        const displayHeight = (targetImage.height || 0) * (targetImage.scaleY || 1);

        try {
          const newImg = await FabricImage.fromURL(url, {
            crossOrigin: "anonymous",
          });

          // Calculate scale to match the existing image's displayed size
          const newImgWidth = newImg.width || 1;
          const newImgHeight = newImg.height || 1;
          const scaleToFitWidth = displayWidth / newImgWidth;
          const scaleToFitHeight = displayHeight / newImgHeight;
          const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

          // Apply transform to match existing image size and position
          newImg.set({
            left: targetImage.left,
            top: targetImage.top,
            scaleX: scale,
            scaleY: scale,
            angle: targetImage.angle,
            originX: targetImage.originX,
            originY: targetImage.originY,
            shadow: targetImage.shadow, // Preserve shadow
          });

          // Remove old image and add new one
          canvas.remove(targetImage);
          canvas.add(newImg);
          canvas.setActiveObject(newImg);
          canvas.renderAll();
          setHasScreenshot(true);

          toast.success("Screenshot replaced");
          return;
        } catch (error) {
          console.error("Error replacing image:", error);
          toast.error("Failed to replace screenshot");
          return;
        }
      }

      // No existing images - add new image (fresh canvas)
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
    [currentBezel, currentMockup, createDeviceFrameWithBezel, createDeviceFrameGroup]
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

  // Handle text style changes for selected text
  const handleTextStyleChange = useCallback(
    (style: Partial<{ fontSize: number; fontWeight: string; fill: string }>) => {
      if (!fabricRef.current) return;

      const canvas = fabricRef.current;
      const activeObject = canvas.getActiveObject();

      if (activeObject && (activeObject.type === "Text" || activeObject.type === "Textbox" || activeObject.type === "IText")) {
        const textObj = activeObject as FabricText;

        if (style.fontSize !== undefined) {
          textObj.set("fontSize", style.fontSize);
        }
        if (style.fontWeight !== undefined) {
          textObj.set("fontWeight", style.fontWeight);
        }
        if (style.fill !== undefined) {
          textObj.set("fill", style.fill);
        }

        canvas.renderAll();
        markDirty();

        // Update local state to reflect changes
        setSelectedTextStyle({
          fontSize: textObj.fontSize || 48,
          fontWeight: String(textObj.fontWeight || "normal"),
          fill: String(textObj.fill || "#ffffff"),
        });
      }
    },
    [markDirty]
  );

  // Handle background removal for selected image
  const handleRemoveBackground = useCallback(async () => {
    if (!fabricRef.current || isRemovingBackground) return;

    const canvas = fabricRef.current;
    const activeObject = canvas.getActiveObject();

    if (!activeObject || activeObject.type !== "Image") {
      toast.error("Please select an image first");
      return;
    }

    const imageObj = activeObject as FabricImage;
    const element = imageObj.getElement() as HTMLImageElement;

    if (!element || !element.src) {
      toast.error("Could not get image source");
      return;
    }

    try {
      // Get the image as data URL for processing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = element.naturalWidth || element.width;
      tempCanvas.height = element.naturalHeight || element.height;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(element, 0, 0);
      const dataUrl = tempCanvas.toDataURL("image/png");

      // Remove background
      const resultDataUrl = await removeBackgroundFromImage(dataUrl);

      if (!resultDataUrl) {
        toast.error("Failed to remove background");
        return;
      }

      // Load the new image and replace the old one
      const newImage = await FabricImage.fromURL(resultDataUrl, {
        crossOrigin: "anonymous",
      });

      // Preserve the original transformations
      newImage.set({
        left: imageObj.left,
        top: imageObj.top,
        scaleX: imageObj.scaleX,
        scaleY: imageObj.scaleY,
        angle: imageObj.angle,
        flipX: imageObj.flipX,
        flipY: imageObj.flipY,
        originX: imageObj.originX,
        originY: imageObj.originY,
      });

      // Remove old image and add new one
      canvas.remove(imageObj);
      canvas.add(newImage);
      canvas.setActiveObject(newImage);
      canvas.renderAll();
      markDirty();

      toast.success("Background removed successfully");
    } catch (error) {
      console.error("Background removal error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove background"
      );
    }
  }, [isRemovingBackground, removeBackgroundFromImage, markDirty]);

  // Helper function to detect device frame group on canvas and return mockup or bezel
  const detectDeviceFrameOnCanvas = useCallback((canvas: Canvas): { mockup: DeviceMockup | null; bezel: BezelConfig | null } => {
    const objects = canvas.getObjects();

    for (const obj of objects) {
      if (obj.type === "Group") {
        const group = obj as Group & { bezelId?: string; deviceMockupId?: string };
        const groupObjects = group.getObjects();
        const hasImage = groupObjects.some((o) => o.type === "Image");

        if (hasImage && group.bezelId) {
          // Found a bezel frame group
          deviceFrameRef.current = group;
          const bezel = getBezelById(group.bezelId);
          return { mockup: null, bezel: bezel || null };
        } else if (hasImage && group.deviceMockupId) {
          // Found a device frame group with stored mockup ID
          deviceFrameRef.current = group;
          return { mockup: getDeviceMockup(group.deviceMockupId), bezel: null };
        } else if (hasImage) {
          // Found a device frame group but no stored ID - use default
          deviceFrameRef.current = group;
          return { mockup: getDeviceMockup("generic"), bezel: null };
        }
      }
    }

    return { mockup: null, bezel: null };
  }, []);

  // Helper function to remove device frame from a canvas and restore the image
  const removeDeviceFrameFromCanvas = useCallback((canvas: Canvas): boolean => {
    // Find any group that contains an image (device frame group)
    const objects = canvas.getObjects();
    let frameRemoved = false;

    for (const obj of objects) {
      if (obj.type === "Group") {
        const group = obj as Group;
        const groupObjects = group.getObjects();
        const imageInGroup = groupObjects.find((o) => o.type === "Image") as FabricImage | undefined;

        if (imageInGroup) {
          const groupCenter = group.getCenterPoint();
          const groupAngle = group.angle || 0;

          // Create a new standalone image at the correct position with rotation
          const restoredImage = new FabricImage(imageInGroup.getElement(), {
            left: groupCenter.x,
            top: groupCenter.y,
            scaleX: imageInGroup.scaleX,
            scaleY: imageInGroup.scaleY,
            originX: "center",
            originY: "center",
            angle: groupAngle, // Preserve the group's rotation
          });

          // Remove the group and add the restored image
          canvas.remove(group);
          canvas.add(restoredImage);
          frameRemoved = true;
          break; // Only process one group
        }
      }
    }

    return frameRemoved;
  }, []);

  // Remove device frame from current canvas and all previews
  const removeDeviceFrame = useCallback(async () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Remove from current canvas
    const removed = removeDeviceFrameFromCanvas(canvas);

    if (removed) {
      // Set active object to the restored image
      const images = canvas.getObjects().filter((obj) => obj.type === "Image");
      if (images.length > 0) {
        canvas.setActiveObject(images[0]);
      }
    }

    deviceFrameRef.current = null;

    // Save current canvas state
    const currentCanvasJson = canvas.toJSON();

    // Remove from all other previews
    const updatedPreviews = await Promise.all(
      previews.map(async (preview) => {
        if (preview.id === activePreview?.id) {
          // Current preview - already updated
          return {
            ...preview,
            canvasJson: currentCanvasJson,
          };
        }

        // For other previews, load their canvas, remove frame, and save
        if (preview.canvasJson) {
          const offscreenEl = document.createElement("canvas");
          offscreenEl.width = canvasWidth;
          offscreenEl.height = canvasHeight;
          const tempCanvas = new Canvas(offscreenEl, {
            width: canvasWidth,
            height: canvasHeight,
          });

          try {
            await tempCanvas.loadFromJSON(preview.canvasJson);
            const wasRemoved = removeDeviceFrameFromCanvas(tempCanvas);

            if (wasRemoved) {
              const updatedJson = tempCanvas.toJSON();
              tempCanvas.dispose();
              return {
                ...preview,
                canvasJson: updatedJson,
              };
            }
          } catch (error) {
            console.error(`Failed to remove frame from preview ${preview.id}:`, error);
          }

          tempCanvas.dispose();
        }

        return preview;
      })
    );

    setPreviews(updatedPreviews);
    setCurrentMockup(null);
    setCurrentBezel(null);
    canvas.renderAll();
    markAllDirty();
  }, [markAllDirty, removeDeviceFrameFromCanvas, previews, activePreview, canvasWidth, canvasHeight]);

  // Apply SVG bezel to the current canvas
  const applyBezelToCanvas = useCallback(async (canvas: Canvas, bezel: BezelConfig): Promise<Group | null> => {
    const objects = canvas.getObjects();
    let image: FabricImage | null = null;
    let existingGroup: Group | null = null;

    // Helper to check type (handles both v5 lowercase and v6+ uppercase)
    const isGroup = (obj: { type?: string }) => obj.type === "Group" || obj.type === "group";
    const isImage = (obj: { type?: string }) => obj.type === "Image" || obj.type === "image";

    // First, check for existing device frame group (contains an image)
    for (const obj of objects) {
      if (isGroup(obj)) {
        const group = obj as Group;
        const groupObjects = group.getObjects();
        const imageInGroup = groupObjects.find((o) => isImage(o)) as FabricImage | undefined;

        if (imageInGroup) {
          existingGroup = group;
          // Extract image from group
          const groupCenter = group.getCenterPoint();
          const groupAngle = group.angle || 0;
          const groupScaleX = group.scaleX || 1;
          const groupScaleY = group.scaleY || 1;

          // Create standalone image with group transforms
          image = new FabricImage(imageInGroup.getElement(), {
            scaleX: (imageInGroup.scaleX || 1) * groupScaleX,
            scaleY: (imageInGroup.scaleY || 1) * groupScaleY,
            originX: "center",
            originY: "center",
            left: groupCenter.x,
            top: groupCenter.y,
            angle: groupAngle,
          });

          // Remove the existing group
          canvas.remove(group);
          break;
        }
      }
    }

    // If no group found, look for standalone image
    if (!image) {
      for (const obj of objects) {
        if (isImage(obj)) {
          image = obj as FabricImage;
          break;
        }
      }
    }

    if (!image) return null;

    // Create the device frame group with bezel
    const deviceGroup = await createDeviceFrameWithBezel(image, bezel);

    // Remove original standalone image (if not from group) and add the group
    if (!existingGroup) {
      canvas.remove(image);
    }
    canvas.add(deviceGroup);

    return deviceGroup;
  }, [createDeviceFrameWithBezel]);

  // Apply SVG bezel to all previews
  const applyBezel = useCallback(async (bezel: BezelConfig) => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Apply to current canvas
    const currentGroup = await applyBezelToCanvas(canvas, bezel);

    if (!currentGroup) {
      toast.error("Add a screenshot first to add a device frame");
      return;
    }

    canvas.setActiveObject(currentGroup);
    deviceFrameRef.current = currentGroup;

    // Save current canvas state
    const currentCanvasJson = canvas.toJSON();

    // Apply to all other previews
    const updatedPreviews = await Promise.all(
      previews.map(async (preview) => {
        if (preview.id === activePreview?.id) {
          return {
            ...preview,
            canvasJson: currentCanvasJson,
          };
        }

        // For other previews, load their canvas, apply bezel, and save
        if (preview.canvasJson) {
          const offscreenEl = document.createElement("canvas");
          offscreenEl.width = canvasWidth;
          offscreenEl.height = canvasHeight;
          const tempCanvas = new Canvas(offscreenEl, {
            width: canvasWidth,
            height: canvasHeight,
          });

          try {
            await tempCanvas.loadFromJSON(preview.canvasJson);
            const group = await applyBezelToCanvas(tempCanvas, bezel);

            if (group) {
              const updatedJson = tempCanvas.toJSON();
              tempCanvas.dispose();
              return {
                ...preview,
                canvasJson: updatedJson,
              };
            }
          } catch (error) {
            console.error("Error applying bezel to preview:", error);
          }
          tempCanvas.dispose();
        }

        return preview;
      })
    );

    setPreviews(updatedPreviews);
    setCurrentBezel(bezel);
    setCurrentMockup(null); // Clear programmatic mockup when using bezel
    canvas.renderAll();
    toast.success("Device bezel applied to all previews");
  }, [applyBezelToCanvas, previews, activePreview, canvasWidth, canvasHeight]);

  // Apply device mockup to the current canvas
  const applyDeviceMockupToCanvas = useCallback((canvas: Canvas, mockup: DeviceMockup): Group | null => {
    const objects = canvas.getObjects();
    let image: FabricImage | null = null;
    let existingGroup: Group | null = null;

    // Helper to check type (handles both v5 lowercase and v6+ uppercase)
    const isGroup = (obj: { type?: string }) => obj.type === "Group" || obj.type === "group";
    const isImage = (obj: { type?: string }) => obj.type === "Image" || obj.type === "image";

    // First, check for existing device frame group (contains an image)
    for (const obj of objects) {
      if (isGroup(obj)) {
        const group = obj as Group;
        const groupObjects = group.getObjects();
        const imageInGroup = groupObjects.find((o) => isImage(o)) as FabricImage | undefined;

        if (imageInGroup) {
          existingGroup = group;
          // Extract image from group - get its position and rotation
          const groupCenter = group.getCenterPoint();
          const groupAngle = group.angle || 0;

          // Create a standalone image from the group's image
          image = new FabricImage(imageInGroup.getElement(), {
            left: groupCenter.x,
            top: groupCenter.y,
            scaleX: imageInGroup.scaleX,
            scaleY: imageInGroup.scaleY,
            originX: "center",
            originY: "center",
            angle: groupAngle,
          });
          break;
        }
      } else if (isImage(obj)) {
        image = obj as FabricImage;
        break;
      }
    }

    if (!image) {
      return null;
    }

    // Remove existing group if any
    if (existingGroup) {
      canvas.remove(existingGroup);
    }

    // Force coordinate recalculation
    canvas.renderAll();
    image.setCoords();

    // Create the device frame group
    const deviceGroup = createDeviceFrameGroup(image, mockup);

    // Remove original standalone image (if not from group) and add the group
    if (!existingGroup) {
      canvas.remove(image);
    }
    canvas.add(deviceGroup);

    return deviceGroup;
  }, [createDeviceFrameGroup]);

  // Apply device mockup to all previews
  const applyDeviceMockup = useCallback(async (mockup: DeviceMockup) => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    // Apply to current canvas (handles existing frame removal internally)
    const currentGroup = applyDeviceMockupToCanvas(canvas, mockup);

    if (!currentGroup) {
      toast.error("Add a screenshot first to add a device frame");
      return;
    }

    canvas.setActiveObject(currentGroup);
    deviceFrameRef.current = currentGroup;

    // Save current canvas state
    const currentCanvasJson = canvas.toJSON();

    // Apply to all other previews
    const updatedPreviews = await Promise.all(
      previews.map(async (preview) => {
        if (preview.id === activePreview?.id) {
          // Current preview - already updated
          return {
            ...preview,
            canvasJson: currentCanvasJson,
          };
        }

        // For other previews, load their canvas, apply frame, and save
        if (preview.canvasJson) {
          // Create an offscreen canvas element
          const offscreenEl = document.createElement("canvas");
          offscreenEl.width = canvasWidth;
          offscreenEl.height = canvasHeight;
          const tempCanvas = new Canvas(offscreenEl, {
            width: canvasWidth,
            height: canvasHeight,
          });

          try {
            await tempCanvas.loadFromJSON(preview.canvasJson);
            const group = applyDeviceMockupToCanvas(tempCanvas, mockup);

            if (group) {
              const updatedJson = tempCanvas.toJSON();
              tempCanvas.dispose();
              return {
                ...preview,
                canvasJson: updatedJson,
              };
            }
          } catch (error) {
            console.error(`Failed to apply frame to preview ${preview.id}:`, error);
          }

          tempCanvas.dispose();
        }

        return preview;
      })
    );

    setPreviews(updatedPreviews);
    setCurrentMockup(mockup);
    setCurrentBezel(null); // Clear bezel when applying programmatic mockup
    canvas.renderAll();
    markAllDirty();
    toast.success(`${mockup.name} frame applied to all previews`);
  }, [markAllDirty, applyDeviceMockupToCanvas, previews, activePreview, canvasWidth, canvasHeight]);

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
      initHistory(canvas, template.background);

      toast.success(`Applied "${template.name}" template`);
    },
    [applyBackground, markDirty, initHistory]
  );

  // Apply template set - creates multiple previews with coordinated templates
  const handleApplyTemplateSet = useCallback(
    async (templateSet: TemplateSet) => {
      if (!fabricRef.current) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Create previews for each template in the set
      const newPreviews: Preview[] = [];

      for (let i = 0; i < templateSet.templates.length; i++) {
        const template = templateSet.templates[i];

        // Create preview in database
        const { data, error } = await supabase
          .from("previews")
          .insert({
            project_id: project.id,
            user_id: user.id,
            name: template.name,
            sort_order: i,
            canvas_json: template.canvasJson,
            background: template.background,
          })
          .select()
          .single();

        if (error) {
          toast.error(`Failed to create preview: ${error.message}`);
          return;
        }

        newPreviews.push({
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
        });
      }

      // Delete existing previews first (to replace)
      if (previews.length > 0) {
        await Promise.all(
          previews.map((p) =>
            supabase.from("previews").delete().eq("id", p.id)
          )
        );
      }

      // Update local state with new previews
      setPreviews(newPreviews);

      // Load the first preview
      if (newPreviews.length > 0) {
        const firstPreview = newPreviews[0];
        setActivePreview(firstPreview);

        const canvas = fabricRef.current;
        canvas.clear();

        if (firstPreview.canvasJson) {
          await canvas.loadFromJSON(firstPreview.canvasJson);
        }

        const newBg = firstPreview.background || "#0a0a0a";
        applyBackground(canvas, newBg);
        setBackground(newBg);

        const objects = canvas.getObjects();
        setHasScreenshot(objects.length > 0);

        canvas.renderAll();
        initHistory(canvas, newBg);
      }

      // Clear dirty state since we just created fresh
      setDirtyPreviewIds(new Set());

      toast.success(`Created ${templateSet.previewCount} previews from "${templateSet.name}"`);
    },
    [project.id, previews, applyBackground, initHistory]
  );

  // Undo handler
  const handleUndo = useCallback(async () => {
    if (!fabricRef.current || !canUndo) return;
    const restoredBackground = await undo(fabricRef.current);
    if (restoredBackground) {
      // Apply background visually and update state
      applyBackground(fabricRef.current, restoredBackground);
      setBackground(restoredBackground);
    }
  }, [undo, canUndo, applyBackground]);

  // Redo handler
  const handleRedo = useCallback(async () => {
    if (!fabricRef.current || !canRedo) return;
    const restoredBackground = await redo(fabricRef.current);
    if (restoredBackground) {
      // Apply background visually and update state
      applyBackground(fabricRef.current, restoredBackground);
      setBackground(restoredBackground);
    }
  }, [redo, canRedo, applyBackground]);

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
        if (obj.type === "Image" && typeof obj.src === "string" && obj.src.startsWith("data:")) {
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
      const hasObjects = objects.length > 0;
      setHasScreenshot(hasObjects);

      // Detect existing device frame and restore state
      if (hasObjects) {
        const { mockup, bezel } = detectDeviceFrameOnCanvas(canvas);
        if (bezel) {
          setCurrentBezel(bezel);
          setCurrentMockup(null);
        } else if (mockup) {
          setCurrentMockup(mockup);
          setCurrentBezel(null);
        } else {
          setCurrentMockup(null);
          setCurrentBezel(null);
        }
      } else {
        setCurrentMockup(null);
        setCurrentBezel(null);
        deviceFrameRef.current = null;
      }

      canvas.renderAll();
      initHistory(canvas, newBg);

      isLoadingPreviewRef.current = false;
    },
    [activePreview, background, initHistory, applyBackground, detectDeviceFrameOnCanvas]
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
        {/* Editor header - simplified with right panel toggle */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-2 md:px-4">
          {/* Left side - back + project name */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to projects</span>
              </Link>
            </Button>
            <div className="ml-1 md:ml-2">
              <h1 className="text-sm font-semibold truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">{project.name}</h1>
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

          {/* Right side - controls */}
          <div className="flex items-center gap-1">
            {/* Undo/Redo */}
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
              <TooltipContent>Undo (⌘Z)</TooltipContent>
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
              <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />

            {/* Zoom controls - hidden on small mobile */}
            <div className="hidden sm:flex items-center">
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
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Clear canvas */}
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
              <TooltipContent>Clear canvas</TooltipContent>
            </Tooltip>

            {/* Save */}
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
                  : "Save (⌘S)"}
              </TooltipContent>
            </Tooltip>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasScreenshot && previews.length === 0}
                  className="gap-1 px-2"
                >
                  <Download className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsExportOpen(true)}
                  disabled={!hasScreenshot}
                >
                  <Download className="h-4 w-4" />
                  Export Current Preview
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsBatchExportOpen(true)}
                  disabled={previews.length === 0}
                >
                  <Package className="h-4 w-4" />
                  Batch Export All ({previews.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="mx-1 h-6 hidden lg:block" />

            {/* Mobile menu for zoom and other options */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-sm text-muted-foreground">Zoom</span>
                    <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                  </div>
                  <DropdownMenuItem onClick={handleZoomIn} disabled={zoom >= ZOOM_MAX}>
                    <ZoomIn className="h-4 w-4" />
                    Zoom In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleZoomOut} disabled={zoom <= ZOOM_MIN}>
                    <ZoomOut className="h-4 w-4" />
                    Zoom Out
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFitToScreen}>
                    <Maximize className="h-4 w-4" />
                    Fit to Screen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right panel toggle - desktop only */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showRightPanel ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  className="hidden lg:flex"
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showRightPanel ? "Hide panel" : "Show panel"}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main content area with canvas and right panel */}
        <div className="flex flex-1 overflow-hidden">
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

          {/* Right Panel - desktop only */}
          {showRightPanel && (
            <RightPanel
              deviceType={project.deviceType as "iphone" | "android"}
              selectedDevice={selectedDevice}
              devices={allDevices}
              onDeviceChange={handleDeviceChange}
              background={background}
              onBackgroundChange={setBackground}
              onAddText={handleAddText}
              selectedTextStyle={selectedTextStyle}
              onTextStyleChange={handleTextStyleChange}
              onUploadScreenshot={() => fileInputRef.current?.click()}
              hasSelectedImage={hasSelectedImage}
              onRemoveBackground={handleRemoveBackground}
              isRemovingBackground={isRemovingBackground}
              backgroundRemovalProgress={backgroundRemovalProgress}
              onApplyTemplate={handleApplyTemplate}
              currentDeviceMockup={currentMockup}
              onApplyDeviceFrame={applyDeviceMockup}
              onRemoveDeviceFrame={removeDeviceFrame}
              hasScreenshot={hasScreenshot}
              currentBezel={currentBezel}
              onApplyBezel={applyBezel}
            />
          )}
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

        {/* Batch export dialog */}
        <BatchExportDialog
          open={isBatchExportOpen}
          onOpenChange={setIsBatchExportOpen}
          projectName={project.name}
          previews={previews}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          deviceType={project.deviceType as "iphone" | "android"}
        />
      </div>
    </TooltipProvider>
  );
}
