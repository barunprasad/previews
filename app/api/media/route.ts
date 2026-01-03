import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const unusedOnly = searchParams.get("unused") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Build query using the view with usage count
    let query = supabase
      .from("media_assets_with_usage")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by search term (filename)
    if (search) {
      query = query.ilike("filename", `%${search}%`);
    }

    // Filter unused only
    if (unusedOnly) {
      query = query.eq("usage_count", 0);
    }

    const { data: assets, error, count } = await query;

    if (error) {
      console.error("Error fetching media assets:", error);
      return NextResponse.json(
        { error: "Failed to fetch media assets" },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedAssets = (assets || []).map((asset) => ({
      id: asset.id,
      userId: asset.user_id,
      cloudinaryPublicId: asset.cloudinary_public_id,
      cloudinaryUrl: asset.cloudinary_url,
      contentHash: asset.content_hash,
      filename: asset.filename,
      mimeType: asset.mime_type,
      sizeBytes: asset.size_bytes,
      width: asset.width,
      height: asset.height,
      createdAt: asset.created_at,
      lastUsedAt: asset.last_used_at,
      usageCount: asset.usage_count,
    }));

    // Calculate storage stats
    const totalBytes = (assets || []).reduce(
      (sum, asset) => sum + (asset.size_bytes || 0),
      0
    );

    return NextResponse.json({
      success: true,
      assets: transformedAssets,
      total: count || 0,
      storage: {
        totalBytes,
        totalMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Media list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media assets" },
      { status: 500 }
    );
  }
}
