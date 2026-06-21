"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Aluno = { id: string; nome: string };

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: React.CSSProperties = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default function CriarLancamentoForm({ alunos }: { alunos: Aluno[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    aluno_id: "", tipo: "mensalidade", valor: "",
    vencimento: "", mes_referencia: "", observacao: "",
  });

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === "vencimento" && value.length >= 7) next.mes_referencia = value.slice(0, 7);
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.aluno_id || !form.valor || !form.vencimento) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("financeiro").insert({
      aluno_id: form.aluno_id,
      tipo: form.tipo as "mensalidade" | "matricula_taxa",
      valor: parseFloat(form.valor),
      vencimento: form.vencimento,
      mes_referencia: form.mes_referencia || null,
      observacao: form.observacao || null,
      status: "pendente",
    });
    router.refresh();
    setOk(true);
    setTimeout(() => setOk(false), 2500);
    setForm({ aluno_id: "", tipo: "mensalidade", valor: "", vencimento: "", mes_referencia: "", observacao: "" });
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <select name="aluno_id" value={form.aluno_id} onChange={change} required
        className={INPUT_CLS} style={INPUT_STY}>
        <option value="">Selecionar aluno…</option>
        {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <select name="tipo" value={form.tipo} onChange={change} className={INPUT_CLS} style={INPUT_STY}>
          <option value="mensalidade">Mensalidade</option>
          <option value="matricula_taxa">Taxa de Matrícula</option>
        </select>
        <input name="valor" type="number" step="0.01" min="0" placeholder="Valor R$"
          value={form.valor} onChange={change} required className={INPUT_CLS} style={INPUT_STY} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input name="vencimento" type="date" value={form.vencimento} onChange={change}
          required className={INPUT_CLS} style={INPUT_STY} />
        <input name="mes_referencia" type="month" placeholder="Mês ref."
          value={form.mes_referencia} onChange={change} className={INPUT_CLS} style={INPUT_STY} />
      </div>

      <input name="observacao" type="text" placeholder="Observação (opcional)"
        value={form.observacao} onChange={change} className={INPUT_CLS} style={INPUT_STY} />

      <button type="submit" disabled={loading}
        className="w-full py-2 text-sm border transition-colors hover:opacity-90 disabled:opacity-40"
        style={{
          borderColor: "var(--color-spot)", color: "var(--color-bone)",
          backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
        }}>
        {loading ? "Lançando…" : ok ? "✓ Cobrança lançada!" : "Lançar cobrança"}
      </button>
    </form>
  );
}
