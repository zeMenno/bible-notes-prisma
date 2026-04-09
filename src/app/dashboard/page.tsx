import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardRecentNotes } from "@/components/cross-ref/dashboard/dashboard-recent-notes";
import { ScriptureConnectionsSection } from "@/components/cross-ref/dashboard/scripture-connections-section";
import { BetaBadge } from "@/components/site/beta-badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeScriptureDashboardAggregates } from "@/lib/scripture-dashboard-aggregates";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const displayName = session.user.name?.trim() || session.user.email || "there";

  const rows = await prisma.note.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      content: true,
    },
  });

  const { stats, topPassages, trend } = computeScriptureDashboardAggregates(rows);

  const recentNotes = [...rows]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3)
    .map((n) => ({
      id: n.id,
      title: n.title,
      updatedAt: n.updatedAt,
    }));

  return (
    <div className="flex flex-1 justify-center bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">Welcome, {displayName}.</p>
            </div>
            <SignOutButton className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium">
              Sign out
            </SignOutButton>
          </div>

          <div className="mt-8 rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-medium">{session.user.email}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              className="inline-flex h-11 min-h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground sm:w-auto sm:px-6"
              href="/notes"
            >
              Open notes
            </Link>
            <Link
              className="inline-flex h-11 min-h-11 w-full items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium sm:w-auto sm:px-6"
              href="/notes/graph"
            >
              Note graph
              <BetaBadge />
            </Link>
          </div>
        </div>

        <DashboardRecentNotes notes={recentNotes} />

        <ScriptureConnectionsSection
          stats={stats}
          topPassages={topPassages}
          trend={trend}
        />
      </div>
    </div>
  );
}

