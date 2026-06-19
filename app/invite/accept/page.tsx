import { InviteAcceptForm } from "@/components/auth/invite-accept-form"

export default function AcceptInvitePage({ searchParams }: { searchParams: { token?: string } }) {
  if (!searchParams.token) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-3">❌</div>
          <h1 className="font-display font-bold text-xl text-navy-800 mb-2">Invalid Invitation</h1>
          <p className="text-neutral-500 text-sm">This invitation link is missing or invalid.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-4">
      <InviteAcceptForm token={searchParams.token} />
    </div>
  )
}
