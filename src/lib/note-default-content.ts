import type { Prisma } from "@prisma/client";

/** Empty Tiptap doc (one paragraph) for new notes. */
export const DEFAULT_NOTE_CONTENT: Prisma.InputJsonValue = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
