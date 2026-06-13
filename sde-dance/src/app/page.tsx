import Hero from "@/components/Hero";
import Modalidades from "@/components/Modalidades";
import GradeHoraria from "@/components/GradeHoraria";
import Espetaculos from "@/components/Espetaculos";
import Timeline from "@/components/Timeline";
import Sobre from "@/components/Sobre";
import Galeria from "@/components/Galeria";
import Contato from "@/components/Contato";

export default function Home() {
  return (
    <>
      <Hero />
      <Modalidades />
      <GradeHoraria />
      <Espetaculos />
      <Timeline />
      <Sobre />
      <Galeria />
      <Contato />
    </>
  );
}
