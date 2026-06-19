/**
 * lib/data/forum.ts
 * Forum posts, replies, and categories.
 */

import { getAdminClient } from "@/lib/supabase/admin"
import type { ForumPost, ForumReply, ForumCategory } from "@/types"

const db = () => getAdminClient()

export async function getForumCategories(): Promise<ForumCategory[]> {
  const { data, error } = await db()
    .from("forum_categories")
    .select("*")
    .order("order")
  if (error) return []
  return (data ?? []) as ForumCategory[]
}

export async function getForumPosts(opts: {
  categoryId?: string
  limit?:      number
  offset?:     number
  pinned?:     boolean
} = {}): Promise<ForumPost[]> {
  let q = db()
    .from("forum_posts")
    .select("*, profiles(id, name, avatar, username), forum_categories(id, name, slug)")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (opts.categoryId) q = q.eq("category_id", opts.categoryId)
  if (opts.pinned !== undefined) q = q.eq("is_pinned", opts.pinned)
  if (opts.limit)  q = q.limit(opts.limit)
  if (opts.offset) q = q.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1)

  const { data, error } = await q
  if (error) { console.error("[getForumPosts]", error.message); return [] }
  return (data ?? []) as unknown as ForumPost[]
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  const { data, error } = await db()
    .from("forum_posts")
    .select("*, profiles(id, name, avatar, username), forum_categories(id, name, slug)")
    .eq("id", id)
    .single()
  if (error) return null

  // Increment view count
  db().from("forum_posts")
    .update({ view_count: ((data as any).view_count ?? 0) + 1 })
    .eq("id", id)
    .then()

  return data as unknown as ForumPost
}

export async function getForumReplies(postId: string): Promise<ForumReply[]> {
  const { data, error } = await db()
    .from("forum_replies")
    .select("*, profiles(id, name, avatar, username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) return []
  return (data ?? []) as unknown as ForumReply[]
}

export async function createForumPost(params: {
  userId:     string
  categoryId: string
  title:      string
  content:    string
}): Promise<ForumPost | null> {
  const { data, error } = await db()
    .from("forum_posts")
    .insert({
      user_id:     params.userId,
      category_id: params.categoryId,
      title:       params.title.trim(),
      content:     params.content.trim(),
    })
    .select()
    .single()
  if (error) { console.error("[createForumPost]", error.message); return null }
  return data as unknown as ForumPost
}

export async function createForumReply(params: {
  userId:  string
  postId:  string
  content: string
}): Promise<ForumReply | null> {
  const { data, error } = await db()
    .from("forum_replies")
    .insert({
      user_id: params.userId,
      post_id: params.postId,
      content: params.content.trim(),
    })
    .select()
    .single()
  if (error) { console.error("[createForumReply]", error.message); return null }
  return data as unknown as ForumReply
}
