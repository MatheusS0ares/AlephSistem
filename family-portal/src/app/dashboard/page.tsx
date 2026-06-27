"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdAttachMoney, MdDescription, MdShoppingCart,
  MdCheckBox, MdCalendarMonth, MdFavorite, MdDirectionsCar,
  MdContactPhone, MdKitchen, MdTrendingUp, MdTrendingDown,
  MdAdd, MdArrowForward, MdWarning,
} from "react-icons/md";
import { createClient } from "@/lib/supabase/client";

interface QuickStat {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down";
}

interface Module {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  color: string;
}

const modules: Module[] = [
  { href: "/dashboard/financeiro", icon: MdAttachMoney, label: "Financeiro", desc: "Controle de gastos e receitas", color: "#22c55e" },
  { href: "/dashboard/documentos", icon: MdDescription, label: "Documentos", desc: "Armazenamento seguro de docs", color: "#3b82f6" },
  { href: "/dashboard/mantimentos", icon: MdKitchen, label: "Mantimentos", desc: "Estoque da dispensa", color: "#f59e0b", badge: "3 em falta", badgeColor: "yellow" },
  { href: "/dashboard/compras", icon: MdShoppingCart, label: "Compras", desc: "Lista e histórico de compras", color: "#8b5cf6" },
  { href: "/dashboard/tarefas", icon: MdCheckBox, label: "Tarefas", desc: "Divisão de tarefas da casa", color: "#06b6d4", badge: "5 pendentes", badgeColor: "blue" },
  { href: "/dashboard/calendario", icon: MdCalendarMonth, label: "Calendário", desc: "Agenda familiar", color: "#ec4899" },
  { href: "/dashboard/saude", icon: MdFavorite, label: "Saúde", desc: "Consultas e medicamentos", color: "#ef4444" },
  { href: "/dashboard/veiculos", icon: MdDirectionsCar, label: "Veículos", desc: "Manutenção e documentos", color: "#6366f1" },
  { href: "/dashboard/contatos", icon: MdContactPhone, label: "Emergência", desc: "Contatos rápidos", color: "#f97316" },
];

export default function DashboardPage() {
  const [memberName, setMemberName] = useState("Usuário");
  const [greeting, setGreeting] = useState("Bom dia");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");

    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: member } = await supabase
        .from("family_members")
        .select("name")
        .eq("user_id", user.id)
        .single();
      if (member) setMemberName(member.name.split(" ")[0]);
    }
    load();
  }, []);

  const quickStats: QuickStat[] = [
    { label: "Saldo do mês", value: "R$ 3.450", sub: "+12% vs. mês passado", icon: MdAttachMoney, color: "#22c55e", trend: "up" },
    { label: "Gastos hoje", value: "R$ 127", sub: "3 transações", icon: MdTrendingDown, color: "#f87171", trend: "down" },
    { label: "Tarefas feitas", value: "7/12", sub: "Esta semana", icon: MdCheckBox, color: "#60a5fa" },
    { label: "Compras", value: "14 itens", sub: "Lista aberta", icon: MdShoppingCart, color: "#a78bfa" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Greeting */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
          {greeting}, {memberName} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Alerta */}
      <div
        style={{
          background: "rgba(251, 191, 36, 0.08)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
          borderRadius: "0.75rem",
          padding: "0.875rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <MdWarning size={20} color="#fbbf24" />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: "0.85rem", color: "#fbbf24", fontWeight: 600 }}>3 itens em falta na dispensa</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}> · IPVA do carro vence em 15 dias</span>
        </div>
        <Link href="/dashboard/mantimentos" style={{ fontSize: "0.8rem", color: "#fbbf24", textDecoration: "none", whiteSpace: "nowrap" }}>
          Ver tudo →
        </Link>
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {quickStats.map(({ label, value, sub, icon: Icon, color, trend }) => (
          <div key={label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  background: `${color}1a`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color={color} />
              </div>
              {trend && (
                <span style={{ fontSize: "0.75rem", color: trend === "up" ? "#4ade80" : "#f87171" }}>
                  {trend === "up" ? <MdTrendingUp size={16} /> : <MdTrendingDown size={16} />}
                </span>
              )}
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              {value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.875rem" }}>
          Ações rápidas
        </h2>
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          {[
            { label: "Lançar gasto", href: "/dashboard/financeiro?new=expense", color: "#22c55e" },
            { label: "Adicionar à lista", href: "/dashboard/compras?new=1", color: "#8b5cf6" },
            { label: "Item em falta", href: "/dashboard/mantimentos?falta=1", color: "#f59e0b" },
            { label: "Nova tarefa", href: "/dashboard/tarefas?new=1", color: "#06b6d4" },
          ].map(({ label, href, color }) => (
            <Link
              key={label}
              href={href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                background: `${color}18`,
                border: `1px solid ${color}40`,
                color,
                fontSize: "0.82rem",
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <MdAdd size={16} /> {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Módulos */}
      <div>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.875rem" }}>
          Módulos
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {modules.map(({ href, icon: Icon, label, desc, badge, badgeColor, color }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div
                className="card"
                style={{
                  padding: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background: `${color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} color={color} />
                  </div>
                  <MdArrowForward size={16} color="var(--text-muted)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{desc}</div>
                </div>
                {badge && (
                  <span className={`badge badge-${badgeColor}`}>{badge}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
