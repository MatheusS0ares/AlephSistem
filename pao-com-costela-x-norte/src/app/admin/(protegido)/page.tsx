import { getCardapioAdmin } from "@/lib/catalog";
import { turnoAberto } from "@/lib/actions/turnos";
import { pedidosDoDia } from "@/lib/actions/pedidos";
import { formatarPreco } from "@/lib/price";
import TurnoControl from "@/components/admin/TurnoControl";
import DisponibilidadeToggle from "@/components/admin/DisponibilidadeToggle";

export default async function HojePage() {
  const [cardapio, turno, pedidos] = await Promise.all([
    getCardapioAdmin(),
    turnoAberto(),
    pedidosDoDia(),
  ]);

  const pedidosValidos = pedidos.filter((p) => p.status !== "cancelado");
  const totalVendido = pedidosValidos.reduce((s, p) => s + Number(p.total), 0);

  const itens = [
    ...cardapio.paes.filter((p) => p.ativo).map((p) => ({ ...p, tabela: "paes" as const })),
    ...cardapio.carnes.filter((c) => c.ativo).map((c) => ({ ...c, tabela: "carnes" as const })),
    ...cardapio.molhos.filter((m) => m.ativo).map((m) => ({ ...m, tabela: "molhos" as const })),
  ];

  return (
    <div className="space-y-8">
      <TurnoControl turno={turno} />

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="border-2 border-admin-borda p-4">
          <p className="text-3xl font-bold">{pedidosValidos.length}</p>
          <p className="text-sm text-admin-texto/60">pedidos hoje</p>
        </div>
        <div className="border-2 border-admin-borda p-4">
          <p className="preco text-2xl font-bold text-brasa">{formatarPreco(totalVendido)}</p>
          <p className="text-sm text-admin-texto/60">vendido hoje</p>
        </div>
      </div>

      <div>
        <h2 className="font-bold uppercase text-sm text-admin-texto/60 mb-3">Disponibilidade</h2>
        <ul className="divide-y divide-admin-borda border-y-2 border-admin-borda">
          {itens.map((item) => (
            <li key={`${item.tabela}-${item.id}`} className="flex items-center justify-between py-3">
              <span>{item.nome}</span>
              <DisponibilidadeToggle tabela={item.tabela} id={item.id} disponivel={item.disponivel} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
