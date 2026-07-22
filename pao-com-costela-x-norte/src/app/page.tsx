import { getCardapioPublico, isSupabaseConfigured } from "@/lib/catalog";
import Hero from "@/components/site/Hero";
import MontadorLanche from "@/components/site/MontadorLanche";
import CardapioCompleto from "@/components/site/CardapioCompleto";
import OndeEstamos from "@/components/site/OndeEstamos";
import Rodape from "@/components/site/Rodape";

export default async function HomePage() {
  const cardapio = await getCardapioPublico();

  return (
    <main>
      <Hero />

      <section id="montar" className="tema-site px-6 py-16 border-b-4 border-lona">
        <h2 className="titulo-display text-3xl sm:text-4xl mb-8">Montar seu lanche</h2>
        {isSupabaseConfigured() && cardapio.paes.length > 0 ? (
          <MontadorLanche cardapio={cardapio} />
        ) : (
          <p className="text-papel/60">Cardápio em configuração — volte em breve.</p>
        )}
      </section>

      <div id="cardapio">
        <CardapioCompleto cardapio={cardapio} />
      </div>

      <div id="onde-estamos">
        <OndeEstamos />
      </div>

      <Rodape />
    </main>
  );
}
