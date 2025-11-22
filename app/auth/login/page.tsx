"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setErr(error.message);
    else window.location.href = "/dashboard";
  }

  return (
    <div className="center-box">
      <form onSubmit={handle} className="card-box">
        <h2 className="title">SellSmart Login</h2>

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

        <button className="btn-primary">Login</button>

        {err && <p className="error">{err}</p>}

        <p className="note">
          Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
