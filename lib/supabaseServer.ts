
import { cookies } from 'next/headers';
import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export function serverComponentSupabase() {
  return createServerComponentClient({ cookies });
}

export function routeSupabase() {
  return createRouteHandlerClient({ cookies });
}
