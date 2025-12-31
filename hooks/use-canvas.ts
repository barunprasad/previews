"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Canvas, FabricImage, Rect, FabricObject } from "fabric";
import type { DeviceFrame } from "@/types";

interface UseCanvasOptions {
  device: DeviceFrame;
  backgroundColor?: string;
}

export function useCanvas({ device, backgroundColor = "#f5f5f5" }: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [screenshot, setScreenshot] = useState<FabricImage | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: device.width,
      height: device.height,
      backgroundColor,
      preserveObjectStacking: true,
      selection: true,
    });

    fabricRef.current = canvas;
    setIsReady(true);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      setIsReady(false);
    };
  }, []);

  // Update canvas size when device changes
  useEffect(() => {
    if (!fabricRef.current) return;

    fabricRef.current.setDimensions({
      width: device.width,
      height: device.height,
    });
    fabricRef.current.renderAll();
  }, [device.width, device.height]);

  // Add screenshot to canvas
  const addScreenshot = useCallback(
    async (url: string) => {
      if (!fabricRef.current) return;

      // Remove existing screenshot
      if (screenshot) {
        fabricRef.current.remove(screenshot);
        setScreenshot(null);
      }

      try {
        const img = await FabricImage.fromURL(url, {
          crossOrigin: "anonymous",
        });

        // Scale to fit the screen area
        const scaleX = device.screenWidth / img.width!;
        const scaleY = device.screenHeight / img.height!;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          left: device.screenX + device.screenWidth / 2,
          top: device.screenY + device.screenHeight / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
        });

        // Create clipping mask for the screen area
        img.clipPath = new Rect({
          left: device.screenX,
          top: device.screenY,
          width: device.screenWidth,
          height: device.screenHeight,
          absolutePositioned: true,
        });

        fabricRef.current.add(img);
        fabricRef.current.setActiveObject(img);
        fabricRef.current.renderAll();
        setScreenshot(img);
      } catch (error) {
        console.error("Error loading screenshot:", error);
      }
    },
    [device, screenshot]
  );

  // Add device frame overlay
  const addDeviceFrame = useCallback(
    async (svgPath: string) => {
      if (!fabricRef.current) return;

      try {
        const frame = await FabricImage.fromURL(svgPath, {
          crossOrigin: "anonymous",
        });

        frame.set({
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
        });

        fabricRef.current.add(frame);
        fabricRef.current.bringObjectToFront(frame);
        fabricRef.current.renderAll();
      } catch (error) {
        console.error("Error loading device frame:", error);
      }
    },
    []
  );

  // Export canvas as PNG
  const exportCanvas = useCallback(
    (width: number, height: number): string | null => {
      if (!fabricRef.current) return null;

      const multiplier = width / fabricRef.current.width!;

      return fabricRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier,
      });
    },
    []
  );

  // Get canvas JSON for saving
  const getCanvasJson = useCallback(() => {
    if (!fabricRef.current) return null;
    return fabricRef.current.toJSON();
  }, []);

  // Load canvas from JSON
  const loadCanvasJson = useCallback(async (json: object) => {
    if (!fabricRef.current) return;

    await fabricRef.current.loadFromJSON(json);
    fabricRef.current.renderAll();
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = backgroundColor;
    fabricRef.current.renderAll();
    setScreenshot(null);
  }, [backgroundColor]);

  return {
    canvasRef,
    fabricRef,
    isReady,
    screenshot,
    addScreenshot,
    addDeviceFrame,
    exportCanvas,
    getCanvasJson,
    loadCanvasJson,
    clearCanvas,
  };
}
