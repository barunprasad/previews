"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Preview, DeviceFrame } from "@/types";

interface AppStorePreviewProps {
  previews: Preview[];
  activePreviewId: string | null;
  selectedDevice: DeviceFrame;
  onPreviewSelect: (preview: Preview) => void;
  onClose: () => void;
}

export function AppStorePreview({
  previews,
  activePreviewId,
  selectedDevice,
  onPreviewSelect,
  onClose,
}: AppStorePreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Calculate aspect ratio from device dimensions
  const aspectRatio = selectedDevice.height / selectedDevice.width;

  // Preview card dimensions (height-based for phone screenshots)
  const previewHeight = 400; // Fixed height for consistency
  const previewWidth = previewHeight / aspectRatio;

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons);
      }
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [checkScrollButtons, previews]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = previewWidth + 24; // card width + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-white/70" />
          <div>
            <h2 className="text-lg font-semibold text-white">App Store Preview</h2>
            <p className="text-sm text-white/50">
              {previews.length} screenshots - {selectedDevice.name}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Preview carousel */}
      <div className="relative flex flex-1 items-center justify-center px-16">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-4 z-10 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto px-4 py-8 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {previews.map((preview, index) => {
            const isActive = preview.id === activePreviewId;

            return (
              <button
                key={preview.id}
                onClick={() => {
                  onPreviewSelect(preview);
                  onClose();
                }}
                className={cn(
                  "group relative shrink-0 overflow-hidden rounded-2xl transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                  isActive
                    ? "ring-2 ring-white scale-105"
                    : "hover:scale-[1.02] hover:ring-2 hover:ring-white/30"
                )}
                style={{
                  width: previewWidth,
                  height: previewHeight,
                  scrollSnapAlign: "center",
                }}
              >
                {/* Preview content */}
                {preview.thumbnailUrl ? (
                  <img
                    src={preview.thumbnailUrl}
                    alt={preview.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      background: preview.background || "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    }}
                  >
                    <span className="text-white/30 text-sm">No content</span>
                  </div>
                )}

                {/* Preview number badge */}
                <div className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm font-semibold text-white backdrop-blur-sm">
                  {index + 1}
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-3 right-3 rounded-full bg-white px-2 py-1 text-xs font-medium text-black">
                    Current
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-4 z-10 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Footer hint */}
      <div className="border-t border-white/10 px-6 py-3 text-center">
        <p className="text-sm text-white/40">
          Click a preview to edit it. Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">Esc</kbd> to close.
        </p>
      </div>
    </div>
  );
}
