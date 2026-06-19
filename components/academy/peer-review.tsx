"use client"

import { useState } from "react"
import {
  GitPullRequest, Star, MessageSquare, Clock,
  CheckCircle2, Upload, Eye, ChevronRight,
  Code2, BarChart2, FileText, Award
} from "lucide-react"
import { cn } from "@/lib/utils"

const REVIEW_QUEUE = [
  {
    id: "1", title: "Flutterwave Transaction Analysis", author: "Emeka Okafor",
    track: "Data Analytics", type: "SQL Query", difficulty: "Intermediate",
    description: "I wrote a SQL query to analyse 6 months of Flutterwave transaction data — finding peak hours, top merchants, and flagging anomalies. Looking for feedback on query efficiency and structure.",
    submittedAt: "2h ago", reviews: 1, status: "needs_review",
    xpReward: 30, authorInitials: "EO", authorColor: "bg-teal-500",
  },
  {
    id: "2", title: "MTN Churn Prediction Model", author: "Fatima Suleiman",
    track: "Data Science", type: "Python Script", difficulty: "Advanced",
    description: "Built a logistic regression model to predict MTN subscriber churn using 12 features including call duration, top-up frequency, and data usage. Achieved 78% accuracy on test set.",
    submittedAt: "5h ago", reviews: 0, status: "needs_review",
    xpReward: 50, authorInitials: "FS", authorColor: "bg-purple-500",
  },
  {
    id: "3", title: "Lagos BRT Ridership Dashboard", author: "Chidi Kalu",
    track: "Data Analytics", type: "Power BI Dashboard", difficulty: "Beginner",
    description: "My first Power BI dashboard! Used LAMATA ridership data. Shows daily passengers by route, peak hours, and monthly trends. Would love feedback on the visualisation choices.",
    submittedAt: "1d ago", reviews: 2, status: "reviewed",
    xpReward: 25, authorInitials: "CK", authorColor: "bg-amber-500",
  },
  {
    id: "4", title: "Access Bank Loan Risk Score Function", author: "Ngozi Ibrahim",
    track: "Data Science", type: "Python Function", difficulty: "Intermediate",
    description: "Python function that calculates a simple credit risk score based on income, loan amount, employment duration, and existing debt ratio. Based on Access Bank's public criteria.",
    submittedAt: "2d ago", reviews: 3, status: "reviewed",
    xpReward: 30, authorInitials: "NI", authorColor: "bg-coral-500",
  },
]

const MY_SUBMISSIONS = [
  {
    id: "s1", title: "OPay Fraud Detection Query",
    type: "SQL", status: "reviewed", reviews: 2, rating: 4.5, submittedAt: "3d ago",
  },
]

const REVIEW_CRITERIA = [
  { id: "correctness",  label: "Correctness",         desc: "Does the code/query produce the right result?" },
  { id: "efficiency",   label: "Efficiency",           desc: "Is it optimised? Could it run faster?" },
  { id: "readability",  label: "Readability",          desc: "Is it easy to understand and well-commented?" },
  { id: "african_context", label: "African Context",   desc: "Does it use realistic African data and examples?" },
]

interface Props { userId: string }

