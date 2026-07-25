"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "login" | "register" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/portal";

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ nome: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const configured = isSupabaseConfigured();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
    setEmailSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setError("");
    setLoading(true);

    const supabase = createClient();

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nome: form.nome, tipo: "aluno" } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    router.push(redirectTo);
    router.refresh();
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

        {!configured ? (
          <div className="p-8 border text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            <p className="text-sm mb-2" style={{ color: "var(--color-bone)" }}>Portal em configuração</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-ash)" }}>
              O acesso ao portal ainda não está disponível. Entre em contato via WhatsApp.
            </p>
            <a href="/" className="inline-block mt-6 text-xs underline" style={{ color: "var(--color-spot)" }}>
              ← Voltar ao site
            </a>
          </div>
        ) : mode === "forgot" ? (
          <div className="p-8 border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            {emailSent ? (
              <div className="text-center">
                <div className="text-3xl mb-3">✉️</div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-bone)" }}>
                  E-mail enviado!
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-ash)" }}>
                  Verifique sua caixa de entrada e clique no link para definir uma nova senha.
                </p>
                <button onClick={() => switchMode("login")}
                  className="mt-6 text-xs underline" style={{ color: "var(--color-spot)" }}>
                  ← Voltar para o login
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => switchMode("login")}
                  className="text-xs mb-6 block" style={{ color: "var(--color-ash)" }}>
                  ← Voltar
                </button>
                <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--color-bone)" }}>
                  Recuperar senha
                </h2>
                <p className="text-xs mb-6" style={{ color: "var(--color-ash)" }}>
                  Informe seu e-mail e enviaremos um link para redefinir a senha.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Field id="email-forgot" label="E-mail" type="email"
                    value={form.email} onChange={set("email")} />
                  {error && (
                    <p className="text-xs px-3 py-2 border"
                      style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)" }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" disabled={loading}
                    className="mt-2 w-full py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                    style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
                    {loading ? "Enviando…" : "Enviar link de recuperação"}
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div className="p-8 border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            <div className="flex mb-8 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              {(["login", "register"] as const).map((m) => (
                <button key={m} type="button" onClick={() => switchMode(m)}
                  className="flex-1 pb-3 text-xs tracking-[0.15em] uppercase transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: mode === m ? "var(--color-spot)" : "var(--color-ash)",
                    borderBottom: mode === m ? "2px solid var(--color-spot)" : "2px solid transparent",
                    marginBottom: "-1px",
                  }}>
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <Field id="nome" label="Nome completo" type="text" value={form.nome} onChange={set("nome")} />
              )}
              <Field id="email" label="E-mail" type="email" value={form.email} onChange={set("email")} />
              <Field id="password" label="Senha" type="password" value={form.password} onChange={set("password")} />

              {error && (
                <p className="text-xs px-3 py-2 border"
                  style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)" }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                className="mt-2 w-full py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
                {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar minha conta"}
              </button>
            </form>

            {mode === "login" && (
              <button onClick={() => switchMode("forgot")}
                className="w-full mt-4 text-xs text-center hover:underline"
                style={{ color: "var(--color-ash)" }}>
                Esqueci minha senha
              </button>
            )}
          </div>
        )}

        {configured && (
          <p className="text-center mt-6 text-xs" style={{ color: "var(--color-ash)" }}>
            <a href="/" className="hover:underline">← Voltar ao site</a>
          </p>
        )}
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
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={onChange} required
        className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200"
        style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-spot)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border-mid)")}
      />
    </div>
  );
}
