
import { routeSupabase } from '@/lib/supabaseServer';

export async function POST(req) {
  const r = routeSupabase();
  const { data: { user } } = await r.auth.getUser();
  const body = await req.json();

  const { data, error } = await r
    .from('orders')
    .insert(body)
    .select()
    .single();

  if (error)
    return new Response(JSON.stringify({ error:error.message }), { status:400 });

  return new Response(JSON.stringify({ ok:true, order:data }));
}
