/**
 * Wikrena Email Service — powered by Resend
 *
 * Usage:
 *   import { sendEmail } from "@/lib/email"
 *   await sendEmail.welcome({ name: "Amara", email: "amara@...", loginUrl: "..." })
 */

import {
  welcomeStudentEmail, passwordResetEmail, emailVerificationEmail,
  instructorInviteEmail, courseSubmittedEmail, coursePublishedEmail,
  newEnrollmentInstructorEmail, newEnrollmentStudentEmail,
  badgeEarnedEmail, streakReminderEmail, schoolInvitationEmail,
  verificationStudentEmail, verificationParentEmail, verificationSchoolEmail,
} from "./templates"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://academy.wikrena.com"
const FROM_ADDRESS = "Wikrena Academy <hello@wikrena.com>"
const FROM_NOREPLY  = "Wikrena Academy <noreply@wikrena.com>"
const ADMIN_EMAIL   = "uchehchristian27@gmail.com"

async function send(to: string, subject: string, html: string): Promise<{ id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    // Resend not configured — log in dev, skip silently
    if (process.env.NODE_ENV === "development") {
      console.log(`[email] Would send to ${to}: ${subject}`)
    }
    return {}
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error("[email] Resend error:", data)
      return { error: data.message ?? "Send failed" }
    }
    return { id: data.id }
  } catch (err: any) {
    console.error("[email] Network error:", err.message)
    return { error: err.message }
  }
}

export const sendEmail = {

  async welcome({ name, email }: { name: string; email: string }) {
    return send(email, "Welcome to Wikrena Academy 🚀",
      welcomeStudentEmail(name, `${APP_URL}/dashboard`))
  },

  async passwordReset({ name, email, resetUrl }: { name: string; email: string; resetUrl: string }) {
    return send(email, "Reset your Wikrena password", passwordResetEmail(name, resetUrl))
  },

  async emailVerification({ name, email, verifyUrl }: { name: string; email: string; verifyUrl: string }) {
    return send(email, "Confirm your email — Wikrena Academy",
      emailVerificationEmail(name, verifyUrl))
  },

  async instructorInvite({ name, email, inviterName, role, token }: {
    name: string; email: string; inviterName: string; role: string; token: string
  }) {
    const acceptUrl = `${APP_URL}/invite/accept?token=${token}`
    return send(email, `You're invited to teach on Wikrena Academy`,
      instructorInviteEmail(name, inviterName, role, acceptUrl))
  },

  async courseSubmitted({ courseName, instructorName }: { courseName: string; instructorName: string }) {
    const reviewUrl = `${APP_URL}/admin/content`
    return send(ADMIN_EMAIL, `Course ready for review: ${courseName}`,
      courseSubmittedEmail("Chris", courseName, instructorName, reviewUrl))
  },

  async coursePublished({ instructorEmail, instructorName, courseName, courseSlug }: {
    instructorEmail: string; instructorName: string; courseName: string; courseSlug: string
  }) {
    const courseUrl = `${APP_URL}/courses/${courseSlug}`
    return send(instructorEmail, `Your course "${courseName}" is now live! 🎉`,
      coursePublishedEmail(instructorName, courseName, courseUrl))
  },

  async enrollmentInstructor({ instructorEmail, instructorName, studentName, courseName, courseId }: {
    instructorEmail: string; instructorName: string; studentName: string; courseName: string; courseId: string
  }) {
    const dashUrl = `${APP_URL}/instructor/courses/${courseId}`
    return send(instructorEmail, `New enrollment in "${courseName}"`,
      newEnrollmentInstructorEmail(instructorName, studentName, courseName, dashUrl))
  },

  async enrollmentStudent({ studentEmail, studentName, courseName, courseSlug }: {
    studentEmail: string; studentName: string; courseName: string; courseSlug: string
  }) {
    const courseUrl = `${APP_URL}/courses/${courseSlug}`
    return send(studentEmail, `You're enrolled in "${courseName}"`,
      newEnrollmentStudentEmail(studentName, courseName, courseUrl))
  },

  async badgeEarned({ email, name, badgeName, badgeIcon, badgeDesc }: {
    email: string; name: string; badgeName: string; badgeIcon: string; badgeDesc: string
  }) {
    const profileUrl = `${APP_URL}/profile`
    return send(email, `You earned the ${badgeName} badge! ${badgeIcon}`,
      badgeEarnedEmail(name, badgeName, badgeIcon, badgeDesc, profileUrl))
  },

  async streakReminder({ email, name, streak }: { email: string; name: string; streak: number }) {
    const loginUrl = `${APP_URL}/dashboard`
    return send(email, `🔥 Don't break your ${streak}-day streak, ${name}!`,
      streakReminderEmail(name, streak, loginUrl))
  },

  async verification({ name, email, role, verifyUrl }: {
    name: string; email: string; role: string; verifyUrl: string
  }) {
    const isParent = role === "PARENT"
    const isSchool = role === "SCHOOL" || role === "TEACHER"

    const subject = isParent
      ? "Confirm your Wikrena Academy parent account"
      : isSchool
      ? "Confirm your Wikrena Academy school account"
      : "Confirm your email — Wikrena Academy"

    const html = isParent
      ? verificationParentEmail(name, verifyUrl)
      : isSchool
      ? verificationSchoolEmail(name, verifyUrl)
      : verificationStudentEmail(name, verifyUrl)

    return send(email, subject, html)
  },

  async schoolInvitation({ email, studentName, schoolName, cohortName, token }: {
    email: string; studentName: string; schoolName: string; cohortName: string; token: string
  }) {
    const acceptUrl = `${APP_URL}/school/join?token=${token}`
    return send(email, `${schoolName} invited you to learn on Wikrena`,
      schoolInvitationEmail(studentName, schoolName, cohortName, acceptUrl))
  },
}

