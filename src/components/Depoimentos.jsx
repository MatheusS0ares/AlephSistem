import { motion } from 'motion/react'
import AnimateOnView from './AnimateOnView'
import { useTestimonials } from '../hooks/useSupabase'
import { useStore } from '../context/StoreContext'
import styles from './Depoimentos.module.css'

const FALLBACK = [
  { id: 1, name: 'Ana Carolina',  role: 'Mamãe do Theo 👶',  text: 'Fiz meu chá de bebê com os produtos do Reino Imperial e ficou lindo demais! Tudo personalizado e entregue antes do prazo. Super recomendo!', stars: 5, featured: false },
  { id: 2, name: 'Juliana Mendes',role: 'Aniversariante 🎂', text: 'Melhor investimento para minha festa! Os convites personalizados impressionaram todos os convidados. Atendimento maravilhoso!',              stars: 5, featured: true  },
  { id: 3, name: 'Marina Santos', role: 'Cliente fiel 💛',   text: 'Comprei como presente para minha amiga e ela adorou! A caixa veio linda, toda personalizada. Com certeza vou comprar mais!',              stars: 5, featured: false },
]

export default function Depoimentos() {
  const { store } = useStore() || {}
  const { testimonials: db } = useTestimonials(store?.id)
  const list = db.length > 0 ? db : FALLBACK

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
  }

  return (
    <section className={styles.section} id="depoimentos">
      <div className="container">
        <AnimateOnView>
          <div className="section-header">
            <span className="section-eyebrow">O que dizem</span>
            <h2 className="section-title">Clientes que <em>amaram</em></h2>
          </div>
        </AnimateOnView>
        <div className={styles.grid}>
          {list.map((d, i) => (
            <motion.div key={d.id}
              className={`${styles.card} ${d.featured ? styles.destaque : ''}`}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -6 }}>
              <div className={styles.stars}>{'★'.repeat(d.stars)}</div>
              <p className={styles.text}>"{d.text}"</p>
              <div className={styles.autor}>
                <div className={styles.avatar}>{d.name[0]}</div>
                <div>
                  <span className={styles.nome}>{d.name}</span>
                  <span className={styles.cargo}>{d.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
