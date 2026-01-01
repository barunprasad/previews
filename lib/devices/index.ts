import type { DeviceFrame } from "@/types";

export type { DeviceFrame };

// iPhone devices - Using Apple App Store required screenshot sizes
// See: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications
export const iPhoneDevices: DeviceFrame[] = [
  {
    id: "iphone-6.7",
    name: 'iPhone 6.7" Display',
    type: "iphone",
    // App Store required size for 6.7" display
    width: 1290,
    height: 2796,
    screenX: 0,
    screenY: 0,
    screenWidth: 1290,
    screenHeight: 2796,
    svgPath: "/devices/iphone-15-pro-max.svg",
    exportSizes: [
      { width: 1290, height: 2796, label: 'App Store 6.7"' },
    ],
  },
  {
    id: "iphone-6.5",
    name: 'iPhone 6.5" Display',
    type: "iphone",
    // App Store required size for 6.5" display
    width: 1284,
    height: 2778,
    screenX: 0,
    screenY: 0,
    screenWidth: 1284,
    screenHeight: 2778,
    svgPath: "/devices/iphone-15-pro.svg",
    exportSizes: [
      { width: 1284, height: 2778, label: 'App Store 6.5"' },
    ],
  },
  {
    id: "iphone-6.5-alt",
    name: 'iPhone 6.5" (Alt)',
    type: "iphone",
    // Alternative 6.5" size (older iPhones like XS Max)
    width: 1242,
    height: 2688,
    screenX: 0,
    screenY: 0,
    screenWidth: 1242,
    screenHeight: 2688,
    svgPath: "/devices/iphone-15-pro.svg",
    exportSizes: [
      { width: 1242, height: 2688, label: 'App Store 6.5" Alt' },
    ],
  },
  {
    id: "iphone-5.5",
    name: 'iPhone 5.5" Display',
    type: "iphone",
    // App Store size for 5.5" display (iPhone 8 Plus, legacy)
    width: 1242,
    height: 2208,
    screenX: 0,
    screenY: 0,
    screenWidth: 1242,
    screenHeight: 2208,
    svgPath: "/devices/iphone-15-pro.svg",
    exportSizes: [
      { width: 1242, height: 2208, label: 'App Store 5.5"' },
    ],
  },
];

// iPad devices - Using Apple App Store required screenshot sizes
export const iPadDevices: DeviceFrame[] = [
  {
    id: "ipad-12.9",
    name: 'iPad 12.9" Display',
    type: "iphone", // Using iphone type for simplicity in project creation
    // App Store required size for 12.9" iPad
    width: 2048,
    height: 2732,
    screenX: 0,
    screenY: 0,
    screenWidth: 2048,
    screenHeight: 2732,
    svgPath: "/devices/ipad-pro.svg",
    exportSizes: [
      { width: 2048, height: 2732, label: 'App Store 12.9"' },
    ],
  },
  {
    id: "ipad-13",
    name: 'iPad 13" Display',
    type: "iphone",
    // App Store required size for 13" iPad
    width: 2064,
    height: 2752,
    screenX: 0,
    screenY: 0,
    screenWidth: 2064,
    screenHeight: 2752,
    svgPath: "/devices/ipad-pro.svg",
    exportSizes: [
      { width: 2064, height: 2752, label: 'App Store 13"' },
    ],
  },
];

// Android devices - Using Play Store recommended sizes
export const androidDevices: DeviceFrame[] = [
  {
    id: "android-phone",
    name: "Android Phone",
    type: "android",
    // Play Store recommended phone screenshot size
    width: 1080,
    height: 1920,
    screenX: 0,
    screenY: 0,
    screenWidth: 1080,
    screenHeight: 1920,
    svgPath: "/devices/pixel-8-pro.svg",
    exportSizes: [
      { width: 1080, height: 1920, label: "Play Store Phone" },
    ],
  },
  {
    id: "android-tablet",
    name: "Android Tablet",
    type: "android",
    // Play Store tablet screenshot size
    width: 1200,
    height: 1920,
    screenX: 0,
    screenY: 0,
    screenWidth: 1200,
    screenHeight: 1920,
    svgPath: "/devices/galaxy-s24.svg",
    exportSizes: [
      { width: 1200, height: 1920, label: "Play Store Tablet" },
    ],
  },
];

// All devices combined
export const allDevices: DeviceFrame[] = [...iPhoneDevices, ...iPadDevices, ...androidDevices];

// Helper functions
export function getDeviceById(id: string): DeviceFrame | undefined {
  return allDevices.find((device) => device.id === id);
}

export function getDevicesByType(type: "iphone" | "android"): DeviceFrame[] {
  return allDevices.filter((device) => device.type === type);
}

export function getDefaultDevice(type: "iphone" | "android"): DeviceFrame {
  const devices = getDevicesByType(type);
  return devices[0];
}
