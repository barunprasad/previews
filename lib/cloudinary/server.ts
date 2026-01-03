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
