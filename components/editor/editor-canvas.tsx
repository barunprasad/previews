"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useCanvas } from "@/hooks/use-canvas";
import type { DeviceFrame } from "@/types";
import { cn } from "@/lib/utils";

interface EditorCanvasProps {
  device: DeviceFrame;
  onScreenshotAdd: (url: string) => void;
  className?: string;
}

export function EditorCanvas({
  device,
  onScreenshotAdd,
  className,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { canvasRef, isReady } = useCanvas({ device });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        onScreenshotAdd(url);
      }
    },
    [onScreenshotAdd]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center overflow-auto rounded-lg border bg-muted/50 p-8",
        isDragging && "ring-2 ring-primary ring-offset-2",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Canvas container with drop zone */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-lg"
          style={{
            maxWidth: "100%",
            maxHeight: "calc(100vh - 200px)",
          }}
        />

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-primary">
              <Upload className="h-8 w-8" />
              <p className="text-sm font-medium">Drop screenshot here</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
