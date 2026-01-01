import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsTable } from "@/components/admin/projects-table";

async function getAllProjects() {
  const supabase = createAdminClient();

  // Get all projects with user info and preview counts
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      description,
      device_type,
      created_at,
      updated_at,
      user_id,
      profiles!projects_user_id_fkey (
        id,
        email,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Get preview counts for each project
  const projectIds = projects?.map((p) => p.id) || [];

  const { data: previewCounts } = await supabase
    .from("previews")
    .select("project_id")
    .in("project_id", projectIds);

  // Count previews per project
  const countMap = new Map<string, number>();
  previewCounts?.forEach((p) => {
    countMap.set(p.project_id, (countMap.get(p.project_id) || 0) + 1);
  });

  return (projects || []).map((project) => {
    // Handle profiles as either single object or array
    const profile = Array.isArray(project.profiles)
      ? project.profiles[0]
      : project.profiles;

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      deviceType: project.device_type,
      previewCount: countMap.get(project.id) || 0,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      user: {
        id: profile?.id || project.user_id,
        email: profile?.email || "Unknown",
        fullName: profile?.full_name || null,
      },
    };
  });
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Projects</h1>
        <p className="text-muted-foreground">
          View and manage all user projects
        </p>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
