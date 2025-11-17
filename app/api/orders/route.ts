import { routeSupabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const r = routeSupabase();
  const { data: { user } } = await r.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { creatorId, items } = body;

  const total = items.reduce((t: number, item: any) => t + (item.price || 0), 0);

  const { data, error } = await r
    .from("orders")
    .insert({
      creator_id: creatorId,
      user_id: user.id,
      items,
      total
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ success: true, order: data });
}
