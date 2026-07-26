import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const hoje = new Date();
  const mesStr   = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const mesStart = `${mesStr}-01`;
  const mesEnd   = `${mesStr}-31`;
  const mesLabel = hoje.toLocaleDateString("pt-BR", { month: "long" });
  const hojeStr  = hoje.toISOString().slice(0, 10);

  const [
    { count: totalAlunos },
    { count: totalTurmas },
    { data: rawFin },
    { data: rawTurmas },
    { data: rawPend },
    { data: rawEventos },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("tipo", "aluno").eq("ativo", true),
    supabase.from("turmas").select("*",   { count: "exact", head: true }).eq("ativo", true),
    supabase.from("financeiro").select("status, valor").gte("vencimento", mesStart).lte("vencimento", mesEnd),
    supabase.from("turmas")
      .select("id, nome, modalidade, vagas_total, matriculas(id, status)")
      .eq("ativo", true).order("nome"),
    supabase.from("matriculas")
      .select("id, turma_id, profiles!matriculas_aluno_id_fkey(nome), turmas(nome)")
      .eq("status", "pendente").order("created_at", { ascending: false }).limit(5),
    supabase.from("eventos")
      .select("id, nome, tipo, data_evento, horario")
      .eq("ativo", true).gte("data_evento", hojeStr)
      .order("data_evento").limit(3),
  ]);

  const fin       = (rawFin  as any[] | null) ?? [];
  const turmas    = (rawTurmas as any[] | null) ?? [];
  const pending   = (rawPend   as any[] | null) ?? [];
  const eventos   = (rawEventos as any[] | null) ?? [];

  const receitaMes  = fin.filter(f => f.status === "pago").reduce((s: number, f: any) => s + f.valor, 0);
  const atrasadoMes = fin.filter(f => f.status === "atrasado").reduce((s: number, f: any) => s + f.valor, 0);

  const tipoEvento: Record<string, string> = {
    espetaculo: "Espetáculo", workshop: "Workshop",
    aula_aberta: "Aula aberta", outro: "Outro",
  };

  const fmt = (v: number) =>
    v === 0 ? "R$ 0" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Ações rápidas ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickCard
          href="/portal/admin/alunos?convidar=1"
          label="Convidar aluno"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              <line x1="19" y1="9" x2="19" y2="15" /><line x1="16" y1="12" x2="22" y2="12" />
            </svg>
          }
        />
        <QuickCard
          href="/portal/admin/turmas"
          label="Nova turma"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <QuickCard
          href="/portal/admin/eventos/novo"
          label="Criar evento"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          accent
        />
        <QuickCard
          href="/portal/admin/financeiro"
          label="Financeiro"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Alunos ativos"        value={String(totalAlunos ?? 0)} sub="cadastrados" />
        <Kpi label="Turmas ativas"         value={String(totalTurmas ?? 0)} sub="em andamento" />
        <Kpi label={`Receita ${mesLabel}`} value={fmt(receitaMes)}          sub="recebido"    accent="green" />
        <Kpi label="Em atraso"             value={fmt(atrasadoMes)}
          sub={atrasadoMes > 0 ? "atenção" : "tudo em dia"}
          accent={atrasadoMes > 0 ? "red" : undefined} />
      </div>

      {/* ── Pendentes ── */}
      {pending.length > 0 && (
        <section>
          <SectionHead title="Aguardando aprovação" badge={pending.length} href="/portal/admin/alunos" linkLabel="Ver todos" />
          <div className="flex flex-col gap-2 mt-3">
            {pending.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between gap-3 px-4 py-3 border"
                style={{ borderColor: "rgba(231,182,92,0.3)", backgroundColor: "rgba(231,182,92,0.04)" }}>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-bone)" }}>
                    {m.profiles?.nome ?? "Aluno"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                    {m.turmas?.nome ?? "—"}
                  </p>
                </div>
                <Link href={`/portal/admin/turmas/${m.turma_id}`}
                  className="shrink-0 text-xs px-3 py-1.5 border"
                  style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                  Revisar →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Próximos eventos ── */}
      <section>
        <SectionHead title="Próximos eventos" href="/portal/admin/eventos" linkLabel="Ver todos" />
        {eventos.length === 0 ? (
          <Empty text="Nenhum evento agendado." action={{ href: "/portal/admin/eventos/novo", label: "Criar evento →" }} />
        ) : (
          <div className="flex flex-col gap-2 mt-3">
            {eventos.map((e: any) => {
              const dataFmt = e.data_evento
                ? new Date(e.data_evento + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
                : "—";
              return (
                <Link key={e.id} href={`/portal/admin/eventos/${e.id}`}
                  className="flex items-center gap-4 px-4 py-3 border"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
                  <div className="flex flex-col items-center shrink-0 w-10 text-center">
                    <span className="text-xs font-bold leading-none" style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>
                      {dataFmt.split(" ")[0]}
                    </span>
                    <span className="text-[0.6rem] uppercase" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {dataFmt.split(" ")[1]}
                    </span>
                  </div>
                  <div className="w-px h-8 shrink-0" style={{ backgroundColor: "var(--border-subtle)" }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--color-bone)" }}>{e.nome}</p>
                    <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {tipoEvento[e.tipo] ?? e.tipo}{e.horario ? ` · ${e.horario}` : ""}
                    </p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "var(--color-spot)" }}>→</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Turmas ── */}
      {turmas.length > 0 && (
        <section>
          <SectionHead title="Turmas" href="/portal/admin/turmas" linkLabel="Gerenciar" />
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {turmas.map((t: any) => {
              const ativas    = (t.matriculas as any[])?.filter((m: any) => m.status === "ativa").length   ?? 0;
              const pendentes = (t.matriculas as any[])?.filter((m: any) => m.status === "pendente").length ?? 0;
              const pct = t.vagas_total > 0 ? Math.min(100, Math.round((ativas / t.vagas_total) * 100)) : 0;
              const cor = pct >= 90 ? "#ef4444" : pct >= 65 ? "#f59e0b" : "#4ade80";
              return (
                <Link key={t.id} href={`/portal/admin/turmas/${t.id}`}
                  className="block p-4 border"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-bone)" }}>{t.nome}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                        {t.modalidade}
                      </p>
                    </div>
                    <p className="text-sm font-bold shrink-0" style={{ color: cor, fontFamily: "var(--font-mono)" }}>
                      {ativas}/{t.vagas_total}
                    </p>
                  </div>
                  <div className="h-0.5 w-full rounded-full" style={{ backgroundColor: "rgba(140,128,137,0.15)" }}>
                    <div className="h-0.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: cor }} />
                  </div>
                  {pendentes > 0 && (
                    <p className="mt-2 text-xs" style={{ color: "#f59e0b", fontFamily: "var(--font-mono)" }}>
                      {pendentes} pendente{pendentes > 1 ? "s" : ""}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}

function QuickCard({ href, label, icon, accent }: {
  href: string; label: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <Link href={href}
      className="flex flex-col items-center justify-center gap-2 py-4 border text-center"
      style={{
        borderColor: accent ? "var(--color-spot)" : "var(--border-subtle)",
        backgroundColor: accent ? "rgba(231,182,92,0.06)" : "var(--bg-card)",
        color: accent ? "var(--color-spot)" : "var(--color-ash)",
      }}>
      <span style={{ color: accent ? "var(--color-spot)" : "var(--color-ash)", opacity: 0.9 }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </Link>
  );
}

function SectionHead({ title, badge, href, linkLabel }: {
  title: string; badge?: number; href?: string; linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h2 className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase"
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        {title}
        {badge != null && badge > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-[0.6rem] rounded-full"
            style={{ backgroundColor: "rgba(231,182,92,0.18)", color: "var(--color-spot)" }}>
            {badge}
          </span>
        )}
      </h2>
      {href && (
        <Link href={href} className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function Kpi({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: "green" | "red";
}) {
  const col = accent === "green" ? "#4ade80" : accent === "red" ? "#ef4444" : "var(--color-bone)";
  return (
    <div className="p-4 border flex flex-col gap-1"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <p className="text-[0.62rem] tracking-[0.1em] uppercase"
        style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
      <p className="text-2xl font-bold leading-none mt-0.5"
        style={{ color: col, fontFamily: "var(--font-display)" }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)" }}>{sub}</p>}
    </div>
  );
}

function Empty({ text, action }: { text: string; action?: { href: string; label: string } }) {
  return (
    <div className="py-10 mt-3 text-center border"
      style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
      <p className="text-sm" style={{ color: "var(--color-ash)" }}>{text}</p>
      {action && (
        <Link href={action.href} className="inline-block mt-3 text-xs"
          style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
