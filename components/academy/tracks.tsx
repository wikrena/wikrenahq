"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Clock, BarChart, CheckCircle2, BookOpen, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ── DATA ─────────────────────────────────────────────────────────────────────

const CAREER_TRACKS = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    slug: "data-analytics-professional",
    icon: "📊",
    desc: "Master SQL, Excel, Power BI and data storytelling. Land a data analyst role at Nigeria's top companies.",
    weeks: 12,
    courses: 5,
    level: "Beginner",
    color: "border-teal-200",
    accentColor: "teal",
    skills: ["SQL","Excel","Power BI","Statistics","Data Storytelling"],
    outcome: "Data Analyst at a top African company",
    salary: "₦200k – ₦600k / month",
    modules: [
      { name:"SQL Fundamentals",  shared:true,  hours:12, done:false },
      { name:"Advanced SQL",      shared:true,  hours:16, done:false },
      { name:"Excel for Data",    shared:false, hours:8,  done:false },
      { name:"Power BI",          shared:false, hours:14, done:false },
      { name:"Statistics",        shared:true,  hours:10, done:false },
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    slug: "data-engineering",
    icon: "⚙️",
    desc: "Build pipelines, ETL workflows and the data infrastructure that powers analytics teams across Africa.",
    weeks: 10,
    courses: 4,
    level: "Intermediate",
    color: "border-navy-200",
    accentColor: "navy",
    skills: ["SQL","Python","dbt","Airflow","Data Pipelines"],
    outcome: "Data Engineer at a growing African tech company",
    salary: "₦350k – ₦900k / month",
    modules: [
      { name:"SQL Fundamentals",  shared:true,  hours:12, done:false },
      { name:"Python Basics",     shared:true,  hours:14, done:false },
      { name:"dbt Fundamentals",  shared:false, hours:12, done:false },
      { name:"Airflow & Pipelines",shared:false,hours:16, done:false },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    slug: "data-science",
    icon: "🔬",
    desc: "Build predictive models and ML systems that solve real African business problems using Python and statistics.",
    weeks: 12,
    courses: 4,
    level: "Intermediate",
    color: "border-purple-200",
    accentColor: "purple",
    skills: ["Python","Statistics","Pandas","Scikit-learn","ML Modelling"],
    outcome: "Data Scientist or ML Engineer",
    salary: "₦400k – ₦1.2M / month",
    modules: [
      { name:"Python Basics",     shared:true,  hours:14, done:false },
      { name:"Statistics",        shared:true,  hours:10, done:false },
      { name:"Pandas & NumPy",    shared:false, hours:12, done:false },
      { name:"Scikit-learn & ML", shared:false, hours:20, done:false },
    ],
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    slug: "machine-learning",
    icon: "🤖",
    desc: "Train, tune and deploy machine learning models. Build the AI systems powering Africa's next wave of innovation.",
    weeks: 14,
    courses: 4,
    level: "Advanced",
    color: "border-coral-200",
    accentColor: "coral",
    skills: ["Python","TensorFlow","MLOps","Model Deployment","LLMs"],
    outcome: "ML Engineer or AI Engineer",
    salary: "₦600k – ₦2M / month",
    modules: [
      { name:"Python Basics",     shared:true,  hours:14, done:false },
      { name:"Statistics",        shared:true,  hours:10, done:false },
      { name:"TensorFlow & Keras",shared:false, hours:20, done:false },
      { name:"MLOps & Deployment",shared:false, hours:16, done:false },
    ],
  },
  {
    id: "ai-automation",
    title: "AI Automation Specialist",
    slug: "ai-automation",
    icon: "⚡",
    desc: "No-code and low-code AI tools. Build automations, AI agents and workflows that save your team hours every week.",
    weeks: 6,
    courses: 3,
    level: "All Levels",
    color: "border-amber-200",
    accentColor: "amber",
    skills: ["Zapier","Make.com","AI Agents","Prompt Engineering","n8n"],
    outcome: "AI Automation Specialist or Operations Lead",
    salary: "₦250k – ₦700k / month",
    modules: [
      { name:"Automation Foundations",  shared:false, hours:8,  done:false },
      { name:"AI Agents & Tools",       shared:false, hours:10, done:false },
      { name:"Prompt Engineering",      shared:false, hours:6,  done:false },
    ],
  },
]

const SKILL_TRACKS = [
  { id:"sql",      icon:"🗄️", title:"SQL Mastery",         desc:"Complete SQL from basics to advanced window functions and performance tuning.", courses:3, hours:38, level:"Beginner → Advanced", color:"border-teal-200",  tags:["SQL","Databases","Analytics"] },
  { id:"python",   icon:"🐍", title:"Python for Data",      desc:"Python fundamentals through pandas, numpy and data manipulation.", courses:3, hours:40, level:"Beginner → Intermediate", color:"border-blue-200",  tags:["Python","Pandas","NumPy"] },
  { id:"powerbi",  icon:"📈", title:"Power BI",             desc:"Build professional dashboards and reports. From data model to insight.", courses:2, hours:24, level:"Beginner", color:"border-yellow-200",  tags:["Power BI","DAX","Dashboards"] },
  { id:"stats",    icon:"📐", title:"Statistics for Data",  desc:"Descriptive stats, probability, hypothesis testing and A/B testing.", courses:2, hours:20, level:"Beginner → Intermediate", color:"border-purple-200", tags:["Statistics","Probability","A/B Testing"] },
  { id:"dbt",      icon:"🔧", title:"dbt & Data Modelling", desc:"Modern data transformation. Build a production dbt project on African data.", courses:2, hours:24, level:"Intermediate", color:"border-navy-200",  tags:["dbt","SQL","Data Modelling"] },
  { id:"ml-basics",icon:"🤖", title:"ML Foundations",       desc:"Core machine learning concepts — supervised, unsupervised, model evaluation.", courses:2, hours:28, level:"Intermediate", color:"border-coral-200", tags:["Machine Learning","Scikit-learn","Python"] },
]

