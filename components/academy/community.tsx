"use client"

import { useState } from "react"
import {
  MessageCircle, Plus, Search, CheckCircle2,
  Pin, Loader2, X, Eye, ArrowRight,
  Flame, TrendingUp, Users, Hash
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_CATEGORIES = [
  { id:"1", name:"General",         icon:"💬", slug:"general",          count: 48 },
  { id:"2", name:"SQL Help",        icon:"🗄️", slug:"sql-help",         count: 124 },
  { id:"3", name:"Python Help",     icon:"🐍", slug:"python-help",      count:  87 },
  { id:"4", name:"Career Advice",   icon:"💼", slug:"career-advice",    count:  63 },
  { id:"5", name:"Show Your Work",  icon:"🎨", slug:"show-your-work",   count:  41 },
  { id:"6", name:"Industry",        icon:"🌍", slug:"industry-insights", count: 29 },
]

const MOCK_POSTS = [
  { id:"1", title:"How do I optimise a slow SQL query on 10M rows?",                   category:"SQL Help",      category_slug:"sql-help",   author:"Emeka O.", replies:12, views:340, solved:true,  time:"2h ago",  pinned:false },
  { id:"2", title:"Difference between INNER JOIN and LEFT JOIN — still confused",       category:"SQL Help",      category_slug:"sql-help",   author:"Adaeze N.", replies:8,  views:215, solved:false, time:"4h ago",  pinned:false },
  { id:"3", title:"My Power BI dashboard for MTN subscriber churn analysis 📊",        category:"Show Your Work",category_slug:"show-your-work",author:"Fatima S.", replies:24, views:890, solved:false, time:"1d ago",  pinned:false },
  { id:"4", title:"Getting into fintech data roles from a non-tech background",        category:"Career Advice", category_slug:"career-advice",author:"Chukwudi A.", replies:31, views:1240, solved:false, time:"2d ago",  pinned:true  },
  { id:"5", title:"Weekly Industry Digest: Data trends in Nigerian banking Q1 2026",   category:"Industry",      category_slug:"industry-insights",author:"Wikrena", replies:5, views:560, solved:false, time:"3d ago",  pinned:true  },
  { id:"6", title:"Python pandas: KeyError when merging DataFrames with Paystack data",category:"Python Help",   category_slug:"python-help",author:"Bola A.", replies:6,  views:178, solved:true,  time:"5h ago",  pinned:false },
  { id:"7", title:"Which is better for beginners — SQL or Python first?",              category:"General",       category_slug:"general",    author:"Seun O.", replies:19, views:445, solved:false, time:"1d ago",  pinned:false },
]

interface Props { categories: any[]; posts: any[]; userId: string }

export function CommunityPage({ categories, posts, userId }: Props) {
  const [activeCategory, setActiveCategory] = useState<string|null>(null)
  const [search,         setSearch]         = useState("")
  const [showNew,        setShowNew]        = useState(false)
  const [postTitle,      setPostTitle]      = useState("")
  const [postContent,    setPostContent]    = useState("")
  const [postCategory,   setPostCategory]   = useState("")
  const [submitting,     setSubmitting]     = useState(false)
  const [submitted,      setSubmitted]      = useState(false)

  const displayCategories = categories.length > 0 ? categories : MOCK_CATEGORIES
  const rawPosts          = posts.length > 0 ? posts : MOCK_POSTS

  const displayPosts = rawPosts
    .filter(p => {
      const catMatch = !activeCategory || p.category === activeCategory ||
        p.category_id === activeCategory || p.category_slug === activeCategory
      const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      return catMatch && searchMatch
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()
    if (!postTitle.trim() || !postContent.trim() || !postCategory) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postTitle, content: postContent, categoryId: postCategory }),
      })
      if (res.ok) {
        setSubmitted(true)
        setPostTitle(""); setPostContent(""); setPostCategory("")
        setTimeout(() => { setShowNew(false); setSubmitted(false) }, 2000)
      }
    } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-1">Community</h1>
          <p className="text-neutral-500 text-sm">Ask questions, share your work, connect with other learners.</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* New post modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E9F0]">
              <h3 className="font-display font-bold text-navy-800">New Post</h3>
              <button onClick={() => setShowNew(false)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {submitted ? (
              <div className="p-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
                <p className="font-semibold text-navy-800">Post published!</p>
              </div>
            ) : (
              <form onSubmit={submitPost} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {displayCategories.map((cat: any) => (
                      <button key={cat.id} type="button" onClick={() => setPostCategory(cat.id)}
                        className={cn(
                          "flex items-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all text-left",
                          postCategory === cat.id
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-[#E5E9F0] text-neutral-500 hover:border-neutral-300"
                        )}>
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Title</label>
                  <input value={postTitle} onChange={e => setPostTitle(e.target.value)} required
                    placeholder="e.g. How do I use GROUP BY with multiple columns?"
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500 mb-1.5 block uppercase tracking-wide">Content</label>
                  <textarea value={postContent} onChange={e => setPostContent(e.target.value)} required rows={4}
                    placeholder="Describe your question or share your work..."
                    className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors resize-none" />
                </div>
                <button type="submit" disabled={submitting || !postTitle.trim() || !postContent.trim() || !postCategory}
                  className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white py-3 rounded-xl font-bold text-sm transition-all">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Post"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E9F0] rounded-xl text-sm outline-none focus:border-teal-500 bg-white transition-colors" />
          </div>

          {/* Categories */}
          <div className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0F4F8]">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Categories</p>
            </div>
            <div className="p-2">
              <button onClick={() => setActiveCategory(null)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all",
                  !activeCategory ? "bg-navy-50 text-navy-700 font-semibold" : "text-neutral-500 hover:bg-neutral-50"
                )}>
                <Hash className="w-4 h-4" />
                <span className="flex-1 text-left">All Posts</span>
                <span className="text-[10px] font-mono text-neutral-400">{rawPosts.length}</span>
              </button>
              {displayCategories.map((cat: any) => {
                const count = rawPosts.filter(p =>
                  p.category === cat.name || p.category_id === cat.id || p.category_slug === cat.slug
                ).length
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.slug ?? cat.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all",
                      activeCategory === (cat.slug ?? cat.id)
                        ? "bg-teal-50 text-teal-700 font-semibold"
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}>
                    <span>{cat.icon}</span>
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{count || cat.count || ""}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[#E5E9F0] rounded-2xl p-4">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Community</p>
            <div className="space-y-2.5">
              {[
                { icon: MessageCircle, label: "Posts",   value: rawPosts.length, color: "text-teal-600" },
                { icon: Users,         label: "Members", value: "2.4k+",         color: "text-purple-600" },
                { icon: TrendingUp,    label: "Active",  value: "This week",     color: "text-amber-600" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <s.icon className={cn("w-4 h-4 shrink-0", s.color)} />
                  <span className="text-xs text-neutral-500 flex-1">{s.label}</span>
                  <span className={cn("text-xs font-bold font-mono", s.color)}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts list */}
        <div className="lg:col-span-3">
          {displayPosts.length === 0 ? (
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-12 text-center">
              <MessageCircle className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm">No posts yet in this category.</p>
              <button onClick={() => setShowNew(true)}
                className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 font-semibold hover:underline">
                <Plus className="w-4 h-4" /> Be the first to post
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {displayPosts.map((post: any) => (
                <div key={post.id}
                  className={cn(
                    "bg-white border rounded-2xl p-4 hover:shadow-sm transition-all group",
                    post.pinned ? "border-amber-200 bg-amber-50/30" : "border-[#E5E9F0] hover:border-teal-200"
                  )}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {post.pinned && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                          {post.category ?? post.category_id}
                        </span>
                        {post.solved && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Solved
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm text-navy-800 leading-snug group-hover:text-teal-700 transition-colors cursor-pointer mb-2">
                        {post.title}
                      </h3>

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-[11px] text-neutral-400 flex-wrap">
                        <span>by <strong className="text-neutral-600">{post.author ?? post.profiles?.name ?? "Member"}</strong></span>
                        <span>{post.time ?? "recently"}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.replies ?? 0} replies</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views ?? 0} views</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
