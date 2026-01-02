"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Shield,
  Cloud,
  Smartphone,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderOpen,
  },
  {
    href: "/admin/assets",
    label: "Assets",
    icon: Cloud,
  },
];

export function AdminHeader() {
  const pathname = usePathname();

  const isActive = (item: typeof adminNavItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <header className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-orange-200/50 dark:border-white/10">
      <div className="flex h-full items-center px-4 md:px-6 gap-4">
        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {adminNavItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2",
                    isActive(item) && "text-orange-500"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Back to App
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 shadow-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold">Admin</span>
            <span className="text-xs text-muted-foreground ml-2 hidden lg:inline">Console</span>
          </div>
        </Link>

        {/* Desktop Navigation - Tab style */}
        <nav className="hidden md:flex items-center h-full ml-6">
          {adminNavItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 h-full text-sm font-medium transition-colors",
                  active
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* App switcher */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-sm font-medium transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">App</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
