import { siteConfig } from "@/lib/site-config";
import MenuMarquee from "./MenuMarquee";
import SanduicheHero from "./SanduicheHero";

export default function Hero({ itensMarquee }: { itensMarquee: string[] }) {
  return (
    <section id="topo" className="tema-site relative overflow-hidden">
      <div className="fundo-cena px-6 pt-40 pb-24 sm:pt-52 sm:pb-32 text-center">
        <p className="uppercase tracking-[0.4em] text-xs sm:text-sm text-lona/90 mb-6">
          {siteConfig.cidade} · aberto {siteConfig.horario}
        </p>
        <h1 className="titulo-display text-[3.2rem] leading-[0.9] sm:text-8xl md:text-9xl">
          <span className="block text-papel">PÃO COM</span>
          <span className="block texto-brasa">COSTELA</span>
        </h1>
        <p className="mt-8 max-w-md mx-auto text-papel/70 text-lg">
          Monte seu lanche do jeito que você gosta e peça direto pelo WhatsApp.
          Sem cadastro, sem enrolação.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#montar"
            className="alvo-toque inline-flex items-center justify-center px-10 rounded-full bg-brasa text-noite font-bold uppercase tracking-wide shadow-[0_0_40px_-8px_var(--color-brasa)] hover:shadow-[0_0_60px_-4px_var(--color-brasa)] transition-shadow"
          >
            Montar meu lanche
          </a>
          <a
            href="#cardapio"
            className="alvo-toque inline-flex items-center justify-center px-8 rounded-full borda-fina text-papel/80 hover:text-papel hover:border-papel/40 transition-colors"
          >
            Ver cardápio
          </a>
        </div>

        <SanduicheHero />
      </div>

      <MenuMarquee itens={itensMarquee} />
    </section>
  );
}
