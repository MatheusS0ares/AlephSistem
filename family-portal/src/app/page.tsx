import Link from "next/link";
import {
  MdHome, MdAttachMoney, MdDescription, MdShoppingCart,
  MdCheckBox, MdCalendarMonth, MdFavorite, MdDirectionsCar,
  MdContactPhone, MdKitchen, MdArrowForward, MdShield
} from "react-icons/md";

const modules = [
  { icon: MdAttachMoney, label: "Financeiro", desc: "Gastos, cartões, planejamento" },
  { icon: MdDescription, label: "Documentos", desc: "RG, CNH, certidões e mais" },
  { icon: MdKitchen, label: "Mantimentos", desc: "Controle da dispensa" },
  { icon: MdShoppingCart, label: "Compras", desc: "Lista colaborativa + histórico" },
  { icon: MdCheckBox, label: "Tarefas", desc: "Divisão de tarefas da casa" },
  { icon: MdCalendarMonth, label: "Calendário", desc: "Agenda familiar compartilhada" },
  { icon: MdFavorite, label: "Saúde", desc: "Consultas, medicamentos, vacinas" },
  { icon: MdDirectionsCar, label: "Veículos", desc: "IPVA, revisão, seguro" },
  { icon: MdContactPhone, label: "Emergência", desc: "Contatos rápidos" },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdHome size={20} color="white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
            Casa <span style={{ color: "#22c55e" }}>Portal</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/auth/login" className="btn-secondary" style={{ textDecoration: "none" }}>
            Entrar
          </Link>
          <Link href="/auth/register" className="btn-primary" style={{ textDecoration: "none" }}>
            Criar Família
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem 3rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(34, 197, 94, 0.12)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "9999px",
            padding: "0.35rem 1rem",
            marginBottom: "1.5rem",
            fontSize: "0.8rem",
            color: "#4ade80",
          }}
        >
          <MdShield size={14} />
          Privado · Seguro · Só para sua família
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#f1f5f9",
            maxWidth: "700px",
            marginBottom: "1.25rem",
          }}
        >
          Tudo que a sua{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #22c55e, #4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            família precisa
          </span>{" "}
          em um só lugar
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#94a3b8",
            maxWidth: "560px",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
          }}
        >
          Portal completo para gestão do lar — finanças, documentos, compras,
          saúde, tarefas e muito mais. Cada família tem seu espaço privado.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/auth/register"
            className="btn-primary"
            style={{ fontSize: "1rem", padding: "0.875rem 2rem", textDecoration: "none" }}
          >
            Começar agora <MdArrowForward size={18} />
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary"
            style={{ fontSize: "1rem", padding: "0.875rem 2rem", textDecoration: "none" }}
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Módulos */}
      <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1.5rem",
            fontWeight: 600,
          }}
        >
          9 módulos integrados
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {modules.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="card"
              style={{ padding: "1.25rem", cursor: "default" }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "10px",
                  background: "rgba(34, 197, 94, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <Icon size={22} color="#22c55e" />
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f1f5f9", marginBottom: "0.25rem" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "1.5rem",
          color: "#475569",
          fontSize: "0.8rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        © {new Date().getFullYear()} Casa Portal · Aleph Sistem
      </footer>
    </main>
  );
}
