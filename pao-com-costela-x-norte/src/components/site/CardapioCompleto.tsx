import type { Cardapio } from "@/lib/types";
import { resolverPreco, formatarPreco } from "@/lib/price";
import ScrollReveal from "./ScrollReveal";

export default function CardapioCompleto({ cardapio }: { cardapio: Cardapio }) {
  const { paes, carnes, molhos, combos } = cardapio;

  return (
    <section className="tema-site px-6 py-24 sm:py-32 relative border-t border-papel/5">
      <div className="absolute inset-0 bg-noite pointer-events-none -z-10"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="titulo-display text-4xl sm:text-6xl mb-4">Cardápio completo</h2>
            <p className="text-papel/60 font-light text-lg">Preço já com a carne escolhida — sem pegadinha.</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:gap-10 sm:grid-cols-2">
          {paes.map((p, i) => (
            <ScrollReveal key={p.id} atraso={i * 100}>
              <div className="vidro rounded-3xl p-8 sm:p-10 h-full relative group hover:border-papel/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-papel/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex items-end justify-between mb-8 pb-4 border-b border-papel/10">
                  <h3 className="titulo-display text-3xl text-papel">{p.nome}</h3>
                  {!p.disponivel && (
                    <span className="text-xs uppercase font-bold text-brasa bg-brasa/10 rounded-full px-3 py-1">
                      esgotado
                    </span>
                  )}
                </div>
                
                <ul className="space-y-1">
                  {carnes.map((c) => (
                    <li key={c.id} className="group/item flex items-center justify-between text-sm py-3 px-2 -mx-2 rounded-xl hover:bg-papel/5 transition-colors">
                      <span className={`transition-colors duration-300 font-medium ${c.disponivel ? "text-papel/70 group-hover/item:text-papel" : "text-papel/30 line-through"}`}>
                        {c.nome}
                        {!c.disponivel && <span className="no-underline text-brasa ml-2 text-xs font-bold uppercase tracking-wide">esgotado</span>}
                      </span>
                      <span className="preco text-brasa-2 group-hover/item:text-brasa transition-colors duration-300 text-lg">
                        {formatarPreco(resolverPreco(cardapio, p.id, c.id))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {combos.length > 0 && (
          <ScrollReveal atraso={160}>
            <div className="mt-16">
              <h3 className="titulo-display text-2xl mb-6 text-papel/70 text-center">Combos</h3>
              <ul className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
                {combos.map((combo) => (
                  <li key={combo.id} className="vidro rounded-2xl p-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-papel">{combo.nome}</p>
                      <p className="text-xs text-papel/50">
                        {combo.quantidade}x · {combo.permite_variar_carne ? "carne à sua escolha" : "mesma carne"}
                      </p>
                      {!combo.disponivel && <p className="text-xs uppercase text-brasa font-bold mt-1">acabou hoje</p>}
                    </div>
                    <span className="preco text-brasa font-bold text-lg">{formatarPreco(combo.preco)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {molhos.length > 0 && (
          <ScrollReveal atraso={200}>
            <div className="mt-16 text-center">
              <h3 className="titulo-display text-2xl mb-6 text-papel/70">Molhos da casa</h3>
              <ul className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {molhos.map((m) => (
                  <li
                    key={m.id}
                    className="vidro rounded-full px-6 py-2.5 flex items-center gap-3 text-sm transition-all duration-300 hover:bg-noite"
                  >
                    {m.cor_hex && (
                      <span className="w-3 h-3 rounded-full inline-block shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" style={{ backgroundColor: m.cor_hex }} />
                    )}
                    <span className="font-medium text-papel/90">{m.nome}</span>
                    {!m.disponivel && <span className="text-xs font-bold uppercase text-brasa ml-1">esgotado</span>}
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
