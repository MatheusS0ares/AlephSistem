import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  type Lancamento = {
    id: string; tipo: string; valor: number; vencimento: string;
    pago_em: string | null; status: "pendente" | "pago" | "atrasado";
    mes_referencia: string | null; observacao: string | null;
  };
  const { data: rawLancamentos } = await supabase
    .from("financeiro")
    .select("id, tipo, valor, vencimento, pago_em, status, mes_referencia, observacao")
    .eq("aluno_id", user.id)
    .order("vencimento", { ascending: false });
  const lancamentos = rawLancamentos as Lancamento[] | null;

  const total = lancamentos?.length ?? 0;
  const pago = lancamentos?.filter(l => l.status === "pago").reduce((s, l) => s + l.valor, 0) ?? 0;
  const pendente = lancamentos?.filter(l => l.status === "pendente").reduce((s, l) => s + l.valor, 0) ?? 0;
  const atrasado = lancamentos?.filter(l => l.status === "atrasado").reduce((s, l) => s + l.valor, 0) ?? 0;

  const STATUS_COLOR: Record<string, string> = {
    pago: "#4ade80",
    pendente: "#f59e0b",
    atrasado: "#ef4444",
  };
  const STATUS_LABEL: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    atrasado: "Atrasado",
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-1">Financeiro</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Minha conta
        </h1>
      </div>

      {/* Resumo cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SummaryCard label="Pago" value={pago} color="#4ade80" />
        <SummaryCard label="Pendente" value={pendente} color="#f59e0b" />
        {atrasado > 0 && <SummaryCard label="Atrasado" value={atrasado} color="#ef4444" />}
      </div>

      {/* Tabela */}
      {!lancamentos?.length ? (
        <div className="py-16 text-center border" style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhum lançamento encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Descrição", "Vencimento", "Valor", "Status"].map(h => (
                  <th key={h} className="text-left pb-3 text-xs tracking-[0.15em] uppercase"
                    style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border-subtle)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l: any) => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="py-3 pr-4" style={{ color: "var(--color-bone)" }}>
                    {l.tipo === "mensalidade" ? `Mensalidade ${l.mes_referencia ?? ""}` : "Taxa de Matrícula"}
                    {l.observacao && <span className="block text-xs mt-0.5" style={{ color: "var(--color-ash)" }}>{l.observacao}</span>}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                    {new Date(l.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap font-semibold" style={{ color: "var(--color-bone)" }}>
                    R$ {l.valor.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs"
                      style={{ color: STATUS_COLOR[l.status], fontFamily: "var(--font-mono)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[l.status] }} />
                      {STATUS_LABEL[l.status]}
                      {l.status === "pago" && l.pago_em && (
                        <span style={{ color: "var(--color-ash)" }}>
                          · {new Date(l.pago_em + "T12:00:00").toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        Em caso de dúvidas sobre sua conta, entre em contato pelo WhatsApp.
      </p>
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
