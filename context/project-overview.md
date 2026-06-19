# Wikrena Academy

## Overview

Wikrena Academy is the learning management platform for **Wikrena Limited**, an AI and data company. It combines a marketing website with a full-featured LMS — giving learners structured paths in data science, AI, and technology while providing the company a professional public presence.

The platform targets adult learners across Africa and the diaspora who want to build careers in data and AI. It is not a kids or junior platform.

## Company Background

Wikrena Limited was founded by **Chris Awoke**, a self-taught data analyst and former front-end engineer (background in biological sciences) with 7+ years in tech. The company started in 2021 as "Wise Breed Analytics" and rebranded to Wikrena in 2025 with an expanded vision. Chris is also the author of *The Self-Taught Data Analyst* and *Simplified SQL for Data Professionals*. Other team members referenced in real company content: Goodness Oga (Project Management & Content Lead) and Edikan Bassey (Data Analytics Instructor).

Wikrena operates **three pillars**, of which this app is only one:

1. **Wikrena OS** — operating system SaaS for African service businesses (`os.wikrena.com`). Not part of this codebase.
2. **Wikrena Academy** — cohort-based data/AI training for professionals. **This app.**
3. **Wikrena Consulting** ("AnalyticsHQ") — B2B data strategy, analysis & reporting, and corporate data training. Not part of this codebase, but Academy marketing pages should link to it.

Real marketing copy, founder bio, testimonials, and legal page content extracted from the legacy wikrena.com site live in `wikrena-pages/` at the repo root — use it as source material rather than inventing placeholder copy.

## Real Academy Programs

These are the actual programs the Academy sells (per `wikrena-pages/academy.md`, `data-analytics-professional.md`, `automation-program.md`, `research-analysis-with-spss.md`). Program duration is stated inconsistently across legacy source pages (12 vs. 15 weeks for the flagship program) — see the open question in `progress-tracker.md` before hardcoding a number into new copy.

| Program | Format | Notes |
|---|---|---|
| **Data Analytics Professional Program** | Cohort-based, live, ~12–15 weeks | Flagship program. Python, SQL, Power BI, Excel. Fintech / Healthcare / Retail industry tracks. Capstone project, 90-day career support. |
| **AI Automation Specialist Program** | Cohort-based, 8 weeks + 2-week capstone | No-code automation (Make.com, Zapier, n8n) plus AI API integration (OpenAI/Claude). Career, Professional, and Business tracks. |
| **Research & Data Analysis with SPSS** | Self-paced, 7 weeks / 34 lessons | For postgraduate researchers, academics, healthcare/NGO staff. Tiered pricing (Starter/Professional/Premium). |

Cohort sizes, pricing, and start dates vary across legacy pages and should be confirmed with the product owner before being treated as final — do not hardcode legacy WordPress pricing/dates into new pages without confirmation.

## Goals

1. Present Wikrena Limited as a credible AI and data company through polished marketing pages (home, about, contact, and others).
2. Give learners structured, gamified learning paths from beginner to advanced.
3. Provide AI-powered tutoring (Wren) that explains concepts with Africa-specific examples.
4. Expose learners to real African datasets through the Africa Data Lab.
5. Connect learners to job opportunities and support active career development.
6. Enable instructors to create and manage course content.
7. Give school administrators tools to manage bulk enrolments and monitor progress.

## Core User Flows

### Learner
1. Visitor lands on the marketing site and signs up.
2. Learner completes onboarding (role, goals, experience level).
3. Learner browses learning paths and enrols.
4. Learner works through lessons (video, text, code, quiz, project types).
5. Learner earns XP, badges, and streaks for progress.
6. Learner uses Wren AI Tutor for on-demand help.
7. Learner completes challenges and climbs the leaderboard.
8. Learner builds a portfolio and applies for jobs through the career hub.
9. Learner earns certificates on path completion.

### Instructor
1. Instructor logs in and accesses the instructor dashboard.
2. Instructor creates courses, chapters, and lessons.
3. Instructor publishes content for learners to enrol.
4. Instructor tracks learner progress and reviews submissions.

