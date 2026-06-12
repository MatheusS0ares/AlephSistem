import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { InstagramIcon } from '@/components/brand/InstagramIcon'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  mediaUrl: string
  permalink: string
  caption: string
  timestamp: string
}

interface InstagramReelsProps {
  posts?: InstagramPost[]
}

const PLACEHOLDER_POSTS: InstagramPost[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  mediaUrl: `https://placehold.co/400x400/1a2654/d4a93a?text=Post+${i + 1}`,
  permalink: 'https://instagram.com/paizaomodas2',
  caption: 'Novo look chegando na Paizão! 🔥',
  timestamp: new Date().toISOString(),
}))

export function InstagramReels({ posts = PLACEHOLDER_POSTS }: InstagramReelsProps) {
  return (
    <section className="relative py-32 bg-paizao-navy-deep overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-5.jpeg"
          alt="Instagram Background"
          fill
          className="object-cover object-center opacity-30 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paizao-navy-deep via-paizao-navy-deep/70 to-paizao-navy-deep/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-paizao-navy-deep/80 via-transparent to-paizao-navy-deep/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,169,58,0.1),transparent_70%)] mix-blend-color-dodge pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-paizao-gold" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-paizao-gold">
                  Siga a Tendência
                </span>
              </div>
              <h2
                className="text-[clamp(3rem,8vw,5rem)] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 leading-[0.9] drop-shadow-xl"
                style={{ fontFamily: 'var(--font-bebas-neue), sans-serif' }}
              >
                NO INSTAGRAM
              </h2>
              <p className="mt-4 text-paizao-gold font-bold tracking-widest uppercase text-sm drop-shadow-md">
                @paizaomodas2 <span className="text-white/40 font-medium lowercase tracking-normal mx-2">·</span> <span className="text-white/80">8.324 seguidores</span>
              </p>
            </div>
            
            <a
              href="https://instagram.com/paizaomodas2"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-[1px] hover:shadow-[0_0_30px_rgba(217,70,239,0.3)] transition-shadow"
            >
              <div className="flex items-center gap-3 bg-black/80 px-8 py-4 rounded-xl group-hover:bg-transparent transition-colors duration-300 backdrop-blur-md">
                <InstagramIcon size={20} className="text-white" />
                <span className="text-white font-bold uppercase tracking-wider text-sm">Seguir Agora</span>
              </div>
            </a>
          </div>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {posts.slice(0, 6).map((post) => (
            <StaggerItem key={post.id}>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative aspect-square overflow-hidden rounded-[2rem] bg-black/40 border border-white/10 shadow-xl backdrop-blur-md"
                aria-label={`Ver post no Instagram: ${post.caption}`}
              >
                <Image
                  src={post.mediaUrl}
                  alt={post.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                
                {/* Premium overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <InstagramIcon
                      size={28}
                      className="text-white mb-3"
                    />
                    <p className="text-white text-sm font-medium line-clamp-2 drop-shadow-md">
                      {post.caption}
                    </p>
                  </div>
                </div>

                {/* Elegant border trace on hover */}
                <div className="absolute inset-0 rounded-[2rem] border border-transparent group-hover:border-paizao-gold/40 transition-colors duration-500 pointer-events-none" />
              </a>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
