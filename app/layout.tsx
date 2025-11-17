
import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Logo from '../components/Logo';

export const metadata = {
  title: 'SellSmart',
  description: 'Hyper-local marketplace'
};

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <header style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
          <div className="container" style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0' }}>
            <Link href="/"><Logo /></Link>

            <nav style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <Link href="/discover" className="btn">Discover</Link>
              <Link href="/scan" className="btn">Scan</Link>

              {user ? (
                <>
                  <Link href="/dashboard" className="btn">Dashboard</Link>
                  <form action="/auth/signout" method="post">
                    <button className="btn btn-primary">Logout</button>
                  </form>
                </>
              ) : (
                <Link href="/auth/login" className="btn btn-primary">Login</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="container" style={{ paddingTop:24 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
