import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { DashboardWelcomeCard } from "@/components/app/dashboard-welcome-card";
import { DashboardRecentNotes } from "@/components/cross-ref/dashboard/dashboard-recent-notes";
import { ScriptureConnectionsSection } from "@/components/cross-ref/dashboard/scripture-connections-section";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeScriptureDashboardAggregates } from "@/lib/scripture-dashboard-aggregates";
import { fetchDashboardVerseOfTheDay } from "@/lib/youversion-verse-of-the-day";

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

  const verseOfTheDay = await fetchDashboardVerseOfTheDay();

  return (
    <div className="flex flex-1 justify-center bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <DashboardWelcomeCard displayName={displayName} verse={verseOfTheDay} />

          <DashboardRecentNotes notes={recentNotes} />
        </div>

        <ScriptureConnectionsSection
          stats={stats}
          topPassages={topPassages}
          trend={trend}
        />
      </div>
    </div>
  );
}

