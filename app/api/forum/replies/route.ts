import { withAuth, ok, E } from "@/lib/api"
import { createForumReply, getForumReplies } from "@/lib/data/forum"

export const GET = withAuth(async (req, _ctx) => {
  const { searchParams } = new URL(req.url)
  const post_id = searchParams.get("post_id")
  if (!post_id) return E.badRequest("post_id required")

  const replies = await getForumReplies(post_id)
  return ok(replies)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => ({}))
  const { post_id, content } = body

  if (!post_id) return E.badRequest("post_id required")
  if (!content?.trim()) return E.badRequest("content required")

  const reply = await createForumReply({ userId, postId: post_id, content })
  if (!reply) return E.serverError("Failed to create reply")
  return ok(reply, 201)
})
