import { createAdminClient } from "@/lib/supabase/admin";
import { StatsCards } from "@/components/admin/stats-cards";

async function getAdminStats() {
  const supabase = createAdminClient();

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Get total projects count
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  // Get total previews count
  const { count: totalPreviews } = await supabase
    .from("previews")
    .select("*", { count: "exact", head: true });

  // Get new users this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { count: newUsersThisWeek } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString());

  // Get new projects this week
  const { count: newProjectsThisWeek } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneWeekAgo.toISOString());

  return {
    totalUsers: totalUsers || 0,
    totalProjects: totalProjects || 0,
    totalPreviews: totalPreviews || 0,
    newUsersThisWeek: newUsersThisWeek || 0,
    newProjectsThisWeek: newProjectsThisWeek || 0,
  };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all users, projects, and system metrics
        </p>
      </div>

      <StatsCards stats={stats} />

      {/* Recent activity section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• View all projects: <a href="/admin/projects" className="text-primary hover:underline">Projects</a></p>
            <p>• View all users: <a href="/admin/users" className="text-primary hover:underline">Users</a></p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-4">System Info</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Database: Supabase PostgreSQL</p>
            <p>• Storage: Cloudinary (if configured)</p>
            <p>• Auth: Supabase Auth + OAuth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
