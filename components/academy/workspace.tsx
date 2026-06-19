"use client"

import { useState, useRef } from "react"
import {
  Plus, Play, Save, Trash2, FileCode2,
  ChevronDown, Loader2, Check, X, Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"

const TEMPLATES = [
  {
    lang: "Python", icon: "🐍", ext: "py",
    starter: "# Python Workspace\n# Wikrena Academy — Write, run, and save your code\n\nprint('Hello from Wikrena Academy!')\n\n# Try: variables, loops, functions, data analysis\ndata = [45000, 12000, 88000, 23500, 61000]\ntotal = sum(data)\naverage = total / len(data)\n\nprint(f'Total: ₦{total:,}')\nprint(f'Average: ₦{average:,.0f}')\n"
  },
  {
    lang: "SQL", icon: "🗄️", ext: "sql",
    starter: "-- SQL Workspace\n-- Wikrena Academy — Practice your queries\n\n-- Example: Analyse Nigerian business data\nSELECT \n  region,\n  COUNT(*) AS transactions,\n  SUM(amount) AS total_revenue,\n  AVG(amount) AS avg_transaction\nFROM sales\nWHERE status = 'completed'\nGROUP BY region\nORDER BY total_revenue DESC;\n"
  },
  {
    lang: "R", icon: "📊", ext: "r",
    starter: "# R Workspace\n# Wikrena Academy — Statistical analysis\n\n# Sample data analysis\nrevenue <- c(450000, 280000, 620000, 390000, 510000)\n\ncat('Summary Statistics:\\n')\ncat('Mean:', mean(revenue), '\\n')\ncat('Median:', median(revenue), '\\n')\ncat('Std Dev:', sd(revenue), '\\n')\ncat('Min:', min(revenue), '\\n')\ncat('Max:', max(revenue), '\\n')\n"
  },
]

interface Notebook {
  id:       string
  title:    string
  lang:     string
  code:     string
  output:   string
  isErr:    boolean
  saved:    boolean
  modified: boolean
}

interface Props { workspaces: any[]; userId: string }

function newNotebook(lang: string, existing: Notebook[]): Notebook {
  const template = TEMPLATES.find(t => t.lang === lang) ?? TEMPLATES[0]
  const count    = existing.filter(n => n.lang === lang).length
  return {
    id:       `nb_${Date.now()}`,
    title:    `${lang} Notebook ${count + 1}`,
    lang,
    code:     template.starter,
    output:   "",
    isErr:    false,
    saved:    false,
    modified: false,
  }
}

export function WorkspacePage({ workspaces, userId }: Props) {
  const [notebooks,      setNotebooks]      = useState<Notebook[]>(() => {
    if (workspaces.length > 0) {
      return workspaces.map(w => ({
        id: w.id, title: w.title, lang: w.language ?? "Python",
        code: w.code ?? TEMPLATES[0].starter,
        output: "", isErr: false, saved: true, modified: false,
      }))
    }
    return [newNotebook("Python", [])]
  })
  const [activeId,       setActiveId]       = useState<string>(notebooks[0]?.id ?? "")
  const [running,        setRunning]        = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [showNewMenu,    setShowNewMenu]     = useState(false)
  const [editingTitle,   setEditingTitle]   = useState<string | null>(null)
  const [titleInput,     setTitleInput]     = useState("")

  const active = notebooks.find(n => n.id === activeId) ?? notebooks[0]

  function updateActive(patch: Partial<Notebook>) {
    setNotebooks(ns => ns.map(n => n.id === activeId ? { ...n, ...patch } : n))
  }

  function addNotebook(lang: string) {
    const nb = newNotebook(lang, notebooks)
    setNotebooks(ns => [...ns, nb])
    setActiveId(nb.id)
    setShowNewMenu(false)
  }

  function closeNotebook(id: string) {
    const remaining = notebooks.filter(n => n.id !== id)
    setNotebooks(remaining)
    if (activeId === id) setActiveId(remaining[0]?.id ?? "")
  }

  async function runCode() {
    if (!active || running) return
    setRunning(true)
    updateActive({ output: "", isErr: false })
    try {
      const res  = await fetch("/api/code/run", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: active.code, language: active.lang.toLowerCase() }),
      })
      const data = await res.json()
      const hasErr = !!(data.stderr || data.compile_output)
      updateActive({
        output: data.stderr || data.compile_output || data.stdout || "✓ Ran with no output",
        isErr:  hasErr,
      })
    } catch {
      updateActive({ output: "Could not connect to code runner. Check your connection.", isErr: true })
    } finally { setRunning(false) }
  }

  async function saveNotebook() {
    if (!active || saving) return
    setSaving(true)
    try {
      await fetch("/api/workspaces", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:       active.saved ? active.id : undefined,
          title:    active.title,
          language: active.lang,
          code:     active.code,
        }),
      }).catch(() => null)
      updateActive({ saved: true, modified: false })
    } finally { setSaving(false) }
  }

  function startEditTitle(nb: Notebook) {
    setEditingTitle(nb.id)
    setTitleInput(nb.title)
  }

  function commitTitle() {
    if (!editingTitle || !titleInput.trim()) { setEditingTitle(null); return }
    setNotebooks(ns => ns.map(n => n.id === editingTitle ? { ...n, title: titleInput.trim(), modified: true } : n))
    setEditingTitle(null)
  }

  if (!active) return null

  const template = TEMPLATES.find(t => t.lang === active.lang) ?? TEMPLATES[0]

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0d1117]">

      {/* Tab bar */}
      <div className="flex items-center bg-[#161b22] border-b border-white/[0.08] min-h-[40px] overflow-x-auto">
        {notebooks.map(nb => (
          <div key={nb.id}
            onClick={() => setActiveId(nb.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-r border-white/[0.06] cursor-pointer shrink-0 group transition-colors",
              nb.id === activeId
                ? "bg-[#0d1117] text-white border-t-2 border-t-teal-500"
                : "text-white/40 hover:bg-white/5 hover:text-white/70"
            )}>
            <span className="text-base leading-none">{TEMPLATES.find(t => t.lang === nb.lang)?.icon ?? "📄"}</span>
            {editingTitle === nb.id ? (
              <input
                autoFocus
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={e => { if (e.key === "Enter") commitTitle(); if (e.key === "Escape") setEditingTitle(null) }}
                className="bg-transparent outline-none text-white w-32 font-mono text-xs"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span onDoubleClick={e => { e.stopPropagation(); startEditTitle(nb) }}>
                {nb.title}
                {nb.modified && <span className="text-amber-400 ml-1">●</span>}
              </span>
            )}
            {notebooks.length > 1 && (
              <X className="w-3 h-3 opacity-0 group-hover:opacity-60 hover:opacity-100 shrink-0 transition-opacity"
                onClick={e => { e.stopPropagation(); closeNotebook(nb.id) }} />
            )}
          </div>
        ))}

        {/* New notebook button */}
        <div className="relative ml-1">
          <button
            onClick={() => setShowNewMenu(s => !s)}
            className="flex items-center gap-1 px-3 py-2 text-white/30 hover:text-white/70 text-xs transition-colors">
            <Plus className="w-4 h-4" />
          </button>
          {showNewMenu && (
            <div className="absolute top-full left-0 mt-1 bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20 w-36">
              {TEMPLATES.map(t => (
                <button key={t.lang} onClick={() => addNotebook(t.lang)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                  <span>{t.icon}</span> {t.lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar right */}
        <div className="ml-auto flex items-center gap-1 px-3">
          <button onClick={saveNotebook} disabled={saving || (!active.modified && active.saved)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-30">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-500 hover:bg-teal-400 text-white transition-all disabled:opacity-50">
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" fill="white" />}
            Run
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1 bg-teal-600/80 text-white/90 text-[10px] font-mono">
        <span className="flex items-center gap-1.5">
          <FileCode2 className="w-3 h-3" />
          {active.title}.{template.ext}
        </span>
        <span>{active.lang}</span>
        {active.modified && <span className="text-amber-300">● Modified</span>}
        {active.saved && !active.modified && <span className="text-teal-200">✓ Saved</span>}
        <span className="ml-auto">Wikrena Workspace</span>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Line numbers + editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* Line numbers */}
          <div className="bg-[#0d1117] text-white/20 font-mono text-xs text-right pr-3 pt-4 select-none w-12 shrink-0 overflow-hidden">
            {active.code.split("\n").map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Code area */}
          <textarea
            value={active.code}
            onChange={e => updateActive({ code: e.target.value, modified: true })}
            spellCheck={false}
            className="flex-1 bg-[#0d1117] text-green-300 font-mono text-sm leading-6 p-4 pl-2 outline-none resize-none"
            style={{ tabSize: 4 }}
            onKeyDown={e => {
              if (e.key === "Tab") {
                e.preventDefault()
                const start = e.currentTarget.selectionStart
                const end   = e.currentTarget.selectionEnd
                const val   = active.code
                const newVal = val.substring(0, start) + "    " + val.substring(end)
                updateActive({ code: newVal, modified: true })
                setTimeout(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4
                }, 0)
              }
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault()
                runCode()
              }
              if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault()
                saveNotebook()
              }
            }}
          />
        </div>

        {/* Output panel */}
        {(active.output || running) && (
          <div className="border-t border-white/[0.08] flex flex-col" style={{ minHeight: 120, maxHeight: 240 }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-white/[0.06]">
              <Terminal className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Output</span>
              {active.isErr && <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Error</span>}
              <button onClick={() => updateActive({ output: "", isErr: false })}
                className="ml-auto text-white/20 hover:text-white/60 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className={cn("font-mono text-sm whitespace-pre-wrap",
                active.isErr ? "text-red-400" : "text-green-300")}>
                {running ? "Running..." : active.output}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="bg-[#161b22] border-t border-white/[0.06] px-4 py-1.5 flex gap-4 text-[10px] font-mono text-white/20">
        <span>Ctrl+Enter — Run</span>
        <span>Ctrl+S — Save</span>
        <span>Tab — Indent</span>
        <span>Double-click tab title to rename</span>
      </div>
    </div>
  )
}
