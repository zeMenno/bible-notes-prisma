"use client"

import { forwardRef, useCallback, useEffect, useMemo, useState } from "react"
import { BookOpen } from "lucide-react"
import type { Editor } from "@tiptap/react"
import {
  useBibleClient,
  useBooks,
  useChapters,
  useVersions,
  useVerses,
} from "@youversion/platform-react-hooks"

import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import {
  buildUsfmPassageRange,
  chapterNumberFromApi,
  verseNumberFromApi,
} from "@/lib/bible-usfm"
import { CornerDownLeftIcon } from "@/components/tiptap-icons/corner-down-left-icon"
import type { UseBibleInsertPopoverConfig } from "@/components/tiptap-ui/bible-insert-popover/use-bible-insert-popover"
import { useBibleInsertPopover } from "@/components/tiptap-ui/bible-insert-popover/use-bible-insert-popover"
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  Card,
  CardBody,
  CardGroupLabel,
} from "@/components/tiptap-ui-primitive/card"
import { Input } from "@/components/tiptap-ui-primitive/input"
import { ButtonGroup } from "@/components/tiptap-ui-primitive/button-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tiptap-ui-primitive/popover"
import "./bible-insert-popover.scss"

const HAS_APP_KEY =
  (process.env.NEXT_PUBLIC_YOUVERSION_APP_KEY ?? "").trim().length > 0

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <CardGroupLabel className="w-full text-left text-xs font-medium">
      {children}
    </CardGroupLabel>
  )
}

export interface BibleInsertMainProps {
  editor: Editor | null
  onInserted?: () => void
}

