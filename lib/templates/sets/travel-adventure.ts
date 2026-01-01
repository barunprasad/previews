import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Travel Adventure - Inspiring, warm, adventurous
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.9)",
  accentColor: "#f97316", // Orange for warmth/sunset vibes
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Adventure Hero - Inspiring wanderlust
const adventureHeroTemplate: PreviewTemplate = {
  id: "ta-adventure-hero",
  name: "Adventure Hero",
  description: "Inspiring hero with wanderlust vibes",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(165deg, #0c4a6e 0%, #0369a1 30%, #0ea5e9 60%, #38bdf8 100%)",
  placeholders: [
    {
      id: "adventure-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Wanderlust badge
      {
        type: "textbox",
        text: "EXPLORE THE WORLD",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 300,
      },
      // Main headline - inspiring
      {
        type: "textbox",
        text: "Your Next Adventure Awaits",
        fontSize: 115,
        fontWeight: "800",
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
        text: "Book flights, hotels & experiences",
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
      // Screenshot with warm glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.65,
        scaleY: 1.65,
        angle: -4,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(251, 191, 36, 0.3)",
          blur: 150,
          offsetX: 0,
          offsetY: 65,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "adventure-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Discover Places - Destination focus
const discoverPlacesTemplate: PreviewTemplate = {
  id: "ta-discover",
  name: "Discover Places",
  description: "Showcase destination discovery",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(150deg, #f97316 0%, #ea580c 40%, #dc2626 100%)",
  placeholders: [
    {
      id: "discover-screenshot",
      name: "Discover Screenshot",
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
        text: "200+ DESTINATIONS",
        fontSize: 26,
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
        text: "Discover Hidden Gems",
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
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Curated trips by local experts",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 495,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1630,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: 5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.35)",
          blur: 115,
          offsetX: -25,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "discover-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Best Deals - Savings focus
const bestDealsTemplate: PreviewTemplate = {
  id: "ta-deals",
  name: "Best Deals",
  description: "Highlight travel deals and savings",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #059669 0%, #10b981 50%, #34d399 100%)",
  placeholders: [
    {
      id: "deals-screenshot",
      name: "Deals Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Savings badge
      {
        type: "textbox",
        text: "SAVE UP TO 60%",
        fontSize: 26,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: "#fbbf24",
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
        text: "Unbeatable Prices",
        fontSize: 110,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 610,
        width: 585,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Compare prices across 500+ airlines & hotels",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 930,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.5,
      },
      // Screenshot - right side angled
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
          color: "rgba(0,0,0,0.25)",
          blur: 90,
          offsetX: 25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "deals-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Easy Booking - Simplicity focus
const easyBookingTemplate: PreviewTemplate = {
  id: "ta-booking",
  name: "Easy Booking",
  description: "Highlight simple booking process",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
  placeholders: [
    {
      id: "booking-screenshot",
      name: "Booking Screenshot",
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
        angle: 8,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(99, 102, 241, 0.3)",
          blur: 100,
          offsetX: -25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "booking-screenshot",
          replacementSlot: "primary",
        },
      },
      // Speed badge
      {
        type: "textbox",
        text: "BOOK IN 60 SECONDS",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
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
        text: "Book Anywhere, Anytime",
        fontSize: 95,
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
        text: "Instant confirmation. No hidden fees.",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 728,
        top: 1060,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 5: Start Journey CTA - Inspiring action
const journeyCtaTemplate: PreviewTemplate = {
  id: "ta-cta",
  name: "Start Journey",
  description: "Inspiring call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
  placeholders: [
    {
      id: "journey-cta-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Trust indicator
      {
        type: "textbox",
        text: "TRUSTED BY 5M+ TRAVELERS",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 840,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 180,
      },
      // Main CTA headline
      {
        type: "textbox",
        text: "Start Your Journey",
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
      // Subtext
      {
        type: "textbox",
        text: "Your dream trip is just a tap away",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 470,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with sunset glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: -2,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(249, 115, 22, 0.35)",
          blur: 165,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "journey-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Travel Adventure set
export const travelAdventureSet: TemplateSet = {
  id: "travel-adventure",
  name: "Travel Adventure",
  description: "Inspiring 5-screenshot set for travel & booking apps",
  category: "feature-focused",
  appStoreCategories: ["travel"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    adventureHeroTemplate,
    discoverPlacesTemplate,
    bestDealsTemplate,
    easyBookingTemplate,
    journeyCtaTemplate,
  ],
  designTokens,
  tags: ["travel", "adventure", "booking", "flights", "hotels", "wanderlust"],
};

export const travelAdventureTemplates = [
  adventureHeroTemplate,
  discoverPlacesTemplate,
  bestDealsTemplate,
  easyBookingTemplate,
  journeyCtaTemplate,
];
