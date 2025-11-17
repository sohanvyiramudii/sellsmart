import { routeSupabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = routeSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"));
}
