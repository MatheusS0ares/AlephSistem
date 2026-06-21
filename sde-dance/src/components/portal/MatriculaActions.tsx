"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MatriculaActions({ matriculaId }: { matriculaId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function atualizar(status: "ativa" | "inativa") {
    setLoading(true);
    await supabase.from("matriculas").update({ status }).eq("id", matriculaId);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => atualizar("ativa")} disabled={loading}
        className="text-xs px-3 py-1.5 border transition-colors hover:bg-green-500/10 disabled:opacity-50"
        style={{ borderColor: "#4ade80", color: "#4ade80", fontFamily: "var(--font-mono)" }}>
        Aprovar
      </button>
      <button onClick={() => atualizar("inativa")} disabled={loading}
        className="text-xs px-3 py-1.5 border transition-colors hover:bg-red-500/10 disabled:opacity-50"
        style={{ borderColor: "#ef4444", color: "#ef4444", fontFamily: "var(--font-mono)" }}>
        Rejeitar
      </button>
    </div>
  );
}
