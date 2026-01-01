import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Dark Premium - Luxurious, minimal, sophisticated
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.6)",
  accentColor: "#f59e0b", // Amber for premium/gold accent
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Premium Hero - Elegant dark hero
const premiumHeroTemplate: PreviewTemplate = {
  id: "dp-hero",
  name: "Premium Hero",
  description: "Elegant dark hero with premium feel",
  category: "device-showcase",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "premium-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Premium badge
      {
        type: "textbox",
        text: "PREMIUM EXPERIENCE",
        fontSize: 28,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 650,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 250,
      },
      // Main headline
      {
        type: "textbox",
        text: "Designed for Excellence",
        fontSize: 125,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 250,
        width: 1200,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subheadline
      {
        type: "textbox",
        text: "Experience the difference",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 460,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with subtle glow
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
          color: "rgba(245, 158, 11, 0.15)",
          blur: 130,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "premium-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Minimal Feature - Clean and elegant
const minimalFeatureTemplate: PreviewTemplate = {
  id: "dp-minimal",
  name: "Minimal Feature",
  description: "Ultra-clean feature showcase",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(180deg, #0a0a0a 0%, #171717 100%)",
  placeholders: [
    {
      id: "minimal-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Subtle label
      {
        type: "textbox",
        text: "CRAFTED WITH CARE",
        fontSize: 26,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 180,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Every Detail Matters",
        fontSize: 115,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 260,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1600,
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(255,255,255,0.05)",
          blur: 100,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "minimal-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Luxury Feature - Gold accent left
const luxuryLeftTemplate: PreviewTemplate = {
  id: "dp-luxury-left",
  name: "Luxury Left",
  description: "Premium feature with gold accents",
  category: "feature-callout",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "luxury-left-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Accent line
      {
        type: "rect",
        left: 90,
        top: 570,
        width: 120,
        height: 8,
        fill: designTokens.accentColor,
        originX: "left",
        originY: "top",
      },
      // Feature headline
      {
        type: "textbox",
        text: "Thoughtfully Designed",
        fontSize: 100,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 640,
        width: 570,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Interfaces that feel natural and intuitive",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 1000,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.5,
      },
      // Screenshot placeholder - right side
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: 970,
        top: 1500,
        scaleX: 1.5,
        scaleY: 1.5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(245, 158, 11, 0.1)",
          blur: 90,
          offsetX: 0,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "luxury-left-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Luxury Feature - Right aligned
const luxuryRightTemplate: PreviewTemplate = {
  id: "dp-luxury-right",
  name: "Luxury Right",
  description: "Premium feature with elegant layout",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #171717 0%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "luxury-right-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-list.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Screenshot placeholder - left side
      {
        type: "image",
        src: "/placeholders/screenshots/app-list.svg",
        left: 340,
        top: 1500,
        scaleX: 1.45,
        scaleY: 1.45,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(255,255,255,0.05)",
          blur: 90,
          offsetX: 0,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "luxury-right-screenshot",
          replacementSlot: "primary",
        },
      },
      // Accent line
      {
        type: "rect",
        left: 720,
        top: 610,
        width: 120,
        height: 8,
        fill: designTokens.accentColor,
        originX: "left",
        originY: "top",
      },
      // Feature headline
      {
        type: "textbox",
        text: "Built for Speed",
        fontSize: 100,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 720,
        top: 680,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Lightning fast performance you can feel",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 720,
        top: 1010,
        width: 500,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.5,
      },
    ],
  },
};

// Preview 5: Premium CTA - Elegant download prompt
const premiumCtaTemplate: PreviewTemplate = {
  id: "dp-cta",
  name: "Premium CTA",
  description: "Sophisticated call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "premium-cta-screenshot",
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
        text: "Elevate Your Experience",
        fontSize: 115,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1200,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subtext
      {
        type: "textbox",
        text: "Download now. Free forever.",
        fontSize: 48,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 450,
        width: 1000,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with golden glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1600,
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(245, 158, 11, 0.25)",
          blur: 150,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "premium-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Dark Premium set
export const darkPremiumSet: TemplateSet = {
  id: "dark-premium",
  name: "Dark Premium",
  description: "Sophisticated 5-screenshot set with elegant dark theme",
  category: "minimal-clean",
  appStoreCategories: ["productivity", "finance", "utilities", "entertainment"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    premiumHeroTemplate,
    minimalFeatureTemplate,
    luxuryLeftTemplate,
    luxuryRightTemplate,
    premiumCtaTemplate,
  ],
  designTokens,
  tags: ["dark", "premium", "luxury", "elegant", "minimal", "sophisticated"],
};

export const darkPremiumTemplates = [
  premiumHeroTemplate,
  minimalFeatureTemplate,
  luxuryLeftTemplate,
  luxuryRightTemplate,
  premiumCtaTemplate,
];
