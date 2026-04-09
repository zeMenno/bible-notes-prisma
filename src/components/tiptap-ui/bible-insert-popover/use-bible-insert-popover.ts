"use client"

import { useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { isNodeTypeSelected } from "@/lib/tiptap-utils"

export interface UseBibleInsertPopoverConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
}

export function canInsertBiblePassage(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (isNodeTypeSelected(editor, ["image"], true)) return false
  if (editor.isActive("code")) return false
  return true
}

/** Toolbar / popover trigger: allow opening when insert is allowed or cursor is inside a passage (replace). */
export function canOpenBiblePassageUi(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (editor.isActive("biblePassage")) return true
  return canInsertBiblePassage(editor)
}

export function shouldShowBibleInsertButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props
  if (!editor || !editor.isEditable) return false
  if (!hideWhenUnavailable) return true
  if (!editor.isActive("code")) {
    return canInsertBiblePassage(editor)
  }
  return true
}

export function useBibleInsertPopoverState(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}) {
  const { editor, hideWhenUnavailable = false } = props
  const [isVisible, setIsVisible] = useState(true)
  const [canInsert, setCanInsert] = useState(false)
  const [passageActive, setPassageActive] = useState(false)

  useEffect(() => {
    if (!editor) return
    const sync = () => {
      setIsVisible(
        shouldShowBibleInsertButton({ editor, hideWhenUnavailable }),
      )
      setCanInsert(canOpenBiblePassageUi(editor))
      setPassageActive(editor.isActive("biblePassage"))
    }
    sync()
    editor.on("selectionUpdate", sync)
    editor.on("transaction", sync)
    return () => {
      editor.off("selectionUpdate", sync)
      editor.off("transaction", sync)
    }
  }, [editor, hideWhenUnavailable])

  return { isVisible, canInsert, passageActive }
}

export function useBibleInsertPopover(config?: UseBibleInsertPopoverConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false } = config || {}
  const { editor } = useTiptapEditor(providedEditor)
  const { isVisible, canInsert, passageActive } = useBibleInsertPopoverState({
    editor,
    hideWhenUnavailable,
  })

  const label = passageActive ? "Change Bible passage" : "Insert Bible passage"

  return {
    isVisible,
    canInsert,
    passageActive,
    label,
  }
}

