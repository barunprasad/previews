"use client";

import { templateSets as allTemplateSets } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { PreviewTemplate } from "@/types";

interface TemplatesSectionProps {
  deviceType: "iphone" | "android";
  onApplyTemplate: (template: PreviewTemplate) => void;
}

export function TemplatesSection({
  deviceType,
  onApplyTemplate,
}: TemplatesSectionProps) {
  // Get templates that match the current device type
  const templateSets = allTemplateSets.filter(
    (set) => set.deviceType === deviceType || set.deviceType === "both"
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Apply a template to the current preview. This will replace existing content.
      </p>

      <div className="space-y-3">
        {templateSets.map((set) => (
          <div key={set.id} className="space-y-2">
            <p className="text-xs font-medium">{set.name}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {set.templates.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => onApplyTemplate(template)}
                  className={cn(
                    "group relative aspect-[9/16] overflow-hidden rounded-md border transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1"
                  )}
                  title={template.name}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: template.background }}
                  />
                  {/* Simplified preview content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-start p-1 pt-2">
                    <div className="mb-0.5 h-1 w-3/4 rounded bg-white/30" />
                    <div className="mb-1 h-0.5 w-1/2 rounded bg-white/20" />
                    <div className="h-1/2 w-2/3 rounded border border-white/20 bg-white/10" />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-[8px] font-medium text-white">
                      {template.name.split(" ").slice(0, 2).join(" ")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {templateSets.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          No templates available for this device type
        </p>
      )}
    </div>
  );
}
