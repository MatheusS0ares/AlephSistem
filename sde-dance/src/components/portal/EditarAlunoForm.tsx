"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AlunoEdit = { id: string; nome: string; whatsapp: string | null; ativo: boolean };

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: React.CSSProperties = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
};

export default function EditarAlunoForm({ aluno }: { aluno: AlunoEdit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    nome:     aluno.nome,
    whatsapp: aluno.whatsapp ?? "",
    ativo:    aluno.ativo,
  });

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles")
      .update({ nome: form.nome, whatsapp: form.whatsapp || null, ativo: form.ativo })
      .eq("id", aluno.id);
    router.refresh();
    setOk(true);
    setTimeout(() => setOk(false), 2500);
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="nome" value={form.nome} onChange={change} required
          placeholder="Nome completo"
          className={INPUT_CLS} style={INPUT_STY} />
        <input name="whatsapp" value={form.whatsapp} onChange={change}
          placeholder="WhatsApp (ex: 11999999999)"
          className={INPUT_CLS} style={INPUT_STY} />
      </div>
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" name="ativo" checked={form.ativo} onChange={change} />
        <span className="text-sm" style={{ color: "var(--color-bone)" }}>Aluno ativo</span>
      </label>
      <button type="submit" disabled={loading}
        className="py-2 text-sm border transition-colors hover:opacity-90 disabled:opacity-40"
        style={{
          borderColor: "var(--color-spot)", color: "var(--color-bone)",
          backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
        }}>
        {loading ? "Salvando…" : ok ? "✓ Dados atualizados!" : "Salvar alterações"}
      </button>
    </form>
  );
}
