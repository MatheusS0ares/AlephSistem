import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TurmaForm from "@/components/portal/TurmaForm";

export default async function AdminTurmasPage({
  searchParams,
}: { searchParams: Promise<{ inativas?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { inativas } = await searchParams;
  const showInativas = inativas === "1";

  const query = supabase
    .from("turmas")
    .select(`
      id, nome, modalidade, dias_semana, hora, vagas_total, ativo, professor_id,
      profiles!turmas_professor_id_fkey (nome),
      matriculas (status)
    `)
    .order("nome");

  const { data: rawTurmas } = showInativas ? await query : await query.eq("ativo", true);

  type TurmaRow = {
    id: string; nome: string; modalidade: string; dias_semana: string;
    hora: string; vagas_total: number; ativo: boolean; professor_id: string | null;
    profiles: { nome: string } | null;
    matriculas: { status: string }[];
  };
  const turmas = rawTurmas as TurmaRow[] | null;

  // Professores para o form
  const { data: rawProfs } = await supabase
    .from("profiles")
    .select("id, nome")
    .in("tipo", ["professor", "admin"])
    .eq("ativo", true)
    .order("nome");
  type PRow = { id: string; nome: string };
  const professores = rawProfs as PRow[] | null;

  const totalAtivos   = turmas?.filter(t => t.ativo).length ?? 0;
  const totalAlunos   = turmas?.reduce((s, t) =>
    s + (t.matriculas?.filter(m => m.status === "ativa").length ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Administração</p>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Turmas
          </h1>
        </div>
        <a href={showInativas ? "/portal/admin/turmas" : "/portal/admin/turmas?inativas=1"}
          className="text-xs px-3 py-1.5 border self-start"
          style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          {showInativas ? "Ocultar inativas" : "Ver todas (incl. inativas)"}
        </a>
      </div>

      {/* Resumo */}
      <div className="flex gap-4 flex-wrap">
        <Chip label="Turmas ativas" value={totalAtivos} />
        <Chip label="Total de alunos" value={totalAlunos} />
      </div>

      {/* Form: nova turma */}
      <section className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Nova turma
        </h2>
        <TurmaForm professores={professores ?? []} />
      </section>

      {/* Lista */}
      {!turmas?.length ? (
        <div className="py-16 text-center border"
          style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhuma turma encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {turmas.map(t => {
            const ativos   = t.matriculas?.filter(m => m.status === "ativa").length ?? 0;
            const pendentes = t.matriculas?.filter(m => m.status === "pendente").length ?? 0;
            const ocupacao = t.vagas_total > 0 ? Math.round((ativos / t.vagas_total) * 100) : 0;
            const barColor = ocupacao >= 90 ? "#ef4444" : ocupacao >= 70 ? "#f59e0b" : "#4ade80";

            return (
              <div key={t.id} className="p-4 border flex items-center gap-4 flex-wrap"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                  opacity: t.ativo ? 1 : 0.55,
                }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="font-semibold"
                      style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}>
                      {t.nome}
                    </h3>
                    {!t.ativo && (
                      <span className="text-[0.65rem] px-1.5 border"
                        style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}>
                        INATIVA
                      </span>
                    )}
                    {pendentes > 0 && (
                      <span className="text-[0.65rem] px-1.5"
                        style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", fontFamily: "var(--font-mono)" }}>
                        {pendentes} pendente{pendentes > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                    {t.modalidade} · {t.dias_semana} · {t.hora}
                    {t.profiles?.nome ? ` · Prof. ${t.profiles.nome}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${ocupacao}%`, backgroundColor: barColor }} />
                    </div>
                    <span className="text-xs"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {ativos}/{t.vagas_total}
                    </span>
                  </div>
                  <a href={`/portal/admin/turmas/${t.id}`}
                    className="text-xs px-3 py-1.5 border whitespace-nowrap transition-colors hover:opacity-80"
                    style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                    Editar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-2 border"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <p className="text-lg font-bold"
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
    </div>
  );
}
