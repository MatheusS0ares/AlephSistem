import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfessorForm from "../_ProfessorForm";
import { upsertProfessor } from "../actions";
import type { ProfData } from "@/lib/supabase/types";

export default async function EditarProfessorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: prof } = await supabase
    .from("professores")
    .select("*")
    .eq("id", id)
    .single();

  if (!prof) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
        Editar professor
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-ash)" }}>{(prof as ProfData).nome}</p>
      <ProfessorForm prof={prof as ProfData} action={upsertProfessor.bind(null, id)} />
    </div>
  );
}
