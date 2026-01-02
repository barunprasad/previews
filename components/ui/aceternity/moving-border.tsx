"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "16px",
  ry = "16px",
  className,
  containerClassName,
  borderClassName,
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) => {
  return (
    <Component
      className={cn(
        "relative h-fit w-fit overflow-hidden bg-transparent p-[1px]",
        containerClassName
      )}
      style={{
        borderRadius: rx,
      }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: rx }}
      >
        <MovingBorderSVG duration={duration} rx={rx} ry={ry} borderClassName={borderClassName} />
      </div>
      <div
        className={cn(
          "relative z-10 bg-background backdrop-blur-xl",
          className
        )}
        style={{
          borderRadius: `calc(${rx} - 1px)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};

const MovingBorderSVG = ({
  duration = 2000,
  rx = "16px",
  ry = "16px",
  borderClassName,
}: {
  duration?: number;
  rx?: string;
  ry?: string;
  borderClassName?: string;
}) => {
  const pathRef = React.useRef<SVGRectElement>(null);
  const [pathLength, setPathLength] = React.useState(0);

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="absolute h-full w-full"
      width="100%"
      height="100%"
    >
      <rect
        fill="none"
        width="100%"
        height="100%"
        rx={rx}
        ry={ry}
        ref={pathRef}
        strokeWidth="2"
        className={cn(
          "stroke-[var(--accent-orange)]",
          borderClassName
        )}
        strokeDasharray={`${pathLength / 3} ${pathLength / 3}`}
        strokeDashoffset="0"
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`0;${-pathLength}`}
          dur={`${duration}ms`}
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
};

// Button variant of moving border
export const MovingBorderButton = ({
  children,
  className,
  containerClassName,
  borderClassName,
  duration = 2500,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  [key: string]: unknown;
}) => {
  return (
    <MovingBorder
      duration={duration}
      containerClassName={cn(
        "group cursor-pointer",
        containerClassName
      )}
      className={cn(
        "flex items-center justify-center px-6 py-3 font-medium transition-all",
        className
      )}
      borderClassName={borderClassName}
      rx="12px"
      ry="12px"
      {...props}
    >
      {children}
    </MovingBorder>
  );
};
