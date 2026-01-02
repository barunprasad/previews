// SVG Device Bezel configurations for realistic device frames

export interface BezelConfig {
  id: string;
  name: string;
  // Path to the bezel SVG file
  bezelPath: string;
  // SVG viewport dimensions
  bezelWidth: number;
  bezelHeight: number;
  // Screen area within the bezel (in SVG viewport coordinates)
  screen: {
    x: number;
    y: number;
    width: number;
    height: number;
    // Corner radius for the screen area (to clip the screenshot)
    cornerRadius: number;
  };
  // Native resolution of the embedded PNG (for scaling calculations)
  nativeWidth: number;
  nativeHeight: number;
  // Color variant (for display purposes)
  color?: string;
}

// iPhone 17 Pro Max bezels
// SVG: 490 x 1000, Screen: 440 x 956 (centered, offset 25, 22)
export const iPhone17ProMaxBezels: BezelConfig[] = [
  {
    id: "iphone-17-pro-max-cosmic-orange",
    name: "iPhone 17 Pro Max",
    bezelPath: "/bezels/iPhone17ProMax/Color=CosmicOrange.svg",
    bezelWidth: 490,
    bezelHeight: 1000,
    screen: {
      x: 25,
      y: 22,
      width: 440,
      height: 956,
      cornerRadius: 28,
    },
    nativeWidth: 1320,
    nativeHeight: 2868,
    color: "Cosmic Orange",
  },
  {
    id: "iphone-17-pro-max-deep-blue",
    name: "iPhone 17 Pro Max",
    bezelPath: "/bezels/iPhone17ProMax/Color=DeepBlue.svg",
    bezelWidth: 490,
    bezelHeight: 1000,
    screen: {
      x: 25,
      y: 22,
      width: 440,
      height: 956,
      cornerRadius: 28,
    },
    nativeWidth: 1320,
    nativeHeight: 2868,
    color: "Deep Blue",
  },
  {
    id: "iphone-17-pro-max-silver",
    name: "iPhone 17 Pro Max",
    bezelPath: "/bezels/iPhone17ProMax/Color=Silver.svg",
    bezelWidth: 490,
    bezelHeight: 1000,
    screen: {
      x: 25,
      y: 22,
      width: 440,
      height: 956,
      cornerRadius: 28,
    },
    nativeWidth: 1320,
    nativeHeight: 2868,
    color: "Silver",
  },
];

// iPhone 17 Pro bezels
// SVG: 450 x 920, Screen: 402 x 874 (centered, offset 24, 23)
export const iPhone17ProBezels: BezelConfig[] = [
  {
    id: "iphone-17-pro-cosmic-orange",
    name: "iPhone 17 Pro",
    bezelPath: "/bezels/iPhone17Pro/Color=CosmicOrange.svg",
    bezelWidth: 450,
    bezelHeight: 920,
    screen: {
      x: 24,
      y: 23,
      width: 402,
      height: 874,
      cornerRadius: 26,
    },
    nativeWidth: 1206,
    nativeHeight: 2622,
    color: "Cosmic Orange",
  },
  {
    id: "iphone-17-pro-deep-blue",
    name: "iPhone 17 Pro",
    bezelPath: "/bezels/iPhone17Pro/Color=DeepBlue.svg",
    bezelWidth: 450,
    bezelHeight: 920,
    screen: {
      x: 24,
      y: 23,
      width: 402,
      height: 874,
      cornerRadius: 26,
    },
    nativeWidth: 1206,
    nativeHeight: 2622,
    color: "Deep Blue",
  },
  {
    id: "iphone-17-pro-silver",
    name: "iPhone 17 Pro",
    bezelPath: "/bezels/iPhone17Pro/Color=Silver.svg",
    bezelWidth: 450,
    bezelHeight: 920,
    screen: {
      x: 24,
      y: 23,
      width: 402,
      height: 874,
      cornerRadius: 26,
    },
    nativeWidth: 1206,
    nativeHeight: 2622,
    color: "Silver",
  },
];

// iPhone 17 bezels
// SVG: 450 x 920, Screen: 402 x 874 (centered, offset 24, 23)
export const iPhone17Bezels: BezelConfig[] = [
  {
    id: "iphone-17-black",
    name: "iPhone 17",
    bezelPath: "/bezels/iPhone17/Color=Black.svg",
    bezelWidth: 450,
    bezelHeight: 920,
    screen: {
      x: 24,
      y: 23,
      width: 402,
      height: 874,
      cornerRadius: 26,
    },
    nativeWidth: 1206,
    nativeHeight: 2622,
    color: "Black",
  },
  {
    id: "iphone-17-white",
    name: "iPhone 17",
    bezelPath: "/bezels/iPhone17/Color=White.svg",
    bezelWidth: 450,
    bezelHeight: 920,
    screen: {
      x: 24,
      y: 23,
      width: 402,
      height: 874,
      cornerRadius: 26,
    },
    nativeWidth: 1206,
    nativeHeight: 2622,
    color: "White",
  },
];

// All bezels combined
export const allBezels: BezelConfig[] = [
  ...iPhone17ProMaxBezels,
  ...iPhone17ProBezels,
  ...iPhone17Bezels,
];

// Default bezel
export const defaultBezel = iPhone17ProMaxBezels[0];

// Get bezel by ID
export function getBezelById(id: string): BezelConfig | undefined {
  return allBezels.find((bezel) => bezel.id === id);
}

// Get bezels by device category
export function getBezelsByCategory(category: string): BezelConfig[] {
  switch (category) {
    case "iphone-17-pro-max":
      return iPhone17ProMaxBezels;
    case "iphone-17-pro":
      return iPhone17ProBezels;
    case "iphone-17":
      return iPhone17Bezels;
    default:
      return allBezels;
  }
}

// Bezel categories for UI display
export const bezelCategories = [
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max" },
  { id: "iphone-17-pro", name: "iPhone 17 Pro" },
  { id: "iphone-17", name: "iPhone 17" },
];
