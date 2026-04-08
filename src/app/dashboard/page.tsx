import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const displayName = session.user.name?.trim() || session.user.email || "there";

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-2xl rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Welcome, {displayName}.</p>
          </div>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium"
            href="/api/auth/signout?callbackUrl=/"
          >
            Sign out
          </Link>
        </div>

        <div className="mt-8 rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="mt-1 font-medium">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
}

