import type { PreviewTemplate, TemplateCategory, TemplateSet, TemplateSetCategory, AppStoreCategory } from "@/types";

// Re-export template sets
export {
  templateSets,
  getTemplateSetById,
  getTemplateSetsByCategory,
  getTemplateSetsByAppStoreCategory,
  getTemplateSetsForDevice,
  filterTemplateSets,
  searchTemplateSets,
  templateSetCategories,
} from "./sets";

// Re-export placeholders
export {
  placeholderScreenshots,
  getPlaceholder,
  getAllPlaceholders,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SCREENSHOT_AREA,
} from "./placeholders";

// Re-export replacement utilities
export {
  findReplaceableObjects,
  isPlaceholderObject,
  getPlaceholderSlot,
  replaceScreenshot,
  replaceBySlot,
  hasPlaceholders,
  getPlaceholderCount,
} from "./replacement";
export type { FabricImageWithData } from "./replacement";

// Re-export categories
export {
  appStoreCategories,
  getCategoryById,
  getCategoryName,
} from "./categories";
export type { CategoryDefinition } from "./categories";

// Re-export theme utilities
export {
  PRESET_THEME_COLORS,
  hexToRgb,
  rgbToHex,
  hexToRgba,
  lightenColor,
  darkenColor,
  generateGradientFromColor,
  generateTwoColorGradient,
  applyColorToBackground,
  applyColorToCanvasJson,
  applyThemeToTemplate,
  applyThemeToTemplateSet,
  isLightColor,
  getContrastingTextColor,
} from "./theme-utils";

// Blank template (starting point)
const blankTemplate: PreviewTemplate = {
  id: "blank",
  name: "Blank Canvas",
  description: "Start with an empty canvas",
  category: "minimal",
  deviceType: "both",
  background: "#0a0a0a",
  canvasJson: {
    version: "6.0.0",
    objects: [],
  },
};

// Minimal Dark - Dark background with centered headline
const minimalDarkTemplate: PreviewTemplate = {
  id: "minimal-dark",
  name: "Minimal Dark",
  description: "Dark background with centered headline",
  category: "minimal",
  deviceType: "both",
  background: "#0a0a0a",
  canvasJson: {
    version: "6.0.0",
    objects: [
      {
        type: "textbox",
        text: "Your App Name",
        fontSize: 144,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 645,
        top: 400,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "One line that describes your app",
        fontSize: 64,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fill: "#a3a3a3",
        left: 645,
        top: 600,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
    ],
  },
};

// Minimal Light - White background variant
const minimalLightTemplate: PreviewTemplate = {
  id: "minimal-light",
  name: "Minimal Light",
  description: "Clean white background with dark text",
  category: "minimal",
  deviceType: "both",
  background: "#ffffff",
  canvasJson: {
    version: "6.0.0",
    objects: [
      {
        type: "textbox",
        text: "Your App Name",
        fontSize: 144,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#0a0a0a",
        left: 645,
        top: 400,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "One line that describes your app",
        fontSize: 64,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fill: "#525252",
        left: 645,
        top: 600,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
    ],
  },
};

// Gradient Sunset - Warm gradient background
const gradientSunsetTemplate: PreviewTemplate = {
  id: "gradient-sunset",
  name: "Sunset Gradient",
  description: "Warm sunset gradient with bold text",
  category: "gradient",
  deviceType: "both",
  background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)",
  canvasJson: {
    version: "6.0.0",
    objects: [
      {
        type: "textbox",
        text: "YOUR APP",
        fontSize: 128,
        fontWeight: "800",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 645,
        top: 360,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Makes everything easier",
        fontSize: 56,
        fontWeight: "500",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 645,
        top: 540,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
    ],
  },
};

// Gradient Ocean - Cool blue gradient
const gradientOceanTemplate: PreviewTemplate = {
  id: "gradient-ocean",
  name: "Ocean Gradient",
  description: "Cool ocean blue gradient",
  category: "gradient",
  deviceType: "both",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6B8DD6 100%)",
  canvasJson: {
    version: "6.0.0",
    objects: [
      {
        type: "textbox",
        text: "YOUR APP",
        fontSize: 128,
        fontWeight: "800",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 645,
        top: 360,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "The best way to get things done",
        fontSize: 56,
        fontWeight: "500",
        fontFamily: "sans-serif",
        fill: "#e0e7ff",
        left: 645,
        top: 540,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
    ],
  },
};

// Feature Showcase - Text with feature highlights
const featureShowcaseTemplate: PreviewTemplate = {
  id: "feature-showcase",
  name: "Feature Showcase",
  description: "Highlight key features with bullet points",
  category: "showcase",
  deviceType: "both",
  background: "#18181b",
  canvasJson: {
    version: "6.0.0",
    objects: [
      {
        type: "textbox",
        text: "Key Features",
        fontSize: 96,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 100,
        top: 300,
        width: 900,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Fast & Lightweight",
        fontSize: 56,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#22c55e",
        left: 100,
        top: 500,
        width: 900,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Easy to Use",
        fontSize: 56,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#3b82f6",
        left: 100,
        top: 600,
        width: 900,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Secure & Private",
        fontSize: 56,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#a855f7",
        left: 100,
        top: 700,
        width: 900,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
    ],
  },
};

// All templates
export const templates: PreviewTemplate[] = [
  blankTemplate,
  minimalDarkTemplate,
  minimalLightTemplate,
  gradientSunsetTemplate,
  gradientOceanTemplate,
  featureShowcaseTemplate,
];

// Helper functions
export function getTemplateById(id: string): PreviewTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): PreviewTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplatesForDevice(deviceType: "iphone" | "android"): PreviewTemplate[] {
  return templates.filter((t) => t.deviceType === "both" || t.deviceType === deviceType);
}

export const templateCategories: { id: TemplateCategory; name: string }[] = [
  { id: "minimal", name: "Minimal" },
  { id: "gradient", name: "Gradient" },
  { id: "showcase", name: "Showcase" },
];
