"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CloudinaryAsset } from "@/lib/cloudinary/server";

interface AssetsTableProps {
  assets: CloudinaryAsset[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

export function AssetsTable({ assets }: AssetsTableProps) {
  const [sortField, setSortField] = useState<"created_at" | "bytes">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedAssets = [...assets].sort((a, b) => {
    if (sortField === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    }
    return sortDir === "desc" ? b.bytes - a.bytes : a.bytes - b.bytes;
  });

  const toggleSort = (field: "created_at" | "bytes") => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: "created_at" | "bytes" }) => {
    if (sortField !== field) return null;
    return sortDir === "desc" ? (
      <ChevronDown className="h-4 w-4" />
    ) : (
      <ChevronUp className="h-4 w-4" />
    );
  };

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Preview</TableHead>
            <TableHead>Public ID</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                onClick={() => toggleSort("bytes")}
              >
                Size
                <SortIcon field="bytes" />
              </button>
            </TableHead>
            <TableHead>Format</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                onClick={() => toggleSort("created_at")}
              >
                Uploaded
                <SortIcon field="created_at" />
              </button>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => (
            <TableRow key={asset.asset_id || asset.public_id}>
              <TableCell>
                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={asset.secure_url}
                    alt={asset.public_id}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 max-w-[200px]">
                  <span className="truncate text-sm font-mono" title={asset.public_id}>
                    {asset.public_id}
                  </span>
                  <CopyButton text={asset.public_id} />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {asset.width} × {asset.height}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatBytes(asset.bytes)}</span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium uppercase">
                  {asset.format}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(asset.created_at), { addSuffix: true })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <CopyButton text={asset.secure_url} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    asChild
                  >
                    <a
                      href={asset.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
