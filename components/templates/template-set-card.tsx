"use client";

import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TemplateSet, PreviewTemplate } from "@/types";

// Canvas dimensions for scaling
const CANVAS_WIDTH = 440;

// Mini preview renderer for template cards
function MiniTemplatePreview({ template, cardWidth }: { template: PreviewTemplate; cardWidth: number }) {
  const objects = (template.canvasJson.objects || []) as Array<{
    type: string;
    text?: string;
    fontSize?: number;
    fontWeight?: string;
    fill?: string;
    left?: number;
    top?: number;
    width?: number;
    originX?: string;
    originY?: string;
    textAlign?: string;
    angle?: number;
    scaleX?: number;
    scaleY?: number;
  }>;

  // Scale factor (card width ~80px vs canvas 440px)
  const scale = cardWidth / CANVAS_WIDTH;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {objects.slice(0, 4).map((obj, idx) => {
        if ((obj.type === "Textbox" || obj.type === "textbox") && obj.text) {
          let left = (obj.left || 0) * scale;
          const top = (obj.top || 0) * scale;
          const width = (obj.width || 200) * scale;
          const fontSize = Math.max(4, (obj.fontSize || 16) * scale * 0.85);

          if (obj.originX === "center") {
            left = left - width / 2;
          }

          // Only show first line of text for mini preview
          const shortText = obj.text.split("\n")[0].slice(0, 20);

          return (
            <div
              key={idx}
              className="absolute truncate leading-tight"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                fontSize: `${fontSize}px`,
                fontWeight: obj.fontWeight || "400",
                color: obj.fill || "#ffffff",
                textAlign: (obj.textAlign as "left" | "center" | "right") || "left",
                lineHeight: 1.1,
              }}
            >
              {shortText}
            </div>
          );
        }

        if (obj.type === "Image" || obj.type === "image") {
          let left = (obj.left || 0) * scale;
          let top = (obj.top || 0) * scale;
          const imgScale = obj.scaleX || 0.5;
          const width = 180 * imgScale * scale;
          const height = 320 * imgScale * scale;
          const angle = obj.angle || 0;

          if (obj.originX === "center") {
            left = left - width / 2;
          }
          if (obj.originY === "center") {
            top = top - height / 2;
          }

          return (
            <div
              key={idx}
              className="absolute flex items-center justify-center rounded border border-white/20 bg-white/10"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: angle ? `rotate(${angle}deg)` : undefined,
              }}
            >
              <ImageIcon className="h-3 w-3 text-white/30" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

interface TemplateSetCardProps {
  templateSet: TemplateSet;
  onClick: () => void;
}

export function TemplateSetCard({ templateSet, onClick }: TemplateSetCardProps) {
  // Get the first 5 templates for the angled preview
  const previewTemplates = templateSet.templates.slice(0, 5);

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border-2 bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.99]"
    >
      {/* Angled Device Mockups Preview */}
      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted">
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          {previewTemplates.map((template, idx) => {
            // Calculate positions for angled fan effect
            const totalTemplates = previewTemplates.length;
            const middleIndex = Math.floor(totalTemplates / 2);
            const offset = idx - middleIndex;

            return (
              <div
                key={template.id}
                className={cn(
                  "absolute w-20 overflow-hidden rounded-lg border shadow-lg transition-transform group-hover:scale-105",
                  idx === middleIndex && "z-10"
                )}
                style={{
                  height: idx === middleIndex ? "160px" : "140px",
                  background: template.background,
                  transform: `
                    translateX(${offset * 28}px)
                    rotate(${offset * 6}deg)
                    translateY(${Math.abs(offset) * 8}px)
                  `,
                  zIndex: totalTemplates - Math.abs(offset),
                }}
              >
                <MiniTemplatePreview template={template} cardWidth={80} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Set Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{templateSet.name}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {templateSet.previewCount} screens
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {templateSet.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {templateSet.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
    </button>
  );
}
