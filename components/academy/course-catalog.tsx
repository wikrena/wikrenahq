"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, BookOpen, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Course {
  id: string; title: string; slug: string; short_description: string | null
  difficulty: string; estimated_hours: number; language: string
  is_free: boolean; tags: string[]
  chapters: { id: string; lessons: { id: string }[] }[]
}

interface Props {
  courses:     Course[]
  enrolledIds: Set<string>
  userId:      string | null
}

const DIFF_COLOR: Record<string, string> = {
  BEGINNER:     "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED:     "bg-red-100 text-red-700",
}

const DIFF_BAR: Record<string, string> = {
  BEGINNER:     "from-emerald-400 to-teal-500",
  INTERMEDIATE: "from-amber-400 to-orange-500",
  ADVANCED:     "from-purple-500 to-pink-500",
}

const LANG_EMOJI: Record<string, string> = {
  python: "🐍", sql: "🗄️", r: "📊", javascript: "⚡", excel: "📗",
}

export function CourseCatalog({ courses, enrolledIds, userId }: Props) {
  const [search,     setSearch]     = useState("")
  const [filter,     setFilter]     = useState<"all"|"free"|"beginner"|"intermediate"|"advanced">("all")
  const [langFilter, setLangFilter] = useState("all")
  const [filtersOpen,setFiltersOpen]= useState(false)

  const langs = ["all", ...Array.from(new Set(courses.map(c => c.language)))]

  const filtered = courses.filter(c => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.short_description ?? "").toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchFilter =
      filter === "all"          ? true :
      filter === "free"         ? c.is_free :
      filter === "beginner"     ? c.difficulty === "BEGINNER" :
      filter === "intermediate" ? c.difficulty === "INTERMEDIATE" :
      filter === "advanced"     ? c.difficulty === "ADVANCED" : true
    const matchLang = langFilter === "all" || c.language === langFilter
    return matchSearch && matchFilter && matchLang
  })

  return (
    <div className="min-h-screen bg-[#F6F8FA]">

      {/* Hero */}
      <div className="bg-navy-800 py-8 sm:py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2 sm:mb-3">
            All Courses
          </h1>
          <p className="text-white/55 text-sm sm:text-lg mb-6 max-w-xl mx-auto leading-relaxed">
            Practical data and AI skills built for African careers. Real examples from MTN, Paystack and Access Bank.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, skills..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-white placeholder:text-white/35 outline-none focus:border-teal-500/60 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Filters — collapsible on mobile */}
        <div className="mb-5">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <p className="text-sm text-neutral-500">
              <span className="font-bold text-navy-800">{filtered.length}</span> courses
            </p>
            <button onClick={() => setFiltersOpen(v => !v)}
              className="flex items-center gap-2 text-xs font-bold text-navy-800 border border-[#E5E9F0] bg-white px-3 py-2 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(filter !== "all" || langFilter !== "all") && (
                <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] font-black flex items-center justify-center">!</span>
              )}
            </button>
          </div>

          {/* Filter pills — always visible on sm+, collapsible on mobile */}
          <div className={cn(
            "flex items-center gap-2 flex-wrap",
            filtersOpen ? "flex" : "hidden sm:flex"
          )}>
            {(["all","free","beginner","intermediate","advanced"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all",
                  filter === f ? "bg-navy-800 text-white" : "bg-white border border-[#E5E9F0] text-neutral-500 hover:border-neutral-300"
                )}>
                {f}
              </button>
            ))}
            <div className="h-4 w-px bg-neutral-200 mx-0.5 hidden sm:block" />
            {langs.map(l => (
              <button key={l} onClick={() => setLangFilter(l)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  langFilter === l ? "bg-teal-500 text-white" : "bg-white border border-[#E5E9F0] text-neutral-500 hover:border-neutral-300"
                )}>
                {l === "all" ? "All Languages" : `${LANG_EMOJI[l] ?? ""} ${l}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results count — desktop */}
        <p className="text-sm text-neutral-400 mb-5 hidden sm:block">
          {filtered.length} course{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-neutral-600 mb-1">No courses found</h3>
            <p className="text-neutral-400 text-sm">Try different search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map(course => {
              const lessons    = course.chapters.reduce((s, ch) => s + ch.lessons.length, 0)
              const isEnrolled = enrolledIds.has(course.id)
              return (
                <Link key={course.id} href={`/courses/${course.slug}`}
                  className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden hover:shadow-md hover:border-teal-200 transition-all group flex flex-col">
                  {/* Colour bar */}
                  <div className={cn("h-1.5 bg-gradient-to-r", DIFF_BAR[course.difficulty] ?? DIFF_BAR.BEGINNER)} />
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", DIFF_COLOR[course.difficulty] ?? DIFF_COLOR.BEGINNER)}>
                        {course.difficulty}
                      </span>
                      {course.is_free && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">FREE</span>}
                      {isEnrolled && <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">ENROLLED</span>}
                    </div>
                    <h3 className="font-display font-bold text-navy-800 text-base leading-tight mb-2 group-hover:text-teal-600 transition-colors">
                      {course.title}
                    </h3>
                    {course.short_description && (
                      <p className="text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
                        {course.short_description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-auto pt-3 border-t border-[#F0F4F8]">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {lessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.estimated_hours}h</span>
                      <span className="ml-auto">{LANG_EMOJI[course.language] ?? "💻"} {course.language}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
