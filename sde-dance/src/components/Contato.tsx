"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Contato() {
  return (
    <section
      id="contato"
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-blackout) 0%, var(--color-vinho-deep) 60%, var(--color-blackout) 100%)",
      }}
    >
      {/* Top amber line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(231,182,92,0.3) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — contact info */}
          <ScrollReveal>
            <div>
              <p className="eyebrow mb-3">Venha dançar</p>
              <h2
                className="font-semibold leading-tight mb-8"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-bone)",
                  fontSize: "clamp(1.75rem, 4vw, 3rem)",
                }}
              >
                Localização & Contato
              </h2>

              <dl className="flex flex-col gap-6">
                {/* Endereço */}
                <div>
                  <dt
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                  >
                    Endereço
                  </dt>
                  <dd style={{ color: "var(--color-bone)" }}>
                    {site.contact.address}
                    <span
                      className="block text-xs mt-1"
                      style={{ color: "var(--color-ash)", fontFamily: "var(--font-mono)" }}
                    >
                      {/* TODO-CLIENTE: endereço exato + ponto de referência */}
                      // TODO-CLIENTE: endereço exato e ponto de referência
                    </span>
                  </dd>
                </div>

                {/* Telefone */}
                <div>
                  <dt
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                  >
                    Telefone
                  </dt>
                  <dd>
                    <a
                      href={`tel:${site.contact.phone}`}
                      className="text-base transition-colors duration-200 hover:text-spot"
                      style={{ color: "var(--color-bone)" }}
                    >
                      {site.contact.phoneDisplay}
                    </a>
                  </dd>
                </div>

                {/* Atendimento */}
                <div>
                  <dt
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                  >
                    Atendimento
                  </dt>
                  <dd
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-ash)" }}
                  >
                    {site.contact.addressNote}
                  </dd>
                </div>

                {/* Instagram */}
                <div>
                  <dt
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
                  >
                    Instagram
                  </dt>
                  <dd>
                    <a
                      href={site.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base transition-colors duration-200 hover:text-bone"
                      style={{ color: "var(--color-spot)" }}
                    >
                      {site.brand.handle}
                    </a>
                  </dd>
                </div>
              </dl>

              {/* WhatsApp CTA */}
              <div className="mt-10">
                <a
                  href={site.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded text-base font-semibold transition-all duration-200 hover:brightness-110"
                  style={{
                    backgroundColor: "var(--color-spot)",
                    color: "var(--color-blackout)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — map */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col gap-4">
              <p
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
              >
                Localização
              </p>

              {/* Map placeholder */}
              {/* TODO-CLIENTE: substituir pelo iframe do Google Maps com endereço exato */}
              <div
                className="w-full aspect-[4/3] flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                }}
                aria-label="Mapa de localização — aguardando endereço exato"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mb-3"
                  style={{ color: "var(--color-ash)" }}
                  aria-hidden="true"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-sm mb-1" style={{ color: "var(--color-ash)" }}>
                  Setor Central do Gama, DF
                </p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(140,128,137,0.5)", fontFamily: "var(--font-mono)" }}
                >
                  // TODO-CLIENTE: endereço exato para o pin
                </p>

                {/* Fallback link to Google Maps */}
                <a
                  href="https://maps.google.com/?q=Setor+Central+do+Gama+DF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs tracking-widest uppercase px-4 py-2 border transition-colors duration-200"
                  style={{
                    borderColor: "rgba(231,182,92,0.3)",
                    color: "var(--color-spot)",
                  }}
                >
                  Abrir no Maps
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
