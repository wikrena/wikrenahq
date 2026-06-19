"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Briefcase, FolderKanban, FileText, MessageSquare,
  Users, MapPin, Building2, Star, ExternalLink,
  ArrowRight, Search, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_JOBS = [
  {
    id: "1", title: "Data Analyst", company: "Flutterwave", location: "Lagos, Nigeria",
    type: "FULL_TIME", tags: ["SQL", "Python", "Power BI"],
    salary_min: 400000, salary_max: 700000, currency: "NGN", is_featured: true,
    posted: "2 days ago",
  },
  {
    id: "2", title: "Business Intelligence Analyst", company: "MTN Nigeria",
    location: "Abuja, Nigeria", type: "FULL_TIME", tags: ["SQL", "Excel", "Tableau"],
    salary_min: 350000, salary_max: 600000, currency: "NGN", is_featured: false,
    posted: "3 days ago",
  },
  {
    id: "3", title: "Data Engineer", company: "Paystack", location: "Lagos, Nigeria",
    type: "FULL_TIME", tags: ["Python", "dbt", "Airflow"],
    salary_min: 500000, salary_max: 900000, currency: "NGN", is_featured: true,
    posted: "1 day ago",
  },
  {
    id: "4", title: "Junior Data Analyst", company: "Access Bank",
    location: "Lagos, Nigeria", type: "FULL_TIME", tags: ["SQL", "Excel", "Power BI"],
    salary_min: 200000, salary_max: 350000, currency: "NGN", is_featured: false,
    posted: "5 days ago",
  },
  {
    id: "5", title: "Data Science Intern", company: "Andela",
    location: "Remote", type: "INTERNSHIP", tags: ["Python", "Statistics", "ML"],
    salary_min: 150000, salary_max: 250000, currency: "NGN", is_featured: false,
    posted: "1 week ago",
  },
  {
    id: "6", title: "Analytics Engineer", company: "OPay", location: "Lagos, Nigeria",
    type: "FULL_TIME", tags: ["dbt", "SQL", "Python"],
    salary_min: 450000, salary_max: 750000, currency: "NGN", is_featured: false,
    posted: "4 days ago",
  },
]

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time", PART_TIME: "Part Time",
  CONTRACT: "Contract", INTERNSHIP: "Internship", REMOTE: "Remote",
}

const CAREER_TOOLS = [
  {
    icon:  FolderKanban,
    emoji: "📁",
    title: "My Portfolio",
    desc:  "Showcase the projects you have built to employers.",
    href:  "/career/portfolio",
    color: "border-teal-200 bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon:  FileText,
    emoji: "📄",
    title: "Resume Review",
    desc:  "AI-powered feedback on your CV for data roles.",
    href:  "/career/resume",
    color: "border-purple-200 bg-purple-50",
    iconColor: "text-purple-600",
    soon: true,
  },
  {
    icon:  MessageSquare,
    emoji: "🎙️",
    title: "Mock Interviews",
    desc:  "Practice data interview questions with Wren AI.",
    href:  "/career/interviews",
    color: "border-amber-200 bg-amber-50",
    iconColor: "text-amber-600",
    soon: true,
  },
  {
    icon:  Users,
    emoji: "🤝",
    title: "Mentors",
    desc:  "Connect with senior data professionals in Africa.",
    href:  "/career/mentors",
    color: "border-blue-200 bg-blue-50",
    iconColor: "text-blue-600",
    soon: true,
  },
]

interface Props { jobs: any[]; userId: string }

export function CareerHub({ jobs, userId }: Props) {
  const [search,    setSearch]    = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const displayJobs = jobs.length > 0 ? jobs : MOCK_JOBS

  const filtered = displayJobs.filter(job => {
    const matchSearch = !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      (job.tags ?? []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = typeFilter === "all" || job.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">Career Hub</h1>
        <p className="text-neutral-500 text-sm">
          Data jobs at African companies, tools to build your profile, and career support.
        </p>
      </div>

      {/* Placement promise */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-3xl shrink-0">🤝</span>
        <div>
          <div className="font-bold text-white text-sm">The Wikrena Placement Promise</div>
          <div className="text-white/80 text-xs mt-0.5 leading-relaxed">
            Complete any Career Track. If you have not landed a role within 90 days of finishing, we extend your support at no cost.
          </div>
        </div>
      </div>

      {/* Career tools row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {CAREER_TOOLS.map(tool => (
          <Link key={tool.title} href={tool.href}
            className={cn(
              "relative border-2 rounded-2xl p-4 hover:shadow-sm transition-all group",
              tool.color
            )}>
            {tool.soon && (
              <span className="absolute top-2 right-2 text-[9px] font-bold bg-white/80 text-neutral-500 px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            )}
            <div className="text-2xl mb-2">{tool.emoji}</div>
            <div className={cn("font-semibold text-sm text-navy-800 mb-1 group-hover:text-teal-700 transition-colors")}>
              {tool.title}
            </div>
            <div className="text-[11px] text-neutral-500 leading-relaxed">{tool.desc}</div>
          </Link>
        ))}
      </div>

      {/* Job board */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-display font-bold text-lg text-navy-800">
          Job Board
          <span className="ml-2 text-sm font-mono text-neutral-400 font-normal">
            {filtered.length} openings
          </span>
        </h2>

        {/* Search + filter */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="pl-8 pr-3 py-2 text-xs border border-[#E5E9F0] rounded-xl outline-none focus:border-teal-500 w-40 bg-white"
            />
          </div>
          <div className="flex gap-1">
            {[
              { id: "all",        label: "All" },
              { id: "FULL_TIME",  label: "Full Time" },
              { id: "INTERNSHIP", label: "Internship" },
            ].map(f => (
              <button key={f.id} onClick={() => setTypeFilter(f.id)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                  typeFilter === f.id
                    ? "bg-navy-800 text-white border-navy-800"
                    : "bg-white text-neutral-500 border-[#E5E9F0] hover:border-neutral-300"
                )}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(job => (
          <div key={job.id}
            className={cn(
              "bg-white border rounded-2xl p-5 hover:shadow-sm transition-all group",
              job.is_featured ? "border-teal-200" : "border-[#E5E9F0]"
            )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">

                {/* Badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {job.is_featured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Star className="w-2.5 h-2.5" fill="currentColor" /> Featured
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-[#F0F4F8] text-neutral-500 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[job.type] ?? job.type}
                  </span>
                </div>

                {/* Title + company */}
                <h3 className="font-display font-bold text-base text-navy-800 mb-1 group-hover:text-teal-700 transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="text-[11px] text-neutral-400">{job.posted}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(job.tags ?? []).map((tag: string) => (
                    <span key={tag}
                      className="text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Salary */}
                {job.salary_min && (
                  <div className="text-sm font-bold text-teal-600 font-mono">
                    ₦{(job.salary_min / 1000).toFixed(0)}k – ₦{(job.salary_max / 1000).toFixed(0)}k / month
                  </div>
                )}
              </div>

              <button className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0">
                Apply <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No jobs match your search.</p>
          </div>
        )}
      </div>

      {/* Bottom notice */}
      <div className="mt-6 text-center text-xs text-neutral-400">
        Job listings are curated weekly from Nigerian and African tech companies.
        New listings every Monday.
      </div>

    </div>
  )
}
