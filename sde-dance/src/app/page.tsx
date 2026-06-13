import Hero from "@/components/Hero";
import Modalidades from "@/components/Modalidades";
import Professores from "@/components/Professores";
import GradeHoraria from "@/components/GradeHoraria";
import Espetaculos from "@/components/Espetaculos";
import Timeline from "@/components/Timeline";
import Sobre from "@/components/Sobre";
import Galeria from "@/components/Galeria";
import Contato from "@/components/Contato";
import Marquee from "@/components/ui/Marquee";

const MARQUEE_SEASON = [
  "TEMPORADA 2026", "SDE DANCE", "BALLET", "CONTEMPORÂNEO",
  "JAZZ", "DANÇAS URBANAS", "GAMA · DF", "10 ANOS EM CENA",
];

const MARQUEE_ESPETACULO = [
  "HERÓIS E VILÕES", "BACKSTAGE", "A VIDA DANÇA EM MOVIMENTO",
  "NEVER STOP", "TEATRO SESC GAMA", "2026", "SALA DE ENSAIO",
];

export default function Home() {
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
      <Timeline />
      <Marquee items={MARQUEE_SEASON} speed={55} />
      <Sobre />
      <Galeria />
      <Marquee items={MARQUEE_SEASON} speed={40} />
      <Contato />
    </>
  );
}
