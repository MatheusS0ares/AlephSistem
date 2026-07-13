import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MarcarPagoBtn from "@/components/portal/MarcarPagoBtn";
import CriarLancamentoForm from "@/components/portal/CriarLancamentoForm";
import LancarEmLoteForm from "@/components/portal/LancarEmLoteForm";

export default async function AdminFinanceiroPage({
  searchParams,
}: { searchParams: Promise<{ mes?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { mes } = await searchParams;
  const currentMes = mes ?? new Date().toISOString().slice(0, 7);
  const mesStart = `${currentMes}-01`;
  const mesEnd   = `${currentMes}-31`;

  // Lançamentos do período
  const { data: rawLanc } = await supabase
    .from("financeiro")
    .select("id, tipo, valor, vencimento, pago_em, status, mes_referencia, aluno_id, observacao")
    .gte("vencimento", mesStart)
    .lte("vencimento", mesEnd)
    .order("vencimento");

  type Lanc = {
    id: string; tipo: string; valor: number; vencimento: string;
    pago_em: string | null; status: string; mes_referencia: string | null;
    aluno_id: string; observacao: string | null;
  };
  const lancamentos = rawLanc as Lanc[] | null;

  // Nomes dos alunos envolvidos
  const alunoIds = [...new Set(lancamentos?.map(l => l.aluno_id) ?? [])];
  const { data: rawProfs } = await supabase
    .from("profiles")
    .select("id, nome")
    .in("id", alunoIds.length ? alunoIds : ["00000000-0000-0000-0000-000000000000"]);
  type PRow = { id: string; nome: string };
  const namesMap = ((rawProfs as PRow[] | null) ?? []).reduce<Record<string, string>>(
    (acc, p) => { acc[p.id] = p.nome; return acc; }, {}
  );

  // Totais do período
  const pago      = lancamentos?.filter(l => l.status === "pago").reduce((s, l) => s + l.valor, 0) ?? 0;
  const pendente  = lancamentos?.filter(l => l.status === "pendente").reduce((s, l) => s + l.valor, 0) ?? 0;
  const atrasado  = lancamentos?.filter(l => l.status === "atrasado").reduce((s, l) => s + l.valor, 0) ?? 0;

  // Alunos ativos (para form individual)
  const { data: rawAlunos } = await supabase
    .from("profiles")
    .select("id, nome")
    .eq("tipo", "aluno")
    .eq("ativo", true)
    .order("nome");
  type ARow = { id: string; nome: string };
  const alunos = rawAlunos as ARow[] | null;

  // Turmas ativas com contagem de ativos (para form em lote)
  const { data: rawTurmas } = await supabase
    .from("turmas")
    .select("id, nome, matriculas (status)")
    .eq("ativo", true)
    .order("nome");
  type TRow = { id: string; nome: string; matriculas: { status: string }[] };
  const turmas = ((rawTurmas as TRow[] | null) ?? []).map(t => ({
    id: t.id,
    nome: t.nome,
    total_ativos: t.matriculas?.filter(m => m.status === "ativa").length ?? 0,
  }));

  const STATUS_COLOR: Record<string, string> = { pago: "#4ade80", pendente: "#f59e0b", atrasado: "#ef4444" };
  const STATUS_LABEL: Record<string, string> = { pago: "Pago", pendente: "Pendente", atrasado: "Atrasado" };
  const TIPO_LABEL: Record<string, string>   = { mensalidade: "Mensalidade", matricula_taxa: "Matrícula" };

  const mesLabel = new Date(currentMes + "-02").toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Administração</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Financeiro
          </h1>
        </div>
        <form className="flex items-center gap-2 flex-wrap">
          <label className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Período</label>
          <input type="month" name="mes" defaultValue={currentMes}
            className="px-3 py-1.5 text-sm border bg-transparent outline-none"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", fontFamily: "var(--font-mono)" }} />
          <button type="submit" className="px-3 py-1.5 text-xs border"
            style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Filtrar
          </button>
        </form>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Recebido" value={pago}     color="#4ade80" />
        <SummaryCard label="Pendente" value={pendente}  color="#f59e0b" />
        <SummaryCard label="Atrasado" value={atrasado}  color="#ef4444" />
      </div>

      {/* Forms de lançamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-5 border flex flex-col gap-4"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Lançar cobrança individual
          </h2>
          <CriarLancamentoForm alunos={alunos ?? []} />
        </section>

        <section className="p-5 border flex flex-col gap-4"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Mensalidades em lote por turma
          </h2>
          <LancarEmLoteForm turmas={turmas} />
        </section>
      </div>

      {/* Tabela de lançamentos */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Lançamentos · {mesLabel} · {lancamentos?.length ?? 0} registros
        </h2>

        {!lancamentos?.length ? (
          <div className="py-16 text-center border"
            style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
            <p className="text-sm" style={{ color: "var(--color-ash)" }}>
              Nenhum lançamento em {mesLabel}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Aluno", "Descrição", "Vencimento", "Valor", "Status", "Ação"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs tracking-[0.15em] uppercase"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border-subtle)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(l => (
                  <tr key={l.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-3 pr-3 font-medium" style={{ color: "var(--color-bone)" }}>
                      {namesMap[l.aluno_id] ?? "—"}
                    </td>
                    <td className="py-3 pr-3" style={{ color: "var(--color-ash)" }}>
                      {TIPO_LABEL[l.tipo] ?? l.tipo}
                      {l.mes_referencia && (
                        <span className="block text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                          {l.mes_referencia}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(l.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap font-semibold"
                      style={{ color: "var(--color-bone)" }}>
                      R$ {l.valor.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: STATUS_COLOR[l.status], fontFamily: "var(--font-mono)" }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_COLOR[l.status] }} />
                        {STATUS_LABEL[l.status] ?? l.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <MarcarPagoBtn id={l.id} status={l.status} pagoEm={l.pago_em} />
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

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-4 border flex flex-col gap-1"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <span className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</span>
      <span className="text-xl font-bold" style={{ color, fontFamily: "var(--font-display)" }}>
        R$ {value.toFixed(2).replace(".", ",")}
      </span>
    </div>
  );
}
