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

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Signup successful! Please check your email.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "80vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handle}
        style={{
          width: 360,
          padding: 20,
          background: "#fff",
          borderRadius: 12,
        }}
      >
        <h2 style={{ color: "#7A55E2", marginBottom: 12 }}>
          Create Your SellSmart Account
        </h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <button
          type="submit"
          style={{
            background: "#7A55E2",
            color: "#fff",
            padding: 10,
            width: "100%",
            marginTop: 8,
            borderRadius: 6,
          }}
        >
          Sign Up
        </button>

        {msg && (
          <div style={{ color: "green", marginTop: 8 }}>
            {msg}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          Already have an account?{" "}
          <Link href="/auth/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
