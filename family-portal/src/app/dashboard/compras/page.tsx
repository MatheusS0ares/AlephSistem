"use client";
import { useState } from "react";
import {
  MdAdd, MdShoppingCart, MdCheck, MdDelete, MdHistory,
  MdAttachMoney, MdClose, MdSearch, MdStore,
} from "react-icons/md";

type Tab = "lista" | "historico";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  actualPrice?: number;
  checked: boolean;
  category: string;
  emoji: string;
}

const initialItems: ShoppingItem[] = [
  { id: "1", name: "Arroz", quantity: 5, unit: "kg", estimatedPrice: 25, checked: false, category: "Grãos", emoji: "🍚" },
  { id: "2", name: "Feijão", quantity: 2, unit: "kg", estimatedPrice: 18, checked: false, category: "Grãos", emoji: "🫘" },
  { id: "3", name: "Leite", quantity: 6, unit: "L", estimatedPrice: 30, checked: false, category: "Laticínios", emoji: "🥛" },
  { id: "4", name: "Sabão em pó", quantity: 2, unit: "kg", estimatedPrice: 28, checked: false, category: "Limpeza", emoji: "🧴" },
  { id: "5", name: "Pão de forma", quantity: 2, unit: "unid", estimatedPrice: 12, checked: true, category: "Padaria", emoji: "🍞" },
  { id: "6", name: "Queijo", quantity: 400, unit: "g", estimatedPrice: 22, checked: true, category: "Laticínios", emoji: "🧀" },
];

const mockHistory = [
  { id: "1", date: "2026-06-15", store: "Carrefour", items: 24, total: 387.50 },
  { id: "2", date: "2026-06-02", store: "Extra", items: 18, total: 256.80 },
  { id: "3", date: "2026-05-20", store: "Atacadão", items: 35, total: 623.40 },
  { id: "4", date: "2026-05-05", store: "Carrefour", items: 21, total: 312.60 },
];

