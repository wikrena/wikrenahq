import { redirect } from "next/navigation"

// The parent-specific dashboard will be implemented as part of the
// upcoming parent monitoring feature. For now, redirect to the main dashboard.
export default function ParentDashboardPage() {
  redirect("/dashboard")
}
