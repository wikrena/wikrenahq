import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { AppShell } from "@/components/app-shell/app-shell"
import Link from "next/link"

export const metadata: Metadata = { title: "My Portfolio — Wikrena Academy" }

export default async function PortfolioPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const admin = getAdminClient()
  const [profileRes, xpRes, projectsRes] = await Promise.all([
    admin.from("profiles").select("name, current_streak, role").eq("id", user.id).single(),
    admin.from("xp_transactions").select("amount").eq("user_id", user.id),
    admin.from("portfolio_projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ])

  const profile  = profileRes.data
  const totalXp  = xpRes.data?.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) ?? 0
  const projects = projectsRes.data ?? []

  return (
    <AppShell
      userEmail={user.email ?? ""}
      userName={profile?.name}
      totalXp={totalXp}
      streak={profile?.current_streak ?? 0}
      userRole={profile?.role ?? "STUDENT"}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-navy-800 mb-1">My Portfolio</h1>
            <p className="text-neutral-500 text-sm">Projects you have built during your learning journey.</p>
          </div>
          <Link href="/learn/tracks/career"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
            + Add Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#E5E9F0] rounded-2xl p-14 text-center">
            <div className="text-5xl mb-4">🗂️</div>
            <h3 className="font-display font-bold text-lg text-navy-800 mb-2">No projects yet</h3>
            <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Complete a Career Track to build your first portfolio project. Every capstone project you finish appears here automatically.
            </p>
            <Link href="/learn/tracks/career"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
              Browse Career Tracks →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map((p: any) => (
              <div key={p.id} className="bg-white border border-[#E5E9F0] rounded-2xl p-5 hover:border-teal-200 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-bold text-navy-800">{p.title}</h3>
                  {p.language && (
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {p.language}
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">{p.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs">
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-600 hover:text-teal-800 font-semibold transition-colors">
                      Live Demo →
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 transition-colors">
                      GitHub →
                    </a>
                  )}
                  <span className="ml-auto text-neutral-300 font-mono">
                    {new Date(p.created_at).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
