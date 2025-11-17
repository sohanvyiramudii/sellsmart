
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function StoreProfilePage(){
  const [user,setUser]=useState(null);
  const [creator,setCreator]=useState(null);

  useEffect(()=>{ supabase.auth.getUser().then(async ({ data })=>{ setUser(data.user); if(!data.user) return; const { data: c } = await supabase.from('creators').select('*').eq('owner_id', data.user.id).limit(1); setCreator(c?.[0]); }); },[]);

  if(!user) return <div>Please <Link href="/auth/login">login</Link></div>;
  if(!creator) return <div>Loading…</div>;

  const storeLink = typeof window !== 'undefined' ? `${window.location.origin}/@${creator.store_slug}` : `/@${creator.store_slug}`;

  return (
    <div style={{maxWidth:800,margin:'0 auto'}}>
      <div className="card" style={{padding:16}}>
        <h2 style={{fontSize:20,fontWeight:800}}>Store Profile</h2>
        <div style={{display:'flex',gap:12,marginTop:12}}>
          {creator.image_url ? <img src={creator.image_url} style={{width:80,height:80,borderRadius:999}}/> : <div style={{width:80,height:80,borderRadius:999,background:'#EEE'}}/>}
          <div>
            <div style={{fontWeight:800}}>{creator.name}</div>
            <div style={{fontSize:12,color:'#666'}}>{creator.location}</div>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div><b>Store Link:</b> <span style={{color:'#7A55E2'}}>{storeLink}</span></div>
          <div><b>WhatsApp:</b> {creator.whatsapp||'Not set'}</div>
          <div><b>UPI ID:</b> {creator.upi_id||'Not set'}</div>
          <div><b>Status:</b> {creator.is_active ? '✅ Approved' : '⏳ Pending Approval'}</div>
        </div>

        <div style={{marginTop:12,display:'flex',gap:8}}>
          <Link href='/dashboard' className='btn btn-primary'>Edit Store</Link>
          <a href={storeLink} className='btn' target='_blank' rel='noreferrer'>View Store</a>
          <button className='btn' onClick={()=>navigator.clipboard.writeText(storeLink)}>Copy Link</button>
        </div>
      </div>
    </div>
  );
}
