import type { AppStoreCategory } from "@/types";

// App Store category definitions with icons and metadata
export interface CategoryDefinition {
  id: AppStoreCategory;
  name: string;
  icon: string; // Lucide icon name
  description: string;
}

export const appStoreCategories: CategoryDefinition[] = [
  {
    id: "ecommerce",
    name: "Ecommerce",
    icon: "ShoppingBag",
    description: "Online stores, marketplaces, and retail apps",
  },
  {
    id: "finance",
    name: "Finance",
    icon: "Wallet",
    description: "Banking, investing, budgeting, and payment apps",
  },
  {
    id: "social-networking",
    name: "Social",
    icon: "Users",
    description: "Social media, messaging, and community apps",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "ShoppingCart",
    description: "Shopping lists, deals, and comparison apps",
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: "CheckSquare",
    description: "Task management, notes, and workflow apps",
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    icon: "Heart",
    description: "Workout, nutrition, and wellness apps",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Play",
    description: "Streaming, gaming, and media apps",
  },
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    description: "Learning, courses, and educational apps",
  },
  {
    id: "travel",
    name: "Travel",
    icon: "Plane",
    description: "Booking, navigation, and travel planning apps",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "Wrench",
    description: "Tools, calculators, and system utilities",
  },
];

// Helper to get category by ID
export function getCategoryById(id: AppStoreCategory): CategoryDefinition | undefined {
  return appStoreCategories.find((cat) => cat.id === id);
}

// Helper to get category name by ID
export function getCategoryName(id: AppStoreCategory): string {
  return getCategoryById(id)?.name || id;
}
