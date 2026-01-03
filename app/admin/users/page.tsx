import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/admin/users-table";

async function getAllUsers() {
  const supabase = await createClient();

  // Try to use the new storage summary view first
  const { data: usersWithStorage, error: viewError } = await supabase
    .from("user_storage_summary")
    .select("*")
    .order("storage_bytes", { ascending: false });

  if (!viewError && usersWithStorage) {
    return usersWithStorage.map((u) => ({
      id: u.user_id,
      email: u.email,
      fullName: u.full_name,
      avatarUrl: u.avatar_url,
      createdAt: u.created_at,
      projectCount: u.project_count || 0,
      previewCount: u.preview_count || 0,
      storageBytes: Number(u.storage_bytes) || 0,
      assetCount: u.asset_count || 0,
    }));
  }

  // Fallback to old method if view doesn't exist yet
  console.warn("user_storage_summary view not found, using fallback query");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  // Get project counts per user
  const { data: projectCounts } = await supabase
    .from("projects")
    .select("user_id");

  // Get preview counts per user
  const { data: previewCounts } = await supabase
    .from("previews")
    .select("user_id");

  // Build count maps
  const projectCountMap = new Map<string, number>();
  projectCounts?.forEach((p) => {
    projectCountMap.set(p.user_id, (projectCountMap.get(p.user_id) || 0) + 1);
  });

  const previewCountMap = new Map<string, number>();
  previewCounts?.forEach((p) => {
    previewCountMap.set(p.user_id, (previewCountMap.get(p.user_id) || 0) + 1);
  });

  return (profiles || []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    projectCount: projectCountMap.get(profile.id) || 0,
    previewCount: previewCountMap.get(profile.id) || 0,
    storageBytes: 0,
    assetCount: 0,
  }));
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Users</h1>
        <p className="text-muted-foreground">
          View all registered users and their activity
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
