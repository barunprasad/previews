"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Apple,
  Smartphone as AndroidIcon
} from "lucide-react";
import { staggerItemVariants } from "@/lib/animations/variants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ProjectCard({ project, onDelete, onDuplicate }: ProjectCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const previewThumbnails = (project.previews || [])
    .map(p => p.thumbnailUrl)
    .filter((url): url is string => url !== null && url !== undefined);
  const thumbnails: string[] = previewThumbnails.length > 0
    ? previewThumbnails
    : project.thumbnailUrl
      ? [project.thumbnailUrl]
      : [];

  const hasMultiple = thumbnails.length > 1;
  const previewCount = project.previews?.length || 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative group"
    >
      {/* Hover glow effect - warm tones */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl opacity-0 blur-md"
        style={{
          background: "linear-gradient(135deg, rgba(249, 115, 22, 0.4), rgba(251, 146, 60, 0.3))",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:border-orange-500/30">
        <Link href={`/dashboard/projects/${project.id}`} className="block">
          {/* Thumbnail area */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            {thumbnails.length > 0 ? (
              <>
                <motion.img
                  src={thumbnails[currentIndex]}
                  alt={`${project.name} - Preview ${currentIndex + 1}`}
                  className="h-full w-full object-cover"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />

                {/* Gradient overlay - always visible at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Navigation arrows */}
                <AnimatePresence>
                  {hasMultiple && isHovered && (
                    <>
                      <motion.button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}
                </AnimatePresence>

                {/* Dots indicator */}
                {hasMultiple && (
                  <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-1">
                    {thumbnails.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={cn(
                          "h-1 rounded-full transition-all duration-200",
                          idx === currentIndex
                            ? "w-4 bg-white"
                            : "w-1 bg-white/40 hover:bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Title overlay on image */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="text-white font-semibold text-sm truncate drop-shadow-md">
                    {project.name}
                  </h3>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted-foreground/10"
                >
                  <Layers className="h-8 w-8 text-muted-foreground/40" />
                </motion.div>
                {/* Title for empty state */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
                  <h3 className="font-semibold text-sm truncate">
                    {project.name}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Card footer */}
        <div className="p-3 flex items-center justify-between gap-2">
          {/* Meta info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Device type */}
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              project.deviceType === "iphone" ? "text-orange-500" : "text-amber-600"
            )}>
              {project.deviceType === "iphone" ? (
                <Apple className="h-3.5 w-3.5" />
              ) : (
                <AndroidIcon className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {project.deviceType === "iphone" ? "iOS" : "Android"}
              </span>
            </div>

            {/* Divider */}
            <div className="h-3 w-px bg-border" />

            {/* Preview count */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              <span>{previewCount}</span>
            </div>

            {/* Divider */}
            <div className="h-3 w-px bg-border" />

            {/* Updated time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: false })}
              </span>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 bg-background/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-lg"
            >
              <DropdownMenuItem asChild className="rounded-md text-sm">
                <Link href={`/dashboard/projects/${project.id}`} className="gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem
                  onClick={() => onDuplicate(project.id)}
                  className="gap-2 rounded-md text-sm"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="gap-2 rounded-md text-sm text-red-500 focus:text-red-500 focus:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm">
      <div className="aspect-[16/10] bg-muted shimmer" />
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );
}