// Appended by architecture cleanup — invitation email
export async function sendInvitationEmail(params: {
  toEmail:      string
  toName:       string
  role:         string
  inviteUrl:    string
  message?:     string | null
  courseNames?: string[]
}): Promise<void> {
  const { toEmail, toName, role, inviteUrl, message, courseNames } = params
  const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const roleLabel: Record<string, string> = {
    ADMIN:      "Platform Administrator",
    INSTRUCTOR: "Course Instructor",
    SCHOOL:     "School Account",
    TEACHER:    "Teacher Account",
  }

  const subject = `You've been invited to join Wikrena Academy as ${roleLabel[role] ?? role}`

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a192f;border-radius:16px;overflow:hidden">
      <div style="background:#0a192f;padding:32px 32px 0;border-bottom:3px solid;border-image:linear-gradient(90deg,#2ec4b6,#0d9488) 1">
        <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px">Wikrena<span style="color:#2ec4b6">.</span></div>
        <div style="display:inline-block;background:rgba(46,196,182,0.15);border:1px solid rgba(46,196,182,0.3);color:#2ec4b6;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;margin-top:8px;letter-spacing:1px;text-transform:uppercase">Academy</div>
      </div>
      <div style="padding:32px">
        <h2 style="color:#fff;font-size:24px;margin:0 0 8px">You've been invited 🎉</h2>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 24px">
          Hi ${toName}, you've been invited to join Wikrena Academy as a <strong style="color:#2ec4b6">${roleLabel[role] ?? role}</strong>.
        </p>
        ${message ? `<div style="background:rgba(255,255,255,0.06);border-left:3px solid #2ec4b6;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;color:rgba(255,255,255,0.7);font-size:13px;line-height:1.6">${message}</div>` : ""}        ${courseNames && courseNames.length > 0 ? `<div style="background:rgba(46,196,182,0.08);border:1px solid rgba(46,196,182,0.2);border-radius:12px;padding:14px 18px;margin-bottom:24px;font-size:13px;color:rgba(255,255,255,0.7)"><div style="margin-bottom:6px;color:#2ec4b6;font-weight:700">Assigned course${courseNames.length !== 1 ? "s" : ""}:</div>${courseNames.map(n => `<div style="margin:3px 0">&#8226; ${n}</div>`).join("")}</div>` : ""}
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:28px">
          <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Your access includes</div>
          ${role === "INSTRUCTOR" ? `
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Create and publish courses</div>
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Manage your student enrollments</div>
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Track learner progress and completions</div>
          ` : role === "ADMIN" ? `
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Full platform administration</div>
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Manage users, courses and content</div>
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ View analytics and payments</div>
          ` : `
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Access the platform dashboard</div>
            <div style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0">✓ Manage your account and students</div>
          `}
        </div>
        <a href="${inviteUrl}" style="display:inline-block;background:#2ec4b6;color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;width:100%;text-align:center;box-sizing:border-box">
          Accept Invitation &amp; Set Up Account
        </a>
        <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:16px 0 0;text-align:center">
          This link expires in 7 days. If you weren't expecting this, you can safely ignore it.
        </p>
      </div>
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center">
        <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0">
          © ${new Date().getFullYear()} Wikrena Academy · Africa's Data &amp; AI Platform
        </p>
      </div>
    </div>
  `

  const { resend } = await import("@/lib/email/index").then(m => ({ resend: (m as any)._resend })).catch(() => ({ resend: null }))

  // Use the existing Resend client
  const { Resend } = await import("resend")
  const client = new Resend(process.env.RESEND_API_KEY)
  await client.emails.send({
    from:    "Wikrena Academy <noreply@wikrena.com>",
    to:      toEmail,
    subject,
    html,
  })
}
