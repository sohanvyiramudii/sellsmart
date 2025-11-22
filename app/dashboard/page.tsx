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
    upi_id: "",
    image_url: "",
    banner_url: "",
    bio: "",
  });

  const [p, setP] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
  });

  // ───────────────────────────────────────────────
  // LOAD USER + CREATOR + PRODUCTS
  // ───────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();

      setUser(data.user);

      if (!data.user) return;

      // Load creator profile
      const { data: c } = await supabase
        .from("creators")
        .select("*")
        .eq("owner_id", data.user.id)
        .limit(1);

      let creatorProfile = c?.[0];

      // If creator doesn't exist → create it
      if (!creatorProfile) {
        await supabase.from("creators").insert({
          name: "My Store",
          store_slug: "store-" + Date.now(),
          owner_id: data.user.id,
          is_active: false,
        });

        const { data: c2 } = await supabase
          .from("creators")
          .select("*")
          .eq("owner_id", data.user.id)
          .limit(1);

        creatorProfile = c2?.[0];
      }

      setCreator(creatorProfile);
      setForm((prev) => ({ ...prev, ...creatorProfile }));

      // Load products
      const { data: ps } = await supabase
        .from("products")
        .select("*")
        .eq("creator_id", creatorProfile.id)
        .order("created_at", { ascending: false });

      setProducts(ps || []);
    }

    loadData();
  }, []);

  // ───────────────────────────────────────────────
  // SAVE STORE SETTINGS
  // ───────────────────────────────────────────────
  async function saveStore() {
    if (!creator) return;

    const { error } = await supabase
      .from("creators")
      .update(form)
      .eq("id", creator.id);

    if (error) return alert(error.message);
    alert("Saved ✓");
  }

  // ───────────────────────────────────────────────
  // FILE UPLOAD HELPER
  // ───────────────────────────────────────────────
  async function uploadFile(file: File, bucket: string, field: string) {
    const path = `${creator.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) return alert(uploadError.message);

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    setForm((prev) => ({ ...prev, [field]: data.publicUrl }));
  }

  // ───────────────────────────────────────────────
  // ADD PRODUCT
  // ───────────────────────────────────────────────
  async function addProduct() {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;

    if (!user_id) return alert("User not logged in!");

    const payload = {
      name: p.name,
      price: Number(p.price) || 0,
      category: p.category,
      image_url: p.image_url,
      creator_id: creator.id,
      user_id: user_id,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) return alert(error.message);

    setProducts((prev) => [data, ...prev]);
    setP({ name: "", price: "", category: "", image_url: "" });

    alert("Product Added ✓");
  }

  // ───────────────────────────────────────────────
  // DELETE PRODUCT
  // ───────────────────────────────────────────────
  async function delProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }

  if (!user)
    return (
      <div>
        Please <a href="/auth/login">login</a>
      </div>
    );

  // ───────────────────────────────────────────────
  // UI RENDER
  // ───────────────────────────────────────────────
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* STORE SETTINGS */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Store Settings</h2>
            <small>{creator?.is_active ? "Active ✓" : "Pending approval"}</small>
          </div>

          <a href={"/@" + creator?.store_slug} target="_blank" className="btn">
            View Store →
          </a>
        </div>

        {/* FORM */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: 8 }}
          />
          <input
            placeholder="Store Slug"
            value={form.store_slug}
            onChange={(e) => setForm({ ...form, store_slug: e.target.value })}
            style={{ padding: 8 }}
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={{ padding: 8 }}
          />
          <input
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            style={{ padding: 8 }}
          />

          <textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            style={{ padding: 8, gridColumn: "1 / -1" }}
          />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          {/* Profile */}
          <div>
            <label>Profile Image</label>
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, "store-profile", "image_url");
              }}
            />
          </div>

          {/* Banner */}
          <div>
            <label>Banner Image</label>
            <input
              type="file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, "store-banner", "banner_url");
              }}
            />
          </div>
        </div>

        <button
          onClick={saveStore}
          className="btn btn-primary"
          style={{ marginTop: 12 }}
        >
          Save Store
        </button>
      </div>

      {/* PRODUCTS SECTION */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontWeight: 800 }}>Products</h2>
          <a
            className="btn"
            href={"/api/qr-card/" + creator?.store_slug}
            target="_blank"
          >
            QR Poster (PDF)
          </a>
        </div>

        {/* PRODUCT FORM */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 12,
          }}
        >
          <input
            placeholder="Product name"
            value={p.name}
            onChange={(e) => setP({ ...p, name: e.target.value })}
            style={{ padding: 8 }}
          />

          <input
            placeholder="Price"
            value={p.price}
            onChange={(e) => setP({ ...p, price: e.target.value })}
            style={{ padding: 8 }}
          />

          <input
            placeholder="Category"
            value={p.category}
            onChange={(e) => setP({ ...p, category: e.target.value })}
            style={{ padding: 8 }}
          />

          <input
            type="file"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;

              const path = `${creator.id}/${Date.now()}_${f.name}`;

              const { error } = await supabase.storage
                .from("product-images")
                .upload(path, f);

              if (error) return alert(error.message);

              const { data } = supabase.storage
                .from("product-images")
                .getPublicUrl(path);

              setP({ ...p, image_url: data.publicUrl });
            }}
          />
        </div>

        <button
          onClick={addProduct}
          className="btn btn-primary"
          style={{ marginTop: 12 }}
        >
          Add Product
        </button>

        {/* PRODUCT LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {products.map((pr) => (
            <div key={pr.id} className="card" style={{ padding: 12 }}>
              {pr.image_url && (
                <img
                  src={pr.image_url}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}

              <div style={{ fontWeight: 700, marginTop: 8 }}>{pr.name}</div>
              <div style={{ color: "#7A55E2" }}>₹{pr.price}</div>

              <button
                onClick={() => delProduct(pr.id)}
                className="btn"
                style={{ marginTop: 8 }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
