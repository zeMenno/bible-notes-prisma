import type { JSONContent } from "@tiptap/core";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { NoteEditorClient } from "../_components/note-editor-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const idParsed = z.string().uuid().safeParse(id);
  if (!idParsed.success) notFound();

  const note = await prisma.note.findFirst({
    where: { id: idParsed.data, userId: session.user.id },
  });

  if (!note) notFound();

  return (
    <NoteEditorClient
      noteId={note.id}
      initialTitle={note.title}
      initialContent={note.content as JSONContent}
    />
  );
}
