"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Turma = { id: string; nome: string; dias_semana: string; hora: string };

export default function GerarLinkForm({ turmas }: { turmas: Turma[] }) {
  const [turmaId, setTurmaId] = useState("");
  const [validade, setValidade] = useState("");
  const [loading, setLoading] = useState(false);
  const [gerado, setGerado] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function gerar(e: React.FormEvent) {
    e.preventDefault();
    if (!turmaId) return;
    setLoading(true);
    setGerado(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("links_matricula")
      .insert({
        turma_id: turmaId,
        criado_por: user.id,
        ativo: true,
        validade: validade ? new Date(validade).toISOString() : null,
      })
      .select("token")
      .single();

    if (!error && data) {
      const url = `${window.location.origin}/matricula/${data.token}`;
      setGerado(url);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={gerar} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="turma" className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Turma *
        </label>
        <select id="turma" value={turmaId} onChange={e => setTurmaId(e.target.value)} required
          className="w-full px-4 py-3 text-sm border outline-none transition-colors"
          style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", backgroundColor: "var(--color-blackout)" }}
          onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
          onBlur={e => (e.target.style.borderColor = "var(--border-mid)")}>
          <option value="">Selecione a turma…</option>
          {turmas.map(t => (
            <option key={t.id} value={t.id} style={{ backgroundColor: "var(--color-blackout)" }}>
              {t.nome} — {t.dias_semana} {t.hora}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="validade" className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Validade (opcional)
        </label>
        <input id="validade" type="date" value={validade} onChange={e => setValidade(e.target.value)}
          className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors"
          style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
          onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
          onBlur={e => (e.target.style.borderColor = "var(--border-mid)")} />
      </div>

      <button type="submit" disabled={loading || !turmaId}
        className="self-start px-6 py-2.5 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
        style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
        {loading ? "Gerando…" : "Gerar link"}
      </button>

      {gerado && (
        <div className="mt-2 p-4 border" style={{ borderColor: "rgba(74,222,128,0.4)", backgroundColor: "rgba(74,222,128,0.05)" }}>
          <p className="text-xs mb-2" style={{ color: "#4ade80", fontFamily: "var(--font-mono)" }}>
            ✓ Link gerado! Copie e envie para o aluno:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--color-bone)", fontFamily: "var(--font-mono)" }}>
              {gerado}
            </code>
            <button type="button" onClick={() => navigator.clipboard.writeText(gerado)}
              className="shrink-0 px-3 py-2 text-xs border transition-colors hover:border-spot"
              style={{ borderColor: "var(--border-mid)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
              Copiar
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
