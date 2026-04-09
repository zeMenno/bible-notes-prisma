import type { ReactNode } from "react";
import { getServerSession } from "next-auth";

import { AppHeader } from "@/components/app/app-header";
import { authOptions } from "@/lib/auth";

export default async function AppGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <AppHeader userEmail={session?.user?.email ?? null} />
      {children}
    </div>
  );
}
