"use client";
import { useState } from "react";
import { MdAdd, MdFavorite, MdMedicalServices, MdVaccines, MdScience, MdCalendarToday, MdPerson, MdNotifications } from "react-icons/md";

type Tab = "agenda" | "medicamentos" | "vacinas" | "exames";

const upcomingAppointments = [
  { id: "1", type: "appointment", title: "Cardiologista", member: "Matheus", date: "2026-07-05", doctor: "Dr. Carlos Lima", location: "Clínica Vida", emoji: "❤️" },
  { id: "2", type: "appointment", title: "Dentista", member: "Ana", date: "2026-07-10", doctor: "Dra. Priya Silva", location: "Odonto Plus", emoji: "🦷" },
  { id: "3", type: "exam", title: "Hemograma", member: "Matheus", date: "2026-07-03", location: "Lab Saúde", emoji: "🩸" },
];

const medications = [
  { id: "1", name: "Omeprazol 20mg", member: "Matheus", schedule: "1x por dia — manhã", stock: 15, emoji: "💊" },
  { id: "2", name: "Vitamina D 2000UI", member: "Ana", schedule: "1x por dia — almoço", stock: 30, emoji: "☀️" },
  { id: "3", name: "Anticoncepcional", member: "Ana", schedule: "1x por dia — noite", stock: 7, emoji: "💊" },
];

export default function SaudePage() {
  const [tab, setTab] = useState<Tab>("agenda");

  const tabs = [
    { id: "agenda" as Tab, label: "Agenda", icon: MdCalendarToday },
    { id: "medicamentos" as Tab, label: "Medicamentos", icon: MdMedicalServices },
    { id: "vacinas" as Tab, label: "Vacinas", icon: MdVaccines },
    { id: "exames" as Tab, label: "Exames", icon: MdScience },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Saúde</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Acompanhe a saúde de toda a família</p>
        </div>
        <button className="btn-primary"><MdAdd size={18} /> Novo registro</button>
      </div>

      {/* Próximas consultas destaque */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "0.875rem",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: 46, height: 46, borderRadius: "12px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MdFavorite size={24} color="#ef4444" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Próxima consulta</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Hemograma — Matheus · Sábado, 03/07</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            background: "rgba(239,68,68,0.15)",
            borderRadius: "9999px",
            color: "#f87171",
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          <MdNotifications size={14} /> Em 6 dias
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem", overflowX: "auto" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.625rem 1rem",
              background: "none", border: "none", cursor: "pointer",
              color: tab === id ? "#ef4444" : "var(--text-muted)",
              borderBottom: tab === id ? "2px solid #ef4444" : "2px solid transparent",
              fontSize: "0.875rem", fontWeight: tab === id ? 600 : 400,
              whiteSpace: "nowrap", marginBottom: "-1px",
            }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "agenda" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {upcomingAppointments.map((appt) => (
            <div key={appt.id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{appt.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{appt.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <MdPerson size={12} style={{ verticalAlign: "middle" }} /> {appt.member}
                  {appt.doctor ? ` · ${appt.doctor}` : ""}
                  {" · "}{appt.location}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {new Date(appt.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {new Date(appt.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "medicamentos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {medications.map((med) => (
            <div key={med.id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "1.75rem" }}>{med.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{med.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{med.schedule} · {med.member}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: med.stock <= 10 ? "#f87171" : "#22c55e" }}>
                  {med.stock} unid
                </div>
                <div style={{ fontSize: "0.7rem", color: med.stock <= 10 ? "#f87171" : "var(--text-muted)" }}>
                  {med.stock <= 10 ? "⚠ Repor logo" : "Em estoque"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "vacinas" && (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <MdVaccines size={48} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Registro de vacinas em breve</p>
          <button className="btn-primary" style={{ margin: "1rem auto 0", display: "inline-flex" }}>
            <MdAdd size={16} /> Registrar vacina
          </button>
        </div>
      )}

      {tab === "exames" && (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <MdScience size={48} color="var(--text-muted)" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Histórico de exames em breve</p>
          <button className="btn-primary" style={{ margin: "1rem auto 0", display: "inline-flex" }}>
            <MdAdd size={16} /> Adicionar exame
          </button>
        </div>
      )}
    </div>
  );
}
