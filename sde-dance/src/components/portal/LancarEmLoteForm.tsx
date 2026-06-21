"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Turma = { id: string; nome: string; total_ativos: number };

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: React.CSSProperties = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default function LancarEmLoteForm({ turmas }: { turmas: Turma[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<number | null>(null);
  const [form, setForm] = useState({
    turma_id: "", valor: "", vencimento: "", mes_referencia: "",
  });

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "vencimento" && value.length >= 7) next.mes_referencia = value.slice(0, 7);
      return next;
    });
  }

  const turmaSelected = turmas.find(t => t.id === form.turma_id);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.turma_id || !form.valor || !form.vencimento) return;
    setLoading(true);
    const supabase = createClient();

    const { data: mats } = await supabase
      .from("matriculas")
      .select("aluno_id, id")
      .eq("turma_id", form.turma_id)
      .eq("status", "ativa");

    if (mats?.length) {
      await supabase.from("financeiro").insert(
        mats.map(m => ({
          aluno_id: m.aluno_id,
          matricula_id: m.id,
          tipo: "mensalidade" as const,
          valor: parseFloat(form.valor),
          vencimento: form.vencimento,
          mes_referencia: form.mes_referencia || null,
          status: "pendente" as const,
        }))
      );
      setOk(mats.length);
    } else {
      setOk(0);
    }

    router.refresh();
    setTimeout(() => setOk(null), 3000);
    setForm({ turma_id: "", valor: "", vencimento: "", mes_referencia: "" });
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <select name="turma_id" value={form.turma_id} onChange={change} required
        className={INPUT_CLS} style={INPUT_STY}>
        <option value="">Selecionar turma…</option>
        {turmas.map(t => (
          <option key={t.id} value={t.id}>
            {t.nome} · {t.total_ativos} ativo{t.total_ativos !== 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input name="valor" type="number" step="0.01" min="0" placeholder="Valor R$"
          value={form.valor} onChange={change} required className={INPUT_CLS} style={INPUT_STY} />
        <input name="vencimento" type="date" value={form.vencimento} onChange={change}
          required className={INPUT_CLS} style={INPUT_STY} />
      </div>

      <input name="mes_referencia" type="month" placeholder="Mês de referência"
        value={form.mes_referencia} onChange={change} className={INPUT_CLS} style={INPUT_STY} />

      {turmaSelected && (
        <p className="text-xs py-2 px-3 border" style={{
          borderColor: "rgba(74,222,128,0.2)", color: "#4ade80",
          backgroundColor: "rgba(74,222,128,0.05)", fontFamily: "var(--font-mono)",
        }}>
          Vai gerar {turmaSelected.total_ativos} cobrança{turmaSelected.total_ativos !== 1 ? "s" : ""} para
          alunos ativos de "{turmaSelected.nome}"
        </p>
      )}

      <button type="submit" disabled={loading || (turmaSelected?.total_ativos ?? 0) === 0}
        className="w-full py-2 text-sm border transition-colors disabled:opacity-40"
        style={{
          borderColor: "#4ade80", color: "#4ade80",
          backgroundColor: "rgba(74,222,128,0.05)", fontFamily: "var(--font-mono)",
        }}>
        {loading
          ? "Lançando…"
          : ok !== null
          ? `✓ ${ok} cobrança${ok !== 1 ? "s" : ""} lançada${ok !== 1 ? "s" : ""}!`
          : "Lançar mensalidades em lote"}
      </button>
    </form>
  );
}
