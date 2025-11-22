import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAuth = createClient(URL, ANON);
    const supabaseService = createClient(URL, SERVICE);

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return NextResponse.json({ error: "Not admin" }, { status: 403 });

    const body = await req.json();
    const id = body.id;

    const { error } = await supabaseService
      .from("creators")
      .update({ is_active: true })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
