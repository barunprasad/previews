"use client";

import { HardDrive, Wifi, Image, Sparkles } from "lucide-react";

interface CloudinaryUsageCardProps {
  usage: {
    storage: { used: number; limit: number };
    bandwidth: { used: number; limit: number };
    requests: number;
    resources: number;
    transformations: { used: number; limit: number };
    credits: { used: number; limit: number };
    plan: string;
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function ProgressBar({ used, limit }: { used: number; limit: number }) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;

  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full transition-all ${
          isDanger
            ? "bg-red-500"
            : isWarning
            ? "bg-orange-500"
            : "bg-gradient-to-r from-orange-500 to-amber-500"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function CloudinaryUsageCard({ usage }: CloudinaryUsageCardProps) {
  const stats = [
    {
      icon: HardDrive,
      label: "Storage",
      used: formatBytes(usage.storage.used),
      limit: usage.storage.limit > 0 ? formatBytes(usage.storage.limit) : null,
      usedRaw: usage.storage.used,
      limitRaw: usage.storage.limit,
    },
    {
      icon: Wifi,
      label: "Bandwidth",
      used: formatBytes(usage.bandwidth.used),
      limit: usage.bandwidth.limit > 0 ? formatBytes(usage.bandwidth.limit) : null,
      usedRaw: usage.bandwidth.used,
      limitRaw: usage.bandwidth.limit,
    },
    {
      icon: Image,
      label: "Resources",
      used: formatNumber(usage.resources),
      limit: null,
      usedRaw: usage.resources,
      limitRaw: 0,
    },
    {
      icon: Sparkles,
      label: "Transformations",
      used: formatNumber(usage.transformations.used),
      limit: usage.transformations.limit > 0 ? formatNumber(usage.transformations.limit) : null,
      usedRaw: usage.transformations.used,
      limitRaw: usage.transformations.limit,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Plan badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Plan:</span>
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-0.5 text-xs font-medium text-white">
          {usage.plan}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="font-medium">{stat.label}</span>
            </div>

            <div>
              <p className="text-2xl font-bold">{stat.used}</p>
              {stat.limit && (
                <p className="text-xs text-muted-foreground">of {stat.limit}</p>
              )}
            </div>

            {stat.limitRaw > 0 && (
              <ProgressBar used={stat.usedRaw} limit={stat.limitRaw} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
