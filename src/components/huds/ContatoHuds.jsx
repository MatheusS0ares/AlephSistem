import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import styles from './ContatoHuds.module.css'

const INFO = [
  {
    icon: <FaMapMarkerAlt />,
    titulo: 'Endereço',
    linhas: ['Gama — DF', 'Atendimento reservado'],
  },
  {
    icon: <FaClock />,
    titulo: 'Horário de Funcionamento',
    linhas: ['Seg a Sáb — Só com horário', 'Domingo — Fechado'],
  },
  {
    icon: <FaWhatsapp />,
    titulo: 'WhatsApp',
    linhas: ['(61) 99938-5296'],
  },
  {
    icon: <FaInstagram />,
    titulo: 'Instagram',
    linhas: ['@hudsbarbearia', '824 seguidores'],
  },
]

export default function ContatoHuds({ whatsapp = '5500000000000', instagram = 'https://instagram.com/hudsbarbearia' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const wppLink = `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Barbearia%20HUD%27S.`

  return (
    <section className={styles.section} id="contato" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.label}>Fale conosco</span>
          <h2 className={styles.title}>
            ONDE <span className={styles.gold}>NOS ENCONTRAR</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.infoBlock}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {INFO.map((item, i) => (
              <div key={i} className={styles.infoItem}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div>
                  <span className={styles.infoTitulo}>{item.titulo}</span>
                  {item.linhas.map((l, j) => (
                    <span key={j} className={styles.infoLinha}>{l}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className={styles.ctaRow}>
              <a href={wppLink} target="_blank" rel="noopener noreferrer" className={styles.btnWpp}>
                <FaWhatsapp /> Conversar no WhatsApp
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.btnIg}>
                <FaInstagram />
              </a>
            </div>
          </motion.div>

          <motion.div
            className={styles.mapBlock}
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <iframe
              className={styles.mapIframe}
              title="Barbearia HUD'S"
              src="https://maps.google.com/maps?q=Gama+DF+Brasil&t=&z=14&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
