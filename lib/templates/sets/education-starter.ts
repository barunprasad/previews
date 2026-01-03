import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Education Starter - Clean, inspiring, growth-focused
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.85)",
  accentColor: "#8b5cf6", // Purple for wisdom/creativity
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Learn Hero - Inspiring education journey
const learnHeroTemplate: PreviewTemplate = {
  id: "edu-learn-hero",
  name: "Learn Hero",
  description: "Inspiring hero for learning journey",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(155deg, #4f46e5 0%, #7c3aed 40%, #a855f7 80%, #c084fc 100%)",
  placeholders: [
    {
      id: "learn-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Learning badge
      {
        type: "textbox",
        text: "LEARN ANYTHING",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: CANVAS_WIDTH / 2,
        top: 150,
        width: 600,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 300,
      },
      // Main headline
      {
        type: "textbox",
        text: "Master New Skills",
        fontSize: 130,
        fontWeight: "800",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: CANVAS_WIDTH / 2,
        top: 240,
        width: 1150,
        textAlign: "center",
        originX: "center",
        originY: "top",
        lineHeight: 1.05,
      },
      // Subheadline
      {
        type: "textbox",
        text: "Learn at your own pace, anywhere",
        fontSize: 52,
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
      // Screenshot
      {
        type: "image",
        src: "/placeholders/screenshots/app-home.svg",
        left: CANVAS_WIDTH / 2,
        top: 1620,
        scaleX: 1.65,
        scaleY: 1.65,
        angle: -5,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(139, 92, 246, 0.4)",
          blur: 140,
          offsetX: 0,
          offsetY: 65,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "learn-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Course Library - Content abundance
const courseLibraryTemplate: PreviewTemplate = {
  id: "edu-courses",
  name: "Course Library",
  description: "Showcase extensive course catalog",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
  placeholders: [
    {
      id: "courses-screenshot",
      name: "Courses Screenshot",
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
        text: "10,000+ COURSES",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
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
        text: "Endless Possibilities",
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
        text: "From coding to cooking, we've got you covered",
        fontSize: 48,
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
      // Screenshot with tilt
      {
        type: "image",
        src: "/placeholders/screenshots/app-dashboard.svg",
        left: CANVAS_WIDTH / 2,
        top: 1630,
        scaleX: 1.7,
        scaleY: 1.7,
        angle: 6,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(139, 92, 246, 0.25)",
          blur: 115,
          offsetX: -25,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "courses-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Track Progress - Achievement focus
const trackProgressTemplate: PreviewTemplate = {
  id: "edu-progress",
  name: "Track Progress",
  description: "Highlight learning progress tracking",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
  placeholders: [
    {
      id: "progress-screenshot",
      name: "Progress Screenshot",
      url: "/placeholders/screenshots/app-profile.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Achievement badge
      {
        type: "textbox",
        text: "ACHIEVEMENTS",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
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
        text: "Watch Yourself Grow",
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
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Earn certificates and track your learning streak",
        fontSize: 42,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 980,
        width: 540,
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
          color: "rgba(0,0,0,0.25)",
          blur: 90,
          offsetX: 25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "progress-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 4: Expert Teachers - Quality focus
const expertTeachersTemplate: PreviewTemplate = {
  id: "edu-experts",
  name: "Expert Teachers",
  description: "Highlight quality instructors",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
  placeholders: [
    {
      id: "experts-screenshot",
      name: "Experts Screenshot",
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
        angle: 10,
        originX: "center",
        originY: "center",
        shadow: {
          color: "rgba(0,0,0,0.3)",
          blur: 100,
          offsetX: -25,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "experts-screenshot",
          replacementSlot: "primary",
        },
      },
      // Quality badge
      {
        type: "textbox",
        text: "WORLD-CLASS",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "#fbbf24",
        left: 728,
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
        text: "Learn from the Best",
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
        text: "Industry experts & top university professors",
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

// Preview 5: Start Learning CTA - Growth action
const learnCtaTemplate: PreviewTemplate = {
  id: "edu-cta",
  name: "Start Learning",
  description: "Motivating call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0a0a0a 0%, #18181b 50%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "learn-cta-screenshot",
      name: "App Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Social proof
      {
        type: "textbox",
        text: "JOIN 50M+ LEARNERS",
        fontSize: 26,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 180,
      },
      // Main CTA headline
      {
        type: "textbox",
        text: "Your Future Starts Here",
        fontSize: 115,
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
        text: "Start with a free trial today",
        fontSize: 52,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: "#22c55e",
        left: CANVAS_WIDTH / 2,
        top: 530,
        width: 1100,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot with purple glow
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
          color: "rgba(139, 92, 246, 0.45)",
          blur: 165,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "learn-cta-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Education Starter set
export const educationStarterSet: TemplateSet = {
  id: "education-starter",
  name: "Education Starter",
  description: "Inspiring 5-screenshot set for learning & education apps",
  category: "feature-focused",
  appStoreCategories: ["education"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    learnHeroTemplate,
    courseLibraryTemplate,
    trackProgressTemplate,
    expertTeachersTemplate,
    learnCtaTemplate,
  ],
  designTokens,
  tags: ["education", "learning", "courses", "skills", "growth", "knowledge"],
};

export const educationStarterTemplates = [
  learnHeroTemplate,
  courseLibraryTemplate,
  trackProgressTemplate,
  expertTeachersTemplate,
  learnCtaTemplate,
];
