"use client";

import { useRef } from "react";
import {
  ImagePlus,
  Download,
  Trash2,
  RotateCcw,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onUpload: (file: File) => void;
  onExport: () => void;
  onClear: () => void;
  onSave: () => void;
  isSaving?: boolean;
  hasScreenshot: boolean;
}

export function Toolbar({
  onUpload,
  onExport,
  onClear,
  onSave,
  isSaving = false,
  hasScreenshot,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              <span className="sr-only">Upload screenshot</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upload screenshot</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              disabled={!hasScreenshot}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear canvas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear canvas</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="sr-only">Save project</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onExport}
              disabled={!hasScreenshot}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export PNG</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
