import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const hoje = new Date();
  const mesStr   = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const mesStart = `${mesStr}-01`;
  const mesEnd   = `${mesStr}-31`;
  const mesLabel = hoje.toLocaleDateString("pt-BR", { month: "long" });
  const dataLabel = hoje.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const [
    { count: totalAlunos },
    { count: totalTurmas },
    { data: rawFin },
    { data: rawMats },
    { data: rawTurmas },
    { data: rawPend },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("tipo", "aluno").eq("ativo", true),
    supabase.from("turmas").select("*", { count: "exact", head: true }).eq("ativo", true),
    supabase.from("financeiro").select("status, valor").gte("vencimento", mesStart).lte("vencimento", mesEnd),
    supabase.from("matriculas")
      .select("id, status, created_at, profiles!matriculas_aluno_id_fkey(nome), turmas(nome)")
      .order("created_at", { ascending: false }).limit(6),
    supabase.from("turmas")
      .select("id, nome, modalidade, vagas_total, matriculas(id, status)")
      .eq("ativo", true).order("nome"),
    supabase.from("matriculas")
      .select("id, turma_id, profiles!matriculas_aluno_id_fkey(nome), turmas(nome)")
      .eq("status", "pendente").order("created_at", { ascending: false }).limit(8),
  ]);

  const fin = (rawFin as any[] | null) ?? [];
  const receitaMes  = fin.filter(f => f.status === "pago").reduce((s: number, f: any) => s + f.valor, 0);
  const pendenteMes = fin.filter(f => f.status === "pendente").reduce((s: number, f: any) => s + f.valor, 0);
  const atrasadoMes = fin.filter(f => f.status === "atrasado").reduce((s: number, f: any) => s + f.valor, 0);

  const mats    = (rawMats   as any[] | null) ?? [];
  const turmas  = (rawTurmas as any[] | null) ?? [];
  const pending = (rawPend   as any[] | null) ?? [];

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Administração</p>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Painel Admin
          </h1>
          <p className="text-xs mt-1 capitalize"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {dataLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <NavBtn href="/portal/admin/alunos"     label="+ Aluno" />
          <NavBtn href="/portal/admin/turmas"     label="+ Turma" />
          <NavBtn href="/portal/admin/financeiro" label="Financeiro" accent />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Alunos ativos"        value={String(totalAlunos ?? 0)} note="cadastrados"      />
        <Kpi label="Turmas ativas"         value={String(totalTurmas ?? 0)} note="em andamento"     />
        <Kpi label={`Receita ${mesLabel}`} value={fmt(receitaMes)}          note="recebido"        accent="green" />
        <Kpi label="Em atraso"             value={fmt(atrasadoMes)}
          note={atrasadoMes > 0 ? "atenção necessária" : "tudo em dia"}
          accent={atrasadoMes > 0 ? "red" : undefined} />
      </div>

      {/* Matrículas pendentes */}
      {pending.length > 0 && (
        <section>
          <SectionHead title="Aguardando aprovação" badge={pending.length} href="/portal/admin/alunos" linkLabel="Ver alunos" />
          <div className="flex flex-col gap-2 mt-3">
            {pending.map((m: any) => (
              <div key={m.id}
                className="flex items-center justify-between gap-4 px-4 py-3 border"
                style={{ borderColor: "rgba(231,182,92,0.35)", backgroundColor: "rgba(231,182,92,0.04)" }}>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-bone)" }}>
                    {m.profiles?.nome ?? "Aluno sem nome"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                    {m.turmas?.nome ?? "—"}
                  </p>
                </div>
                <Link href={`/portal/admin/turmas/${m.turma_id}`}
                  className="shrink-0 text-xs px-3 py-1.5 border transition-colors hover:bg-spot/10"
                  style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                  Revisar →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Turmas e ocupação */}
      <section>
        <SectionHead title="Turmas e Ocupação" href="/portal/admin/turmas" linkLabel="Gerenciar" />
        {!turmas.length ? (
          <Empty text="Nenhuma turma ativa ainda." action={{ href: "/portal/admin/turmas", label: "Criar primeira turma" }} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {turmas.map((t: any) => {
              const ativas    = (t.matriculas as any[])?.filter((m: any) => m.status === "ativa").length   ?? 0;
              const pendentes = (t.matriculas as any[])?.filter((m: any) => m.status === "pendente").length ?? 0;
              const pct = t.vagas_total > 0 ? Math.min(100, Math.round((ativas / t.vagas_total) * 100)) : 0;
              const cor = pct >= 90 ? "#ef4444" : pct >= 65 ? "#f59e0b" : "#4ade80";
              return (
                <Link key={t.id} href={`/portal/admin/turmas/${t.id}`}
                  className="block p-4 border transition-all duration-200 hover:border-[var(--color-spot)]"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--color-bone)" }}>{t.nome}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                        {t.modalidade}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold" style={{ color: cor, fontFamily: "var(--font-mono)" }}>
                        {ativas}/{t.vagas_total}
                      </p>
                      <p className="text-[0.6rem]" style={{ color: "var(--color-ash)" }}>vagas</p>
                    </div>
                  </div>
                  <div className="h-0.5 w-full" style={{ backgroundColor: "rgba(140,128,137,0.2)" }}>
                    <div className="h-0.5 transition-all duration-700"
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
        )}
      </section>

      {/* Financeiro */}
      <section>
        <SectionHead title={`Financeiro — ${mesLabel}`} href="/portal/admin/financeiro" linkLabel="Ver extrato" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <FinBox label="Recebido" value={fmt(receitaMes)}  color="#4ade80" />
          <FinBox label="Pendente" value={fmt(pendenteMes)} color="#f59e0b" />
          <FinBox label="Atrasado" value={fmt(atrasadoMes)} color={atrasadoMes > 0 ? "#ef4444" : "var(--color-ash)"} />
        </div>
      </section>

      {/* Atividade recente */}
      {mats.length > 0 && (
        <section>
          <SectionHead title="Atividade Recente" href="/portal/admin/alunos" linkLabel="Ver alunos" />
          <div className="flex flex-col gap-2 mt-3">
            {mats.map((m: any) => {
              const dot = m.status === "ativa" ? "#4ade80" : m.status === "pendente" ? "#f59e0b" : "rgba(140,128,137,0.5)";
              return (
                <div key={m.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 border"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                    <div className="min-w-0">
                      <p className="text-sm truncate" style={{ color: "var(--color-bone)" }}>
                        {m.profiles?.nome ?? "—"}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                        {m.turmas?.nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs" style={{ color: dot, fontFamily: "var(--font-mono)" }}>{m.status}</p>
                    <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(m.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHead({ title, badge, href, linkLabel }: {
  title: string; badge?: number; href?: string; linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase"
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        {title}
        {badge != null && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-[0.6rem] rounded-full"
            style={{ backgroundColor: "rgba(231,182,92,0.2)", color: "var(--color-spot)" }}>
            {badge}
          </span>
        )}
      </h2>
      {href && (
        <a href={href} className="text-xs hover:underline" style={{ color: "var(--color-ash)" }}>
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

function Kpi({ label, value, note, accent }: {
  label: string; value: string; note?: string; accent?: "green" | "red";
}) {
  const col = accent === "green" ? "#4ade80" : accent === "red" ? "#ef4444" : "var(--color-bone)";
  return (
    <div className="p-4 border flex flex-col gap-1.5"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <p className="text-[0.65rem] tracking-[0.12em] uppercase"
        style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
      <p className="text-2xl font-bold leading-none"
        style={{ color: col, fontFamily: "var(--font-display)" }}>{value}</p>
      {note && <p className="text-xs" style={{ color: "var(--color-ash)" }}>{note}</p>}
    </div>
  );
}

function FinBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-3 border flex flex-col gap-1"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-[0.6rem] tracking-[0.12em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
      </div>
      <p className="text-sm font-bold break-all" style={{ color, fontFamily: "var(--font-mono)" }}>{value}</p>
    </div>
  );
}

function NavBtn({ href, label, accent }: { href: string; label: string; accent?: boolean }) {
  return (
    <a href={href}
      className="px-4 py-2 text-xs tracking-widest uppercase border transition-colors hover:opacity-80"
      style={{
        fontFamily: "var(--font-mono)",
        borderColor: accent ? "var(--color-spot)" : "var(--border-bold)",
        color: accent ? "var(--color-spot)" : "var(--color-ash)",
      }}>
      {label}
    </a>
  );
}

function Empty({ text, action }: { text: string; action?: { href: string; label: string } }) {
  return (
    <div className="py-10 mt-3 text-center border"
      style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
      <p className="text-sm" style={{ color: "var(--color-ash)" }}>{text}</p>
      {action && (
        <a href={action.href} className="inline-block mt-3 text-xs hover:underline"
          style={{ color: "var(--color-spot)" }}>
          {action.label} →
        </a>
      )}
    </div>
  );
}
