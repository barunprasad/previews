import { createAdminClient } from "@/lib/supabase/admin";
import { UsersTable } from "@/components/admin/users-table";

async function getAllUsers() {
  const supabase = createAdminClient();

  // Get all users from profiles
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
