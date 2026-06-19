export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-sm text-neutral-400 font-code">Loading dashboard...</p>
      </div>
    </div>
  )
}
