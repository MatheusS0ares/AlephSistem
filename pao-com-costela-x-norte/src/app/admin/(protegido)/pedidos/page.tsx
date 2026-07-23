import { pedidosDoDia } from "@/lib/actions/pedidos";
import { formatarPreco } from "@/lib/price";
import PedidoStatusControl from "@/components/admin/PedidoStatusControl";

export default async function PedidosDoDiaPage() {
  const pedidos = await pedidosDoDia();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Pedidos do dia</h1>
      {pedidos.length === 0 ? (
        <p className="text-sm text-admin-texto/60">Nenhum pedido ainda hoje.</p>
      ) : (
        <ul className="space-y-3">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border-2 border-admin-borda p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">#{pedido.codigo}</span>
                <span className="text-xs uppercase text-admin-texto/50">{pedido.canal}</span>
                <span className="preco font-bold">{formatarPreco(Number(pedido.total))}</span>
              </div>
              <ul className="text-sm text-admin-texto/70">
                {(pedido.pedido_itens ?? []).map((item) => (
                  <li key={item.id}>
                    {item.quantidade}x {item.pao_nome} — {item.carne_nome}
                    {item.molho_nome ? ` — ${item.molho_nome}` : ""}
                  </li>
                ))}
              </ul>
              <PedidoStatusControl id={pedido.id} status={pedido.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
