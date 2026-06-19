/**
 * Wikrena Academy — Shared TypeScript Interfaces
 * Single source of truth for all data types across the platform.
 * All DB queries should return data shaped to these interfaces.
 */

// ─────────────────────────────────────────────────────────────────────────────
// USER / PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole =
  | "STUDENT"
  | "PARENT"
  | "SCHOOL"
  | "TEACHER"
  | "INSTRUCTOR"
  | "ADMIN"

export interface Profile {
  id:               string
  email:            string
  name:             string | null
  username:         string | null
  avatar:           string | null
  bio:              string | null
  role:             UserRole
  country:          string | null
  city:             string | null
  linkedin_url:     string | null
  github_url:       string | null
  twitter_url:      string | null
  industry:         string | null
  is_active:        boolean
  onboarding_done:  boolean
  total_xp:         number
  current_streak:   number
  longest_streak:   number
  last_activity_at: string | null
  streak_freezes:   number
  created_at:       string
  updated_at:       string
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CONTENT  (Supabase-first schema — source of truth)
// ─────────────────────────────────────────────────────────────────────────────

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type LessonType = "VIDEO" | "TEXT" | "CODE" | "QUIZ" | "PROJECT"
export type Language   = "python" | "sql" | "javascript" | "html" | "scratch"

export interface Course {
  id:                string
  title:             string
  slug:              string
  description:       string
  short_description: string | null
  thumbnail:         string | null
  instructor_id:     string | null
  difficulty:        Difficulty
  estimated_hours:   number
  language:          Language
  tags:              string[]
  is_published:      boolean
  is_free:           boolean
  order:             number
  created_at:        string
  updated_at:        string
}

export interface Chapter {
  id:          string
  course_id:   string
  title:       string
  slug:        string
  description: string | null
  order:       number
  is_published: boolean
  created_at:  string
}

export interface Lesson {
  id:              string
  chapter_id:      string
  title:           string
  slug:            string
  type:            LessonType
  content:         string | null
  video_url:       string | null
  mux_playback_id: string | null
  starter_code:    string | null
  xp_reward:       number
  order:           number
  is_published:    boolean
  is_free:         boolean
  duration_mins:   number | null
  created_at:      string
}

// Nested versions for page data fetching
export interface ChapterWithLessons extends Chapter {
  lessons: Lesson[]
}

export interface CourseWithChapters extends Course {
  chapters: ChapterWithLessons[]
}

// ─────────────────────────────────────────────────────────────────────────────
// ENROLLMENTS & PROGRESS
// ─────────────────────────────────────────────────────────────────────────────

export interface CourseEnrollment {
  id:               string
  user_id:          string
  course_id:        string
  enrolled_at:      string
  completed_at:     string | null
  progress_percent: number
  is_active:        boolean
  last_lesson_id:   string | null
}

export interface LessonCompletion {
  id:           string
  user_id:      string
  lesson_id:    string
  course_id:    string
  chapter_id:   string
  xp_earned:    number
  completed_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING PATHS
// ─────────────────────────────────────────────────────────────────────────────

export interface LearningPath {
  id:              string
  title:           string
  slug:            string
  description:     string
  icon:            string | null
  color:           string | null
  difficulty:      Difficulty
  estimated_weeks: number
  price:           number
  currency:        string
  is_published:    boolean
  is_featured:     boolean
  order:           number
  created_at:      string
}

export interface PathCourse {
  id:          string
  path_id:     string
  course_id:   string
  order:       number
  is_required: boolean
}

export interface PathEnrollment {
  id:               string
  user_id:          string
  path_id:          string
  enrolled_at:      string
  completed_at:     string | null
  progress_percent: number
  is_active:        boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export type BadgeRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY"

export interface Badge {
  id:          string
  name:        string
  description: string
  icon:        string
  condition:   Record<string, unknown>
  xp_bonus:    number
  rarity:      BadgeRarity
  created_at:  string
}

export interface UserBadge {
  id:        string
  user_id:   string
  badge_id:  string
  earned_at: string
  badges?:   Badge
}

export interface XpTransaction {
  id:           string
  user_id:      string
  amount:       number
  reason:       string
  reference_id: string | null
  created_at:   string
}

export interface LeaderboardEntry {
  id:         string
  user_id:    string
  scope:      string
  period:     string
  xp:         number
  rank:       number
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// FORUM
// ─────────────────────────────────────────────────────────────────────────────

export interface ForumCategory {
  id:          string
  name:        string
  slug:        string
  description: string | null
  icon:        string | null
  order:       number
}

export interface ForumPost {
  id:          string
  category_id: string
  user_id:     string
  title:       string
  content:     string
  is_pinned:   boolean
  is_solved:   boolean
  view_count:  number
  created_at:  string
  updated_at:  string
  // Joined fields
  profiles?:         Pick<Profile, "id" | "name" | "avatar" | "username">
  forum_categories?: Pick<ForumCategory, "id" | "name" | "slug">
  reply_count?:      number
}

export interface ForumReply {
  id:          string
  post_id:     string
  user_id:     string
  content:     string
  is_accepted: boolean
  created_at:  string
  profiles?:   Pick<Profile, "id" | "name" | "avatar" | "username">
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

export interface Plan {
  id:          string
  name:        string
  description: string | null
  price:       number
  currency:    string
  interval:    string | null
  features:    string[]
  is_active:   boolean
  created_at:  string
}

export interface PaymentTransaction {
  id:           string
  user_id:      string
  plan_id:      string | null
  amount:       number
  currency:     string
  status:       "pending" | "success" | "failed"
  reference:    string
  provider:     string
  created_at:   string
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSPACE & CAREER
// ─────────────────────────────────────────────────────────────────────────────

export interface Workspace {
  id:         string
  user_id:    string
  title:      string
  language:   string
  content:    string | null
  is_public:  boolean
  created_at: string
  updated_at: string
}

export interface PortfolioProject {
  id:          string
  user_id:     string
  title:       string
  description: string
  live_url:    string | null
  github_url:  string | null
  thumbnail:   string | null
  tags:        string[]
  is_public:   boolean
  created_at:  string
  updated_at:  string
}

export interface JobListing {
  id:          string
  title:       string
  company:     string
  location:    string | null
  type:        string
  description: string
  tags:        string[]
  salary_min:  number | null
  salary_max:  number | null
  currency:    string
  apply_url:   string | null
  is_active:   boolean
  is_featured: boolean
  expires_at:  string | null
  created_at:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// MISC
// ─────────────────────────────────────────────────────────────────────────────

export interface Bookmark {
  id:         string
  user_id:    string
  lesson_id:  string
  created_at: string
}

export interface Note {
  id:         string
  user_id:    string
  lesson_id:  string
  content:    string
  created_at: string
  updated_at: string
}

export interface CodingChallenge {
  id:           string
  title:        string
  description:  string
  instructions: string
  starter_code: string | null
  language:     string
  difficulty:   Difficulty
  xp_reward:    number
  time_limit:   number | null
  created_at:   string
}

export interface ChallengeSubmission {
  id:           string
  user_id:      string
  challenge_id: string
  code:         string
  language:     string
  passed:       boolean
  xp_earned:    number
  submitted_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data:    T
}

export interface ApiError {
  success: false
  error:   string
  code?:   number
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

