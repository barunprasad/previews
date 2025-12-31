"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, TabletSmartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProjectAction } from "../actions";
import { cn } from "@/lib/utils";

const deviceOptions = [
  {
    value: "iphone",
    label: "iPhone",
    description: "iPhone 15 Pro, Pro Max",
    icon: Smartphone,
  },
  {
    value: "android",
    label: "Android",
    description: "Pixel 8 Pro, Galaxy S24",
    icon: TabletSmartphone,
  },
] as const;

export default function NewProjectPage() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to projects</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">
            Create a new app store preview project
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Enter the basic information for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Awesome App"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="App Store screenshots for version 2.0"
                disabled={isPending}
              />
            </div>

            <div className="space-y-3">
              <Label>Device Type</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {deviceOptions.map((device) => (
                  <label
                    key={device.value}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-1 rounded-lg border-2 p-4 transition-colors hover:bg-accent",
                      "has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    )}
                  >
                    <input
                      type="radio"
                      name="deviceType"
                      value={device.value}
                      defaultChecked={device.value === "iphone"}
                      className="peer sr-only"
                      disabled={isPending}
                    />
                    <div className="flex items-center gap-3">
                      <device.icon className="h-5 w-5 text-muted-foreground peer-checked:text-primary" />
                      <span className="font-medium">{device.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {device.description}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild disabled={isPending}>
                <Link href="/dashboard/projects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
