"use client";
import { useState } from "react";
import { MdAdd, MdVaccines, MdMedicalServices, MdClose, MdCalendarToday, MdWarning } from "react-icons/md";

type Tab = "saude" | "vacinas" | "rotina";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: number;
  color: string;
  emoji: string;
  chip?: string;
  vet?: string;
}

interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDate?: string;
  vet?: string;
}

interface HealthRecord {
  id: string;
  petId: string;
  type: "consulta" | "vermifugo" | "pulgas" | "exame" | "outros";
  title: string;
  date: string;
  nextDate?: string;
  notes?: string;
  cost?: number;
}

const mockPets: Pet[] = [
  {
    id: "1",
    name: "Pedro",
    species: "Cachorro",
    breed: "Golden Retriever",
    birthDate: "2024-03-15",
    weight: 28,
    color: "#f59e0b",
    emoji: "🐕",
    chip: "900250000012345",
    vet: "Dr. Rodrigo (Clínica Pet Vida)",
  },
];

const mockVaccines: VaccineRecord[] = [
  { id: "1", petId: "1", name: "V10 (Múltipla)", date: "2025-08-05", nextDate: "2026-08-05", vet: "Dr. Rodrigo" },
  { id: "2", petId: "1", name: "Antirrábica", date: "2025-08-05", nextDate: "2026-08-05", vet: "Dr. Rodrigo" },
  { id: "3", petId: "1", name: "Giardia", date: "2025-09-10", nextDate: "2026-09-10" },
];

const mockHealth: HealthRecord[] = [
  { id: "1", petId: "1", type: "vermifugo", title: "Vermífugo mensal", date: "2026-06-01", nextDate: "2026-07-01", cost: 35 },
  { id: "2", petId: "1", type: "pulgas", title: "Antipulgas (Nexgard)", date: "2026-06-01", nextDate: "2026-07-01", cost: 65 },
  { id: "3", petId: "1", type: "consulta", title: "Consulta de rotina", date: "2026-05-20", cost: 120, notes: "Tudo ok! Peso ideal." },
  { id: "4", petId: "1", type: "exame", title: "Hemograma completo", date: "2026-05-20", cost: 180 },
];

const typeConfig = {
  consulta: { label: "Consulta", color: "#3b82f6", emoji: "🩺" },
  vermifugo: { label: "Vermífugo", color: "#22c55e", emoji: "💊" },
  pulgas: { label: "Antipulgas", color: "#8b5cf6", emoji: "🪲" },
  exame: { label: "Exame", color: "#f59e0b", emoji: "🔬" },
  outros: { label: "Outros", color: "#6b7280", emoji: "📋" },
};

