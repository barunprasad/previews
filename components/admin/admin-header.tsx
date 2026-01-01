"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderOpen,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
];

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4 md:px-6">
        {/* Left: Logo + Admin badge */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold hidden sm:inline">Admin</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Back to dashboard + Theme toggle */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
