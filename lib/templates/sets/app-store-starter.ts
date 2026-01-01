import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for consistent styling across the set
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.7)",
  accentColor: "#3b82f6",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Hero Shot - Headline + centered screenshot
const heroTemplate: PreviewTemplate = {
  id: "ast-hero",
  name: "Hero Shot",
  description: "Bold headline with centered app showcase",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  placeholders: [
    {
      id: "hero-screenshot",
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
        text: "Your Amazing App",
        fontSize: 120,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 200,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subheadline
      {
        type: "textbox",
        text: "The best way to get things done",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 380,
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
        top: 1600,
        scaleX: 1.6,
        scaleY: 1.6,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 60,
          offsetX: 0,
          offsetY: 30,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Feature Left - Text left, screenshot right
const featureLeftTemplate: PreviewTemplate = {
  id: "ast-feature-left",
  name: "Feature Left",
  description: "Feature text on left, screenshot on right",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  placeholders: [
    {
      id: "feature-left-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Feature headline
      {
        type: "textbox",
        text: "Track Your Progress",
        fontSize: 96,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 80,
        top: 400,
        width: 500,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "See your stats at a glance with beautiful charts",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 80,
        top: 700,
        width: 480,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
      // Screenshot placeholder - right side
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: 900,
        top: 1500,
        scaleX: 1.5,
        scaleY: 1.5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.25)",
          blur: 50,
          offsetX: 0,
          offsetY: 24,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "feature-left-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Feature Right - Screenshot left, text right
const featureRightTemplate: PreviewTemplate = {
  id: "ast-feature-right",
  name: "Feature Right",
  description: "Screenshot on left, feature text on right",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  placeholders: [
    {
      id: "feature-right-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Screenshot placeholder - left side
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: 390,
        top: 1500,
        scaleX: 1.5,
        scaleY: 1.5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.25)",
          blur: 50,
          offsetX: 0,
          offsetY: 24,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "feature-right-screenshot",
          replacementSlot: "primary",
        },
      },
      // Feature headline
      {
        type: "textbox",
        text: "Personalize Everything",
        fontSize: 96,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 710,
        top: 400,
        width: 520,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Make it yours with custom themes and settings",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 710,
        top: 720,
        width: 500,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 4: Feature Center - Centered screenshot with bottom text
const featureCenterTemplate: PreviewTemplate = {
  id: "ast-feature-center",
  name: "Feature Center",
  description: "Centered screenshot with feature text below",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  placeholders: [
    {
      id: "feature-center-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-list.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Screenshot placeholder - centered, upper area
      {
        type: "image",
        src: "/placeholders/screenshots/app-list.svg",
        left: CANVAS_WIDTH / 2,
        top: 1100,
        scaleX: 1.6,
        scaleY: 1.6,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.2)",
          blur: 60,
          offsetX: 0,
          offsetY: 30,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "feature-center-screenshot",
          replacementSlot: "primary",
        },
      },
      // Feature headline - below screenshot
      {
        type: "textbox",
        text: "Stay Organized",
        fontSize: 100,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: "#1a1a2e",
        left: CANVAS_WIDTH / 2,
        top: 2200,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Feature description
      {
        type: "textbox",
        text: "Everything you need, right at your fingertips",
        fontSize: 48,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(26, 26, 46, 0.7)",
        left: CANVAS_WIDTH / 2,
        top: 2360,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
    ],
  },
};

// Preview 5: CTA - Call to action with app showcase
const ctaTemplate: PreviewTemplate = {
  id: "ast-cta",
  name: "Call to Action",
  description: "Download prompt with app showcase",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  placeholders: [
    {
      id: "cta-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Main CTA headline
      {
        type: "textbox",
        text: "Download Now",
        fontSize: 110,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 250,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Subtext
      {
        type: "textbox",
        text: "Free on the App Store",
        fontSize: 48,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 420,
        width: 900,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1600,
        scaleX: 1.8,
        scaleY: 1.8,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(59, 130, 246, 0.4)",
          blur: 80,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete App Store Starter set
export const appStoreStarterSet: TemplateSet = {
  id: "app-store-starter",
  name: "App Store Starter",
  description: "Professional 5-screenshot set for iOS App Store",
  category: "app-store-starter",
  appStoreCategories: ["productivity", "utilities", "entertainment", "education"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    heroTemplate,
    featureLeftTemplate,
    featureRightTemplate,
    featureCenterTemplate,
    ctaTemplate,
  ],
  designTokens,
  tags: ["app-store", "professional", "gradient", "modern"],
};

// Export individual templates for single use
export const appStoreStarterTemplates = [
  heroTemplate,
  featureLeftTemplate,
  featureRightTemplate,
  featureCenterTemplate,
  ctaTemplate,
];
