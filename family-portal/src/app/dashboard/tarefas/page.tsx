"use client";
import { useState } from "react";
import { MdAdd, MdCheck, MdStar, MdPerson, MdRepeat, MdClose, MdFlag } from "react-icons/md";

type Priority = "low" | "medium" | "high";
type Status = "pending" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  recurring?: string;
  points: number;
  emoji: string;
}

const mockTasks: Task[] = [
  { id: "1", title: "Lavar louça", assignedTo: "Ana", priority: "medium", status: "pending", recurring: "daily", points: 5, emoji: "🍽️" },
  { id: "2", title: "Aspirar sala", assignedTo: "Matheus", priority: "medium", status: "in_progress", dueDate: "2026-06-28", points: 10, emoji: "🏠" },
  { id: "3", title: "Pagar contas", assignedTo: "Matheus", priority: "high", status: "pending", dueDate: "2026-06-30", points: 15, emoji: "💳" },
  { id: "4", title: "Trocar filtro da água", assignedTo: "Ana", priority: "low", status: "done", points: 8, emoji: "💧" },
  { id: "5", title: "Limpar banheiro", assignedTo: "Ana", priority: "medium", status: "done", recurring: "weekly", points: 12, emoji: "🚿" },
  { id: "6", title: "Comprar remédio", assignedTo: "Matheus", priority: "high", status: "pending", dueDate: "2026-06-27", points: 10, emoji: "💊" },
];

const members = ["Todos", "Ana", "Matheus"];

const priorityConfig = {
  low: { color: "#22c55e", label: "Baixa" },
  medium: { color: "#f59e0b", label: "Média" },
  high: { color: "#ef4444", label: "Alta" },
};

const scores = {
  Ana: mockTasks.filter((t) => t.status === "done" && t.assignedTo === "Ana").reduce((s, t) => s + t.points, 0),
  Matheus: mockTasks.filter((t) => t.status === "done" && t.assignedTo === "Matheus").reduce((s, t) => s + t.points, 0),
};

export default function TarefasPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [memberFilter, setMemberFilter] = useState("Todos");
  const [addModal, setAddModal] = useState(false);

  const filtered = tasks.filter((t) => memberFilter === "Todos" || t.assignedTo === memberFilter);
  const pending = filtered.filter((t) => t.status !== "done");
  const done = filtered.filter((t) => t.status === "done");

  function completeTask(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "done" as Status } : t));
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.2rem" }}>Tarefas da Casa</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{pending.length} pendentes · {done.length} concluídas</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <MdAdd size={18} /> Nova tarefa
        </button>
      </div>

      {/* Placar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {Object.entries(scores).map(([name, pts]) => (
          <div key={name} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "0.85rem", flexShrink: 0 }}>
              {name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{name}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <MdStar size={16} color="#f59e0b" /> {pts} pts
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtro por membro */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.25rem" }}>
        {members.map((m) => (
          <button
            key={m}
            onClick={() => setMemberFilter(m)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              border: `1px solid ${memberFilter === m ? "#22c55e" : "var(--border)"}`,
              background: memberFilter === m ? "rgba(34,197,94,0.12)" : "transparent",
              color: memberFilter === m ? "#22c55e" : "var(--text-muted)",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: memberFilter === m ? 600 : 400,
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Pendentes */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
            Pendentes ({pending.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {pending.map((task) => <TaskCard key={task.id} task={task} onComplete={() => completeTask(task.id)} />)}
          </div>
        </div>
      )}

      {/* Concluídas */}
      {done.length > 0 && (
        <div>
          <h2 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>
            Concluídas ({done.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", opacity: 0.65 }}>
            {done.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>
      )}

      {addModal && <AddTaskModal onClose={() => setAddModal(false)} />}
    </div>
  );
}

function TaskCard({ task, onComplete }: { task: Task; onComplete?: () => void }) {
  const pc = priorityConfig[task.priority];
  const isDone = task.status === "done";

  return (
    <div
      className="card"
      style={{
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        borderLeft: `3px solid ${isDone ? "var(--border)" : pc.color}`,
      }}
    >
      {/* Check button */}
      {!isDone && onComplete ? (
        <button
          onClick={onComplete}
          style={{
            width: 30, height: 30, borderRadius: "50%",
            border: `2px solid ${pc.color}`,
            background: "transparent",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `${pc.color}20`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdCheck size={16} color={pc.color} />
        </button>
      ) : (
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <MdCheck size={16} color="white" />
        </div>
      )}

      <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{task.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", textDecoration: isDone ? "line-through" : "none", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {task.title}
        </div>
        <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            <MdPerson size={12} /> {task.assignedTo}
          </span>
          {task.recurring && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              <MdRepeat size={12} /> {task.recurring === "daily" ? "Diário" : task.recurring === "weekly" ? "Semanal" : "Mensal"}
            </span>
          )}
          {task.dueDate && !isDone && (
            <span style={{ fontSize: "0.72rem", color: new Date(task.dueDate) < new Date() ? "#f87171" : "var(--text-muted)" }}>
              Vence {new Date(task.dueDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem", flexShrink: 0 }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: pc.color }}>
          <MdFlag size={10} /> {pc.label}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.72rem", color: "#f59e0b", fontWeight: 600 }}>
          <MdStar size={12} /> {task.points}
        </span>
      </div>
    </div>
  );
}

function AddTaskModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--bg-secondary)", borderRadius: "1.25rem 1.25rem 0 0", width: "100%", maxWidth: 500, padding: "1.5rem" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 1.25rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Nova Tarefa</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><MdClose size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" placeholder="O que precisa ser feito?" className="input-field" autoFocus />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Responsável</label>
              <select className="input-field" style={{ cursor: "pointer" }}>
                <option>Ana</option>
                <option>Matheus</option>
                <option>Família</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Prioridade</label>
              <select className="input-field" style={{ cursor: "pointer" }}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Prazo</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Recorrência</label>
              <select className="input-field" style={{ cursor: "pointer" }}>
                <option value="">Sem recorrência</option>
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>
          <button onClick={onClose} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            <MdAdd size={18} /> Criar tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
