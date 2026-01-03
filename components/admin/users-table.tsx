"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, Users, Mail, HardDrive, ImageIcon, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  projectCount: number;
  previewCount: number;
  storageBytes: number;
  assetCount: number;
}

interface UsersTableProps {
  users: UserData[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

type SortKey = "storage" | "assets" | "projects" | "joined";
type SortDir = "asc" | "desc";

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("storage");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Calculate max storage for progress bar
  const maxStorage = Math.max(...users.map((u) => u.storageBytes), 1);
  const totalStorage = users.reduce((sum, u) => sum + u.storageBytes, 0);
  const totalAssets = users.reduce((sum, u) => sum + u.assetCount, 0);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.fullName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case "storage":
        comparison = a.storageBytes - b.storageBytes;
        break;
      case "assets":
        comparison = a.assetCount - b.assetCount;
        break;
      case "projects":
        comparison = a.projectCount - b.projectCount;
        break;
      case "joined":
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">Total Users</span>
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm">Total Storage</span>
          </div>
          <p className="text-2xl font-bold">{formatBytes(totalStorage)}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Total Assets</span>
          </div>
          <p className="text-2xl font-bold">{totalAssets}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <HardDrive className="h-4 w-4" />
            <span className="text-sm">Avg per User</span>
          </div>
          <p className="text-2xl font-bold">
            {users.length > 0 ? formatBytes(totalStorage / users.length) : "0 B"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("storage")}
                >
                  Storage
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("assets")}
                >
                  Assets
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center hidden sm:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("projects")}
                >
                  Projects
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort("joined")}
                >
                  Joined
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {getInitials(user.fullName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.fullName || "No name"}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[120px]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{formatBytes(user.storageBytes)}</span>
                      </div>
                      <Progress
                        value={(user.storageBytes / maxStorage) * 100}
                        className="h-1.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <Badge variant="outline" className="gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {user.assetCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <Badge variant="secondary">{user.projectCount}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
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
