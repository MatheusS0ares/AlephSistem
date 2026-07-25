import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminEventosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: me } = await supabase.from("profiles").select("tipo").eq("id", user.id).single();
  if ((me as any)?.tipo !== "admin") redirect("/portal");

  const { data: rawEventos } = await supabase
    .from("eventos")
    .select("id, nome, tipo, data_evento, horario, local, ativo")
    .order("data_evento", { ascending: true, nullsFirst: false });

  type EventoRow = {
    id: string; nome: string; tipo: string;
    data_evento: string | null; horario: string | null; local: string | null; ativo: boolean;
  };
  const eventos = rawEventos as EventoRow[] | null;

  const hoje = new Date().toISOString().slice(0, 10);
  const proximos = eventos?.filter(e => e.ativo && (!e.data_evento || e.data_evento >= hoje)) ?? [];
  const passados  = eventos?.filter(e => !e.ativo || (e.data_evento && e.data_evento < hoje)) ?? [];

  const tipoLabel: Record<string, string> = {
    espetaculo:  "Espetáculo",
    workshop:    "Workshop",
    aula_aberta: "Aula aberta",
    outro:       "Outro",
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-1">Administração</p>
          <h1 className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
            Eventos &amp; Espetáculos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ash)" }}>
            Crie eventos, inscreva turmas e acompanhe participantes.
          </p>
        </div>
        <Link href="/portal/admin/eventos/novo"
          className="px-4 py-2 text-sm border self-start transition-colors hover:opacity-90"
          style={{
            borderColor: "var(--color-spot)", color: "var(--color-bone)",
            backgroundColor: "rgba(231,182,92,0.08)", fontFamily: "var(--font-mono)",
          }}>
          + Novo evento
        </Link>
      </div>

      {/* Chips */}
      <div className="flex gap-4 flex-wrap">
        <Chip label="Próximos/ativos" value={proximos.length} />
        <Chip label="Passados/inativos" value={passados.length} dim />
      </div>

      {/* Aviso SQL */}
      <div className="p-4 border text-sm"
        style={{
          borderColor: "rgba(245,158,11,0.3)",
          backgroundColor: "rgba(245,158,11,0.05)",
          color: "var(--color-ash)",
        }}>
        <strong style={{ color: "#f59e0b" }}>Lembrete:</strong> Execute{" "}
        <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-bone)" }}>
          supabase/migration_eventos.sql
        </code>{" "}
        no SQL Editor do Supabase para criar as tabelas de eventos.
      </div>

      {/* Próximos */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          Próximos eventos
        </h2>

        {proximos.length === 0 ? (
          <EmptyState label="Nenhum evento ativo." cta="/portal/admin/eventos/novo" ctaLabel="Criar primeiro evento" />
        ) : (
          proximos.map(e => <EventoCard key={e.id} evento={e} tipoLabel={tipoLabel} />)
        )}
      </section>

      {/* Passados */}
      {passados.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
            Passados / inativos
          </h2>
          {passados.map(e => <EventoCard key={e.id} evento={e} tipoLabel={tipoLabel} dim />)}
        </section>
      )}
    </div>
  );
}

function EventoCard({
  evento, tipoLabel, dim,
}: {
  evento: { id: string; nome: string; tipo: string; data_evento: string | null; horario: string | null; local: string | null; ativo: boolean };
  tipoLabel: Record<string, string>;
  dim?: boolean;
}) {
  const dataFormatada = evento.data_evento
    ? new Date(evento.data_evento + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "Data a definir";

  return (
    <div className="p-4 border flex items-center gap-4 flex-wrap"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
        opacity: dim ? 0.6 : 1,
      }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
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
        <h3 className="font-semibold"
          style={{ color: "var(--color-bone)", fontFamily: "var(--font-display)" }}>
          {evento.nome}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
          {dataFormatada}{evento.horario ? ` · ${evento.horario}` : ""}
          {evento.local ? ` · ${evento.local}` : ""}
        </p>
      </div>
      <Link href={`/portal/admin/eventos/${evento.id}`}
        className="text-xs px-3 py-1.5 border whitespace-nowrap transition-colors hover:opacity-80 shrink-0"
        style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        Gerenciar →
      </Link>
    </div>
  );
}

function Chip({ label, value, dim }: { label: string; value: number; dim?: boolean }) {
  return (
    <div className="px-4 py-2 border"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)", opacity: dim ? 0.6 : 1 }}>
      <p className="text-lg font-bold"
        style={{ color: "var(--color-spot)", fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>{label}</p>
    </div>
  );
}

function EmptyState({ label, cta, ctaLabel }: { label: string; cta: string; ctaLabel: string }) {
  return (
    <div className="py-12 text-center border flex flex-col items-center gap-4"
      style={{ borderColor: "var(--border-subtle)", borderStyle: "dashed" }}>
      <p className="text-sm" style={{ color: "var(--color-ash)" }}>{label}</p>
      <Link href={cta}
        className="text-xs px-4 py-2 border transition-colors hover:opacity-80"
        style={{ borderColor: "var(--color-spot)", color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
        {ctaLabel}
      </Link>
    </div>
  );
}