export default function PetsPage() {
  const [pets] = useState<Pet[]>(mockPets);
  const [selectedPet, setSelectedPet] = useState<Pet>(mockPets[0]);
  const [tab, setTab] = useState<Tab>("saude");
  const [addModal, setAddModal] = useState(false);
  const [addPetModal, setAddPetModal] = useState(false);

  const petAge = (() => {
    const birth = new Date(selectedPet.birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months < 12 ? `${months} meses` : `${Math.floor(months / 12)} anos`;
  })();

  const nextAlerts = [
    ...mockVaccines
      .filter((v) => v.nextDate)
      .map((v) => ({ label: v.name, date: v.nextDate!, type: "Vacina", color: "#22c55e" })),
    ...mockHealth
      .filter((h) => h.nextDate)
      .map((h) => ({ label: h.title, date: h.nextDate!, type: typeConfig[h.type].label, color: typeConfig[h.type].color })),
  ]
    .filter((a) => new Date(a.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const tabs = [
    { id: "saude" as Tab, label: "Saúde", icon: MdMedicalServices },
    { id: "vacinas" as Tab, label: "Vacinas", icon: MdVaccines },
    { id: "rotina" as Tab, label: "Rotina", icon: MdCalendarToday },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Pets</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Cuidado e saúde dos seus animais</p>
        </div>
        <button onClick={() => setAddPetModal(true)} className="btn-primary"><MdAdd size={18} /> Adicionar pet</button>
      </div>

      {/* Seletor de pet */}
      <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => setSelectedPet(pet)}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1.25rem",
              background: selectedPet.id === pet.id ? `${pet.color}20` : "var(--bg-card)",
              border: `1px solid ${selectedPet.id === pet.id ? `${pet.color}60` : "var(--border)"}`,
              borderRadius: "0.875rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "2rem" }}>{pet.emoji}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{pet.name}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{pet.breed} · {petAge}</div>
            </div>
          </button>
        ))}

        <button
          onClick={() => setAddPetModal(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            padding: "0.875rem 1.25rem",
            border: "1px dashed var(--border)",
            borderRadius: "0.875rem",
            background: "transparent",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            flexShrink: 0,
          }}
        >
          <MdAdd size={18} /> Novo pet
        </button>
      </div>

      {/* Card do pet */}
      <div
        style={{
          background: `linear-gradient(135deg, ${selectedPet.color}25, ${selectedPet.color}10)`,
          border: `1px solid ${selectedPet.color}30`,
          borderRadius: "1rem",
          padding: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "4rem", flexShrink: 0 }}>{selectedPet.emoji}</span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{selectedPet.name}</h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            {selectedPet.species} · {selectedPet.breed} · {petAge}
          </div>
          {selectedPet.vet && (
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>🩺 {selectedPet.vet}</div>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedPet.weight} kg</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Peso</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {new Date(selectedPet.birthDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Aniversário</div>
          </div>
        </div>
      </div>

      {/* Próximos eventos */}
      {nextAlerts.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <MdWarning size={16} color="#f59e0b" />
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f59e0b" }}>Próximos cuidados</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {nextAlerts.map((a, i) => {
              const days = Math.ceil((new Date(a.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={i} className="card" style={{ padding: "0.875rem", borderLeft: `3px solid ${a.color}` }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: a.color, marginBottom: "0.25rem" }}>{a.type}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.label}</div>
                  <div style={{ fontSize: "0.72rem", color: days <= 7 ? "#f87171" : "var(--text-muted)" }}>
                    Em {days} dias · {new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.625rem 1rem",
              background: "none", border: "none", cursor: "pointer",
              color: tab === id ? selectedPet.color : "var(--text-muted)",
              borderBottom: tab === id ? `2px solid ${selectedPet.color}` : "2px solid transparent",
              fontSize: "0.875rem", fontWeight: tab === id ? 600 : 400,
              whiteSpace: "nowrap", marginBottom: "-1px",
            }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "saude" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>Histórico de saúde</h3>
            <button onClick={() => setAddModal(true)} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
              <MdAdd size={14} /> Novo registro
            </button>
          </div>
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {mockHealth.map((h, i) => {
              const cfg = typeConfig[h.type];
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1rem", borderBottom: i < mockHealth.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{cfg.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.15rem" }}>{h.title}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {new Date(h.date + "T12:00:00").toLocaleDateString("pt-BR")}
                      {h.notes ? ` · ${h.notes}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {h.cost && <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>R$ {h.cost}</div>}
                    <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: `${cfg.color}15`, color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "vacinas" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>Carteirinha de vacinas</h3>
            <button onClick={() => setAddModal(true)} className="btn-secondary" style={{ fontSize: "0.8rem" }}>
              <MdAdd size={14} /> Registrar vacina
            </button>
          </div>
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {mockVaccines.map((v, i) => {
              const daysToNext = v.nextDate
                ? Math.ceil((new Date(v.nextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;
              return (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1rem", borderBottom: i < mockVaccines.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <span style={{ fontSize: "1.4rem" }}>💉</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.15rem" }}>{v.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      Aplicada em {new Date(v.date + "T12:00:00").toLocaleDateString("pt-BR")}
                      {v.vet ? ` · ${v.vet}` : ""}
                    </div>
                  </div>
                  {v.nextDate && (
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: daysToNext! <= 30 ? "#f87171" : "#22c55e" }}>
                        Reforço em {daysToNext} dias
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {new Date(v.nextDate + "T12:00:00").toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "rotina" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "Ração diária", desc: "3x por dia — 150g cada", icon: "🍖" },
            { label: "Banho", desc: "A cada 15 dias", icon: "🛁" },
            { label: "Escovação dos dentes", desc: "3x por semana", icon: "🦷" },
            { label: "Escovação do pelo", desc: "Diária", icon: "🪮" },
            { label: "Passeio", desc: "2x por dia — manhã e tarde", icon: "🦮" },
          ].map((r, i) => (
            <div key={i} className="card" style={{ padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{r.label}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.desc}</div>
              </div>
            </div>
          ))}
          <button className="btn-secondary" style={{ fontSize: "0.85rem", justifyContent: "center" }}>
            <MdAdd size={16} /> Editar rotina do {selectedPet.name}
          </button>
        </div>
      )}

      {/* Modal add pet */}
      {addPetModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setAddPetModal(false)}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 500, padding: "1.5rem" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Novo Pet</h2>
              <button onClick={() => setAddPetModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><MdClose size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Nome</label>
                  <input type="text" placeholder="Nome do pet" className="input-field" autoFocus />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Espécie</label>
                  <select className="input-field" style={{ cursor: "pointer" }}>
                    <option>Cachorro</option>
                    <option>Gato</option>
                    <option>Ave</option>
                    <option>Peixe</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>
              <input type="text" placeholder="Raça" className="input-field" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Data de nascimento</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Peso (kg)</label>
                  <input type="number" placeholder="0.0" step="0.1" min="0" className="input-field" />
                </div>
              </div>
              <input type="text" placeholder="Veterinário de confiança (opcional)" className="input-field" />
              <button onClick={() => setAddPetModal(false)} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <MdAdd size={18} /> Cadastrar pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
