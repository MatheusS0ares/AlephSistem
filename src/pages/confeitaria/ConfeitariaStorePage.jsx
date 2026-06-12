import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useStore } from '../../context/StoreContext'
import { useProducts, useTestimonials } from '../../hooks/useSupabase'
import SazonalBanner from '../../components/SazonalBanner'
import WppFloat from '../../components/WppFloat'
import BackToTop from '../../components/BackToTop'
import styles from './ConfeitariaStorePage.module.css'

const FALLBACK_PRODUCTS = [
  { id: 1, category: 'namorados', icon: '🍫', name: 'Jogo do Prazer — Ferrero Rocher',      description: '12 Ferrero Rocher + 2 dados do prazer. Pedido sob encomenda.',              price: 'R$ 95,00',  badge: 'Hot'  },
  { id: 2, category: 'namorados', icon: '❤️', name: 'Jogo do Prazer — Brigadeiros Gourmet', description: '12 brigadeiros sortidos + 2 dados do prazer.',                              price: 'R$ 80,00',  badge: 'Novo' },
  { id: 3, category: 'presentes', icon: '🎁', name: 'Caixa 9 Brigadeiros Gourmet',          description: 'Ninho, Pistache, Morango, Chocolate Belga e mais.',                         price: 'R$ 45,00',  badge: null   },
  { id: 4, category: 'presentes', icon: '🍫', name: 'Caixa 16 Brigadeiros Gourmet',         description: 'Perfeita para presentes e celebrações especiais.',                          price: 'R$ 75,00',  badge: null   },
  { id: 5, category: 'presentes', icon: '🎁', name: 'Kit Presente Romântico',               description: '12 doces sortidos + embalagem premium + cartão personalizado.',             price: 'R$ 90,00',  badge: 'Hot'  },
  { id: 6, category: 'festas',   icon: '🎂', name: 'Kit Festa 50 unidades',                 description: '50 brigadeiros sortidos com embalagem individual para eventos.',            price: 'R$ 180,00', badge: null   },
  { id: 7, category: 'festas',   icon: '🏢', name: 'Kit Corporativo 30 caixinhas',          description: '30 caixinhas personalizadas com logotipo da empresa.',                      price: 'R$ 210,00', badge: null   },
  { id: 8, category: 'presentes', icon: '🍬', name: 'Trufas Artesanais (caixa 12)',         description: 'Dark, Ao Leite, Limão Siciliano e Maracujá.',                               price: 'R$ 70,00',  badge: 'Novo' },
]

const CAT_LABELS = {
  all: 'Todos',
  brigadeiros: 'Brigadeiros',
  'kits-presente': 'Kits Presente',
  festas: 'Festas & Eventos',
  namorados: 'Namorados',
  corporativo: 'Corporativo',
  chocolates: 'Chocolates',
  presentes: 'Caixas & Kits',
}

const CAT_GRADIENTS = {
  brigadeiros:    'linear-gradient(135deg, #3d0a1f 0%, #6b1035 100%)',
  'kits-presente':'linear-gradient(135deg, #2d0a3d 0%, #5b2070 100%)',
  festas:         'linear-gradient(135deg, #3d0a1f 0%, #8b1260 100%)',
  namorados:      'linear-gradient(135deg, #3d0a0a 0%, #8b1a1a 100%)',
  corporativo:    'linear-gradient(135deg, #0a0a2d 0%, #1a2060 100%)',
  chocolates:     'linear-gradient(135deg, #1a0d0a 0%, #4e2218 100%)',
  presentes:      'linear-gradient(135deg, #3d0a20 0%, #8b1040 100%)',
}

