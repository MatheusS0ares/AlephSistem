"use client";

import { useRef, useState } from "react";
import { site } from "@/config/site";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section id="faq" className="py-28 lg:py-36" style={{ backgroundColor: "var(--color-blackout)" }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <p className="eyebrow mb-3">Dúvidas</p>
        <h2 className="font-semibold leading-tight mb-14"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          Perguntas frequentes
        </h2>

        <dl className="flex flex-col">
          {site.faq.map((item, i) => (
            <FAQItem key={i} item={item} index={i} isOpen={open === i} onToggle={() => toggle(i)} />
          ))}
        </dl>

        {/* Catch-all CTA */}
        <div className="mt-12 p-6 border" style={{ borderColor: "rgba(110,16,35,0.3)", backgroundColor: "rgba(61,10,22,0.15)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--color-ash)" }}>
            Não encontrou sua resposta? Nossa recepção online responde pelo WhatsApp.
          </p>
          <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--color-spot)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ item, index, isOpen, onToggle }: {
  item: { pergunta: string; resposta: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
      <dt>
        <button
          type="button"
          className="w-full flex items-center justify-between gap-6 py-5 text-left"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-4">
            <span className="text-xs tabular-nums shrink-0" style={{ color: "var(--color-vinho)", fontFamily: "var(--font-mono)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base font-medium" style={{ color: "var(--color-bone)" }}>
              {item.pergunta}
            </span>
          </span>
          <span
            className="shrink-0 w-5 h-5 flex items-center justify-center border rounded-full transition-all duration-300"
            style={{
              borderColor: isOpen ? "var(--color-spot)" : "rgba(140,128,137,0.4)",
              color: isOpen ? "var(--color-spot)" : "var(--color-ash)",
              transform: isOpen ? "rotate(45deg)" : "none",
            }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="1" x2="5" y2="9" />
              <line x1="1" y1="5" x2="9" y2="5" />
            </svg>
          </span>
        </button>
      </dt>
      <dd
        ref={bodyRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pb-6 pl-9 text-sm leading-relaxed" style={{ color: "var(--color-ash)" }}>
          {item.resposta}
        </p>
      </dd>
    </div>
  );
}
