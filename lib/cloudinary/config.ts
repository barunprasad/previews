// Cloudinary configuration utilities

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

/**
 * Check if Cloudinary is properly configured.
 * Returns true if both cloud name and upload preset are set.
 */
export function isCloudinaryConfigured(): boolean {
  return !!(CLOUDINARY_CLOUD && CLOUDINARY_PRESET);
}

/**
 * Get Cloudinary configuration (for debugging/display purposes).
 * Does not expose the actual values, just whether they're set.
 */
export function getCloudinaryStatus(): {
  configured: boolean;
  hasCloudName: boolean;
  hasUploadPreset: boolean;
} {
  return {
    configured: isCloudinaryConfigured(),
    hasCloudName: !!CLOUDINARY_CLOUD,
    hasUploadPreset: !!CLOUDINARY_PRESET,
  };
}
