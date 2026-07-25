"use client";
import { useActionState } from "react";
import { convidarAluno } from "@/app/portal/admin/alunos/actions";

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: { [k: string]: string } = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default function ConvidarAlunoForm() {
  const [state, action, pending] = useActionState(convidarAluno, {});

  return (
    <form action={action} className="flex flex-col gap-3">
      {state.error && (
        <p className="text-xs px-3 py-2 border"
          style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", fontFamily: "var(--font-mono)" }}>
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="text-xs px-3 py-2 border"
          style={{ borderColor: "rgba(74,222,128,0.4)", color: "#4ade80", fontFamily: "var(--font-mono)" }}>
          ✓ Convite enviado! O aluno receberá um e-mail para criar a senha.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Nome completo</label>
          <input name="nome" type="text" placeholder="Nome do aluno"
            className={INPUT_CLS} style={INPUT_STY} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>E-mail *</label>
          <input name="email" type="email" required placeholder="email@exemplo.com"
            className={INPUT_CLS} style={INPUT_STY} />
        </div>
      </div>

      <button type="submit" disabled={pending}
        className="w-full py-2.5 text-sm border transition-colors hover:opacity-90 disabled:opacity-40"
        style={{
          borderColor: "var(--color-spot)", color: "var(--color-bone)",
          backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
        }}>
        {pending ? "Enviando convite…" : "Enviar convite por e-mail"}
      </button>

      <p className="text-xs" style={{ color: "var(--color-ash)" }}>
        O aluno recebe um link para criar a senha. Após o primeiro acesso, a conta fica ativa automaticamente.
      </p>
    </form>
  );
}
