// ETAPA 1 — layout base funcional. Seções serão adicionadas nas próximas etapas.

export default function Home() {
  return (
    <>
      {/* Placeholder — substituído a partir da ETAPA 2 */}
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-blackout)" }}
      >
        <div className="text-center px-6 py-32">
          <p className="eyebrow mb-4">DESDE 2015 · SETOR CENTRAL DO GAMA</p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}
          >
            Não é só uma aula de dança.
            <br />
            <em>É um atravessamento.</em>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: "var(--color-ash)" }}>
            10 anos formando corpos, histórias e artistas no coração do Gama.
          </p>
          <p
            className="text-sm tracking-widest uppercase mt-8"
            style={{ color: "var(--color-vinho)" }}
          >
            — Scaffold · ETAPA 1 concluída —
          </p>
        </div>
      </section>
    </>
  );
}
