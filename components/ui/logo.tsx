"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "full" | "standard" | "minimal";

interface LogoProps {
  /** Size of the logo */
  size?: LogoSize;
  /**
   * Variant style:
   * - "full": Icon + text with glow effect (marketing)
   * - "standard": Icon + text with gradient (dashboard)
   * - "minimal": Icon + plain text (sidebar)
   */
  variant?: LogoVariant;
  /** Link destination */
  href?: string;
  /** Whether to animate on hover */
  animated?: boolean;
  /** Hide text on small screens */
  hideTextOnMobile?: boolean;
  /** Whether to show the accent underline (default: true) */
  showUnderline?: boolean;
  /** Additional className */
  className?: string;
}

const sizeConfig = {
  sm: {
    icon: "h-7 w-7 rounded-lg",
    iconInner: "h-3.5 w-3.5",
    text: "text-base",
    underlineWidth: "w-[42px]",
    gap: "gap-2",
  },
  md: {
    icon: "h-8 w-8 rounded-lg",
    iconInner: "h-4 w-4",
    text: "text-lg",
    underlineWidth: "w-[48px]",
    gap: "gap-2.5",
  },
  lg: {
    icon: "h-9 w-9 rounded-xl",
    iconInner: "h-4.5 w-4.5",
    text: "text-xl",
    underlineWidth: "w-[52px]",
    gap: "gap-2.5",
  },
};

export function Logo({
  size = "md",
  variant = "full",
  href = "/",
  animated = true,
  hideTextOnMobile = false,
  showUnderline = true,
  className,
}: LogoProps) {
  const config = sizeConfig[size];
  const showGlow = variant === "full";
  const useGradientText = variant !== "minimal";

  const textShadowStyle = showGlow
    ? {
        textShadow:
          "0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(251, 146, 60, 0.2)",
      }
    : undefined;

  const content = (
    <>
      {/* Icon */}
      <motion.div
        whileHover={animated ? { scale: 1.05 } : undefined}
        whileTap={animated ? { scale: 0.95 } : undefined}
        className={cn(
          "relative flex items-center justify-center",
          config.icon,
          variant === "minimal" ? "bg-primary" : "gradient-bg shadow-soft"
        )}
      >
        <Smartphone
          className={cn(
            config.iconInner,
            variant === "minimal" ? "text-primary-foreground" : "text-white"
          )}
        />
        {animated && variant !== "minimal" && (
          <div className="absolute inset-0 rounded-[inherit] bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </motion.div>

      {/* Text */}
      <span
        className={cn(
          "relative font-bold tracking-tight",
          config.text,
          hideTextOnMobile && "hidden sm:inline"
        )}
      >
        {useGradientText ? (
          <>
            <span className="gradient-text" style={textShadowStyle}>
              Pre
            </span>
            <span className="gradient-text" style={textShadowStyle}>
              views
            </span>
          </>
        ) : (
          <span>Previews</span>
        )}

        {/* Accent underline */}
        {showUnderline && (
          <span
            className={cn(
              "absolute -bottom-1 right-0 h-[2px] rounded-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-amber)] opacity-80",
              config.underlineWidth
            )}
          />
        )}
      </span>
    </>
  );

  const wrapperClassName = cn(
    "group flex items-center",
    config.gap,
    className
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClassName}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
