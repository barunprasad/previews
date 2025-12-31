"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, Smartphone, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function ProjectCard({ project, onDelete, onDuplicate }: ProjectCardProps) {
  const deviceLabel = project.deviceType === "iphone" ? "iPhone" : "Android";

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <Link href={`/dashboard/projects/${project.id}`}>
        <div className="relative aspect-[4/3] bg-muted">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Smartphone className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{project.name}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {deviceLabel}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-3 w-1/2" />
      </CardFooter>
    </Card>
  );
}
