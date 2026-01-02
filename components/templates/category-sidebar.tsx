"use client";

import {
  ShoppingBag,
  Wallet,
  Users,
  ShoppingCart,
  CheckSquare,
  Heart,
  Play,
  GraduationCap,
  Plane,
  Wrench,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppStoreCategory } from "@/types";
import { appStoreCategories } from "@/lib/templates";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Wallet,
  Users,
  ShoppingCart,
  CheckSquare,
  Heart,
  Play,
  GraduationCap,
  Plane,
  Wrench,
};

interface CategorySidebarProps {
  selectedCategory: AppStoreCategory | "all";
  onCategoryChange: (category: AppStoreCategory | "all") => void;
}

export function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-muted/30 pb-2">
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Filter by app type
        </p>
      </div>

      <nav className="space-y-1">
        {/* All Templates */}
        <button
          onClick={() => onCategoryChange("all")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          All Templates
        </button>

        {/* Category buttons */}
        {appStoreCategories.map((category) => {
          const Icon = iconMap[category.icon] || LayoutGrid;
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
