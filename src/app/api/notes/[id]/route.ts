import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const uuidParam = z.string().uuid();

const patchBodySchema = z.object({
  title: z.string().trim().min(1).max(500).optional(),
  content: z.unknown().optional(),
});

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

  const note = await prisma.note.findFirst({
    where: { id: idParsed.data, userId: session.user.id },
  });

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ note });
}

export async function PATCH(
  req: Request,
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

  const json = await req.json().catch(() => null);
  const parsed = patchBodySchema.safeParse(json ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { title, content } = parsed.data;
  if (title === undefined && content === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const existing = await prisma.note.findFirst({
    where: { id: idParsed.data, userId: session.user.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const note = await prisma.note.update({
    where: { id: idParsed.data },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content: content as Prisma.InputJsonValue } : {}),
    },
  });

  return NextResponse.json({ note });
}
