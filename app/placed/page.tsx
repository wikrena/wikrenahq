import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"

export const metadata: Metadata = {
  title: "Placement Wall — Wikrena Academy",
  description: "Real Africans who got real data jobs through Wikrena Academy."
}

// Static placements until real ones come in
const PLACEMENTS = [
  { name:"Adaeze Okonkwo", role:"Data Analyst",    company:"Access Bank",     path:"Data Analytics",  weeks:14, city:"Lagos",  img:"47" },
  { name:"Chidera Agör",   role:"SQL Developer",   company:"Flutterwave",     path:"Data Analytics",  weeks:16, city:"Abuja",  img:"12" },
  { name:"Ngozi Ikechukwu",role:"Health Data Officer",company:"LUTH",         path:"Data Science",    weeks:20, city:"Lagos",  img:"32" },
  { name:"Emeka Obi",      role:"Data Engineer",   company:"Paystack",        path:"Data Engineering",weeks:18, city:"Lagos",  img:"15" },
  { name:"Fatima Suleiman",role:"BI Analyst",      company:"MTN Nigeria",     path:"Data Analytics",  weeks:12, city:"Kano",   img:"20" },
  { name:"Oluwaseun Ade",  role:"ML Engineer",     company:"Andela",          path:"Machine Learning",weeks:24, city:"Lagos",  img:"33" },
]

export default async function PlacementWallPage() {
  return (
    <>
      <MarketingNav />
      <main className="min-h-screen bg-[#F6F8FA] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="eyebrow justify-center">Placement Wall</div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-navy-800 tracking-tight mb-4">
              Real Africans. Real jobs.
            </h1>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto">
              Every person here enrolled, learned, and got placed. This is not marketing. These are our students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLACEMENTS.map((p, i) => (
              <div key={i} className="bg-white border border-[#E5E9F0] rounded-2xl p-5 hover:border-teal-300 hover:shadow-lift transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://i.pravatar.cc/48?img=${p.img}`}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="font-display font-bold text-sm text-navy-800">{p.name}</div>
                    <div className="text-xs text-neutral-400">{p.city}</div>
                  </div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-3">
                  <div className="font-semibold text-sm text-teal-800">{p.role}</div>
                  <div className="text-xs text-teal-600 mt-0.5">@ {p.company}</div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-code">{p.path}</span>
                  <span className="text-neutral-400 font-code">{p.weeks}w to hire</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white border border-[#E5E9F0] rounded-2xl p-8 max-w-lg mx-auto">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-display font-bold text-lg text-navy-800 mb-2">
                Your name belongs on this wall.
              </h3>
              <p className="text-neutral-500 text-sm mb-5">
                Every graduate here started exactly where you are. Enrol in a Career Track today.
              </p>
              <a href="/register"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                Start Your Journey →
              </a>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  )
}
