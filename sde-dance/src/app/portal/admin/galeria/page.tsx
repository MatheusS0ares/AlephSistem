import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GaleriaAdmin from "./_GaleriaAdmin";

export default async function GaleriaAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { data: fotos } = await supabase
    .from("galeria")
    .select("id, src, alt, ativo, ordem")
    .order("ordem")
    .order("created_at");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-1">Conteúdo</p>
        <h1 className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Galeria
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-ash)" }}>
          Gerencie as fotos que aparecem na seção galeria do site.
          Apenas fotos marcadas como "Visível" são exibidas ao público.
        </p>
      </div>

      {!fotos ? (
        <div className="p-5 border" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#ef4444", fontFamily: "var(--font-mono)" }}>
            Tabela galeria não encontrada
          </p>
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>
            Execute o SQL abaixo no Supabase Dashboard → SQL Editor para criar a tabela e o bucket de armazenamento:
          </p>
          <pre className="mt-3 p-3 text-xs overflow-x-auto"
            style={{ backgroundColor: "rgba(11,10,12,0.6)", color: "var(--color-bone)", fontFamily: "var(--font-mono)", border: "1px solid var(--border-subtle)" }}>
{`-- 1. Criar tabela
CREATE TABLE sde_dance.galeria (
  id         uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  src        text    NOT NULL,
  alt        text    NOT NULL DEFAULT '',
  ordem      int     NOT NULL DEFAULT 0,
  ativo      boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sde_dance.galeria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON sde_dance.galeria
  USING (
    EXISTS (
      SELECT 1 FROM sde_dance.profiles
      WHERE id = auth.uid() AND tipo = 'admin'
    )
  );

-- 2. Criar bucket no Supabase Dashboard:
--    Storage → New bucket → Nome: fotos-galeria → Public: SIM`}
          </pre>
        </div>
      ) : (
        <GaleriaAdmin fotos={fotos} />
      )}
    </div>
  );
}
