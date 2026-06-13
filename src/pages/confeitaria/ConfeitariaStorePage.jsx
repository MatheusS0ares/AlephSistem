import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useStore } from '../../context/StoreContext'
import { useProducts, useTestimonials } from '../../hooks/useSupabase'
import { trackEvent } from '../../lib/analytics'
import SazonalBanner from '../../components/SazonalBanner'
import WppFloat from '../../components/WppFloat'
import BackToTop from '../../components/BackToTop'
import styles from './ConfeitariaStorePage.module.css'

gsap.registerPlugin(ScrollTrigger)

const IMG = 'https://uhxbnleyfowhpdbnrdqc.supabase.co/storage/v1/object/public/emely'

const FALLBACK_PRODUCTS = [
  { id: 1, category: 'namorados', icon: '🍫', image_url: `${IMG}/jogo-ferrero.png`,    name: 'Jogo do Prazer — Ferrero Rocher',      description: '12 Ferrero Rocher + 2 dados do prazer. Encomenda especial.',          price: 'R$ 95,00',  badge: 'Hot'  },
  { id: 2, category: 'namorados', icon: '❤️', image_url: `${IMG}/jogo-brigadeiro.png`, name: 'Jogo do Prazer — Brigadeiros Gourmet', description: '12 brigadeiros sortidos + 2 dados do amor.',                           price: 'R$ 80,00',  badge: 'Novo' },
  { id: 3, category: 'presentes', icon: '🎁', image_url: `${IMG}/caixa-9.png`,         name: 'Caixa 9 Brigadeiros Gourmet',          description: 'Ninho, Pistache, Morango, Chocolate Belga e muito mais.',             price: 'R$ 45,00',  badge: null   },
  { id: 4, category: 'presentes', icon: '🍫', image_url: `${IMG}/caixa-16.png`,        name: 'Caixa 16 Brigadeiros Gourmet',         description: 'Perfeita para celebrações e presentes que marcam.',                   price: 'R$ 75,00',  badge: null   },
  { id: 5, category: 'presentes', icon: '🎁', image_url: `${IMG}/kit-romantico.png`,   name: 'Kit Presente Romântico',               description: '12 doces sortidos + embalagem premium + cartão personalizado.',       price: 'R$ 90,00',  badge: 'Hot'  },
  { id: 6, category: 'festas',    icon: '🎂', image_url: `${IMG}/kit-festa-50.png`,    name: 'Kit Festa 50 unidades',                description: '50 brigadeiros individuais para eventos e comemorações.',            price: 'R$ 180,00', badge: null   },
  { id: 7, category: 'festas',    icon: '🏢', image_url: `${IMG}/kit-corporativo.png`, name: 'Kit Corporativo 30 caixinhas',         description: '30 caixinhas personalizadas com logotipo da empresa.',               price: 'R$ 210,00', badge: null   },
  { id: 8, category: 'presentes', icon: '🍬', image_url: `${IMG}/trufas.png`,          name: 'Trufas Artesanais (caixa 12)',         description: 'Dark, Ao Leite, Limão Siciliano e Maracujá.',                        price: 'R$ 70,00',  badge: 'Novo' },
]

const FALLBACK_TESTIMONIALS = [
  { id: 1, author: 'Ana Carolina M.', role: 'Cliente desde 2022', rating: 5, text: 'Brigadeiros simplesmente perfeitos! A embalagem chegou linda e todo mundo queria saber de onde eu comprei. Já indiquei para todas as amigas!' },
  { id: 2, author: 'Juliana Pereira', role: 'Cliente fiel', rating: 5, text: 'Pedi o kit namorados e meu marido ficou encantado. A qualidade do chocolate é incomparável — valeu cada centavo.' },
  { id: 3, author: 'Fernanda S.', role: 'Compradora recorrente', rating: 5, text: 'Comprei para meu aniversário e virou tradição na família. Não tem outro igual em Brasília — sabor e embalagem de altíssimo nível!' },
  { id: 4, author: 'Mariana Lima', role: 'Cliente especial', rating: 5, text: 'Presenteei minha mãe com o kit romântico e ela chorou de emoção. Obrigada Emely por tornar o momento tão especial e mágico!' },
  { id: 5, author: 'Carla Menezes', role: 'Empresa parceira', rating: 5, text: 'Encomendamos os kits corporativos para o evento da empresa. Todos os clientes adoraram — voltaremos com certeza!' },
]

const CATS = [
  { key: 'all', label: 'Todos' },
  { key: 'namorados', label: '❤️ Namorados' },
  { key: 'presentes', label: '🎁 Caixas & Kits' },
  { key: 'festas', label: '🎂 Festas & Eventos' },
]

