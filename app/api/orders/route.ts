import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(URL, ANON);
  const body = await req.json();

  const { data, error } = await supabase
    .from("orders")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}
