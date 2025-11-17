"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    async function process() {
      // Supabase automatically reads the code from the URL
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

      if (error) {
        console.error("Error:", error.message);
        alert("Something went wrong: " + error.message);
        window.location.href = "/auth/login";
        return;
      }

      // Password reset OR signup verification done
      window.location.href = "/dashboard";
    }

    process();
  }, []);

  return <div style={{ padding: 40 }}>Processing...</div>;
}
