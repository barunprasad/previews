"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FolderOpen, Plus, LayoutTemplate, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-500/20 p-8 text-center overflow-hidden"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[200px] h-[200px] bg-orange-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Icon with glow effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative"
      >
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-500/20">
          <FolderOpen className="h-10 w-10 text-orange-500" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6"
      >
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            No projects yet
          </h3>
          <Sparkles className="h-5 w-5 text-orange-500" />
        </div>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create your first project to start generating beautiful app store previews.
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Button
          variant="outline"
          asChild
          className="rounded-xl border-2 border-dashed hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300"
        >
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Blank
          </Link>
        </Button>
        <Button
          asChild
          className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
        >
          <Link href="/dashboard/templates">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            Use Template
          </Link>
        </Button>
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-6 text-xs text-muted-foreground"
      >
        Start from scratch or choose from professional templates
      </motion.p>
    </motion.div>
  );
}
