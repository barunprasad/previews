import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Generate SHA-1 signature for Cloudinary upload
 */
async function generateSignature(params: Record<string, string>, secret: string): Promise<string> {
  // Sort params alphabetically and create string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = sortedParams + secret;

  // Generate SHA-1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a unique public ID for the upload
 */
function generatePublicId(prefix: string = "img"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Check Cloudinary credentials
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    // 3. Parse request body
    const body = await request.json();
    const { projectId, count = 1 } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // 4. Verify user owns this project
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 403 }
      );
    }

    // 5. Generate signature(s)
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `previews/${user.id}/${projectId}`;

    // Support batch signatures
    const signatures = await Promise.all(
      Array.from({ length: Math.min(count, 10) }, async (_, index) => {
        const publicId = generatePublicId(`screenshot_${index}`);

        const params: Record<string, string> = {
          folder,
          public_id: publicId,
          timestamp: timestamp.toString(),
        };

        const signature = await generateSignature(params, CLOUDINARY_API_SECRET);

        return {
          signature,
          timestamp,
          folder,
          publicId,
          apiKey: CLOUDINARY_API_KEY,
        };
      })
    );

    // Return single signature or array based on count
    return NextResponse.json({
      success: true,
      signatures: count === 1 ? signatures[0] : signatures,
    });
  } catch (error) {
    console.error("Signature generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
