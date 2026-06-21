import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import MatriculaFlowClient from "@/components/portal/MatriculaFlowClient";

export default async function MatriculaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  type LinkRow = {
    id: string; token: string; ativo: boolean; validade: string | null; turma_id: string;
    turmas: { nome: string; modalidade: string; dias_semana: string; hora: string } | null;
  };

  // Busca o link e valida
  const { data: rawLink } = await supabase
    .from("links_matricula")
    .select("id, token, ativo, validade, turma_id, turmas (nome, modalidade, dias_semana, hora)")
    .eq("token", token)
    .single();

  const link = rawLink as LinkRow | null;
  if (!link || !link.ativo) notFound();
  if (link.validade && new Date(link.validade) < new Date()) {
    return <LinkExpirado />;
  }

  const turma = link.turmas as any;

  // Verifica se já está logado
  const { data: { user } } = await supabase.auth.getUser();
  let jaMatriculado = false;
  if (user) {
    const { data: mat } = await supabase
      .from("matriculas")
      .select("id")
      .eq("aluno_id", user.id)
      .eq("turma_id", link.turma_id)
      .single();
    jaMatriculado = Boolean(mat);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-blackout)" }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(110,16,35,0.15) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>SDE</span>
            <span className="text-[0.6rem] tracking-[0.35em] uppercase" style={{ color: "var(--color-spot)" }}>DANCE</span>
          </a>
        </div>

        {/* Card da turma */}
        <div className="mb-6 p-5 border text-center" style={{ borderColor: "rgba(231,182,92,0.3)", backgroundColor: "rgba(231,182,92,0.04)" }}>
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Você foi convidado para
          </p>
          <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            {turma?.nome}
          </h1>
          <p className="text-sm" style={{ color: "var(--color-ash)" }}>
            {turma?.dias_semana} · {turma?.hora}
          </p>
        </div>

        {/* Flow de cadastro/login */}
        <MatriculaFlowClient
          turmaId={link.turma_id}
          linkId={link.id}
          turmaToken={token}
          userId={user?.id ?? null}
          jaMatriculado={jaMatriculado}
        />
      </div>
    </div>
  );
}

function LinkExpirado() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="text-center">
        <p className="text-4xl mb-4" aria-hidden="true">⏰</p>
        <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Link expirado
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-ash)" }}>
          Este link de matrícula não é mais válido. Peça um novo link à escola.
        </p>
        <a href="/" className="text-sm" style={{ color: "var(--color-spot)" }}>← Voltar ao site</a>
      </div>
    </div>
  );
}
