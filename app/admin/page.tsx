import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isCloudinaryServerConfigured } from "@/lib/cloudinary/server";
import { templateSets } from "@/lib/templates";
import { StatsCards } from "@/components/admin/stats-cards";
import {
  Users,
  FolderOpen,
  Cloud,
  LayoutTemplate,
  Database,
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

async function getAdminStats() {
  const supabase = await createClient();

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

const quickLinks = [
  {
    href: "/admin/users",
    label: "Manage Users",
    description: "View all registered users",
    icon: Users,
  },
  {
    href: "/admin/projects",
    label: "All Projects",
    description: "Browse user projects",
    icon: FolderOpen,
  },
  {
    href: "/admin/assets",
    label: "Cloudinary Assets",
    description: "View uploaded images",
    icon: Cloud,
  },
  {
    href: "/dashboard/templates",
    label: "Template Library",
    description: "Manage templates",
    icon: LayoutTemplate,
  },
];

export default async function AdminPage() {
  const stats = await getAdminStats();
  const cloudinaryConfigured = isCloudinaryServerConfigured();

  const systemStatus = [
    {
      label: "Database",
      value: "Supabase PostgreSQL",
      status: true,
      link: "https://supabase.com/dashboard",
    },
    {
      label: "Authentication",
      value: "Supabase Auth + OAuth",
      status: true,
    },
    {
      label: "Image Storage",
      value: cloudinaryConfigured ? "Cloudinary" : "Not configured",
      status: cloudinaryConfigured,
      link: cloudinaryConfigured ? "https://console.cloudinary.com" : undefined,
    },
    {
      label: "Template Sets",
      value: `${templateSets.length} available`,
      status: templateSets.length > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all users, projects, and system metrics
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            Quick Actions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 hover:border-orange-200 dark:hover:border-orange-900"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400 group-hover:from-orange-500/20 group-hover:to-amber-500/20">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-orange-500" />
            System Status
          </h3>
          <div className="space-y-3">
            {systemStatus.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {item.status ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
