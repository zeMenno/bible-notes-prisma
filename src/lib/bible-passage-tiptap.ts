import type { JSONContent } from "@tiptap/core"

export function buildBiblePassageJson(input: {
  usfm: string
  reference: string
  versionId: number
  versionTitle: string
  body: string
}): JSONContent {
  const attribution = `${input.reference} (${input.versionTitle}). Scripture courtesy of YouVersion.`
  const body = input.body.trim() || input.reference
  return {
    type: "biblePassage",
    attrs: {
      usfm: input.usfm,
      reference: input.reference,
      versionId: input.versionId,
      versionTitle: input.versionTitle,
    },
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: body }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: attribution }],
      },
    ],
  }
}
