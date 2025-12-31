import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FolderX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Project not found</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/projects">Back to Projects</Link>
      </Button>
    </div>
  );
}
