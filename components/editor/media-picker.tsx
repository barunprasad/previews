"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { useSWRConfig } from "swr";
import {
  ImageIcon,
  Upload,
  Search,
  Loader2,
  Clock,
  Grid3X3,
  Check,
  CloudUpload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMedia, MEDIA_CACHE_KEY } from "@/hooks/use-media";
import type { MediaAsset } from "@/types";

/**
 * Compute SHA-256 hash of file content (client-side)
 */
async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

type UploadState = {
  stage: "idle" | "hashing" | "preparing" | "uploading" | "confirming";
  progress: number;
  fileName?: string;
};

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
}

type Tab = "upload" | "recent" | "all";

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  title = "Add Image",
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [uploadState, setUploadState] = useState<UploadState>({
    stage: "idle",
    progress: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { mutate } = useSWRConfig();

  // Use SWR for media fetching with search support
  const { assets, recentAssets, isLoading } = useMedia({
    search: activeTab === "all" ? debouncedSearch : undefined,
    limit: 50,
  });

  const isUploading = uploadState.stage !== "idle";

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedAsset(null);
      setSearchQuery("");
      setDebouncedSearch("");
      setActiveTab("upload");
    }
  }, [open]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle file upload with direct Cloudinary upload
  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const file = fileArray[0]; // Process one file at a time

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return;
      }

      try {
        // Stage 1: Compute hash
        setUploadState({ stage: "hashing", progress: 10, fileName: file.name });
        const contentHash = await computeFileHash(file);

        // Stage 2: Prepare upload (check dedup, get signed URL)
        setUploadState({ stage: "preparing", progress: 25, fileName: file.name });
        const { data: prepareData } = await axios.post("/api/media/prepare", {
          contentHash,
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });

        if (!prepareData.success) {
          throw new Error(prepareData.error || "Prepare failed");
        }

        // If deduplicated, return existing asset
        if (prepareData.deduplicated) {
          setUploadState({ stage: "idle", progress: 0 });
          onSelect(prepareData.asset);
          onOpenChange(false);
          toast.info("Image already in library - using existing");
          return;
        }

        // Stage 3: Upload directly to Cloudinary with progress
        setUploadState({ stage: "uploading", progress: 40, fileName: file.name });
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
                setUploadState({ stage: "uploading", progress, fileName: file.name });
              }
            },
          }
        );

        // Stage 4: Confirm upload
        setUploadState({ stage: "confirming", progress: 90, fileName: file.name });
        const { data: confirmData } = await axios.post("/api/media/confirm", {
          assetId: prepareData.assetId,
          cloudinaryResult,
        });

        if (!confirmData.success) {
          throw new Error(confirmData.error || "Confirm failed");
        }

        // Success! Invalidate media cache
        setUploadState({ stage: "idle", progress: 0 });
        mutate((key) => typeof key === "string" && key.startsWith(MEDIA_CACHE_KEY));
        onSelect(confirmData.asset);
        onOpenChange(false);
        toast.success("Image uploaded");
      } catch (error) {
        console.error("Upload error:", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : error instanceof Error
          ? error.message
          : "Upload failed";
        toast.error(message);
        setUploadState({ stage: "idle", progress: 0 });
      }
    },
    [onSelect, onOpenChange, mutate]
  );

  // Handle select from library
  const handleSelectFromLibrary = useCallback(() => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onOpenChange(false);
    }
  }, [selectedAsset, onSelect, onOpenChange]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          {[
            { id: "upload" as Tab, icon: Upload, label: "Upload" },
            { id: "recent" as Tab, icon: Clock, label: "Recent" },
            { id: "all" as Tab, icon: Grid3X3, label: "All Media" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <div
                  className={cn(
                    "h-[300px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center",
                    dragOver
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-border/50 bg-muted/20",
                    isUploading && "opacity-50 pointer-events-none"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4 px-8 w-full max-w-xs">
                      {/* Animated upload icon */}
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/30 blur-lg animate-pulse" />
                        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                          {uploadState.stage === "uploading" ? (
                            <CloudUpload className="h-7 w-7 text-orange-500 animate-bounce" />
                          ) : (
                            <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
                          )}
                        </div>
                      </div>

                      {/* Stage text */}
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          {uploadState.stage === "hashing" && "Checking file..."}
                          {uploadState.stage === "preparing" && "Preparing upload..."}
                          {uploadState.stage === "uploading" && "Uploading to cloud..."}
                          {uploadState.stage === "confirming" && "Finishing up..."}
                        </p>
                        {uploadState.fileName && (
                          <p className="text-sm text-muted-foreground mt-1 truncate max-w-[200px]">
                            {uploadState.fileName}
                          </p>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full space-y-2">
                        <Progress value={uploadState.progress} className="h-2" />
                        <p className="text-xs text-center text-muted-foreground">
                          {Math.round(uploadState.progress)}%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-lg" />
                        <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-orange-500" />
                        </div>
                      </div>
                      <p className="text-lg font-medium mb-1">
                        Drag & drop your image here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse
                      </p>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files && handleUpload(e.target.files)}
                        />
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-xl cursor-pointer"
                        >
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                {/* Quick access to recent */}
                {recentAssets.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Or select from recent
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {recentAssets.slice(0, 4).map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            onSelect(asset);
                            onOpenChange(false);
                          }}
                          className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border/50 hover:border-orange-500/50 transition-all hover:scale-105"
                        >
                          <img
                            src={asset.cloudinaryUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {recentAssets.length > 4 && (
                        <button
                          onClick={() => setActiveTab("recent")}
                          className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-border/50 hover:border-orange-500/50 transition-all flex items-center justify-center text-muted-foreground hover:text-orange-500"
                        >
                          +{recentAssets.length - 4}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Recent Tab */}
            {activeTab === "recent" && (
              <motion.div
                key="recent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[400px] overflow-y-auto"
              >
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  </div>
                ) : recentAssets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Clock className="h-12 w-12 mb-4 opacity-50" />
                    <p>No recent images</p>
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("upload")}
                      className="text-orange-500"
                    >
                      Upload your first image
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 p-1">
                    {recentAssets.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={cn(
                          "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                          selectedAsset?.id === asset.id
                            ? "border-orange-500 ring-2 ring-orange-500/20"
                            : "border-transparent hover:border-orange-500/50"
                        )}
                      >
                        <img
                          src={asset.cloudinaryUrl}
                          alt={asset.filename || ""}
                          className="w-full h-full object-cover"
                        />
                        {selectedAsset?.id === asset.id && (
                          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                            <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* All Media Tab */}
            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-[400px]"
              >
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl bg-muted/30 border-border/50"
                  />
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                  ) : assets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                      <p>{searchQuery ? "No images found" : "No images yet"}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3 p-1">
                      {assets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className={cn(
                            "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                            selectedAsset?.id === asset.id
                              ? "border-orange-500 ring-2 ring-orange-500/20"
                              : "border-transparent hover:border-orange-500/50"
                          )}
                        >
                          <img
                            src={asset.cloudinaryUrl}
                            alt={asset.filename || ""}
                            className="w-full h-full object-cover"
                          />
                          {selectedAsset?.id === asset.id && (
                            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with select button (for recent/all tabs) */}
        {(activeTab === "recent" || activeTab === "all") && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSelectFromLibrary}
              disabled={!selectedAsset}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400"
            >
              <Check className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
