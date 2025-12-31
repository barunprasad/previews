import type { CloudinaryUploadResponse } from "@/types";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

export async function uploadToCloudinary(
  file: Blob,
  userId: string,
  projectId: string,
  index: number = 0
): Promise<CloudinaryUploadResponse> {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_PRESET) {
    throw new Error("Cloudinary configuration is missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", `previews/${userId}/${projectId}`);
  formData.append("public_id", `screenshot_${index}_${Date.now()}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }

  return response.json();
}

export async function uploadMultipleToCloudinary(
  files: Blob[],
  userId: string,
  projectId: string
): Promise<CloudinaryUploadResponse[]> {
  const uploads = files.map((file, index) =>
    uploadToCloudinary(file, userId, projectId, index)
  );

  return Promise.all(uploads);
}

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
