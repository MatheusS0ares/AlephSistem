"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdHome, MdAttachMoney, MdDescription, MdShoppingCart,
  MdCheckBox, MdCalendarMonth, MdFavorite, MdDirectionsCar,
  MdContactPhone, MdKitchen, MdSettings, MdLogout, MdClose,
  MdPeople,
} from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: MdHome, label: "Início" },
  { href: "/dashboard/financeiro", icon: MdAttachMoney, label: "Financeiro" },
  { href: "/dashboard/documentos", icon: MdDescription, label: "Documentos" },
  { href: "/dashboard/mantimentos", icon: MdKitchen, label: "Mantimentos" },
  { href: "/dashboard/compras", icon: MdShoppingCart, label: "Compras" },
  { href: "/dashboard/tarefas", icon: MdCheckBox, label: "Tarefas" },
  { href: "/dashboard/calendario", icon: MdCalendarMonth, label: "Calendário" },
  { href: "/dashboard/saude", icon: MdFavorite, label: "Saúde" },
  { href: "/dashboard/veiculos", icon: MdDirectionsCar, label: "Veículos" },
  { href: "/dashboard/contatos", icon: MdContactPhone, label: "Emergência" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  familyName?: string;
}

export function Sidebar({ open, onClose, familyName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      <aside
        style={{
          width: 240,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          flexShrink: 0,
          transition: "transform 0.25s ease",
          zIndex: 50,
        }}
        className={`sidebar ${open ? "sidebar-open" : ""}`}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.25rem 1rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MdHome size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
                Casa Portal
              </div>
              {familyName && (
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                  {familyName}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="close-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "0.25rem",
              display: "none",
            }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0.5rem", overflowY: "auto" }}>
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.75rem",
                borderRadius: "0.5rem",
                marginBottom: "0.125rem",
                textDecoration: "none",
                color: isActive(href) ? "#22c55e" : "var(--text-secondary)",
                background: isActive(href) ? "rgba(34, 197, 94, 0.1)" : "transparent",
                fontWeight: isActive(href) ? 600 : 400,
                fontSize: "0.875rem",
                transition: "all 0.15s",
              }}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid var(--border)" }}>
          <Link
            href="/dashboard/familia"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              marginBottom: "0.125rem",
            }}
          >
            <MdPeople size={20} />
            Minha Família
          </Link>
          <Link
            href="/dashboard/configuracoes"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              marginBottom: "0.125rem",
            }}
          >
            <MdSettings size={20} />
            Configurações
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "0.5rem",
              color: "#f87171",
              fontSize: "0.875rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <MdLogout size={20} />
            Sair
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            height: 100vh;
            transform: translateX(-100%);
          }
          .sidebar-open {
            transform: translateX(0) !important;
          }
          .mobile-overlay { display: block !important; }
          .close-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
