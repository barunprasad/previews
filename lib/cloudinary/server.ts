// Server-side Cloudinary operations (requires API key and secret)

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Check if Cloudinary server-side operations are configured
 */
export function isCloudinaryServerConfigured(): boolean {
  return !!(CLOUDINARY_CLOUD && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

/**
 * Cloudinary asset type returned from Admin API
 */
export interface CloudinaryAsset {
  public_id: string;
  format: string;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  folder: string;
  asset_id: string;
}

/**
 * Fetch all assets from Cloudinary Admin API
 */
export async function listCloudinaryAssets(options?: {
  maxResults?: number;
  nextCursor?: string;
  resourceType?: "image" | "video" | "raw";
  prefix?: string; // Filter by folder/prefix
}): Promise<{
  assets: CloudinaryAsset[];
  nextCursor: string | null;
  totalCount: number;
} | null> {
  if (!isCloudinaryServerConfigured()) {
    return null;
  }

  const resourceType = options?.resourceType || "image";
  const maxResults = options?.maxResults || 100;

  // Build URL with query params
  const params = new URLSearchParams({
    max_results: maxResults.toString(),
  });

  if (options?.nextCursor) {
    params.append("next_cursor", options.nextCursor);
  }

  if (options?.prefix) {
    params.append("prefix", options.prefix);
  }

  // When using prefix, we need to specify type (upload, private, authenticated)
  const type = "upload";
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/${resourceType}/${type}?${params}`;

  // Basic auth with API key and secret
  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error("Failed to fetch Cloudinary assets:", await response.text());
      return null;
    }

    const data = await response.json();

    return {
      assets: data.resources || [],
      nextCursor: data.next_cursor || null,
      totalCount: data.total_count || data.resources?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching Cloudinary assets:", error);
    return null;
  }
}

/**
 * Get Cloudinary usage/storage stats
 */
export async function getCloudinaryUsage(): Promise<{
  storage: { used: number; limit: number };
  bandwidth: { used: number; limit: number };
  requests: number;
  resources: number;
  transformations: { used: number; limit: number };
  credits: { used: number; limit: number };
  plan: string;
} | null> {
  if (!isCloudinaryServerConfigured()) {
    return null;
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/usage`;
  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch Cloudinary usage:", await response.text());
      return null;
    }

    const data = await response.json();

    // Log the response to see actual structure
    console.log("Cloudinary usage response:", JSON.stringify(data, null, 2));

    return {
      storage: {
        used: data.storage?.usage ?? data.storage ?? 0,
        limit: data.storage?.limit ?? data.storage_quota ?? 0,
      },
      bandwidth: {
        used: data.bandwidth?.usage ?? data.bandwidth ?? 0,
        limit: data.bandwidth?.limit ?? data.bandwidth_quota ?? 0,
      },
      requests: data.requests ?? data.last_updated ?? 0,
      resources: data.resources ?? data.objects?.usage ?? 0,
      transformations: {
        used: data.transformations?.usage ?? data.transformations ?? 0,
        limit: data.transformations?.limit ?? data.transformations_quota ?? 0,
      },
      credits: {
        used: data.credits?.usage ?? 0,
        limit: data.credits?.limit ?? 0,
      },
      plan: data.plan ?? "Unknown",
    };
  } catch (error) {
    console.error("Error fetching Cloudinary usage:", error);
    return null;
  }
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
    .filter((obj) => (obj.type === "Image" || obj.type === "image") && typeof obj.src === "string")
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
