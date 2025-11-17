import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function StorePage({ params }) {
  const slug = params.slug.replace(/^@/, "");

  // Server-side Supabase client
  const supabase = createServerComponentClient({ cookies });

  // Fetch creator
  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select("*")
    .eq("store_slug", slug)
    .eq("is_active", true)
    .single();

  if (creatorError || !creator) {
    return <div style={{ padding: 40 }}>Store not found or not approved.</div>;
  }

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", creator.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {/* Banner */}
      {creator.banner_url && (
        <img
          src={creator.banner_url}
          style={{
            width: "100%",
            height: 260,
            objectFit: "cover",
            borderRadius: 12,
          }}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {creator.image_url ? (
          <img
            src={creator.image_url}
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#EEE",
            }}
          />
        )}

        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>{creator.name}</h1>
          <div style={{ color: "#666" }}>📍 {creator.location}</div>
          <p style={{ marginTop: 8 }}>{creator.bio}</p>
        </div>
      </div>

      {/* Products */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {(products || []).map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              padding: 12,
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {p.image_url && (
              <img
                src={p.image_url}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <h3 style={{ marginTop: 8, fontWeight: 700 }}>{p.name}</h3>
            <div style={{ color: "#7A55E2", fontWeight: 800 }}>₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
