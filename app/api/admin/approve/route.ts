
import { routeSupabase } from '@/lib/supabaseServer';
import { supabaseService } from '@/lib/supabaseService';

export async function POST(req: Request) {
  const r = routeSupabase();
  const { data: { user } } = await r.auth.getUser();
  if(!user) return new Response(JSON.stringify({ error:'Not logged in' }), { status:401 });
  if(user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return new Response(JSON.stringify({ error:'Not admin' }), { status:403 });

  const body = await req.json();
  const id = body.id;
  const { error } = await supabaseService.from('creators').update({ is_active: true }).eq('id', id);
  if(error) return new Response(JSON.stringify({ error: error.message }), { status:400 });
  return new Response(JSON.stringify({ ok:true }));
}
