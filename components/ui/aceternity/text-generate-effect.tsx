"use client";

import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  highlightWords = [],
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  highlightWords?: string[];
}) => {
  const [scope, animate] = useAnimate();
  const [hasAnimated, setHasAnimated] = useState(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (hasAnimated) return;

    animate(
      "span.word",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration,
        delay: stagger(0.1),
      }
    );
    setHasAnimated(true);
  }, [animate, duration, filter, hasAnimated]);

  const isHighlighted = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
    return highlightWords.some(hw => hw.toLowerCase() === cleanWord);
  };

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          const highlighted = isHighlighted(word);
          return (
            <motion.span
              key={word + idx}
              className={cn(
                "word opacity-0",
                filter && "blur-sm",
                highlighted && "bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-coral)] to-[var(--accent-rose)] bg-clip-text text-transparent"
              )}
              style={{
                filter: filter ? "blur(8px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="leading-snug tracking-tight">
        {renderWords()}
      </div>
    </div>
  );
};