const DEFAULT_CATS = [
  { icon: '🍫', title: 'Brigadeiros',       desc: 'Gourmet nos melhores sabores: Ninho, Pistache, Morango e muito mais.',          cat: 'brigadeiros'   },
  { icon: '🎁', title: 'Kits Presente',     desc: 'Caixas montadas com capricho para presentear com amor.',                        cat: 'kits-presente' },
  { icon: '🎂', title: 'Festas',            desc: 'Doces artesanais para aniversários, chás e comemorações.',                      cat: 'festas'        },
  { icon: '❤️', title: 'Dia dos Namorados', desc: 'Kits especiais: Jogo do Prazer, Ferrero Rocher e caixinhas surpresa.',          cat: 'namorados'     },
  { icon: '🏢', title: 'Corporativo',       desc: 'Brindes personalizados e kits para eventos empresariais.',                      cat: 'corporativo'   },
  { icon: '🍬', title: 'Chocolates',        desc: 'Trufas, bombons e kits de chocolates artesanais premium.',                     cat: 'chocolates'    },
]

const DEFAULT_STEPS = [
  { num: '01', icon: '📲', title: 'Escolha seus doces',  desc: 'Veja o cardápio, escolha os sabores, quantidades e embalagem ideal para a ocasião.' },
  { num: '02', icon: '💬', title: 'Peça pelo WhatsApp',  desc: 'Confirme o pedido, endereço e forma de pagamento direto com a Emely.'               },
  { num: '03', icon: '🍫', title: 'Receba com amor',     desc: 'Entregamos ou você retira. Feito na hora, com ingredientes frescos e muito carinho.' },
]

