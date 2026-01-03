"use client";

import useSWR from "swr";
import type { MediaAsset } from "@/types";

interface MediaAssetWithUsage extends MediaAsset {
  usageCount: number;
  usages?: {
    previewId: string;
    previewName: string;
    projectId: string;
    projectName: string;
  }[];
}

interface MediaResponse {
  success: boolean;
  assets: MediaAssetWithUsage[];
  storage: {
    totalBytes: number;
    assetCount: number;
  };
}

interface UseMediaOptions {
  search?: string;
  unused?: boolean;
  limit?: number;
}

const fetcher = async (url: string): Promise<MediaResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch media");
  }
  return response.json();
};

/**
 * SWR hook for fetching media assets with caching
 */
export function useMedia(options: UseMediaOptions = {}) {
  const { search, unused, limit } = options;

  // Build query params
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (unused) params.set("unused", "true");
  if (limit) params.set("limit", limit.toString());

  const queryString = params.toString();
  const url = `/api/media${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<MediaResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    assets: data?.assets ?? [],
    recentAssets: (data?.assets ?? []).slice(0, 6),
    totalStorage: data?.storage?.totalBytes ?? 0,
    assetCount: data?.storage?.assetCount ?? 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}

/**
 * SWR key for media - use this to invalidate cache from other components
 */
export const MEDIA_CACHE_KEY = "/api/media";

/**
 * Invalidate all media cache entries
 * Call this after uploading or deleting media
 */
export function invalidateMediaCache() {
  // This will be used with useSWRConfig().mutate
  return MEDIA_CACHE_KEY;
}
