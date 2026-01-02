"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "previews-recent-colors";
const MAX_RECENT_COLORS = 8;

export function useRecentColors() {
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentColors(parsed.slice(0, MAX_RECENT_COLORS));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Add a color to recent colors
  const addRecentColor = useCallback((color: string) => {
    // Normalize color to lowercase
    const normalizedColor = color.toLowerCase();

    // Skip gradients (only track solid colors)
    if (normalizedColor.startsWith("linear-gradient")) {
      return;
    }

    setRecentColors((prev) => {
      // Remove if already exists
      const filtered = prev.filter((c) => c.toLowerCase() !== normalizedColor);
      // Add to front
      const updated = [normalizedColor, ...filtered].slice(0, MAX_RECENT_COLORS);

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }

      return updated;
    });
  }, []);

  // Clear all recent colors
  const clearRecentColors = useCallback(() => {
    setRecentColors([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  return {
    recentColors,
    addRecentColor,
    clearRecentColors,
  };
}
