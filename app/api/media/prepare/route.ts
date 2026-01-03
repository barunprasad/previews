import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Generate SHA-1 signature for Cloudinary upload
 */
async function generateSignature(
  params: Record<string, string>,
  secret: string
): Promise<string> {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = sortedParams + secret;
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Prepare upload - check for duplicates and return signed upload params
 * POST /api/media/prepare
 * Body: { contentHash, filename, mimeType, sizeBytes }
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
    const { contentHash, filename, mimeType, sizeBytes } = await request.json();

    if (!contentHash || !filename || !mimeType) {
      return NextResponse.json(
        { error: "contentHash, filename, and mimeType are required" },
        { status: 400 }
      );
    }

    // 3. Check if file already exists for this user (deduplication)
    const { data: existingAsset } = await supabase
      .from("media_assets")
      .select("*")
      .eq("user_id", user.id)
      .eq("content_hash", contentHash)
      .single();

    if (existingAsset) {
      // Return existing asset - no need to upload
      return NextResponse.json({
        success: true,
        deduplicated: true,
        asset: {
          id: existingAsset.id,
          userId: existingAsset.user_id,
          cloudinaryPublicId: existingAsset.cloudinary_public_id,
          cloudinaryUrl: existingAsset.cloudinary_url,
          contentHash: existingAsset.content_hash,
          filename: existingAsset.filename,
          mimeType: existingAsset.mime_type,
          sizeBytes: existingAsset.size_bytes,
          width: existingAsset.width,
          height: existingAsset.height,
          createdAt: existingAsset.created_at,
          lastUsedAt: existingAsset.last_used_at,
        },
      });
    }

    // 4. Check Cloudinary config
    if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    // 5. Create asset record first to get ID
    const { data: newAsset, error: insertError } = await supabase
      .from("media_assets")
      .insert({
        user_id: user.id,
        content_hash: contentHash,
        filename: filename,
        mime_type: mimeType,
        size_bytes: sizeBytes || 0,
        // Temporary values until Cloudinary upload completes
        cloudinary_public_id: "pending",
        cloudinary_url: "pending",
      })
      .select()
      .single();

    if (insertError || !newAsset) {
      return NextResponse.json(
        { error: "Failed to create asset record" },
        { status: 500 }
      );
    }

    // 6. Generate signed upload params for direct client upload
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `media/${user.id}`;
    const publicId = newAsset.id;

    const params: Record<string, string> = {
      folder,
      public_id: publicId,
      timestamp: timestamp.toString(),
    };

    const signature = await generateSignature(params, CLOUDINARY_API_SECRET);

    return NextResponse.json({
      success: true,
      deduplicated: false,
      assetId: newAsset.id,
      uploadParams: {
        cloudName: CLOUDINARY_CLOUD,
        apiKey: CLOUDINARY_API_KEY,
        signature,
        timestamp,
        folder,
        publicId,
      },
    });
  } catch (error) {
    console.error("Prepare upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prepare failed" },
      { status: 500 }
    );
  }
}
