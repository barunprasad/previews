// Device mockup/bezel configurations for screenshot mockups

export interface DeviceMockup {
  id: string;
  name: string;
  // Bezel sizes relative to screen
  bezel: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  // Corner radius for the outer frame
  cornerRadius: number;
  // Frame color (typically black for iPhones)
  frameColor: string;
  // Screen corner radius
  screenCornerRadius: number;
  // Has Dynamic Island
  hasDynamicIsland?: boolean;
  // Has notch
  hasNotch?: boolean;
  // Has home button
  hasHomeButton?: boolean;
}

export const deviceMockups: Record<string, DeviceMockup> = {
  "iphone-15-pro": {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    bezel: {
      top: 14,
      bottom: 14,
      left: 14,
      right: 14,
    },
    cornerRadius: 55,
    frameColor: "#1a1a1a",
    screenCornerRadius: 47,
    hasDynamicIsland: true,
  },
  "iphone-14": {
    id: "iphone-14",
    name: "iPhone 14",
    bezel: {
      top: 14,
      bottom: 14,
      left: 14,
      right: 14,
    },
    cornerRadius: 50,
    frameColor: "#1a1a1a",
    screenCornerRadius: 42,
    hasNotch: true,
  },
  "iphone-se": {
    id: "iphone-se",
    name: "iPhone SE",
    bezel: {
      top: 70,
      bottom: 70,
      left: 14,
      right: 14,
    },
    cornerRadius: 40,
    frameColor: "#1a1a1a",
    screenCornerRadius: 0,
    hasHomeButton: true,
  },
  "android-pixel": {
    id: "android-pixel",
    name: "Android (Pixel)",
    bezel: {
      top: 20,
      bottom: 20,
      left: 8,
      right: 8,
    },
    cornerRadius: 35,
    frameColor: "#202020",
    screenCornerRadius: 28,
  },
  "android-samsung": {
    id: "android-samsung",
    name: "Android (Samsung)",
    bezel: {
      top: 16,
      bottom: 16,
      left: 6,
      right: 6,
    },
    cornerRadius: 40,
    frameColor: "#0a0a0a",
    screenCornerRadius: 35,
  },
  "generic": {
    id: "generic",
    name: "Generic Phone",
    bezel: {
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
    },
    cornerRadius: 35,
    frameColor: "#1a1a1a",
    screenCornerRadius: 25,
  },
};

export const defaultDeviceMockup = deviceMockups["iphone-15-pro"];

export function getDeviceMockup(id: string): DeviceMockup {
  return deviceMockups[id] || defaultDeviceMockup;
}

export function getAllDeviceMockups(): DeviceMockup[] {
  return Object.values(deviceMockups);
}
