import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug.replace(/^@/, "");

  const supabase = createServerComponentClient({ cookies });

  // Load creator
  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .eq("store_slug", slug)
    .limit(1);

  const creator = creators?.[0];

  if (!creator) return <div>Store not found</div>;

  // Load products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", creator.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>@{creator.store_slug}</h1>
      <p>{creator.bio || "No description available."}</p>

      <h2 style={{ marginTop: 24 }}>Products</h2>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          marginTop: 12,
        }}
      >
        {products?.map((p) => (
          <div key={p.id} className="card" style={{ padding: 12 }}>
            {p.image_url && (
              <img
                src={p.image_url}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <h3>{p.name}</h3>
            <div style={{ color: "#7A55E2", fontWeight: 700 }}>
              ₹{p.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
