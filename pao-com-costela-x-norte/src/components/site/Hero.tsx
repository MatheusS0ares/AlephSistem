import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section className="tema-site px-6 py-20 sm:py-28 text-center border-b-4 border-lona">
      <p className="uppercase tracking-[0.3em] text-sm text-lona mb-4">{siteConfig.cidade}</p>
      <h1 className="titulo-display text-6xl sm:text-8xl contorno-letrista text-brasa leading-none">
        {siteConfig.nome}
      </h1>
      <p className="titulo-display text-2xl sm:text-3xl mt-4 text-papel">Pão com costela</p>
      <p className="mt-6 max-w-md mx-auto text-papel/80">
        Monte seu lanche do jeito que você gosta e peça direto pelo WhatsApp.
      </p>
      <a
        href="#montar"
        className="alvo-toque inline-flex items-center justify-center mt-8 px-8 bg-brasa text-noite font-bold uppercase tracking-wide"
      >
        Montar meu lanche
      </a>
    </section>
  );
}
