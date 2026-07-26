"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  nome:      string;
  pendentes: number;
  eventos:   number;
};

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/portal/admin",
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "professores",
    label: "Professores",
    href: "/portal/admin/professores",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "turmas",
    label: "Turmas",
    href: "/portal/admin/turmas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "alunos",
    label: "Alunos",
    href: "/portal/admin/alunos",
    badge: "pendentes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "financeiro",
    label: "Financeiro",
    href: "/portal/admin/financeiro",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "eventos",
    label: "Eventos",
    href: "/portal/admin/eventos",
    badge: "eventos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ nome, pendentes, eventos }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [out, setOut] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function logout() {
    setOut(true);
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  const initial = nome?.charAt(0).toUpperCase() ?? "A";
  const primeiroNome = nome?.split(" ")[0] ?? "";

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="sde-sb hidden lg:flex flex-col">

        {/* Logo */}
        <div className="sde-sb-logo">
          <a href="/" className="flex flex-col leading-none">
            <span className="sde-sb-brand">SDE Dance</span>
            <span className="sde-sb-subbrand">Painel Admin</span>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 py-4">
          {NAV.map(({ id, label, href, exact, badge, icon }) => {
            const active = isActive(href, exact);
            const count  = badge === "pendentes" ? pendentes : badge === "eventos" ? eventos : 0;
            return (
              <a key={id} href={href} className={`sde-sb-item ${active ? "active" : ""}`}>
                <span className="sde-sb-icon">{icon}</span>
                <span className="sde-sb-label">{label}</span>
                {count > 0 && <span className="sde-sb-badge">{count}</span>}
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="sde-sb-footer">
          <div className="sde-sb-avatar">{initial}</div>
          <div className="flex flex-col min-w-0">
            <span className="sde-sb-nome">{primeiroNome}</span>
            <span className="sde-sb-role">Administrador</span>
          </div>
          <button onClick={logout} disabled={out} className="sde-sb-exit" title="Sair">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar (logo + avatar + logout) ── */}
      <header className="sde-topbar lg:hidden">
        <a href="/" className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-bone)", letterSpacing: "-0.01em" }}>SDE Dance</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "var(--color-spot)" }}>Admin</span>
        </a>
        <div className="flex items-center gap-2">
          <div className="sde-sb-avatar" style={{ width: "1.8rem", height: "1.8rem", fontSize: "0.8rem" }}>
            {initial}
          </div>
          <button onClick={logout} disabled={out} className="sde-sb-exit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="sde-bn lg:hidden">
        {NAV.map(({ id, label, href, exact, badge, icon }) => {
          const active = isActive(href, exact);
          const count  = badge === "pendentes" ? pendentes : badge === "eventos" ? eventos : 0;
          return (
            <a key={id} href={href} className={`sde-bn-item ${active ? "active" : ""}`}>
              <span className="sde-bn-icon">
                {icon}
                {count > 0 && <span className="sde-bn-badge">{count > 9 ? "9+" : count}</span>}
              </span>
              <span className="sde-bn-label">{label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
