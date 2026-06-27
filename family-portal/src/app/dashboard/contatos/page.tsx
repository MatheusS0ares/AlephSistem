"use client";
import { useState } from "react";
import { MdAdd, MdPhone, MdEmail, MdStar, MdLocalHospital, MdPeople, MdBusiness, MdClose } from "react-icons/md";

const contacts = [
  { id: "1", name: "Dr. Carlos Lima", relation: "Cardiologista", phone: "(11) 99999-1111", category: "Saúde", priority: 1, emoji: "👨‍⚕️" },
  { id: "2", name: "UPA Centro", relation: "Pronto-socorro", phone: "(11) 3333-2222", category: "Emergência", priority: 1, emoji: "🏥" },
  { id: "3", name: "Bombeiros", relation: "Emergência", phone: "193", category: "Emergência", priority: 0, emoji: "🚒" },
  { id: "4", name: "SAMU", relation: "Emergência médica", phone: "192", category: "Emergência", priority: 0, emoji: "🚑" },
  { id: "5", name: "Polícia Militar", relation: "Emergência", phone: "190", category: "Emergência", priority: 0, emoji: "🚔" },
  { id: "6", name: "João — Vizinho", relation: "Vizinho do 302", phone: "(11) 99888-7777", category: "Vizinhos", priority: 2, emoji: "🤝" },
  { id: "7", name: "Condomínio", relation: "Portaria", phone: "(11) 3333-9999", category: "Serviços", priority: 2, emoji: "🏢" },
  { id: "8", name: "Eletricista", relation: "João Elétrica", phone: "(11) 99777-6666", category: "Serviços", priority: 3, emoji: "⚡" },
];

const categories = ["Todos", "Emergência", "Saúde", "Vizinhos", "Serviços"];

export default function ContatosPage() {
  const [filter, setFilter] = useState("Todos");
  const [addModal, setAddModal] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);

  const filtered = contacts.filter((c) => filter === "Todos" || c.category === filter);
  const urgent = filtered.filter((c) => c.priority <= 1);
  const others = filtered.filter((c) => c.priority > 1);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Contatos de Emergência</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Acesso rápido aos contatos importantes</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary"><MdAdd size={18} /> Adicionar</button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{
              padding: "0.375rem 0.875rem", borderRadius: "9999px",
              border: `1px solid ${filter === cat ? "#f97316" : "var(--border)"}`,
              background: filter === cat ? "rgba(249,115,22,0.12)" : "transparent",
              color: filter === cat ? "#f97316" : "var(--text-muted)",
              fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap",
              fontWeight: filter === cat ? 600 : 400,
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Números de emergência */}
      {urgent.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
            <MdStar size={16} color="#f97316" />
            <h2 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f97316", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Prioridade máxima
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {urgent.map((c) => (
              <a
                key={c.id}
                href={`tel:${c.phone.replace(/\D/g, "")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.25)",
                  borderRadius: "0.875rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{c.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{c.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#f97316", fontWeight: 700 }}>{c.phone}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Outros contatos */}
      {others.length > 0 && (
        <div>
          <h2 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            Outros contatos
          </h2>
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {others.map((c, i) => (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                padding: "0.875rem 1rem",
                borderBottom: i < others.length - 1 ? "1px solid var(--border-light)" : "none",
              }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{c.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{c.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.relation}</div>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\D/g, "")}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 0.875rem",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    borderRadius: "9999px",
                    color: "#22c55e",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <MdPhone size={14} /> {c.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {addModal && <AddContactModal onClose={() => setAddModal(false)} />}
    </div>
  );
}

function AddContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 480, padding: "1.5rem" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Novo Contato</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><MdClose size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <input type="text" placeholder="Nome" className="input-field" />
          <input type="text" placeholder="Relação (ex: Médico, Vizinho)" className="input-field" />
          <input type="tel" placeholder="Telefone" className="input-field" />
          <select className="input-field" style={{ cursor: "pointer" }}>
            {["Emergência", "Saúde", "Vizinhos", "Serviços"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "#f97316" }}>
            <MdAdd size={18} /> Salvar contato
          </button>
        </div>
      </div>
    </div>
  );
}
