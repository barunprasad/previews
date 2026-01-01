import { removeBackground, Config } from "@imgly/background-removal";

export interface BackgroundRemovalProgress {
  status: "loading" | "processing" | "complete" | "error";
  progress: number; // 0-100
  message: string;
}

export type ProgressCallback = (progress: BackgroundRemovalProgress) => void;

// Default configuration for background removal
const defaultConfig: Partial<Config> = {
  // Use web workers for better performance
  // Model will be downloaded on first use
  output: {
    format: "image/png",
    quality: 1,
  },
};

/**
 * Remove background from an image blob
 * Uses client-side WASM model - no server/cloud required
 */
export async function removeImageBackground(
  imageBlob: Blob,
  onProgress?: ProgressCallback
): Promise<Blob> {
  try {
    onProgress?.({
      status: "loading",
      progress: 0,
      message: "Loading AI model...",
    });

    // The library automatically handles model loading
    const result = await removeBackground(imageBlob, {
      ...defaultConfig,
      progress: (key, current, total) => {
        // Convert progress updates to our format
        const percentage = Math.round((current / total) * 100);

        if (key === "fetch:model") {
          onProgress?.({
            status: "loading",
            progress: percentage * 0.5, // Model loading is 0-50%
            message: `Downloading AI model... ${percentage}%`,
          });
        } else if (key === "compute:inference") {
          onProgress?.({
            status: "processing",
            progress: 50 + percentage * 0.5, // Processing is 50-100%
            message: `Processing image... ${percentage}%`,
          });
        }
      },
    });

    onProgress?.({
      status: "complete",
      progress: 100,
      message: "Background removed!",
    });

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove background";

    onProgress?.({
      status: "error",
      progress: 0,
      message,
    });

    throw error;
  }
}

/**
 * Remove background from an image URL
 * Converts URL to blob first
 */
export async function removeBackgroundFromUrl(
  imageUrl: string,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.({
    status: "loading",
    progress: 0,
    message: "Loading image...",
  });

  // Fetch the image as blob
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();
  return removeImageBackground(blob, onProgress);
}

/**
 * Remove background from a data URL
 * Converts to blob first
 */
export async function removeBackgroundFromDataUrl(
  dataUrl: string,
  onProgress?: ProgressCallback
): Promise<Blob> {
  onProgress?.({
    status: "loading",
    progress: 0,
    message: "Preparing image...",
  });

  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return removeImageBackground(blob, onProgress);
}

/**
 * Convert blob to data URL for use in canvas
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
