// Cloudinary configuration utilities

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;

/**
 * Check if Cloudinary is properly configured.
 * Returns true if cloud name is set. API key/secret are validated server-side.
 */
export function isCloudinaryConfigured(): boolean {
  return !!CLOUDINARY_CLOUD;
}

/**
 * Get Cloudinary configuration (for debugging/display purposes).
 * Does not expose the actual values, just whether they're set.
 */
export function getCloudinaryStatus(): {
  configured: boolean;
  hasCloudName: boolean;
} {
  return {
    configured: isCloudinaryConfigured(),
    hasCloudName: !!CLOUDINARY_CLOUD,
  };
}
