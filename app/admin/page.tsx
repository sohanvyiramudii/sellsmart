import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: session } = await supabase.auth.getUser();
  const user = session.user;

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
    return <div>Unauthorized</div>;

  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2 style={{ marginTop: 20 }}>Creator Approvals</h2>

      <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
        {creators?.map((c) => (
          <div key={c.id} className="card">
            <strong>{c.name}</strong> — @{c.store_slug}
            <br />
            Status:{" "}
            <span style={{ color: c.is_active ? "green" : "orange" }}>
              {c.is_active ? "Active" : "Pending"}
            </span>
            <br />
            <br />

            {!c.is_active && (
              <button
                className="btn-primary"
                onClick={async () => {
                  await fetch("/api/admin/approve", {
                    method: "POST",
                    body: JSON.stringify({ id: c.id }),
                  });
                  location.reload();
                }}
              >
                Approve
              </button>
            )}

            {c.is_active && (
              <button
                className="btn"
                onClick={async () => {
                  await fetch("/api/admin/suspend", {
                    method: "POST",
                    body: JSON.stringify({ id: c.id }),
                  });
                  location.reload();
                }}
              >
                Suspend
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
