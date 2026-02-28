"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Clock,
  Cloud,
  BookOpen,
  Heart,
  Image,
  Megaphone,
  SlidersHorizontal,
  Settings,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DashboardShellProps {
  mosqueName: string;
  mosqueSlug: string;
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/prayer-times", label: "Prayer Times", icon: Clock },
  { href: "/dashboard/weather", label: "Weather", icon: Cloud },
  { href: "/dashboard/quran-hadith", label: "Quran & Hadith", icon: BookOpen },
  { href: "/dashboard/donations", label: "Donations", icon: Heart },
  { href: "/dashboard/media", label: "Media", icon: Image },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
  { href: "/dashboard/display", label: "Display", icon: SlidersHorizontal },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({
  mosqueName,
  mosqueSlug,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Monitor className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">
              Smart Mosque
            </span>
            <span className="text-xs text-muted-foreground leading-tight truncate max-w-[160px]">
              {mosqueName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Footer */}
        <div className="space-y-2 p-3">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/display/${mosqueSlug}`} target="_blank">
              <Monitor className="mr-2 h-4 w-4" />
              Open Display
            </Link>
          </Button>
          <div className="flex items-center justify-between px-1">
            <OrganizationSwitcher
              hidePersonal
              afterSelectOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  organizationSwitcherTrigger:
                    "w-full justify-start text-sm py-1.5",
                },
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h2 className="text-lg font-semibold">
            {navItems.find((i) =>
              i.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(i.href),
            )?.label || "Dashboard"}
          </h2>
          <UserButton />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
