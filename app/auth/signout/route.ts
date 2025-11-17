import { NextResponse } from "next/server";
import { routeSupabase } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = routeSupabase();

  // Sign out safely
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Signout Error:", e);
  }

  return NextResponse.redirect("http://localhost:3000");
}
