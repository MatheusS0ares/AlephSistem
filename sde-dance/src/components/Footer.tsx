import { site } from "@/config/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "rgba(110,16,35,0.3)",
        backgroundColor: "var(--color-blackout)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="text-2xl font-bold tracking-wider"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-bone)" }}
          >
            SDE
          </span>
          <span
            className="text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--color-spot)" }}
          >
            DANCE
          </span>
          <p className="mt-2 text-xs text-center md:text-left" style={{ color: "var(--color-ash)" }}>
            {site.brand.tagline}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Rodapé">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm transition-colors duration-200"
              style={{ color: "var(--color-ash)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Social + CTA */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors duration-200 hover:text-bone"
            style={{ color: "var(--color-spot)" }}
            aria-label="Instagram SDE Dance"
          >
            {site.brand.handle}
          </a>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-medium border transition-colors duration-200"
            style={{
              borderColor: "var(--color-spot)",
              color: "var(--color-spot)",
            }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(110,16,35,0.2)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: "var(--color-ash)" }}>
            © {year} SDE Dance · Escola de Dança Sala de Ensaio · desde {site.brand.since}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: "var(--color-ash)" }}>
              {site.contact.address}
            </p>
            <a
              href="/portal/login"
              className="text-xs tracking-[0.12em] uppercase transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--color-spot)", fontFamily: "var(--font-mono)" }}
            >
              Portal →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
