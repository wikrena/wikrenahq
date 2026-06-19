# Supabase Setup — Required Steps

## 1. Row Level Security (RLS) Policies

Run these in **Supabase → SQL Editor**. These are required for the app to work.

```sql
-- ══════════════════════════════════════════════════════
-- PROFILES TABLE
-- ══════════════════════════════════════════════════════

-- Allow users to read their own profile
CREATE POLICY "profiles: users can read own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile (SETTINGS PAGE NEEDS THIS)
CREATE POLICY "profiles: users can update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow new profile creation on signup
CREATE POLICY "profiles: users can insert own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ══════════════════════════════════════════════════════
-- PATH ENROLLMENTS
-- ══════════════════════════════════════════════════════

CREATE POLICY "enrollments: users can read own"
  ON path_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "enrollments: users can insert own"
  ON path_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enrollments: users can update own"
  ON path_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- XP TRANSACTIONS
-- ══════════════════════════════════════════════════════

CREATE POLICY "xp: users can read own"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "xp: users can insert own"
  ON xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- SKILL COMPLETIONS
-- ══════════════════════════════════════════════════════

CREATE POLICY "completions: users can read own"
  ON skill_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "completions: users can insert own"
  ON skill_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- NOTES & BOOKMARKS
-- ══════════════════════════════════════════════════════

CREATE POLICY "notes: users can manage own"
  ON notes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "bookmarks: users can manage own"
  ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- AI CHAT
-- ══════════════════════════════════════════════════════

CREATE POLICY "ai_sessions: users can manage own"
  ON ai_chat_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "ai_messages: users can manage own"
  ON ai_chat_messages FOR ALL
  USING (
    session_id IN (
      SELECT id FROM ai_chat_sessions WHERE user_id = auth.uid()
    )
  );

-- ══════════════════════════════════════════════════════
-- FORUM (public read, authenticated write)
-- ══════════════════════════════════════════════════════

CREATE POLICY "forum_posts: anyone can read"
  ON forum_posts FOR SELECT USING (true);

CREATE POLICY "forum_posts: authenticated can insert"
  ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forum_replies: anyone can read"
  ON forum_replies FOR SELECT USING (true);

CREATE POLICY "forum_replies: authenticated can insert"
  ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- PUBLIC READ (courses, paths, badges etc)
-- ══════════════════════════════════════════════════════

CREATE POLICY "skill_modules: public read"
  ON skill_modules FOR SELECT USING (is_published = true);

CREATE POLICY "skill_lessons: public read"
  ON skill_lessons FOR SELECT USING (is_published = true);

CREATE POLICY "learning_paths: public read"
  ON learning_paths FOR SELECT USING (is_published = true);

CREATE POLICY "badges: public read"
  ON badges FOR SELECT USING (true);

CREATE POLICY "user_badges: users can read own"
  ON user_badges FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "leaderboard: public read"
  ON leaderboard_entries FOR SELECT USING (true);

CREATE POLICY "job_listings: public read"
  ON job_listings FOR SELECT USING (is_active = true);
```

## 2. Storage — Avatars Bucket

1. Go to **Supabase → Storage**
2. Click **New bucket**
3. Name: `avatars`
4. Toggle **Public bucket: ON**
5. Click **Save**

Then add storage policies:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "avatars: authenticated upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own files
CREATE POLICY "avatars: authenticated update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read of all avatars
CREATE POLICY "avatars: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

## 3. Auth Email Templates

Go to **Supabase → Authentication → Email Templates** and update the **Confirm signup** template redirect URL to:
```
https://academy.wikrena.com/api/auth/callback?token_hash={{ .TokenHash }}&type=email
```

For local dev use:
```
http://localhost:3000/api/auth/callback?token_hash={{ .TokenHash }}&type=email
```

## 4. Auth Redirect URLs

Go to **Supabase → Authentication → URL Configuration**:
- Site URL: `https://academy.wikrena.com`
- Redirect URLs (add all):
  - `https://academy.wikrena.com/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`
