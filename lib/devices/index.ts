import type { DeviceFrame } from "@/types";

export type { DeviceFrame };

// iPhone devices
export const iPhoneDevices: DeviceFrame[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    type: "iphone",
    width: 440,
    height: 882,
    screenX: 20,
    screenY: 20,
    screenWidth: 400,
    screenHeight: 842,
    svgPath: "/devices/iphone-15-pro-max.svg",
    exportSizes: [
      { width: 1320, height: 2868, label: 'App Store 6.9"' },
      { width: 1290, height: 2796, label: "iPhone 15 Pro Max" },
    ],
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    type: "iphone",
    width: 402,
    height: 830,
    screenX: 18,
    screenY: 18,
    screenWidth: 366,
    screenHeight: 794,
    svgPath: "/devices/iphone-15-pro.svg",
    exportSizes: [
      { width: 1206, height: 2622, label: 'App Store 6.3"' },
      { width: 1179, height: 2556, label: "iPhone 15 Pro" },
    ],
  },
];

// Android devices
export const androidDevices: DeviceFrame[] = [
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    type: "android",
    width: 412,
    height: 892,
    screenX: 16,
    screenY: 16,
    screenWidth: 380,
    screenHeight: 860,
    svgPath: "/devices/pixel-8-pro.svg",
    exportSizes: [
      { width: 1344, height: 2992, label: "Play Store" },
      { width: 1008, height: 2244, label: "Pixel 8 Pro" },
    ],
  },
  {
    id: "galaxy-s24",
    name: "Samsung Galaxy S24",
    type: "android",
    width: 384,
    height: 832,
    screenX: 14,
    screenY: 14,
    screenWidth: 356,
    screenHeight: 804,
    svgPath: "/devices/galaxy-s24.svg",
    exportSizes: [
      { width: 1080, height: 2340, label: "Play Store" },
      { width: 1080, height: 2340, label: "Galaxy S24" },
    ],
  },
];

// All devices combined
export const allDevices: DeviceFrame[] = [...iPhoneDevices, ...androidDevices];

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
