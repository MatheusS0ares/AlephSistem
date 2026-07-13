import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BadgeStatus from "@/components/portal/BadgeStatus";

export default async function AlunoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, whatsapp")
    .eq("id", user.id)
    .single();

  const { data: matriculas } = await supabase
    .from("matriculas")
    .select(`
      id, status, data_inicio,
      turmas (nome, modalidade, dias_semana, hora,
        profiles!turmas_professor_id_fkey (nome)
      )
    `)
    .eq("aluno_id", user.id)
    .order("created_at", { ascending: false });

  const { data: lancamentos } = await supabase
    .from("financeiro")
    .select("id, tipo, valor, vencimento, pago_em, status, mes_referencia")
    .eq("aluno_id", user.id)
    .order("vencimento", { ascending: false })
    .limit(6);

  const pendente = lancamentos?.filter(l => l.status !== "pago").reduce((s, l) => s + l.valor, 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="eyebrow mb-1">Portal do Aluno</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
          Olá, {profile?.nome?.split(" ")[0]} 👋
        </h1>
      </div>

      {/* Resumo financeiro */}
      {pendente > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border"
          style={{ borderColor: "rgba(231,182,92,0.4)", backgroundColor: "rgba(231,182,92,0.06)" }}>
          <p className="text-sm" style={{ color: "var(--color-bone)" }}>
            Você tem <strong>R$ {pendente.toFixed(2).replace(".", ",")}</strong> em aberto
          </p>
          <a href="/portal/aluno/financeiro"
            className="text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors hover:bg-spot/10"
            style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
            Ver extrato
          </a>
        </div>
      )}

      {/* Turmas */}
      <div>
        <h2 className="text-sm tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
          Minhas turmas
        </h2>

        {!matriculas?.length ? (
          <EmptyState text="Você ainda não está matriculado em nenhuma turma." />
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {matriculas.map((m: any) => (
              <li key={m.id} className="p-5 border flex flex-col gap-3"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--color-bone)" }}>{m.turmas?.nome}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
                      {m.turmas?.dias_semana} · {m.turmas?.hora}
                    </p>
                  </div>
                  <BadgeStatus status={m.status} />
                </div>
                {m.turmas?.profiles?.nome && (
                  <p className="text-xs border-t pt-3" style={{ color: "var(--color-ash)", borderColor: "var(--border-subtle)" }}>
                    Prof. {m.turmas.profiles.nome}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Últimos lançamentos */}
      {lancamentos && lancamentos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm tracking-[0.2em] uppercase"
              style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
              Últimos lançamentos
            </h2>
            <a href="/portal/aluno/financeiro" className="text-xs"
              style={{ color: "var(--color-ash)" }}>Ver tudo →</a>
          </div>
          <div className="flex flex-col gap-2">
            {lancamentos.slice(0, 4).map((l: any) => (
              <LancamentoRow key={l.id} lancamento={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LancamentoRow({ lancamento: l }: { lancamento: any }) {
  const statusColor = l.status === "pago" ? "#4ade80" : l.status === "atrasado" ? "#ef4444" : "#f59e0b";
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <div>
        <p className="text-sm" style={{ color: "var(--color-bone)" }}>
          {l.tipo === "mensalidade" ? `Mensalidade ${l.mes_referencia ?? ""}` : "Taxa de Matrícula"}
        </p>
        <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Venc. {new Date(l.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: "var(--color-bone)" }}>
          R$ {l.valor.toFixed(2).replace(".", ",")}
        </span>
        <span className="inline-flex items-center gap-1 text-xs" style={{ color: statusColor, fontFamily: "var(--font-mono)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
          {l.status}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-12 text-center border" style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
      <p className="text-sm" style={{ color: "var(--color-ash)" }}>{text}</p>
    </div>
  );
}
