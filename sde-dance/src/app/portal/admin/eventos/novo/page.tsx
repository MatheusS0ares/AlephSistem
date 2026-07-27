import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createEvento } from "../actions";
import Link from "next/link";
import ImageUpload from "@/components/portal/ImageUpload";

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: { [k: string]: string } = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default async function NovoEventoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      <div>
        <p className="eyebrow mb-1">Eventos</p>
        <h1 className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Novo evento
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-ash)" }}>
          Preencha os dados. Depois você pode inscrever turmas ou alunos individualmente.
        </p>
      </div>

      <form action={createEvento} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Nome do evento *
          </label>
          <input name="nome" type="text" required placeholder="Ex: Espetáculo de Fim de Ano 2025"
            className={INPUT_CLS} style={INPUT_STY} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-[0.1em] uppercase"
              style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Tipo</label>
            <select name="tipo" className={INPUT_CLS} style={INPUT_STY}>
              <option value="espetaculo">Espetáculo</option>
              <option value="workshop">Workshop</option>
              <option value="aula_aberta">Aula aberta</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-[0.1em] uppercase"
              style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Vagas (opcional)</label>
            <input name="vagas" type="number" min="1" placeholder="Ilimitado se vazio"
              className={INPUT_CLS} style={INPUT_STY} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-[0.1em] uppercase"
              style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Data</label>
            <input name="data_evento" type="date" className={INPUT_CLS} style={INPUT_STY} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-[0.1em] uppercase"
              style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Horário</label>
            <input name="horario" type="text" placeholder="Ex: 19h00"
              className={INPUT_CLS} style={INPUT_STY} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Local / Endereço</label>
          <input name="local" type="text" placeholder="Ex: Teatro Municipal · Rua das Artes, 100"
            className={INPUT_CLS} style={INPUT_STY} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>Descrição / Observações</label>
          <textarea name="descricao" rows={4} placeholder="Informações adicionais, figurino, horário de chegada…"
            className={INPUT_CLS} style={{ ...INPUT_STY, resize: "vertical" } as any} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-[0.1em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Imagem do evento
          </label>
          <ImageUpload bucket="imagens-eventos" fieldName="imagem_url" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="flex-1 py-2.5 text-sm border transition-colors hover:opacity-90"
            style={{
              borderColor: "var(--color-spot)", color: "var(--color-bone)",
              backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
            }}>
            Criar evento
          </button>
          <Link href="/portal/admin/eventos"
            className="px-4 py-2.5 text-sm border flex items-center"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Cancelar
          </Link>
        </div>
      </form>

      <div className="p-4 border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <p className="text-xs font-semibold mb-3"
          style={{ color: "var(--color-bone)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          COMO FUNCIONA
        </p>
        <ol className="flex flex-col gap-2">
          {[
            "Crie o evento com nome, data e local.",
            "Na página do evento, inscreva uma turma inteira — todos os alunos ativos entram automaticamente.",
            "Você também pode adicionar alunos individualmente.",
            "Marque cada aluno como Confirmado conforme a participação for garantida.",
            "Remova inscrições que não forem acontecer.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--color-ash)" }}>
              <span className="shrink-0 text-xs mt-0.5"
                style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
