"use client";
import { useState } from "react";
import {
  MdAttachMoney, MdAdd, MdTrendingUp, MdTrendingDown,
  MdCreditCard, MdCategory, MdCalendarMonth, MdFilterList,
  MdReceipt, MdSavings, MdPieChart,
} from "react-icons/md";
import { TransactionModal } from "@/components/financeiro/TransactionModal";
import { TransactionList } from "@/components/financeiro/TransactionList";
import { CreditCards } from "@/components/financeiro/CreditCards";
import { FinancialChart } from "@/components/financeiro/FinancialChart";

type Tab = "overview" | "transactions" | "cards" | "planning";

const tabs = [
  { id: "overview" as Tab, label: "Visão Geral", icon: MdPieChart },
  { id: "transactions" as Tab, label: "Lançamentos", icon: MdReceipt },
  { id: "cards" as Tab, label: "Cartões", icon: MdCreditCard },
  { id: "planning" as Tab, label: "Planejamento", icon: MdSavings },
];

export default function FinanceiroPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("expense");

  function openNew(type: "income" | "expense") {
    setModalType(type);
    setShowModal(true);
  }

  const summary = {
    income: 8500,
    expense: 5050,
    balance: 3450,
    savingsRate: 40.6,
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Financeiro
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Junho 2026</p>
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={() => openNew("income")} className="btn-secondary" style={{ fontSize: "0.85rem" }}>
            <MdTrendingUp size={16} /> Entrada
          </button>
          <button onClick={() => openNew("expense")} className="btn-primary" style={{ fontSize: "0.85rem" }}>
            <MdAdd size={16} /> Gasto
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Receitas", value: summary.income, icon: MdTrendingUp, color: "#22c55e", prefix: "R$ " },
          { label: "Gastos", value: summary.expense, icon: MdTrendingDown, color: "#f87171", prefix: "R$ " },
          { label: "Saldo", value: summary.balance, icon: MdAttachMoney, color: "#60a5fa", prefix: "R$ " },
          { label: "Taxa de Poupança", value: summary.savingsRate, icon: MdSavings, color: "#a78bfa", suffix: "%" },
        ].map(({ label, value, icon: Icon, color, prefix, suffix }) => (
          <div key={label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: "8px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {prefix}{value.toLocaleString("pt-BR")}{suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem", overflowX: "auto" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.625rem 1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === id ? "#22c55e" : "var(--text-muted)",
              borderBottom: tab === id ? "2px solid #22c55e" : "2px solid transparent",
              fontSize: "0.875rem",
              fontWeight: tab === id ? 600 : 400,
              whiteSpace: "nowrap",
              marginBottom: "-1px",
              transition: "all 0.15s",
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <FinancialChart />}
      {tab === "transactions" && <TransactionList onAdd={() => openNew("expense")} />}
      {tab === "cards" && <CreditCards />}
      {tab === "planning" && <FinancialPlanning summary={summary} />}

      {showModal && (
        <TransactionModal type={modalType} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function FinancialPlanning({ summary }: { summary: { income: number; expense: number; balance: number; savingsRate: number } }) {
  const budgets = [
    { category: "Alimentação", budget: 2000, spent: 1650, color: "#22c55e" },
    { category: "Transporte", budget: 800, spent: 720, color: "#3b82f6" },
    { category: "Lazer", budget: 500, spent: 380, color: "#8b5cf6" },
    { category: "Saúde", budget: 600, spent: 200, color: "#ef4444" },
    { category: "Educação", budget: 400, spent: 400, color: "#f59e0b" },
    { category: "Outros", budget: 700, spent: 180, color: "#6b7280" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Orçamento por categoria</h2>
        <button className="btn-secondary" style={{ fontSize: "0.8rem" }}>
          <MdCategory size={14} /> Editar orçamentos
        </button>
      </div>
      {budgets.map(({ category, budget, spent, color }) => {
        const pct = Math.min((spent / budget) * 100, 100);
        const over = spent > budget;
        return (
          <div key={category} className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }}>{category}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.85rem", color: over ? "#f87171" : "var(--text-primary)", fontWeight: 600 }}>
                  R$ {spent.toLocaleString("pt-BR")}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {" "}/ R$ {budget.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--bg-secondary)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 3,
                  background: over ? "#ef4444" : color,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
              <span style={{ fontSize: "0.72rem", color: over ? "#f87171" : "var(--text-muted)" }}>
                {over ? `R$ ${(spent - budget).toLocaleString("pt-BR")} acima do orçamento` : `R$ ${(budget - spent).toLocaleString("pt-BR")} restantes`}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{pct.toFixed(0)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
