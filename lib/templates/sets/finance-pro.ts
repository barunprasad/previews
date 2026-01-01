import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Finance Pro - Clean, trustworthy, professional
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.8)",
  accentColor: "#10b981", // Emerald green for trust/growth
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Trust Hero - Clean headline with security emphasis
const trustHeroTemplate: PreviewTemplate = {
  id: "fp-trust-hero",
  name: "Trust Hero",
  description: "Clean professional hero with trust messaging",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
  placeholders: [
    {
      id: "trust-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Small trust badge
      {
        type: "textbox",
        text: "SECURE & TRUSTED",
        fontSize: 30,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Main headline
      {
        type: "textbox",
        text: "Banking Made Simple",
        fontSize: 130,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subheadline
      {
        type: "textbox",
        text: "Manage your finances with confidence",
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
          color: "rgba(16, 185, 129, 0.2)",
          blur: 100,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "trust-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Dashboard Feature - Data visualization focus
const dashboardFeatureTemplate: PreviewTemplate = {
  id: "fp-dashboard",
  name: "Dashboard Insights",
  description: "Showcase financial dashboard and analytics",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  placeholders: [
    {
      id: "dashboard-screenshot",
      name: "Dashboard Screenshot",
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
        text: "See Your Money Clearly",
        fontSize: 115,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 210,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Beautiful charts and insights at a glance",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 440,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 90,
          offsetX: 0,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "dashboard-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Security Feature - Left aligned
const securityFeatureTemplate: PreviewTemplate = {
  id: "fp-security",
  name: "Security First",
  description: "Highlight security and protection features",
  category: "feature-callout",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "security-screenshot",
      name: "Security Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Security badge
      {
        type: "textbox",
        text: "256-BIT ENCRYPTION",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: 90,
        top: 525,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 150,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Your Data is Protected",
        fontSize: 105,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 610,
        width: 585,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Bank-grade security keeps your money safe",
        fontSize: 46,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 990,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
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
          color: "rgba(16, 185, 129, 0.15)",
          blur: 80,
          offsetX: 0,
          offsetY: 35,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "security-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Transfers Feature - Right aligned
const transfersFeatureTemplate: PreviewTemplate = {
  id: "fp-transfers",
  name: "Easy Transfers",
  description: "Showcase quick and easy money transfers",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #064e3b 0%, #047857 100%)",
  placeholders: [
    {
      id: "transfers-screenshot",
      name: "Transfers Screenshot",
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
          color: "rgba(0,0,0,0.3)",
          blur: 80,
          offsetX: 0,
          offsetY: 35,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "transfers-screenshot",
          replacementSlot: "primary",
        },
      },
      // Speed badge
      {
        type: "textbox",
        text: "INSTANT",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "#fbbf24",
        left: 720,
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
        text: "Send Money in Seconds",
        fontSize: 100,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 720,
        top: 670,
        width: 555,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Transfer to anyone, anywhere, anytime",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 720,
        top: 1040,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 5: CTA Download - Final conversion screen
const ctaDownloadTemplate: PreviewTemplate = {
  id: "fp-cta",
  name: "Download CTA",
  description: "Call to action with download prompt",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
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
        text: "Start Growing Your Wealth",
        fontSize: 120,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subtext
      {
        type: "textbox",
        text: "Free to download. No hidden fees.",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 480,
        width: 1050,
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
        scaleX: 1.7,
        scaleY: 1.7,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(16, 185, 129, 0.25)",
          blur: 115,
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

// Complete Finance Pro set
export const financeProSet: TemplateSet = {
  id: "finance-pro",
  name: "Finance Pro",
  description: "Professional 5-screenshot set for banking & finance apps",
  category: "feature-focused",
  appStoreCategories: ["finance", "productivity"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    trustHeroTemplate,
    dashboardFeatureTemplate,
    securityFeatureTemplate,
    transfersFeatureTemplate,
    ctaDownloadTemplate,
  ],
  designTokens,
  tags: ["finance", "banking", "professional", "dark", "trust", "secure"],
};

export const financeProTemplates = [
  trustHeroTemplate,
  dashboardFeatureTemplate,
  securityFeatureTemplate,
  transfersFeatureTemplate,
  ctaDownloadTemplate,
];
