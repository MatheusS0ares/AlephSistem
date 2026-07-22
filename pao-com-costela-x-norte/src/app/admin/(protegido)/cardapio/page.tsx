import { getCardapioAdmin } from "@/lib/catalog";
import { atualizarPrecoBasePao, atualizarAjusteCarne } from "@/lib/actions/catalogo";
import PrecoEditavel from "@/components/admin/PrecoEditavel";
import NomeEditavel from "@/components/admin/NomeEditavel";
import AtivoToggle from "@/components/admin/AtivoToggle";
import FotoUpload from "@/components/admin/FotoUpload";
import ExcecaoPreco from "@/components/admin/ExcecaoPreco";

export default async function CardapioPage() {
  const cardapio = await getCardapioAdmin();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold mb-1">Cardápio</h1>
        <p className="text-sm text-admin-texto/60">
          Preço base do pão + ajuste da carne. Toque no valor para editar — some sozinho ao sair do campo.
        </p>
      </div>

      <section>
        <h2 className="font-bold uppercase text-sm text-admin-texto/60 mb-3">Preço base do pão</h2>
        <ul className="divide-y divide-admin-borda border-y-2 border-admin-borda">
          {cardapio.paes.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <FotoUpload tabela="paes" id={p.id} fotoUrl={p.foto_url} />
              <div className="flex-1 min-w-0">
                <NomeEditavel tabela="paes" id={p.id} nomeInicial={p.nome} />
                <div>
                  <AtivoToggle tabela="paes" id={p.id} ativo={p.ativo} />
                </div>
              </div>
              <PrecoEditavel
                valorInicial={p.preco_base}
                aoSalvar={(novo) => atualizarPrecoBasePao(p.id, novo)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold uppercase text-sm text-admin-texto/60 mb-3">Ajuste por carne</h2>
        <ul className="divide-y divide-admin-borda border-y-2 border-admin-borda">
          {cardapio.carnes.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              <FotoUpload tabela="carnes" id={c.id} fotoUrl={c.foto_url} />
              <div className="flex-1 min-w-0">
                <NomeEditavel tabela="carnes" id={c.id} nomeInicial={c.nome} />
                <div>
                  <AtivoToggle tabela="carnes" id={c.id} ativo={c.ativo} />
                </div>
              </div>
              <PrecoEditavel
                valorInicial={c.ajuste}
                permiteNegativoOuZero
                aoSalvar={(novo) => atualizarAjusteCarne(c.id, novo)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold uppercase text-sm text-admin-texto/60 mb-3">Molhos</h2>
        <ul className="divide-y divide-admin-borda border-y-2 border-admin-borda">
          {cardapio.molhos.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <NomeEditavel tabela="molhos" id={m.id} nomeInicial={m.nome} />
                <div>
                  <AtivoToggle tabela="molhos" id={m.id} ativo={m.ativo} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold uppercase text-sm text-admin-texto/60 mb-3">
          Preço especial (quando a combinação foge da regra)
        </h2>
        <ExcecaoPreco paes={cardapio.paes} carnes={cardapio.carnes} excecoes={cardapio.excecoes} />
      </section>
    </div>
  );
}
