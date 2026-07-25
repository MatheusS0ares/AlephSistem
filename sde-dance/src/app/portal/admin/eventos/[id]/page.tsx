import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { updateEvento } from "../actions";
import {
  InscreverTurmaForm,
  InscreverAlunoForm,
  ToggleConfirmadoBtn,
  RemoverInscricaoBtn,
} from "@/components/portal/EventoActionsClient";

const INPUT_CLS = "w-full px-3 py-2 text-sm border bg-transparent outline-none";
const INPUT_STY: { [k: string]: string } = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-blackout)",
};

export default async function EventoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { id } = await params;
  const { edit } = await searchParams;

  const [eventoRes, inscricoesRes, turmasRes, alunosRes] = await Promise.all([
    supabase.from("eventos").select("*").eq("id", id).single(),
    supabase.from("evento_inscricoes").select("id, aluno_id, turma_id, confirmado, observacao, created_at").eq("evento_id", id).order("created_at"),
    supabase.from("turmas").select("id, nome").eq("ativo", true).order("nome"),
    supabase.from("profiles").select("id, nome").eq("tipo", "aluno").eq("ativo", true).order("nome"),
  ]);

  if (!eventoRes.data) notFound();

  const evento     = eventoRes.data as any;
  const inscricoes = (inscricoesRes.data ?? []) as any[];
  const turmas     = (turmasRes.data ?? []) as { id: string; nome: string }[];
  const alunos     = (alunosRes.data ?? []) as { id: string; nome: string }[];

  const alunoMap = alunos.reduce<Record<string, string>>((acc, a) => { acc[a.id] = a.nome; return acc; }, {});
  const turmaMap = turmas.reduce<Record<string, string>>((acc, t) => { acc[t.id] = t.nome; return acc; }, {});

  const confirmados = inscricoes.filter(i => i.confirmado).length;

  const tipoLabel: Record<string, string> = {
    espetaculo: "Espetáculo", workshop: "Workshop",
    aula_aberta: "Aula aberta", outro: "Outro",
  };

  const dataFormatada = evento.data_evento
    ? new Date(evento.data_evento + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "Data a definir";

  const updateWithId = updateEvento.bind(null, id);

  return (
    <div className="flex flex-col gap-8">

      <Link href="/portal/admin/eventos" className="text-xs self-start"
        style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        ← Todos os eventos
      </Link>

      {/* Header do evento */}
      <div className="p-5 border flex flex-col gap-2"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[0.65rem] px-1.5 py-0.5 border uppercase"
                style={{ color: "var(--color-spot)", borderColor: "rgba(231,182,92,0.3)", fontFamily: "var(--font-mono)" }}>
                {tipoLabel[evento.tipo] ?? evento.tipo}
              </span>
              {!evento.ativo && (
                <span className="text-[0.65rem] px-1.5 border"
                  style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}>
                  INATIVO
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
              {evento.nome}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
              {dataFormatada}{evento.horario ? ` · ${evento.horario}` : ""}
            </p>
            {evento.local && (
              <p className="text-sm" style={{ color: "var(--color-ash)" }}>{evento.local}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p className="text-2xl font-bold"
              style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>
              {inscricoes.length}
            </p>
            <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
              inscritos
            </p>
            <p className="text-xs" style={{ color: "#4ade80", fontFamily: "var(--font-mono)" }}>
              {confirmados} confirmados
            </p>
            {evento.vagas && (
              <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                {evento.vagas} vagas
              </p>
            )}
          </div>
        </div>
        {evento.descricao && (
          <p className="text-sm border-t pt-3 mt-1"
            style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)" }}>
            {evento.descricao}
          </p>
        )}
        <div className="flex justify-end pt-1">
          <Link href={`/portal/admin/eventos/${id}?edit=1`}
            className="text-xs px-3 py-1.5 border"
            style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Editar dados
          </Link>
        </div>
      </div>

      {/* Form de edição inline */}
      {edit === "1" && (
        <section className="p-5 border flex flex-col gap-4"
          style={{ borderColor: "rgba(231,182,92,0.3)", backgroundColor: "var(--bg-card)" }}>
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Editar evento
          </h2>
          <form action={updateWithId} className="flex flex-col gap-4">
            <input name="nome" type="text" required defaultValue={evento.nome}
              placeholder="Nome" className={INPUT_CLS} style={INPUT_STY} />
            <div className="grid grid-cols-2 gap-3">
              <select name="tipo" defaultValue={evento.tipo} className={INPUT_CLS} style={INPUT_STY}>
                <option value="espetaculo">Espetáculo</option>
                <option value="workshop">Workshop</option>
                <option value="aula_aberta">Aula aberta</option>
                <option value="outro">Outro</option>
              </select>
              <input name="vagas" type="number" min="1" defaultValue={evento.vagas ?? ""}
                placeholder="Vagas" className={INPUT_CLS} style={INPUT_STY} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="data_evento" type="date" defaultValue={evento.data_evento ?? ""}
                className={INPUT_CLS} style={INPUT_STY} />
              <input name="horario" type="text" defaultValue={evento.horario ?? ""}
                placeholder="Horário" className={INPUT_CLS} style={INPUT_STY} />
            </div>
            <input name="local" type="text" defaultValue={evento.local ?? ""}
              placeholder="Local" className={INPUT_CLS} style={INPUT_STY} />
            <textarea name="descricao" rows={3} defaultValue={evento.descricao ?? ""}
              placeholder="Descrição" className={INPUT_CLS}
              style={{ ...INPUT_STY, resize: "vertical" } as any} />
            <label className="flex items-center gap-2 text-sm cursor-pointer"
              style={{ color: "var(--color-ash)" }}>
              <input type="checkbox" name="ativo" value="1" defaultChecked={evento.ativo} />
              Evento ativo
            </label>
            <div className="flex gap-3">
              <button type="submit"
                className="flex-1 py-2 text-sm border transition-colors hover:opacity-90"
                style={{ borderColor: "var(--color-spot)", color: "var(--color-bone)", backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)" }}>
                Salvar
              </button>
              <Link href={`/portal/admin/eventos/${id}`}
                className="px-4 py-2 text-sm border flex items-center"
                style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      )}

      {/* Inscrever turma */}
      <section className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <div>
          <h2 className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Inscrever turma inteira
          </h2>
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>
            Todos os alunos ativos são adicionados de uma vez. Duplicatas são ignoradas.
          </p>
        </div>
        {turmas.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>Nenhuma turma ativa.</p>
        ) : (
          <InscreverTurmaForm eventoId={id} turmas={turmas} />
        )}
      </section>

      {/* Inscrever aluno individual */}
      <section className="p-5 border flex flex-col gap-4"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
        <div>
          <h2 className="text-xs tracking-[0.15em] uppercase mb-1"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Adicionar aluno individualmente
          </h2>
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>
            Para alunos de outras turmas ou casos especiais.
          </p>
        </div>
        {alunos.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>Nenhum aluno ativo.</p>
        ) : (
          <InscreverAlunoForm eventoId={id} alunos={alunos} turmas={turmas} />
        )}
      </section>

      {/* Lista de inscrições */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Participantes ({inscricoes.length})
          </h2>
          {inscricoes.length > 0 && (
            <span className="text-xs" style={{ color: "#4ade80", fontFamily: "var(--font-mono)" }}>
              {confirmados}/{inscricoes.length} confirmados
            </span>
          )}
        </div>

        {inscricoes.length === 0 ? (
          <div className="py-10 text-center border"
            style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
            <p className="text-sm mb-1" style={{ color: "var(--color-ash)" }}>Nenhuma inscrição ainda.</p>
            <p className="text-xs" style={{ color: "var(--color-ash)" }}>
              Use os formulários acima para inscrever turmas ou alunos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {["Aluno", "Turma", "Status", "Inscrito em", "Ações"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs tracking-[0.15em] uppercase"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border-subtle)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inscricoes.map((insc: any) => (
                  <tr key={insc.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: "var(--color-bone)" }}>
                      {alunoMap[insc.aluno_id] ?? insc.aluno_id.slice(0, 8)}
                    </td>
                    <td className="py-3 pr-4 text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {insc.turma_id ? (turmaMap[insc.turma_id] ?? "—") : <span style={{ color: "var(--border-mid)" }}>—</span>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs px-2 py-0.5 border"
                        style={{
                          borderColor: insc.confirmado ? "rgba(74,222,128,0.3)" : "var(--border-subtle)",
                          color: insc.confirmado ? "#4ade80" : "var(--color-ash)",
                          fontFamily: "var(--font-mono)",
                        }}>
                        {insc.confirmado ? "Confirmado" : "Pendente"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {new Date(insc.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <ToggleConfirmadoBtn inscricaoId={insc.id} confirmado={insc.confirmado} />
                        <RemoverInscricaoBtn inscricaoId={insc.id} eventoId={id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
