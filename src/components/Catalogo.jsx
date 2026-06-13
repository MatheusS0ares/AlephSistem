import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp } from 'react-icons/fa'
import AnimateOnView from './AnimateOnView'
import { useProducts } from '../hooks/useSupabase'
import { useStore } from '../context/StoreContext'
import { CATEGORIES } from '../lib/supabase'
import styles from './Catalogo.module.css'

const FALLBACK_PRODUCTS = [
  { id: 1, category: 'festas',     icon: '🎉', name: 'Kit Festa Personalizado',      description: 'Convite + Topper + Tag + Banner completo',      price: 'A partir de R$ 59,90' },
  { id: 2, category: 'bebes',      icon: '🍼', name: 'Kit Chá de Bebê',              description: 'Convites + Lembrancinhas + Decoração completa',  price: 'A partir de R$ 89,90' },
  { id: 3, category: 'presentes',  icon: '🎁', name: 'Caixa Surpresa Personalizada', description: 'Caixa especial com itens personalizados',          price: 'A partir de R$ 49,90' },
  { id: 4, category: 'aniversario',icon: '🎂', name: 'Topper de Bolo Personalizado', description: 'Topper exclusivo no tema e cor da sua escolha',    price: 'A partir de R$ 19,90' },
  { id: 5, category: 'festas',     icon: '📋', name: 'Convite Digital Animado',       description: 'Convite em vídeo para WhatsApp e Instagram',      price: 'A partir de R$ 29,90' },
  { id: 6, category: 'bebes',      icon: '👶', name: 'Tag de Maternidade',           description: 'Tags personalizadas para o nascimento do bebê',   price: 'A partir de R$ 24,90' },
  { id: 7, category: 'presentes',  icon: '✉️', name: 'Kit Mimo Personalizado',       description: 'Conjunto de mimos com mensagem exclusiva',         price: 'A partir de R$ 34,90' },
  { id: 8, category: 'aniversario',icon: '🎈', name: 'Painel de Aniversário',        description: 'Painel temático impresso com arte exclusiva',      price: 'A partir de R$ 45,90' },
  { id: 9, category: 'festas',     icon: '🌟', name: 'Kit Lembrancinhas',            description: 'Lembranças personalizadas para seus convidados',   price: 'A partir de R$ 39,90' },
]

const FILTROS = [
  { key: 'all', label: 'Todos' },
  ...Object.entries(CATEGORIES).map(([key, label]) => ({ key, label })),
]

export default function Catalogo() {
  const [filtro, setFiltro] = useState('all')
  const { store } = useStore() || {}
  const { products: dbProducts, loading } = useProducts(store?.id)

  const wppNumber   = store?.whatsapp || '5500000000000'
  const allProducts = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS
  const visíveis    = filtro === 'all' ? allProducts : allProducts.filter(p => p.category === filtro)

  function pedirWhatsApp(produto) {
    const nome = store?.name || 'vocês'
    const msg = encodeURIComponent(`Olá ${nome}! Quero saber mais sobre: ${produto} 😊`)
    window.open(`https://wa.me/${wppNumber}?text=${msg}`, '_blank')
  }

  return (
    <section className={styles.section} id="catalogo">
      <div className="container">
        <AnimateOnView>
          <div className="section-header">
            <span className="section-eyebrow">Nossos produtos</span>
            <h2 className="section-title">Nosso <em>Catálogo</em></h2>
            <p className="section-desc">Clique em qualquer produto para fazer seu pedido pelo WhatsApp</p>
          </div>
        </AnimateOnView>

        <AnimateOnView delay={0.1}>
          <div className={styles.filtros}>
            {FILTROS.map(f => (
              <motion.button key={f.key}
                className={`${styles.filtroBtn} ${filtro === f.key ? styles.active : ''}`}
                onClick={() => setFiltro(f.key)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                {f.label}
              </motion.button>
            ))}
          </div>
        </AnimateOnView>

        {loading ? (
          <div className={styles.loading}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence mode="popLayout">
              {visíveis.map((p, i) => (
                <motion.div key={p.id} className={styles.card} layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -6, borderColor: 'var(--gold-dark)', boxShadow: 'var(--shadow-gold)' }}>
                  <div className={styles.imgWrap}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className={styles.productImg} />
                      : <div className={styles.placeholder}>{p.icon || '🎁'}</div>
                    }
                    <motion.div className={styles.overlay}
                      initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                      <motion.button className={styles.overlayBtn}
                        onClick={() => pedirWhatsApp(p.name)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Pedir agora
                      </motion.button>
                    </motion.div>
                  </div>
                  <div className={styles.info}>
                    <span className={styles.cat}>{CATEGORIES[p.category] || p.category}</span>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.desc}>{p.description}</p>
                    <div className={styles.footer}>
                      <span className={styles.price}>{p.price}</span>
                      <motion.button className={styles.wppBtn}
                        onClick={() => pedirWhatsApp(p.name)}
                        whileHover={{ scale: 1.15, backgroundColor: '#25D366', color: '#fff' }}
                        whileTap={{ scale: 0.95 }} title="Pedir pelo WhatsApp">
                        <FaWhatsapp />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimateOnView delay={0.2}>
          <div className={styles.more}>
            <p>Não encontrou o que procura? Fazemos sob encomenda!</p>
            <motion.a
              href={`https://wa.me/${wppNumber}?text=Olá!%20Quero%20um%20produto%20personalizado%20especial%20🎁`}
              target="_blank" rel="noopener noreferrer" className="btn btn--gold"
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              Solicitar produto personalizado
            </motion.a>
          </div>
        </AnimateOnView>
      </div>
    </section>
  )
}
