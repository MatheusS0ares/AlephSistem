"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPedido } from "@/lib/actions/pedidos";
import type { StatusPedido } from "@/lib/types";

const ORDEM: StatusPedido[] = ["aberto", "preparando", "pronto", "entregue"];

export default function PedidoStatusControl({ id, status }: { id: string; status: StatusPedido }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmandoCancelar, setConfirmandoCancelar] = useState(false);

  function avancar() {
    const idx = ORDEM.indexOf(status);
    const proximo = ORDEM[Math.min(idx + 1, ORDEM.length - 1)];
    if (proximo === status) return;
    startTransition(async () => {
      await atualizarStatusPedido(id, proximo);
      router.refresh();
    });
  }

  function cancelar() {
    if (!confirmandoCancelar) {
      setConfirmandoCancelar(true);
      return;
    }
    startTransition(async () => {
      await atualizarStatusPedido(id, "cancelado");
      router.refresh();
    });
  }

  if (status === "cancelado" || status === "entregue") {
    return <span className="text-xs uppercase text-admin-texto/50">{status}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={avancar}
        disabled={pending}
        className="alvo-toque bg-brasa text-white text-xs uppercase font-bold px-3"
      >
        {status} →
      </button>
      <button
        type="button"
        onClick={cancelar}
        disabled={pending}
        className={`alvo-toque text-xs uppercase px-2 underline ${
          confirmandoCancelar ? "text-red-600 font-bold" : "text-admin-texto/50"
        }`}
      >
        {confirmandoCancelar ? "confirmar?" : "cancelar"}
      </button>
    </div>
  );
}
