import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { computeCrossRefsForNote } from "@/lib/note-cross-refs";
import { prisma } from "@/lib/prisma";

const uuidParam = z.string().uuid();

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const idParsed = uuidParam.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userId = session.user.id;
  const noteId = idParsed.data;

  const current = await prisma.note.findFirst({
    where: { id: noteId, userId },
    select: { id: true },
  });

  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const notes = await prisma.note.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      content: true,
    },
  });

  const result = computeCrossRefsForNote(noteId, notes);

  return NextResponse.json({
    passagesInCurrentNote: result.passagesInCurrentNote,
    relatedNotes: result.relatedNotes,
    crossRefCount: result.crossRefCount,
  });
}
