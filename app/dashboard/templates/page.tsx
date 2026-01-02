"use client";

import { useState } from "react";
import { CategorySidebar } from "@/components/templates/category-sidebar";
import { TemplateLibraryGrid } from "@/components/templates/template-library-grid";
import type { AppStoreCategory } from "@/types";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<AppStoreCategory | "all">("all");

  return (
    <div className="-mx-4 -my-8 md:-mx-8 lg:-mx-12 flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Sidebar - Fixed with independent scroll */}
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 md:flex md:flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </aside>

      {/* Main Content - Scrollable with fixed header */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <TemplateLibraryGrid selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
