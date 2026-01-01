// Server-side Cloudinary operations (requires API key and secret)

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Check if Cloudinary server-side operations are configured
 */
function isCloudinaryServerConfigured(): boolean {
  return !!(CLOUDINARY_CLOUD && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

/**
 * Extract public_id from a Cloudinary URL
 * e.g., https://res.cloudinary.com/cloud/image/upload/v123/previews/user/project/file.png
 * returns: previews/user/project/file
 */
function extractPublicId(url: string): string | null {
  if (!CLOUDINARY_CLOUD || !url.includes(CLOUDINARY_CLOUD)) {
    return null;
  }

  // Match the path after /upload/ or /upload/v{version}/
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

/**
 * Delete a single image from Cloudinary by public_id
 */
async function deleteByPublicId(publicId: string): Promise<boolean> {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

  // Create SHA-1 signature
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("signature", signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error("Failed to delete from Cloudinary:", await response.text());
      return false;
    }

    const result = await response.json();
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}

/**
 * Delete all Cloudinary images found in canvas JSON objects
 */
export async function deleteCloudinaryImagesFromCanvas(
  canvasJson: Record<string, unknown> | null
): Promise<void> {
  if (!isCloudinaryServerConfigured() || !canvasJson) return;

  const objects = canvasJson.objects as Array<Record<string, unknown>> | undefined;
  if (!objects) return;

  const deletePromises = objects
    .filter((obj) => obj.type === "image" && typeof obj.src === "string")
    .map((obj) => {
      const publicId = extractPublicId(obj.src as string);
      if (publicId) {
        return deleteByPublicId(publicId);
      }
      return Promise.resolve(false);
    });

  await Promise.allSettled(deletePromises);
}

/**
 * Delete all images for a project's previews
 */
export async function deleteProjectCloudinaryImages(
  previews: Array<{ canvas_json: Record<string, unknown> | null }>
): Promise<void> {
  if (!isCloudinaryServerConfigured()) return;

  await Promise.allSettled(
    previews.map((preview) => deleteCloudinaryImagesFromCanvas(preview.canvas_json))
  );
}
