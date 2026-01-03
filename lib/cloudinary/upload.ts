import type { CloudinaryUploadResponse } from "@/types";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const MAX_RETRIES = 1;

interface SignatureData {
  signature: string;
  timestamp: number;
  folder: string;
  publicId: string;
  apiKey: string;
}

interface SignatureResponse {
  success: boolean;
  signatures: SignatureData | SignatureData[];
  error?: string;
}

/**
 * Get signed upload parameters from our API
 */
async function getUploadSignature(
  projectId: string,
  count: number = 1
): Promise<SignatureData[]> {
  const response = await fetch("/api/cloudinary/signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, count }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get upload signature");
  }

  const data: SignatureResponse = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to get upload signature");
  }

  // Normalize to array
  return Array.isArray(data.signatures) ? data.signatures : [data.signatures];
}

/**
 * Upload a single file to Cloudinary with signature
 */
async function uploadWithSignature(
  file: Blob,
  signatureData: SignatureData
): Promise<CloudinaryUploadResponse> {
  if (!CLOUDINARY_CLOUD) {
    throw new Error("Cloudinary cloud name is missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", signatureData.timestamp.toString());
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);
  formData.append("public_id", signatureData.publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Failed to upload image");
  }

  return result;
}

/**
 * Check if error is due to expired/invalid signature
 */
function isSignatureError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("signature") ||
      message.includes("timestamp") ||
      message.includes("invalid") ||
      message.includes("expired")
    );
  }
  return false;
}

/**
 * Upload a single image to Cloudinary with automatic signature handling
 * Retries once if signature expires
 */
export async function uploadToCloudinary(
  file: Blob,
  projectId: string,
  _index: number = 0 // Kept for backwards compatibility, not used
): Promise<CloudinaryUploadResponse> {
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      // Always get fresh signature right before upload
      const [signatureData] = await getUploadSignature(projectId, 1);

      // Attempt upload
      return await uploadWithSignature(file, signatureData);
    } catch (error) {
      // Only retry on signature errors, and only once
      if (isSignatureError(error) && retries < MAX_RETRIES) {
        console.warn("Signature expired or invalid, retrying with fresh signature...");
        retries++;
        continue;
      }

      // Re-throw other errors or if max retries reached
      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Upload failed after retries");
}

/**
 * Upload multiple images to Cloudinary with batch signature optimization
 */
export async function uploadMultipleToCloudinary(
  files: Blob[],
  projectId: string
): Promise<CloudinaryUploadResponse[]> {
  if (files.length === 0) {
    return [];
  }

  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      // Get all signatures in one request (batch optimization)
      const signatures = await getUploadSignature(projectId, files.length);

      // Upload all files with their signatures
      const uploadPromises = files.map((file, index) =>
        uploadWithSignature(file, signatures[index])
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      // Only retry on signature errors, and only once
      if (isSignatureError(error) && retries < MAX_RETRIES) {
        console.warn("Signature expired or invalid, retrying batch upload...");
        retries++;
        continue;
      }

      throw error;
    }
  }

  throw new Error("Batch upload failed after retries");
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  if (!CLOUDINARY_CLOUD) {
    throw new Error("Cloudinary configuration is missing");
  }

  const transformations: string[] = [];

  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options?.quality) {
    transformations.push(`q_${options.quality}`);
  }
  if (options?.format) {
    transformations.push(`f_${options.format}`);
  }

  const transformString =
    transformations.length > 0 ? `${transformations.join(",")}/` : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformString}${publicId}`;
}
