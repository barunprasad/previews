"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Clock, X } from "lucide-react";

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

interface BackgroundSectionProps {
  value: string;
  onChange: (value: string) => void;
  recentColors?: string[];
  onColorUsed?: (color: string) => void;
}

export function BackgroundSection({
  value,
  onChange,
  recentColors = [],
  onColorUsed,
}: BackgroundSectionProps) {
  const [customColor, setCustomColor] = useState("#0a0a0a");

  // Sync custom color with current value if it's a solid color
  useEffect(() => {
    if (value && !value.startsWith("linear-gradient") && value.startsWith("#")) {
      setCustomColor(value);
    }
  }, [value]);

  const handleColorChange = (color: string) => {
    onChange(color);
    onColorUsed?.(color);
  };

  // Handle custom color change - apply instantly
  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor);
    onChange(newColor);
  };

  // Handle custom color picker blur - record in recent colors
  const handleCustomColorBlur = () => {
    onColorUsed?.(customColor);
  };

  return (
    <div className="space-y-4">
      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground" />
            Recent
          </Label>
          <div className="flex gap-1.5">
            {recentColors.slice(0, 8).map((color, index) => (
              <button
                key={`${color}-${index}`}
                className={cn(
                  "h-6 w-6 rounded-md border transition-all hover:scale-110 shrink-0",
                  value.toLowerCase() === color.toLowerCase() && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Solid Colors */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Solid Colors</Label>
        <div className="grid grid-cols-6 gap-1.5">
          {SOLID_COLORS.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-6 w-full rounded-md border transition-transform hover:scale-110",
                value === color.value && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Color - Instant Apply */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Custom Color</Label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              onBlur={handleCustomColorBlur}
              className="h-8 w-12 cursor-pointer rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0"
            />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const val = e.target.value;
                setCustomColor(val);
                // Only apply if it's a valid hex color
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  onChange(val);
                }
              }}
              onBlur={handleCustomColorBlur}
              className="h-8 w-full rounded-md border bg-transparent px-2 text-xs font-mono"
              placeholder="#000000"
            />
            {customColor !== value && /^#[0-9A-Fa-f]{6}$/.test(customColor) && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" title="Applied" />
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Changes apply instantly
        </p>
      </div>

      {/* Gradients */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Gradients</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {GRADIENTS.map((gradient) => (
            <button
              key={gradient.name}
              className={cn(
                "h-8 w-full rounded-md border transition-transform hover:scale-105 group relative overflow-hidden",
                value === gradient.value && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ background: gradient.value }}
              onClick={() => onChange(gradient.value)}
              title={gradient.name}
            >
              {/* Show name on hover */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {gradient.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
