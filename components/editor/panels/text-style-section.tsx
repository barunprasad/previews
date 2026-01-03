"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Convert any color format (rgba, rgb, hex) to #rrggbb format
 * Required for HTML color input which only accepts hex
 */
function toHexColor(color: string): string {
  // Already hex format
  if (color.startsWith("#")) {
    // Expand shorthand (#fff -> #ffffff)
    if (color.length === 4) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }
    return color.slice(0, 7); // Strip alpha if present (#rrggbbaa -> #rrggbb)
  }

  // Parse rgb/rgba
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // Fallback to black
  return "#000000";
}

const TEXT_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#0a0a0a" },
  { name: "Gray", value: "#6b7280" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
];

export interface SelectedTextStyle {
  text: string;
  fontSize: number;
  fontWeight: string;
  fill: string;
}

interface TextStyleSectionProps {
  style: SelectedTextStyle;
  onStyleChange: (style: Partial<SelectedTextStyle>) => void;
}

export function TextStyleSection({ style, onStyleChange }: TextStyleSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Editing selected text element. Double-click text on canvas for inline editing.
      </p>

      {/* Text Content */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text Content</Label>
        <Textarea
          value={style.text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onStyleChange({ text: e.target.value })}
          placeholder="Enter your text"
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Size and Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Size</Label>
          <Select
            value={style.fontSize.toString()}
            onValueChange={(v) => onStyleChange({ fontSize: parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18">18px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
              <SelectItem value="32">32px</SelectItem>
              <SelectItem value="36">36px</SelectItem>
              <SelectItem value="48">48px</SelectItem>
              <SelectItem value="64">64px</SelectItem>
              <SelectItem value="72">72px</SelectItem>
              <SelectItem value="96">96px</SelectItem>
              <SelectItem value="120">120px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Weight</Label>
          <Select
            value={style.fontWeight}
            onValueChange={(v) => onStyleChange({ fontWeight: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Regular</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semibold</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="800">Extra Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Color</Label>
        <div className="grid grid-cols-5 gap-1.5">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-6 w-full rounded-md border transition-transform hover:scale-110",
                style.fill === color.value && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => onStyleChange({ fill: color.value })}
              title={color.name}
            />
          ))}
        </div>
        {/* Custom color input */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="color"
            value={toHexColor(style.fill)}
            onChange={(e) => onStyleChange({ fill: e.target.value })}
            className="h-8 w-12 cursor-pointer rounded border bg-transparent"
          />
          <span className="text-xs text-muted-foreground">Custom</span>
        </div>
      </div>
    </div>
  );
}
