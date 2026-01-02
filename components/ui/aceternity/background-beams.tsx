"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
  ];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
        className
      )}
    >
      <svg
        className="absolute z-0 h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`beam-${index}`}
            d={path}
            stroke={`url(#beam-gradient-${index})`}
            strokeWidth="0.5"
            strokeOpacity="0.1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              pathLength: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: index * 0.2,
              },
              opacity: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: index * 0.2,
              },
            }}
          />
        ))}
        <defs>
          {paths.map((_, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`beam-gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="var(--accent-orange)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent-amber)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--accent-coral)" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};

// Simpler grid beam variant
export const GridBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Vertical beams */}
      <div className="absolute inset-0 flex justify-around">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="h-full w-px bg-gradient-to-b from-transparent via-[var(--accent-orange)]/20 to-transparent"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Horizontal beams */}
      <div className="absolute inset-0 flex flex-col justify-around">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent-amber)]/15 to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.1 + 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Animated glow dots at intersections */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <div className="h-1 w-1 rounded-full bg-[var(--accent-orange)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
