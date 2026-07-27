import Hero from "@/components/Hero";
import Modalidades from "@/components/Modalidades";
import Professores from "@/components/Professores";
import GradeHoraria from "@/components/GradeHoraria";
import Espetaculos from "@/components/Espetaculos";
import Videos from "@/components/Videos";
import Depoimentos from "@/components/Depoimentos";
import Timeline from "@/components/Timeline";
import Sobre from "@/components/Sobre";
import Galeria from "@/components/Galeria";
import FAQ from "@/components/FAQ";
import MatriculaForm from "@/components/MatriculaForm";
import Contato from "@/components/Contato";
import Marquee from "@/components/ui/Marquee";
import { createClient } from "@/lib/supabase/server";

const MARQUEE_SEASON = [
  "TEMPORADA 2026", "SDE DANCE", "BALLET", "CONTEMPORÂNEO",
  "JAZZ", "DANÇAS URBANAS", "GAMA · DF", "10 ANOS EM CENA",
];

const MARQUEE_ESPETACULO = [
  "HERÓIS E VILÕES", "BACKSTAGE", "A VIDA DANÇA EM MOVIMENTO",
  "NEVER STOP", "TEATRO SESC GAMA", "2026", "SALA DE ENSAIO",
];

export default async function Home() {
  const supabase = await createClient();
  const { data: galeriaRows } = await supabase
    .from("galeria")
    .select("src, alt")
    .eq("ativo", true)
    .order("ordem")
    .order("created_at");

  const galeriaImages = galeriaRows ?? [];

  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_SEASON} />
      <Modalidades />
      <Marquee items={MARQUEE_SEASON} speed={45} />
      <Professores />
      <Marquee items={MARQUEE_ESPETACULO} speed={70} />
      <GradeHoraria />
      <Marquee items={MARQUEE_ESPETACULO} speed={50} />
      <Espetaculos />
      <Marquee items={MARQUEE_ESPETACULO} speed={55} />
      <Videos />
      <Marquee items={MARQUEE_SEASON} speed={60} />
      <Depoimentos />
      <Marquee items={MARQUEE_ESPETACULO} speed={45} />
      <Timeline />
      <Marquee items={MARQUEE_SEASON} speed={55} />
      <Sobre />
      <Galeria images={galeriaImages} />
      <Marquee items={MARQUEE_SEASON} speed={40} />
      <FAQ />
      <MatriculaForm />
      <Contato />
    </>
  );
}
