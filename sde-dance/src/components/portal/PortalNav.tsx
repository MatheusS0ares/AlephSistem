"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TipoUsuario } from "@/lib/supabase/types";

const NAV_ALUNO = [
  { label: "Minhas Turmas", href: "/portal/aluno" },
  { label: "Financeiro", href: "/portal/aluno/financeiro" },
];
const NAV_PROFESSOR = [
  { label: "Minhas Turmas", href: "/portal/professor" },
  { label: "Links de Matrícula", href: "/portal/professor/links" },
];
const NAV_ADMIN = [
  { label: "Turmas", href: "/portal/professor" },
  { label: "Alunos", href: "/portal/admin/alunos" },
  { label: "Financeiro", href: "/portal/admin/financeiro" },
  { label: "Links", href: "/portal/professor/links" },
];

export default function PortalNav({ tipo, nome }: { tipo: TipoUsuario; nome: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  const navItems = tipo === "admin" ? NAV_ADMIN : tipo === "professor" ? NAV_PROFESSOR : NAV_ALUNO;

  async function logout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: "var(--bg-header)", backdropFilter: "blur(12px)", borderColor: "rgba(110,16,35,0.3)" }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="/" className="flex flex-col leading-none shrink-0">
          <span className="text-base font-bold tracking-wider"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>SDE</span>
          <span className="text-[0.5rem] tracking-[0.3em] uppercase" style={{ color: "var(--color-spot)" }}>PORTAL</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1 pl-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="text-xs tracking-[0.12em] uppercase transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                color: pathname === item.href ? "var(--color-spot)" : "var(--color-ash)",
              }}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* User + logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium" style={{ color: "var(--color-bone)" }}>{nome}</span>
            <span className="text-[0.6rem] tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
              {tipo}
            </span>
          </div>
          <button onClick={logout} disabled={loggingOut}
            className="px-3 py-1.5 text-xs border transition-colors duration-200 hover:border-spot disabled:opacity-50"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            {loggingOut ? "…" : "Sair"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
          <span className="block w-5 h-px mb-1 transition-all duration-200"
            style={{ backgroundColor: "var(--color-bone)", transform: menuOpen ? "rotate(45deg) translate(2px,3px)" : "none" }} />
          <span className="block w-5 h-px mb-1 transition-all duration-200"
            style={{ backgroundColor: "var(--color-bone)", opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-px transition-all duration-200"
            style={{ backgroundColor: "var(--color-bone)", transform: menuOpen ? "rotate(-45deg) translate(2px,-3px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3 border-t"
          style={{ backgroundColor: "var(--bg-mobile-menu)", borderColor: "var(--border-subtle)" }}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="py-2 text-sm border-b"
              style={{ color: "var(--color-bone)", borderColor: "var(--border-subtle)" }}
              onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs" style={{ color: "var(--color-ash)" }}>{nome} · {tipo}</span>
            <button onClick={logout} className="text-xs" style={{ color: "var(--color-spot)" }}>Sair</button>
          </div>
        </div>
      )}
    </header>
  );
}
