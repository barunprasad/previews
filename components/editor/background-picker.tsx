"use client";

import { useState } from "react";
import { Paintbrush, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Preset solid colors
const SOLID_COLORS = [
  { name: "Black", value: "#0a0a0a" },
  { name: "White", value: "#ffffff" },
  { name: "Slate", value: "#1e293b" },
  { name: "Gray", value: "#374151" },
  { name: "Zinc", value: "#27272a" },
  { name: "Stone", value: "#292524" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Amber", value: "#d97706" },
  { name: "Yellow", value: "#ca8a04" },
  { name: "Lime", value: "#65a30d" },
  { name: "Green", value: "#16a34a" },
  { name: "Emerald", value: "#059669" },
  { name: "Teal", value: "#0d9488" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Sky", value: "#0284c7" },
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Purple", value: "#9333ea" },
  { name: "Fuchsia", value: "#c026d3" },
  { name: "Pink", value: "#db2777" },
  { name: "Rose", value: "#e11d48" },
];

// Preset gradients
const GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)" },
  { name: "Purple Haze", value: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
  { name: "Night Sky", value: "linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)" },
  { name: "Coral", value: "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)" },
  { name: "Aurora", value: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)" },
  { name: "Midnight", value: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" },
  { name: "Dawn", value: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)" },
  { name: "Mint", value: "linear-gradient(135deg, #5eead4 0%, #22d3ee 100%)" },
  { name: "Berry", value: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" },
  { name: "Slate Dark", value: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" },
];

interface BackgroundPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#0a0a0a");

  const isGradient = value.startsWith("linear-gradient");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div
            className="h-4 w-4 rounded border"
            style={{ background: value }}
          />
          <Paintbrush className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Solid Colors */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Solid Colors</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {SOLID_COLORS.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-transform hover:scale-110",
                    value === color.value && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    onChange(color.value);
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Custom Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border bg-transparent"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-8 flex-1 rounded-md border bg-transparent px-2 text-sm"
                placeholder="#000000"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onChange(customColor)}
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Gradients */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Gradients</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.name}
                  className={cn(
                    "h-8 w-full rounded-md border transition-transform hover:scale-105",
                    value === gradient.value && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ background: gradient.value }}
                  onClick={() => {
                    onChange(gradient.value);
                  }}
                  title={gradient.name}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
