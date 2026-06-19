import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { PricingPage } from "@/components/marketing/pricing";

export const metadata: Metadata = { title: "Pricing — Wikrena Academy" };

export default async function Pricing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Use admin to read plans — bypasses RLS, always works
  const admin = getAdminClient();
  const { data: plans } = await admin
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("price");

  return (
    <>
      <MarketingNav />
      <PricingPage plans={plans ?? []} userId={user?.id} />
      <MarketingFooter />
    </>
  );
}
