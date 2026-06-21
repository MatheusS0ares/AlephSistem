import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BadgeStatus from "@/components/portal/BadgeStatus";

export default async function ProfessorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo, nome")
    .eq("id", user.id)
    .single();

  if (profile?.tipo === "aluno") redirect("/portal/aluno");

  // Admin vê todas as turmas; professor vê só as suas
  const turmasQuery = supabase
    .from("turmas")
    .select(`
      id, nome, modalidade, dias_semana, hora, vagas_total, ativo,
      profiles!turmas_professor_id_fkey (nome),
      matriculas (id, status, profiles!matriculas_aluno_id_fkey (id, nome, whatsapp))
    `)
    .eq("ativo", true)
    .order("hora");

  if (profile?.tipo === "professor") {
    turmasQuery.eq("professor_id", user.id);
  }

  const { data: turmas } = await turmasQuery;

  const totalAlunos = turmas?.reduce((s, t: any) =>
    s + (t.matriculas?.filter((m: any) => m.status === "ativa").length ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">{profile?.tipo === "admin" ? "Administração" : "Portal do Professor"}</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {profile?.nome?.split(" ")[0]}, suas turmas
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <StatChip label="Turmas ativas" value={turmas?.length ?? 0} />
          <StatChip label="Alunos" value={totalAlunos} />
        </div>
      </div>

      {!turmas?.length ? (
        <div className="py-16 text-center border" style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhuma turma encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {turmas.map((t: any) => (
            <TurmaCard key={t.id} turma={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-2 border text-center"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <p className="text-xl font-bold" style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
    </div>
  );
}

function TurmaCard({ turma: t }: { turma: any }) {
  const ativos = t.matriculas?.filter((m: any) => m.status === "ativa") ?? [];
  const pendentes = t.matriculas?.filter((m: any) => m.status === "pendente") ?? [];
  const ocupacao = t.vagas_total > 0 ? Math.round((ativos.length / t.vagas_total) * 100) : 0;

  return (
    <div className="border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      {/* Header da turma */}
      <div className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <h3 className="font-semibold" style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}>
            {t.nome}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {t.dias_semana} · {t.hora}
            {t.profiles?.nome && ` · Prof. ${t.profiles.nome}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendentes.length > 0 && (
            <span className="text-xs px-2 py-1" style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", fontFamily: "var(--font-mono)" }}>
              {pendentes.length} pendente{pendentes.length > 1 ? "s" : ""}
            </span>
          )}
          <a href={`/portal/professor/turma/${t.id}`}
            className="text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors hover:bg-spot/10"
            style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Detalhes
          </a>
        </div>
      </div>

      {/* Barra de ocupação */}
      <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-subtle)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${ocupacao}%`,
              backgroundColor: ocupacao >= 90 ? "#ef4444" : ocupacao >= 70 ? "#f59e0b" : "#4ade80",
            }} />
        </div>
        <span className="text-xs shrink-0" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          {ativos.length}/{t.vagas_total} vagas
        </span>
      </div>

      {/* Lista de alunos ativos */}
      {ativos.length > 0 ? (
        <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
          {ativos.map((m: any, i: number) => (
            <li key={m.id} className="px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center text-xs rounded-full shrink-0"
                  style={{ backgroundColor: "rgba(110,16,35,0.3)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm" style={{ color: "var(--color-bone)" }}>{m.profiles?.nome}</p>
                  {m.profiles?.whatsapp && (
                    <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {m.profiles.whatsapp}
                    </p>
                  )}
                </div>
              </div>
              <BadgeStatus status={m.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-4 text-sm" style={{ color: "var(--color-ash)" }}>Nenhum aluno ativo ainda.</p>
      )}
    </div>
  );
}
