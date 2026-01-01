import type { TemplateSet, TemplateSetCategory, AppStoreCategory } from "@/types";
import { appStoreStarterSet, appStoreStarterTemplates } from "./app-store-starter";
import { minimalCleanSet, minimalCleanTemplates } from "./minimal-clean";
import { financeProSet, financeProTemplates } from "./finance-pro";
import { fitnessEnergySet, fitnessEnergyTemplates } from "./fitness-energy";
import { boldIsometricSet, boldIsometricTemplates } from "./bold-isometric";
import { socialVibrantSet, socialVibrantTemplates } from "./social-vibrant";
import { darkPremiumSet, darkPremiumTemplates } from "./dark-premium";
import { ecommerceStarterSet, ecommerceStarterTemplates } from "./ecommerce-starter";
import { travelAdventureSet, travelAdventureTemplates } from "./travel-adventure";
import { educationStarterSet, educationStarterTemplates } from "./education-starter";
import { entertainmentGlowSet, entertainmentGlowTemplates } from "./entertainment-glow";
import { luxuryShopSet, luxuryShopTemplates } from "./luxury-shop";

// All template sets
export const templateSets: TemplateSet[] = [
  appStoreStarterSet,
  minimalCleanSet,
  financeProSet,
  fitnessEnergySet,
  boldIsometricSet,
  socialVibrantSet,
  darkPremiumSet,
  ecommerceStarterSet,
  travelAdventureSet,
  educationStarterSet,
  entertainmentGlowSet,
  luxuryShopSet,
];

// Get template set by ID
export function getTemplateSetById(id: string): TemplateSet | undefined {
  return templateSets.find((set) => set.id === id);
}

// Get template sets by category
export function getTemplateSetsByCategory(
  category: TemplateSetCategory
): TemplateSet[] {
  return templateSets.filter((set) => set.category === category);
}

// Get template sets by App Store category
export function getTemplateSetsByAppStoreCategory(
  appStoreCategory: AppStoreCategory
): TemplateSet[] {
  return templateSets.filter((set) =>
    set.appStoreCategories.includes(appStoreCategory)
  );
}

// Get template sets for a device type
export function getTemplateSetsForDevice(
  deviceType: "iphone" | "android"
): TemplateSet[] {
  return templateSets.filter(
    (set) => set.deviceType === "both" || set.deviceType === deviceType
  );
}

// Filter template sets by multiple criteria
export function filterTemplateSets(options: {
  appStoreCategory?: AppStoreCategory | "all";
  deviceType?: "iphone" | "android" | "both";
  query?: string;
}): TemplateSet[] {
  let results = [...templateSets];

  // Filter by App Store category
  if (options.appStoreCategory && options.appStoreCategory !== "all") {
    results = results.filter((set) =>
      set.appStoreCategories.includes(options.appStoreCategory as AppStoreCategory)
    );
  }

  // Filter by device type
  if (options.deviceType && options.deviceType !== "both") {
    results = results.filter(
      (set) => set.deviceType === "both" || set.deviceType === options.deviceType
    );
  }

  // Filter by search query
  if (options.query) {
    const lowerQuery = options.query.toLowerCase();
    results = results.filter(
      (set) =>
        set.name.toLowerCase().includes(lowerQuery) ||
        set.description.toLowerCase().includes(lowerQuery) ||
        set.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  return results;
}

// Search template sets by tags
export function searchTemplateSets(query: string): TemplateSet[] {
  const lowerQuery = query.toLowerCase();
  return templateSets.filter(
    (set) =>
      set.name.toLowerCase().includes(lowerQuery) ||
      set.description.toLowerCase().includes(lowerQuery) ||
      set.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Template set categories for UI
export const templateSetCategories: { id: TemplateSetCategory; name: string; description: string }[] = [
  {
    id: "app-store-starter",
    name: "App Store Starter",
    description: "Complete sets for app store listings",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Simple, clean designs",
  },
  {
    id: "feature-focused",
    name: "Feature Focused",
    description: "Highlight your app's features",
  },
  {
    id: "onboarding-flow",
    name: "Onboarding Flow",
    description: "Show your app's user journey",
  },
];

// Re-export individual templates from sets
export {
  appStoreStarterTemplates,
  minimalCleanTemplates,
  financeProTemplates,
  fitnessEnergyTemplates,
  boldIsometricTemplates,
  socialVibrantTemplates,
  darkPremiumTemplates,
  ecommerceStarterTemplates,
  travelAdventureTemplates,
  educationStarterTemplates,
  entertainmentGlowTemplates,
  luxuryShopTemplates,
};
