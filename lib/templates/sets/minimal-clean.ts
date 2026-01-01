import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for minimal clean set
const designTokens = {
  primaryColor: "#0a0a0a",
  secondaryColor: "rgba(10, 10, 10, 0.6)",
  accentColor: "#3b82f6",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Clean Hero - White bg, centered screenshot
const cleanHeroTemplate: PreviewTemplate = {
  id: "mc-hero",
  name: "Clean Hero",
  description: "Minimal white background with centered app",
  category: "minimal",
  deviceType: "both",
  background: "#ffffff",
  placeholders: [
    {
      id: "clean-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Headline
      {
        type: "textbox",
        text: "Simple. Powerful.",
        fontSize: 130,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subheadline
      {
        type: "textbox",
        text: "The app that just works",
        fontSize: 56,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 420,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1550,
        scaleX: 1.6,
        scaleY: 1.6,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.1)",
          blur: 100,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "clean-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Feature Spotlight - Large screenshot with subtle text
const featureSpotlightTemplate: PreviewTemplate = {
  id: "mc-spotlight",
  name: "Feature Spotlight",
  description: "Large screenshot with minimal text overlay",
  category: "minimal",
  deviceType: "both",
  background: "#f5f5f5",
  placeholders: [
    {
      id: "spotlight-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Small label
      {
        type: "textbox",
        text: "FEATURE",
        fontSize: 36,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 180,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Headline
      {
        type: "textbox",
        text: "Beautiful Dashboard",
        fontSize: 110,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 260,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder - larger
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1600,
        scaleX: 1.75,
        scaleY: 1.75,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.08)",
          blur: 80,
          offsetX: 0,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "spotlight-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Split View - Text top, screenshot bottom
const splitViewTemplate: PreviewTemplate = {
  id: "mc-split",
  name: "Split View",
  description: "Clean split between text and screenshot",
  category: "minimal",
  deviceType: "both",
  background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)",
  placeholders: [
    {
      id: "split-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Headline
      {
        type: "textbox",
        text: "Your Profile,\nYour Way",
        fontSize: 120,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 300,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.15,
      },
      // Screenshot placeholder
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: CANVAS_WIDTH / 2,
        top: 1700,
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.12)",
          blur: 90,
          offsetX: 0,
          offsetY: 45,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "split-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Minimal Clean set
export const minimalCleanSet: TemplateSet = {
  id: "minimal-clean",
  name: "Minimal Clean",
  description: "Clean, modern 3-screenshot set with white backgrounds",
  category: "minimal-clean",
  appStoreCategories: ["productivity", "finance", "health-fitness", "utilities"],
  deviceType: "both",
  previewCount: 3,
  templates: [cleanHeroTemplate, featureSpotlightTemplate, splitViewTemplate],
  designTokens,
  tags: ["minimal", "clean", "white", "modern", "simple"],
};

// Export individual templates
export const minimalCleanTemplates = [
  cleanHeroTemplate,
  featureSpotlightTemplate,
  splitViewTemplate,
];
