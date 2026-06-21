/**
 * Email HTML templates — responsive, branded, mobile-first.
 * All templates share a common layout wrapper.
 */

const BRAND = {
  primary:    "#2ec4b6",
  navy:       "#0a192f",
  coral:      "#ff6b3d",
  bg:         "#F6F8FA",
  text:       "#1e293b",
  muted:      "#64748b",
  border:     "#e2e8f0",
  white:      "#ffffff",
}

function layout(content: string, previewText: string = ""): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <title>Wikrena Academy</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    /* Reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html { margin: 0; padding: 0; width: 100% !important; background: #F0F4F8; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    img { border: 0; display: block; outline: none; }
    a { text-decoration: none; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { border-collapse: collapse; }

    /* Outer wrapper */
    .email-bg { background: #F0F4F8; width: 100%; padding: 40px 16px; }

    /* Card */
    .card { background: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; }

    /* Header */
    .header { background: #0a192f; padding: 0; }
    .header-inner { padding: 22px 40px; display: flex; align-items: center; justify-content: space-between; }
    .logo-wordmark { font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
    .logo-dot { color: #2ec4b6; }
    .header-tag { background: rgba(46,196,182,0.15); border: 1px solid rgba(46,196,182,0.3); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; color: #2ec4b6; letter-spacing: 0.5px; text-transform: uppercase; }
    .header-accent { height: 3px; background: linear-gradient(90deg, #2ec4b6 0%, #0d9488 50%, #2ec4b6 100%); }

    /* Hero */
    .hero { background: linear-gradient(135deg, #0a192f 0%, #0d2540 60%, #0a2a1f 100%); padding: 44px 40px 40px; position: relative; }
    .hero-icon { width: 64px; height: 64px; background: rgba(46,196,182,0.15); border: 1px solid rgba(46,196,182,0.3); border-radius: 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    .hero-title { color: #ffffff; font-size: 26px; font-weight: 800; line-height: 1.25; margin-bottom: 10px; letter-spacing: -0.3px; }
    .hero-subtitle { color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.6; max-width: 440px; }
    .hero-bottom-bar { height: 1px; background: linear-gradient(90deg, transparent, rgba(46,196,182,0.4), transparent); margin-top: 32px; }

    /* Body */
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; font-weight: 700; color: #0a192f; margin-bottom: 12px; }
    .text { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 16px; }

    /* CTA button */
    .btn-wrap { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background: #2ec4b6; color: #ffffff !important; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 800; font-size: 15px; letter-spacing: 0.2px; border: none; }
    .btn-school { background: #0a192f; }
    .btn-parent { background: #ff6b3d; }

    /* Info box */
    .info-box { background: #f0fdf9; border: 1px solid #99f6e4; border-radius: 12px; padding: 20px 22px; margin: 24px 0; }
    .info-box-title { font-size: 11px; font-weight: 800; color: #0f766e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .info-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-size: 14px; color: #047857; line-height: 1.5; }
    .info-item:last-child { margin-bottom: 0; }
    .info-check { color: #2ec4b6; font-weight: 900; flex-shrink: 0; margin-top: 1px; }

    /* Safe link */
    .safe-link { font-size: 12px; color: #94a3b8; line-height: 1.6; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
    .safe-link a { color: #2ec4b6; word-break: break-all; }

    /* Divider */
    .divider { height: 1px; background: #f1f5f9; margin: 28px 0; }

    /* Footer */
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 28px 40px; }
    .footer-links { text-align: center; margin-bottom: 14px; }
    .footer-link { font-size: 12px; color: #2ec4b6; margin: 0 10px; }
    .footer-text { font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.7; }
    .footer-brand { font-size: 13px; font-weight: 800; color: #0a192f; text-align: center; margin-bottom: 8px; letter-spacing: -0.3px; }
    .footer-brand span { color: #2ec4b6; }
    .footer-tagline { font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
    .footer-divider { height: 1px; background: #e2e8f0; margin: 16px 0; }

    /* Social row */
    .social-row { text-align: center; margin-bottom: 16px; }
    .social-pill { display: inline-block; background: #0a192f; color: #ffffff !important; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin: 0 4px; letter-spacing: 0.3px; }

    /* Progress bar */
    .progress-bg { background: #e2e8f0; border-radius: 99px; height: 8px; overflow: hidden; margin: 6px 0; }
    .progress-fill { background: #2ec4b6; height: 100%; border-radius: 99px; }

    /* Badge */
    .badge-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
    .badge-icon { font-size: 28px; width: 44px; text-align: center; flex-shrink: 0; }
    .badge-name { font-size: 14px; font-weight: 700; color: #0a192f; }
    .badge-desc { font-size: 12px; color: #94a3b8; margin-top: 2px; }

    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-bg { padding: 16px 8px !important; }
      .card { border-radius: 16px !important; }
      .header-inner { padding: 18px 24px !important; }
      .hero { padding: 32px 24px 28px !important; }
      .hero-title { font-size: 22px !important; }
      .body { padding: 28px 24px !important; }
      .footer { padding: 24px !important; }
      .btn { display: block !important; text-align: center !important; padding: 16px 24px !important; }
      .stat-cell { display: block !important; width: 100% !important; margin-bottom: 8px !important; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;color:transparent;font-size:1px;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
  <div class="email-bg">
    <div class="card">

      <!-- HEADER -->
      <div class="header">
        <div class="header-inner">
          <div class="logo-wordmark">Wikrena<span class="logo-dot">.</span></div>
          <div class="header-tag">Academy</div>
        </div>
        <div class="header-accent"></div>
      </div>

      ${content}

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-brand">Wikrena<span>.</span>Academy</div>
        <div class="footer-tagline">Africa's Data &amp; AI Learning Platform</div>
        <div class="social-row">
          <a href="https://twitter.com/wikrena" class="social-pill">Twitter</a>
          <a href="https://linkedin.com/company/wikrena" class="social-pill">LinkedIn</a>
          <a href="https://instagram.com/wikrena" class="social-pill">Instagram</a>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-links">
          <a href="https://wikrena.com" class="footer-link">Website</a>
          <a href="https://academy.wikrena.com/privacy" class="footer-link">Privacy Policy</a>
          <a href="https://academy.wikrena.com/unsubscribe" class="footer-link">Unsubscribe</a>
        </div>
        <div class="footer-text">
          © ${new Date().getFullYear()} Wikrena Academy Ltd · Building Africa's next generation of data professionals.<br/>
          You're receiving this email because you signed up at academy.wikrena.com
        </div>
      </div>

    </div>
  </div>
</body>
</html>`
}


// ── Individual email templates ─────────────────────────────────────────────────

export function welcomeStudentEmail(name: string, loginUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">🚀</span>
      <div class="hero-title">Welcome to Wikrena Academy</div>
      <div class="hero-subtitle">Africa's home for data and AI education. Your journey starts now.</div>
    </div>
    <div class="body">
      <p class="greeting">Hey ${name}! 👋</p>
      <p class="text">You've just joined thousands of Africans building careers in data and AI. Whether you want to land a job at Flutterwave, MTN, or a global company — you're in the right place.</p>
      <p class="text">Here's what to do next:</p>
      <div class="info-box">
        <div class="info-box-title">✅ Your account is ready</div>
        <div class="info-box-text">Complete your onboarding to get a personalised learning path, then dive into your first lesson.</div>
      </div>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${loginUrl}" class="btn">Start Learning →</a>
      </div>
      <div class="divider"></div>
      <p class="text" style="font-size:13px;">Questions? Reply to this email or visit our community forum. We read every message.</p>
    </div>
  `, `Welcome to Wikrena Academy, ${name}!`)
}

export function passwordResetEmail(name: string, resetUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">🔐</span>
      <div class="hero-title">Reset Your Password</div>
      <div class="hero-subtitle">We received a request to reset your Wikrena password.</div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${name},</p>
      <p class="text">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${resetUrl}" class="btn">Reset My Password</a>
      </div>
      <div class="warning-box">
        <p style="font-size:13px; color:#92400e;"><strong>Didn't request this?</strong> You can safely ignore this email. Your password won't change until you click the link above.</p>
      </div>
      <p class="text" style="font-size:13px;">For security, this link can only be used once and expires in 1 hour.</p>
    </div>
  `, "Reset your Wikrena Academy password")
}

export function emailVerificationEmail(name: string, verifyUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">📬</span>
      <div class="hero-title">Confirm Your Email</div>
      <div class="hero-subtitle">One click and you're in.</div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${name}!</p>
      <p class="text">Thanks for signing up for Wikrena Academy. Click the button below to confirm your email address and activate your account.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${verifyUrl}" class="btn">Confirm Email Address</a>
      </div>
      <p class="text" style="font-size:13px;">This link expires in 24 hours. If you didn't create a Wikrena account, you can safely ignore this email.</p>
    </div>
  `, "Confirm your Wikrena Academy email address")
}

export function instructorInviteEmail(name: string, inviterName: string, role: string, acceptUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">🎓</span>
      <div class="hero-title">You're Invited to Teach on Wikrena</div>
      <div class="hero-subtitle">${inviterName} has invited you to join as a ${role}.</div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${name}!</p>
      <p class="text">You've been invited to become a <strong>${role}</strong> on Wikrena Academy — Africa's leading data and AI learning platform. You'll be creating courses that help thousands of Africans build real careers.</p>
      <div class="info-box">
        <div class="info-box-title">What you can do as an instructor</div>
        <div class="info-box-text">
          ✦ Create and edit courses assigned to you<br/>
          ✦ Add chapters, lessons, exercises and quizzes<br/>
          ✦ Submit courses for review and publication<br/>
          ✦ See how many students are learning from your content
        </div>
      </div>
      <p class="text">Click below to accept your invitation and set your password. This link expires in <strong>7 days</strong>.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${acceptUrl}" class="btn">Accept Invitation →</a>
      </div>
    </div>
  `, `You're invited to teach on Wikrena Academy`)
}

export function courseSubmittedEmail(adminName: string, courseName: string, instructorName: string, reviewUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">📝</span>
      <div class="hero-title">Course Ready for Review</div>
      <div class="hero-subtitle">${instructorName} has submitted a course for publication.</div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${adminName},</p>
      <p class="text"><strong>${instructorName}</strong> has finished building <strong>"${courseName}"</strong> and submitted it for your review.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${reviewUrl}" class="btn">Review Course →</a>
      </div>
      <p class="text" style="font-size:13px;">You can approve it for publication, request changes, or reject it from the admin dashboard.</p>
    </div>
  `, `${courseName} is ready for review`)
}

export function coursePublishedEmail(instructorName: string, courseName: string, courseUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">🎉</span>
      <div class="hero-title">Your Course is Live!</div>
      <div class="hero-subtitle">"${courseName}" is now available to students.</div>
    </div>
    <div class="body">
      <p class="greeting">Congratulations, ${instructorName}!</p>
      <p class="text">Your course <strong>"${courseName}"</strong> has been reviewed and approved. It's now live on Wikrena Academy and students can start enrolling.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${courseUrl}" class="btn">View Your Course →</a>
      </div>
      <p class="text">You'll receive a notification whenever a student enrolls. Thank you for contributing to African data education.</p>
    </div>
  `, `Your course "${courseName}" is now live!`)
}

export function newEnrollmentInstructorEmail(instructorName: string, studentName: string, courseName: string, dashUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">👋</span>
      <div class="hero-title">New Student Enrolled</div>
      <div class="hero-subtitle">Someone just joined your course.</div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${instructorName},</p>
      <p class="text"><strong>${studentName}</strong> just enrolled in <strong>"${courseName}"</strong>. </p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${dashUrl}" class="btn">View Course Dashboard →</a>
      </div>
    </div>
  `, `New enrollment in ${courseName}`)
}

export function newEnrollmentStudentEmail(studentName: string, courseName: string, courseUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">📚</span>
      <div class="hero-title">You're Enrolled!</div>
      <div class="hero-subtitle">Time to start learning.</div>
    </div>
    <div class="body">
      <p class="greeting">Hey ${studentName}!</p>
      <p class="text">You're now enrolled in <strong>"${courseName}"</strong>. Everything is ready for you — just click below to start your first lesson.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${courseUrl}" class="btn">Start First Lesson →</a>
      </div>
      <div class="info-box">
        <div class="info-box-title">💡 Pro tip</div>
        <div class="info-box-text">Students who complete at least one lesson on their first day are 3× more likely to finish the course. Start today!</div>
      </div>
    </div>
  `, `You're enrolled in ${courseName}`)
}


export function badgeEarnedEmail(name: string, badgeName: string, badgeIcon: string, badgeDesc: string, profileUrl: string): string {
  return layout(`
    <div class="hero">
      <span class="hero-emoji">${badgeIcon}</span>
      <div class="hero-title">You Earned a Badge!</div>
      <div class="hero-subtitle">Your hard work is paying off.</div>
    </div>
    <div class="body">
      <p class="greeting">🎉 Congratulations, ${name}!</p>
      <p class="text">You just earned the <strong>${badgeName}</strong> badge!</p>
      <div class="info-box">
        <div class="info-box-title">${badgeIcon} ${badgeName}</div>
        <div class="info-box-text">${badgeDesc}</div>
      </div>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${profileUrl}" class="btn">View Your Profile →</a>
      </div>
    </div>
  `, `You earned the ${badgeName} badge!`)
}

export function streakReminderEmail(name: string, streak: number, loginUrl: string): string {
  return layout(`
    <div class="hero" style="background: linear-gradient(135deg, #ff6b3d 0%, #d4450f 100%);">
      <span class="hero-emoji">🔥</span>
      <div class="hero-title">Don't Break Your ${streak}-Day Streak!</div>
      <div class="hero-subtitle">You're on a roll — come back today.</div>
    </div>
    <div class="body">
      <p class="greeting">Hey ${name},</p>
      <p class="text">You've been on a <strong>${streak}-day learning streak</strong> — that puts you in the top learners on Wikrena! Don't let it slip away.</p>
      <p class="text">It only takes 5 minutes to complete a lesson and keep your streak alive.</p>
      <div style="text-align:center; margin: 28px 0;">
        <a href="${loginUrl}" class="btn btn-coral">Continue Learning →</a>
      </div>
    </div>
  `, `Your ${streak}-day streak is at risk!`)
}

// ── Verification emails — one per role ────────────────────────────────────────

export function verificationStudentEmail(name: string, verifyUrl: string): string {
  return layout(`
    <div class="hero">
      <div class="hero-icon">🎓</div>
      <div class="hero-title">Confirm your email address</div>
      <div class="hero-subtitle">One click and your data &amp; AI career journey begins across Africa.</div>
      <div class="hero-bottom-bar"></div>
    </div>
    <div class="body">
      <p class="greeting">Hi ${name},</p>
      <p class="text">
        Welcome to Wikrena Academy — Africa's leading Data &amp; AI learning platform.
        You're joining thousands of African professionals building real, job-ready skills
        with datasets from companies like MTN, Flutterwave, Paystack and more.
      </p>
      <p class="text">Click the button below to confirm your email and get started:</p>
      <div class="btn-wrap">
        <a href="${verifyUrl}" class="btn">Confirm My Email →</a>
      </div>
      <div class="info-box">
        <div class="info-box-title">What happens next?</div>
        <div class="info-item"><span class="info-check">✓</span> Choose your learning track — Python, SQL, AI or Excel</div>
        <div class="info-item"><span class="info-check">✓</span> Complete your first mission and earn your first 50 XP</div>
        <div class="info-item"><span class="info-check">✓</span> Build a portfolio employers across Africa can see</div>
      </div>
      <div class="safe-link">
        If the button above doesn't work, paste this link into your browser:<br/>
        <a href="${verifyUrl}">${verifyUrl}</a><br/><br/>
        This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
      </div>
    </div>
  `, "Confirm your Wikrena Academy email, ${name}")
}

