"use client";

import { useEffect, useRef, useState } from "react";
import { StaticCanvas } from "fabric";
import { Loader2 } from "lucide-react";
import type { PreviewTemplate } from "@/types";

// Canvas dimensions from templates
const CANVAS_WIDTH = 1290;
const CANVAS_HEIGHT = 2796;

interface TemplateCanvasPreviewProps {
  template: PreviewTemplate;
  width?: number;
}

export function TemplateCanvasPreview({ template, width = 192 }: TemplateCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Calculate height based on aspect ratio
  const height = (width * CANVAS_HEIGHT) / CANVAS_WIDTH;
  const scale = width / CANVAS_WIDTH;

  useEffect(() => {
    if (!containerRef.current) return;

    let canvas: StaticCanvas | null = null;
    let mounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // Create a fresh canvas element
        const canvasEl = document.createElement("canvas");
        canvasEl.width = CANVAS_WIDTH;
        canvasEl.height = CANVAS_HEIGHT;

        // Clear container and append new canvas
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(canvasEl);
        }

        // Create Fabric canvas
        canvas = new StaticCanvas(canvasEl, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: "transparent",
          renderOnAddRemove: false,
        });

        // Load template JSON
        const canvasData = JSON.parse(JSON.stringify(template.canvasJson));
        await canvas.loadFromJSON(canvasData);

        if (!mounted) return;

        // Check for images and wait for them to load
        const objects = canvas.getObjects();
        const hasImages = objects.some(
          (obj) => obj.type === "Image" || obj.type === "image" || obj.type === "Group"
        );

        if (hasImages) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        if (!mounted) return;

        canvas.renderAll();
        setIsLoading(false);
      } catch (err) {
        if (mounted) {
          console.error("Error loading template:", err);
          setError(true);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (canvas) {
        try {
          canvas.dispose();
        } catch {
          // Ignore disposal errors
        }
        canvas = null;
      }
    };
  }, [template.id, template.canvasJson]);

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: template.background,
      }}
    >
      {/* Canvas container with scaling */}
      <div
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <p className="text-xs text-white/70">Preview unavailable</p>
        </div>
      )}
    </div>
  );
}
