"use client";

import { useRef, useState } from "react";
import { site } from "@/config/site";

type Status = "idle" | "sending" | "success" | "error";

const MODALIDADES = [
  "Ballet Baby (3–5 anos)",
  "Ballet Infantil (a partir de 3 anos)",
  "Ballet Neoclássico Adulto",
  "Dança Contemporânea Infantil (6–8 anos)",
  "Dança Contemporânea Juvenil (8–13 anos)",
  "Dança Contemporânea Adulto Iniciante",
  "Dança Contemporânea Adulto Avançado",
  "Danças Urbanas Adulto Iniciante",
  "Jazz",
  "Não sei ainda — quero conversar",
];

const INPUT_STYLE = {
  borderColor: "var(--border-mid)",
  color: "var(--color-bone)",
} as const;

const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--color-spot)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--border-mid)";
};

export default function MatriculaForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const isFormspreeConfigured = site.contact.formEndpoint !== "TODO_FORMSPREE_ID";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormspreeConfigured) {
      const data = new FormData(e.currentTarget);
      const nome = data.get("nome");
      const modalidade = data.get("modalidade");
      const msg = encodeURIComponent(
        `Olá! Vim pelo site e tenho interesse em: ${modalidade}. Meu nome é ${nome}.`
      );
      window.open(`https://wa.me/5561996700607?text=${msg}`, "_blank");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${site.contact.formEndpoint}`, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="matricula" className="py-28 lg:py-36 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--color-blackout) 0%, var(--color-vinho-deep) 50%, var(--color-blackout) 100%)",
      }}>
      {/* Top amber rule */}
      <div className="absolute top-0 left-0 right-0 h-px" aria-hidden="true"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.3) 50%, transparent 100%)" }} />

      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-3">Venha dançar</p>
        <h2 className="font-semibold leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          Agende sua aula experimental
        </h2>
        <p className="text-sm mb-12" style={{ color: "var(--color-ash)" }}>
          Gratuita, sem compromisso. Venha sentir o espaço e conhecer a SDE.
        </p>

        {status === "success" ? (
          <div className="py-16 text-center border" style={{ borderColor: "rgba(231,182,92,0.3)" }}>
            <div className="text-4xl mb-4" aria-hidden="true">✨</div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}>
              Recebemos seu contato!
            </h3>
            <p className="text-sm" style={{ color: "var(--color-ash)" }}>
              Nossa equipe vai entrar em contato pelo WhatsApp em breve para confirmar seu horário.
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                Nome completo *
              </label>
              <input
                id="nome" name="nome" type="text" required
                placeholder="Seu nome ou nome do aluno"
                className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200 placeholder:opacity-40"
                style={INPUT_STYLE}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="whatsapp" className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                WhatsApp *
              </label>
              <input
                id="whatsapp" name="whatsapp" type="tel" required
                placeholder="(61) 9 0000-0000"
                className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200 placeholder:opacity-40"
                style={INPUT_STYLE}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Modalidade */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modalidade" className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                Modalidade de interesse *
              </label>
              <select
                id="modalidade" name="modalidade" required
                className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200 appearance-none cursor-pointer"
                style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)", backgroundColor: "var(--color-blackout)" }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="" disabled selected style={{ color: "var(--color-ash)" }}>Selecione…</option>
                {MODALIDADES.map((m) => (
                  <option key={m} value={m} style={{ backgroundColor: "var(--color-blackout)" }}>{m}</option>
                ))}
              </select>
            </div>

            {/* Mensagem */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mensagem" className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}>
                Mensagem (opcional)
              </label>
              <textarea
                id="mensagem" name="mensagem" rows={3}
                placeholder="Alguma dúvida ou informação adicional?"
                className="w-full px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200 resize-none placeholder:opacity-40"
                style={{ borderColor: "var(--border-mid)", color: "var(--color-bone)" }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {status === "error" && (
              <p className="text-sm" style={{ color: "#e74c3c" }}>
                Ops! Algo deu errado. Tente pelo WhatsApp diretamente.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex-1 py-4 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "var(--color-spot)", color: "var(--color-blackout)" }}
              >
                {status === "sending" ? "Enviando…" : isFormspreeConfigured ? "Enviar solicitação" : "Continuar no WhatsApp →"}
              </button>
              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 text-sm font-medium text-center border transition-all duration-200 hover:bg-white/5"
                style={{ borderColor: "var(--border-bold)", color: "var(--color-bone)" }}
              >
                Falar direto no WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
