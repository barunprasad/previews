"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  FolderOpen,
  LayoutTemplate,
  Plus,
  Smartphone,
  Shield,
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
import { UserMenu } from "./user-menu";

interface DashboardHeaderProps {
  user: {
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    isAdmin?: boolean;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const isProjectsActive = pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/");
  const isTemplatesActive = pathname === "/dashboard/templates";

  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4 md:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Smartphone className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold hidden sm:inline">Previews</span>
          </Link>

          {/* Navigation Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/projects"
                  className={isProjectsActive ? "bg-accent" : ""}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Projects
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/templates"
                  className={isTemplatesActive ? "bg-accent" : ""}
                >
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Template Library
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blank Project
                </Link>
              </DropdownMenuItem>
              {user.isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
