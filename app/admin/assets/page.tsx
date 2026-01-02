import { listCloudinaryAssets, getCloudinaryUsage, isCloudinaryServerConfigured } from "@/lib/cloudinary/server";
import { AssetsTable } from "@/components/admin/assets-table";
import { CloudinaryUsageCard } from "@/components/admin/cloudinary-usage-card";
import { AlertCircle } from "lucide-react";

export default async function AdminAssetsPage() {
  if (!isCloudinaryServerConfigured()) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cloudinary Assets</h1>
          <p className="text-muted-foreground">
            View and manage all uploaded assets
          </p>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                Cloudinary Not Configured
              </h3>
              <p className="text-sm text-orange-600 dark:text-orange-500">
                Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [assetsResult, usage] = await Promise.all([
    listCloudinaryAssets({ maxResults: 50, prefix: "previews" }),
    getCloudinaryUsage(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cloudinary Assets</h1>
        <p className="text-muted-foreground">
          View and manage all uploaded assets ({assetsResult?.assets.length || 0} shown)
        </p>
      </div>

      {usage && <CloudinaryUsageCard usage={usage} />}

      {assetsResult?.assets && assetsResult.assets.length > 0 ? (
        <AssetsTable assets={assetsResult.assets} />
      ) : (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No assets found in Cloudinary
        </div>
      )}
    </div>
  );
}
