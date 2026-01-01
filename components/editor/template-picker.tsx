"use client";

import { useState } from "react";
import { LayoutTemplate, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { templates, templateCategories } from "@/lib/templates";
import type { PreviewTemplate, TemplateCategory } from "@/types";

interface TemplatePickerProps {
  onSelectTemplate: (template: PreviewTemplate) => void;
  currentDeviceType?: "iphone" | "android";
}

export function TemplatePicker({
  onSelectTemplate,
  currentDeviceType,
}: TemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<PreviewTemplate | null>(null);

  // Filter templates by category and device type
  const filteredTemplates = templates.filter((template) => {
    const categoryMatch = selectedCategory === "all" || template.category === selectedCategory;
    const deviceMatch = !currentDeviceType ||
      template.deviceType === "both" ||
      template.deviceType === currentDeviceType;
    return categoryMatch && deviceMatch;
  });

  const handleApply = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setOpen(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template to apply to your preview. You can customize it after applying.
          </DialogDescription>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <button
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          {templateCategories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto py-2">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:border-primary/50",
                selectedTemplate?.id === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Template Preview */}
              <div
                className="w-full aspect-[9/16] rounded-md border overflow-hidden"
                style={{ background: template.background }}
              >
                {/* Simple preview of template content */}
                <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-2">
                  {(template.canvasJson.objects as Record<string, unknown>[] | undefined)?.slice(0, 2).map((obj, idx) => (
                    <div
                      key={idx}
                      className="text-center truncate w-full"
                      style={{
                        fontSize: `${Math.min((obj.fontSize as number || 24) / 6, 12)}px`,
                        fontWeight: obj.fontWeight as string || "normal",
                        color: obj.fill as string || "#fff",
                      }}
                    >
                      {obj.text as string || ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Info */}
              <div className="text-center">
                <p className="text-sm font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>

              {/* Selected Indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!selectedTemplate}>
            Apply Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
