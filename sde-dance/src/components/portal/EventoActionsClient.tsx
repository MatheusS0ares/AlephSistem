"use client";
import { useTransition } from "react";
import { toggleConfirmado, removerInscricao, inscreverTurma, inscreverAluno } from "@/app/portal/admin/eventos/actions";

const BTN = "text-xs px-2 py-1 border transition-colors hover:opacity-80 disabled:opacity-30";

type Turma = { id: string; nome: string };
type Aluno = { id: string; nome: string };

export function ToggleConfirmadoBtn({
  inscricaoId, confirmado,
}: { inscricaoId: string; confirmado: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} className={BTN}
      style={{
        borderColor: confirmado ? "rgba(74,222,128,0.5)" : "var(--border-mid)",
        color: confirmado ? "#4ade80" : "var(--color-ash)",
        fontFamily: "var(--font-mono)",
      }}
      onClick={() => start(() => toggleConfirmado(inscricaoId, !confirmado) as any)}>
      {confirmado ? "✓ Confirmado" : "Confirmar"}
    </button>
  );
}

export function RemoverInscricaoBtn({
  inscricaoId, eventoId,
}: { inscricaoId: string; eventoId: string }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} className={BTN}
      style={{ borderColor: "rgba(239,68,68,0.4)", color: "#ef4444", fontFamily: "var(--font-mono)" }}
      onClick={() => {
        if (!confirm("Remover esta inscrição?")) return;
        start(() => removerInscricao(inscricaoId, eventoId) as any);
      }}>
      {pending ? "…" : "Remover"}
    </button>
  );
}

export function InscreverTurmaForm({ eventoId, turmas }: { eventoId: string; turmas: Turma[] }) {
  const [pending, start] = useTransition();
  const S: { [k: string]: string } = {
    borderColor: "var(--border-mid)", color: "var(--color-bone)",
    fontFamily: "var(--font-mono)", backgroundColor: "var(--color-blackout)",
  };
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("turma_id")) return;
    start(() => inscreverTurma(eventoId, fd) as any);
  }
  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <select name="turma_id" required className="flex-1 px-3 py-2 text-sm border bg-transparent outline-none" style={S}>
        <option value="">Selecionar turma…</option>
        {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
      </select>
      <button type="submit" disabled={pending}
        className="px-4 py-2 text-sm border transition-colors hover:opacity-90 disabled:opacity-40 whitespace-nowrap"
        style={{ borderColor: "var(--color-spot)", color: "var(--color-bone)", backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)" }}>
        {pending ? "Inscrevendo…" : "Inscrever turma"}
      </button>
    </form>
  );
}

export function InscreverAlunoForm({
  eventoId, alunos, turmas,
}: { eventoId: string; alunos: Aluno[]; turmas: Turma[] }) {
  const [pending, start] = useTransition();
  const S: { [k: string]: string } = {
    borderColor: "var(--border-mid)", color: "var(--color-bone)",
    fontFamily: "var(--font-mono)", backgroundColor: "var(--color-blackout)",
  };
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("aluno_id")) return;
    start(() => inscreverAluno(eventoId, fd) as any);
    (e.currentTarget as HTMLFormElement).reset();
  }
  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <select name="aluno_id" required className="flex-1 min-w-0 px-3 py-2 text-sm border bg-transparent outline-none" style={S}>
        <option value="">Selecionar aluno…</option>
        {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
      </select>
      <select name="turma_id" className="px-3 py-2 text-sm border bg-transparent outline-none" style={{ ...S, maxWidth: "200px" }}>
        <option value="">Turma (opcional)</option>
        {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
      </select>
      <button type="submit" disabled={pending}
        className="px-4 py-2 text-sm border transition-colors hover:opacity-90 disabled:opacity-40 whitespace-nowrap"
        style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        {pending ? "…" : "+ Adicionar"}
      </button>
    </form>
  );
}
