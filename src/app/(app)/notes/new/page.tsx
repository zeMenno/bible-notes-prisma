import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { DEFAULT_NOTE_CONTENT } from "@/lib/note-default-content";
import { prisma } from "@/lib/prisma";

export default async function NewNotePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: new Date().toLocaleDateString(),
      content: DEFAULT_NOTE_CONTENT,
    },
    select: { id: true },
  });

  redirect(`/notes/${note.id}`);
}
