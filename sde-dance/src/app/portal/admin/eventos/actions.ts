"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");
  return supabase;
}

export async function createEvento(formData: FormData) {
  const supabase = await assertAdmin();

  const nome        = (formData.get("nome") as string).trim();
  const tipo        = (formData.get("tipo") as string) || "espetaculo";
  const data_evento = (formData.get("data_evento") as string) || null;
  const horario     = (formData.get("horario") as string) || null;
  const local       = (formData.get("local") as string) || null;
  const descricao   = (formData.get("descricao") as string) || null;
  const imagem_url  = (formData.get("imagem_url") as string) || null;
  const vagasRaw    = formData.get("vagas") as string;
  const vagas       = vagasRaw ? parseInt(vagasRaw) : null;

  if (!nome) return;

  const { data, error } = await supabase.from("eventos").insert({
    nome,
    tipo: tipo as any,
    data_evento,
    horario,
    local,
    descricao,
    vagas,
    imagem_url,
  }).select("id").single();

  if (error || !data) return;

  redirect(`/portal/admin/eventos/${data.id}`);
}

export async function updateEvento(id: string, formData: FormData) {
  const supabase = await assertAdmin();

  const nome        = (formData.get("nome") as string).trim();
  const tipo        = (formData.get("tipo") as string) || "espetaculo";
  const data_evento = (formData.get("data_evento") as string) || null;
  const horario     = (formData.get("horario") as string) || null;
  const local       = (formData.get("local") as string) || null;
  const descricao   = (formData.get("descricao") as string) || null;
  const imagem_url  = (formData.get("imagem_url") as string) || null;
  const vagasRaw    = formData.get("vagas") as string;
  const vagas       = vagasRaw ? parseInt(vagasRaw) : null;
  const ativo       = formData.get("ativo") === "1";

  await supabase.from("eventos").update({
    nome, tipo: tipo as any, data_evento, horario, local, descricao, vagas, imagem_url, ativo,
  }).eq("id", id);

  revalidatePath(`/portal/admin/eventos/${id}`);
  revalidatePath("/portal/admin/eventos");
}

export async function inscreverTurma(eventoId: string, formData: FormData) {
  const supabase = await assertAdmin();

  const turma_id = formData.get("turma_id") as string;
  if (!turma_id) return;

  const { data: matriculas } = await supabase
    .from("matriculas")
    .select("aluno_id")
    .eq("turma_id", turma_id)
    .eq("status", "ativa");

  if (!matriculas?.length) return;

  const inscricoes = matriculas.map(m => ({
    evento_id:  eventoId,
    aluno_id:   m.aluno_id,
    turma_id:   turma_id,
    confirmado: false,
  }));

  await supabase.from("evento_inscricoes").upsert(inscricoes, {
    onConflict: "evento_id,aluno_id",
    ignoreDuplicates: true,
  });

  revalidatePath(`/portal/admin/eventos/${eventoId}`);
}

export async function inscreverAluno(eventoId: string, formData: FormData) {
  const supabase = await assertAdmin();

  const aluno_id = formData.get("aluno_id") as string;
  const turma_id = (formData.get("turma_id") as string) || null;
  if (!aluno_id) return;

  await supabase.from("evento_inscricoes").upsert({
    evento_id:  eventoId,
    aluno_id,
    turma_id,
    confirmado: false,
  }, { onConflict: "evento_id,aluno_id", ignoreDuplicates: true });

  revalidatePath(`/portal/admin/eventos/${eventoId}`);
}

export async function toggleConfirmado(inscricaoId: string, confirmado: boolean) {
  const supabase = await assertAdmin();
  await supabase.from("evento_inscricoes").update({ confirmado }).eq("id", inscricaoId);
  revalidatePath("/portal/admin/eventos", "layout");
}

export async function removerInscricao(inscricaoId: string, eventoId: string) {
  const supabase = await assertAdmin();
  await supabase.from("evento_inscricoes").delete().eq("id", inscricaoId);
  revalidatePath(`/portal/admin/eventos/${eventoId}`);
}
