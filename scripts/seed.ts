/**
 * Seeds static reference data (badges, skill modules, learning paths,
 * forum categories, plans) into Supabase.
 *
 * Run with: npm run db:seed
 *
 * NOTE: column/table names here mirror the legacy prisma/schema.prisma
 * model. Some of these tables (learning_paths, skill_modules,
 * path_modules, plans) aren't present in supabase/migrations/ — they were
 * created outside the tracked migration history, so verify column names
 * against the live DB before relying on this script.
 */
import { readFileSync, existsSync } from "fs"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) return
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (!match) continue
    const key = match[1]
    let value = (match[2] ?? "").trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
}

const db = createClient(url, key)

async function main() {
  console.log("🌱 Seeding Wikrena Academy...")

  await db.from("badges").upsert([
    { name: "First Flame",    description: "Completed your first lesson",        icon: "🔥", condition: { trigger: "lesson_complete" },    xp_bonus: 20,  rarity: "COMMON" },
    { name: "Query King",     description: "Passed your first SQL challenge",     icon: "👑", condition: { trigger: "sql_challenge_pass" }, xp_bonus: 30,  rarity: "COMMON" },
    { name: "Week Warrior",   description: "Maintained a 7-day learning streak",  icon: "📅", condition: { trigger: "streak_7" },           xp_bonus: 50,  rarity: "RARE" },
    { name: "Quiz Master",    description: "Got 5 perfect quiz scores",           icon: "🧠", condition: { trigger: "quiz_perfect_5" },     xp_bonus: 75,  rarity: "RARE" },
    { name: "Graduate",       description: "Completed a full learning path",      icon: "🎓", condition: { trigger: "path_complete" },      xp_bonus: 500, rarity: "EPIC" },
    { name: "Top 3",          description: "Reached top 3 on weekly leaderboard", icon: "🏆", condition: { trigger: "leaderboard_top3" },   xp_bonus: 100, rarity: "EPIC" },
    { name: "Month Champion", description: "Maintained a 30-day learning streak", icon: "💎", condition: { trigger: "streak_30" },          xp_bonus: 200, rarity: "LEGENDARY" },
    { name: "Community Star", description: "Replied helpfully to 10 forum posts", icon: "⭐", condition: { trigger: "forum_replies_10" },   xp_bonus: 50,  rarity: "RARE" },
  ], { onConflict: "name", ignoreDuplicates: true })

  const skillModules = [
    { title: "SQL Fundamentals", slug: "sql-fundamentals", description: "Master SQL on real Nigerian business data.", icon: "🗄️", difficulty: "BEGINNER",     estimated_hours: 12, is_published: true, order: 1 },
    { title: "Advanced SQL",     slug: "advanced-sql",     description: "Window functions, CTEs, query optimisation.", icon: "🔮", difficulty: "INTERMEDIATE", estimated_hours: 16, is_published: true, order: 2 },
    { title: "Python Basics",    slug: "python-basics",    description: "Write your first Python programs.",           icon: "🐍", difficulty: "BEGINNER",     estimated_hours: 14, is_published: true, order: 3 },
    { title: "Statistics",       slug: "statistics-data",  description: "Descriptive stats and hypothesis testing.",   icon: "📐", difficulty: "INTERMEDIATE", estimated_hours: 10, is_published: true, order: 4 },
    { title: "Power BI",         slug: "power-bi",         description: "Build dashboards that tell stories.",        icon: "📈", difficulty: "INTERMEDIATE", estimated_hours: 14, is_published: true, order: 5 },
    { title: "Excel for Data",   slug: "excel-data",       description: "PivotTables, VLOOKUP and Power Query.",      icon: "📊", difficulty: "BEGINNER",     estimated_hours: 8,  is_published: true, order: 6 },
  ]
  const { data: seededModules } = await db.from("skill_modules").upsert(skillModules, { onConflict: "slug" }).select("id, slug")
  const moduleId = (slug: string) => seededModules?.find(m => m.slug === slug)?.id

  const learningPaths = [
    { title: "Data Analytics Professional", slug: "data-analytics-professional", description: "Master SQL, Excel, Power BI and data storytelling.", icon: "📊", difficulty: "BEGINNER",     estimated_weeks: 12, price: 150000, is_published: true, is_featured: true, order: 1 },
    { title: "Data Engineering",            slug: "data-engineering",            description: "Build the pipelines that power data teams.",          icon: "⚙️", difficulty: "INTERMEDIATE", estimated_weeks: 10, price: 180000, is_published: true, order: 2 },
    { title: "Data Science",                slug: "data-science",                description: "Predictive models on African datasets.",               icon: "🔬", difficulty: "INTERMEDIATE", estimated_weeks: 12, price: 200000, is_published: true, order: 3 },
    { title: "Machine Learning",            slug: "machine-learning",            description: "Train and deploy ML models.",                          icon: "🤖", difficulty: "ADVANCED",     estimated_weeks: 14, price: 220000, is_published: true, order: 4 },
    { title: "AI Automation Specialist",    slug: "ai-automation",               description: "No-code AI tools and workflow automation.",            icon: "⚡", difficulty: "BEGINNER",     estimated_weeks: 6,  price: 120000, is_published: true, order: 5 },
  ]
  const { data: seededPaths } = await db.from("learning_paths").upsert(learningPaths, { onConflict: "slug" }).select("id, slug")
  const pathId = (slug: string) => seededPaths?.find(p => p.slug === slug)?.id

  const pathModuleLinks: { learning_path_id: string; skill_module_id: string; order: number }[] = []
  const link = (pathSlug: string, moduleSlug: string, order: number) => {
    const learning_path_id = pathId(pathSlug)
    const skill_module_id  = moduleId(moduleSlug)
    if (learning_path_id && skill_module_id) pathModuleLinks.push({ learning_path_id, skill_module_id, order })
  }
  link("data-analytics-professional", "sql-fundamentals", 1)
  link("data-analytics-professional", "advanced-sql",      2)
  link("data-analytics-professional", "excel-data",        3)
  link("data-analytics-professional", "power-bi",          4)
  link("data-analytics-professional", "statistics-data",   5)
  link("data-engineering",            "sql-fundamentals",  1)
  link("data-engineering",            "advanced-sql",      2)
  link("data-engineering",            "python-basics",     3)
  link("data-science",                "python-basics",     1)
  link("data-science",                "statistics-data",   2)
  link("machine-learning",            "python-basics",     1)
  link("machine-learning",            "statistics-data",   2)

  if (pathModuleLinks.length) {
    await db.from("path_modules").upsert(pathModuleLinks, { onConflict: "learning_path_id,skill_module_id", ignoreDuplicates: true })
  }

  await db.from("forum_categories").upsert([
    { name: "General Discussion", slug: "general",     icon: "💬", order: 1 },
    { name: "SQL Help",           slug: "sql-help",    icon: "🗄️", order: 2 },
    { name: "Python Help",        slug: "python-help", icon: "🐍", order: 3 },
    { name: "Career Advice",      slug: "career",      icon: "🎯", order: 4 },
    { name: "Show Your Work",     slug: "showcase",    icon: "🏆", order: 5 },
  ], { onConflict: "slug", ignoreDuplicates: true })

  await db.from("plans").upsert([
    { name: "Free",    price: 0,      currency: "NGN", features: ["2 skill modules", "Community access", "AI Tutor (5 msg/day)"] },
    { name: "Monthly", price: 15000,  currency: "NGN", interval: "monthly", features: ["All modules", "Unlimited AI Tutor", "Leaderboards", "Career tools"] },
    { name: "Cohort",  price: 150000, currency: "NGN", features: ["Everything in Monthly", "Live sessions", "Peer review", "Certificate", "90-day placement support"] },
    { name: "Annual",  price: 120000, currency: "NGN", interval: "yearly",  features: ["Everything in Cohort", "All paths", "Mentor matching", "Mock interviews"] },
  ], { onConflict: "name", ignoreDuplicates: true })

  console.log("✅ Seed complete! Badges, Skill Modules, Learning Paths, Forum Categories, Plans all seeded.")
}

main().catch(e => { console.error(e); process.exit(1) })
