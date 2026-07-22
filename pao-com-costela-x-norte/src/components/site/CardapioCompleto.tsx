import type { Cardapio } from "@/lib/types";
import { resolverPreco, formatarPreco } from "@/lib/price";

export default function CardapioCompleto({ cardapio }: { cardapio: Cardapio }) {
  const { paes, carnes, molhos } = cardapio;

  return (
    <section className="tema-site px-6 py-16 border-b-4 border-lona">
      <h2 className="titulo-display text-3xl sm:text-4xl mb-8">Cardápio completo</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="border-b-2 border-papel/30">
              <th className="py-2 pr-4 titulo-display text-sm">Pão \ Carne</th>
              {carnes.map((c) => (
                <th key={c.id} className="py-2 px-4 titulo-display text-sm whitespace-nowrap">
                  {c.nome}
                  {!c.disponivel && <span className="block text-xs text-lona normal-case">acabou hoje</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paes.map((p) => (
              <tr key={p.id} className="border-b border-papel/10">
                <td className="py-2 pr-4 font-bold whitespace-nowrap">
                  {p.nome}
                  {!p.disponivel && <span className="block text-xs text-lona">acabou hoje</span>}
                </td>
                {carnes.map((c) => (
                  <td key={c.id} className="preco py-2 px-4 text-papel/90">
                    {formatarPreco(resolverPreco(cardapio, p.id, c.id))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {molhos.length > 0 && (
        <div className="mt-8">
          <h3 className="titulo-display text-lg mb-3">Molhos</h3>
          <ul className="flex flex-wrap gap-4">
            {molhos.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                {m.cor_hex && (
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: m.cor_hex }} />
                )}
                {m.nome}
                {!m.disponivel && <span className="text-xs uppercase text-lona">acabou hoje</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
