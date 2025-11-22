"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    store_slug: "",
    location: "",
    whatsapp: "",
    bio: "",
    image_url: "",
    banner_url: "",
  });

  const [p, setP] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (!data.user) return;

      const { data: cr } = await supabase
        .from("creators")
        .select("*")
        .eq("owner_id", data.user.id)
        .limit(1);

      let creatorData = cr?.[0];

      if (!creatorData) {
        await supabase.from("creators").insert({
          name: "My Store",
          store_slug: "store-" + Date.now(),
          owner_id: data.user.id,
          is_active: false,
        });

        const { data: cr2 } = await supabase
          .from("creators")
          .select("*")
          .eq("owner_id", data.user.id)
          .limit(1);

        creatorData = cr2?.[0];
      }

      setCreator(creatorData);
      setForm({ ...form, ...creatorData });

      const { data: ps } = await supabase
        .from("products")
        .select("*")
        .eq("creator_id", creatorData.id)
        .order("created_at", { ascending: false });

      setProducts(ps || []);
    });
  }, []);

  async function saveStore() {
    await supabase.from("creators").update(form).eq("id", creator.id);
    alert("Saved");
  }

  async function addProduct() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return alert("Not logged in");

    const payload = {
      name: p.name,
      price: Number(p.price),
      category: p.category,
      image_url: p.image_url,
      creator_id: creator.id,
      user_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) return alert(error.message);

    setProducts([data, ...products]);
    setP({ name: "", price: "", category: "", image_url: "" });
  }

  async function delProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((x) => x.id !== id));
  }

  if (!user) return <div>Please login</div>;
  if (!creator) return <div>Loading…</div>;

  return (
    <div>
      <h2>Store Settings</h2>

      <button className="btn" onClick={saveStore}>
        Save Settings
      </button>

      <h2 style={{ marginTop: 40 }}>Your Products</h2>

      <button className="btn-primary" onClick={addProduct}>
        Add Product
      </button>

      <div style={{ marginTop: 20 }}>
        {products.map((pr) => (
          <div key={pr.id} className="card">
            <strong>{pr.name}</strong>
            <p>₹{pr.price}</p>
            <button onClick={() => delProduct(pr.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
