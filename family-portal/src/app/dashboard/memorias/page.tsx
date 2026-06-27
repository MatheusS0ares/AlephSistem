"use client";
import { useState, useRef } from "react";
import { MdAdd, MdFavorite, MdClose, MdCalendarToday, MdLocationOn, MdPeople, MdSearch, MdDownload } from "react-icons/md";

interface Memory {
  id: string;
  title: string;
  date: string;
  location?: string;
  tags: string[];
  description?: string;
  color: string;
  emoji: string;
}

const mockMemories: Memory[] = [
  { id: "1", title: "Natal 2025", date: "2025-12-25", location: "Casa da vovó", tags: ["Família", "Natal"], description: "Um Natal inesquecível reunindo todos!", color: "#ef4444", emoji: "🎄" },
  { id: "2", title: "Aniversário de Casamento", date: "2025-09-12", location: "Restaurante Vila Italiana", tags: ["Casal", "Especial"], description: "5 anos juntos ❤️", color: "#ec4899", emoji: "💍" },
  { id: "3", title: "Viagem a Gramado", date: "2025-07-10", location: "Gramado, RS", tags: ["Viagem", "Férias"], description: "Primeira viagem dos dois juntos para o sul", color: "#3b82f6", emoji: "🏔️" },
  { id: "4", title: "Mudança para o novo apê", date: "2025-04-01", location: "Rua das Flores", tags: ["Casa", "Marco"], description: "Começo de um novo capítulo!", color: "#22c55e", emoji: "🏠" },
  { id: "5", title: "Formatura da Ana", date: "2024-12-10", location: "Universidade", tags: ["Conquista", "Estudo"], color: "#f59e0b", emoji: "🎓" },
  { id: "6", title: "Primeiro dia de Pedro", date: "2025-08-05", location: "Casa", tags: ["Pet", "Amor"], description: "Pedro chegou e roubou nossos corações 🐶", color: "#8b5cf6", emoji: "🐾" },
];

const allTags = [...new Set(mockMemories.flatMap((m) => m.tags))];

export default function MemoriasPage() {
  const [memories, setMemories] = useState<Memory[]>(mockMemories);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("Todos");
  const [selected, setSelected] = useState<Memory | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newMemory, setNewMemory] = useState({ title: "", date: "", location: "", description: "", emoji: "📸", color: "#22c55e" });

  const filtered = memories.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) || (m.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter === "Todos" || m.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const sortedByYear = filtered.reduce<Record<string, Memory[]>>((acc, m) => {
    const year = new Date(m.date + "T12:00:00").getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
            Álbum de Memórias
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{memories.length} memórias registradas</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <MdAdd size={18} /> Nova memória
        </button>
      </div>

      {/* Busca + Tags */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", marginBottom: "0.875rem" }}>
          <MdSearch size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar memória..." className="input-field" style={{ paddingLeft: "2.5rem" }} />
        </div>
        <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {["Todos", ...allTags].map((tag) => (
            <button key={tag} onClick={() => setTagFilter(tag)}
              style={{
                padding: "0.35rem 0.875rem", borderRadius: "9999px",
                border: `1px solid ${tagFilter === tag ? "#ec4899" : "var(--border)"}`,
                background: tagFilter === tag ? "rgba(236,72,153,0.12)" : "transparent",
                color: tagFilter === tag ? "#ec4899" : "var(--text-muted)",
                fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap",
                fontWeight: tagFilter === tag ? 600 : 400,
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline por ano */}
      {Object.entries(sortedByYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, items]) => (
          <div key={year} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ height: 2, flex: 1, background: "var(--border)" }} />
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-muted)", padding: "0 0.75rem" }}>{year}</span>
              <div style={{ height: 2, flex: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {items
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelected(m)}
                    style={{
                      borderRadius: "1rem",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid var(--border)",
                      transition: "transform 0.15s, box-shadow 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${m.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "none";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Placeholder visual (substituir por imagem real) */}
                    <div
                      style={{
                        height: 130,
                        background: `linear-gradient(135deg, ${m.color}30, ${m.color}15)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3.5rem",
                      }}
                    >
                      {m.emoji}
                    </div>
                    <div style={{ padding: "0.875rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.5rem" }}>
                        <MdCalendarToday size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {new Date(m.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                        </span>
                        {m.location && (
                          <>
                            <span style={{ color: "var(--border)" }}>·</span>
                            <MdLocationOn size={12} color="var(--text-muted)" />
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.location}</span>
                          </>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                        {m.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "9999px", background: `${m.color}20`, color: m.color, fontWeight: 600 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

      {/* Modal de detalhes */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem", width: "100%", maxWidth: 480, overflow: "hidden" }}>
            <div style={{ height: 180, background: `linear-gradient(135deg, ${selected.color}50, ${selected.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", position: "relative" }}>
              {selected.emoji}
              <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", color: "white", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MdClose size={18} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{selected.title}</h2>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  <MdCalendarToday size={14} />
                  {new Date(selected.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                {selected.location && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <MdLocationOn size={14} /> {selected.location}
                  </span>
                )}
              </div>
              {selected.description && (
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>{selected.description}</p>
              )}
              <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
                {selected.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "0.75rem", padding: "0.2rem 0.625rem", borderRadius: "9999px", background: `${selected.color}20`, color: selected.color, fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                <MdAdd size={16} /> Adicionar fotos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nova memória */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
          onClick={(e) => e.target === e.currentTarget && setAddModal(false)}>
          <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 520, padding: "1.5rem" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Nova Memória</h2>
              <button onClick={() => setAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><MdClose size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "0.75rem", alignItems: "center" }}>
                <button style={{ width: 64, height: 64, borderRadius: "1rem", background: "var(--bg-secondary)", border: "2px solid var(--border)", fontSize: "2rem", cursor: "pointer" }}>
                  {newMemory.emoji}
                </button>
                <input type="text" value={newMemory.title} onChange={(e) => setNewMemory((p) => ({ ...p, title: e.target.value }))} placeholder="Título da memória" className="input-field" autoFocus />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Data</label>
                  <input type="date" value={newMemory.date} onChange={(e) => setNewMemory((p) => ({ ...p, date: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Local (opcional)</label>
                  <input type="text" value={newMemory.location} onChange={(e) => setNewMemory((p) => ({ ...p, location: e.target.value }))} placeholder="Onde foi?" className="input-field" />
                </div>
              </div>
              <textarea
                value={newMemory.description}
                onChange={(e) => setNewMemory((p) => ({ ...p, description: e.target.value }))}
                placeholder="Conte um pouco sobre essa memória..."
                rows={3}
                className="input-field"
                style={{ resize: "none" }}
              />
              {/* Seletor de cor */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Cor</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["#22c55e", "#3b82f6", "#ec4899", "#ef4444", "#f59e0b", "#8b5cf6", "#f97316"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewMemory((p) => ({ ...p, color: c }))}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: c,
                        border: newMemory.color === c ? "3px solid white" : "none",
                        cursor: "pointer",
                        boxShadow: newMemory.color === c ? `0 0 0 2px ${c}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!newMemory.title || !newMemory.date) return;
                  setMemories((prev) => [...prev, { ...newMemory, id: Date.now().toString(), tags: [] }]);
                  setAddModal(false);
                }}
                disabled={!newMemory.title || !newMemory.date}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", background: newMemory.color }}
              >
                <MdFavorite size={18} /> Salvar memória
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
