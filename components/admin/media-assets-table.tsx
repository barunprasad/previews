"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  Link as LinkIcon,
  HardDrive,
  ImageIcon,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface MediaAssetsTableProps {
  assets: MediaAssetWithUser[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

type SortKey = "size" | "created" | "usage";
type SortDir = "asc" | "desc";

export function MediaAssetsTable({ assets }: MediaAssetsTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Calculate stats
  const totalSize = assets.reduce((sum, a) => sum + a.sizeBytes, 0);
  const uniqueUsers = new Set(assets.map((a) => a.userId)).size;

  // Group by user for stats
  const userStats = assets.reduce((acc, asset) => {
    if (!acc[asset.userId]) {
      acc[asset.userId] = { email: asset.userEmail, size: 0, count: 0 };
    }
    acc[asset.userId].size += asset.sizeBytes;
    acc[asset.userId].count += 1;
    return acc;
  }, {} as Record<string, { email: string; size: number; count: number }>);

  const topUsers = Object.entries(userStats)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 5);

  // Filter and sort
  const filteredAssets = assets.filter(
    (a) =>
      a.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      a.filename?.toLowerCase().includes(search.toLowerCase()) ||
      a.userName?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case "size":
        comparison = a.sizeBytes - b.sizeBytes;
        break;
      case "created":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "usage":
        comparison = a.usageCount - b.usageCount;
        break;
    }
    return sortDir === "desc" ? -comparison : comparison;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Total Assets</span>
          </div>
          <p className="text-2xl font-bold">{assets.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm">Total Size</span>
          </div>
          <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <LinkIcon className="h-4 w-4" />
            <span className="text-sm">Unique Users</span>
          </div>
          <p className="text-2xl font-bold">{uniqueUsers}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm">Avg per Asset</span>
          </div>
          <p className="text-2xl font-bold">
            {assets.length > 0 ? formatBytes(totalSize / assets.length) : "0 B"}
          </p>
        </div>
      </div>

      {/* Top users by storage */}
      {topUsers.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Top Users by Storage</h3>
          <div className="flex flex-wrap gap-2">
            {topUsers.map(([userId, data]) => (
              <Badge key={userId} variant="secondary" className="gap-1">
                {data.email.split("@")[0]}
                <span className="text-muted-foreground">
                  {formatBytes(data.size)} ({data.count})
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user or filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredAssets.length} of {assets.length} assets
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Preview</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("size")}
                >
                  Size
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("usage")}
                >
                  Usage
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("created")}
                >
                  Uploaded
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <p>No assets found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={asset.cloudinaryUrl}
                        alt={asset.filename || "Asset"}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {asset.userName || asset.userEmail.split("@")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {asset.userEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm truncate max-w-[150px] block" title={asset.filename || undefined}>
                      {asset.filename || "Untitled"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {asset.width && asset.height
                        ? `${asset.width} × ${asset.height}`
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatBytes(asset.sizeBytes)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={asset.usageCount > 0 ? "default" : "outline"}
                      className="gap-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                      {asset.usageCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(asset.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CopyButton text={asset.cloudinaryUrl} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                      >
                        <a
                          href={asset.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
