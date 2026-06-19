import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: "Payments not configured. Add PAYSTACK_SECRET_KEY to .env." }, { status: 503 })
    }
  
    const { planId, pathId } = await req.json()
    if (!planId) return NextResponse.json({ error: "Missing planId" }, { status: 400 })
  
    const admin = getAdminClient()
  
    const { data: profile } = await admin
      .from("profiles")
      .select("name, email")
      .eq("id", user.id)
      .single()
  
    const { data: plan } = await admin
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single()
  
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    if (plan.price === 0) return NextResponse.json({ error: "Free plan does not need checkout" }, { status: 400 })
  
    const reference = `wk_${user.id.slice(0, 8)}_${Date.now()}`
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  
    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        email:        user.email,
        amount:       Math.round(plan.price * 100), // kobo
        currency:     "NGN",
        reference,
        metadata: {
          user_id:  user.id,
          plan_id:  planId,
          path_id:  pathId ?? null,
          custom_fields: [
            { display_name: "Student Name", variable_name: "name", value: profile?.name ?? user.email },
            { display_name: "Plan",         variable_name: "plan", value: plan.name },
          ],
        },
        callback_url: `${appUrl}/api/payments/callback`,
      }),
    })
  
    const paystackData = await paystackRes.json()
  
    if (!paystackData.status) {
      console.error("[checkout] Paystack error:", paystackData.message)
      return NextResponse.json({ error: paystackData.message ?? "Payment initialisation failed" }, { status: 500 })
    }
  
    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference:         paystackData.data.reference,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Unexpected error" }, { status: 500 })
  }
}