import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { MapPin, Heart, Users, TrendingUp } from 'lucide-react'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import { getTenant } from '@/tenants'

export async function generateMetadata(): Promise<Metadata> {
  const t = getTenant()
  return {
    title: 'Sobre nós',
    description: `Conheça a história da ${t.nome}. ${t.slogan}.`,
  }
}

const ICONES = [Heart, Users, TrendingUp]

export default function SobrePage() {
  const t = getTenant()
  const { sobre, lojaFisica, contato } = t

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <FadeIn>
          <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-paizao-gold/70">
            Nossa história
          </span>
          <h1
            className="mt-2 text-[clamp(2.5rem,7vw,5rem)] text-paizao-ink"
            style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
          >
            SOBRE A
            <br />
            <span className="text-paizao-gold uppercase">{t.nome}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 prose prose-invert max-w-none">
            {sobre.historia.map((paragrafo, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-paizao-ink-dim text-lg leading-relaxed'
                    : 'text-paizao-ink-dim leading-relaxed mt-4'
                }
              >
                {paragrafo}
              </p>
            ))}
          </div>
        </FadeIn>

        {/* Values */}
        <StaggerChildren className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sobre.valores.map((v, i) => {
            const Icon = ICONES[i % ICONES.length]!
            return (
              <StaggerItem key={v.titulo}>
                <div className="p-6 rounded-2xl bg-paizao-surface border border-paizao-surface-2">
                  <Icon size={28} className="text-paizao-gold mb-3" />
                  <h3 className="text-paizao-ink font-semibold mb-2">{v.titulo}</h3>
                  <p className="text-paizao-ink-dim text-sm leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerChildren>

        {/* Location */}
        <FadeIn delay={0.2}>
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-paizao-navy via-paizao-navy-deep to-paizao-navy border border-paizao-gold/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} className="text-paizao-gold" />
                  <span className="text-paizao-gold font-semibold">Nos visite</span>
                </div>
                <p className="text-paizao-ink">{lojaFisica.enderecoFooter}</p>
                <p className="text-paizao-ink-dim text-sm mt-1">{lojaFisica.horarioSumario}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${contato.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-wa-green text-white font-bold text-sm hover:brightness-110 transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href={contato.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-paizao-gold/30 text-paizao-gold font-semibold text-sm hover:bg-paizao-gold/10 transition-colors"
                >
                  <InstagramIcon size={16} />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-16 text-center">
            <h2
              className="text-3xl text-paizao-ink mb-4"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {sobre.ctaTitulo}
            </h2>
            <Link
              href="/loja"
              className="inline-block px-8 py-4 rounded-xl bg-paizao-gold text-paizao-navy font-extrabold text-base hover:bg-paizao-gold-bright transition-colors"
            >
              Explorar a loja
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