export function BibleInsertMain({ editor, onInserted }: BibleInsertMainProps) {
  const bibleClient = useBibleClient()
  const isMobile = useIsBreakpoint()

  const [versionId, setVersionId] = useState(0)
  const [bookId, setBookId] = useState("")
  const [chapterNum, setChapterNum] = useState<number | null>(null)
  const [verseFrom, setVerseFrom] = useState<number | null>(null)
  const [verseTo, setVerseTo] = useState<number | null>(null)
  const [inserting, setInserting] = useState(false)
  const [insertError, setInsertError] = useState<string | null>(null)

  const { versions, loading: versionsLoading, error: versionsError } =
    useVersions("en*", undefined, { enabled: HAS_APP_KEY })

  const { books, loading: booksLoading, error: booksError } = useBooks(
    versionId,
    { enabled: HAS_APP_KEY && versionId > 0 },
  )

  const { chapters, loading: chaptersLoading, error: chaptersError } =
    useChapters(versionId, bookId, {
      enabled: HAS_APP_KEY && versionId > 0 && bookId.length > 0,
    })

  const { verses, loading: versesLoading, error: versesError } = useVerses(
    versionId,
    bookId,
    chapterNum ?? 0,
    {
      enabled:
        HAS_APP_KEY &&
        versionId > 0 &&
        bookId.length > 0 &&
        chapterNum != null &&
        chapterNum > 0,
    },
  )

  useEffect(() => {
    if (!versions?.data?.length || versionId > 0) return
    setVersionId(versions.data[0].id)
  }, [versions, versionId])

  useEffect(() => {
    if (!books?.data?.length) {
      setBookId("")
      return
    }
    setBookId((prev) => {
      if (prev && books.data.some((b) => b.id === prev)) return prev
      return books.data[0].id
    })
  }, [books])

  useEffect(() => {
    if (!chapters?.data?.length) {
      setChapterNum(null)
      return
    }
    const nums = chapters.data
      .map((ch) => chapterNumberFromApi(ch))
      .sort((a, b) => a - b)
    setChapterNum((prev) => {
      if (prev != null && nums.includes(prev)) return prev
      return nums[0] ?? null
    })
  }, [chapters])

  useEffect(() => {
    if (!verses?.data?.length) {
      setVerseFrom(null)
      setVerseTo(null)
      return
    }
    const nums = verses.data
      .map((v, i) => verseNumberFromApi(v, i))
      .sort((a, b) => a - b)
    setVerseFrom((prev) => {
      if (prev != null && nums.includes(prev)) return prev
      return nums[0] ?? null
    })
    setVerseTo((prev) => {
      if (prev != null && nums.includes(prev)) return prev
      return nums[0] ?? null
    })
  }, [verses])

  const sortedChapterNums = useMemo(() => {
    if (!chapters?.data?.length) return []
    return chapters.data
      .map((ch) => chapterNumberFromApi(ch))
      .sort((a, b) => a - b)
  }, [chapters])

  const sortedVerseNums = useMemo(() => {
    if (!verses?.data?.length) return []
    return verses.data
      .map((v, i) => verseNumberFromApi(v, i))
      .sort((a, b) => a - b)
  }, [verses])

  const versionTitle = useMemo(() => {
    const v = versions?.data?.find((x) => x.id === versionId)
    return v?.localized_title ?? v?.title ?? "Bible"
  }, [versions, versionId])

  const listError =
    versionsError?.message ??
    booksError?.message ??
    chaptersError?.message ??
    versesError?.message ??
    null

  const handleInsert = useCallback(async () => {
    if (!HAS_APP_KEY) {
      setInsertError("Add NEXT_PUBLIC_YOUVERSION_APP_KEY to your environment.")
      return
    }
    if (!editor?.isEditable) return
    if (!bookId || chapterNum == null || verseFrom == null || verseTo == null) {
      setInsertError("Choose a book, chapter, and verses.")
      return
    }

    const usfm = buildUsfmPassageRange(bookId, chapterNum, verseFrom, verseTo)
    if (!usfm) {
      setInsertError("Invalid passage range.")
      return
    }

    setInserting(true)
    setInsertError(null)
    try {
      const passage = await bibleClient.getPassage(
        versionId,
        usfm,
        "text",
        false,
        false,
      )
      const body = passage.content.trim()
      const attribution = `${passage.reference} (${versionTitle}). Scripture courtesy of YouVersion.`

      editor
        .chain()
        .focus()
        .insertContent({
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: body || passage.reference }],
            },
            {
              type: "paragraph",
              content: [{ type: "text", text: attribution }],
            },
          ],
        })
        .run()

      onInserted?.()
    } catch (e) {
      setInsertError(
        e instanceof Error ? e.message : "Could not load this passage.",
      )
    } finally {
      setInserting(false)
    }
  }, [
    bibleClient,
    bookId,
    chapterNum,
    editor,
    onInserted,
    verseFrom,
    verseTo,
    versionId,
    versionTitle,
  ])

  const busy =
    inserting ||
    versionsLoading ||
    booksLoading ||
    chaptersLoading ||
    versesLoading

  const canSubmit =
    HAS_APP_KEY &&
    versionId > 0 &&
    bookId.length > 0 &&
    chapterNum != null &&
    verseFrom != null &&
    verseTo != null &&
    !busy

  return (
    <Card
      className="bible-insert-card w-full min-w-[min(100vw-2rem,22rem)] max-w-[22rem]"
      style={{
        ...(isMobile ? { boxShadow: "none", border: 0 } : {}),
      }}
    >
      <CardBody
        className="bible-insert-card-body flex w-full flex-col gap-2"
        style={{
          ...(isMobile ? { padding: 0 } : {}),
        }}
      >
        {!HAS_APP_KEY ? (
          <p className="text-xs text-[var(--tt-gray-dark-a-600)]">
            Set{" "}
            <code className="rounded bg-[var(--tt-gray-dark-a-100)] px-1 py-0.5 text-[10px]">
              NEXT_PUBLIC_YOUVERSION_APP_KEY
            </code>{" "}
            in{" "}
            <code className="rounded bg-[var(--tt-gray-dark-a-100)] px-1 py-0.5 text-[10px]">
              .env
            </code>{" "}
            (from{" "}
            <a
              href="https://platform.youversion.com/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              YouVersion Platform
            </a>
            ).
          </p>
        ) : null}

        {listError ? (
          <p className="text-xs text-red-500" role="alert">
            {listError}
          </p>
        ) : null}

        {insertError ? (
          <p className="text-xs text-red-500" role="alert">
            {insertError}
          </p>
        ) : null}

        <div className="flex flex-col gap-1">
          <FieldLabel>Translation</FieldLabel>
          <select
            className="tiptap-input bible-insert-select"
            disabled={!HAS_APP_KEY || versionsLoading || !versions?.data?.length}
            value={versionId > 0 ? String(versionId) : ""}
            onChange={(e) => {
              const next = Number(e.target.value)
              setVersionId(next || 0)
              setBookId("")
              setChapterNum(null)
              setVerseFrom(null)
              setVerseTo(null)
            }}
            aria-label="Translation"
          >
            {versionsLoading ? (
              <option value="">Loading…</option>
            ) : (
              versions?.data?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.localized_title || v.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <FieldLabel>Book</FieldLabel>
          <select
            className="tiptap-input bible-insert-select"
            disabled={!HAS_APP_KEY || booksLoading || !books?.data?.length}
            value={bookId}
            onChange={(e) => {
              setBookId(e.target.value)
              setChapterNum(null)
              setVerseFrom(null)
              setVerseTo(null)
            }}
            aria-label="Book"
          >
            {!books?.data?.length ? (
              <option value="">—</option>
            ) : (
              books.data.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <FieldLabel>Chapter</FieldLabel>
            <select
              className="tiptap-input bible-insert-select"
              disabled={
                !HAS_APP_KEY ||
                chaptersLoading ||
                sortedChapterNums.length === 0
              }
              value={chapterNum != null ? String(chapterNum) : ""}
              onChange={(e) => {
                const n = Number(e.target.value)
                setChapterNum(Number.isNaN(n) ? null : n)
                setVerseFrom(null)
                setVerseTo(null)
              }}
              aria-label="Chapter"
            >
              {sortedChapterNums.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>From</FieldLabel>
            <select
              className="tiptap-input bible-insert-select"
              disabled={
                !HAS_APP_KEY || versesLoading || sortedVerseNums.length === 0
              }
              value={verseFrom != null ? String(verseFrom) : ""}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (!Number.isNaN(n)) setVerseFrom(n)
              }}
              aria-label="Verse from"
            >
              {sortedVerseNums.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>To</FieldLabel>
            <select
              className="tiptap-input bible-insert-select"
              disabled={
                !HAS_APP_KEY || versesLoading || sortedVerseNums.length === 0
              }
              value={verseTo != null ? String(verseTo) : ""}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (!Number.isNaN(n)) setVerseTo(n)
              }}
              aria-label="Verse to"
            >
              {sortedVerseNums.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Input
            type="text"
            readOnly
            tabIndex={-1}
            className="pointer-events-none flex-1 opacity-70"
            value={
              versionId > 0 && bookId && chapterNum != null && verseFrom != null && verseTo != null
                ? buildUsfmPassageRange(
                    bookId,
                    chapterNum,
                    verseFrom,
                    verseTo,
                  ) ?? ""
                : ""
            }
            placeholder="USFM preview"
            aria-label="USFM reference preview"
          />
          <ButtonGroup>
            <Button
              type="button"
              onClick={() => void handleInsert()}
              title="Insert passage"
              disabled={!canSubmit}
              variant="ghost"
            >
              <CornerDownLeftIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </div>
      </CardBody>
    </Card>
  )
}

export const BibleInsertButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        type="button"
        className={className}
        variant="ghost"
        role="button"
        tabIndex={-1}
        aria-label="Bible passage"
        tooltip="Bible passage"
        ref={ref}
        {...props}
      >
        {children || <BookOpen className="tiptap-button-icon" />}
      </Button>
    )
  },
)

