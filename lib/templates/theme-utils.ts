import type { TemplateSet, PreviewTemplate } from "@/types";

// Preset theme colors for quick selection
export const PRESET_THEME_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
];

// Convert hex color to RGB values
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Convert hex to rgba string
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// Lighten a color by percentage
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor
  );
}

// Darken a color by percentage
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - percent / 100;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

// Generate a complementary gradient from a primary color
export function generateGradientFromColor(
  primaryColor: string,
  angle: number = 135
): string {
  const lightened = lightenColor(primaryColor, 20);
  const darkened = darkenColor(primaryColor, 20);
  return `linear-gradient(${angle}deg, ${darkened} 0%, ${primaryColor} 50%, ${lightened} 100%)`;
}

// Generate a two-color gradient
export function generateTwoColorGradient(
  color1: string,
  color2: string,
  angle: number = 135
): string {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

// Apply a new theme color to a background string
export function applyColorToBackground(
  background: string,
  newColor: string
): string {
  // If it's a gradient, replace the colors
  if (background.startsWith("linear-gradient")) {
    // For gradients, generate a new gradient based on the new color
    const angleMatch = background.match(/linear-gradient\((\d+)deg/);
    const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
    return generateGradientFromColor(newColor, angle);
  }

  // If it's a solid color, replace with the new color
  if (background.startsWith("#") || background.startsWith("rgb")) {
    return newColor;
  }

  // For other backgrounds (images, etc.), return as-is
  return background;
}

// Apply theme color to canvas JSON (updates text colors, etc.)
export function applyColorToCanvasJson(
  canvasJson: Record<string, unknown>,
  newColor: string
): Record<string, unknown> {
  if (!canvasJson || !canvasJson.objects) return canvasJson;

  const objects = canvasJson.objects as Array<Record<string, unknown>>;
  const updatedObjects = objects.map((obj) => {
    // Update text fill colors that match the theme
    if (obj.type === "text" || obj.type === "textbox") {
      const fill = obj.fill as string;
      // Only update colored text (not white/black)
      if (fill && fill.startsWith("#") && fill !== "#ffffff" && fill !== "#000000") {
        return { ...obj, fill: newColor };
      }
    }
    return obj;
  });

  return { ...canvasJson, objects: updatedObjects };
}

// Apply a new theme color to a template
export function applyThemeToTemplate(
  template: PreviewTemplate,
  newPrimaryColor: string
): PreviewTemplate {
  return {
    ...template,
    background: applyColorToBackground(template.background, newPrimaryColor),
    canvasJson: applyColorToCanvasJson(template.canvasJson, newPrimaryColor),
  };
}

// Apply a new theme color to a template set
export function applyThemeToTemplateSet(
  templateSet: TemplateSet,
  newPrimaryColor: string
): TemplateSet {
  const secondaryColor = lightenColor(newPrimaryColor, 30);
  const accentColor = darkenColor(newPrimaryColor, 10);

  return {
    ...templateSet,
    designTokens: {
      ...templateSet.designTokens,
      primaryColor: newPrimaryColor,
      secondaryColor,
      accentColor,
    },
    templates: templateSet.templates.map((template) =>
      applyThemeToTemplate(template, newPrimaryColor)
    ),
  };
}

// Check if a color is light or dark
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

// Get contrasting text color (white or black) for a background
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
}
