"use server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");
  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");
}

export async function convidarAluno(
  _prev: { ok?: boolean; error?: string },
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  await assertAdmin();

  const email = (formData.get("email") as string).trim().toLowerCase();
  const nome  = (formData.get("nome") as string).trim();
  if (!email) return { error: "E-mail obrigatório." };

  const url    = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!svcKey) {
    return {
      error: "SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione a variável no Vercel (Settings → Env Vars) e faça um novo deploy.",
    };
  }

  const admin = createAdminClient(url!, svcKey, { db: { schema: "sde_dance" } });

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { nome },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sde-dance.vercel.app"}/auth/callback?next=/portal`,
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já possui uma conta cadastrada." };
    }
    return { error: `Erro ao enviar convite: ${error.message}` };
  }

  return { ok: true };
}
