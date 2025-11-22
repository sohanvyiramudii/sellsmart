import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const slug = params.slug.replace(/^@/, "");

  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .eq("store_slug", slug)
    .limit(1);

  const creator = creators?.[0];

  if (!creator) {
    return <div>Store not found</div>;
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", creator.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>@{creator.store_slug}</h1>
      <p>{creator.bio || "No description provided."}</p>

      <h2 style={{ marginTop: 20 }}>Products</h2>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
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
            <p style={{ fontWeight: "bold", color: "#7A55E2" }}>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
