import Link from "next/link";
import {
  MdHome, MdAttachMoney, MdDescription, MdShoppingCart,
  MdCheckBox, MdCalendarMonth, MdFavorite, MdDirectionsCar,
  MdContactPhone, MdKitchen, MdArrowForward, MdShield,
  MdRestaurant, MdBuild, MdLock, MdPhotoLibrary, MdPets,
} from "react-icons/md";

const modules = [
  { icon: MdAttachMoney,   label: "Financeiro",   desc: "Gastos, cartões e planejamento",     color: "#7aab8a" },
  { icon: MdDescription,   label: "Documentos",   desc: "RG, CNH, certidões e mais",          color: "#6a9fd4" },
  { icon: MdKitchen,       label: "Mantimentos",  desc: "Controle da dispensa",               color: "#c99a40" },
  { icon: MdShoppingCart,  label: "Compras",      desc: "Lista colaborativa + histórico",     color: "#a07acc" },
  { icon: MdRestaurant,    label: "Cardápio",     desc: "Planejamento de refeições",          color: "#d07a6a" },
  { icon: MdBuild,         label: "Obras",        desc: "Orçamento por ambiente",             color: "#7888d0" },
  { icon: MdCheckBox,      label: "Tarefas",      desc: "Divisão de tarefas da casa",         color: "#5aabb0" },
  { icon: MdCalendarMonth, label: "Calendário",   desc: "Agenda familiar compartilhada",      color: "#c07898" },
  { icon: MdFavorite,      label: "Saúde",        desc: "Consultas, medicamentos, vacinas",   color: "#d06a6a" },
  { icon: MdPets,          label: "Pets",         desc: "Vacinas, rotina e saúde dos pets",   color: "#88aa40" },
  { icon: MdPhotoLibrary,  label: "Memórias",     desc: "Álbum de fotos e marcos",            color: "#c07898" },
  { icon: MdDirectionsCar, label: "Veículos",     desc: "IPVA, revisão e seguro",             color: "#8a96a0" },
  { icon: MdContactPhone,  label: "Emergência",   desc: "Contatos rápidos",                   color: "#d07a6a" },
  { icon: MdLock,          label: "Cofre",        desc: "Senhas criptografadas",              color: "#7888d0" },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#faf9f6", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 2rem",
        borderBottom: "1px solid #ece6de",
        background: "#fff",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "12px",
            background: "linear-gradient(135deg, #7aab8a, #5a8b6a)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MdHome size={20} color="white" />
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2c2420" }}>
            Casa <span style={{ color: "#7aab8a" }}>Portal</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <Link href="/auth/login" style={{
            display: "inline-flex", alignItems: "center", padding: "0.55rem 1.1rem",
            borderRadius: "10px", border: "1.5px solid #ece6de",
            color: "#5c5248", fontSize: "0.875rem", fontWeight: 600,
            textDecoration: "none", transition: "all 0.15s",
          }}>
            Entrar
          </Link>
          <Link href="/auth/register" style={{
            display: "inline-flex", alignItems: "center", padding: "0.55rem 1.1rem",
            borderRadius: "10px", background: "#7aab8a",
            color: "#fff", fontSize: "0.875rem", fontWeight: 700,
            textDecoration: "none",
          }}>
            Criar Família
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: "5rem 1.5rem 4rem",
        background: "linear-gradient(180deg, #fff 0%, #faf9f6 100%)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          background: "rgba(122,171,138,0.12)", border: "1px solid rgba(122,171,138,0.28)",
          borderRadius: "9999px", padding: "0.35rem 1rem", marginBottom: "1.75rem",
          fontSize: "0.8rem", color: "#5a8b6a", fontWeight: 600,
        }}>
          <MdShield size={14} /> Privado · Seguro · Só para sua família
        </div>

        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 800, lineHeight: 1.15,
          color: "#2c2420", maxWidth: "680px", marginBottom: "1.25rem",
          letterSpacing: "-0.02em",
        }}>
          Tudo que a sua{" "}
          <span style={{ color: "#7aab8a" }}>família precisa</span>
          <br />em um só lugar
        </h1>

        <p style={{
          fontSize: "1.05rem", color: "#7a6f66", maxWidth: "520px",
          lineHeight: 1.7, marginBottom: "2.5rem",
        }}>
          Portal completo para o lar — finanças, documentos, compras,
          saúde, tarefas e muito mais. Cada família tem seu espaço privado.
        </p>

        <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/auth/register" style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.875rem 2rem", borderRadius: "12px",
            background: "#7aab8a", color: "#fff",
            fontSize: "1rem", fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(122,171,138,0.35)",
          }}>
            Começar agora <MdArrowForward size={18} />
          </Link>
          <Link href="/auth/login" style={{
            display: "inline-flex", alignItems: "center", padding: "0.875rem 2rem",
            borderRadius: "12px", border: "1.5px solid #ece6de",
            color: "#5c5248", fontSize: "1rem", fontWeight: 600, textDecoration: "none",
          }}>
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section style={{ padding: "2rem 1.5rem 5rem", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <p style={{
          textAlign: "center", color: "#9c8f86", fontSize: "0.78rem",
          textTransform: "uppercase", letterSpacing: "0.12em",
          marginBottom: "1.75rem", fontWeight: 700,
        }}>
          14 módulos integrados
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.875rem",
        }}>
          {modules.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: "16px", padding: "1.25rem",
              boxShadow: "0 4px 20px rgba(60,40,20,0.07)",
              border: "1px solid transparent",
              transition: "box-shadow 0.2s, transform 0.15s",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "12px",
                background: `${color}18`, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "0.75rem",
              }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#2c2420", marginBottom: "0.2rem" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.76rem", color: "#9c8f86", lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        textAlign: "center", padding: "1.5rem",
        color: "#b8aa9e", fontSize: "0.78rem",
        borderTop: "1px solid #ece6de",
        background: "#fff",
      }}>
        © {new Date().getFullYear()} Casa Portal · Aleph Sistem
      </footer>
    </main>
  );
}