export default function ConfeitariaStorePage() {
  const { store, settings } = useStore() || {}
  const { products: dbProducts, loading: prodLoading } = useProducts(store?.id)
  const { testimonials: db } = useTestimonials(store?.id)
  const [activeFilter, setActiveFilter] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const wppNumber = store?.whatsapp || '5561992235201'
  const igUrl     = store?.instagram_url || 'https://instagram.com/deliciasdaemely'
  const storeName = store?.name || 'Delicias da Emely'

  const eyebrow   = settings?.hero_eyebrow || '✦ Confeitaria artesanal feita com amor ✦'
  const heroTitle = settings?.hero_title   || 'Celebre cada momento com uma doce lembrança'
  const heroDesc  = settings?.hero_desc    || 'Brigadeiros gourmet, kits presente e caixas especiais para cada ocasião. Feito por encomenda, entregue com carinho.'
  const wppText   = settings?.hero_wpp_text || `Olá ${storeName}! Quero fazer um pedido 🍫`

  const clientesTotal = settings?.clientes_total || '200+'
  const pedidosTotal  = settings?.pedidos_total  || '500+'
  const anosExp       = settings?.anos_exp       || '3+'

  let cats = DEFAULT_CATS
  if (settings?.categorias_json) {
    try { cats = JSON.parse(settings.categorias_json) } catch {}
  }

  let steps = DEFAULT_STEPS
  if (settings?.como_funciona_steps) {
    try { steps = JSON.parse(settings.como_funciona_steps) } catch {}
  }

  let testimonials = []
  if (db.length > 0) {
    testimonials = db
  } else if (settings?.depoimentos_json) {
    try { testimonials = JSON.parse(settings.depoimentos_json) } catch {}
  }

  const allProducts      = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS
  const filteredProducts = activeFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeFilter)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const makeWppLink = (text) =>
    `https://wa.me/${wppNumber}?text=${encodeURIComponent(text)}`

  const pedirProduto = (name) =>
    window.open(makeWppLink(`Olá ${storeName}! Tenho interesse em: ${name} 🍫`), '_blank')

  const filterAndScroll = (cat) => {
    setActiveFilter(cat)
    setTimeout(() => {
      document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  // Build hero title split — italic the last "meaningful phrase" after last break word
  const renderHeroTitle = () => {
    const breakWords = [' uma ', ' com ', ' em ']
    for (const bw of breakWords) {
      if (heroTitle.toLowerCase().includes(bw)) {
        const idx = heroTitle.toLowerCase().lastIndexOf(bw)
        const before = heroTitle.slice(0, idx)
        const after  = heroTitle.slice(idx)
        return <>{before}<em>{after}</em></>
      }
    }
    return <>{heroTitle}</>
  }

  return (
    <div className={styles.page} data-theme="confeitaria">
      <SazonalBanner />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerInner}>
          <a href="#inicio" className={styles.logoLink}>
            <span className={styles.logoIcon}>🍫</span>
            <span className={styles.logoName}>{storeName}</span>
          </a>

          <nav className={styles.nav}>
            {[['#sobre','Sobre'],['#categorias','Categorias'],['#cardapio','Cardápio'],['#depoimentos','Depoimentos']].map(([href, label]) => (
              <a key={href} href={href} className={styles.navLink}>{label}</a>
            ))}
            <a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer" className={styles.navCta}>
              <FaWhatsapp /> Fazer Pedido
            </a>
          </nav>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerActive : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div className={styles.backdrop}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)} />
              <motion.nav className={styles.mobileNav}
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                {[['#sobre','Sobre'],['#categorias','Categorias'],['#cardapio','Cardápio'],['#depoimentos','Depoimentos']].map(([href, label], i) => (
                  <motion.a key={href} href={href} className={styles.mobileNavLink}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setMenuOpen(false)}>{label}</motion.a>
                ))}
                <motion.a
                  href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
                  className={`${styles.mobileNavLink} ${styles.mobileNavCta}`}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4 * 0.07 }}
                  onClick={() => setMenuOpen(false)}>
                  <FaWhatsapp /> Fazer Pedido
                </motion.a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className={styles.hero} id="inicio">
        <div className={styles.heroBg} />
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <motion.p className={styles.heroEyebrow}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}>
              {eyebrow}
            </motion.p>

            <motion.h1 className={styles.heroTitle}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}>
              {renderHeroTitle()}
            </motion.h1>

            <motion.p className={styles.heroDesc}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}>
              {heroDesc}
            </motion.p>

            <motion.div className={styles.heroActions}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}>
              <motion.a href="#cardapio" className={styles.btnOutline}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                Ver Cardápio
              </motion.a>
              <motion.a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
                className={styles.btnWpp}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <FaWhatsapp /> Pedir pelo WhatsApp
              </motion.a>
            </motion.div>

            <motion.div className={styles.heroProof}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}>
              <span className={styles.proofStars}>★★★★★</span>
              <span className={styles.proofText}>{clientesTotal} clientes satisfeitos em Brasília</span>
            </motion.div>
          </div>

          <motion.div className={styles.heroVisual}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}>
            <div className={styles.showcaseGrid}>
              {[
                { emoji: '🍫', label: 'Brigadeiros' },
                { emoji: '🎁', label: 'Kits Presente' },
                { emoji: '❤️', label: 'Namorados' },
                { emoji: '🎂', label: 'Festas' },
              ].map((item, i) => (
                <motion.div key={item.emoji} className={styles.showcaseCard}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                  <span className={styles.showcaseEmoji}>{item.emoji}</span>
                  <span className={styles.showcaseLabel}>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className={styles.heroScroll}
          animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          ↓
        </motion.div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        {[
          { num: anosExp,       label: 'Anos de amor'       },
          { num: pedidosTotal,  label: 'Pedidos entregues'  },
          { num: clientesTotal, label: 'Clientes felizes'   },
          { num: '5 ★',        label: 'Avaliação média'     },
        ].map((s, i) => (
          <motion.div key={s.label} className={styles.stat}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── SOBRE ──────────────────────────────────────────────── */}
      <section className={styles.sobre} id="sobre">
        <div className={styles.container}>
          <div className={styles.sobreGrid}>
            <motion.div className={styles.sobreImageWrap}
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className={styles.sobreImgBox}>
                <motion.span className={styles.sobreImgEmoji}
                  animate={{ scale: [1, 1.06, 1], rotate: [0, 3, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity }}>
                  🍫
                </motion.span>
              </div>
              <motion.div className={styles.sobreBadge}
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}>
                <span className={styles.sobreBadgeNum}>{clientesTotal}</span>
                <span className={styles.sobreBadgeText}>Clientes felizes</span>
              </motion.div>
            </motion.div>

            <div className={styles.sobreContent}>
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p className={styles.eyebrow}>Nossa história</p>
                <h2 className={styles.sectionTitle}>
                  Feito com amor,<br /><em>entregue com carinho</em>
                </h2>
                <p className={styles.sobreText}>
                  {settings?.sobre_text1 || `A ${storeName} é uma confeitaria artesanal especializada em brigadeiros gourmet, kits presente e encomendas para festas e eventos em Brasília.`}
                </p>
                <p className={styles.sobreText}>
                  {settings?.sobre_text2 || 'Cada doce é feito com ingredientes selecionados e muito carinho. Nossa missão é transformar cada pedido em uma experiência inesquecível.'}
                </p>
              </motion.div>

              <motion.div className={styles.sobreStats}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}>
                {[
                  { num: anosExp,      label: 'Anos de experiência'  },
                  { num: pedidosTotal, label: 'Pedidos entregues'    },
                  { num: '100%',       label: 'Satisfação garantida' },
                ].map(s => (
                  <div key={s.label} className={styles.sobreStat}>
                    <span className={styles.sobreStatNum}>{s.num}</span>
                    <span className={styles.sobreStatLabel}>{s.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
                className={styles.btnPrimary}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                Fale conosco no WhatsApp
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ─────────────────────────────────────────── */}
      <section className={styles.categorias} id="categorias">
        <div className={styles.container}>
          <motion.div className={styles.sectionHeader}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className={styles.eyebrow}>Explore nossos doces</p>
            <h2 className={styles.sectionTitle}>O que você vai <em>amar</em></h2>
          </motion.div>

          <div className={styles.catsGrid}>
            {cats.map((cat, i) => (
              <motion.button key={cat.cat} className={styles.catCard}
                onClick={() => filterAndScroll(cat.cat)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                whileHover={{ y: -6 }}>
                <div className={styles.catIcon}>{cat.icon}</div>
                <h3 className={styles.catTitle}>{cat.title}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.catLink}>Ver produtos →</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARDÁPIO ───────────────────────────────────────────── */}
      <section className={styles.cardapio} id="cardapio">
        <div className={styles.container}>
          <motion.div className={styles.sectionHeader}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className={styles.eyebrow}>Nossos produtos</p>
            <h2 className={styles.sectionTitle}>Cardápio <em>artesanal</em></h2>
            <p className={styles.sectionDesc}>Toque em qualquer produto para fazer seu pedido pelo WhatsApp</p>
          </motion.div>

          <div className={styles.filters}>
            <motion.button
              className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter('all')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Todos
            </motion.button>
            {cats.map(c => (
              <motion.button key={c.cat}
                className={`${styles.filterBtn} ${activeFilter === c.cat ? styles.filterActive : ''}`}
                onClick={() => setActiveFilter(c.cat)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {c.icon} {c.title}
              </motion.button>
            ))}
          </div>

          {prodLoading ? (
            <div className={styles.prodGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : (
            <motion.div className={styles.prodGrid} layout>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, i) => (
                  <motion.article key={p.id} className={styles.prodCard} layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}>

                    <div className={styles.prodImgWrap}
                      style={{ background: CAT_GRADIENTS[p.category] || CAT_GRADIENTS.presentes }}>
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className={styles.prodImgReal} />
                        : <span className={styles.prodEmoji}>{p.icon || '🍫'}</span>
                      }
                      {p.badge && (
                        <span className={`${styles.prodBadge} ${styles[`badge${p.badge}`]}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <div className={styles.prodInfo}>
                      <span className={styles.prodCatLabel}>{CAT_LABELS[p.category] || p.category}</span>
                      <h3 className={styles.prodName}>{p.name}</h3>
                      <p className={styles.prodDesc}>{p.description}</p>
                      <div className={styles.prodFooter}>
                        <span className={styles.prodPrice}>{p.price}</span>
                        <motion.button className={styles.prodWppBtn}
                          onClick={() => pedirProduto(p.name)}
                          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                          <FaWhatsapp />
                          Pedir
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          <motion.div className={styles.moreProd}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}>
            <p>Não encontrou o que procura? Fazemos sob encomenda!</p>
            <motion.a
              href={makeWppLink('Olá! Vi o cardápio e quero solicitar uma encomenda especial 🍫')}
              target="_blank" rel="noopener noreferrer"
              className={styles.btnPrimary}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              Solicitar encomenda especial
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────── */}
      <section className={styles.comoFunciona}>
        <div className={styles.container}>
          <motion.div className={styles.sectionHeader}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className={styles.eyebrow}>Simples e rápido</p>
            <h2 className={styles.sectionTitle}>Como fazer <em>seu pedido</em></h2>
          </motion.div>

          <div className={styles.stepsRow}>
            {steps.map((step, i) => (
              <motion.div key={step.num} className={styles.step}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                <div className={styles.stepNum}>{step.num}</div>
                <motion.div className={styles.stepIcon}
                  whileInView={{ rotate: [0, -8, 8, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 0.5 }}>
                  {step.icon}
                </motion.div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className={styles.stepsCta}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}>
            <motion.a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
              className={styles.btnWpp}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <FaWhatsapp /> Começar meu pedido agora
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className={styles.depoimentos} id="depoimentos">
          <div className={styles.container}>
            <motion.div className={styles.sectionHeader}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className={styles.eyebrow}>O que dizem</p>
              <h2 className={styles.sectionTitle}>Clientes que <em>amaram</em></h2>
            </motion.div>

            <div className={styles.depGrid}>
              {testimonials.map((d, i) => (
                <motion.div key={d.id || i}
                  className={`${styles.depCard} ${d.featured ? styles.depFeatured : ''}`}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}>
                  <div className={styles.depStars}>{'★'.repeat(d.stars || 5)}</div>
                  <p className={styles.depText}>"{d.text}"</p>
                  <div className={styles.depAutor}>
                    <div className={styles.depAvatar}>{d.name?.[0] || '?'}</div>
                    <div>
                      <span className={styles.depNome}>{d.name}</span>
                      <span className={styles.depRole}>{d.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className={styles.ctaFinal}>
        <div className={styles.ctaBg} />
        <div className={styles.container}>
          <motion.div className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className={styles.ctaEyebrow}>Pronto para adoçar seu dia?</p>
            <h2 className={styles.ctaTitle}>Faça seu pedido <em>agora mesmo</em></h2>
            <p className={styles.ctaDesc}>
              Atendemos pelo WhatsApp todos os dias. Resposta rápida e atendimento personalizado!
            </p>
            <motion.a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
              className={styles.ctaBtn}
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
              <FaWhatsapp size={20} /> Pedir agora pelo WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <p className={styles.footerLogo}>🍫 {storeName}</p>
              <p className={styles.footerTagline}>
                {store?.tagline || 'Brigadeiros gourmet e doces especiais'}
              </p>
              <div className={styles.footerSocial}>
                <motion.a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer"
                  className={styles.socialWpp} aria-label="WhatsApp"
                  whileHover={{ scale: 1.15, backgroundColor: '#25D366', color: '#fff' }}>
                  <FaWhatsapp />
                </motion.a>
                <motion.a href={igUrl} target="_blank" rel="noopener noreferrer"
                  className={styles.socialIg} aria-label="Instagram"
                  whileHover={{ scale: 1.15, backgroundColor: '#E1306C', color: '#fff' }}>
                  <FaInstagram />
                </motion.a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <h4>Navegação</h4>
              <ul>
                {[['#sobre','Sobre nós'],['#categorias','Categorias'],['#cardapio','Cardápio'],['#depoimentos','Depoimentos']].map(([href, label]) => (
                  <li key={href}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h4>Atendimento</h4>
              <ul>
                <li><a href={makeWppLink(wppText)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><a href={igUrl} target="_blank" rel="noopener noreferrer">{store?.instagram || '@deliciasdaemely'}</a></li>
                <li><span>{store?.address || 'Brasília - DF'}</span></li>
                <li><span>Seg–Dom: 8h às 21h</span></li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</p>
            <p>Feito com <span className={styles.heart}>♥</span> para adoçar sua vida</p>
          </div>
        </div>
      </footer>

      <WppFloat />
      <BackToTop />
    </div>
  )
}
