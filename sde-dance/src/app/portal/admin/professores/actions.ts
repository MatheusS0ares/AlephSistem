"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertProfessor(id: string | null, formData: FormData): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const raw = {
    nome:        String(formData.get("nome")     || "").trim(),
    papel:       String(formData.get("papel")    || "").trim(),
    bio:         String(formData.get("bio")      || "").trim() || null,
    citacao:     String(formData.get("citacao")  || "").trim() || null,
    foto_url:    String(formData.get("foto_url") || "").trim() || null,
    instagram:   String(formData.get("instagram")|| "").trim().replace("@", "") || null,
    modalidades: String(formData.get("modalidades") || "")
      .split(",").map(s => s.trim()).filter(Boolean),
    ordem:     Number(formData.get("ordem"))    || 0,
    destaque:  formData.get("destaque") === "on",
    ativo:     formData.get("ativo")    === "on",
  };

  if (id) {
    const { error } = await supabase.from("professores").update(raw).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("professores").insert(raw);
    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/portal/admin/professores");
  return null;
}

export async function deleteProfessor(id: string) {
  const supabase = await createClient();
  await supabase.from("professores").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/portal/admin/professores");
}
