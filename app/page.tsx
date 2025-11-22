import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: stores } = await supabase
    .from("creators")
    .select("*")
    .eq("is_active", true)
    .limit(20);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Featured Stores</h1>

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {stores?.map((s) => (
          <Link
            key={s.id}
            href={`/store/${s.store_slug}`}
            className="card"
            style={{
              padding: 16,
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <h3 style={{ margin: 0 }}>{s.name}</h3>
            <div style={{ color: "#7A55E2" }}>@{s.store_slug}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
