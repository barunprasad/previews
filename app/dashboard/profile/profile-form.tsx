"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(user.fullName);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const supabase = createClient();

        const { error } = await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() || null })
          .eq("id", user.id);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success("Profile updated successfully");
        router.refresh();
      } catch {
        toast.error("Failed to update profile");
      }
    });
  };

  const hasChanges = fullName !== user.fullName;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.avatarUrl && (
            <AvatarImage src={user.avatarUrl} alt={fullName || user.email} />
          )}
          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-muted-foreground">
            Synced from your authentication provider
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Display Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
          className="max-w-md"
        />
        <p className="text-xs text-muted-foreground">
          This is the name that will be displayed across the app
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isPending || !hasChanges}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        {hasChanges && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFullName(user.fullName)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
