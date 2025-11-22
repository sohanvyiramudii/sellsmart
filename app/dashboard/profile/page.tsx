"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// Define TypeScript types
type Creator = {
  id: string;
  name: string;
  store_slug: string;
  owner_id: string;
  is_active: boolean;
  [key: string]: any;
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<Creator | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (!data.user) return;

      const { data: c } = await supabase
        .from("creators")
        .select("*")
        .eq("owner_id", data.user.id)
        .limit(1);

      setCreator(c ? c[0] : null);
    });
  }, []);

  if (!user)
    return (
      <div>
        Please{" "}
        <Link href="/auth/login">
          login
        </Link>
      </div>
    );

  if (!creator) return <div>Loading…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Profile</h1>

      <div style={{ marginTop: 20 }}>
        <strong>Name:</strong> {creator.name}
      </div>

      <div>
        <strong>Store Slug:</strong> @{creator.store_slug}
      </div>

      <div>
        <strong>Status:</strong>{" "}
        {creator.is_active ? "Active" : "Pending Approval"}
      </div>
    </div>
  );
}
