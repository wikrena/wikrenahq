"use client"
import { useState, useRef } from "react"
import { Send, Loader2, Bot, Plus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type Mode = "explain" | "hint" | "debug" | "quiz" | "career"
const MODES: { id: Mode; label: string; desc: string }[] = [
  { id:"explain", label:"Explain",desc:"Understand concepts clearly" },
  { id:"hint",    label:"Hint",   desc:"Get progressive hints" },
  { id:"debug",   label:"Debug",  desc:"Fix code errors" },
  { id:"quiz",    label:"Quiz",   desc:"Test your knowledge" },
  { id:"career",  label:"Career", desc:"Connect skills to jobs" },
]

interface Props { userId: string; sessions: any[] }

export function WrenAiTutor({ userId, sessions }: Props) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi! I'm Wren 👋 Your AI tutor, powered by Claude. I know your learning progress and I always explain things using African business examples — MTN, Flutterwave, Access Bank and more.\n\nHow can I help you today? Pick a mode or just ask me anything!" }
  ])
  const [input, setInput]         = useState("")
  const [mode, setMode]           = useState<Mode>("explain")
  const [loading, setLoading]     = useState(false)
  const [sessionId, setSessionId] = useState<string|undefined>()
  const endRef = useRef<HTMLDivElement>(null)

  async function send() {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput("")
    setMessages(p => [...p, { role:"user", content:msg }])
    setLoading(true)
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId, mode }),
      })
      const data = await res.json()
      setSessionId(data.sessionId)
      setMessages(p => [...p, { role:"assistant", content: data.reply ?? "Sorry, I couldn't get a response. Please try again." }])
      setTimeout(() => endRef.current?.scrollIntoView({ behavior:"smooth" }), 100)
    } catch {
      setMessages(p => [...p, { role:"assistant", content:"Sorry, I'm having trouble connecting right now. Please try again in a moment." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-neutral-100 p-4">
        <button
          onClick={() => { setMessages([{ role:"assistant", content:"Starting a new session! What would you like to learn today?" }]); setSessionId(undefined) }}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700 transition-colors mb-4"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>

        <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2 px-1">Recent Sessions</div>
        {sessions.length > 0 ? sessions.map(s => (
          <button key={s.id} className="text-left px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 hover:text-navy-800 transition-colors truncate">
            {s.title ?? `${s.mode} session`}
          </button>
        )) : (
          <div className="text-xs text-neutral-400 px-1">No previous sessions yet</div>
        )}

        <div className="mt-auto">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-xs font-semibold text-teal-700">Powered by Claude</span>
            </div>
            <p className="text-[10px] text-teal-600 leading-relaxed">Wren uses your learning history to give personalised, Africa-aware help.</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-neutral-100 flex items-center px-4 sm:px-6 gap-3 bg-white shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-navy-700 flex items-center justify-center text-xl shadow-brand-sm shrink-0">🤖</div>
          <div>
            <div className="font-display font-bold text-navy-800">Wren</div>
            <div className="flex items-center gap-1.5 text-xs text-teal-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-dot" />
              Always available · Africa-aware
            </div>
          </div>
        </div>

        {/* Mode pills */}
        <div className="flex gap-2 px-4 sm:px-6 py-3 border-b border-neutral-100 overflow-x-auto scrollbar-hide bg-neutral-50 shrink-0">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                mode === m.id ? "bg-navy-800 text-white border-navy-800" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-navy-800"
              )}>
              {m.label}
            </button>
          ))}
          <div className="text-xs text-neutral-400 flex items-center px-2 whitespace-nowrap shrink-0">
            Mode: <span className="ml-1 text-teal-600 font-semibold capitalize">{mode}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-navy-700 flex items-center justify-center text-sm shrink-0 shadow-brand-sm">🤖</div>
              )}
              <div className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-navy-800 text-white rounded-br-sm"
                  : "bg-white border border-neutral-200 text-navy-800 rounded-bl-sm shadow-card"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-navy-700 flex items-center justify-center text-sm shrink-0">🤖</div>
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-card">
                {[0,.2,.4].map((d,i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay:`${d}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-neutral-100 bg-white shrink-0">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={`Ask Wren to ${mode} something... (Enter to send, Shift+Enter for new line)`}
              rows={2}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all placeholder:text-neutral-400 text-navy-800 leading-relaxed"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-navy-800 text-white rounded-xl disabled:opacity-40 hover:bg-navy-700 transition-colors shrink-0 shadow-brand-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 text-center font-mono">
            Wren uses your learning history · Powered by Anthropic Claude
          </p>
        </div>
      </div>
    </div>
  )
}
