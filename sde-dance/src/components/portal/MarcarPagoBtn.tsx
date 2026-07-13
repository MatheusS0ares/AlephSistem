"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const BORDER = { borderColor: "var(--border-mid)" } as React.CSSProperties;
const MONO = { fontFamily: "var(--font-mono)" } as React.CSSProperties;

export default function MarcarPagoBtn({
  id, status, pagoEm,
}: { id: string; status: string; pagoEm: string | null }) {
  const router = useRouter();
  const [open, setOpen]     = useState(false);
  const [date, setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  if (status === "pago") {
    return (
      <span className="text-xs" style={{ color: "#4ade80", ...MONO }}>
        ✓ {pagoEm ? new Date(pagoEm + "T12:00:00").toLocaleDateString("pt-BR") : ""}
      </span>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="text-xs px-2 py-1 border transition-colors hover:border-green-500"
        style={{ ...BORDER, color: "var(--color-ash)", ...MONO }}>
        Marcar pago
      </button>
    );
  }

  async function confirm() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("financeiro")
      .update({ status: "pago", pago_em: date })
      .eq("id", id);
    router.refresh();
    setOpen(false);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <input type="date" value={date} onChange={e => setDate(e.target.value)}
        className="text-xs px-1.5 py-1 border bg-transparent outline-none"
        style={{ ...BORDER, color: "var(--color-bone)", ...MONO }} />
      <button onClick={confirm} disabled={loading}
        className="text-xs px-2 py-1 border"
        style={{ borderColor: "#4ade80", color: "#4ade80", ...MONO }}>
        {loading ? "…" : "✓"}
      </button>
      <button onClick={() => setOpen(false)}
        className="text-xs px-2 py-1 border"
        style={{ ...BORDER, color: "var(--color-ash)", ...MONO }}>
        ✕
      </button>
    </div>
  );
}
