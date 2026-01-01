"use client";

import { useCallback, useRef, useState } from "react";
import type { Canvas } from "fabric";

interface HistoryEntry {
  canvasJson: string;
  background: string;
}

interface CanvasHistoryOptions {
  maxHistory?: number;
}

export function useCanvasHistory(options: CanvasHistoryOptions = {}) {
  const { maxHistory = 50 } = options;

  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Save current state to history
  const saveState = useCallback((canvas: Canvas, background?: string) => {
    // Skip if this change is from undo/redo (don't reset flag here - undo/redo will reset it)
    if (isUndoRedoRef.current) {
      return;
    }

    const canvasJson = JSON.stringify(canvas.toJSON());
    const entry: HistoryEntry = {
      canvasJson,
      background: background || "#0a0a0a",
    };

    // Remove any redo states
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);

    // Add new state
    historyRef.current.push(entry);

    // Limit history size
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [maxHistory]);

  // Undo to previous state - returns the background to restore
  const undo = useCallback(async (canvas: Canvas): Promise<string | null> => {
    if (historyIndexRef.current <= 0) return null;

    isUndoRedoRef.current = true;
    historyIndexRef.current--;

    const entry = historyRef.current[historyIndexRef.current];
    await canvas.loadFromJSON(JSON.parse(entry.canvasJson));
    canvas.renderAll();

    // Reset flag after all events have fired
    isUndoRedoRef.current = false;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);

    return entry.background;
  }, []);

  // Redo to next state - returns the background to restore
  const redo = useCallback(async (canvas: Canvas): Promise<string | null> => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return null;

    isUndoRedoRef.current = true;
    historyIndexRef.current++;

    const entry = historyRef.current[historyIndexRef.current];
    await canvas.loadFromJSON(JSON.parse(entry.canvasJson));
    canvas.renderAll();

    // Reset flag after all events have fired
    isUndoRedoRef.current = false;

    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

    return entry.background;
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  // Initialize history with current state
  const initHistory = useCallback((canvas: Canvas, background?: string) => {
    clearHistory();
    saveState(canvas, background);
  }, [clearHistory, saveState]);

  return {
    saveState,
    undo,
    redo,
    clearHistory,
    initHistory,
    canUndo,
    canRedo,
  };
}
