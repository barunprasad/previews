"use client";

import { useState, useCallback } from "react";
import {
  removeBackgroundFromDataUrl,
  blobToDataUrl,
  type BackgroundRemovalProgress,
} from "@/lib/image-processing/background-removal";

interface UseBackgroundRemovalReturn {
  isProcessing: boolean;
  progress: BackgroundRemovalProgress | null;
  removeBackground: (dataUrl: string) => Promise<string | null>;
  reset: () => void;
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<BackgroundRemovalProgress | null>(
    null
  );

  const removeBackground = useCallback(
    async (dataUrl: string): Promise<string | null> => {
      setIsProcessing(true);
      setProgress({
        status: "loading",
        progress: 0,
        message: "Preparing...",
      });

      try {
        const resultBlob = await removeBackgroundFromDataUrl(
          dataUrl,
          setProgress
        );

        // Convert result blob to data URL
        const resultDataUrl = await blobToDataUrl(resultBlob);

        setProgress({
          status: "complete",
          progress: 100,
          message: "Background removed!",
        });

        return resultDataUrl;
      } catch (error) {
        console.error("Background removal failed:", error);
        setProgress({
          status: "error",
          progress: 0,
          message:
            error instanceof Error
              ? error.message
              : "Failed to remove background",
        });
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(null);
  }, []);

  return {
    isProcessing,
    progress,
    removeBackground,
    reset,
  };
}
