"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (!data.user) return;

      const { data: c } = await supabase
        .from("creators")
        .select("*")
        .eq("owner_id", data.user.id)
        .limit(1);

      setCreator(c?.[0]);
    });
  }, []);

  if (!user)
    return (
      <div>
        Please <Link href="/auth/login">login</Link>
      </div>
    );

  if (!creator) return <div>Loading…</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {creator.name}</p>
      <p><strong>Store:</strong> @{creator.store_slug}</p>
      <p><strong>Status:</strong> {creator.is_active ? "Active" : "Pending"}</p>
    </div>
  );
}
