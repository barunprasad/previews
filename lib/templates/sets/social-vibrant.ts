import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Social Vibrant - Fun, colorful, engaging
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.85)",
  accentColor: "#ec4899", // Pink for social engagement
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Connect Hero - Social connection emphasis
const connectHeroTemplate: PreviewTemplate = {
  id: "sv-connect",
  name: "Connect Hero",
  description: "Bold hero emphasizing social connection",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f97316 100%)",
  placeholders: [
    {
      id: "connect-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Community badge
      {
        type: "textbox",
        text: "JOIN THE COMMUNITY",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 180,
      },
      // Main headline
      {
        type: "textbox",
        text: "Share Your Story",
        fontSize: 135,
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
        text: "Connect with millions around the world",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 450,
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
          color: "rgba(0,0,0,0.25)",
          blur: 100,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "connect-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Feed Feature - Content discovery
const feedFeatureTemplate: PreviewTemplate = {
  id: "sv-feed",
  name: "Discover Feed",
  description: "Showcase content discovery and feed",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #7c3aed 0%, #a855f7 50%, #d946ef 100%)",
  placeholders: [
    {
      id: "feed-screenshot",
      name: "Feed Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Feature label
      {
        type: "textbox",
        text: "PERSONALIZED FOR YOU",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.6)",
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 150,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Your Feed, Your Way",
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
        text: "Discover content you'll love",
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
          placeholderId: "feed-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Chat Feature - Messaging focus
const chatFeatureTemplate: PreviewTemplate = {
  id: "sv-chat",
  name: "Chat & Message",
  description: "Highlight messaging and chat features",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
  placeholders: [
    {
      id: "chat-screenshot",
      name: "Chat Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Chat badge
      {
        type: "textbox",
        text: "REAL-TIME",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.6)",
        left: 90,
        top: 540,
        width: 450,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Chat Instantly",
        fontSize: 110,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 625,
        width: 570,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Send messages, photos, and videos instantly",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 960,
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
          color: "rgba(0,0,0,0.25)",
          blur: 80,
          offsetX: 0,
          offsetY: 35,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "chat-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Profile Feature - Self expression
const profileFeatureTemplate: PreviewTemplate = {
  id: "sv-profile",
  name: "Express Yourself",
  description: "Profile customization and self-expression",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #f43f5e 0%, #fb7185 100%)",
  placeholders: [
    {
      id: "profile-screenshot",
      name: "Profile Screenshot",
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
          color: "rgba(0,0,0,0.25)",
          blur: 80,
          offsetX: 0,
          offsetY: 35,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "profile-screenshot",
          replacementSlot: "primary",
        },
      },
      // Creative badge
      {
        type: "textbox",
        text: "BE CREATIVE",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: 720,
        top: 580,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 180,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Make It Yours",
        fontSize: 105,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 720,
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
        text: "Customize your profile to stand out",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 720,
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

// Preview 5: Social CTA - Join the community
const socialCtaTemplate: PreviewTemplate = {
  id: "sv-cta",
  name: "Join Today",
  description: "Community-focused call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #18181b 0%, #27272a 50%, #18181b 100%)",
  placeholders: [
    {
      id: "social-cta-screenshot",
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
        text: "Join the Conversation",
        fontSize: 120,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 225,
        width: 1200,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subtext with social proof
      {
        type: "textbox",
        text: "10M+ people are already sharing",
        fontSize: 52,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 440,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder with vibrant glow
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
          color: "rgba(236, 72, 153, 0.4)",
          blur: 130,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "social-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Social Vibrant set
export const socialVibrantSet: TemplateSet = {
  id: "social-vibrant",
  name: "Social Vibrant",
  description: "Colorful 5-screenshot set for social networking apps",
  category: "feature-focused",
  appStoreCategories: ["social-networking", "entertainment"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    connectHeroTemplate,
    feedFeatureTemplate,
    chatFeatureTemplate,
    profileFeatureTemplate,
    socialCtaTemplate,
  ],
  designTokens,
  tags: ["social", "colorful", "vibrant", "community", "chat", "networking"],
};

export const socialVibrantTemplates = [
  connectHeroTemplate,
  feedFeatureTemplate,
  chatFeatureTemplate,
  profileFeatureTemplate,
  socialCtaTemplate,
];
