import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import BadgeStatus from "@/components/portal/BadgeStatus";
import MatriculaActions from "@/components/portal/MatriculaActions";

export default async function TurmaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if (profile?.tipo === "aluno") redirect("/portal/aluno");

  const { data: turma } = await supabase
    .from("turmas")
    .select(`
      id, nome, modalidade, dias_semana, hora, vagas_total,
      profiles!turmas_professor_id_fkey (nome),
      matriculas (
        id, status, data_inicio,
        profiles!matriculas_aluno_id_fkey (id, nome, whatsapp, created_at)
      )
    `)
    .eq("id", id)
    .single();

  if (!turma) notFound();

  const todasMatriculas: any[] = turma.matriculas ?? [];
  const ativas = todasMatriculas.filter(m => m.status === "ativa");
  const pendentes = todasMatriculas.filter(m => m.status === "pendente");
  const inativas = todasMatriculas.filter(m => m.status === "inativa");

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        <a href="/portal/professor" className="hover:underline">Turmas</a>
        <span>/</span>
        <span style={{ color: "var(--color-bone)" }}>{(turma as any).nome}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {(turma as any).nome}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {(turma as any).dias_semana} · {(turma as any).hora}
            {(turma as any).profiles?.nome && ` · Prof. ${(turma as any).profiles.nome}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>
              {ativas.length}<span className="text-sm font-normal" style={{ color: "var(--color-ash)" }}>/{(turma as any).vagas_total}</span>
            </p>
            <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>vagas ocupadas</p>
          </div>
        </div>
      </div>

      {/* Pendentes — destaque */}
      {pendentes.length > 0 && (
        <div>
          <h2 className="text-xs tracking-[0.2em] uppercase mb-3 flex items-center gap-2"
            style={{ color: "#f59e0b", fontFamily: "var(--font-mono)" }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            Aguardando aprovação ({pendentes.length})
          </h2>
          <div className="flex flex-col gap-2">
            {pendentes.map((m: any) => (
              <AlunoRow key={m.id} m={m} turmaId={id} showActions />
            ))}
          </div>
        </div>
      )}

      {/* Alunos ativos */}
      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
          Alunos ativos ({ativas.length})
        </h2>
        {ativas.length === 0 ? (
          <p className="text-sm py-6 text-center border" style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
            Nenhum aluno ativo ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {ativas.map((m: any, i: number) => (
              <AlunoRow key={m.id} m={m} turmaId={id} index={i + 1} />
            ))}
          </div>
        )}
      </div>

      {/* Inativos */}
      {inativas.length > 0 && (
        <details>
          <summary className="text-xs tracking-[0.2em] uppercase cursor-pointer"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Inativos ({inativas.length})
          </summary>
          <div className="flex flex-col gap-2 mt-3">
            {inativas.map((m: any) => (
              <AlunoRow key={m.id} m={m} turmaId={id} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function AlunoRow({ m, turmaId, index, showActions }: {
  m: any; turmaId: string; index?: number; showActions?: boolean;
}) {
  const inicio = m.data_inicio
    ? new Date(m.data_inicio + "T12:00:00").toLocaleDateString("pt-BR")
    : null;

  return (
    <div className="px-4 py-3 border flex items-center justify-between gap-4 flex-wrap"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <div className="flex items-center gap-3">
        {index && (
          <span className="w-6 h-6 flex items-center justify-center text-xs rounded-full shrink-0"
            style={{ backgroundColor: "rgba(110,16,35,0.3)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            {index}
          </span>
        )}
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>{m.profiles?.nome}</p>
          <div className="flex items-center gap-3 mt-0.5">
            {m.profiles?.whatsapp && (
              <a href={`https://wa.me/${m.profiles.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="text-xs hover:underline" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {m.profiles.whatsapp}
              </a>
            )}
            {inicio && (
              <span className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                desde {inicio}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <BadgeStatus status={m.status} />
        {showActions && <MatriculaActions matriculaId={m.id} />}
      </div>
    </div>
  );
}
