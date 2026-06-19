"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  Eye,
  Send,
  Check,
  Loader2,
  Plus,
  BarChart2,
  Zap,
  ChevronRight,
  LogOut,
  Clock,
  PenLine,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WikrenaLogo } from "@/components/app-shell/wikrena-logo";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  is_published: boolean;
  estimated_hours: number;
  enrollments: number;
  updated_at: string;
  chapters: { id: string; lessons: { id: string; is_published: boolean }[] }[];
}

interface Props {
  profile: any;
  courses: Course[];
  userEmail: string;
}

export function InstructorDashboard({ profile, courses, userEmail }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const name =
    profile?.name?.split(" ")[0] ?? userEmail?.split("@")[0] ?? "Instructor";

  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState("");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalLessons = courses.reduce(
    (s, c) => s + c.chapters.flatMap((ch) => ch.lessons).length,
    0,
  );
  const publishedCourses = courses.filter((c) => c.is_published).length;
  const totalEnrollments = courses.reduce((s, c) => s + c.enrollments, 0);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function submitForReview(course: Course) {
    setSubmitting(course.id);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, review_status: "submitted" }),
      });
      if (res.ok) {
        setSubmitted((prev) => new Set([...prev, course.id]));
        setMsg(
          `"${course.title}" submitted for review. You will be notified when it is approved.`,
        );
        setTimeout(() => setMsg(""), 5000);
      }
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Header */}
      <header className="h-14 bg-white border-b border-neutral-200 sticky top-0 z-20 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <WikrenaLogo variant="dark-bg" href="/" height={24} />
          <div className="h-4 w-px bg-neutral-200" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Instructor Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/content"
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Course
          </Link>
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-neutral-600 px-3 py-2"
          >
            ← Home
          </Link>
          <button
            onClick={signOut}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome */}
        <div className="bg-[#0a192f] rounded-2xl p-6 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.06] pointer-events-none"
            style={{
              background: "radial-gradient(circle, #2ec4b6, transparent)",
              transform: "translate(30%,-30%)",
            }}
          />
          <div className="relative">
            <p className="text-teal-400 text-xs font-mono uppercase tracking-widest mb-1">
              {greeting}
            </p>
            <h1 className="font-display font-black text-white text-2xl mb-1">
              {name} 👋
            </h1>
            <p className="text-white/50 text-sm">
              {courses.length === 0
                ? "You have no courses yet. Create your first course to get started."
                : `You have ${courses.length} course${courses.length !== 1 ? "s" : ""} — ${publishedCourses} published`}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "My Courses",
              value: courses.length,
              icon: BookOpen,
              color: "text-teal-600",
              bg: "bg-teal-50",
            },
            {
              label: "Total Students",
              value: totalEnrollments,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Total Lessons",
              value: totalLessons,
              icon: Zap,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                  s.bg,
                )}
              >
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <div className="font-display font-black text-2xl text-navy-800 mb-0.5">
                {s.value}
              </div>
              <div className="text-xs text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Success message */}
        {msg && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-xl">
            <Check className="w-4 h-4 shrink-0" /> {msg}
          </div>
        )}

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-navy-800">
              My Courses
            </h2>
            <Link
              href="/admin/content"
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-500"
            >
              <Plus className="w-3.5 h-3.5" /> Create Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-neutral-200 rounded-2xl p-12 text-center">
              <BookOpen className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <h3 className="font-bold text-navy-800 mb-2">No courses yet</h3>
              <p className="text-sm text-neutral-400 mb-5 max-w-xs mx-auto">
                Create your first course. Add chapters, lessons, quizzes and
                code exercises.
              </p>
              <Link
                href="/admin/content"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Create First Course
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => {
                const allLessons = course.chapters.flatMap((ch) => ch.lessons);
                const publishedLessons = allLessons.filter(
                  (l) => l.is_published,
                ).length;
                const progressPct =
                  allLessons.length > 0
                    ? Math.round((publishedLessons / allLessons.length) * 100)
                    : 0;
                const isSubmitted = submitted.has(course.id);
                const canSubmit =
                  !course.is_published && !isSubmitted && allLessons.length > 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      {/* Course icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-lg font-black shrink-0">
                        {course.title[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-navy-800 truncate">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-lg border",
                                course.is_published
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : isSubmitted
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200",
                              )}
                            >
                              {course.is_published
                                ? "Published"
                                : isSubmitted
                                  ? "In Review"
                                  : "Draft"}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-400 mb-3 truncate">
                          {course.description || "No description yet"}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {course.chapters.length} chapters ·{" "}
                            {allLessons.length} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {course.enrollments} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.estimated_hours}h
                          </span>
                        </div>

                        {/* Progress bar */}
                        {allLessons.length > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                              <span>
                                {publishedLessons}/{allLessons.length} lessons
                                published
                              </span>
                              <span>{progressPct}%</span>
                            </div>
                            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-400 rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/admin/content/${course.id}`}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white px-3.5 py-2 rounded-lg transition-all"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                            Edit Course
                          </Link>

                          {course.is_published && (
                            <Link
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              className="flex items-center gap-1.5 text-xs font-semibold border border-neutral-200 text-neutral-600 hover:border-neutral-300 px-3.5 py-2 rounded-lg transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Live
                            </Link>
                          )}

                          {canSubmit && (
                            <button
                              onClick={() => submitForReview(course)}
                              disabled={submitting === course.id}
                              className="flex items-center gap-1.5 text-xs font-semibold border border-teal-300 text-teal-600 hover:bg-teal-50 px-3.5 py-2 rounded-lg transition-all disabled:opacity-50"
                            >
                              {submitting === course.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              Submit for Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-navy-800 mb-4">
            How course publishing works
          </h3>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Create your course",
                desc: "Add chapters and lessons in the Content Manager. Write lesson content, add code exercises and quizzes.",
              },
              {
                step: "2",
                title: "Publish your lessons",
                desc: "Mark individual lessons as published when they are ready. Unpublished lessons are invisible to students.",
              },
              {
                step: "3",
                title: "Submit for review",
                desc: "When your course is ready, click Submit for Review. The admin team reviews it within 24-48 hours.",
              },
              {
                step: "4",
                title: "Go live",
                desc: "Once approved, your course is published and visible to all enrolled students on the platform.",
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-800">
                    {s.title}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
