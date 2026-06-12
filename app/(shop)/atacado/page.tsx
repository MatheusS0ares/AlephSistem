'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { gerarLinkAtacado } from '@/lib/whatsapp/gerar-link'
import { Package, TrendingUp, Headphones, Zap } from 'lucide-react'
import { getTenant } from '@/tenants'

const schema = z.object({
  nome: z.string().min(2, 'Informe seu nome'),
  empresa: z.string().optional(),
  cidade: z.string().min(2, 'Informe sua cidade'),
  telefone: z.string().min(10, 'Telefone inválido'),
})

type FormData = z.infer<typeof schema>

const BENEFICIOS = [
  {
    icon: Package,
    titulo: 'A partir de 5 peças',
    desc: 'Compre no mínimo 5 peças e acesse os preços de atacado.',
  },
  {
    icon: TrendingUp,
    titulo: 'Até 40% de desconto',
    desc: 'Quanto maior o pedido, maior o desconto na tabela.',
  },
  {
    icon: Headphones,
    titulo: 'Suporte dedicado',
    desc: 'Canal exclusivo no WhatsApp para revendedores.',
  },
  {
    icon: Zap,
    titulo: 'Pronta entrega',
    desc: 'Estoque disponível para envio imediato no Gama-DF.',
  },
]

export default function AtacadoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    const link = gerarLinkAtacado(data.nome, data.empresa, data.cidade)
    window.open(link, '_blank')
  }

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-paizao-gold/70">
              Para revendedores
            </span>
            <h1
              className="mt-2 text-[clamp(2.5rem,7vw,5rem)] text-paizao-ink"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              ATACADO
              <br />
              <span className="text-paizao-gold uppercase">{getTenant().nome}</span>
            </h1>
            <p className="mt-4 text-paizao-ink-dim text-lg">
              Junte-se a +200 revendedores e transforme moda em lucro.
            </p>
          </div>
        </FadeIn>

        {/* Benefits */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BENEFICIOS.map((b) => (
            <StaggerItem key={b.titulo}>
              <div className="p-6 rounded-2xl bg-paizao-surface border border-paizao-surface-2 h-full">
                <b.icon size={28} className="text-paizao-gold mb-3" />
                <h3 className="text-paizao-ink font-semibold mb-2">{b.titulo}</h3>
                <p className="text-paizao-ink-dim text-sm leading-relaxed">{b.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Form */}
        <FadeIn>
          <div className="max-w-lg mx-auto bg-paizao-surface border border-paizao-surface-2 rounded-2xl p-8">
            <h2
              className="text-2xl text-paizao-ink mb-6"
              style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
            >
              QUERO SER REVENDEDOR
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label className="text-sm font-medium text-paizao-ink-dim mb-1.5 block">
                  Nome *
                </label>
                <input
                  {...register('nome')}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors"
                />
                {errors.nome && (
                  <p className="text-paizao-red text-xs mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-paizao-ink-dim mb-1.5 block">
                  Empresa / Loja
                </label>
                <input
                  {...register('empresa')}
                  placeholder="Nome da sua loja (opcional)"
                  className="w-full px-4 py-3 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-paizao-ink-dim mb-1.5 block">
                  Cidade *
                </label>
                <input
                  {...register('cidade')}
                  placeholder="Sua cidade"
                  className="w-full px-4 py-3 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors"
                />
                {errors.cidade && (
                  <p className="text-paizao-red text-xs mt-1">{errors.cidade.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-paizao-ink-dim mb-1.5 block">
                  Telefone *
                </label>
                <input
                  {...register('telefone')}
                  type="tel"
                  placeholder="(61) 9 9999-9999"
                  className="w-full px-4 py-3 rounded-lg bg-paizao-surface-2 border border-paizao-surface-2 text-paizao-ink placeholder:text-paizao-ink-dim/50 focus:outline-none focus:border-paizao-gold/50 transition-colors"
                />
                {errors.telefone && (
                  <p className="text-paizao-red text-xs mt-1">{errors.telefone.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-wa-green text-white font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.848L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.003-1.372l-.359-.213-3.72.887.934-3.62-.234-.372A9.8 9.8 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z" />
                </svg>
                Enviar pelo WhatsApp
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
