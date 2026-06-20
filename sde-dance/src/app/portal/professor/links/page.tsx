import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GerarLinkForm from "@/components/portal/GerarLinkForm";

export default async function LinksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if (profile?.tipo === "aluno") redirect("/portal/aluno");

  // Turmas disponíveis para gerar link
  const turmasQuery = supabase
    .from("turmas")
    .select("id, nome, dias_semana, hora")
    .eq("ativo", true)
    .order("hora");

  if (profile?.tipo === "professor") {
    turmasQuery.eq("professor_id", user.id);
  }

  const { data: turmas } = await turmasQuery;

  // Links já criados
  const linksQuery = supabase
    .from("links_matricula")
    .select("id, token, ativo, validade, usos, created_at, turmas (nome)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (profile?.tipo === "professor") {
    linksQuery.eq("criado_por", user.id);
  }

  const { data: links } = await linksQuery;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-1">Matrículas</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Links de Matrícula
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--color-ash)" }}>
          Gere um link único para cada turma. O aluno clica, preenche o cadastro e já fica vinculado à turma certa.
        </p>
      </div>

      {/* Gerar novo link */}
      <div className="p-6 border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <h2 className="text-sm tracking-[0.15em] uppercase mb-4"
          style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
          Gerar novo link
        </h2>
        <GerarLinkForm turmas={turmas ?? []} />
      </div>

      {/* Links existentes */}
      {links && links.length > 0 && (
        <div>
          <h2 className="text-sm tracking-[0.15em] uppercase mb-4"
            style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Links gerados
          </h2>
          <div className="flex flex-col gap-3">
            {links.map((l: any) => (
              <LinkCard key={l.id} link={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LinkCard({ link: l }: { link: any }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/matricula/${l.token}`;
  const expirado = l.validade && new Date(l.validade) < new Date();

  return (
    <div className="p-4 border flex flex-col gap-3"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", opacity: !l.ativo || expirado ? 0.5 : 1 }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-bone)" }}>{l.turmas?.nome}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {l.usos} uso{l.usos !== 1 ? "s" : ""}
            {l.validade && ` · válido até ${new Date(l.validade).toLocaleDateString("pt-BR")}`}
          </p>
        </div>
        <span className="text-xs px-2 py-1" style={{
          color: l.ativo && !expirado ? "#4ade80" : "#ef4444",
          backgroundColor: l.ativo && !expirado ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
          fontFamily: "var(--font-mono)",
        }}>
          {!l.ativo ? "Desativado" : expirado ? "Expirado" : "Ativo"}
        </span>
      </div>

      {l.ativo && !expirado && (
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 text-xs overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ backgroundColor: "rgba(0,0,0,0.2)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {url}
          </code>
          <CopyButton text={url} />
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => { if (typeof window !== "undefined") navigator.clipboard.writeText(text); }}
      className="shrink-0 px-3 py-2 text-xs border transition-colors hover:border-spot"
      style={{ borderColor: "var(--border-mid)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
      Copiar
    </button>
  );
}
