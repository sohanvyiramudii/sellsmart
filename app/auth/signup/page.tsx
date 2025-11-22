"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) setMsg(error.message);
    else setMsg("Signup successful! Check your email.");
  }

  return (
    <div className="center-box">
      <form onSubmit={handle} className="card-box">
        <h2 className="title">Create Account</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button className="btn-primary">Sign Up</button>

        {msg && <p className="info">{msg}</p>}

        <p className="note">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
