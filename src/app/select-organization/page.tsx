"use client";

import { OrganizationList } from "@clerk/nextjs";

export default function SelectOrganizationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Select Your Mosque
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create or select an organization to manage your mosque display.
        </p>
      </div>
      <OrganizationList
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />
    </div>
  );
}
