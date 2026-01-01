import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Bold Isometric - Modern, dynamic, 3D-like presentation
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.8)",
  accentColor: "#6366f1", // Indigo for modern tech feel
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Isometric Hero - Angled screenshot with bold headline
const isometricHeroTemplate: PreviewTemplate = {
  id: "bi-hero",
  name: "Isometric Hero",
  description: "Dynamic angled screenshot with bold headline",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
  placeholders: [
    {
      id: "iso-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Bold headline
      {
        type: "textbox",
        text: "The Future of Apps",
        fontSize: 135,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 225,
        width: 1200,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.05,
      },
      // Subheadline
      {
        type: "textbox",
        text: "Experience next-level performance",
        fontSize: 55,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 440,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Angled screenshot - tilted left
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.5,
        scaleY: 1.5,
        angle: -8,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(99, 102, 241, 0.4)",
          blur: 130,
          offsetX: 40,
          offsetY: 65,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "iso-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Tilted Left Feature
const tiltedLeftTemplate: PreviewTemplate = {
  id: "bi-tilt-left",
  name: "Tilted Left",
  description: "Screenshot tilted left with right-aligned text",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
  placeholders: [
    {
      id: "tilt-left-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Angled screenshot - left side, tilted
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: 410,
        top: 1420,
        scaleX: 1.4,
        scaleY: 1.4,
        angle: 12,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(99, 102, 241, 0.25)",
          blur: 100,
          offsetX: -25,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "tilt-left-screenshot",
          replacementSlot: "primary",
        },
      },
      // Label
      {
        type: "textbox",
        text: "POWERFUL",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: 735,
        top: 580,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Smart Dashboard",
        fontSize: 105,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 735,
        top: 670,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "All your data, beautifully organized",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 735,
        top: 990,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 3: Tilted Right Feature
const tiltedRightTemplate: PreviewTemplate = {
  id: "bi-tilt-right",
  name: "Tilted Right",
  description: "Screenshot tilted right with left-aligned text",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #7c3aed 0%, #5b21b6 100%)",
  placeholders: [
    {
      id: "tilt-right-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Label
      {
        type: "textbox",
        text: "SEAMLESS",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.6)",
        left: 90,
        top: 580,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Intuitive Design",
        fontSize: 105,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 670,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Every interaction feels natural and smooth",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 990,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
      // Angled screenshot - right side, tilted
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: 925,
        top: 1420,
        scaleX: 1.4,
        scaleY: 1.4,
        angle: -12,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.35)",
          blur: 100,
          offsetX: 25,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "tilt-right-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Floating Center - Subtle tilt with centered layout
const floatingCenterTemplate: PreviewTemplate = {
  id: "bi-floating",
  name: "Floating Center",
  description: "Centered floating screenshot with subtle tilt",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
  placeholders: [
    {
      id: "floating-screenshot",
      name: "Feature Screenshot",
      url: "/placeholders/screenshots/app-list.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Feature label
      {
        type: "textbox",
        text: "LIGHTNING FAST",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 180,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Speed Matters",
        fontSize: 125,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 250,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Subtle description
      {
        type: "textbox",
        text: "Blazing fast performance",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 470,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Floating screenshot - subtle tilt
      {
        type: "image",
        src: "/placeholders/screenshots/app-list.svg",
        left: CANVAS_WIDTH / 2,
        top: 1600,
        scaleX: 1.6,
        scaleY: 1.6,
        angle: 5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 115,
          offsetX: 40,
          offsetY: 65,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "floating-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 5: Dramatic CTA - Bold angle with call to action
const dramaticCtaTemplate: PreviewTemplate = {
  id: "bi-cta",
  name: "Dramatic CTA",
  description: "Bold angled screenshot with download CTA",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #0a0a0a 0%, #18181b 50%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "dramatic-cta-screenshot",
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
        text: "Get Started Free",
        fontSize: 125,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 225,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Subtext
      {
        type: "textbox",
        text: "Available on iOS and Android",
        fontSize: 48,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 420,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Dramatically angled screenshot
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.6,
        scaleY: 1.6,
        angle: -10,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(99, 102, 241, 0.5)",
          blur: 150,
          offsetX: 50,
          offsetY: 75,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "dramatic-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Bold Isometric set
export const boldIsometricSet: TemplateSet = {
  id: "bold-isometric",
  name: "Bold Isometric",
  description: "Dynamic 5-screenshot set with angled device presentations",
  category: "feature-focused",
  appStoreCategories: ["productivity", "utilities", "entertainment", "education"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    isometricHeroTemplate,
    tiltedLeftTemplate,
    tiltedRightTemplate,
    floatingCenterTemplate,
    dramaticCtaTemplate,
  ],
  designTokens,
  tags: ["isometric", "angled", "3d", "dynamic", "modern", "bold"],
};

export const boldIsometricTemplates = [
  isometricHeroTemplate,
  tiltedLeftTemplate,
  tiltedRightTemplate,
  floatingCenterTemplate,
  dramaticCtaTemplate,
];
