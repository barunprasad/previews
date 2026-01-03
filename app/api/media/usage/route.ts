import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Update media asset usage tracking for a preview
 * POST /api/media/usage
 * Body: { previewId: string, canvasJson: object }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { previewId, canvasJson } = await request.json();

    if (!previewId || !canvasJson) {
      return NextResponse.json(
        { error: "previewId and canvasJson are required" },
        { status: 400 }
      );
    }

    // Extract all Cloudinary URLs from canvas JSON
    const cloudinaryUrls = extractCloudinaryUrls(canvasJson);

    if (cloudinaryUrls.length === 0) {
      // No Cloudinary URLs - clear any existing usages for this preview
      await supabase
        .from("media_asset_usages")
        .delete()
        .eq("preview_id", previewId);

      return NextResponse.json({ success: true, usagesUpdated: 0 });
    }

    // Find media assets by their URLs
    const { data: assets, error: assetsError } = await supabase
      .from("media_assets")
      .select("id, cloudinary_url")
      .eq("user_id", user.id)
      .in("cloudinary_url", cloudinaryUrls);

    if (assetsError) {
      console.error("Error fetching assets:", assetsError);
      return NextResponse.json(
        { error: "Failed to fetch assets" },
        { status: 500 }
      );
    }

    // Get current usages for this preview
    const { data: existingUsages } = await supabase
      .from("media_asset_usages")
      .select("media_asset_id")
      .eq("preview_id", previewId);

    const existingAssetIds = new Set(
      (existingUsages || []).map((u) => u.media_asset_id)
    );
    const currentAssetIds = new Set((assets || []).map((a) => a.id));

    // Determine which usages to add and remove
    const toAdd = [...currentAssetIds].filter((id) => !existingAssetIds.has(id));
    const toRemove = [...existingAssetIds].filter(
      (id) => !currentAssetIds.has(id)
    );

    // Remove old usages
    if (toRemove.length > 0) {
      await supabase
        .from("media_asset_usages")
        .delete()
        .eq("preview_id", previewId)
        .in("media_asset_id", toRemove);
    }

    // Add new usages
    if (toAdd.length > 0) {
      const newUsages = toAdd.map((assetId) => ({
        media_asset_id: assetId,
        preview_id: previewId,
      }));

      await supabase.from("media_asset_usages").insert(newUsages);
    }

    // Update last_used_at for all current assets
    if (assets && assets.length > 0) {
      const assetIds = assets.map((a) => a.id);
      await supabase
        .from("media_assets")
        .update({ last_used_at: new Date().toISOString() })
        .in("id", assetIds);
    }

    return NextResponse.json({
      success: true,
      usagesUpdated: toAdd.length + toRemove.length,
      assetsFound: assets?.length || 0,
    });
  } catch (error) {
    console.error("Usage tracking error:", error);
    return NextResponse.json(
      { error: "Failed to update usage tracking" },
      { status: 500 }
    );
  }
}

/**
 * Extract all Cloudinary URLs from canvas JSON
 */
function extractCloudinaryUrls(canvasJson: Record<string, unknown>): string[] {
  const urls: Set<string> = new Set();

  // Cloudinary URL pattern
  const cloudinaryPattern = /https:\/\/res\.cloudinary\.com\//;

  function extractFromObject(obj: unknown): void {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      obj.forEach(extractFromObject);
      return;
    }

    const record = obj as Record<string, unknown>;

    // Check for src property (images)
    if (typeof record.src === "string" && cloudinaryPattern.test(record.src)) {
      urls.add(record.src);
    }

    // Recursively check all properties
    for (const value of Object.values(record)) {
      if (value && typeof value === "object") {
        extractFromObject(value);
      }
    }
  }

  extractFromObject(canvasJson);
  return [...urls];
}