export default function ComprasPage() {
  const [tab, setTab] = useState<Tab>("lista");
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [priceModal, setPriceModal] = useState<ShoppingItem | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const unchecked = items.filter((i) => !i.checked && i.name.toLowerCase().includes(search.toLowerCase()));
  const checked = items.filter((i) => i.checked && i.name.toLowerCase().includes(search.toLowerCase()));
  const total = items.reduce((s, i) => s + (i.actualPrice ?? i.estimatedPrice ?? 0) * i.quantity, 0);
  const progress = items.length > 0 ? (checked.length / items.length) * 100 : 0;

  function toggleCheck(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Compras</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{checked.length}/{items.length} itens marcados</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <MdAdd size={18} /> Adicionar item
        </button>
      </div>

      {/* Progresso */}
      <div className="card" style={{ padding: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Progresso das compras</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: progress === 100 ? "#22c55e" : "var(--text-primary)" }}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--bg-secondary)", overflow: "hidden", marginBottom: "0.875rem" }}>
          <div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: "#22c55e", transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Estimado</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              R$ {items.reduce((s, i) => s + (i.estimatedPrice ?? 0) * i.quantity, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total atual</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#22c55e" }}>
              R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
        {(["lista", "historico"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.6rem 1.25rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === t ? "#22c55e" : "var(--text-muted)",
              borderBottom: tab === t ? "2px solid #22c55e" : "2px solid transparent",
              fontSize: "0.875rem",
              fontWeight: tab === t ? 600 : 400,
              marginBottom: "-1px",
            }}
          >
            {t === "lista" ? "Lista Atual" : "Histórico"}
          </button>
        ))}
      </div>

      {tab === "lista" && (
        <div>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <MdSearch size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar itens..." className="input-field" style={{ paddingLeft: "2.25rem" }} />
          </div>

          {/* Itens pendentes */}
          {unchecked.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
                Para pegar ({unchecked.length})
              </h3>
              <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                {unchecked.map((item, i) => (
                  <ShoppingItemRow
                    key={item.id}
                    item={item}
                    onCheck={() => toggleCheck(item.id)}
                    onRemove={() => removeItem(item.id)}
                    onPriceClick={() => setPriceModal(item)}
                    last={i === unchecked.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Itens marcados */}
          {checked.length > 0 && (
            <div>
              <h3 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
                No carrinho ({checked.length})
              </h3>
              <div className="card" style={{ overflow: "hidden", padding: 0, opacity: 0.7 }}>
                {checked.map((item, i) => (
                  <ShoppingItemRow
                    key={item.id}
                    item={item}
                    onCheck={() => toggleCheck(item.id)}
                    onRemove={() => removeItem(item.id)}
                    onPriceClick={() => setPriceModal(item)}
                    last={i === checked.length - 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "historico" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {mockHistory.map((h) => (
            <div key={h.id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: "10px", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MdStore size={22} color="#22c55e" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{h.store}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {new Date(h.date + "T12:00:00").toLocaleDateString("pt-BR")} · {h.items} itens
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                R$ {h.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de preço */}
      {priceModal && (
        <PriceModal
          item={priceModal}
          onSave={(price) => {
            setItems((prev) => prev.map((i) => i.id === priceModal.id ? { ...i, actualPrice: price, checked: true } : i));
            setPriceModal(null);
          }}
          onClose={() => setPriceModal(null)}
        />
      )}

      {addModal && <AddItemModal onClose={() => setAddModal(false)} onAdd={(item) => { setItems((prev) => [...prev, item]); setAddModal(false); }} />}
    </div>
  );
}

function ShoppingItemRow({ item, onCheck, onRemove, onPriceClick, last }: {
  item: ShoppingItem;
  onCheck: () => void;
  onRemove: () => void;
  onPriceClick: () => void;
  last: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.875rem 1rem",
        borderBottom: last ? "none" : "1px solid var(--border-light)",
        gap: "0.75rem",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={onCheck}
        style={{
          width: 26, height: 26, borderRadius: "50%",
          border: item.checked ? "none" : "2px solid var(--border)",
          background: item.checked ? "#22c55e" : "transparent",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {item.checked && <MdCheck size={16} color="white" />}
      </button>

      <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{item.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", textDecoration: item.checked ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.name}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {item.quantity} {item.unit}
          {item.estimatedPrice ? ` · ~R$ ${(item.estimatedPrice * item.quantity).toLocaleString("pt-BR")}` : ""}
        </div>
      </div>

      {/* Preço real (clicar para lançar) */}
      <button
        onClick={onPriceClick}
        style={{
          background: item.actualPrice ? "rgba(34,197,94,0.1)" : "var(--bg-secondary)",
          border: `1px solid ${item.actualPrice ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
          borderRadius: "0.5rem",
          padding: "0.3rem 0.625rem",
          cursor: "pointer",
          color: item.actualPrice ? "#22c55e" : "var(--text-muted)",
          fontSize: "0.78rem",
          fontWeight: item.actualPrice ? 700 : 400,
          display: "flex", alignItems: "center", gap: "0.25rem",
          whiteSpace: "nowrap",
        }}
      >
        <MdAttachMoney size={14} />
        {item.actualPrice ? `R$ ${(item.actualPrice * item.quantity).toFixed(2)}` : "Lançar"}
      </button>

      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", display: "flex" }}>
        <MdDelete size={18} />
      </button>
    </div>
  );
}

function PriceModal({ item, onSave, onClose }: { item: ShoppingItem; onSave: (price: number) => void; onClose: () => void }) {
  const [qty, setQty] = useState(item.quantity);
  const [unitPrice, setUnitPrice] = useState<number>(item.actualPrice ?? item.estimatedPrice ?? 0);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem", width: "100%", maxWidth: 380, padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "2rem" }}>{item.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{item.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.category}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <MdClose size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Quantidade</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-primary)", fontSize: "1.1rem" }}>−</button>
              <span style={{ flex: 1, textAlign: "center", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>{qty} {item.unit}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-primary)", fontSize: "1.1rem" }}>+</button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>Preço unitário</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>R$</span>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                step="0.01"
                min="0"
                className="input-field"
                style={{ paddingLeft: "2.5rem", fontSize: "1.1rem", fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.875rem 1rem",
              background: "rgba(34,197,94,0.08)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>Total do item</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#22c55e" }}>
              R$ {(unitPrice * qty).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button onClick={() => onSave(unitPrice)} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            <MdCheck size={18} /> Confirmar e marcar
          </button>
        </div>
      </div>
    </div>
  );
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: ShoppingItem) => void }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("unid");
  const [price, setPrice] = useState<number | undefined>();

  function handleAdd() {
    if (!name) return;
    onAdd({
      id: Date.now().toString(),
      name,
      quantity: qty,
      unit,
      estimatedPrice: price,
      checked: false,
      category: "Outros",
      emoji: "🛒",
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 480, padding: "1.5rem" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>Adicionar à lista</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do item" className="input-field" autoFocus />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Qtd.</label>
              <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min="1" className="input-field" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Unidade</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field" style={{ cursor: "pointer" }}>
                <option value="unid">unid</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="cx">cx</option>
                <option value="pct">pct</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Preço est.</label>
              <input type="number" value={price ?? ""} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="0,00" step="0.01" min="0" className="input-field" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={!name} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            <MdAdd size={18} /> Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
