import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(URL, SERVICE);
  const body = await req.json();

  const { error } = await supabase
    .from("creators")
    .update({ is_active: false })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
