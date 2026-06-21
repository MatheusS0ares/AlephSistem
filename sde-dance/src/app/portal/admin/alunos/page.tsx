import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminAlunosPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { q, status } = await searchParams;

  // Todos os alunos com turmas matriculadas
  const { data: rawAlunos } = await supabase
    .from("profiles")
    .select("id, nome, whatsapp, ativo, created_at, matriculas (id, status, turmas (nome))")
    .eq("tipo", "aluno")
    .order("nome");

  type MatRow = { id: string; status: string; turmas: { nome: string } | null };
  type Aluno  = { id: string; nome: string; whatsapp: string | null; ativo: boolean; created_at: string; matriculas: MatRow[] };

  let alunos = rawAlunos as Aluno[] | null;

  // Filtros
  if (q) alunos = alunos?.filter(a => a.nome.toLowerCase().includes(q.toLowerCase())) ?? null;
  if (status === "ativo")   alunos = alunos?.filter(a => a.ativo) ?? null;
  if (status === "inativo") alunos = alunos?.filter(a => !a.ativo) ?? null;

  // Saldo em aberto por aluno
  const alunoIds = rawAlunos?.map(a => (a as any).id) ?? [];
  const { data: rawFin } = await supabase
    .from("financeiro")
    .select("aluno_id, status, valor")
    .in("aluno_id", alunoIds.length ? alunoIds : ["00000000-0000-0000-0000-000000000000"]);
  type FinRow = { aluno_id: string; status: string; valor: number };
  const finMap = ((rawFin as FinRow[] | null) ?? []).reduce<Record<string, FinRow[]>>((acc, f) => {
    if (!acc[f.aluno_id]) acc[f.aluno_id] = [];
    acc[f.aluno_id].push(f);
    return acc;
  }, {});

  const total  = rawAlunos?.length ?? 0;
  const ativos = rawAlunos?.filter(a => (a as any).ativo).length ?? 0;
  const inad   = rawAlunos?.filter(a => {
    const fin = finMap[(a as any).id] ?? [];
    return fin.some(f => f.status === "atrasado");
  }).length ?? 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Administração</p>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Alunos
          </h1>
        </div>
        <form className="flex gap-2 flex-wrap">
          <input name="q" defaultValue={q} placeholder="Buscar por nome…"
            className="px-3 py-1.5 text-sm border bg-transparent outline-none"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", fontFamily: "var(--font-mono)", minWidth: 200 }} />
          <select name="status" defaultValue={status ?? ""}
            className="px-3 py-1.5 text-sm border bg-transparent outline-none"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", fontFamily: "var(--font-mono)", backgroundColor: "var(--color-blackout)" }}>
            <option value="">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
          <button type="submit" className="px-3 py-1.5 text-xs border"
            style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Filtrar
          </button>
          {(q || status) && (
            <a href="/portal/admin/alunos"
              className="px-3 py-1.5 text-xs border flex items-center"
              style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
              Limpar
            </a>
          )}
        </form>
      </div>

      {/* Chips de resumo */}
      <div className="flex gap-4 flex-wrap">
        <Chip label="Total cadastrados" value={total} />
        <Chip label="Ativos" value={ativos} color="#4ade80" />
        <Chip label="Inadimplentes" value={inad} color={inad > 0 ? "#ef4444" : undefined} />
        {(q || status) && <Chip label="Resultado" value={alunos?.length ?? 0} dim />}
      </div>

      {/* Tabela */}
      {!alunos?.length ? (
        <div className="py-16 text-center border"
          style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>
            {q ? `Nenhum aluno encontrado para "${q}".` : "Nenhum aluno cadastrado."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Nome", "WhatsApp", "Turmas", "Financeiro", "Situação", "Desde"].map(h => (
                  <th key={h} className="text-left pb-3 text-xs tracking-[0.15em] uppercase"
                    style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border-subtle)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alunos.map(a => {
                const fin = finMap[a.id] ?? [];
                const aberto   = fin.filter(f => f.status !== "pago").reduce((s, f) => s + f.valor, 0);
                const atrasado = fin.some(f => f.status === "atrasado");
                const turmasAtivas = a.matriculas.filter(m => m.status === "ativa");

                return (
                  <tr key={a.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--color-bone)" }}>
                      <a href={`/portal/admin/alunos/${a.id}`}
                        className="hover:underline underline-offset-2">
                        {a.nome}
                      </a>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {a.whatsapp ? (
                        <a href={`https://wa.me/55${a.whatsapp.replace(/\D/g, "")}`}
                          target="_blank" rel="noopener"
                          className="hover:opacity-80 underline underline-offset-2"
                          style={{ color: "#4ade80" }}>
                          {a.whatsapp}
                        </a>
                      ) : (
                        <span style={{ color: "var(--border-mid)" }}>—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {turmasAtivas.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {turmasAtivas.map(m => (
                            <span key={m.id} className="text-xs" style={{ color: "var(--color-bone)" }}>
                              {m.turmas?.nome ?? "—"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--border-mid)" }}>Sem turma ativa</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {fin.length === 0 ? (
                        <span className="text-xs" style={{ color: "var(--border-mid)" }}>Sem lançamentos</span>
                      ) : aberto > 0 ? (
                        <span className="text-xs font-semibold"
                          style={{ color: atrasado ? "#ef4444" : "#f59e0b" }}>
                          R$ {aberto.toFixed(2).replace(".", ",")} · {atrasado ? "Atrasado" : "Pendente"}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "#4ade80" }}>Em dia ✓</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs px-2 py-0.5 border"
                        style={{
                          borderColor: a.ativo ? "rgba(74,222,128,0.3)" : "var(--border-subtle)",
                          color: a.ativo ? "#4ade80" : "var(--color-ash)",
                          fontFamily: "var(--font-mono)",
                        }}>
                        {a.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 whitespace-nowrap text-xs"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(a.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Chip({ label, value, color, dim }: { label: string; value: number; color?: string; dim?: boolean }) {
  return (
    <div className="px-4 py-2 border"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", opacity: dim ? 0.6 : 1 }}>
      <p className="text-lg font-bold"
        style={{ color: color ?? "var(--color-spot)", fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
    </div>
  );
}