export function PeerReviewPage({ userId }: Props) {
  const [activeTab,    setActiveTab]    = useState<"queue"|"mine"|"submit">("queue")
  const [reviewing,    setReviewing]    = useState<string | null>(null)
  const [ratings,      setRatings]      = useState<Record<string, number>>({})
  const [feedback,     setFeedback]     = useState("")
  const [submitted,    setSubmitted]    = useState(false)

  function startReview(id: string) {
    setReviewing(id)
    setRatings({})
    setFeedback("")
    setSubmitted(false)
  }

  function submitReview() {
    setSubmitted(true)
    setTimeout(() => { setReviewing(null); setSubmitted(false) }, 2000)
  }

  const TABS = [
    { id: "queue",  label: "Review Queue", count: REVIEW_QUEUE.filter(r => r.status === "needs_review").length },
    { id: "mine",   label: "My Submissions", count: MY_SUBMISSIONS.length },
    { id: "submit", label: "Submit Work",  count: null },
  ] as const

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl text-navy-800 mb-1">Peer Review</h1>
        <p className="text-neutral-500 text-sm">
          Review each other's work. Give feedback. Earn XP. Get better together.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: Upload,        title: "Submit your work", desc: "Share a query, script, or dashboard for feedback", xp: "+10 XP" },
          { icon: Eye,           title: "Review others",    desc: "Give structured feedback on 3 criteria",           xp: "+30 XP" },
          { icon: Award,         title: "Earn badges",      desc: "Top reviewers earn special recognition badges",    xp: "Badge" },
        ].map(item => (
          <div key={item.title} className="bg-white border border-[#E5E9F0] rounded-2xl p-4 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="font-semibold text-navy-800 text-sm">{item.title}</div>
              <div className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</div>
              <div className="text-xs font-bold text-teal-600 mt-1">{item.xp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F0F4F8] rounded-xl mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === t.id ? "bg-white text-navy-800 shadow-sm" : "text-neutral-500 hover:text-navy-700"
            )}>
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Review Queue tab */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          {REVIEW_QUEUE.map(item => (
            <div key={item.id} className="bg-white border border-[#E5E9F0] rounded-2xl overflow-hidden hover:shadow-sm transition-all">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0", item.authorColor)}>
                    {item.authorInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-navy-800 text-base">{item.title}</h3>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        item.status === "needs_review"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-teal-100 text-teal-700"
                      )}>
                        {item.status === "needs_review" ? "Needs Review" : "Reviewed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>by <strong className="text-neutral-600">{item.author}</strong></span>
                      <span>{item.track}</span>
                      <span className="flex items-center gap-1"><Code2 className="w-3 h-3" />{item.type}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.submittedAt}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-500 shrink-0">+{item.xpReward} XP</span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {item.reviews} review{item.reviews !== 1 ? "s" : ""}
                  </div>
                  {item.status === "needs_review" ? (
                    <button onClick={() => startReview(item.id)}
                      className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                      Write Review <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 border border-[#E5E9F0] text-neutral-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-all">
                      View Reviews
                    </button>
                  )}
                </div>
              </div>

              {/* Review form */}
              {reviewing === item.id && (
                <div className="border-t border-[#F0F4F8] p-5 bg-[#FAFBFC]">
                  {submitted ? (
                    <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm py-2">
                      <CheckCircle2 className="w-5 h-5" /> Review submitted! +{item.xpReward} XP earned.
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-navy-800 text-sm mb-4">Rate this submission</h4>
                      <div className="space-y-3 mb-4">
                        {REVIEW_CRITERIA.map(criterion => (
                          <div key={criterion.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-navy-800">{criterion.label}</span>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(star => (
                                  <button key={star} onClick={() => setRatings(r => ({ ...r, [criterion.id]: star }))}
                                    className={cn(
                                      "w-6 h-6 text-lg transition-colors",
                                      (ratings[criterion.id] ?? 0) >= star ? "text-amber-400" : "text-neutral-200"
                                    )}>
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-neutral-400">{criterion.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        <label className="text-sm font-semibold text-navy-800 block mb-1.5">Written Feedback</label>
                        <textarea
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          rows={3}
                          placeholder="What did they do well? What could be improved? Be specific and constructive."
                          className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={submitReview}
                          disabled={Object.keys(ratings).length < REVIEW_CRITERIA.length || !feedback.trim()}
                          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                          Submit Review (+{item.xpReward} XP)
                        </button>
                        <button onClick={() => setReviewing(null)}
                          className="px-4 py-2.5 border border-[#E5E9F0] rounded-xl text-sm text-neutral-500 hover:bg-neutral-50 transition-all">
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Submissions tab */}
      {activeTab === "mine" && (
        <div className="space-y-4">
          {MY_SUBMISSIONS.map(sub => (
            <div key={sub.id} className="bg-white border border-[#E5E9F0] rounded-2xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-navy-800 mb-1">{sub.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span>{sub.type}</span>
                    <span>{sub.submittedAt}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{sub.reviews} reviews</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sub.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                      <span className="font-bold text-sm text-amber-600">{sub.rating}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                    {sub.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-[#E5E9F0] hover:border-teal-300 rounded-2xl p-6 text-center text-neutral-400 hover:text-teal-600 transition-all"
            onClick={() => setActiveTab("submit")}>
            <Upload className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-semibold">Submit a new project for review</span>
          </button>
        </div>
      )}

      {/* Submit tab */}
      {activeTab === "submit" && (
        <div className="bg-white border border-[#E5E9F0] rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-navy-800 mb-2">Submit Work for Review</h3>
          <p className="text-neutral-500 text-sm mb-6">
            Share a query, script, dashboard, or analysis. Get structured feedback from your peers. Earn +10 XP when you submit.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">Project Title</label>
              <input placeholder="e.g. MTN Subscriber Churn Analysis"
                className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">Type</label>
                <select className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 bg-white">
                  <option>SQL Query</option>
                  <option>Python Script</option>
                  <option>Power BI Dashboard</option>
                  <option>R Script</option>
                  <option>Data Analysis</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">Difficulty</label>
                <select className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 bg-white">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">Description</label>
              <textarea rows={3} placeholder="What did you build? What are you trying to achieve? What specific feedback would help?"
                className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-1.5">Your Code / Work</label>
              <textarea rows={8} placeholder="Paste your SQL, Python, or describe your dashboard..."
                className="w-full border border-[#E5E9F0] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-teal-500 transition-colors resize-none bg-[#F8F9FA]" />
            </div>
            <button className="w-full bg-teal-500 hover:bg-teal-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all">
              Submit for Peer Review (+10 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
