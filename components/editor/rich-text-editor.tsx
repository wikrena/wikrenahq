"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Typography from "@tiptap/extension-typography"
import { useState, useEffect, useCallback } from "react"
import {
  Bold, Italic, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Link2, ImageIcon, FileText, Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value:       string
  onChange:    (html: string) => void
  placeholder?: string
}

// Convert basic Markdown to HTML for the "paste markdown" flow
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hublpi])/gm, "<p>")
    .replace(/(?<![>])$/gm, "</p>")
    .replace(/<p><\/p>/g, "")
}

// Convert HTML back to Markdown for the markdown view
function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<blockquote>(.*?)<\/blockquote>/gi, "> $1\n\n")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<ul>(.*?)<\/ul>/gis, "$1\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim()
}

const ToolbarButton = ({ onClick, active, disabled, title, children }: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all",
      active
        ? "bg-teal-100 text-teal-700 border border-teal-300"
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
      disabled && "opacity-30 cursor-not-allowed"
    )}
  >
    {children}
  </button>
)

export function RichTextEditor({ value, onChange, placeholder = "Start writing your lesson content..." }: Props) {
  const [mode,       setMode]       = useState<"rich" | "markdown">("rich")
  const [markdownVal, setMarkdownVal] = useState("")

  const editor = useEditor({
    immediatelyRender: false,   // required for Next.js SSR — prevents hydration mismatch
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: { class: "bg-[#0d1117] text-green-300 p-4 rounded-xl font-code text-sm overflow-x-auto" },
        },
        blockquote: {
          HTMLAttributes: { class: "border-l-4 border-teal-500 pl-4 text-neutral-500 italic" },
        },
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Typography,
    ],
    content:    value || "",
    onUpdate:   ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[400px] p-4 focus:outline-none text-navy-800 prose-headings:font-display prose-code:font-code prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
      },
    },
  })

  // Sync external value changes into editor (e.g. when loading saved content)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Switch to markdown mode — convert current HTML to markdown
  function switchToMarkdown() {
    if (!editor) return
    setMarkdownVal(htmlToMarkdown(editor.getHTML()))
    setMode("markdown")
  }

  // Switch back to rich text — convert markdown to HTML and load into editor
  function switchToRich() {
    if (!editor) return
    const html = markdownToHtml(markdownVal)
    editor.commands.setContent(html, true)
    onChange(html)
    setMode("rich")
  }

  function addLink() {
    const url = window.prompt("Enter URL:")
    if (!url || !editor) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  if (!editor) return null

  return (
    <div className="border-2 border-[#E5E9F0] rounded-xl overflow-hidden bg-white focus-within:border-teal-400 transition-colors">

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[#E5E9F0] bg-[#F6F8FA] flex-wrap">

        {mode === "rich" ? (
          <>
            {/* History */}
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
              <Undo className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
              <Redo className="w-3.5 h-3.5" />
            </ToolbarButton>

            <div className="w-px h-5 bg-neutral-200 mx-1" />

            {/* Headings */}
            <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="w-3.5 h-3.5" />
            </ToolbarButton>

            <div className="w-px h-5 bg-neutral-200 mx-1" />

            {/* Inline */}
            <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
              <Bold className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <Italic className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
              <Code className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Link" active={editor.isActive("link")} onClick={addLink}>
              <Link2 className="w-3.5 h-3.5" />
            </ToolbarButton>

            <div className="w-px h-5 bg-neutral-200 mx-1" />

            {/* Blocks */}
            <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <List className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <ListOrdered className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <Quote className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <FileText className="w-3.5 h-3.5" />
            </ToolbarButton>
            <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
              <Minus className="w-3.5 h-3.5" />
            </ToolbarButton>

            <div className="ml-auto" />
            <button type="button" onClick={switchToMarkdown}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-navy-800 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors font-code">
              <FileText className="w-3 h-3" /> Markdown
            </button>
          </>
        ) : (
          <>
            <span className="text-xs font-code text-neutral-400 font-semibold">Markdown mode</span>
            <div className="ml-auto" />
            <button type="button" onClick={switchToRich}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-800 px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors">
              <Eye className="w-3 h-3" /> Rich Text
            </button>
          </>
        )}
      </div>

      {/* Editor area */}
      {mode === "rich" ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          value={markdownVal}
          onChange={e => setMarkdownVal(e.target.value)}
          className="w-full min-h-[400px] p-4 font-code text-sm text-navy-800 resize-y outline-none bg-white"
          placeholder="Write in Markdown..."
          spellCheck={false}
        />
      )}
    </div>
  )
}
