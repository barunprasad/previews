import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FolderOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first project to start generating beautiful app store previews.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/projects/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Link>
      </Button>
    </div>
  );
}
