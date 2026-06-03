import { motion } from 'motion/react'
import AnimateOnView from './AnimateOnView'
import styles from './Categorias.module.css'

const cats = [
  { icon: '🎉', title: 'Festas & Eventos', desc: 'Convites, toppers, tags, banners e painéis para sua festa dos sonhos.', cat: 'festas' },
  { icon: '🍼', title: 'Chá de Bebê', desc: 'Lembrancinhas, kits personalizados e decoração completa.', cat: 'bebes' },
  { icon: '🎁', title: 'Presentes', desc: 'Caixas surpresa, kits personalizados e mimos únicos.', cat: 'presentes' },
  { icon: '👶', title: 'Maternidade', desc: 'Tags, kits bebê e frascos personalizados com carinho.', cat: 'maternidade' },
  { icon: '🎂', title: 'Aniversários', desc: 'Kits festa, lembranças e convites para todos os estilos.', cat: 'aniversario' },
  { icon: '✨', title: 'Corporativo', desc: 'Brindes e kits empresariais para clientes especiais.', cat: 'corporativo' },
]

export default function Categorias() {
  return (
    <section className={styles.section} id="categorias">
      <div className="container">
        <AnimateOnView>
          <div className="section-header">
            <span className="section-eyebrow">O que fazemos</span>
            <h2 className="section-title">Nossas <em>categorias</em></h2>
            <p className="section-desc">Encontre o produto perfeito para cada ocasião especial</p>
          </div>
        </AnimateOnView>

        <div className={styles.grid}>
          {cats.map((c, i) => (
            <motion.a
              key={c.cat}
              href="#catalogo"
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{ y: -6, borderColor: 'var(--gold-dark)', boxShadow: 'var(--shadow-gold)' }}
            >
              <div className={styles.icon}>{c.icon}</div>
              <h3 className={styles.title}>{c.title}</h3>
              <p className={styles.desc}>{c.desc}</p>
              <span className={styles.link}>Ver produtos →</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
