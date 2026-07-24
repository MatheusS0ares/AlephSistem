"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/admin", label: "Hoje" },
  { href: "/admin/pedido-novo", label: "Novo pedido" },
  { href: "/admin/cardapio", label: "Cardápio" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/fechamento", label: "Fechamento" },
];

export default function AdminNav({ nome }: { nome: string }) {
  const pathname = usePathname();

  return (
    <>
      <header className="border-b-2 border-admin-borda px-4 py-3 flex items-center justify-between">
        <span className="font-bold">X Norte — Painel</span>
        <Link href="/admin/conta" className="text-sm text-admin-texto/60 underline underline-offset-2">
          {nome}
        </Link>
      </header>

      <nav className="fixed bottom-0 inset-x-0 border-t-2 border-admin-borda bg-admin-bg flex z-20">
        {ITENS.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`alvo-toque flex-1 flex items-center justify-center text-xs font-bold uppercase tracking-tight py-3 ${
                ativo ? "text-brasa border-t-4 border-brasa -mt-[2px]" : "text-admin-texto/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
