import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for E-commerce Starter - Bold, conversion-focused, trust-building
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.85)",
  accentColor: "#f59e0b", // Amber for deals/offers
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Shop Hero - Bold statement with floating product
const shopHeroTemplate: PreviewTemplate = {
  id: "ec-shop-hero",
  name: "Shop Hero",
  description: "Bold shopping statement with product showcase",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 100%)",
  placeholders: [
    {
      id: "shop-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Offer badge - top left accent
      {
        type: "rect",
        left: 90,
        top: 165,
        width: 240,
        height: 76,
        rx: 38,
        ry: 38,
        fill: designTokens.accentColor,
        originX: "left",
        originY: "top",
      },
      {
        type: "textbox",
        text: "50% OFF",
        fontSize: 28,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: "#000000",
        left: 210,
        top: 186,
        width: 240,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Main headline - large and bold
      {
        type: "textbox",
        text: "Shop Smarter",
        fontSize: 145,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 300,
        width: 1100,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.0,
      },
      // Subheadline with gradient feel
      {
        type: "textbox",
        text: "Discover deals you'll love",
        fontSize: 55,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 510,
        width: 1000,
        textAlign: "left",
        originX: "left",
        originY: "top",
      },
      // Screenshot - angled for dynamic feel
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2 + 60,
        top: 1650,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: -5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(245, 158, 11, 0.3)",
          blur: 150,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "shop-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Product Discovery - Split diagonal design
const productDiscoveryTemplate: PreviewTemplate = {
  id: "ec-discovery",
  name: "Product Discovery",
  description: "Showcase product browsing experience",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  placeholders: [
    {
      id: "discovery-screenshot",
      name: "Discovery Screenshot",
      url: "/placeholders/screenshots/app-dashboard.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Category pill
      {
        type: "textbox",
        text: "BROWSE",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.6)",
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 450,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 300,
      },
      // Bold headline
      {
        type: "textbox",
        text: "Millions of Products",
        fontSize: 115,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 225,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.1,
      },
      // Subtext
      {
        type: "textbox",
        text: "Find exactly what you need",
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
      // Screenshot with tilt
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: 6,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.4)",
          blur: 130,
          offsetX: -40,
          offsetY: 65,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "discovery-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Easy Checkout - Trust and speed focus
const easyCheckoutTemplate: PreviewTemplate = {
  id: "ec-checkout",
  name: "Easy Checkout",
  description: "Highlight seamless checkout experience",
  category: "feature-callout",
  deviceType: "both",
  background: "#0a0a0a",
  placeholders: [
    {
      id: "checkout-screenshot",
      name: "Checkout Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Trust badges row (simulated with text)
      {
        type: "textbox",
        text: "SECURE CHECKOUT",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "#22c55e",
        left: 90,
        top: 510,
        width: 540,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "Buy in One Tap",
        fontSize: 115,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 595,
        width: 585,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Apple Pay, Google Pay & all major cards accepted",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 930,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.5,
      },
      // Screenshot - right side
      {
        type: "image",
        src: "/placeholders/screenshots/app-profile.svg",
        left: 970,
        top: 1500,
        scaleX: 1.5,
        scaleY: 1.5,
        angle: -8,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(34, 197, 94, 0.2)",
          blur: 100,
          offsetX: 25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "checkout-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Fast Delivery - Speed emphasis
const fastDeliveryTemplate: PreviewTemplate = {
  id: "ec-delivery",
  name: "Fast Delivery",
  description: "Showcase delivery tracking",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0ea5e9 0%, #2563eb 100%)",
  placeholders: [
    {
      id: "delivery-screenshot",
      name: "Delivery Screenshot",
      url: "/placeholders/screenshots/app-list.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Screenshot - left side with tilt
      {
        type: "image",
        src: "/placeholders/screenshots/app-list.svg",
        left: 355,
        top: 1500,
        scaleX: 1.45,
        scaleY: 1.45,
        angle: 10,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 90,
          offsetX: -25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "delivery-screenshot",
          replacementSlot: "primary",
        },
      },
      // Speed indicator
      {
        type: "textbox",
        text: "SAME DAY",
        fontSize: 26,
        fontWeight: "700",
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
        text: "Lightning Fast Delivery",
        fontSize: 95,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 735,
        top: 670,
        width: 530,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Track your order in real-time",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 735,
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

// Preview 5: Download CTA - Conversion focused
const shopCtaTemplate: PreviewTemplate = {
  id: "ec-cta",
  name: "Shop Now CTA",
  description: "Conversion-focused download prompt",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #000000 0%, #0a0a0a 40%, #1a1a1a 100%)",
  placeholders: [
    {
      id: "shop-cta-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Urgency text
      {
        type: "textbox",
        text: "LIMITED TIME OFFER",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Main CTA headline
      {
        type: "textbox",
        text: "Start Shopping Today",
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
      // Subtext
      {
        type: "textbox",
        text: "Free shipping on your first order",
        fontSize: 52,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: "#22c55e",
        left: CANVAS_WIDTH / 2,
        top: 480,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with premium glow
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: -3,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(245, 158, 11, 0.4)",
          blur: 175,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "shop-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete E-commerce Starter set
export const ecommerceStarterSet: TemplateSet = {
  id: "ecommerce-starter",
  name: "E-commerce Starter",
  description: "Conversion-focused 5-screenshot set for shopping apps",
  category: "feature-focused",
  appStoreCategories: ["ecommerce", "shopping"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    shopHeroTemplate,
    productDiscoveryTemplate,
    easyCheckoutTemplate,
    fastDeliveryTemplate,
    shopCtaTemplate,
  ],
  designTokens,
  tags: ["ecommerce", "shopping", "retail", "deals", "conversion", "sales"],
};

export const ecommerceStarterTemplates = [
  shopHeroTemplate,
  productDiscoveryTemplate,
  easyCheckoutTemplate,
  fastDeliveryTemplate,
  shopCtaTemplate,
];
