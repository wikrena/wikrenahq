import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get("reference")
    const trxref    = searchParams.get("trxref")
  
    if (reference || trxref) {
      return NextResponse.redirect(new URL("/dashboard?payment=success", req.url))
    }
    return NextResponse.redirect(new URL("/pricing?payment=cancelled", req.url))
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Unexpected error" }, { status: 500 })
  }
}