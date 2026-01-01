"use client";

import { Users, FolderOpen, Image, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalPreviews: number;
  newUsersThisWeek: number;
  newProjectsThisWeek: number;
}

interface StatsCardsProps {
  stats: AdminStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: stats.newUsersThisWeek,
      changeLabel: "new this week",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
      change: stats.newProjectsThisWeek,
      changeLabel: "new this week",
      icon: FolderOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Previews",
      value: stats.totalPreviews,
      change: null,
      changeLabel: "",
      icon: Image,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg Previews/Project",
      value: stats.totalProjects > 0
        ? (stats.totalPreviews / stats.totalProjects).toFixed(1)
        : "0",
      change: null,
      changeLabel: "",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.change !== null && card.change > 0 && (
              <p className="text-xs text-muted-foreground">
                +{card.change} {card.changeLabel}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
