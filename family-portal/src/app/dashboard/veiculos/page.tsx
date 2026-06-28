"use client";
import { useState } from "react";
import { MdAdd, MdDirectionsCar, MdWarning, MdCalendarToday, MdLocalGasStation, MdBuild } from "react-icons/md";

const vehicles = [
  {
    id: "1",
    name: "Civic 2021",
    brand: "Honda",
    plate: "ABC-1D23",
    color: "#1e40af",
    fuel: "flex",
    ipva: "2026-07-31",
    insurance: "2026-10-15",
    revision: "2026-09-01",
    emoji: "🚗",
  },
];

export default function VeiculosPage() {
  const [selected, setSelected] = useState(vehicles[0]);

  const alerts = [
    { label: "IPVA", date: selected.ipva, color: "#f59e0b" },
    { label: "Seguro", date: selected.insurance, color: "#3b82f6" },
    { label: "Revisão", date: selected.revision, color: "#22c55e" },
  ].map((a) => ({
    ...a,
    days: Math.ceil((new Date(a.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  }));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
          🚗 Veículos da Família
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>IPVA, seguro, revisão e histórico de manutenção.</p>
      </div>
      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem", borderRadius: 16, fontSize: "1.05rem", fontWeight: 800, marginBottom: "1.5rem" }}>
        <MdAdd size={24} /> Adicionar veículo
      </button>

      {/* Card do veículo */}
      <div
        style={{
          background: `linear-gradient(135deg, ${selected.color}, ${selected.color}99)`,
          borderRadius: "1.25rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        <span style={{ fontSize: "3.5rem" }}>{selected.emoji}</span>
        <div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "white", marginBottom: "0.2rem" }}>{selected.name}</div>
          <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>{selected.brand} · {selected.plate}</div>
          <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginTop: "0.25rem", textTransform: "capitalize" }}>
            Combustível: {selected.fuel}
          </div>
        </div>
      </div>

      {/* Alertas */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>📅 Vencimentos importantes</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.875rem", marginBottom: "1.75rem" }}>
        {alerts.map(({ label, date, color, days }) => (
          <div key={label} className="card" style={{ padding: "1.125rem", borderLeft: `4px solid ${color}`, minHeight: 90 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color, marginBottom: "0.5rem" }}>
              {label}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              {new Date(date + "T12:00:00").toLocaleDateString("pt-BR")}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: days <= 30 ? "#d06a6a" : "var(--text-muted)" }}>
              {days <= 0 ? "⚠️ Vencido!" : `Em ${days} dias`}
            </div>
          </div>
        ))}
      </div>

      {/* Histórico de manutenções */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>🔧 Histórico de Manutenção</h2>
      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        {[
          { date: "2026-05-10", title: "Troca de óleo", km: "52.000", cost: 280, emoji: "🛢️" },
          { date: "2026-03-22", title: "Alinhamento e balanceamento", km: "50.000", cost: 150, emoji: "⚙️" },
          { date: "2026-01-15", title: "Revisão 50.000 km", km: "50.000", cost: 890, emoji: "🔧" },
        ].map((m, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "0.875rem",
            padding: "0.875rem 1rem",
            borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none",
          }}>
            <span style={{ fontSize: "1.4rem" }}>{m.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{m.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR")} · {m.km} km
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
              R$ {m.cost.toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
      </div>

      <button className="btn-secondary" style={{ marginTop: "1rem", width: "100%", justifyContent: "center", padding: "0.875rem", fontSize: "0.95rem", fontWeight: 700 }}>
        <MdBuild size={18} /> Registrar nova manutenção
      </button>
    </div>
  );
}
