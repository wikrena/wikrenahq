import { withAuth, ok, E } from "@/lib/api"
import { addXp, checkAndAwardBadges, updateStreak } from "@/lib/data/gamification"

export const POST = withAuth(async (req, { userId, admin }) => {
  const body = await req.json().catch(() => ({}))
  const { lesson_id, answers, score } = body

  if (!lesson_id) return E.badRequest("lesson_id required")
  if (score === undefined) return E.badRequest("score required")

  const passed  = score >= 70
  const xpEarned = passed ? Math.round(10 + (score - 70) / 3) : 0

  if (passed && xpEarned > 0) {
    await Promise.all([
      addXp({ userId, amount: xpEarned, reason: `Quiz passed: ${lesson_id}`, referenceId: lesson_id }),
      updateStreak(userId),
    ])
    const newBadges = await checkAndAwardBadges(userId)
    return ok({ passed, score, xpEarned, newBadges })
  }

  return ok({ passed, score, xpEarned: 0, newBadges: [] })
})
