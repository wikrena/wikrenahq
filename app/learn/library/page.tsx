import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"

export default async function LibraryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const { data: profile } = await admin.from("profiles").select("name, current_streak").eq("id", user.id).single()
  const { data: xpData }  = await admin.from("xp_transactions").select("amount").eq("user_id", user.id)
  const totalXp = xpData?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0

  // Get bookmarked lessons
  const { data: bookmarks } = await admin
    .from("bookmarks")
    .select("*, lessons(id, title, slug, chapters(title, slug, courses(title, slug)))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <AppShell userEmail={user.email ?? ""} userName={profile?.name} totalXp={totalXp} streak={profile?.current_streak ?? 0}>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">My Library</h1>
        <p className="text-neutral-500 text-sm mb-6">Your bookmarked lessons.</p>

        {(!bookmarks || bookmarks.length === 0) ? (
          <div className="surface-lg p-10 text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-neutral-500 text-sm">No bookmarks yet. Click the bookmark icon on any lesson to save it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b: any) => {
              const lesson = b.skill_lessons
              const module = lesson?.chapters
              if (!lesson || !module) return null
              return (
                <a key={b.id} href={`/learn/${module.slug}/${lesson.slug}`}
                  className="flex items-center gap-4 surface-lg p-4 hover:border-teal-300 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-navy-800 group-hover:text-teal-700 transition-colors truncate">{lesson.title}</div>
                    <div className="text-xs text-neutral-400 font-code mt-0.5">{module.title}</div>
                  </div>
                  <span className="text-xs text-teal-600 font-semibold shrink-0">Open →</span>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
