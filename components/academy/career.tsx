"use client"
import { useState } from "react"
import { Briefcase, Plus, ExternalLink, MapPin, Clock, Building2, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const MOCK_JOBS = [
  { id:"1", title:"Data Analyst", company:"Flutterwave", location:"Lagos, Nigeria", type:"FULL_TIME", tags:["SQL","Python","Power BI"], salary_min:400000, salary_max:700000, currency:"NGN", is_featured:true },
  { id:"2", title:"Business Intelligence Analyst", company:"MTN Nigeria", location:"Abuja, Nigeria", type:"FULL_TIME", tags:["SQL","Excel","Tableau"], salary_min:350000, salary_max:600000, currency:"NGN", is_featured:false },
  { id:"3", title:"Data Engineer", company:"Paystack", location:"Lagos, Nigeria", type:"FULL_TIME", tags:["Python","dbt","Airflow"], salary_min:500000, salary_max:900000, currency:"NGN", is_featured:true },
  { id:"4", title:"Junior Data Analyst", company:"Access Bank", location:"Lagos, Nigeria", type:"FULL_TIME", tags:["SQL","Excel","Power BI"], salary_min:200000, salary_max:350000, currency:"NGN", is_featured:false },
  { id:"5", title:"Data Science Intern", company:"Andela", location:"Remote", type:"INTERNSHIP", tags:["Python","Statistics","ML"], salary_min:150000, salary_max:250000, currency:"NGN", is_featured:false },
]

const TYPE_LABELS: Record<string,string> = { FULL_TIME:"Full Time", PART_TIME:"Part Time", CONTRACT:"Contract", INTERNSHIP:"Internship", REMOTE:"Remote" }

interface Props { jobs: any[]; projects: any[]; userId: string }

export function CareerPage({ jobs, projects, userId }: Props) {
  const [tab, setTab] = useState<"jobs"|"portfolio"|"resume">("jobs")
  const displayJobs = jobs.length > 0 ? jobs : MOCK_JOBS

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-1">Career Hub 🎯</h1>
        <p className="text-neutral-500 text-sm">Jobs, portfolio builder, resume review and mock interviews — all in one place.</p>
      </div>

      {/* Placement promise banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl shrink-0">🤝</span>
        <div>
          <div className="font-semibold text-teal-700 text-sm">The Wikrena Placement Promise</div>
          <div className="text-teal-600 text-xs mt-0.5">Complete the program. If you haven&apos;t landed in 90 days, we extend support at no cost.</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl mb-6">
        {[
          { id:"jobs"      as const, label:"Job Board",       icon:"💼" },
          { id:"portfolio" as const, label:"My Portfolio",    icon:"📁" },
          { id:"resume"    as const, label:"Resume Review",   icon:"📄" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
              tab === t.id ? "bg-white text-navy-800 shadow-brand-sm" : "text-neutral-500 hover:text-navy-800"
            )}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* JOB BOARD */}
      {tab === "jobs" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-neutral-500 font-mono">{displayJobs.length} openings · Africa-curated</div>
            <div className="flex gap-2">
              {["All","Fintech","Healthcare","Telecom"].map(f => (
                <button key={f} className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-500 hover:border-teal-300 hover:text-teal-600 transition-colors">{f}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {displayJobs.map((job: any) => (
              <div key={job.id} className={cn("bg-white border rounded-2xl p-5 hover:shadow-card-hover transition-all cursor-pointer group", job.is_featured ? "border-teal-200" : "border-neutral-200")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {job.is_featured && <span className="flex items-center gap-1 text-[10px] font-mono bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full"><Star className="w-2.5 h-2.5" />Featured</span>}
                      <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{TYPE_LABELS[job.type] ?? job.type}</span>
                    </div>
                    <h3 className="font-display font-bold text-base text-navy-800 mb-1 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(job.tags ?? []).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                    {job.salary_min && (
                      <div className="text-sm font-semibold text-teal-600 font-mono">
                        ₦{(job.salary_min / 1000).toFixed(0)}k – ₦{(job.salary_max / 1000).toFixed(0)}k / month
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-1.5 bg-navy-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-navy-700 transition-colors shrink-0 shadow-brand-sm">
                    Apply <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      {tab === "portfolio" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-navy-800">My Projects</h2>
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" /> Add Project
            </Button>
          </div>
          {projects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-neutral-200 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="font-display font-bold text-lg text-navy-800 mb-2">No projects yet</h3>
              <p className="text-neutral-500 text-sm mb-5 max-w-xs mx-auto">Complete a learning path capstone project and it will appear here automatically.</p>
              <Button variant="teal" size="sm"><Plus className="w-3.5 h-3.5" /> Add Your First Project</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {projects.map((p: any) => (
                <div key={p.id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all">
                  <div className="aspect-video bg-gradient-to-br from-navy-50 to-teal-50 flex items-center justify-center text-4xl">📊</div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm text-navy-800 mb-1">{p.title}</h3>
                    <p className="text-xs text-neutral-500 mb-3">{p.description}</p>
                    <div className="flex gap-2">
                      {p.live_url && <a href={p.live_url} className="text-xs text-teal-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />Live</a>}
                      {p.github_url && <a href={p.github_url} className="text-xs text-neutral-500 hover:underline flex items-center gap-1">GitHub</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RESUME */}
      {tab === "resume" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="font-display font-bold text-xl text-navy-800 mb-2">AI Resume Review</h2>
          <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">Upload your CV and our AI will score it, identify gaps, and give specific recommendations for data roles in Africa.</p>
          <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-10 mb-4 hover:border-teal-400 transition-colors cursor-pointer">
            <div className="text-3xl mb-2">📎</div>
            <div className="text-sm font-medium text-neutral-600">Drop your CV here or click to upload</div>
            <div className="text-xs text-neutral-400 mt-1">PDF or Word · Max 5MB</div>
          </div>
          <Button variant="teal">Upload & Analyse Resume</Button>
        </div>
      )}
    </div>
  )
}