// ── CAREER TRACKS PAGE ──────────────────────────────────────────────────────

interface TrackProps { enrollments: any[]; userId: string }

export function CareerTracksPage({ enrollments, userId }: TrackProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const enrolledIds = new Set(enrollments.map(e => e.learning_path_id))

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/learn/tracks/skill" className="text-sm text-neutral-400 hover:text-teal-600 transition-colors">Skill Tracks</Link>
          <span className="text-neutral-300">·</span>
          <span className="text-sm font-semibold text-navy-800">Career Tracks</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-2">Career Tracks</h1>
        <p className="text-neutral-500 text-sm max-w-xl">
          End-to-end programs designed around a specific job title. Complete a Career Track and you are ready to apply.
          <span className="ml-1 text-teal-600 font-medium">Shared modules count once across all tracks.</span>
        </p>
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
        <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-teal-700 text-sm">Shared Skill Architecture</span>
          <span className="text-teal-600 text-sm ml-1">— Complete SQL Fundamentals once and it counts in every track that requires it. Your progress belongs to you, not any single track.</span>
        </div>
      </div>

      {/* Tracks grid */}
      <div className="space-y-4">
        {CAREER_TRACKS.map(track => {
          const isOpen = selected === track.id
          return (
            <div key={track.id}
              className={cn("surface-lg overflow-hidden transition-all duration-200", isOpen ? "shadow-lift" : "hover:shadow-surface")}
            >
              {/* Track header */}
              <div
                className="flex items-start gap-4 p-5 cursor-pointer"
                onClick={() => setSelected(isOpen ? null : track.id)}
              >
                <div className="text-4xl shrink-0">{track.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h2 className="font-display font-bold text-lg text-navy-800">{track.title}</h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="chip chip-teal">{track.level}</span>
                      <span className="chip chip-neutral">{track.weeks}w</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 mb-3 leading-relaxed">{track.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400 font-code flex-wrap">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{track.courses} courses</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{track.weeks} weeks</span>
                    <span className="text-teal-600 font-semibold">{track.salary}</span>
                  </div>
                </div>
                <ChevronIcon open={isOpen} />
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-[#E5E9F0] p-5 bg-[#F8FAFC] animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Modules */}
                    <div className="lg:col-span-2">
                      <div className="text-xs font-code text-neutral-400 uppercase tracking-widest mb-3">Course Modules</div>
                      <div className="space-y-2">
                        {track.modules.map((mod, i) => (
                          <div key={mod.name}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E5E9F0]"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#E5E9F0] flex items-center justify-center text-xs font-semibold text-neutral-500 shrink-0">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-navy-800">{mod.name}</div>
                              <div className="text-xs text-neutral-400 font-code">{mod.hours}h</div>
                            </div>
                            {mod.shared && (
                              <span className="chip chip-teal text-[10px]">✓ Shared</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outcome + CTA */}
                    <div>
                      <div className="text-xs font-code text-neutral-400 uppercase tracking-widest mb-3">Skills You&apos;ll Gain</div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {track.skills.map(skill => (
                          <span key={skill} className="chip chip-neutral">{skill}</span>
                        ))}
                      </div>
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
                        <div className="text-xs font-code text-teal-500 uppercase tracking-widest mb-1">Job Outcome</div>
                        <div className="font-semibold text-sm text-teal-800 mb-1">{track.outcome}</div>
                        <div className="text-sm font-semibold text-teal-700 font-code">{track.salary}</div>
                      </div>
                      <Link href={`/paths/${track.slug}`}>
                        <Button variant="teal" className="w-full font-bold">
                          Start This Track <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SKILL TRACKS PAGE ────────────────────────────────────────────────────────

export function SkillTracksPage({ enrollments, userId }: TrackProps) {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-navy-800">Skill Tracks</span>
          <span className="text-neutral-300">·</span>
          <Link href="/learn/tracks/career" className="text-sm text-neutral-400 hover:text-teal-600 transition-colors">Career Tracks</Link>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-navy-800 mb-2">Skill Tracks</h1>
        <p className="text-neutral-500 text-sm max-w-xl">
          Focused bundles for a single skill. Shorter than Career Tracks — 2 to 6 weeks. Perfect for upskilling in a specific area or filling a gap.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_TRACKS.map(track => (
          <Link key={track.id} href={`/learn/tracks/skill/${track.id}`}
            className={cn("surface-lg p-5 hover:shadow-lift transition-all group border-2", track.color)}
          >
            <div className="text-4xl mb-4">{track.icon}</div>
            <h3 className="font-display font-bold text-base text-navy-800 mb-2 group-hover:text-teal-600 transition-colors">
              {track.title}
            </h3>
            <p className="text-sm text-neutral-500 mb-4 leading-relaxed text-[13px]">{track.desc}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-code mb-4">
              <span><BookOpen className="w-3 h-3 inline mr-1" />{track.courses} courses</span>
              <span><Clock className="w-3 h-3 inline mr-1" />{track.hours}h</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {track.tags.map(tag => (
                <span key={tag} className="chip chip-neutral text-[10px]">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
              Start Track <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Chevron helper ───────────────────────────────────────────────────────────
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={cn("w-5 h-5 text-neutral-400 shrink-0 mt-0.5 transition-transform duration-200", open && "rotate-180")}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
