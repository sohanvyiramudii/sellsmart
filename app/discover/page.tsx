import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DiscoverPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: stores } = await supabase
    .from("creators")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Discover Stores</h1>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        }}
      >
        {stores?.map((s) => (
          <Link
            key={s.id}
            className="card"
            style={{ padding: 16 }}
            href={`/store/${s.store_slug}`}
          >
            <h3>{s.name}</h3>
            <p>@{s.store_slug}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
