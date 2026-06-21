import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditarAlunoForm from "@/components/portal/EditarAlunoForm";
import BadgeStatus from "@/components/portal/BadgeStatus";
import MarcarPagoBtn from "@/components/portal/MarcarPagoBtn";

export default async function AdminAlunoDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { data: rawAluno } = await supabase
    .from("profiles")
    .select("id, nome, whatsapp, ativo, created_at, tipo")
    .eq("id", id)
    .single();

  if (!rawAluno || (rawAluno as any).tipo !== "aluno") notFound();

  type AlunoRow = {
    id: string; nome: string; whatsapp: string | null;
    ativo: boolean; created_at: string;
  };
  const aluno = rawAluno as AlunoRow;

  // Matrículas
  const { data: rawMats } = await supabase
    .from("matriculas")
    .select("id, status, data_inicio, turmas (nome, modalidade, dias_semana, hora)")
    .eq("aluno_id", id)
    .order("data_inicio", { ascending: false });

  type MatRow = {
    id: string; status: string; data_inicio: string;
    turmas: { nome: string; modalidade: string; dias_semana: string; hora: string } | null;
  };
  const matriculas = rawMats as MatRow[] | null;

  // Histórico financeiro completo
  const { data: rawFin } = await supabase
    .from("financeiro")
    .select("id, tipo, valor, vencimento, pago_em, status, mes_referencia, observacao")
    .eq("aluno_id", id)
    .order("vencimento", { ascending: false });

  type FinRow = {
    id: string; tipo: string; valor: number; vencimento: string;
    pago_em: string | null; status: string;
    mes_referencia: string | null; observacao: string | null;
  };
  const financeiro = rawFin as FinRow[] | null;

  const pago     = financeiro?.filter(f => f.status === "pago").reduce((s, f) => s + f.valor, 0) ?? 0;
  const pendente = financeiro?.filter(f => f.status === "pendente").reduce((s, f) => s + f.valor, 0) ?? 0;
  const atrasado = financeiro?.filter(f => f.status === "atrasado").reduce((s, f) => s + f.valor, 0) ?? 0;

  const STATUS_COLOR: Record<string, string> = { pago: "#4ade80", pendente: "#f59e0b", atrasado: "#ef4444" };
  const STATUS_LABEL: Record<string, string> = { pago: "Pago", pendente: "Pendente", atrasado: "Atrasado" };
  const TIPO_LABEL: Record<string, string>   = { mensalidade: "Mensalidade", matricula_taxa: "Matrícula" };

  return (
    <div className="flex flex-col gap-8">

      {/* Back + header */}
      <div>
        <a href="/portal/admin/alunos"
          className="text-xs mb-3 inline-flex items-center gap-1 opacity-70 hover:opacity-100"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          ← Alunos
        </a>
        <p className="eyebrow mb-1">Ficha do Aluno</p>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {aluno.nome}
          </h1>
          <span className="text-xs px-2 py-0.5 border"
            style={{
              borderColor: aluno.ativo ? "rgba(74,222,128,0.35)" : "var(--border-subtle)",
              color: aluno.ativo ? "#4ade80" : "var(--color-ash)",
              fontFamily: "var(--font-mono)",
            }}>
            {aluno.ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
        <p className="text-xs mt-1"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Cadastrado em {new Date(aluno.created_at).toLocaleDateString("pt-BR")}
          {aluno.whatsapp && (
            <>
              {" · "}
              <a href={`https://wa.me/55${aluno.whatsapp.replace(/\D/g, "")}`}
                target="_blank" rel="noopener"
                className="hover:opacity-80 underline underline-offset-2"
                style={{ color: "#4ade80" }}>
                {aluno.whatsapp}
              </a>
            </>
          )}
        </p>
      </div>

      {/* Dados cadastrais */}
      <section className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Dados cadastrais
        </h2>
        <EditarAlunoForm aluno={{ id: aluno.id, nome: aluno.nome, whatsapp: aluno.whatsapp, ativo: aluno.ativo }} />
      </section>

      {/* Turmas */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Turmas
        </h2>
        {!matriculas?.length ? (
          <p className="text-sm py-2" style={{ color: "var(--color-ash)" }}>Sem matrículas registradas.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {matriculas.map(m => (
              <div key={m.id}
                className="p-3 border flex items-center justify-between gap-4 flex-wrap"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                  opacity: m.status === "inativa" ? 0.5 : 1,
                }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>
                    {m.turmas?.nome ?? "Turma removida"}
                  </p>
                  {m.turmas && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {m.turmas.modalidade} · {m.turmas.dias_semana} · {m.turmas.hora}
                      {" · "}Desde {new Date(m.data_inicio + "T12:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <BadgeStatus status={m.status as any} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Financeiro */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Financeiro · histórico completo
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pago", value: pago, color: "#4ade80" },
            { label: "Pendente", value: pendente, color: "#f59e0b" },
            { label: "Atrasado", value: atrasado, color: "#ef4444" },
          ].map(card => (
            <div key={card.label} className="p-3 border"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
              <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {card.label}
              </p>
              <p className="text-base font-bold mt-0.5"
                style={{ color: card.color, fontFamily: "var(--font-display)" }}>
                R$ {card.value.toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}
        </div>

        {!financeiro?.length ? (
          <p className="text-sm py-2" style={{ color: "var(--color-ash)" }}>Sem lançamentos.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Descrição", "Vencimento", "Valor", "Status", "Ação"].map(h => (
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
                {financeiro.map(f => (
                  <tr key={f.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-3 pr-3" style={{ color: "var(--color-bone)" }}>
                      {TIPO_LABEL[f.tipo] ?? f.tipo}
                      {f.mes_referencia && (
                        <span className="block text-xs"
                          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                          {f.mes_referencia}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap text-xs"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(f.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap font-semibold"
                      style={{ color: "var(--color-bone)" }}>
                      R$ {f.valor.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: STATUS_COLOR[f.status], fontFamily: "var(--font-mono)" }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_COLOR[f.status] }} />
                        {STATUS_LABEL[f.status] ?? f.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <MarcarPagoBtn id={f.id} status={f.status} pagoEm={f.pago_em} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
