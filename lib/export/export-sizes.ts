// App Store and Play Store export size configurations
// Based on Apple and Google's official requirements

export interface ExportSizeConfig {
  id: string;
  label: string;
  width: number;
  height: number;
  platform: "ios" | "android";
  required: boolean;
  description: string;
}

// iOS App Store screenshot sizes (portrait)
// Source: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications
export const IOS_EXPORT_SIZES: ExportSizeConfig[] = [
  {
    id: "ios-6.7",
    label: '6.7" Display',
    width: 1290,
    height: 2796,
    platform: "ios",
    required: true,
    description: "iPhone 14/15/16 Pro Max, Plus models",
  },
  {
    id: "ios-6.5",
    label: '6.5" Display',
    width: 1284,
    height: 2778,
    platform: "ios",
    required: false,
    description: "iPhone 12/13/14 Pro Max",
  },
  {
    id: "ios-6.5-alt",
    label: '6.5" Display (Alt)',
    width: 1242,
    height: 2688,
    platform: "ios",
    required: false,
    description: "iPhone XS Max, 11 Pro Max",
  },
  {
    id: "ios-5.5",
    label: '5.5" Display',
    width: 1242,
    height: 2208,
    platform: "ios",
    required: false,
    description: "iPhone 8 Plus (legacy)",
  },
  {
    id: "ipad-12.9",
    label: 'iPad 12.9"',
    width: 2048,
    height: 2732,
    platform: "ios",
    required: false,
    description: "iPad Pro 12.9\"",
  },
  {
    id: "ipad-13",
    label: 'iPad 13"',
    width: 2064,
    height: 2752,
    platform: "ios",
    required: false,
    description: "iPad Pro 13\" (M4)",
  },
];

// Android Play Store screenshot sizes
export const ANDROID_EXPORT_SIZES: ExportSizeConfig[] = [
  {
    id: "android-phone",
    label: "Phone",
    width: 1080,
    height: 1920,
    platform: "android",
    required: true,
    description: "Standard Android phone (16:9)",
  },
  {
    id: "android-tablet",
    label: "Tablet",
    width: 1200,
    height: 1920,
    platform: "android",
    required: false,
    description: "Android tablet",
  },
];

// Combined export sizes
export const ALL_EXPORT_SIZES: ExportSizeConfig[] = [
  ...IOS_EXPORT_SIZES,
  ...ANDROID_EXPORT_SIZES,
];

// Get sizes by platform
export function getExportSizesByPlatform(
  platform: "ios" | "android" | "all"
): ExportSizeConfig[] {
  if (platform === "all") {
    return ALL_EXPORT_SIZES;
  }
  return ALL_EXPORT_SIZES.filter((size) => size.platform === platform);
}

// Get required sizes only
export function getRequiredExportSizes(
  platform: "ios" | "android" | "all"
): ExportSizeConfig[] {
  return getExportSizesByPlatform(platform).filter((size) => size.required);
}

// Platform display info
export const PLATFORM_INFO = {
  ios: {
    name: "iOS App Store",
    icon: "apple",
    folderName: "ios",
  },
  android: {
    name: "Google Play Store",
    icon: "smartphone",
    folderName: "android",
  },
} as const;
