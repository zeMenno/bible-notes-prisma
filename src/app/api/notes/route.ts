import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { DEFAULT_NOTE_CONTENT } from "@/lib/note-default-content";
import { prisma } from "@/lib/prisma";

const postBodySchema = z.object({
  title: z.string().trim().min(1).max(500).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = postBodySchema.safeParse(json ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const title = parsed.data.title?.trim() ?? "Untitled";

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title,
      content: DEFAULT_NOTE_CONTENT,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ note }, { status: 201 });
}
