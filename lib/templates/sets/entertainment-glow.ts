import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Entertainment Glow - Bold, dramatic, immersive
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.85)",
  accentColor: "#ef4444", // Red for entertainment/passion
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Stream Hero - Dramatic opening
const streamHeroTemplate: PreviewTemplate = {
  id: "ent-stream-hero",
  name: "Stream Hero",
  description: "Dramatic hero for streaming apps",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0a0a0a 0%, #171717 30%, #1f1f1f 60%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "stream-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Premium badge with glow effect
      {
        type: "textbox",
        text: "UNLIMITED STREAMING",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 250,
      },
      // Main headline - dramatic
      {
        type: "textbox",
        text: "Entertainment Redefined",
        fontSize: 120,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1200,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.05,
      },
      // Subheadline
      {
        type: "textbox",
        text: "Movies, shows & more in one place",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 510,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with dramatic red glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: 0,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(239, 68, 68, 0.5)",
          blur: 200,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "stream-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Content Library - Abundance focus
const contentLibraryTemplate: PreviewTemplate = {
  id: "ent-library",
  name: "Content Library",
  description: "Showcase massive content library",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #7c3aed 0%, #6d28d9 40%, #5b21b6 100%)",
  placeholders: [
    {
      id: "library-screenshot",
      name: "Library Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Stats highlight
      {
        type: "textbox",
        text: "100,000+ TITLES",
        fontSize: 26,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: "#fbbf24",
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
        text: "Infinite Entertainment",
        fontSize: 120,
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
      // Feature description
      {
        type: "textbox",
        text: "New releases added every week",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 520,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot tilted
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1630,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: -8,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(124, 58, 237, 0.4)",
          blur: 130,
          offsetX: 40,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "library-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Watch Anywhere - Flexibility focus
const watchAnywhereTemplate: PreviewTemplate = {
  id: "ent-anywhere",
  name: "Watch Anywhere",
  description: "Highlight multi-device streaming",
  category: "feature-callout",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "anywhere-screenshot",
      name: "Streaming Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Flexibility badge
      {
        type: "textbox",
        text: "MULTI-DEVICE",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "#0ea5e9",
        left: 90,
        top: 525,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Stream on Any Screen",
        fontSize: 105,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 610,
        width: 600,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Phone, tablet, TV, laptop - your choice",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 960,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.5,
      },
      // Screenshot - right side with glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: 970,
        top: 1500,
        scaleX: 1.5,
        scaleY: 1.5,
        angle: -10,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(14, 165, 233, 0.3)",
          blur: 115,
          offsetX: 25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "anywhere-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Offline Mode - Convenience focus
const offlineModeTemplate: PreviewTemplate = {
  id: "ent-offline",
  name: "Download & Watch",
  description: "Highlight offline viewing feature",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  placeholders: [
    {
      id: "offline-screenshot",
      name: "Offline Screenshot",
      url: "/placeholders/screenshots/app-list.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Screenshot - left side
      {
        type: "image",
        src: "/placeholders/screenshots/app-list.svg",
        left: 355,
        top: 1500,
        scaleX: 1.45,
        scaleY: 1.45,
        angle: 12,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(16, 185, 129, 0.25)",
          blur: 100,
          offsetX: -25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "offline-screenshot",
          replacementSlot: "primary",
        },
      },
      // Feature badge
      {
        type: "textbox",
        text: "NO WIFI NEEDED",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "#10b981",
        left: 728,
        top: 580,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 150,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Download for Offline",
        fontSize: 100,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 728,
        top: 670,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Watch your favorites without internet",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 728,
        top: 1050,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 5: Start Watching CTA - Action focused
const watchCtaTemplate: PreviewTemplate = {
  id: "ent-cta",
  name: "Start Watching",
  description: "Action-focused call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0a0a0a 0%, #171717 40%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "watch-cta-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Trial offer
      {
        type: "textbox",
        text: "7 DAYS FREE",
        fontSize: 28,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: "#22c55e",
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Main CTA headline
      {
        type: "textbox",
        text: "Start Watching Now",
        fontSize: 125,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 250,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Subtext
      {
        type: "textbox",
        text: "Cancel anytime. No commitments.",
        fontSize: 48,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 530,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with dramatic glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(239, 68, 68, 0.5)",
          blur: 200,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "watch-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Entertainment Glow set
export const entertainmentGlowSet: TemplateSet = {
  id: "entertainment-glow",
  name: "Entertainment Glow",
  description: "Dramatic 5-screenshot set for streaming & entertainment apps",
  category: "feature-focused",
  appStoreCategories: ["entertainment"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    streamHeroTemplate,
    contentLibraryTemplate,
    watchAnywhereTemplate,
    offlineModeTemplate,
    watchCtaTemplate,
  ],
  designTokens,
  tags: ["entertainment", "streaming", "movies", "shows", "video", "media"],
};

export const entertainmentGlowTemplates = [
  streamHeroTemplate,
  contentLibraryTemplate,
  watchAnywhereTemplate,
  offlineModeTemplate,
  watchCtaTemplate,
];
