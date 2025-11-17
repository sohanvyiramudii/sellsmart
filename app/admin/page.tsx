
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage(){
  const [allowed,setAllowed]=useState(false);
  const [pending,setPending]=useState([]);
  const [stats,setStats]=useState({ total:0, active:0 });

  useEffect(()=>{
    (async ()=>{
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user) { location.href='/auth/login'; return; }
      if(user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL){ location.href='/'; return; }
      setAllowed(true);

      const { data: all } = await supabase.from('creators').select('id,is_active');
      const arr = all || [];
      setStats({ total: arr.length, active: arr.filter(x=>x.is_active).length });

      const { data: p } = await supabase.from('creators').select('*').eq('is_active', false).order('created_at',{ascending:false});
      setPending(p || []);
    })();
  },[]);

  async function approve(id){
    const res = await fetch('/api/admin/approve', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ id }) });
    if(!res.ok) return alert('Error approving');
    setPending(pending.filter(x=>x.id!==id));
    alert('Approved');
  }

  async function suspend(id){
    const res = await fetch('/api/admin/suspend', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ id }) });
    if(!res.ok) return alert('Error suspending');
    alert('Suspended');
  }

  if(!allowed) return <div style={{padding:40}}>Checking admin...</div>;

  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800}}>Admin Dashboard</h1>
      <div style={{marginTop:8}}>Total creators: <b>{stats.total}</b> • Active: <b>{stats.active}</b> • Pending: <b>{pending.length}</b></div>
      <div style={{marginTop:12,display:'grid',gap:12}}>
        {pending.map(c=>(
          <div key={c.id} className="card" style={{padding:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:700}}>{c.name}</div>
              <div style={{color:'#666'}}>{c.store_slug} • {c.location}</div>
              <div style={{fontSize:12,color:'#888',marginTop:6}}>WhatsApp: {c.whatsapp||'—'}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>approve(c.id)} className="btn btn-primary">Approve</button>
              <button onClick={()=>suspend(c.id)} className="btn">Suspend</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
