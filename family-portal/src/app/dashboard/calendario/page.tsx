"use client";
import { useState } from "react";
import { MdAdd, MdCalendarMonth, MdChevronLeft, MdChevronRight } from "react-icons/md";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const events = [
  { date: "2026-06-27", title: "Consulta cardiologista", color: "#ef4444", member: "Matheus" },
  { date: "2026-06-30", title: "Pagar aluguel", color: "#22c55e", member: "Família" },
  { date: "2026-07-05", title: "Aniversário da Ana", color: "#ec4899", member: "Família" },
  { date: "2026-07-10", title: "Dentista", color: "#3b82f6", member: "Ana" },
  { date: "2026-07-15", title: "Reunião escola", color: "#f59e0b", member: "Família" },
];

export default function CalendarioPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null;
    return i - firstDay + 1;
  });

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  }

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>Calendário Familiar</h1>
        <button className="btn-primary"><MdAdd size={18} /> Novo evento</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem" }} className="calendar-grid">
        {/* Calendário */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              style={{ background: "none", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-muted)", padding: "0.375rem", borderRadius: "0.5rem", display: "flex" }}
            >
              <MdChevronLeft size={20} />
            </button>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              style={{ background: "none", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-muted)", padding: "0.375rem", borderRadius: "0.5rem", display: "flex" }}
            >
              <MdChevronRight size={20} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", padding: "0.375rem 0" }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={day}
                  style={{
                    minHeight: 48,
                    padding: "0.25rem",
                    borderRadius: "0.5rem",
                    background: isToday ? "rgba(34,197,94,0.12)" : "transparent",
                    border: isToday ? "1px solid rgba(34,197,94,0.3)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => !isToday && ((e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)")}
                  onMouseLeave={(e) => !isToday && ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div style={{
                    fontSize: "0.8rem",
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? "#22c55e" : "var(--text-secondary)",
                    marginBottom: "0.2rem",
                    textAlign: "center",
                  }}>
                    {day}
                  </div>
                  {dayEvents.slice(0, 2).map((ev, j) => (
                    <div key={j} style={{ height: 5, borderRadius: 2, background: ev.color, marginBottom: 2 }} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximos eventos */}
        <div>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.875rem" }}>Próximos eventos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {upcomingEvents.map((ev) => (
              <div key={ev.date + ev.title} className="card" style={{ padding: "0.875rem", borderLeft: `3px solid ${ev.color}` }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{ev.title}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {new Date(ev.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                  {" · "}{ev.member}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .calendar-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
