"use client";
import { useState } from "react";
import { MdAdd, MdSearch, MdWarning, MdCheckCircle, MdKitchen, MdEdit, MdDelete, MdShoppingCart } from "react-icons/md";

const categories = ["Todos", "Grãos", "Laticínios", "Carnes", "Higiene", "Limpeza", "Bebidas", "Outros"];

const mockItems = [
  { id: "1", name: "Arroz", category: "Grãos", unit: "kg", current: 2, min: 3, emoji: "🍚" },
  { id: "2", name: "Feijão", category: "Grãos", unit: "kg", current: 1, min: 2, emoji: "🫘" },
  { id: "3", name: "Leite", category: "Laticínios", unit: "L", current: 0, min: 4, emoji: "🥛" },
  { id: "4", name: "Ovos", category: "Laticínios", unit: "unid", current: 12, min: 6, emoji: "🥚" },
  { id: "5", name: "Sabão em pó", category: "Limpeza", unit: "kg", current: 0.5, min: 1, emoji: "🧴" },
  { id: "6", name: "Papel higiênico", category: "Higiene", unit: "rolo", current: 8, min: 4, emoji: "🧻" },
  { id: "7", name: "Azeite", category: "Outros", unit: "ml", current: 250, min: 500, emoji: "🫙" },
  { id: "8", name: "Café", category: "Bebidas", unit: "g", current: 500, min: 500, emoji: "☕" },
  { id: "9", name: "Açúcar", category: "Grãos", unit: "kg", current: 3, min: 2, emoji: "🍬" },
  { id: "10", name: "Macarrão", category: "Grãos", unit: "kg", current: 1, min: 1, emoji: "🍝" },
];

export default function MantimentosPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(mockItems);

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "Todos" || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const low = filtered.filter((i) => i.current < i.min);
  const ok = filtered.filter((i) => i.current >= i.min);

  function addToShoppingList(itemId: string) {
    // TODO: adicionar à lista de compras no Supabase
    alert("Item adicionado à lista de compras!");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
            Mantimentos
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {low.length > 0 ? `${low.length} item(s) em falta ou abaixo do mínimo` : "Tudo em ordem na dispensa!"}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <MdAdd size={18} /> Novo item
        </button>
      </div>

      {/* Busca + Categorias */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", marginBottom: "0.875rem" }}>
          <MdSearch size={18} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar item..."
            className="input-field"
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                border: `1px solid ${categoryFilter === cat ? "#22c55e" : "var(--border)"}`,
                background: categoryFilter === cat ? "rgba(34,197,94,0.12)" : "transparent",
                color: categoryFilter === cat ? "#22c55e" : "var(--text-muted)",
                fontSize: "0.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: categoryFilter === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Itens em falta */}
      {low.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <MdWarning size={18} color="#fbbf24" />
            <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fbbf24" }}>Em falta / Abaixo do mínimo</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {low.map((item) => (
              <PantryItem key={item.id} item={item} onAddToList={() => addToShoppingList(item.id)} variant="low" />
            ))}
          </div>
        </div>
      )}

      {/* Itens ok */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <MdCheckCircle size={18} color="#22c55e" />
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>Estoque ok</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {ok.map((item) => (
            <PantryItem key={item.id} item={item} onAddToList={() => addToShoppingList(item.id)} variant="ok" />
          ))}
        </div>
      </div>

      {showModal && <AddPantryItemModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

interface PantryItemProps {
  item: typeof mockItems[0];
  onAddToList: () => void;
  variant: "low" | "ok";
}

function PantryItem({ item, onAddToList, variant }: PantryItemProps) {
  const [quantity, setQuantity] = useState(item.current);
  const pct = Math.min((quantity / item.min) * 100, 100);

  return (
    <div
      className="card"
      style={{
        padding: "0.875rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        borderColor: variant === "low" ? "rgba(251,191,36,0.25)" : undefined,
        background: variant === "low" ? "rgba(251,191,36,0.04)" : undefined,
      }}
    >
      <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>({item.category})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "var(--bg-secondary)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: 3,
                background: pct === 0 ? "#ef4444" : pct < 100 ? "#f59e0b" : "#22c55e",
                transition: "width 0.3s",
              }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            {quantity} / {item.min} {item.unit}
          </span>
        </div>
      </div>
      {/* Controle de quantidade */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
        <button
          onClick={() => setQuantity(Math.max(0, quantity - 1))}
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            cursor: "pointer", color: "var(--text-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          }}
        >−</button>
        <span style={{ minWidth: 24, textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            cursor: "pointer", color: "var(--text-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          }}
        >+</button>
      </div>
      {/* Adicionar à lista */}
      <button
        onClick={onAddToList}
        title="Adicionar à lista de compras"
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", padding: "0.25rem",
          display: "flex", alignItems: "center",
        }}
      >
        <MdShoppingCart size={18} />
      </button>
    </div>
  );
}

function AddPantryItemModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("unid");
  const [current, setCurrent] = useState(0);
  const [min, setMin] = useState(1);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 480, padding: "1.5rem" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
          Novo Item na Dispensa
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Nome do item</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Arroz" className="input-field" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Categoria</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" style={{ cursor: "pointer" }}>
                <option value="">Selecione</option>
                {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Unidade</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field" style={{ cursor: "pointer" }}>
                <option value="unid">Unidade</option>
                <option value="kg">Kg</option>
                <option value="g">Gramas</option>
                <option value="L">Litros</option>
                <option value="ml">ml</option>
                <option value="rolo">Rolo</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Qtd. atual</label>
              <input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} min="0" className="input-field" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Qtd. mínima</label>
              <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} min="1" className="input-field" />
            </div>
          </div>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Salvar item
          </button>
        </div>
      </div>
    </div>
  );
}
