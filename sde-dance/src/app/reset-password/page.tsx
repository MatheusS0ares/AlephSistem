"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Link expirado ou inválido. Solicite um novo e-mail de recuperação.");
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/portal/login"), 2500);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--color-blackout)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-lg font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Senha atualizada!
          </h2>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>
            Redirecionando para o login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-blackout)" }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(110,16,35,0.15) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <a href="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-3xl font-bold tracking-wider"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>SDE</span>
            <span className="text-[0.6rem] tracking-[0.35em] uppercase" style={{ color: "var(--color-spot)" }}>
              DANCE — PORTAL
            </span>
          </a>
        </div>

        <div className="p-8 border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-bone)" }}>
            Definir nova senha
          </h2>
          <p className="text-xs mb-6" style={{ color: "var(--color-ash)" }}>
            Escolha uma senha com pelo menos 6 caracteres.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field id="password" label="Nova senha" type="password"
              value={password} onChange={e => setPassword(e.target.value)} />
            <Field id="confirm" label="Confirmar senha" type="password"
              value={confirm} onChange={e => setConfirm(e.target.value)} />

            {error && (
              <p className="text-xs px-3 py-2 border"
                style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="mt-2 w-full py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60"
              style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
              {loading ? "Salvando…" : "Salvar nova senha"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs">
          <a href="/portal/login" style={{ color: "var(--color-ash)" }} className="hover:underline">
            ← Voltar para o login
          </a>
        </p>
      </div>
    </div>
  );
}

function Field({ id, label, type, value, onChange }: {
  id: string; label: string; type: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs tracking-[0.15em] uppercase"
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} required
        className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200"
        style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
        onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
        onBlur={e  => (e.target.style.borderColor = "var(--border-mid)")} />
    </div>
  );
}
