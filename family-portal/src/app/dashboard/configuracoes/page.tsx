"use client";
import { useTheme } from "@/components/layout/ThemeProvider";
import { MdLightMode, MdDarkMode, MdNotifications, MdSecurity, MdLogout, MdPerson, MdLanguage } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ConfiguracoesPage() {
  const { theme, toggle } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  const sections = [
    {
      title: "Aparência",
      items: [
        {
          icon: theme === "dark" ? MdDarkMode : MdLightMode,
          label: "Tema",
          desc: theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado",
          action: toggle,
          actionLabel: theme === "dark" ? "Mudar para claro" : "Mudar para escuro",
        },
      ],
    },
    {
      title: "Notificações",
      items: [
        { icon: MdNotifications, label: "Alertas de vencimento", desc: "Documentos e veículos prestes a vencer" },
        { icon: MdNotifications, label: "Lembretes de tarefas", desc: "Tarefas com prazo próximo" },
      ],
    },
    {
      title: "Segurança",
      items: [
        { icon: MdSecurity, label: "Alterar senha", desc: "Atualize sua senha de acesso" },
        { icon: MdPerson, label: "Meu perfil", desc: "Nome, foto e informações pessoais" },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2rem" }}>Configurações</h1>

      {sections.map(({ title, items }) => (
        <div key={title} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
            {title}
          </h2>
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            {items.map(({ icon: Icon, label, desc, action, actionLabel }, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderBottom: i < items.length - 1 ? "1px solid var(--border-light)" : "none",
                  cursor: action ? "pointer" : "default",
                }}
                onClick={action}
              >
                <div style={{ width: 38, height: 38, borderRadius: "10px", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: "0.15rem" }}>{label}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{desc}</div>
                </div>
                {actionLabel && (
                  <span style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600, whiteSpace: "nowrap" }}>{actionLabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.875rem 1.25rem",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "0.75rem",
          color: "#f87171",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <MdLogout size={18} /> Sair da conta
      </button>
    </div>
  );
}