BibleInsertButton.displayName = "BibleInsertButton"

export function BibleInsertContent({
  editor,
  onInserted,
}: {
  editor?: Editor | null
  onInserted?: () => void
}) {
  const { editor: ctxEditor } = useTiptapEditor(editor)
  return <BibleInsertMain editor={ctxEditor} onInserted={onInserted} />
}

export interface BibleInsertPopoverProps
  extends Omit<ButtonProps, "type">, UseBibleInsertPopoverConfig {
  onOpenChange?: (isOpen: boolean) => void
}

export const BibleInsertPopover = forwardRef<
  HTMLButtonElement,
  BibleInsertPopoverProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onOpenChange,
      onClick,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState(false)
    const { isVisible, canInsert, label } = useBibleInsertPopover({
      editor,
      hideWhenUnavailable,
    })

    const handleOnOpenChange = useCallback(
      (next: boolean) => {
        setIsOpen(next)
        onOpenChange?.(next)
      },
      [onOpenChange],
    )

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setIsOpen(!isOpen)
      },
      [onClick, isOpen],
    )

    const handleInserted = useCallback(() => {
      setIsOpen(false)
    }, [])

    if (!isVisible) {
      return null
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <BibleInsertButton
            disabled={!canInsert}
            data-disabled={!canInsert}
            aria-label={label}
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
          >
            {children ?? <BookOpen className="tiptap-button-icon" />}
          </BibleInsertButton>
        </PopoverTrigger>

        <PopoverContent>
          <BibleInsertMain editor={editor} onInserted={handleInserted} />
        </PopoverContent>
      </Popover>
    )
  },
)

BibleInsertPopover.displayName = "BibleInsertPopover"

export default BibleInsertPopover
