import type { Cardapio } from "@/lib/types";
import { resolverPreco, formatarPreco } from "@/lib/price";
import ScrollReveal from "./ScrollReveal";

export default function CardapioCompleto({ cardapio }: { cardapio: Cardapio }) {
  const { paes, carnes, molhos } = cardapio;

  return (
    <section className="tema-site px-6 py-20 border-b border-papel/10">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="titulo-display text-4xl sm:text-5xl mb-2">Cardápio completo</h2>
          <p className="text-papel/50 mb-10">Preço já com a carne escolhida — sem pegadinha.</p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {paes.map((p, i) => (
            <ScrollReveal key={p.id} atraso={i * 60}>
              <div className="vidro rounded-2xl p-6 h-full">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="titulo-display text-2xl">{p.nome}</h3>
                  {!p.disponivel && (
                    <span className="text-xs uppercase text-lona border border-lona/40 rounded-full px-2 py-0.5">
                      acabou hoje
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {carnes.map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-sm border-t border-papel/10 pt-2 first:border-0 first:pt-0">
                      <span className={c.disponivel ? "text-papel/80" : "text-papel/30 line-through"}>
                        {c.nome}
                        {!c.disponivel && <span className="no-underline text-lona ml-2 text-xs">acabou</span>}
                      </span>
                      <span className="preco text-brasa font-bold">{formatarPreco(resolverPreco(cardapio, p.id, c.id))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {molhos.length > 0 && (
          <ScrollReveal atraso={120}>
            <div className="mt-8">
              <h3 className="titulo-display text-lg mb-3 text-papel/60">Molhos da casa</h3>
              <ul className="flex flex-wrap gap-3">
                {molhos.map((m) => (
                  <li
                    key={m.id}
                    className="borda-fina rounded-full px-4 py-1.5 flex items-center gap-2 text-sm"
                  >
                    {m.cor_hex && (
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: m.cor_hex }} />
                    )}
                    {m.nome}
                    {!m.disponivel && <span className="text-xs uppercase text-lona">acabou</span>}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
