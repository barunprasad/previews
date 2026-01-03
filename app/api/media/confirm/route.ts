import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Confirm upload - update asset record with Cloudinary result
 * POST /api/media/confirm
 * Body: { assetId, cloudinaryResult: { secure_url, public_id, width, height } }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request body
    const { assetId, cloudinaryResult } = await request.json();

    if (!assetId || !cloudinaryResult) {
      return NextResponse.json(
        { error: "assetId and cloudinaryResult are required" },
        { status: 400 }
      );
    }

    const { secure_url, public_id, width, height } = cloudinaryResult;

    if (!secure_url || !public_id) {
      return NextResponse.json(
        { error: "Invalid cloudinaryResult" },
        { status: 400 }
      );
    }

    // 3. Update the asset record
    const { data: updatedAsset, error: updateError } = await supabase
      .from("media_assets")
      .update({
        cloudinary_public_id: public_id,
        cloudinary_url: secure_url,
        width: width || null,
        height: height || null,
      })
      .eq("id", assetId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError || !updatedAsset) {
      return NextResponse.json(
        { error: "Failed to update asset record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: {
        id: updatedAsset.id,
        userId: updatedAsset.user_id,
        cloudinaryPublicId: updatedAsset.cloudinary_public_id,
        cloudinaryUrl: updatedAsset.cloudinary_url,
        contentHash: updatedAsset.content_hash,
        filename: updatedAsset.filename,
        mimeType: updatedAsset.mime_type,
        sizeBytes: updatedAsset.size_bytes,
        width: updatedAsset.width,
        height: updatedAsset.height,
        createdAt: updatedAsset.created_at,
        lastUsedAt: updatedAsset.last_used_at,
      },
    });
  } catch (error) {
    console.error("Confirm upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Confirm failed" },
      { status: 500 }
    );
  }
}
