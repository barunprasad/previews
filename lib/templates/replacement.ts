import type { Canvas, FabricImage } from "fabric";
import type { PlaceholderData } from "@/types";

// Extended FabricImage type with custom data property
type FabricImageWithData = FabricImage & {
  data?: PlaceholderData;
};

/**
 * Find all replaceable (placeholder) objects in a canvas
 */
export function findReplaceableObjects(canvas: Canvas): FabricImageWithData[] {
  return canvas.getObjects().filter((obj) => {
    if (obj.type !== "image") return false;
    const imgObj = obj as FabricImageWithData;
    return imgObj.data?.isPlaceholder === true;
  }) as FabricImageWithData[];
}

/**
 * Check if an object is a placeholder that can be replaced
 */
export function isPlaceholderObject(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const fabricObj = obj as { type?: string; data?: PlaceholderData };
  if (fabricObj.type !== "image") return false;
  return fabricObj.data?.isPlaceholder === true;
}

/**
 * Get the replacement slot for a placeholder object
 */
export function getPlaceholderSlot(
  obj: FabricImageWithData
): "primary" | "secondary" | null {
  if (!obj.data?.isPlaceholder) return null;
  return obj.data.replacementSlot || null;
}

/**
 * Replace a placeholder screenshot with a new image
 * Scales new image to match the placeholder's displayed size
 * Preserves position, angle, and origin
 */
export async function replaceScreenshot(
  canvas: Canvas,
  targetObject: FabricImageWithData,
  newImageUrl: string,
  FabricImageClass: typeof FabricImage
): Promise<FabricImageWithData> {
  // Calculate the displayed size of the placeholder
  const placeholderDisplayWidth = (targetObject.width || 0) * (targetObject.scaleX || 1);
  const placeholderDisplayHeight = (targetObject.height || 0) * (targetObject.scaleY || 1);

  // Store position, angle, and shadow
  const { left, top, angle, originX, originY, shadow } = targetObject;

  // Load new image
  const newImage = await FabricImageClass.fromURL(newImageUrl, {
    crossOrigin: "anonymous",
  });

  // Calculate scale to match the placeholder's displayed size
  const newImageWidth = newImage.width || 1;
  const newImageHeight = newImage.height || 1;

  // Scale to fit within placeholder dimensions while maintaining aspect ratio
  const scaleToFitWidth = placeholderDisplayWidth / newImageWidth;
  const scaleToFitHeight = placeholderDisplayHeight / newImageHeight;
  const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

  // Apply transform to match placeholder size and position
  newImage.set({
    left,
    top,
    scaleX: scale,
    scaleY: scale,
    angle,
    originX,
    originY,
    shadow, // Preserve shadow from placeholder
    // Clear placeholder flag - this is now user's image
    data: {
      isPlaceholder: false,
      wasPlaceholder: true,
    },
  });

  // Replace on canvas
  canvas.remove(targetObject);
  canvas.add(newImage);
  canvas.setActiveObject(newImage);
  canvas.renderAll();

  return newImage;
}

/**
 * Replace placeholder by slot name
 */
export async function replaceBySlot(
  canvas: Canvas,
  slot: "primary" | "secondary",
  newImageUrl: string,
  FabricImageClass: typeof FabricImage
): Promise<FabricImageWithData | null> {
  const placeholders = findReplaceableObjects(canvas);
  const target = placeholders.find((obj) => getPlaceholderSlot(obj) === slot);

  if (!target) return null;

  return replaceScreenshot(canvas, target, newImageUrl, FabricImageClass);
}

// Export the extended type for use in other files
export type { FabricImageWithData };

/**
 * Check if canvas has any placeholder images
 */
export function hasPlaceholders(canvas: Canvas): boolean {
  return findReplaceableObjects(canvas).length > 0;
}

/**
 * Get count of placeholder images in canvas
 */
export function getPlaceholderCount(canvas: Canvas): number {
  return findReplaceableObjects(canvas).length;
}
