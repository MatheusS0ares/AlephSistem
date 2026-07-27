"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { deleteProfessor } from "./actions";
import type { ProfData } from "@/lib/supabase/types";

type Prof = Pick<ProfData, "id"|"nome"|"papel"|"modalidades"|"ativo"|"ordem">;

export default function ProfessoresLista() {
  const [professores, setProfessores] = useState<Prof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("professores")
      .select("id,nome,papel,modalidades,ativo,ordem")
      .order("ordem")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfessores((data ?? []) as Prof[]);
        setLoading(false);
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Carregando…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-xs px-3 py-2 border"
        style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
        Erro ao carregar professores: {error}
      </p>
    );
  }

  if (!professores.length) {
    return (
      <div className="py-16 text-center border" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhum professor cadastrado ainda.</p>
        <Link href="/portal/admin/professores/novo" className="text-sm mt-3 inline-block"
          style={{ color: "var(--color-spot)" }}>Adicionar o primeiro →</Link>
      </div>
    );
  }

  return (
    <div className="border" style={{ borderColor: "var(--border-subtle)" }}>
      {professores.map((prof, i) => (
        <div key={prof.id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t" : ""}`}
          style={{ borderColor: "var(--border-subtle)" }}>
          <span className="text-xs w-6 text-center shrink-0"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {prof.ordem}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>{prof.nome}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)" }}>{prof.papel}</p>
            {prof.modalidades?.length > 0 && (
              <p className="text-xs mt-1" style={{ color: "rgba(140,128,137,0.6)" }}>
                {prof.modalidades.join(" · ")}
              </p>
            )}
          </div>

          <span className="text-[0.65rem] px-2 py-0.5 shrink-0" style={{
            fontFamily: "var(--font-mono)",
            backgroundColor: prof.ativo ? "rgba(110,16,35,0.2)" : "rgba(140,128,137,0.1)",
            color: prof.ativo ? "var(--color-spot)" : "var(--color-ash)",
          }}>
            {prof.ativo ? "ativo" : "inativo"}
          </span>

          <div className="flex items-center gap-3 shrink-0">
            <Link href={`/portal/admin/professores/${prof.id}`}
              className="text-xs transition-colors" style={{ color: "var(--color-ash)" }}>Editar</Link>
            <form action={deleteProfessor.bind(null, prof.id)}>
              <button type="submit" className="text-xs transition-colors"
                style={{ color: "rgba(239,68,68,0.7)" }}
                onClick={e => { if (!confirm(`Excluir ${prof.nome}?`)) e.preventDefault(); }}>
                Excluir
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
