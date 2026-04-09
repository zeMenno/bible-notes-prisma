import type { JSONContent } from "@tiptap/core"
import { Node as PMNode } from "@tiptap/pm/model"
import type { EditorState, Transaction } from "@tiptap/pm/state"
import { TextSelection } from "@tiptap/pm/state"
import { mergeAttributes, Node } from "@tiptap/react"
import {
  BIBLE_PASSAGE_REPLACE_META,
  biblePassageLockPlugin,
} from "@/components/tiptap-node/bible-passage-node/bible-passage-lock-plugin"

export type BiblePassageAttrs = {
  usfm: string
  reference: string
  versionId: number
  versionTitle: string
}

function readDataAttr(el: HTMLElement, name: string): string {
  return el.getAttribute(name) ?? ""
}

export const BiblePassage = Node.create({
  name: "biblePassage",

  group: "block",

  defining: true,

  draggable: true,

  content: "paragraph paragraph",

  addAttributes() {
    return {
      usfm: {
        default: "",
        renderHTML: (attrs) =>
          attrs.usfm ? { "data-usfm": attrs.usfm as string } : {},
        parseHTML: (el) =>
          typeof el !== "string" ? readDataAttr(el as HTMLElement, "data-usfm") : "",
      },
      reference: {
        default: "",
        renderHTML: (attrs) =>
          attrs.reference ? { "data-reference": attrs.reference as string } : {},
        parseHTML: (el) =>
          typeof el !== "string"
            ? readDataAttr(el as HTMLElement, "data-reference")
            : "",
      },
      versionId: {
        default: 0,
        renderHTML: (attrs) => ({
          "data-version-id": String(attrs.versionId ?? 0),
        }),
        parseHTML: (el) => {
          if (typeof el === "string") return 0
          const raw = readDataAttr(el as HTMLElement, "data-version-id")
          const n = Number(raw)
          return Number.isFinite(n) ? n : 0
        },
      },
      versionTitle: {
        default: "",
        renderHTML: (attrs) =>
          attrs.versionTitle
            ? { "data-version-title": attrs.versionTitle as string }
            : {},
        parseHTML: (el) =>
          typeof el !== "string"
            ? readDataAttr(el as HTMLElement, "data-version-title")
            : "",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-bible-passage]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-bible-passage": "",
        class: "tiptap-bible-passage",
      }),
      0,
    ]
  },

  addProseMirrorPlugins() {
    return [biblePassageLockPlugin()]
  },

  addCommands() {
    return {
      replaceBiblePassage:
        (json: JSONContent) =>
        ({
          state,
          dispatch,
        }: {
          state: EditorState
          dispatch?: (tr: Transaction) => void
        }) => {
          if (!json || json.type !== "biblePassage") return false
          const { $from } = state.selection
          let pos = -1
          let old: PMNode | null = null
          for (let d = $from.depth; d > 0; d--) {
            const n = $from.node(d)
            if (n.type.name === "biblePassage") {
              pos = $from.before(d)
              old = n
              break
            }
          }
          if (pos < 0 || !old) return false

          let next: PMNode
          try {
            next = PMNode.fromJSON(state.schema, json)
          } catch {
            return false
          }
          if (next.type.name !== "biblePassage") return false

          const tr = state.tr
          const from = pos
          const to = pos + old.nodeSize
          tr.replaceWith(from, to, next)
          tr.setMeta(BIBLE_PASSAGE_REPLACE_META, true)
          const $inner = tr.doc.resolve(from + 1)
          tr.setSelection(TextSelection.near($inner))
          if (dispatch) dispatch(tr)
          return true
        },
    }
  },
})

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    biblePassage: {
      replaceBiblePassage: (json: JSONContent) => ReturnType
    }
  }
}

export default BiblePassage
