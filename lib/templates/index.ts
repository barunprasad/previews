import type { PreviewTemplate, TemplateCategory } from "@/types";

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
        fontSize: 72,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 220,
        top: 200,
        width: 400,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "One line that describes your app",
        fontSize: 32,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fill: "#a3a3a3",
        left: 220,
        top: 300,
        width: 360,
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
        fontSize: 72,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#0a0a0a",
        left: 220,
        top: 200,
        width: 400,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "One line that describes your app",
        fontSize: 32,
        fontWeight: "normal",
        fontFamily: "sans-serif",
        fill: "#525252",
        left: 220,
        top: 300,
        width: 360,
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
        fontSize: 64,
        fontWeight: "800",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 220,
        top: 180,
        width: 400,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Makes everything easier",
        fontSize: 28,
        fontWeight: "500",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 220,
        top: 270,
        width: 360,
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
        fontSize: 64,
        fontWeight: "800",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 220,
        top: 180,
        width: 400,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      {
        type: "textbox",
        text: "The best way to get things done",
        fontSize: 28,
        fontWeight: "500",
        fontFamily: "sans-serif",
        fill: "#e0e7ff",
        left: 220,
        top: 270,
        width: 360,
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
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        fill: "#ffffff",
        left: 40,
        top: 120,
        width: 360,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Fast & Lightweight",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#22c55e",
        left: 40,
        top: 220,
        width: 360,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Easy to Use",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#3b82f6",
        left: 40,
        top: 270,
        width: 360,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "Secure & Private",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: "sans-serif",
        fill: "#a855f7",
        left: 40,
        top: 320,
        width: 360,
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
