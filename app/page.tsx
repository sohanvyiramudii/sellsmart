
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: creators } = await supabase
    .from('creators')
    .select('*')
    .eq('is_active', true)
    .limit(6);

  return (
    <div>
      <section className="card" style={{ padding:24 }}>
        <h1 style={{ fontSize:32, fontWeight:800 }}>
          Give your business a beautiful online store in minutes.
        </h1>
        <p>Show menu, accept orders, go digital instantly.</p>

        <div style={{ marginTop:16 }}>
          <Link href="/auth/login" className="btn btn-primary">Get Started</Link>
          <Link href="/discover" className="btn" style={{ marginLeft:8 }}>Discover</Link>
        </div>
      </section>

      <section style={{ marginTop:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700 }}>Featured Stores</h2>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
          gap:12,
          marginTop:12
        }}>
          {(creators ?? []).map(c => (
            <Link key={c.id} href={'/@' + c.store_slug} className="card" style={{ padding:12 }}>
              <div style={{ fontWeight:700 }}>{c.name}</div>
              <div style={{ color:'#666', fontSize:12 }}>{c.location}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
