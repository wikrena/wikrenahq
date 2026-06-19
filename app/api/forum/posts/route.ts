import { withAuth, ok, E } from "@/lib/api"
import { createForumPost, getForumPosts } from "@/lib/data/forum"

export const GET = withAuth(async (req, _ctx) => {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get("category_id") ?? undefined
  const limit      = parseInt(searchParams.get("limit") ?? "20")
  const offset     = parseInt(searchParams.get("offset") ?? "0")

  const posts = await getForumPosts({ categoryId, limit, offset })
  return ok(posts)
})

export const POST = withAuth(async (req, { userId }) => {
  const body = await req.json().catch(() => ({}))
  const { category_id, title, content } = body

  if (!category_id) return E.badRequest("category_id required")
  if (!title?.trim()) return E.badRequest("title required")
  if (!content?.trim()) return E.badRequest("content required")

  const post = await createForumPost({ userId, categoryId: category_id, title, content })
  if (!post) return E.serverError("Failed to create post")
  return ok(post, 201)
})
