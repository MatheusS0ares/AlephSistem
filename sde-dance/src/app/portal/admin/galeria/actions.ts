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

export async function addFoto(formData: FormData) {
  const supabase = await assertAdmin();
  const src = (formData.get("src") as string).trim();
  const alt = (formData.get("alt") as string).trim();
  if (!src) return;
  await supabase.from("galeria").insert({ src, alt });
  revalidatePath("/portal/admin/galeria");
  revalidatePath("/");
}

export async function updateAlt(id: string, formData: FormData) {
  const supabase = await assertAdmin();
  const alt = (formData.get("alt") as string).trim();
  await supabase.from("galeria").update({ alt }).eq("id", id);
  revalidatePath("/portal/admin/galeria");
  revalidatePath("/");
}

export async function toggleAtivo(id: string, ativo: boolean) {
  const supabase = await assertAdmin();
  await supabase.from("galeria").update({ ativo }).eq("id", id);
  revalidatePath("/portal/admin/galeria");
  revalidatePath("/");
}

export async function deleteFoto(id: string) {
  const supabase = await assertAdmin();
  await supabase.from("galeria").delete().eq("id", id);
  revalidatePath("/portal/admin/galeria");
  revalidatePath("/");
}
