import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/supabase/admin";

export interface UserStorageSummary {
  userId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  storageBytes: number;
  assetCount: number;
  projectCount: number;
  previewCount: number;
}

export interface StorageAnalytics {
  totalStorageBytes: number;
  totalAssets: number;
  totalUsers: number;
  usersWithAssets: number;
  averageStoragePerUser: number;
  topUsers: UserStorageSummary[];
  allUsers: UserStorageSummary[];
}

/**
 * GET /api/admin/storage
 * Returns storage analytics for all users (admin only)
 */
export async function GET() {
  try {
    // Check admin access
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = await createClient();

    // Query user storage summary view
    const { data: users, error } = await supabase
      .from("user_storage_summary")
      .select("*")
      .order("storage_bytes", { ascending: false });

    if (error) {
      console.error("Error fetching storage data:", error);
      return NextResponse.json(
        { error: "Failed to fetch storage data" },
        { status: 500 }
      );
    }

    // Transform to camelCase
    const transformedUsers: UserStorageSummary[] = (users || []).map((u) => ({
      userId: u.user_id,
      email: u.email,
      fullName: u.full_name,
      avatarUrl: u.avatar_url,
      role: u.role,
      createdAt: u.created_at,
      storageBytes: Number(u.storage_bytes) || 0,
      assetCount: u.asset_count || 0,
      projectCount: u.project_count || 0,
      previewCount: u.preview_count || 0,
    }));

    // Calculate analytics
    const totalStorageBytes = transformedUsers.reduce(
      (sum, u) => sum + u.storageBytes,
      0
    );
    const totalAssets = transformedUsers.reduce(
      (sum, u) => sum + u.assetCount,
      0
    );
    const usersWithAssets = transformedUsers.filter(
      (u) => u.assetCount > 0
    ).length;
    const averageStoragePerUser =
      usersWithAssets > 0 ? totalStorageBytes / usersWithAssets : 0;

    const analytics: StorageAnalytics = {
      totalStorageBytes,
      totalAssets,
      totalUsers: transformedUsers.length,
      usersWithAssets,
      averageStoragePerUser,
      topUsers: transformedUsers.slice(0, 10),
      allUsers: transformedUsers,
    };

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error("Storage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
