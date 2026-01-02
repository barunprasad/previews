import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { User, Mail, Shield } from "lucide-react";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role, created_at")
    .eq("id", user.id)
    .single();

  const userData = {
    id: user.id,
    email: user.email || "",
    fullName: profile?.full_name || "",
    avatarUrl: profile?.avatar_url || null,
    role: profile?.role || "user",
    createdAt: profile?.created_at || user.created_at,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-orange-500" />
              Personal Information
            </h2>
            <ProfileForm user={userData} />
          </div>
        </div>

        {/* Account Info Sidebar */}
        <div className="space-y-6">
          {/* Email Card */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500" />
              Email Address
            </h3>
            <p className="text-sm text-muted-foreground break-all">
              {userData.email}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Email is managed by your authentication provider
            </p>
          </div>

          {/* Account Status */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              Account Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium capitalize px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  {userData.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member since</span>
                <span className="text-sm">
                  {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
