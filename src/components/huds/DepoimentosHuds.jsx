import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import styles from './DepoimentosHuds.module.css'

const DEPOIMENTOS = [
  {
    nome: 'Rafael Souza',
    texto: 'Melhor barbearia que já fui! O corte ficou impecável, a barba perfeita. Atendimento top demais. Já virei cliente fixo.',
    estrelas: 5,
    servico: 'Corte + Barba',
  },
  {
    nome: 'Lucas Oliveira',
    texto: 'O degradê ficou exatamente como pedi. Profissional muito habilidoso e atencioso. Lugar limpo e ambiente agradável. Recomendo!',
    estrelas: 5,
    servico: 'Degradê / Fade',
  },
  {
    nome: 'Matheus Costa',
    texto: 'Combo corte e barba foi perfeito. Melhor custo-benefício da região. Saí de lá parecendo outra pessoa. Já agendei para o próximo mês.',
    estrelas: 5,
    servico: 'Combo Corte + Barba',
  },
  {
    nome: 'Diego Ferreira',
    texto: 'Atendimento rápido, preço justo e resultado excelente. A sobrancelha masculina ficou muito natural. Recomendo a todos.',
    estrelas: 5,
    servico: 'Sobrancelha Masculina',
  },
  {
    nome: 'Bruno Alves',
    texto: 'Sempre saio satisfeito. O profissional entende o que você quer e entrega ainda melhor. Melhor barbearia da cidade!',
    estrelas: 5,
    servico: 'Corte Clássico',
  },
  {
    nome: 'Henrique Lima',
    texto: 'Fiz a hidratação capilar e a diferença foi incrível. Cabelo muito mais saudável e com brilho. Atendimento excelente!',
    estrelas: 5,
    servico: 'Hidratação Capilar',
  },
]

function Estrelas({ count }) {
  return (
    <div className={styles.estrelas}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? styles.estOn : styles.estOff}>★</span>
      ))}
    </div>
  )
}

export default function DepoimentosHuds() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} id="depoimentos" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>O que dizem</span>
          <h2 className={styles.title}>
            CLIENTES QUE <span className={styles.gold}>CONFIAM</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {DEPOIMENTOS.map((d, i) => (
            <motion.div
              key={d.nome}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <div className={styles.quote}>"</div>
              <p className={styles.texto}>{d.texto}</p>
              <Estrelas count={d.estrelas} />
              <div className={styles.autor}>
                <div className={styles.avatar}>
                  {d.nome.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <span className={styles.nome}>{d.nome}</span>
                  <span className={styles.servico}>{d.servico}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
