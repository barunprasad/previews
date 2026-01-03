import type { TemplateSet, PreviewTemplate } from "@/types";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../placeholders";

// Design tokens for Fitness Energy - Vibrant, energetic, motivating
const designTokens = {
  primaryColor: "#ffffff",
  secondaryColor: "rgba(255, 255, 255, 0.85)",
  accentColor: "#f97316", // Orange for energy
  fontFamily: "system-ui, -apple-system, sans-serif",
};

// Preview 1: Energy Hero - Bold motivational headline
const energyHeroTemplate: PreviewTemplate = {
  id: "fe-energy-hero",
  name: "Energy Hero",
  description: "Bold motivational hero with high energy",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #be123c 100%)",
  placeholders: [
    {
      id: "energy-hero-screenshot",
      name: "Main Screenshot",
      url: "/placeholders/screenshots/app-home.svg",
      slot: "primary",
    },
  ],
  canvasJson: {
    version: "6.0.0",
    objects: [
      // Motivational badge
      {
        type: "textbox",
        text: "YOUR FITNESS JOURNEY",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.7)",
        left: CANVAS_WIDTH / 2,
        top: 165,
        width: 750,
        textAlign: "center",
        originX: "center",
        originY: "top",
        charSpacing: 200,
      },
      // Main headline
      {
        type: "textbox",
        text: "Transform Your Body",
        fontSize: 130,
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
        text: "Track workouts, crush goals, get results",
        fontSize: 52,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 560,
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
          color: "rgba(0,0,0,0.35)",
          blur: 100,
          offsetX: 0,
          offsetY: 50,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "energy-hero-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 2: Workout Tracking Feature
const workoutTrackingTemplate: PreviewTemplate = {
  id: "fe-workouts",
  name: "Workout Tracking",
  description: "Showcase workout logging and tracking",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
  placeholders: [
    {
      id: "workouts-screenshot",
      name: "Workouts Screenshot",
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
        text: "500+ EXERCISES",
        fontSize: 28,
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
        text: "Track Every Rep",
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
      },
      // Feature description
      {
        type: "textbox",
        text: "Log sets, reps, and weights with one tap",
        fontSize: 52,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: CANVAS_WIDTH / 2,
        top: 450,
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
          color: "rgba(249, 115, 22, 0.2)",
          blur: 90,
          offsetX: 0,
          offsetY: 40,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "workouts-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Preview 3: Progress Charts - Left aligned
const progressChartsTemplate: PreviewTemplate = {
  id: "fe-progress",
  name: "Progress Charts",
  description: "Show progress tracking with charts",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c026d3 100%)",
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
      // Feature badge
      {
        type: "textbox",
        text: "ANALYTICS",
        fontSize: 28,
        fontWeight: "600",
        fontFamily: designTokens.fontFamily,
        fill: "rgba(255,255,255,0.6)",
        left: 90,
        top: 530,
        width: 450,
        textAlign: "left",
        originX: "left",
        originY: "top",
        charSpacing: 200,
      },
      // Feature headline
      {
        type: "textbox",
        text: "See Your Progress",
        fontSize: 110,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 90,
        top: 610,
        width: 580,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.1,
      },
      // Feature description
      {
        type: "textbox",
        text: "Beautiful charts show how far you've come",
        fontSize: 46,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 90,
        top: 960,
        width: 540,
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
          color: "rgba(0,0,0,0.3)",
          blur: 80,
          offsetX: 0,
          offsetY: 35,
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

// Preview 4: Goals Feature - Right aligned
const goalsFeatureTemplate: PreviewTemplate = {
  id: "fe-goals",
  name: "Crush Your Goals",
  description: "Goal setting and achievement features",
  category: "feature-callout",
  deviceType: "both",
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  placeholders: [
    {
      id: "goals-screenshot",
      name: "Goals Screenshot",
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
          placeholderId: "goals-screenshot",
          replacementSlot: "primary",
        },
      },
      // Achievement badge
      {
        type: "textbox",
        text: "ACHIEVEMENTS",
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
        text: "Set Goals & Crush Them",
        fontSize: 95,
        fontWeight: "700",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.primaryColor,
        left: 720,
        top: 660,
        width: 550,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.15,
      },
      // Feature description
      {
        type: "textbox",
        text: "Earn badges and stay motivated every day",
        fontSize: 44,
        fontWeight: "400",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.secondaryColor,
        left: 720,
        top: 1130,
        width: 510,
        textAlign: "left",
        originX: "left",
        originY: "top",
        lineHeight: 1.4,
      },
    ],
  },
};

// Preview 5: CTA - High energy download prompt
const ctaEnergyTemplate: PreviewTemplate = {
  id: "fe-cta",
  name: "Start Today",
  description: "Motivational call to action",
  category: "device-showcase",
  deviceType: "both",
  background: "linear-gradient(180deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)",
  placeholders: [
    {
      id: "cta-energy-screenshot",
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
        text: "Start Your Transformation",
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
        lineHeight: 1.1,
      },
      // Subtext
      {
        type: "textbox",
        text: "Join 2M+ users getting fit",
        fontSize: 52,
        fontWeight: "500",
        fontFamily: designTokens.fontFamily,
        fill: designTokens.accentColor,
        left: CANVAS_WIDTH / 2,
        top: 500,
        width: 1050,
        textAlign: "center",
        originX: "center",
        originY: "top",
      },
      // Screenshot placeholder with glow
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
          color: "rgba(249, 115, 22, 0.35)",
          blur: 130,
          offsetX: 0,
          offsetY: 0,
        },
        data: {
          isPlaceholder: true,
          placeholderId: "cta-energy-screenshot",
          replacementSlot: "primary",
        },
      },
    ],
  },
};

// Complete Fitness Energy set
export const fitnessEnergySet: TemplateSet = {
  id: "fitness-energy",
  name: "Fitness Energy",
  description: "High-energy 5-screenshot set for fitness & health apps",
  category: "feature-focused",
  appStoreCategories: ["health-fitness", "productivity"],
  deviceType: "both",
  previewCount: 5,
  templates: [
    energyHeroTemplate,
    workoutTrackingTemplate,
    progressChartsTemplate,
    goalsFeatureTemplate,
    ctaEnergyTemplate,
  ],
  designTokens,
  tags: ["fitness", "health", "workout", "energy", "vibrant", "motivational"],
};

export const fitnessEnergyTemplates = [
  energyHeroTemplate,
  workoutTrackingTemplate,
  progressChartsTemplate,
  goalsFeatureTemplate,
  ctaEnergyTemplate,
];
