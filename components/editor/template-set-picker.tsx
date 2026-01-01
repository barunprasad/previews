"use client";

import { useState } from "react";
import { LayoutTemplate, Check, Layers, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  templateSets,
  templateSetCategories,
  templates,
  templateCategories,
} from "@/lib/templates";
import type { TemplateSet, PreviewTemplate, TemplateSetCategory } from "@/types";

interface TemplateSetPickerProps {
  onSelectTemplate: (template: PreviewTemplate) => void;
  onSelectTemplateSet: (templateSet: TemplateSet) => void;
  currentDeviceType?: "iphone" | "android";
  currentPreviewCount?: number;
}

export function TemplateSetPicker({
  onSelectTemplate,
  onSelectTemplateSet,
  currentDeviceType,
  currentPreviewCount = 1,
}: TemplateSetPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TemplateSetCategory | "all">("all");
  const [selectedSet, setSelectedSet] = useState<TemplateSet | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Filter template sets by category and device type
  const filteredSets = templateSets.filter((set) => {
    const categoryMatch = selectedCategory === "all" || set.category === selectedCategory;
    const deviceMatch = !currentDeviceType ||
      set.deviceType === "both" ||
      set.deviceType === currentDeviceType;
    return categoryMatch && deviceMatch;
  });

  // Filter single templates
  const [singleCategory, setSingleCategory] = useState<string>("all");
  const filteredTemplates = templates.filter((template) => {
    const categoryMatch = singleCategory === "all" || template.category === singleCategory;
    const deviceMatch = !currentDeviceType ||
      template.deviceType === "both" ||
      template.deviceType === currentDeviceType;
    return categoryMatch && deviceMatch;
  });

  const handleApplySet = () => {
    if (selectedSet) {
      onSelectTemplateSet(selectedSet);
      setOpen(false);
      setSelectedSet(null);
      setPreviewMode(false);
    }
  };

  const handleApplySingle = (template: PreviewTemplate) => {
    onSelectTemplate(template);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a template set for multiple coordinated previews, or a single template.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sets" className="gap-2">
              <Layers className="h-4 w-4" />
              Template Sets
            </TabsTrigger>
            <TabsTrigger value="single" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Single Templates
            </TabsTrigger>
          </TabsList>

          {/* Template Sets Tab */}
          <TabsContent value="sets" className="mt-4">
            {!previewMode ? (
              <>
                {/* Category Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Sets
                  </button>
                  {templateSetCategories.map((category) => (
                    <button
                      key={category.id}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Template Sets Grid */}
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-2 gap-4 pr-4">
                    {filteredSets.map((set) => (
                      <button
                        key={set.id}
                        className={cn(
                          "relative flex flex-col rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md",
                          selectedSet?.id === set.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border"
                        )}
                        onClick={() => {
                          setSelectedSet(set);
                          setPreviewMode(true);
                        }}
                      >
                        {/* Preview thumbnails grid */}
                        <div className="flex gap-1 mb-3">
                          {set.templates.slice(0, 5).map((template, idx) => (
                            <div
                              key={idx}
                              className="flex-1 aspect-[9/16] rounded-md overflow-hidden"
                              style={{ background: template.background }}
                            >
                              <div className="w-full h-full flex items-center justify-center">
                                <div
                                  className="w-1/2 h-1/2 rounded bg-white/20"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Set info */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm">{set.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {set.description}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">
                            {set.previewCount} previews
                          </Badge>
                        </div>

                        {/* Arrow indicator */}
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              /* Preview Mode - Show selected set details */
              selectedSet && (
                <div className="space-y-4">
                  {/* Back button and title */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode(false)}
                    >
                      ← Back
                    </Button>
                    <div>
                      <h3 className="font-semibold">{selectedSet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSet.previewCount} coordinated previews
                      </p>
                    </div>
                  </div>

                  {/* Preview carousel */}
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4">
                      {selectedSet.templates.map((template, idx) => (
                        <div
                          key={template.id}
                          className="shrink-0 w-48 space-y-2"
                        >
                          <div
                            className="aspect-[9/16] rounded-lg overflow-hidden border shadow-sm"
                            style={{ background: template.background }}
                          >
                            {/* Simplified preview of template */}
                            <div className="w-full h-full flex flex-col items-center justify-start p-4">
                              <div className="w-3/4 h-3 rounded bg-white/30 mb-2" />
                              <div className="w-1/2 h-2 rounded bg-white/20 mb-4" />
                              <div className="w-2/3 h-1/2 rounded-lg bg-white/10 border border-white/20" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium">{idx + 1}. {template.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Warning if will replace existing */}
                  {currentPreviewCount > 1 && (
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-600">
                      This will create {selectedSet.previewCount} new previews. Your existing {currentPreviewCount} preview(s) will be replaced.
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" onClick={() => setPreviewMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApplySet}>
                      Apply {selectedSet.previewCount} Previews
                    </Button>
                  </div>
                </div>
              )
            )}
          </TabsContent>

          {/* Single Templates Tab */}
          <TabsContent value="single" className="mt-4">
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                  singleCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSingleCategory("all")}
              >
                All
              </button>
              {templateCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                    singleCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setSingleCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Single Templates Grid */}
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-3 gap-4 pr-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:border-primary/50"
                    onClick={() => handleApplySingle(template)}
                  >
                    {/* Template Preview */}
                    <div
                      className="w-full aspect-[9/16] rounded-md border overflow-hidden"
                      style={{ background: template.background }}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-2">
                        {(template.canvasJson.objects as Array<Record<string, unknown>> | undefined)?.slice(0, 2).map((obj, idx) => (
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
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
