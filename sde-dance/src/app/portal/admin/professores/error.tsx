"use client";

export default function ProfessoresError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <p className="text-sm" style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}>
        Erro ao carregar professores
      </p>
      <p className="text-xs px-4 py-2 border max-w-md text-center"
        style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", fontFamily: "var(--font-mono)" }}>
        {error.message}
      </p>
      <button
        onClick={reset}
        className="text-xs px-4 py-2 border"
        style={{ borderColor: "var(--border-mid)", color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
      >
        Tentar novamente
      </button>
    </div>
  );
}
