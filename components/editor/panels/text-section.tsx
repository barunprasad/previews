"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Preset text styles
const TEXT_PRESETS = [
  { name: "Headline", fontSize: 72, fontWeight: "bold" as const },
  { name: "Subheadline", fontSize: 48, fontWeight: "600" as const },
  { name: "Title", fontSize: 36, fontWeight: "600" as const },
  { name: "Body", fontSize: 24, fontWeight: "normal" as const },
  { name: "Caption", fontSize: 18, fontWeight: "normal" as const },
];

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

interface TextSectionProps {
  onAddText: (options: {
    text: string;
    fontSize: number;
    fontWeight: string;
    fill: string;
  }) => void;
  recentColors?: string[];
  onColorUsed?: (color: string) => void;
}

export function TextSection({ onAddText, recentColors = [], onColorUsed }: TextSectionProps) {
  const [text, setText] = useState("Your text here");
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState("600");
  const [textColor, setTextColor] = useState("#ffffff");

  const handleAddText = () => {
    if (!text.trim()) return;

    onAddText({
      text: text.trim(),
      fontSize,
      fontWeight,
      fill: textColor,
    });

    // Record color usage
    onColorUsed?.(textColor);

    setText("Your text here");
  };

  const handlePresetClick = (preset: (typeof TEXT_PRESETS)[0]) => {
    setFontSize(preset.fontSize);
    setFontWeight(preset.fontWeight);
  };

  const handleColorSelect = (color: string) => {
    setTextColor(color);
  };

  return (
    <div className="space-y-4">
      {/* Text input */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Text</Label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text"
        />
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Style Presets</Label>
        <div className="flex flex-wrap gap-1.5">
          {TEXT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              className={cn(
                "rounded-md border px-2 py-1 text-xs transition-colors hover:bg-accent",
                fontSize === preset.fontSize &&
                  fontWeight === preset.fontWeight &&
                  "bg-accent"
              )}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size and Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium">Size</Label>
          <Select
            value={fontSize.toString()}
            onValueChange={(v: string) => setFontSize(parseInt(v))}
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
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Weight</Label>
          <Select value={fontWeight} onValueChange={setFontWeight}>
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

        {/* Recent Colors */}
        {recentColors.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              Recent
            </span>
            <div className="flex gap-1.5">
              {recentColors.slice(0, 6).map((color, index) => (
                <button
                  key={`${color}-${index}`}
                  className={cn(
                    "h-5 w-5 rounded-md border transition-transform hover:scale-110 shrink-0",
                    textColor.toLowerCase() === color.toLowerCase() && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preset Colors */}
        <div className="grid grid-cols-5 gap-1.5">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-6 w-full rounded-md border transition-transform hover:scale-110",
                textColor === color.value && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-0"
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                setTextColor(val);
              }
            }}
            className="h-6 w-20 rounded border bg-transparent px-2 text-[10px] font-mono"
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Add button */}
      <Button className="w-full" onClick={handleAddText}>
        <Plus className="mr-2 h-4 w-4" />
        Add Text
      </Button>
    </div>
  );
}
