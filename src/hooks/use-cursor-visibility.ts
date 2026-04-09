"use client"

import type { Editor } from "@tiptap/react"
import { useWindowSize } from "@/hooks/use-window-size"
import { useBodyRect } from "@/hooks/use-element-rect"
import { useEffect } from "react"

export interface CursorVisibilityOptions {
  /**
   * The Tiptap editor instance
   */
  editor?: Editor | null
  /**
   * Reference to the toolbar element that may obscure the cursor
   */
  overlayHeight?: number
  /**
   * Toolbar docked at the top (e.g. mobile) vs bottom — scroll direction differs.
   */
  overlayPlacement?: "top" | "bottom"
}

/**
 * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
 * Automatically scrolls the window when the cursor would be hidden by the toolbar.
 *
 * @param options.editor The Tiptap editor instance
 * @param options.overlayHeight Toolbar height to account for
 * @returns The bounding rect of the body
 */
export function useCursorVisibility({
  editor,
  overlayHeight = 0,
  overlayPlacement = "bottom",
}: CursorVisibilityOptions) {
  const { height: windowHeight } = useWindowSize()
  const rect = useBodyRect({
    enabled: true,
    throttleMs: 100,
    useResizeObserver: true,
  })

  useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return

      const { state, view } = editor
      if (!view.hasFocus()) return

      // Get current cursor position coordinates
      const { from } = state.selection
      const cursorCoords = view.coordsAtPos(from)

      if (windowHeight < rect.height && cursorCoords && overlayHeight > 0) {
        const currentScrollY = window.scrollY
        const cursorAbsoluteY = cursorCoords.top + currentScrollY

        if (overlayPlacement === "top") {
          if (cursorCoords.top < overlayHeight) {
            const targetCursorY = overlayHeight + Math.min(120, windowHeight * 0.2)
            const newScrollY = cursorAbsoluteY - targetCursorY
            window.scrollTo({
              top: Math.max(0, newScrollY),
              behavior: "smooth",
            })
          }
        } else {
          const availableSpace = windowHeight - cursorCoords.top
          if (availableSpace < overlayHeight) {
            const targetCursorY = Math.max(windowHeight / 2, overlayHeight)
            const newScrollY = cursorAbsoluteY - targetCursorY
            window.scrollTo({
              top: Math.max(0, newScrollY),
              behavior: "smooth",
            })
          }
        }
      }
    }

    ensureCursorVisibility()
  }, [editor, overlayHeight, overlayPlacement, windowHeight, rect.height])

  return rect
}
