import type { PlaceholderImage } from "@/types";

// Placeholder screenshot images for templates
// These are generic app screenshots that users replace with their own

export const placeholderScreenshots: Record<string, PlaceholderImage> = {
  "app-home": {
    id: "app-home",
    name: "Home Screen",
    url: "/placeholders/screenshots/app-home.svg",
    slot: "primary",
  },
  "app-dashboard": {
    id: "app-dashboard",
    name: "Dashboard",
    url: "/placeholders/screenshots/app-dashboard.svg",
    slot: "primary",
  },
  "app-profile": {
    id: "app-profile",
    name: "Profile Screen",
    url: "/placeholders/screenshots/app-profile.svg",
    slot: "primary",
  },
  "app-list": {
    id: "app-list",
    name: "List View",
    url: "/placeholders/screenshots/app-list.svg",
    slot: "primary",
  },
};

// Get placeholder by ID
export function getPlaceholder(id: string): PlaceholderImage | undefined {
  return placeholderScreenshots[id];
}

// Get all placeholders as array
export function getAllPlaceholders(): PlaceholderImage[] {
  return Object.values(placeholderScreenshots);
}

// Canvas dimensions for templates (iPhone 6.7" - App Store required size)
export const CANVAS_WIDTH = 1290;
export const CANVAS_HEIGHT = 2796;

// Screenshot area within canvas (with padding for text/decorations)
export const SCREENSHOT_AREA = {
  width: 820,
  height: 1640,
  // Centered horizontally
  x: (CANVAS_WIDTH - 820) / 2,
  // Below headline area
  y: 820,
};
