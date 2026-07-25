import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
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

  const totalAlunos   = turmas?.reduce((s, t: any) =>
    s + (t.matriculas?.filter((m: any) => m.status === "ativa").length ?? 0), 0) ?? 0;
  const totalPendentes = turmas?.reduce((s, t: any) =>
    s + (t.matriculas?.filter((m: any) => m.status === "pendente").length ?? 0), 0) ?? 0;

  const isAdmin = profile?.tipo === "admin";
  const primeiroNome = profile?.nome?.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">{isAdmin ? "Visão do Professor" : "Portal do Professor"}</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {primeiroNome ? `${primeiroNome}, suas turmas` : "Suas turmas"}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StatChip label="Turmas ativas"  value={turmas?.length ?? 0} />
          <StatChip label="Alunos"         value={totalAlunos} />
          {totalPendentes > 0 && (
            <StatChip label="Pendentes" value={totalPendentes} accent />
          )}
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/portal/professor/links"
          className="px-4 py-2 text-xs tracking-widest uppercase border transition-colors hover:bg-spot/10"
          style={{ fontFamily: "var(--font-mono)", borderColor: "var(--color-spot)", color: "var(--color-spot)" }}>
          Gerar link de matrícula
        </Link>
        {isAdmin && (
          <Link href="/portal/admin"
            className="px-4 py-2 text-xs tracking-widest uppercase border transition-colors hover:bg-white/5"
            style={{ fontFamily: "var(--font-mono)", borderColor: "var(--border-bold)", color: "var(--color-ash)" }}>
            Painel Admin →
          </Link>
        )}
      </div>

      {/* Turmas */}
      {!turmas?.length ? (
        <div className="py-16 text-center border flex flex-col items-center gap-4"
          style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhuma turma encontrada.</p>
          {isAdmin && (
            <Link href="/portal/admin/turmas"
              className="text-xs hover:underline" style={{ color: "var(--color-spot)" }}>
              Criar turma no painel admin →
            </Link>
          )}
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

function StatChip({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="px-4 py-2 border text-center"
      style={{
        borderColor: accent ? "rgba(245,158,11,0.4)" : "var(--border-subtle)",
        backgroundColor: accent ? "rgba(245,158,11,0.06)" : "var(--bg-card)",
      }}>
      <p className="text-xl font-bold" style={{ color: accent ? "#f59e0b" : "var(--color-spot)", fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
    </div>
  );
}

function TurmaCard({ turma: t }: { turma: any }) {
  const ativos    = t.matriculas?.filter((m: any) => m.status === "ativa")    ?? [];
  const pendentes = t.matriculas?.filter((m: any) => m.status === "pendente") ?? [];
  const ocupacao  = t.vagas_total > 0 ? Math.round((ativos.length / t.vagas_total) * 100) : 0;
  const barColor  = ocupacao >= 90 ? "#ef4444" : ocupacao >= 70 ? "#f59e0b" : "#4ade80";

  return (
    <div className="border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <h3 className="font-semibold" style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}>
            {t.nome}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {t.modalidade} · {t.dias_semana} · {t.hora}
            {t.profiles?.nome && ` · Prof. ${t.profiles.nome}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendentes.length > 0 && (
            <span className="text-xs px-2 py-1"
              style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", fontFamily: "var(--font-mono)" }}>
              {pendentes.length} pendente{pendentes.length > 1 ? "s" : ""}
            </span>
          )}
          <Link href={`/portal/professor/turma/${t.id}`}
            className="text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors hover:bg-spot/10"
            style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Detalhes
          </Link>
        </div>
      </div>

      {/* Barra de ocupação */}
      <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex-1 h-1.5 overflow-hidden" style={{ backgroundColor: "rgba(140,128,137,0.2)" }}>
          <div className="h-full transition-all duration-500"
            style={{ width: `${ocupacao}%`, backgroundColor: barColor }} />
        </div>
        <span className="text-xs shrink-0" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          {ativos.length}/{t.vagas_total} vagas · {ocupacao}%
        </span>
      </div>

      {/* Alunos ativos */}
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
                    <a href={`https://wa.me/${m.profiles.whatsapp.replace(/\D/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs hover:underline"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {m.profiles.whatsapp}
                    </a>
                  )}
                </div>
              </div>
              <BadgeStatus status={m.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-4 text-sm" style={{ color: "var(--color-ash)" }}>
          Nenhum aluno ativo ainda.
        </p>
      )}

      {/* Pendentes (se houver) */}
      {pendentes.length > 0 && (
        <div className="border-t px-5 py-3" style={{ borderColor: "rgba(245,158,11,0.2)", backgroundColor: "rgba(245,158,11,0.03)" }}>
          <p className="text-xs mb-2" style={{ color: "#f59e0b", fontFamily: "var(--font-mono)" }}>
            AGUARDANDO APROVAÇÃO
          </p>
          <ul className="flex flex-col gap-1">
            {pendentes.map((m: any) => (
              <li key={m.id} className="text-sm" style={{ color: "var(--color-ash)" }}>
                {m.profiles?.nome ?? "—"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
