import type { StatusMatricula } from "@/lib/supabase/types";

const CONFIG: Record<StatusMatricula, { label: string; color: string; bg: string }> = {
  ativa:    { label: "Ativa",    color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  pendente: { label: "Pendente", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  inativa:  { label: "Inativa",  color: "#8c8089", bg: "rgba(140,128,137,0.1)" },
};

export default function BadgeStatus({ status }: { status: StatusMatricula }) {
  const cfg = CONFIG[status] ?? CONFIG.inativa;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5"
      style={{ color: cfg.color, backgroundColor: cfg.bg, fontFamily: "var(--font-mono)" }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}
