"use client"

import { useEffect, useRef, useState } from "react"
import { BookOpen } from "lucide-react"
import { YouVersionProvider } from "@youversion/platform-react-ui"
import type { JSONContent } from "@tiptap/core"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { BiblePassage } from "@/components/tiptap-node/bible-passage-node/bible-passage-extension"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/bible-passage-node/bible-passage-node.scss"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  BibleInsertPopover,
  BibleInsertContent,
  BibleInsertButton,
} from "@/components/tiptap-ui/bible-insert-popover"
import { useBibleInsertPopover } from "@/components/tiptap-ui/bible-insert-popover/use-bible-insert-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { cn, handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import content from "@/components/tiptap-templates/simple/data/content.json"

const YOUVERSION_APP_KEY = process.env.NEXT_PUBLIC_YOUVERSION_APP_KEY ?? ""

export type SimpleEditorProps = {
  /** When set, replaces the template demo document. */
  initialContent?: JSONContent | null
  /** Called after editor updates (including initial hydration); consumers may debounce saves. */
  onDocumentChange?: (doc: JSONContent) => void
  /**
   * `embedded`: fill a parent flex column (e.g. below a note title); toolbar sits above the scrolling body.
   * `fullscreen`: standalone page height (demo route).
   */
  layout?: "embedded" | "fullscreen"
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onBibleClick,
  isMobile,
  bibleToolbarLabel,
  biblePassageToolbarActive,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  onBibleClick: () => void
  isMobile: boolean
  bibleToolbarLabel: string
  biblePassageToolbarActive: boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
        {!isMobile ? (
          <BibleInsertPopover />
        ) : (
          <BibleInsertButton
            onClick={onBibleClick}
            tooltip={bibleToolbarLabel}
            aria-label={bibleToolbarLabel}
            data-active-state={biblePassageToolbarActive ? "on" : "off"}
            aria-pressed={biblePassageToolbarActive}
          />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  view,
  onBack,
}: {
  view: "highlighter" | "link" | "bible"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {view === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : view === "link" ? (
          <LinkIcon className="tiptap-button-icon" />
        ) : (
          <BookOpen className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {view === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : view === "bible" ? (
      <BibleInsertContent onInserted={onBack} />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({
  initialContent,
  onDocumentChange,
  layout = "fullscreen",
}: SimpleEditorProps = {}) {
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<
    "main" | "highlighter" | "link" | "bible"
  >("main")
  const toolbarRef = useRef<HTMLDivElement>(null)

  const documentContent = (initialContent ?? content) as JSONContent

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      BiblePassage,
    ],
    content: documentContent,
    onUpdate: ({ editor }) => {
      onDocumentChange?.(editor.getJSON())
    },
  })

  useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    overlayPlacement: "top",
  })

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const { label: bibleToolbarLabel, passageActive: biblePassageToolbarActive } =
    useBibleInsertPopover({
      editor: editor ?? null,
      hideWhenUnavailable: false,
    })

  return (
    <YouVersionProvider appKey={YOUVERSION_APP_KEY} theme="dark">
      <div
        className={cn(
          "simple-editor-wrapper",
          layout === "embedded"
            ? "simple-editor-wrapper--embedded"
            : "simple-editor-wrapper--fullscreen",
        )}
      >
        <EditorContext.Provider value={{ editor }}>
          <Toolbar
            ref={toolbarRef}
            className={cn(
              isMobile &&
                mobileView !== "main" &&
                "tiptap-toolbar-mobile-expanded",
            )}
          >
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                onBibleClick={() => setMobileView("bible")}
                isMobile={isMobile}
                bibleToolbarLabel={bibleToolbarLabel}
                biblePassageToolbarActive={biblePassageToolbarActive}
              />
            ) : (
              <MobileToolbarContent
                view={mobileView}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>

          <div className="simple-editor-scroll">
            <EditorContent
              editor={editor}
              role="presentation"
              className="simple-editor-content"
            />
          </div>
        </EditorContext.Provider>
      </div>
    </YouVersionProvider>
  )
}
