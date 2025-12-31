"use client";

import { useState } from "react";
import { Download, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { DeviceFrame } from "@/types";
import { cn } from "@/lib/utils";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DeviceFrame;
  onExport: (width: number, height: number, label: string) => void;
}

export function ExportDialog({
  open,
  onOpenChange,
  device,
  onExport,
}: ExportDialogProps) {
  const [selectedSize, setSelectedSize] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const size = device.exportSizes[selectedSize];
    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for UX
      onExport(size.width, size.height, size.label);
      onOpenChange(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Preview</DialogTitle>
          <DialogDescription>
            Choose an export size for your {device.name} preview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Export Size</Label>
          <div className="grid gap-2">
            {device.exportSizes.map((size, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedSize(index)}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 text-left transition-colors",
                  "hover:bg-accent",
                  selectedSize === index && "border-primary bg-primary/5"
                )}
              >
                <div>
                  <p className="font-medium">{size.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {size.width} x {size.height}px
                  </p>
                </div>
                {selectedSize === index && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export PNG
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
