import Link from 'next/link'
import { MapPin, Clock, Phone } from 'lucide-react'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import { Logo } from '@/components/brand/Logo'
import { getTenant } from '@/tenants'

export function Footer() {
  const year = new Date().getFullYear()
  const { footer, contato, lojaFisica } = getTenant()
  const copyright = footer.copyright.replace('{year}', String(year))

  return (
    <footer className="bg-paizao-surface border-t border-paizao-surface-2 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-paizao-ink-dim text-sm leading-relaxed">
              {footer.descricao}
            </p>
            <a
              href={contato.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-paizao-gold hover:text-paizao-gold-bright transition-colors"
            >
              <InstagramIcon size={16} />
              {contato.instagram} · {contato.instagramSeguidores} seguidores
            </a>
          </div>

          {/* Loja */}
          <div>
            <h3 className="text-paizao-ink font-semibold text-sm uppercase tracking-wider mb-4">
              Loja
            </h3>
            <ul className="space-y-2 text-sm text-paizao-ink-dim">
              {footer.navLoja.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-paizao-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-paizao-ink font-semibold text-sm uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-2 text-sm text-paizao-ink-dim">
              {footer.navEmpresa.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-paizao-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-paizao-ink font-semibold text-sm uppercase tracking-wider mb-4">
              Contato
            </h3>
            <ul className="space-y-3 text-sm text-paizao-ink-dim">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-paizao-gold" />
                {lojaFisica.enderecoFooter}
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-paizao-gold" />
                {lojaFisica.horarioSumario}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-paizao-gold" />
                <a
                  href={`https://wa.me/${contato.whatsapp}`}
                  className="hover:text-paizao-gold transition-colors"
                >
                  {contato.whatsappFormatado}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paizao-surface-2 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-paizao-ink-dim">
          <p>{copyright}</p>
          <p>{footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
