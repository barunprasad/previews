"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
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
import { cn } from "@/lib/utils";

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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-orange-200/50 dark:border-white/10"
    >
      <div className="flex h-full items-center px-4 md:px-6">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Navigation Dropdown - Extreme Left */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/20 dark:hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl p-1.5 overflow-hidden">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/projects"
                  className={cn(
                    "flex items-center rounded-lg",
                    isProjectsActive && "bg-orange-500/10 text-orange-500"
                  )}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Projects
                  {isProjectsActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/templates"
                  className={cn(
                    "flex items-center rounded-lg",
                    isTemplatesActive && "bg-orange-500/10 text-orange-500"
                  )}
                >
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Template Library
                  {isTemplatesActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/projects/new"
                  className="flex items-center rounded-lg text-orange-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blank Project
                </Link>
              </DropdownMenuItem>
              {user.isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center rounded-lg">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logo */}
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shadow-soft"
            >
              <Smartphone className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-lg font-bold hidden sm:inline">
              <span className="gradient-text">Previews</span>
            </span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Theme toggle + User menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </motion.header>
  );
}
