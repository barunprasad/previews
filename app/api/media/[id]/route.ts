import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Delete image from Cloudinary
 */
async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!CLOUDINARY_CLOUD || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

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
      console.error("Cloudinary delete failed:", await response.text());
      return false;
    }

    const result = await response.json();
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

// GET - Get single asset with usage details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get asset with usage count
    const { data: asset, error: assetError } = await supabase
      .from("media_assets_with_usage")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Get detailed usage info (which projects/previews use this asset)
    const { data: usages } = await supabase
      .from("media_asset_usages")
      .select(
        `
        id,
        preview_id,
        created_at,
        previews!inner (
          id,
          name,
          project_id,
          projects!inner (
            id,
            name
          )
        )
      `
      )
      .eq("media_asset_id", id);

    // Transform usage data
    const usageDetails = (usages || []).map((usage) => {
      const preview = usage.previews as unknown as {
        id: string;
        name: string;
        project_id: string;
        projects: { id: string; name: string };
      };
      return {
        previewId: preview.id,
        previewName: preview.name,
        projectId: preview.projects.id,
        projectName: preview.projects.name,
      };
    });

    return NextResponse.json({
      success: true,
      asset: {
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
        usages: usageDetails,
      },
    });
  } catch (error) {
    console.error("Get asset error:", error);
    return NextResponse.json(
      { error: "Failed to get asset" },
      { status: 500 }
    );
  }
}

// DELETE - Delete asset (only if not in use)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get asset with usage count
    const { data: asset, error: assetError } = await supabase
      .from("media_assets_with_usage")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Check if asset is in use
    if (asset.usage_count > 0) {
      // Get usage details to show user where it's used
      const { data: usages } = await supabase
        .from("media_asset_usages")
        .select(
          `
          preview_id,
          previews!inner (
            id,
            name,
            project_id,
            projects!inner (
              id,
              name
            )
          )
        `
        )
        .eq("media_asset_id", id);

      const usageDetails = (usages || []).map((usage) => {
        const preview = usage.previews as unknown as {
          id: string;
          name: string;
          project_id: string;
          projects: { id: string; name: string };
        };
        return {
          previewId: preview.id,
          previewName: preview.name,
          projectId: preview.projects.id,
          projectName: preview.projects.name,
        };
      });

      return NextResponse.json(
        {
          error: "Cannot delete: asset is in use",
          usageCount: asset.usage_count,
          usages: usageDetails,
        },
        { status: 409 }
      );
    }

    // Delete from Cloudinary first
    if (asset.cloudinary_public_id && asset.cloudinary_public_id !== "pending") {
      await deleteFromCloudinary(asset.cloudinary_public_id);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete asset" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error("Delete asset error:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
