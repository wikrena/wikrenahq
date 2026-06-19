"use client"
import Link from "next/link"
import { ArrowRight, Clock, BarChart3, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const STATIC_PATHS = [
  { slug:"data-analytics-professional", icon:"📊", title:"Data Analytics Professional", desc:"Master SQL, Excel, Power BI and data storytelling.", weeks:12, level:"Beginner", color:"border-teal-200", modules:["SQL Fundamentals","Advanced SQL","Excel","Power BI","Statistics"] },
  { slug:"data-engineering",            icon:"⚙️", title:"Data Engineering",            desc:"Build pipelines, ETL workflows and data infrastructure.", weeks:10, level:"Intermediate", color:"border-navy-200", modules:["SQL Fundamentals","Python Basics","dbt","Airflow"] },
  { slug:"data-science",                icon:"🔬", title:"Data Science",                desc:"Predictive models and machine learning on African datasets.", weeks:12, level:"Intermediate", color:"border-teal-200", modules:["Python Basics","Statistics","Pandas","Scikit-learn"] },
  { slug:"machine-learning",            icon:"🤖", title:"Machine Learning",            desc:"Train, tune and deploy ML models for African business.", weeks:14, level:"Advanced", color:"border-coral-200", modules:["Python Basics","Statistics","TensorFlow","MLOps"] },
  { slug:"ai-automation",               icon:"⚡", title:"AI Automation Specialist",    desc:"No-code AI tools and workflow automation.", weeks:6, level:"All Levels", color:"border-navy-200", modules:["Zapier & Make","AI Agents","Prompt Engineering"] },
]

interface Props { paths: any[]; enrollments: any[]; userId: string }

export function PathsCatalog({ paths, enrollments, userId }: Props) {
  const enrolledMap = new Map(enrollments.map(e => [e.path_id, e.progress_percent]))
  const displayPaths = paths.length > 0 ? paths : STATIC_PATHS

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-2">Learning Paths</h1>
        <p className="text-neutral-500">Complete SQL once — it counts in every path that needs it. Your progress belongs to you.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {displayPaths.map((path: any) => {
          const slug = path.slug
          const enrolled = enrolledMap.has(path.id)
          const pct = enrolledMap.get(path.id) ?? 0
          return (
            <div key={slug} className={cn("bg-white border-2 rounded-2xl p-6 hover:shadow-card-hover transition-all", path.color ?? "border-neutral-200")}>
              <div className="flex items-start gap-5">
                <div className="text-5xl shrink-0">{path.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="font-display font-bold text-xl text-navy-800">{path.title}</h2>
                    {enrolled && <span className="text-teal-600 font-mono font-bold text-sm shrink-0">{Math.round(pct)}%</span>}
                  </div>
                  <p className="text-neutral-500 text-sm mb-4">{path.desc ?? path.description}</p>
                  <div className="flex gap-3 mb-4 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-mono text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />{path.weeks ?? path.estimated_weeks} weeks
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-neutral-500 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full">
                      <BarChart3 className="w-3 h-3" />{path.level ?? path.difficulty}
                    </span>
                    {enrolled && (
                      <span className="flex items-center gap-1 text-xs font-mono text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled
                      </span>
                    )}
                  </div>
                  {enrolled && (
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-700" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(path.modules ?? path.path_courses?.map((pc: any) => pc.courses?.title) ?? []).map((mod: any, i: number) => {
                      const name = typeof mod === "string" ? mod : mod?.n ?? mod
                      const shared = ["SQL Fundamentals","Python Basics","Statistics"].includes(name)
                      return (
                        <span key={i} className={cn("text-[10px] font-mono px-2 py-0.5 rounded border", shared ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-neutral-50 text-neutral-500 border-neutral-200")}>
                          {shared && "✓ "}{name}
                        </span>
                      )
                    })}
                  </div>
                  <Link href={`/paths/${slug}`}
                    className="inline-flex items-center gap-2 bg-navy-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-700 transition-colors shadow-brand-sm">
                    {enrolled ? "Continue Learning" : "Start Path"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
