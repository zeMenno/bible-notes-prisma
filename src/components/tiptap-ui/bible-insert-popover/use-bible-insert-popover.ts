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
  const canInsert = canInsertBiblePassage(editor)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!editor) return
    const handleSelectionUpdate = () => {
      setIsVisible(
        shouldShowBibleInsertButton({ editor, hideWhenUnavailable }),
      )
    }
    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  return { isVisible, canInsert }
}

export function useBibleInsertPopover(config?: UseBibleInsertPopoverConfig) {
  const { editor: providedEditor, hideWhenUnavailable = false } = config || {}
  const { editor } = useTiptapEditor(providedEditor)
  const { isVisible, canInsert } = useBibleInsertPopoverState({
    editor,
    hideWhenUnavailable,
  })

  return {
    isVisible,
    canInsert,
    label: "Insert Bible passage",
  }
}

