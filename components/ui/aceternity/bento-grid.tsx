"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[18rem]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  gradient = "from-[var(--accent-orange)] to-[var(--accent-amber)]",
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: string;
}) => {
  return (
    <div className={cn("relative p-[2px] rounded-2xl group/bento", className)}>
      {/* Gradient border background - shows on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300",
          `bg-gradient-to-br ${gradient}`
        )}
      />

      {/* Default border - hides on hover */}
      <div className="absolute inset-0 rounded-2xl bg-zinc-200 dark:bg-zinc-800 group-hover/bento:opacity-0 transition-opacity duration-300" />

      {/* Card content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative flex flex-col overflow-hidden rounded-[14px] bg-white dark:bg-zinc-900 h-full shadow-sm group-hover/bento:shadow-lg transition-shadow duration-300"
      >
        {/* Header area (optional visual) */}
        {header && (
          <div className="relative min-h-[8rem] overflow-hidden">
            {header}
          </div>
        )}

        {/* Content area */}
        <div className="relative p-6 flex-1">
          {/* Icon */}
          {icon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-md",
                `bg-gradient-to-r ${gradient} text-white`
              )}
            >
              {icon}
            </motion.div>
          )}

          {/* Title */}
          <div className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </div>

          {/* Description */}
          <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Decorative corner gradient */}
        <div
          className={cn(
            "absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover/bento:opacity-30 pointer-events-none",
            `bg-gradient-to-br ${gradient}`
          )}
        />
      </motion.div>
    </div>
  );
};
