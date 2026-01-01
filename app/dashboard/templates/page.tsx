"use client";

import { useState } from "react";
import { CategorySidebar } from "@/components/templates/category-sidebar";
import { TemplateLibraryGrid } from "@/components/templates/template-library-grid";
import type { AppStoreCategory } from "@/types";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<AppStoreCategory | "all">("all");

  return (
    <div className="-mx-4 -mt-6 md:-mx-6 lg:-mx-8 flex min-h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar - Category Filters */}
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 p-4 md:block">
        <CategorySidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </aside>

      {/* Main Content - Template Sets Grid */}
      <main className="flex-1 p-4 md:p-6">
        <TemplateLibraryGrid selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
