import { listCloudinaryAssets, getCloudinaryUsage, isCloudinaryServerConfigured } from "@/lib/cloudinary/server";
import { createClient } from "@/lib/supabase/server";
import { AssetsTable } from "@/components/admin/assets-table";
import { MediaAssetsTable } from "@/components/admin/media-assets-table";
import { CloudinaryUsageCard } from "@/components/admin/cloudinary-usage-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Cloud, Database } from "lucide-react";

interface MediaAssetWithUser {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  lastUsedAt: string | null;
  usageCount: number;
}

async function getMediaAssets(): Promise<MediaAssetWithUser[]> {
  const supabase = await createClient();

  // Try the admin view first
  const { data: assets, error } = await supabase
    .from("admin_media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching media assets:", error);
    // Fallback: query with join
    const { data: fallbackAssets } = await supabase
      .from("media_assets")
      .select(`
        *,
        profiles!inner(email, full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!fallbackAssets) return [];

    return fallbackAssets.map((a: { id: string; user_id: string; profiles: { email: string; full_name: string | null }; cloudinary_public_id: string; cloudinary_url: string; filename: string | null; mime_type: string | null; size_bytes: number; width: number | null; height: number | null; created_at: string; last_used_at: string | null }) => ({
      id: a.id,
      userId: a.user_id,
      userEmail: a.profiles.email,
      userName: a.profiles.full_name,
      cloudinaryPublicId: a.cloudinary_public_id,
      cloudinaryUrl: a.cloudinary_url,
      filename: a.filename,
      mimeType: a.mime_type,
      sizeBytes: a.size_bytes || 0,
      width: a.width,
      height: a.height,
      createdAt: a.created_at,
      lastUsedAt: a.last_used_at,
      usageCount: 0,
    }));
  }

  return (assets || []).map((a) => ({
    id: a.id,
    userId: a.user_id,
    userEmail: a.user_email,
    userName: a.user_name,
    cloudinaryPublicId: a.cloudinary_public_id,
    cloudinaryUrl: a.cloudinary_url,
    filename: a.filename,
    mimeType: a.mime_type,
    sizeBytes: a.size_bytes || 0,
    width: a.width,
    height: a.height,
    createdAt: a.created_at,
    lastUsedAt: a.last_used_at,
    usageCount: a.usage_count || 0,
  }));
}

export default async function AdminAssetsPage() {
  const cloudinaryConfigured = isCloudinaryServerConfigured();

  const [assetsResult, usage, mediaAssets] = await Promise.all([
    cloudinaryConfigured ? listCloudinaryAssets({ maxResults: 50, prefix: "previews" }) : null,
    cloudinaryConfigured ? getCloudinaryUsage() : null,
    getMediaAssets(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assets Management</h1>
        <p className="text-muted-foreground">
          View all media assets and Cloudinary storage
        </p>
      </div>

      <Tabs defaultValue="media-library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="media-library" className="gap-2">
            <Database className="h-4 w-4" />
            Media Library ({mediaAssets.length})
          </TabsTrigger>
          <TabsTrigger value="cloudinary" className="gap-2">
            <Cloud className="h-4 w-4" />
            Cloudinary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media-library" className="space-y-4">
          {mediaAssets.length > 0 ? (
            <MediaAssetsTable assets={mediaAssets} />
          ) : (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              No media assets in the library yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="cloudinary" className="space-y-4">
          {!cloudinaryConfigured ? (
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
          ) : (
            <>
              {usage && <CloudinaryUsageCard usage={usage} />}

              {assetsResult?.assets && assetsResult.assets.length > 0 ? (
                <AssetsTable assets={assetsResult.assets} />
              ) : (
                <div className="rounded-lg border p-8 text-center text-muted-foreground">
                  No assets found in Cloudinary
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
