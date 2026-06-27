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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Veículos</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Controle de documentos e manutenção</p>
        </div>
        <button className="btn-primary"><MdAdd size={18} /> Adicionar veículo</button>
      </div>

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
      <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Vencimentos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.875rem", marginBottom: "1.5rem" }}>
        {alerts.map(({ label, date, color, days }) => (
          <div key={label} className="card" style={{ padding: "1rem", borderLeft: `3px solid ${color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <MdCalendarToday size={14} color={color} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color }}>
                {label}
              </span>
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              {new Date(date + "T12:00:00").toLocaleDateString("pt-BR")}
            </div>
            <div style={{ fontSize: "0.75rem", color: days <= 30 ? "#f87171" : "var(--text-muted)" }}>
              {days <= 0 ? "Vencido!" : `Em ${days} dias`}
            </div>
          </div>
        ))}
      </div>

      {/* Histórico de manutenções */}
      <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Histórico de Manutenção</h2>
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

      <button className="btn-secondary" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
        <MdBuild size={16} /> Registrar manutenção
      </button>
    </div>
  );
}
