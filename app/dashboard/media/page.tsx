"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { useSWRConfig } from "swr";
import {
  ImageIcon,
  Upload,
  Search,
  Trash2,
  Link as LinkIcon,
  HardDrive,
  Filter,
  Loader2,
  AlertCircle,
  ExternalLink,
  CloudUpload,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMedia, MEDIA_CACHE_KEY } from "@/hooks/use-media";
import type { MediaAsset } from "@/types";
import Link from "next/link";

interface MediaAssetWithUsage extends MediaAsset {
  usageCount: number;
  usages?: {
    previewId: string;
    previewName: string;
    projectId: string;
    projectName: string;
  }[];
}

type UploadProgress = {
  fileName: string;
  progress: number;
  status: "hashing" | "preparing" | "uploading" | "confirming" | "done" | "error" | "duplicate";
};

/**
 * Compute SHA-256 hash of file content (client-side)
 */
async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function MediaLibraryPage() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetWithUsage | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAssetWithUsage | null>(null);
  const [isDeletingAsset, setIsDeletingAsset] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { mutate } = useSWRConfig();

  // Use SWR for media fetching
  const { assets, totalStorage, isLoading } = useMedia({
    search: debouncedSearch || undefined,
    unused: showUnusedOnly || undefined,
  });

  const isUploading = uploadProgress.length > 0;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Helper to invalidate media cache
  const invalidateCache = useCallback(() => {
    mutate((key) => typeof key === "string" && key.startsWith(MEDIA_CACHE_KEY));
  }, [mutate]);

  // Upload a single file with direct Cloudinary upload
  const uploadSingleFile = useCallback(
    async (
      file: File,
      index: number,
      updateProgress: (update: Partial<UploadProgress>) => void
    ): Promise<"success" | "duplicate" | "error"> => {
      try {
        // Stage 1: Compute hash
        updateProgress({ status: "hashing", progress: 10 });
        const contentHash = await computeFileHash(file);

        // Stage 2: Prepare upload
        updateProgress({ status: "preparing", progress: 25 });
        const { data: prepareData } = await axios.post("/api/media/prepare", {
          contentHash,
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });

        if (!prepareData.success) {
          throw new Error(prepareData.error || "Prepare failed");
        }

        // If deduplicated, return early
        if (prepareData.deduplicated) {
          updateProgress({ status: "duplicate", progress: 100 });
          return "duplicate";
        }

        // Stage 3: Upload directly to Cloudinary with progress
        updateProgress({ status: "uploading", progress: 40 });
        const { uploadParams } = prepareData;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", uploadParams.apiKey);
        formData.append("timestamp", uploadParams.timestamp.toString());
        formData.append("signature", uploadParams.signature);
        formData.append("folder", uploadParams.folder);
        formData.append("public_id", uploadParams.publicId);

        const { data: cloudinaryResult } = await axios.post(
          `https://api.cloudinary.com/v1_1/${uploadParams.cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = 40 + (progressEvent.loaded / progressEvent.total) * 45;
                updateProgress({ progress });
              }
            },
          }
        );

        // Stage 4: Confirm upload
        updateProgress({ status: "confirming", progress: 90 });
        const { data: confirmData } = await axios.post("/api/media/confirm", {
          assetId: prepareData.assetId,
          cloudinaryResult,
        });

        if (!confirmData.success) {
          throw new Error(confirmData.error || "Confirm failed");
        }

        updateProgress({ status: "done", progress: 100 });
        return "success";
      } catch (error) {
        console.error("Upload error:", error);
        updateProgress({ status: "error", progress: 0 });
        return "error";
      }
    },
    []
  );

  // Handle file upload (multiple files)
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));

      if (fileArray.length === 0) {
        toast.error("No valid image files selected");
        return;
      }

      // Initialize progress for all files
      const initialProgress: UploadProgress[] = fileArray.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "hashing" as const,
      }));
      setUploadProgress(initialProgress);

      let successCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const result = await uploadSingleFile(file, i, (update) => {
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = { ...newProgress[i], ...update };
            return newProgress;
          });
        });

        if (result === "success") successCount++;
        else if (result === "duplicate") duplicateCount++;
        else errorCount++;
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(`Uploaded ${successCount} image${successCount > 1 ? "s" : ""}`);
      }
      if (duplicateCount > 0) {
        toast.info(
          `${duplicateCount} image${duplicateCount > 1 ? "s were" : " was"} already in your library`
        );
      }
      if (errorCount > 0) {
        toast.error(`Failed to upload ${errorCount} image${errorCount > 1 ? "s" : ""}`);
      }

      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress([]);
        invalidateCache();
      }, 1500);
    },
    [uploadSingleFile, invalidateCache]
  );

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!assetToDelete) return;

    setIsDeletingAsset(true);
    try {
      const response = await fetch(`/api/media/${assetToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.status === 409) {
        // Asset is in use - show usage details
        setSelectedAsset({ ...assetToDelete, usages: data.usages });
        setAssetToDelete(null);
        toast.error("Cannot delete: image is in use");
      } else if (data.success) {
        toast.success("Image deleted");
        setAssetToDelete(null);
        invalidateCache();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeletingAsset(false);
    }
  }, [assetToDelete, invalidateCache]);

  // Fetch asset details with usage info
  const fetchAssetDetails = useCallback(async (asset: MediaAssetWithUsage) => {
    try {
      const response = await fetch(`/api/media/${asset.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedAsset(data.asset);
      }
    } catch (error) {
      console.error("Failed to fetch asset details:", error);
      setSelectedAsset(asset);
    }
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length > 0) {
        handleUpload(imageFiles);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Media Library
            </h1>
            <ImageIcon className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-muted-foreground">
            Manage your images and assets across all projects
          </p>
        </div>

        {/* Storage Stats & Upload */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatBytes(totalStorage)}</span>
            <span className="text-xs text-muted-foreground">used</span>
          </div>
          <label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              disabled={isUploading}
            />
            <Button
              asChild
              disabled={isUploading}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 cursor-pointer"
            >
              <span>
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Images
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-muted/30 border-border/50 focus:border-orange-500/50"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/50">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Checkbox
            id="unused"
            checked={showUnusedOnly}
            onCheckedChange={(checked) => setShowUnusedOnly(checked === true)}
          />
          <label htmlFor="unused" className="text-sm cursor-pointer">
            Show unused only
          </label>
        </div>
      </div>

      {/* Drop Zone & Grid */}
      <div
        className={cn(
          "relative min-h-[400px] rounded-2xl border-2 border-dashed transition-all duration-300",
          dragOver
            ? "border-orange-500 bg-orange-500/5"
            : "border-border/50 bg-muted/10"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        <AnimatePresence>
          {dragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-orange-500/10 backdrop-blur-sm rounded-2xl z-10"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-lg font-semibold text-orange-500">
                  Drop images to upload
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : assets.length === 0 ? (
          /* Empty State */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="relative mb-6">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-orange-500/50" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {showUnusedOnly
                ? "All your images are currently in use. Great job keeping things organized!"
                : "Upload images to your media library. They'll be available across all your projects."}
            </p>
            {!showUnusedOnly && (
              <label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-dashed border-2 hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer"
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload your first image
                  </span>
                </Button>
              </label>
            )}
          </div>
        ) : (
          /* Assets Grid */
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {assets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02 }}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-muted/50 border border-border/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-500/10"
                    onClick={() => fetchAssetDetails(asset)}
                  >
                    {/* Image */}
                    <img
                      src={asset.cloudinaryUrl}
                      alt={asset.filename || "Image"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Usage Badge */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300",
                        asset.usageCount > 0
                          ? "bg-blue-500/80 text-white"
                          : "bg-neutral-800/80 text-neutral-300"
                      )}
                    >
                      <LinkIcon className="h-3 w-3" />
                      {asset.usageCount}
                    </div>

                    {/* Info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium truncate">
                        {asset.filename || "Untitled"}
                      </p>
                      <p className="text-white/70 text-xs">
                        {formatBytes(asset.sizeBytes || 0)}
                      </p>
                    </div>

                    {/* Delete button (only for unused) */}
                    {asset.usageCount === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAssetToDelete(asset);
                        }}
                        className="absolute top-2 left-2 h-8 w-8 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Tip */}
      {assets.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Images with{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-xs font-medium">
            <LinkIcon className="h-3 w-3" />0
          </span>{" "}
          are unused and can be safely deleted
        </p>
      )}

      {/* Asset Detail Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-orange-500" />
              Image Details
            </DialogTitle>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 border border-border/50">
                <img
                  src={selectedAsset.cloudinaryUrl}
                  alt={selectedAsset.filename || "Image"}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Filename</p>
                  <p className="font-medium truncate">{selectedAsset.filename || "Untitled"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{formatBytes(selectedAsset.sizeBytes || 0)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dimensions</p>
                  <p className="font-medium">
                    {selectedAsset.width} × {selectedAsset.height}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {new Date(selectedAsset.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Usage */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Used in {selectedAsset.usageCount} preview
                  {selectedAsset.usageCount !== 1 ? "s" : ""}
                </p>

                {selectedAsset.usages && selectedAsset.usages.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedAsset.usages.map((usage, i) => (
                      <Link
                        key={i}
                        href={`/dashboard/projects/${usage.projectId}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-sm">{usage.projectName}</p>
                          <p className="text-xs text-muted-foreground">{usage.previewName}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedAsset(null)}>
                  Close
                </Button>
                {selectedAsset.usageCount === 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setAssetToDelete(selectedAsset);
                      setSelectedAsset(null);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!assetToDelete} onOpenChange={() => setAssetToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Delete Image
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{assetToDelete?.filename || "this image"}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setAssetToDelete(null)}
              disabled={isDeletingAsset}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingAsset}
            >
              {isDeletingAsset ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Progress Panel */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-orange-500/20 blur animate-pulse" />
                <CloudUpload className="relative h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Uploading Images</p>
                <p className="text-xs text-muted-foreground">
                  {uploadProgress.filter((p) => p.status === "done" || p.status === "duplicate").length} of{" "}
                  {uploadProgress.length} complete
                </p>
              </div>
            </div>

            {/* Progress List */}
            <div className="max-h-60 overflow-y-auto p-2 space-y-2">
              {uploadProgress.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                >
                  {/* Status Icon */}
                  <div className="shrink-0">
                    {item.status === "done" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : item.status === "duplicate" ? (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    ) : item.status === "error" ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.fileName}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={item.progress} className="h-1 flex-1" />
                      <span className="text-xs text-muted-foreground shrink-0">
                        {item.status === "done"
                          ? "Done"
                          : item.status === "duplicate"
                          ? "Exists"
                          : item.status === "error"
                          ? "Error"
                          : `${Math.round(item.progress)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
