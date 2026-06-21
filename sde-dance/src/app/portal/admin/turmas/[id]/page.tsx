import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import TurmaForm from "@/components/portal/TurmaForm";
import BadgeStatus from "@/components/portal/BadgeStatus";
import MatriculaActions from "@/components/portal/MatriculaActions";

export default async function AdminTurmaDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { data: rawTurma } = await supabase
    .from("turmas")
    .select("id, nome, modalidade, dias_semana, hora, vagas_total, ativo, professor_id")
    .eq("id", id)
    .single();

  if (!rawTurma) notFound();

  type TurmaRow = {
    id: string; nome: string; modalidade: string; dias_semana: string;
    hora: string; vagas_total: number; ativo: boolean; professor_id: string | null;
  };
  const turma = rawTurma as TurmaRow;

  const { data: rawMats } = await supabase
    .from("matriculas")
    .select("id, status, data_inicio, profiles!matriculas_aluno_id_fkey (id, nome, whatsapp)")
    .eq("turma_id", id)
    .order("status");

  type MatRow = {
    id: string; status: string; data_inicio: string;
    profiles: { id: string; nome: string; whatsapp: string | null } | null;
  };
  const matriculas = rawMats as MatRow[] | null;

  const { data: rawProfs } = await supabase
    .from("profiles")
    .select("id, nome")
    .in("tipo", ["professor", "admin"])
    .eq("ativo", true)
    .order("nome");
  type PRow = { id: string; nome: string };
  const professores = rawProfs as PRow[] | null;

  const pendentes = matriculas?.filter(m => m.status === "pendente") ?? [];
  const ativos    = matriculas?.filter(m => m.status === "ativa") ?? [];
  const inativos  = matriculas?.filter(m => m.status === "inativa") ?? [];

  return (
    <div className="flex flex-col gap-8">

      {/* Back + header */}
      <div>
        <a href="/portal/admin/turmas"
          className="text-xs mb-3 inline-flex items-center gap-1 opacity-70 hover:opacity-100"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          ← Turmas
        </a>
        <p className="eyebrow mb-1">Turma</p>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {turma.nome}
          </h1>
          {!turma.ativo && (
            <span className="text-xs px-2 py-0.5 border"
              style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}>
              INATIVA
            </span>
          )}
        </div>
      </div>

      {/* Edit form */}
      <section className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Dados da turma
        </h2>
        <TurmaForm professores={professores ?? []} turma={turma} />
      </section>

      {/* Alunos */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Alunos
          </h2>
          <span className="text-xs px-2 py-0.5 border"
            style={{ borderColor: "var(--border-subtle)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {ativos.length}/{turma.vagas_total} ativos
          </span>
          {pendentes.length > 0 && (
            <span className="text-xs px-2 py-0.5"
              style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", fontFamily: "var(--font-mono)" }}>
              {pendentes.length} aguardando aprovação
            </span>
          )}
        </div>

        {!matriculas?.length ? (
          <div className="py-10 text-center border"
            style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
            <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhum aluno matriculado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Aluno", "WhatsApp", "Desde", "Status", "Ações"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs tracking-[0.15em] uppercase"
                      style={{
                        color: "var(--color-ash)", fontFamily: "var(--font-mono)",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...pendentes, ...ativos, ...inativos].map(m => (
                  <tr key={m.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      opacity: m.status === "inativa" ? 0.45 : 1,
                    }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--color-bone)" }}>
                      <a href={`/portal/admin/alunos/${m.profiles?.id}`}
                        className="hover:underline underline-offset-2">
                        {m.profiles?.nome ?? "—"}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-xs"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {m.profiles?.whatsapp
                        ? <a href={`https://wa.me/55${m.profiles.whatsapp.replace(/\D/g,"")}`}
                            target="_blank" rel="noopener" className="hover:opacity-80"
                            style={{ color: "#4ade80" }}>
                            {m.profiles.whatsapp}
                          </a>
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(m.data_inicio + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 pr-4">
                      <BadgeStatus status={m.status as any} />
                    </td>
                    <td className="py-3">
                      {m.status === "pendente" && (
                        <MatriculaActions matriculaId={m.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
