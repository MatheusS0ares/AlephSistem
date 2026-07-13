"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Professor = { id: string; nome: string };
type TurmaData = {
  id: string; nome: string; modalidade: string; dias_semana: string;
  hora: string; professor_id: string | null; vagas_total: number; ativo: boolean;
};

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: React.CSSProperties = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default function TurmaForm({
  professores, turma,
}: { professores: Professor[]; turma?: TurmaData }) {
  const router = useRouter();
  const isEdit = Boolean(turma);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({
    nome:         turma?.nome ?? "",
    modalidade:   turma?.modalidade ?? "",
    dias_semana:  turma?.dias_semana ?? "",
    hora:         turma?.hora ?? "",
    professor_id: turma?.professor_id ?? "",
    vagas_total:  String(turma?.vagas_total ?? 20),
    ativo:        turma?.ativo ?? true,
  });

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const payload = {
      nome: form.nome,
      modalidade: form.modalidade,
      dias_semana: form.dias_semana,
      hora: form.hora,
      professor_id: form.professor_id || null,
      vagas_total: parseInt(form.vagas_total),
      ativo: form.ativo,
    };

    if (isEdit && turma) {
      await supabase.from("turmas").update(payload).eq("id", turma.id);
      router.refresh();
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } else {
      const { error } = await supabase.from("turmas").insert(payload);
      if (!error) {
        router.push("/portal/admin/turmas");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="nome" value={form.nome} onChange={change} required
          placeholder="Nome da turma (ex: Ballet Infantil)"
          className={INPUT_CLS} style={INPUT_STY} />
        <input name="modalidade" value={form.modalidade} onChange={change} required
          placeholder="Modalidade (ex: Ballet Clássico)"
          className={INPUT_CLS} style={INPUT_STY} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="dias_semana" value={form.dias_semana} onChange={change} required
          placeholder="Dias (ex: Terças e Quintas)"
          className={INPUT_CLS} style={INPUT_STY} />
        <input name="hora" value={form.hora} onChange={change} required
          placeholder="Horário (ex: 18h00)"
          className={INPUT_CLS} style={INPUT_STY} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select name="professor_id" value={form.professor_id} onChange={change}
          className={INPUT_CLS} style={INPUT_STY}>
          <option value="">Professor (opcional)</option>
          {professores.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        <input name="vagas_total" type="number" min="1" value={form.vagas_total} onChange={change}
          required placeholder="Total de vagas"
          className={INPUT_CLS} style={INPUT_STY} />
      </div>

      {isEdit && (
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.ativo}
            onChange={e => setForm(prev => ({ ...prev, ativo: e.target.checked }))} />
          <span className="text-sm" style={{ color: "var(--color-bone)" }}>Turma ativa</span>
        </label>
      )}

      <button type="submit" disabled={loading}
        className="py-2 text-sm border transition-colors hover:opacity-90 disabled:opacity-40"
        style={{
          borderColor: "var(--color-spot)", color: "var(--color-bone)",
          backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
        }}>
        {loading ? "Salvando…" : ok ? "✓ Salvo!" : isEdit ? "Salvar alterações" : "Criar turma"}
      </button>
    </form>
  );
}
