import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PortalIndex() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user.id)
    .single();

  const tipo = profile?.tipo ?? "aluno";
  if (tipo === "professor" || tipo === "admin") redirect("/portal/professor");
  redirect("/portal/aluno");
}
