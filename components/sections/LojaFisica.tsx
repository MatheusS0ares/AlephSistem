import { FadeIn } from '@/components/motion/FadeIn'
import { MapPin, Clock, Phone, Navigation, Sparkles } from 'lucide-react'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import Image from 'next/image'
import { getTenant } from '@/tenants'

export function LojaFisica() {
  const { lojaFisica: loja, contato } = getTenant()

  return (
    <section className="relative bg-paizao-navy-deep py-32 overflow-hidden z-10">
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-3.jpeg"
          alt="Loja Física Background"
          fill
          className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paizao-navy-deep via-paizao-navy-deep/60 to-paizao-navy-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-paizao-navy-deep via-paizao-navy-deep/80 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-paizao-gold/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-paizao-green/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm shadow-xl">
              <Sparkles className="w-4 h-4 text-paizao-gold" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-paizao-gold drop-shadow-md">
                {loja.badge}
              </span>
            </div>

            <h2
              className="text-[clamp(3rem,8vw,5.5rem)] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 leading-[0.9] drop-shadow-2xl"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              {loja.titulo}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paizao-gold-soft to-paizao-gold-bright drop-shadow-[0_0_15px_rgba(212,169,58,0.3)]">
                {loja.tituloAccent}
              </span>
            </h2>

            <div className="mt-10 space-y-6">
              <div className="group flex items-start gap-5 p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/40 hover:border-paizao-gold/30 transition-all duration-300 backdrop-blur-md shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-paizao-gold/20 to-paizao-gold/5 border border-paizao-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,169,58,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,169,58,0.4)] transition-all">
                  <MapPin size={24} className="text-paizao-gold" />
                </div>
                <div>
                  <p className="text-white font-bold tracking-wide">Endereço Exclusivo</p>
                  <p className="text-white/70 text-sm mt-1 leading-relaxed">
                    {loja.enderecoRua}
                    <br />
                    {loja.enderecoCidadeEstado}
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/40 hover:border-paizao-gold/30 transition-all duration-300 backdrop-blur-md shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-paizao-gold/20 to-paizao-gold/5 border border-paizao-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,169,58,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,169,58,0.4)] transition-all">
                  <Clock size={24} className="text-paizao-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold tracking-wide">Horário de Funcionamento</p>
                  <div className="mt-2 space-y-2">
                    {loja.horarios.map((h) => (
                      <div key={h.dias} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="text-white/70 font-medium">{h.dias}</span>
                        <span className="text-paizao-gold font-bold">{h.horas}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-5 rounded-2xl border border-white/5 bg-black/20 hover:bg-black/40 hover:border-paizao-gold/30 transition-all duration-300 backdrop-blur-md shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-paizao-gold/20 to-paizao-gold/5 border border-paizao-gold/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,169,58,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,169,58,0.4)] transition-all">
                  <Phone size={24} className="text-paizao-gold" />
                </div>
                <div>
                  <p className="text-white font-bold tracking-wide">Atendimento VIP</p>
                  <a
                    href={`https://wa.me/${contato.whatsapp}`}
                    className="inline-flex items-center gap-2 text-wa-green hover:text-white transition-colors text-sm mt-1 font-medium bg-wa-green/10 px-3 py-1.5 rounded-lg border border-wa-green/20 hover:bg-wa-green hover:border-wa-green shadow-md"
                  >
                    {contato.whatsappFormatado} — WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${contato.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-wa-green to-[#20b858] text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all backdrop-blur-md"
              >
                Chamar no WhatsApp
              </a>
              <a
                href={contato.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-white/20 bg-black/30 text-white hover:bg-white/10 hover:border-paizao-gold/50 transition-all font-bold text-sm uppercase tracking-wider backdrop-blur-md shadow-lg"
              >
                <InstagramIcon size={18} />
                {contato.instagram}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left" className="h-full">
            <div className="relative h-full min-h-[500px] rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl group">
              <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-paizao-gold/40 transition-colors duration-700 z-20 pointer-events-none" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center p-8 z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-paizao-gold/30 blur-2xl rounded-full" />
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-paizao-gold-soft to-paizao-gold-bright flex items-center justify-center shadow-[0_0_40px_rgba(212,169,58,0.6)]">
                    <MapPin size={48} className="text-paizao-navy" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                  <p className="text-white font-black text-2xl tracking-wide mb-2 drop-shadow-md">{loja.mapTitle}</p>
                  <p className="text-white/70 text-sm uppercase tracking-widest font-bold">{loja.mapSubtitle}</p>
                </div>

                <a
                  href={loja.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-paizao-navy bg-paizao-gold px-8 py-4 rounded-xl hover:bg-paizao-gold-bright transition-all shadow-[0_0_20px_rgba(212,169,58,0.4)] hover:shadow-[0_0_30px_rgba(212,169,58,0.6)] hover:-translate-y-1"
                >
                  <Navigation size={18} />
                  Traçar Rota no Maps
                </a>
              </div>

              <div
                className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
