import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProfessor } from "./actions";
import type { ProfData } from "@/lib/supabase/types";

export default async function AdminProfessoresPage() {
  const supabase = await createClient();
  const { data: professores } = await supabase
    .from("professores")
    .select("id,nome,papel,modalidades,ativo,ordem")
    .order("ordem");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>Professores</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ash)" }}>Gerencie o elenco exibido no site</p>
        </div>
        <Link href="/portal/admin/professores/novo"
          className="px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          + Novo professor
        </Link>
      </div>

      {!professores?.length ? (
        <div className="py-16 text-center border" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>Nenhum professor cadastrado ainda.</p>
          <Link href="/portal/admin/professores/novo" className="text-sm mt-3 inline-block"
            style={{ color: "var(--color-spot)" }}>Adicionar o primeiro →</Link>
        </div>
      ) : (
        <div className="border" style={{ borderColor: "var(--border-subtle)" }}>
          {(professores as Pick<ProfData, "id"|"nome"|"papel"|"modalidades"|"ativo"|"ordem">[]).map((prof, i) => (
            <div key={prof.id} className={`flex items-center gap-4 px-5 py-4 ${
              i > 0 ? "border-t" : ""
            }`} style={{ borderColor: "var(--border-subtle)" }}>
              {/* Order badge */}
              <span className="text-xs w-6 text-center shrink-0" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {prof.ordem}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>{prof.nome}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)" }}>{prof.papel}</p>
                {prof.modalidades.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: "rgba(140,128,137,0.6)" }}>
                    {prof.modalidades.join(" · ")}
                  </p>
                )}
              </div>

              {/* Status */}
              <span className="text-[0.65rem] px-2 py-0.5 shrink-0" style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: prof.ativo ? "rgba(110,16,35,0.2)" : "rgba(140,128,137,0.1)",
                color: prof.ativo ? "var(--color-spot)" : "var(--color-ash)",
              }}>
                {prof.ativo ? "ativo" : "inativo"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/portal/admin/professores/${prof.id}`}
                  className="text-xs transition-colors" style={{ color: "var(--color-ash)" }}>Editar</Link>
                <form action={deleteProfessor.bind(null, prof.id)}>
                  <button type="submit"
                    className="text-xs transition-colors" style={{ color: "rgba(239,68,68,0.7)" }}
                    onClick={e => { if (!confirm(`Excluir ${prof.nome}?`)) e.preventDefault(); }}>
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