const STEPS = [
  { num: '01', title: 'Escolha seu kit', desc: 'Explore o cardápio e encontre o doce perfeito para cada ocasião e orçamento.' },
  { num: '02', title: 'Personalize tudo', desc: 'Sabores, quantidade, embalagem e mensagem — exatamente do seu jeito.' },
  { num: '03', title: 'Receba com carinho', desc: 'Entregamos em Brasília-DF com o capricho que você e quem você ama merecem.' },
]

// ── Magnetic Button ─────────────────────────────────────────────────────────
function MagnetBtn({ children, className, onClick, href, target = '_blank' }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) * 0.28
    const y = (e.clientY - r.top  - r.height / 2) * 0.28
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)'
    el.style.transform  = 'translate(0, 0)'
    setTimeout(() => { if (ref.current) ref.current.style.transition = '' }, 650)
  }

  if (href) {
    return (
      <a ref={ref} className={className} href={href} target={target}
         rel="noopener noreferrer" onClick={onClick}
         onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} className={className} onClick={onClick}
            onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  )
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProdCard({ product, wppNumber, storeName }) {
  const msg = encodeURIComponent(`Olá ${storeName}! Tenho interesse em: ${product.name} (${product.price}) 🍫`)
  const url = `https://wa.me/${wppNumber}?text=${msg}`
  const handleClick = () => trackEvent('whatsapp_click', { store: storeName, source: 'product_card', product: product.name })

  return (
    <motion.article
      className={styles.prodCard}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className={styles.prodImgWrap}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className={styles.prodImg} loading="lazy" />
          : <span className={styles.prodEmoji}>{product.icon}</span>
        }
        {product.badge && (
          <span className={`${styles.badge} ${product.badge === 'Hot' ? styles.badgeHot : styles.badgeNew}`}>
            {product.badge === 'Hot' ? '🔥' : '✨'} {product.badge}
          </span>
        )}
        <div className={styles.prodOverlay}>
          <a href={url} target="_blank" rel="noopener noreferrer"
             onClick={handleClick} className={styles.prodOverlayBtn}>
            <FaWhatsapp /> Pedir agora
          </a>
        </div>
      </div>

      <div className={styles.prodBody}>
        <h3 className={styles.prodName}>{product.name}</h3>
        <p className={styles.prodDesc}>{product.description}</p>
        <div className={styles.prodFoot}>
          <span className={styles.prodPrice}>{product.price}</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
             onClick={handleClick}
             className={styles.prodWppBtn} aria-label={`Pedir ${product.name} pelo WhatsApp`}>
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ConfeitariaStorePage() {
  const { store, settings } = useStore() || {}
  const { products: dbProducts }         = useProducts(store?.id)
  const { testimonials: dbTestimonials } = useTestimonials(store?.id)

  const [activeFilter, setActiveFilter] = useState('all')
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [scrolled,     setScrolled]     = useState(false)

  const heroTitleRef = useRef(null)
  const pageRef      = useRef(null)

  const wppNumber = store?.whatsapp       || '5561992235201'
  const igUrl     = store?.instagram_url  || 'https://instagram.com/deliciasdaemely'
  const storeName = store?.name           || 'Delicias da Emely'

  const heroTitle     = settings?.hero_title     || 'Celebre cada momento com uma doce lembrança'
  const heroDesc      = settings?.hero_desc      || 'Brigadeiros gourmet, kits presente e caixas especiais para cada ocasião. Feito por encomenda, entregue com carinho em Brasília-DF.'
  const wppMsg        = settings?.hero_wpp_text  || `Olá ${storeName}! Quero fazer um pedido 🍫`
  const clientesTotal = settings?.clientes_total || '500+'
  const anoFundacao   = settings?.ano_fundacao   || '2020'

  const allProducts    = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS
  const filtered       = activeFilter === 'all' ? allProducts : allProducts.filter(p => p.category === activeFilter)
  const testimonials   = dbTestimonials.length > 0 ? dbTestimonials : FALLBACK_TESTIMONIALS
  const marqueeItems   = [...testimonials, ...testimonials]

  const makeWpp = (text) => `https://wa.me/${wppNumber}?text=${encodeURIComponent(text)}`
  const onWpp   = (source) => trackEvent('whatsapp_click', { store: storeName, source })

  // Document title
  useEffect(() => {
    document.title = `${storeName} — Brigadeiros Gourmet & Doces Especiais`
  }, [storeName])

  // Scroll detection for header blur
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lenis smooth scroll + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Hero title — word-by-word reveal
    if (heroTitleRef.current) {
      const words = heroTitleRef.current.querySelectorAll('[data-w]')
      if (words.length) {
        gsap.from(words, {
          y: '115%', opacity: 0,
          stagger: 0.07, duration: 1.1, ease: 'power4.out', delay: 0.4,
        })
      }
    }

    // ScrollTrigger reveals
    const ctx = gsap.context(() => {
      // Single elements: slide-up on enter
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el, {
          y: 48, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })

      // Staggered groups: children slide-up
      gsap.utils.toArray('[data-stagger]').forEach(parent => {
        const kids = parent.querySelectorAll('[data-sc]')
        if (!kids.length) return
        gsap.from(kids, {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: parent, start: 'top 86%', toggleActions: 'play none none none' },
        })
      })

      // Parallax on hero image
      gsap.to('[data-px]', {
        yPercent: -18, ease: 'none',
        scrollTrigger: { trigger: '[data-px-wrap]', start: 'top top', end: 'bottom top', scrub: true },
      })
    }, pageRef)

    return () => {
      lenis.destroy()
      ctx.revert()
      ScrollTrigger.getAll().forEach(s => s.kill())
    }
  }, [])

  return (
    <div className={styles.page} ref={pageRef}>
      <SazonalBanner />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className={`${styles.header} ${scrolled ? styles.hScrolled : ''}`}>
        <div className={styles.hInner}>
          <a href="#inicio" className={styles.logo}>
            <span className={styles.logoGem}>🍫</span>
            <span className={styles.logoText}>{storeName}</span>
          </a>

          <nav className={styles.dNav}>
            {[['#cardapio','Cardápio'],['#sobre','Nossa História'],['#como-funciona','Como Funciona'],['#depoimentos','Avaliações']].map(([href, label]) => (
              <a key={href} href={href} className={styles.dNavLink}>{label}</a>
            ))}
          </nav>

          <MagnetBtn className={styles.hCta} href={makeWpp(wppMsg)} onClick={() => onWpp('header_nav')}>
            <FaWhatsapp /> Fazer Pedido
          </MagnetBtn>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(o => !o)} aria-label="Abrir menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div className={styles.mBd}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)} />
              <motion.nav className={styles.mMenu}
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
                <button className={styles.mClose} onClick={() => setMenuOpen(false)}>✕</button>
                {[['#cardapio','Cardápio'],['#sobre','Nossa História'],['#como-funciona','Como Funciona'],['#depoimentos','Avaliações']].map(([href, label], i) => (
                  <motion.a key={href} href={href} className={styles.mLink}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setMenuOpen(false)}>{label}</motion.a>
                ))}
                <motion.a href={makeWpp(wppMsg)} target="_blank" rel="noopener noreferrer"
                  className={styles.mCta}
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4 * 0.07 }}
                  onClick={() => { setMenuOpen(false); onWpp('mobile_menu') }}>
                  <FaWhatsapp /> Fazer Pedido
                </motion.a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className={styles.hero} id="inicio" data-px-wrap>
        <img src={`${IMG}/hero.png`} alt="" className={styles.heroBg} aria-hidden="true"
             data-px fetchpriority="high" />
        <div className={styles.heroCurtain} />

        <div className={styles.heroInner}>
          <div className={styles.heroL}>
            <motion.p className={styles.heroEyebrow}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}>
              ✦ Artesanal &nbsp;·&nbsp; Gourmet &nbsp;·&nbsp; Brasília-DF ✦
            </motion.p>

            <h1 className={styles.heroTitle} ref={heroTitleRef} aria-label={heroTitle}>
              {heroTitle.split(' ').map((word, i) => (
                <span key={i} className={styles.hWrap}>
                  <span data-w className={styles.hWord}>{word}</span>
                </span>
              ))}
            </h1>

            <motion.p className={styles.heroSub}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.7 }}>
              {heroDesc}
            </motion.p>

            <motion.div className={styles.heroActions}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.6 }}>
              <MagnetBtn className={styles.btnWpp} href={makeWpp(wppMsg)} onClick={() => onWpp('hero')}>
                <FaWhatsapp /> Pedir pelo WhatsApp
              </MagnetBtn>
              <a href="#cardapio" className={styles.btnGhost}>Ver Cardápio ↓</a>
            </motion.div>

            <motion.div className={styles.heroProof}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}>
              <span className={styles.proofStars}>★★★★★</span>
              <span className={styles.proofTxt}>{clientesTotal} clientes satisfeitos em Brasília</span>
            </motion.div>
          </div>

          {/* Right: featured product card floating over the hero image */}
          <motion.div className={styles.heroR}
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 1.1, ease: [0.23, 1, 0.32, 1] }}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardGlow} />
              <img src={`${IMG}/caixa-16.png`} alt="Caixa 16 brigadeiros gourmet"
                   className={styles.heroCardImg} loading="eager" />
              <div className={styles.heroCardTag}>
                <span className={styles.heroCardTagDot} />
                Feito à mão &nbsp;·&nbsp; Ingredientes premium
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className={styles.scrollHint}
          animate={{ y: [0, 8, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.2 }}>↓</motion.div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className={styles.statsBar} data-reveal>
        {[
          { val: clientesTotal, lbl: 'Clientes Felizes' },
          { val: '30+',         lbl: 'Sabores Únicos'   },
          { val: '5.0 ★',      lbl: 'Avaliação Média'  },
          { val: `${new Date().getFullYear() - parseInt(anoFundacao)}+ anos`, lbl: 'Em Brasília-DF' },
        ].map((s, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.statVal}>{s.val}</span>
            <span className={styles.statLbl}>{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── SOBRE ──────────────────────────────────────────────────── */}
      <section className={styles.sobre} id="sobre">
        <div className={styles.wrap}>
          <div className={styles.sobreGrid}>

            {/* Image column — overlapping badge creates the "broken grid" feel */}
            <div className={styles.sobreImgCol} data-reveal>
              <div className={styles.sobreImgBox}>
                <img src={`${IMG}/sobre.png`} alt={`${storeName} — confeiteira artesanal`}
                     className={styles.sobreImg} loading="lazy" />
              </div>
              <div className={styles.sobreBadge}>
                <span className={styles.sobreBadgeIcon}>🍫</span>
                <span className={styles.sobreBadgeTxt}>Feito com<br />amor</span>
              </div>
              {/* Decorative vertical accent line */}
              <div className={styles.sobreAccentLine} />
            </div>

            {/* Text column */}
            <div className={styles.sobreTxtCol}>
              <p className={styles.secTag} data-reveal>Nossa história</p>
              <h2 className={styles.secTitle} data-reveal>
                Feita com amor,<br /><em>servida com alma.</em>
              </h2>
              <p className={styles.sobreP} data-reveal>
                {settings?.sobre_text1 || `A ${storeName} transforma ingredientes premium em momentos inesquecíveis. Cada brigadeiro é resultado de horas de dedicação, ingredientes selecionados a dedo e a paixão genuína de quem ama o que faz.`}
              </p>
              <p className={styles.sobreP} data-reveal>
                {settings?.sobre_text2 || `Não é só um doce — é uma experiência que fica na memória. Desde ${anoFundacao}, adoçando vidas em Brasília-DF com brigadeiros gourmet, kits presente e encomendas especiais.`}
              </p>
              <div className={styles.sobreStats} data-stagger>
                {[
                  { val: clientesTotal, lbl: 'Clientes felizes'    },
                  { val: '100%',        lbl: 'Satisfação garantida' },
                  { val: `${new Date().getFullYear() - parseInt(anoFundacao)}+`, lbl: 'Anos de experiência' },
                ].map((s, i) => (
                  <div key={i} className={styles.sobreStat} data-sc>
                    <span className={styles.sobreStatVal}>{s.val}</span>
                    <span className={styles.sobreStatLbl}>{s.lbl}</span>
                  </div>
                ))}
              </div>
              <div data-reveal>
                <MagnetBtn className={styles.btnWpp}
                  href={makeWpp(`Olá ${storeName}! Quero saber mais sobre vocês 😊`)}
                  onClick={() => onWpp('sobre')}>
                  <FaWhatsapp /> Falar com a Emely
                </MagnetBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDÁPIO ───────────────────────────────────────────────── */}
      <section className={styles.cardapio} id="cardapio">
        <div className={styles.wrap}>
          <p className={styles.secTag} data-reveal>Nosso Cardápio</p>
          <h2 className={styles.secTitle} data-reveal>
            Doces para cada<br /><em>momento especial.</em>
          </h2>

          {/* Filter pills */}
          <div className={styles.filters} data-reveal>
            {CATS.map(c => (
              <motion.button key={c.key}
                className={`${styles.filterBtn} ${activeFilter === c.key ? styles.fActive : ''}`}
                onClick={() => setActiveFilter(c.key)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {c.label}
              </motion.button>
            ))}
          </div>

          {/* Product grid */}
          <AnimatePresence mode="popLayout">
            <motion.div className={styles.prodGrid}>
              {filtered.map(p => (
                <motion.div key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
                  <ProdCard product={p} wppNumber={wppNumber} storeName={storeName} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────────── */}
      <section className={styles.como} id="como-funciona">
        <div className={styles.wrap}>
          <p className={styles.secTag} data-reveal>Simples assim</p>
          <h2 className={styles.secTitle} data-reveal>Como fazer seu pedido</h2>

          <div className={styles.stepsRow} data-stagger>
            {STEPS.map((step, i) => (
              <div key={i} className={styles.step} data-sc>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < STEPS.length - 1 && <div className={styles.stepConnector} aria-hidden />}
              </div>
            ))}
          </div>

          <div className={styles.comoCtaWrap} data-reveal>
            <MagnetBtn className={styles.btnWpp} href={makeWpp(wppMsg)} onClick={() => onWpp('como_funciona')}>
              <FaWhatsapp /> Começar meu pedido
            </MagnetBtn>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS — Marquee ──────────────────────────────────── */}
      <section className={styles.depos} id="depoimentos">
        <div className={styles.wrap}>
          <p className={styles.secTag} data-reveal>Avaliações</p>
          <h2 className={styles.secTitle} data-reveal>
            O que dizem nossos<br /><em>clientes.</em>
          </h2>
        </div>

        <div className={styles.marqueeWrap} aria-label="Depoimentos de clientes">
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((t, i) => (
              <div key={i} className={styles.depoCard}>
                <div className={styles.depoStars}>{'★'.repeat(t.rating || 5)}</div>
                <p className={styles.depoTxt}>"{t.text}"</p>
                <div className={styles.depoAu}>
                  <span className={styles.depoName}>{t.author}</span>
                  {t.role && <span className={styles.depoRole}>{t.role}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────── */}
      <section className={styles.ctaFinal}>
        <div className={styles.ctaGlow1} aria-hidden />
        <div className={styles.ctaGlow2} aria-hidden />
        <div className={styles.wrap} style={{ textAlign: 'center' }}>
          <p className={styles.ctaEybrow} data-reveal>Não espere mais</p>
          <h2 className={styles.ctaTitle} data-reveal>
            Pronto para adoçar<br />o dia de alguém especial?
          </h2>
          <p className={styles.ctaSub} data-reveal>
            Faça seu pedido agora e surpreenda com doces artesanais feitos com amor.
          </p>
          <div data-reveal>
            <MagnetBtn className={styles.ctaBtn} href={makeWpp(wppMsg)} onClick={() => onWpp('cta_final')}>
              <FaWhatsapp /> Fazer meu pedido agora →
            </MagnetBtn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.ftGrid}>
            <div className={styles.ftBrand}>
              <div className={styles.ftLogo}>
                <span>🍫</span> {storeName}
              </div>
              <p className={styles.ftTagline}>
                {settings?.tagline || 'Brigadeiros gourmet e doces especiais feitos com amor em Brasília-DF.'}
              </p>
              <div className={styles.ftSocial}>
                <a href={makeWpp(wppMsg)} target="_blank" rel="noopener noreferrer"
                   onClick={() => onWpp('footer_social')}
                   className={styles.ftSocialLink} aria-label="WhatsApp">
                  <FaWhatsapp />
                </a>
                <a href={igUrl} target="_blank" rel="noopener noreferrer"
                   className={styles.ftSocialLink} aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>

            <div className={styles.ftLinks}>
              <p className={styles.ftLinksTitle}>Cardápio</p>
              {['Brigadeiros Gourmet','Kits Presente','Kit Namorados','Kit Festas','Kit Corporativo'].map(l => (
                <a key={l} href="#cardapio" className={styles.ftLink}>{l}</a>
              ))}
            </div>

            <div className={styles.ftLinks}>
              <p className={styles.ftLinksTitle}>Contato</p>
              <a href={makeWpp(wppMsg)} target="_blank" rel="noopener noreferrer"
                 onClick={() => onWpp('footer_contato')} className={styles.ftLink}>WhatsApp</a>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className={styles.ftLink}>@deliciasdaemely</a>
              <span className={styles.ftLink}>Brasília-DF</span>
            </div>
          </div>

          <div className={styles.ftBottom}>
            <p className={styles.ftCopy}>© {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</p>
            <p className={styles.ftPowered}>
              Sistema por{' '}
              <a href="https://alephtec.com.br" target="_blank" rel="noopener noreferrer">AlephSistem</a>
            </p>
          </div>
        </div>
      </footer>

      <WppFloat />
      <BackToTop />
    </div>
  )
}
