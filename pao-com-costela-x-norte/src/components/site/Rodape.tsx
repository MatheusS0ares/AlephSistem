import { siteConfig } from "@/lib/site-config";
import { linkWhatsApp } from "@/lib/whatsapp";

export default function Rodape() {
  return (
    <footer className="tema-site px-6 py-12 text-center space-y-4">
      <div className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-wide">
        <a
          className="alvo-toque inline-flex items-center text-brasa"
          href={linkWhatsApp(siteConfig.telefoneWhatsApp, "Olá! Vim pelo site.")}
        >
          WhatsApp
        </a>
        {siteConfig.instagram && (
          <a className="alvo-toque inline-flex items-center text-brasa" href={siteConfig.instagram}>
            Instagram
          </a>
        )}
        {siteConfig.googleAvaliacoes && (
          <a className="alvo-toque inline-flex items-center text-brasa" href={siteConfig.googleAvaliacoes}>
            Avaliar no Google
          </a>
        )}
      </div>
      <p className="text-xs text-papel/40">{siteConfig.nome} — {siteConfig.referencia}</p>
    </footer>
  );
}