### Admin
1. Admin manages users, content, payments, and platform settings from the admin panel.
2. Admin can view analytics across all platform activity.

## Features

### Marketing Site
- Home page — company overview, value proposition, featured courses, social proof. (`app/page.tsx` exists; real copy available in `wikrena-pages/home.md`.)
- About page — Wikrena Limited mission, team, and story. (Not yet built; real copy in `wikrena-pages/about-us.md`.)
- Contact page — contact form and company details. (Not yet built; emails referenced across legacy pages: `hello@wikrena.com` general, `help@wikrena.com` programs, `privacy@wikrena.com`, `legal@wikrena.com`, `billing@wikrena.com`.)
- Pricing page — plan tiers with Africa and diaspora pricing. (`app/pricing/page.tsx` exists.)
- Legal pages (Privacy Policy, Terms of Use, Cookie Policy) — not yet built; real legal copy available in `wikrena-pages/privacy-policy.md`, `terms-of-use.md`, `cookie-policy.md`.
- Additional marketing pages as needed.

### Learning Paths & Courses
- Structured paths: Beginner → Intermediate → Advanced.
- Lesson types: video, text, code, quiz, project.
- Progress tracking, estimated hours, and difficulty ratings.
- Lesson bookmarking and note-taking.

### Gamification
- XP (experience points) earned for lesson completion, challenges, and streaks.
- Badges and achievements.
- Daily, weekly, and global leaderboards.
- Streak tracking (current and longest).

### Wren AI Tutor
- Powered by Anthropic Claude.
- Modes: Explain, Hint, Debug, Quiz, Career.
- Africa-specific examples and context.
- Session history and context awareness.
- Rate-limited via Upstash Redis.

### Africa Data Lab
- Real African company datasets (MTN, Flutterwave, Access Bank, etc.).
- SQL and Python challenges on live data.
- Peer review of data analysis projects.

### Coding Challenges
- Difficulty-graded challenges.
- Code execution via Judge0 API.
- XP rewards and submission tracking.

### Career Hub
- Job listings with company, location, and salary information.
- Portfolio projects with GitHub and live URLs.
- Resume builder.
- Mentor connections.
- Interview preparation resources.
- Job placement tracking (`/placed`).

### Community
- Forum with categories, posts, and replies.
- Study groups.
- Peer code and project review queue.

### Workspace
- In-browser code notebook and editor (Monaco).
- Rich text notes (Tiptap).

### Certificates
- Issued on learning path completion.
- Shareable certificate pages.

### Instructor Dashboard
- Course and content management.
- Lesson creation (video, text, code, quiz, project).
- Learner progress visibility.

### Admin Panel
- User management.
- Content management.
- Analytics.
- Payment and subscription management.
- School management.
- Platform settings.

### School Administration
- Bulk learner enrolment.
- Teacher progress monitoring.
- School-level analytics.

### Parent Dashboard
- Monitor child account progress.
- Weekly progress reports.

### Payments
- Paystack integration.
- Plan tiers: Free, Monthly, Annual, Diaspora pricing.
- Subscription management.

## User Roles

| Role | Description |
|---|---|
| `STUDENT` | Default learner role |
| `INSTRUCTOR` | Can create and manage course content |
| `TEACHER` | Assigned by a school to monitor learners |
| `PARENT` | Monitors a linked child account |
| `SCHOOL` | School administrator — manages bulk enrolments |
| `ADMIN` | Full platform administration |

## Scope

### In Scope
- Marketing pages (home, about, contact, pricing, and others)
- User authentication and onboarding
- Learning paths, courses, and lesson delivery
- Gamification (XP, badges, streaks, leaderboard)
- Wren AI Tutor
- Africa Data Lab
- Coding challenges with code execution
- Career hub (jobs, portfolio, resume, mentors)
- Community (forum, peer review, study groups)
- In-browser workspace
- Certificates
- Instructor content management
- Admin panel
- School administration
- Parent monitoring
- Paystack payments

### Out of Scope
- Kids / junior platform (removed)
- Mobile-native applications
- Third-party LMS integrations
