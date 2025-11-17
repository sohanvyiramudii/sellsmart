"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("creators")
        .select("*")
        .eq("is_active", false)
        .order("created_at", { ascending: false });

      setPending(p || []);
    })();
  }, []);

  async function approve(id: string) {
    await supabase.from("creators").update({ is_active: true }).eq("id", id);
    setPending((prev) => prev.filter((x) => x.id !== id));
    alert("Approved ✔");
  }

  async function remove(id: string) {
    await supabase.from("creators").delete().eq("id", id);
    setPending((prev) => prev.filter((x) => x.id !== id));
    alert("Removed");
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800 }}>Admin Panel</h1>
      <p>Pending Creator Approvals</p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {pending.map((c) => (
          <div key={c.id} className="card" style={{ padding: 16 }}>
            <h2 style={{ fontWeight: 700 }}>{c.name}</h2>
            <div>Slug: @{c.store_slug}</div>
            <div>Location: {c.location}</div>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => approve(c.id)}>
                Approve
              </button>
              <button className="btn" onClick={() => remove(c.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <p style={{ opacity: 0.6 }}>No pending creators.</p>
        )}
      </div>
    </div>
  );
}
