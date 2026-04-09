import type { Mapping } from "@tiptap/pm/transform"
import type { Node as PMNode } from "@tiptap/pm/model"
import { Plugin, PluginKey } from "@tiptap/pm/state"

const biblePassageLockKey = new PluginKey("biblePassageTextLock")

/** Set on transactions from `replaceBiblePassage` only; bypasses plain-text lock for that step. */
export const BIBLE_PASSAGE_REPLACE_META = "biblePassageReplace"

/**
 * Plain text of everything under a biblePassage (verse + attribution), in document order.
 * Marks are ignored; structure (paragraphs, hard breaks) is flattened consistently.
 */
function passagePlainText(passage: PMNode): string {
  return passage.textBetween(0, passage.content.size, "\n", (leaf) =>
    leaf.type.name === "hardBreak" ? "\n" : "",
  )
}

function transactionPreservesPassageText(tr: {
  before: PMNode
  after: PMNode
  mapping: Mapping
}): boolean {
  const { before, after, mapping } = tr
  let ok = true
  before.descendants((node, pos) => {
    if (node.type.name !== "biblePassage") return true
    const mapped = mapping.mapResult(pos)
    if (mapped.deleted) return true

    const next = after.nodeAt(mapped.pos)
    if (!next || next.type.name !== "biblePassage") {
      ok = false
      return false
    }
    if (passagePlainText(node) !== passagePlainText(next)) {
      ok = false
      return false
    }
    return true
  })
  return ok
}

export function biblePassageLockPlugin() {
  return new Plugin({
    key: biblePassageLockKey,
    filterTransaction(transaction, state) {
      if (!transaction.docChanged) return true
      if (transaction.getMeta(BIBLE_PASSAGE_REPLACE_META) === true) return true
      return transactionPreservesPassageText({
        before: state.doc,
        after: transaction.doc,
        mapping: transaction.mapping,
      })
    },
  })
}
