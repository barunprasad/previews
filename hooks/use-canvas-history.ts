"use client";

import { useCallback, useRef, useState } from "react";
import type { Canvas } from "fabric";

interface CanvasHistoryOptions {
  maxHistory?: number;
}

export function useCanvasHistory(options: CanvasHistoryOptions = {}) {
  const { maxHistory = 50 } = options;

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Save current state to history
  const saveState = useCallback((canvas: Canvas) => {
    // Skip if this change is from undo/redo (don't reset flag here - undo/redo will reset it)
    if (isUndoRedoRef.current) {
      return;
    }

    const json = JSON.stringify(canvas.toJSON());

    // Remove any redo states
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);

    // Add new state
    historyRef.current.push(json);

    // Limit history size
    if (historyRef.current.length > maxHistory) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, [maxHistory]);

  // Undo to previous state
  const undo = useCallback(async (canvas: Canvas) => {
    if (historyIndexRef.current <= 0) return;

    isUndoRedoRef.current = true;
    historyIndexRef.current--;

    const json = historyRef.current[historyIndexRef.current];
    await canvas.loadFromJSON(JSON.parse(json));
    canvas.renderAll();

    // Reset flag after all events have fired
    isUndoRedoRef.current = false;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }, []);

  // Redo to next state
  const redo = useCallback(async (canvas: Canvas) => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    isUndoRedoRef.current = true;
    historyIndexRef.current++;

    const json = historyRef.current[historyIndexRef.current];
    await canvas.loadFromJSON(JSON.parse(json));
    canvas.renderAll();

    // Reset flag after all events have fired
    isUndoRedoRef.current = false;

    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    historyRef.current = [];
    historyIndexRef.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  // Initialize history with current state
  const initHistory = useCallback((canvas: Canvas) => {
    clearHistory();
    saveState(canvas);
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
