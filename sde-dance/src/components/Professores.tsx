import { site } from "@/config/site";
import { createClient } from "@/lib/supabase/server";
import type { ProfData } from "@/lib/supabase/types";
import ProfessorCard from "./ProfessorCard";

async function fetchProfessores(): Promise<ProfData[]> {
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (configured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("professores")
        .select("id,nome,papel,modalidades,bio,citacao,foto_url,instagram,ordem,destaque,ativo")
        .eq("ativo", true)
        .order("ordem");
      if (data && data.length > 0) return data as ProfData[];
    } catch {
      // fallback
    }
  }
  return site.professores.map((p, i) => ({
    id: String(i),
    nome: p.nome,
    papel: p.papel,
    modalidades: [...p.modalidades],
    bio: p.bio,
    citacao: p.citacao,
    foto_url: p.foto,
    instagram: p.instagram,
    ordem: i,
    destaque: true,
    ativo: true,
  }));
}

export default async function Professores() {
  const professores = await fetchProfessores();

  return (
    <section id="professores" className="relative overflow-hidden py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.25) 50%, transparent 100%)" }} />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mb-20 lg:mb-28">
        <p className="eyebrow mb-3">Elenco</p>
        <div className="flex items-end gap-8 flex-wrap">
          <h2 className="font-semibold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
            Nossos Professores
          </h2>
          <p className="text-sm max-w-sm pb-1 hidden md:block" style={{ color: "var(--color-ash)" }}>
            Artistas que formam artistas — cada aula é um ato.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {professores.map((prof, idx) => (
          <ProfessorCard key={prof.id} prof={prof} index={idx} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-sm flex-1" style={{ color: "var(--color-ash)" }}>
            Quer conhecer o trabalho de perto? Agende uma aula experimental gratuita.
          </p>
          <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
            Aula experimental
          </a>
        </div>
      </div>
    </section>
  );
}
