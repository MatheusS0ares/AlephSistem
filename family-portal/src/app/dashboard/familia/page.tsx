"use client";
import { useState } from "react";
import { MdPersonAdd, MdSettings, MdStar, MdAdminPanelSettings, MdPerson, MdEmail, MdContentCopy } from "react-icons/md";

const mockMembers = [
  { id: "1", name: "Matheus", role: "owner", email: "matheus@email.com", points: 45, avatar: null },
  { id: "2", name: "Ana", role: "member", email: "ana@email.com", points: 60, avatar: null },
];

export default function FamiliaPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const inviteLink = "https://casaportal.com/auth/invite?fid=abc123&family=Família+Silva";

  function copyLink() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>Minha Família</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Família Silva · {mockMembers.length} membros</p>
      </div>

      {/* Membros */}
      <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Membros</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
        {mockMembers.map((m) => (
          <div key={m.id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "1rem", color: "white", flexShrink: 0,
            }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{m.name}</span>
                {m.role === "owner" && (
                  <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "9999px", background: "rgba(251,191,36,0.15)", color: "#fbbf24", fontWeight: 600 }}>
                    Admin
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <MdEmail size={12} /> {m.email}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#f59e0b", fontWeight: 700, fontSize: "0.9rem" }}>
                <MdStar size={16} /> {m.points}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>pontos</div>
            </div>
          </div>
        ))}
      </div>

      {/* Convidar */}
      <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Convidar membro</h2>
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Compartilhe o link de convite ou envie por e-mail. O novo membro criará o próprio login.
        </p>
        <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="input-field"
            style={{ flex: 1, fontSize: "0.78rem", color: "var(--text-muted)", minWidth: 200 }}
          />
          <button
            onClick={copyLink}
            className="btn-secondary"
            style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}
          >
            <MdContentCopy size={14} /> {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <MdEmail size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@exemplo.com" className="input-field" style={{ paddingLeft: "2.25rem" }} />
          </div>
          <button className="btn-primary" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            <MdPersonAdd size={16} /> Enviar convite
          </button>
        </div>
      </div>
    </div>
  );
}
