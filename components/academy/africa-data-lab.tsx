"use client"

import { useState } from "react"
import { Search, Database, ExternalLink, X, ChevronRight, Star, Layers, Globe2, BarChart3, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const CATS = ["All","Fintech","Healthcare","Retail","Telecom","Agriculture","Transport","Energy"]

const DATASETS = [
  { id:1,  name:"MTN Nigeria Subscriber Churn",   company:"MTN Nigeria",     cat:"Telecom",      rows:"500,000",   cols:23, fmt:"CSV",          size:"48 MB",   diff:"Intermediate", icon:"📡", tags:["Classification","Python","ML"],        courses:["Data Science","Machine Learning"],  featured:true  },
  { id:2,  name:"Flutterwave Transaction Flows",  company:"Flutterwave",     cat:"Fintech",      rows:"2,000,000", cols:31, fmt:"CSV + JSON",    size:"210 MB",  diff:"Advanced",     icon:"💳", tags:["Fraud Detection","SQL","Time Series"],  courses:["Data Engineering","Data Science"],  featured:true  },
  { id:3,  name:"Jumia Product & Sales Data",     company:"Jumia",           cat:"Retail",       rows:"850,000",   cols:18, fmt:"CSV",           size:"92 MB",   diff:"Beginner",     icon:"🛍️", tags:["EDA","SQL","Power BI"],                courses:["Data Analytics"],                  featured:true  },
  { id:4,  name:"Access Bank Loan Portfolio",     company:"Access Bank",     cat:"Fintech",      rows:"320,000",   cols:27, fmt:"CSV",           size:"38 MB",   diff:"Advanced",     icon:"🏦", tags:["Credit Risk","Python","Statistics"],    courses:["Machine Learning","Data Science"],  featured:false },
  { id:5,  name:"NHIS Health Records Nigeria",    company:"NHIS",            cat:"Healthcare",   rows:"1,200,000", cols:34, fmt:"CSV",           size:"145 MB",  diff:"Intermediate", icon:"🏥", tags:["Healthcare Analytics","Python","SQL"],  courses:["Data Analytics","Data Science"],    featured:false },
  { id:6,  name:"Safaricom M-PESA Transactions",  company:"Safaricom",       cat:"Fintech",      rows:"3,500,000", cols:19, fmt:"CSV + Parquet", size:"380 MB",  diff:"Advanced",     icon:"📱", tags:["Big Data","dbt","Airflow"],            courses:["Data Engineering"],                featured:false },
  { id:7,  name:"Kano State Agricultural Yield",  company:"Kano MARD",       cat:"Agriculture",  rows:"180,000",   cols:42, fmt:"CSV + Excel",   size:"22 MB",   diff:"Beginner",     icon:"🌾", tags:["EDA","Regression","Excel"],            courses:["Data Analytics"],                  featured:false },
  { id:8,  name:"Lagos BRT Ridership Data",       company:"LAMATA",          cat:"Transport",    rows:"950,000",   cols:16, fmt:"CSV",           size:"87 MB",   diff:"Intermediate", icon:"🚌", tags:["Time Series","SQL","Power BI"],         courses:["Data Analytics"],                  featured:false },
  { id:9,  name:"Konga Customer Behaviour",       company:"Konga",           cat:"Retail",       rows:"4,200,000", cols:28, fmt:"JSON + CSV",    size:"520 MB",  diff:"Advanced",     icon:"🛒", tags:["Funnel Analysis","dbt","Python"],       courses:["Data Engineering"],                featured:false },
  { id:10, name:"AEDC Energy Consumption",        company:"AEDC",            cat:"Energy",       rows:"680,000",   cols:22, fmt:"CSV",           size:"74 MB",   diff:"Intermediate", icon:"⚡", tags:["Anomaly Detection","Time Series"],      courses:["Data Science"],                    featured:false },
  { id:11, name:"OPay Payment Network",           company:"OPay",            cat:"Fintech",      rows:"1,800,000", cols:14, fmt:"CSV + JSON",    size:"195 MB",  diff:"Advanced",     icon:"🔗", tags:["Graph Analysis","Fraud Detection"],    courses:["Machine Learning"],                featured:false },
  { id:12, name:"Lagos Market Price Index",       company:"Lagos State",     cat:"Retail",       rows:"420,000",   cols:12, fmt:"CSV + Excel",   size:"31 MB",   diff:"Beginner",     icon:"📊", tags:["Time Series","Excel","Statistics"],    courses:["Data Analytics"],                  featured:false },
]

const SAMPLE_SCHEMA: Record<number, { col: string; type: string; example: string }[]> = {
  1: [
    { col: "customer_id",     type: "VARCHAR(20)",  example: "MTN_0041829" },
    { col: "region",          type: "VARCHAR(50)",  example: "Lagos" },
    { col: "contract_months", type: "INT",          example: "24" },
    { col: "monthly_charge",  type: "DECIMAL(8,2)", example: "7500.00" },
    { col: "data_usage_gb",   type: "DECIMAL(6,2)", example: "12.40" },
    { col: "churned",         type: "BOOLEAN",      example: "false" },
  ],
  3: [
    { col: "order_id",        type: "VARCHAR(20)",  example: "JMO_7829432" },
    { col: "product_name",    type: "TEXT",         example: "Samsung A54" },
    { col: "category",        type: "VARCHAR(50)",  example: "Electronics" },
    { col: "price_ngn",       type: "DECIMAL(10,2)",example: "285000.00" },
    { col: "seller_city",     type: "VARCHAR(30)",  example: "Lagos" },
    { col: "ordered_at",      type: "TIMESTAMPTZ",  example: "2024-03-15 14:22:00" },
  ],
}

const DIFF_CONFIG: Record<string, { label: string; border: string; bg: string; text: string }> = {
  Beginner:     { label: "Beginner",     border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  Intermediate: { label: "Intermediate", border: "border-amber-200",   bg: "bg-amber-50",   text: "text-amber-700" },
  Advanced:     { label: "Advanced",     border: "border-red-200",     bg: "bg-red-50",     text: "text-red-700" },
}

export function AfricaDataLab() {
  const [search,  setSearch]  = useState("")
  const [cat,     setCat]     = useState("All")
  const [sel,     setSel]     = useState<typeof DATASETS[0] | null>(null)

  const filtered = DATASETS.filter(d =>
    (cat === "All" || d.cat === cat) &&
    (!search || d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.company.toLowerCase().includes(search.toLowerCase()) ||
     d.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  )

  const featured = filtered.filter(d => d.featured)
  const rest     = filtered.filter(d => !d.featured)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="bg-navy-800 rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(25%,-25%)" }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl">
              🌍
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white">Africa Data Lab</h1>
              <p className="text-white/50 text-sm">Real African business datasets. Learn on data you'll actually use.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Datasets",     value: "12+",  icon: Database },
              { label: "Total Rows",   value: "16M+", icon: Layers },
              { label: "Industries",   value: "8",    icon: BarChart3 },
              { label: "Countries",    value: "5",    icon: Globe2 },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <s.icon className="w-5 h-5 text-teal-400 mb-2" />
                <div className="font-display font-black text-2xl text-white">{s.value}</div>
                <div className="text-[11px] text-white/40">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by dataset, company, or skill (e.g. SQL, Python, fraud)..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-teal-500/60 transition-colors" />
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border",
              cat === c
                ? "bg-navy-800 text-white border-navy-800"
                : "bg-white text-neutral-500 border-[#E5E9F0] hover:border-neutral-300 hover:text-navy-800"
            )}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured datasets */}
      {featured.length > 0 && cat === "All" && !search && (
        <div className="mb-6">
          <h2 className="font-display font-bold text-base text-navy-800 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" /> Featured Datasets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map(d => {
              const diff = DIFF_CONFIG[d.diff] ?? DIFF_CONFIG.Beginner
              return (
                <button key={d.id} onClick={() => setSel(d)} className="text-left group">
                  <div className="bg-white border-2 border-teal-200 rounded-2xl p-5 hover:border-teal-400 hover:shadow-md transition-all h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{d.icon}</span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", diff.border, diff.bg, diff.text)}>
                        {d.diff}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-medium mb-1">{d.company}</div>
                    <h3 className="font-display font-bold text-sm text-navy-800 group-hover:text-teal-600 transition-colors leading-tight mb-3 flex-1">
                      {d.name}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400">
                      <span className="font-mono">{d.rows} rows · {d.size}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* All datasets */}
      {rest.length > 0 && (
        <div>
          {cat === "All" && !search && (
            <h2 className="font-display font-bold text-base text-navy-800 mb-3">All Datasets</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(cat === "All" && !search ? rest : filtered).map(d => {
              const diff = DIFF_CONFIG[d.diff] ?? DIFF_CONFIG.Beginner
              return (
                <button key={d.id} onClick={() => setSel(d)}
                  className="bg-white border border-[#E5E9F0] rounded-2xl p-5 cursor-pointer hover:border-teal-300 hover:shadow-sm transition-all group text-left flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{d.icon}</span>
                      <div>
                        <div className="text-[11px] text-neutral-400">{d.company}</div>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5", diff.border, diff.bg, diff.text)}>
                          {d.diff}
                        </span>
                      </div>
                    </div>
                    <Database className="w-4 h-4 text-neutral-300 group-hover:text-teal-500 transition-colors shrink-0" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-navy-800 mb-2 group-hover:text-teal-600 transition-colors leading-tight flex-1">
                    {d.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {d.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] font-mono bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-[#F0F4F8] pt-3 mt-auto">
                    <span className="font-mono">{d.rows} rows · {d.size}</span>
                    <span className="font-mono">{d.cols} cols · {d.fmt}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Database className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">No datasets match your search.</p>
        </div>
      )}

      {/* Dataset detail modal */}
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="bg-navy-800 rounded-t-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #2ec4b6, transparent)", transform: "translate(20%,-20%)" }} />
              <div className="relative flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{sel.icon}</span>
                  <div>
                    <div className="text-white/40 text-xs mb-1">{sel.company}</div>
                    <h2 className="font-display font-bold text-xl text-white leading-tight">{sel.name}</h2>
                  </div>
                </div>
                <button onClick={() => setSel(null)} className="text-white/50 hover:text-white transition-colors ml-4 shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative flex flex-wrap gap-2 mt-4">
                {sel.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono bg-white/10 border border-white/20 text-white/70 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 space-y-5">

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Rows",    value: sel.rows    },
                  { label: "Columns", value: sel.cols    },
                  { label: "Size",    value: sel.size    },
                  { label: "Format",  value: sel.fmt     },
                ].map(s => (
                  <div key={s.label} className="bg-[#F8F9FA] rounded-xl p-3 text-center">
                    <div className="font-black text-navy-800 text-sm">{s.value}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Schema preview */}
              {SAMPLE_SCHEMA[sel.id] && (
                <div>
                  <h3 className="font-semibold text-sm text-navy-800 mb-2.5 flex items-center gap-2">
                    <Database className="w-4 h-4 text-neutral-400" /> Schema Preview
                  </h3>
                  <div className="bg-[#0d1117] rounded-xl overflow-hidden">
                    <div className="grid grid-cols-3 px-4 py-2 border-b border-white/10 text-[9px] font-bold text-white/30 uppercase tracking-wider">
                      <span>Column</span><span>Type</span><span>Example</span>
                    </div>
                    {SAMPLE_SCHEMA[sel.id].map(row => (
                      <div key={row.col} className="grid grid-cols-3 px-4 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <span className="text-teal-400 font-mono text-xs">{row.col}</span>
                        <span className="text-blue-400 font-mono text-xs">{row.type}</span>
                        <span className="text-green-400 font-mono text-xs truncate">{row.example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Used in courses */}
              <div>
                <h3 className="font-semibold text-sm text-navy-800 mb-2.5">Used in Courses</h3>
                <div className="flex gap-2 flex-wrap">
                  {sel.courses.map(c => (
                    <span key={c} className="flex items-center gap-1.5 text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full">
                      📚 {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white py-3 rounded-xl font-bold text-sm transition-all">
                  <ExternalLink className="w-4 h-4" /> Open in Workspace
                </button>
                <button className="flex items-center gap-2 border border-[#E5E9F0] hover:bg-neutral-50 text-neutral-600 px-4 py-3 rounded-xl font-semibold text-sm transition-all">
                  <Lock className="w-4 h-4" /> Download
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                Available to all paid subscribers · Free preview available in Workspace
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
