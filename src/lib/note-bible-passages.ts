import type { JSONContent } from "@tiptap/core"

const LEGACY_ATTRIBUTION_SUFFIX = "Scripture courtesy of YouVersion."

export type ExtractedBiblePassage =
  | {
      source: "biblePassage"
      usfm: string
      reference: string
      versionId: number
      versionTitle: string
    }
  | {
      source: "legacyBlockquote"
      /** Parsed from the attribution line when possible */
      reference: string
      /** Translation name from parentheses before the suffix, when matched */
      versionTitle?: string
      attributionLine: string
    }

function collectParagraphText(node: JSONContent | undefined): string {
  if (!node?.content?.length) return ""
  return node.content
    .filter((n) => n.type === "text" && typeof n.text === "string")
    .map((n) => n.text as string)
    .join("")
}

function normalizeBiblePassageAttrs(
  raw: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const versionRaw = raw?.versionId
  const versionId =
    typeof versionRaw === "number"
      ? versionRaw
      : Number(versionRaw) || 0
  return {
    usfm: String(raw?.usfm ?? ""),
    reference: String(raw?.reference ?? ""),
    versionId,
    versionTitle: String(raw?.versionTitle ?? ""),
  }
}

/**
 * Ensures `biblePassage` uses paragraph content (not atom `body`/`attribution` attrs) and drops legacy attrs.
 * Safe on every load; idempotent when already normalized.
 */
export function migrateBiblePassageDoc(doc: JSONContent): JSONContent {
  const mapNode = (node: JSONContent): JSONContent => {
    if (node.type === "biblePassage") {
      const raw = (node.attrs ?? {}) as Record<string, unknown>
      const attrs = normalizeBiblePassageAttrs(raw)
      const hasParagraphs =
        Array.isArray(node.content) && node.content.length >= 2

      if (!hasParagraphs) {
        const body = String(raw.body ?? "")
        const attribution = String(raw.attribution ?? "")
        return {
          type: "biblePassage",
          attrs,
          content: [
            {
              type: "paragraph",
              content: body ? [{ type: "text", text: body }] : [],
            },
            {
              type: "paragraph",
              content: attribution ? [{ type: "text", text: attribution }] : [],
            },
          ],
        }
      }

      return {
        type: "biblePassage",
        attrs,
        content: node.content!.map(mapNode),
      }
    }
    if (node.content?.length) {
      return { ...node, content: node.content.map(mapNode) }
    }
    return node
  }
  return mapNode(doc)
}

/**
 * Parse `"{reference} ({version}). Scripture courtesy of YouVersion."`
 */
function parseLegacyAttributionLine(line: string): {
  reference: string
  versionTitle?: string
} | null {
  const trimmed = line.trim()
  if (!trimmed.endsWith(LEGACY_ATTRIBUTION_SUFFIX)) return null
  const head = trimmed.slice(0, -LEGACY_ATTRIBUTION_SUFFIX.length).trim()
  const m = head.match(/^(.+?)\s+\(([^)]+)\)\.\s*$/)
  if (m) {
    return { reference: m[1].trim(), versionTitle: m[2].trim() }
  }
  return { reference: head }
}

function tryLegacyBlockquote(node: JSONContent): ExtractedBiblePassage | null {
  if (node.type !== "blockquote" || !node.content || node.content.length < 2) {
    return null
  }
  const second = node.content[1]
  if (second.type !== "paragraph") return null
  const attributionLine = collectParagraphText(second)
  const parsed = parseLegacyAttributionLine(attributionLine)
  if (!parsed || !parsed.reference) return null
  return {
    source: "legacyBlockquote",
    reference: parsed.reference,
    ...(parsed.versionTitle ? { versionTitle: parsed.versionTitle } : {}),
    attributionLine,
  }
}

/**
 * Walks a Tiptap JSON document and returns structured scripture metadata.
 * Prefer `source === "biblePassage"` entries; `legacyBlockquote` matches older notes
 * that used a plain blockquote + YouVersion attribution paragraph.
 */
export function extractBiblePassagesFromDoc(
  doc: JSONContent | null | undefined,
): ExtractedBiblePassage[] {
  if (!doc) return []
  const results: ExtractedBiblePassage[] = []

  const visit = (node: JSONContent) => {
    if (node.type === "biblePassage" && node.attrs) {
      const a = node.attrs as Record<string, unknown>
      const versionRaw = a.versionId
      const versionId =
        typeof versionRaw === "number"
          ? versionRaw
          : Number(versionRaw) || 0
      results.push({
        source: "biblePassage",
        usfm: String(a.usfm ?? ""),
        reference: String(a.reference ?? ""),
        versionId,
        versionTitle: String(a.versionTitle ?? ""),
      })
    } else {
      const legacy = tryLegacyBlockquote(node)
      if (legacy) results.push(legacy)
    }
    node.content?.forEach(visit)
  }

  visit(doc)
  return results
}
