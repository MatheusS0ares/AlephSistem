"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Step = "choice" | "login" | "register" | "confirm" | "done";

export default function MatriculaFlowClient({
  turmaId, linkId, turmaToken, userId, jaMatriculado,
}: {
  turmaId: string; linkId: string; turmaToken: string;
  userId: string | null; jaMatriculado: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<Step>(
    jaMatriculado ? "done" : userId ? "confirm" : "choice"
  );
  const [form, setForm] = useState({ nome: "", email: "", password: "", whatsapp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleAuth(mode: "login" | "register") {
    setError(""); setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { nome: form.nome, tipo: "aluno" } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      // Atualiza whatsapp no profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user && form.whatsapp) {
        await supabase.from("profiles").update({ whatsapp: form.whatsapp }).eq("id", user.id);
      }
    }
    setStep("confirm");
    setLoading(false);
  }

  async function confirmarMatricula() {
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sessão expirada. Faça login novamente."); setLoading(false); return; }

    // Insere matrícula
    const { error: errMat } = await supabase.from("matriculas").upsert({
      aluno_id: user.id, turma_id: turmaId, status: "pendente",
    });

    if (errMat) { setError("Erro ao realizar matrícula. Tente novamente."); setLoading(false); return; }

    // Incrementa uso do link
    await supabase.rpc("incrementar_uso_link" as any, { link_id: linkId });

    setStep("done");
    setLoading(false);
  }

  if (step === "done" || jaMatriculado) {
    return (
      <div className="p-8 border text-center" style={{ borderColor: "rgba(74,222,128,0.3)", backgroundColor: "rgba(74,222,128,0.05)" }}>
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          {jaMatriculado ? "Você já está matriculado!" : "Solicitação enviada!"}
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-ash)" }}>
          {jaMatriculado
            ? "Sua matrícula já estava registrada nesta turma."
            : "Aguarde a confirmação da escola pelo WhatsApp. Bem-vindo à SDE Dance!"}
        </p>
        <a href="/portal/aluno"
          className="inline-block px-6 py-2.5 text-sm font-semibold transition-all hover:brightness-110"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          Ir para meu portal
        </a>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="p-6 border flex flex-col gap-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <p className="text-sm" style={{ color: "var(--color-ash)" }}>
          Confirme sua solicitação de matrícula. A escola irá aprovar em breve.
        </p>
        {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}
        <button onClick={confirmarMatricula} disabled={loading}
          className="w-full py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          {loading ? "Enviando…" : "Confirmar matrícula"}
        </button>
      </div>
    );
  }

  if (step === "choice") {
    return (
      <div className="p-6 border flex flex-col gap-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <p className="text-sm text-center" style={{ color: "var(--color-ash)" }}>
          Para se matricular, você precisa criar uma conta ou entrar.
        </p>
        <button onClick={() => setStep("register")}
          className="w-full py-3 text-sm font-semibold transition-all hover:brightness-110"
          style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
          Criar minha conta
        </button>
        <button onClick={() => setStep("login")}
          className="w-full py-3 text-sm font-medium border transition-all hover:bg-white/5"
          style={{ borderColor: "var(--border-bold)", color: "var(--color-bone)" }}>
          Já tenho conta — entrar
        </button>
      </div>
    );
  }

  // login ou register
  return (
    <div className="p-6 border flex flex-col gap-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <button onClick={() => { setStep("choice"); setError(""); }}
        className="self-start text-xs" style={{ color: "var(--color-ash)" }}>
        ← Voltar
      </button>

      <h2 className="text-sm font-semibold" style={{ color: "var(--color-bone)" }}>
        {step === "login" ? "Entrar na sua conta" : "Criar conta"}
      </h2>

      <div className="flex flex-col gap-3">
        {step === "register" && (
          <>
            <AuthField id="nome" label="Nome completo" type="text" value={form.nome} onChange={set("nome")} required />
            <AuthField id="whatsapp" label="WhatsApp" type="tel" value={form.whatsapp} onChange={set("whatsapp")} />
          </>
        )}
        <AuthField id="email" label="E-mail" type="email" value={form.email} onChange={set("email")} required />
        <AuthField id="password" label="Senha" type="password" value={form.password} onChange={set("password")} required />
      </div>

      {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}

      <button onClick={() => handleAuth(step === "login" ? "login" : "register")} disabled={loading}
        className="w-full py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}>
        {loading ? "Aguarde…" : step === "login" ? "Entrar" : "Criar conta e matricular"}
      </button>
    </div>
  );
}

function AuthField({ id, label, type, value, onChange, required }: {
  id: string; label: string; type: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs tracking-[0.12em] uppercase"
        style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} required={required}
        className="w-full px-3 py-2.5 text-sm bg-transparent border outline-none transition-colors"
        style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
        onFocus={e => (e.target.style.borderColor = "var(--color-spot)")}
        onBlur={e => (e.target.style.borderColor = "var(--border-mid)")} />
    </div>
  );
}
