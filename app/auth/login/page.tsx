
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  async function handle(e){
    e.preventDefault();
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) setErr(error.message);
    else window.location.href='/dashboard';
  }

  return (
    <div style={{display:'flex',minHeight:'80vh',alignItems:'center',justifyContent:'center'}}>
      <form onSubmit={handle} style={{width:360,padding:20,background:'#fff',borderRadius:12}}>
        <h2 style={{color:'#7A55E2',marginBottom:12}}>SellSmart Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%',padding:8,marginBottom:8}}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{width:'100%',padding:8,marginBottom:8}}/>

        <button style={{background:'#7A55E2',color:'#fff',padding:10,width:'100%',marginTop:8}}>
          Login
        </button>

        {err && <div style={{color:'red',marginTop:8}}>{err}</div>}

        <div style={{marginTop:12}}>
          Don't have an account? <Link href='/auth/signup'>Sign up</Link>
        </div>
      </form>
    </div>
  );
}
