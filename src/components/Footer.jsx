import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import StoreLogo from './StoreLogo'
import styles from './Footer.module.css'

export default function Footer() {
  const navigate = useNavigate()
  const { store, settings } = useStore() || {}
  const wppNumber = store?.whatsapp || '5500000000000'
  const igUrl     = store?.instagram_url || '#'
  const storeName = store?.name || 'Nossa Loja'

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <button className={styles.logo} onClick={() => navigate('/')}>
              <StoreLogo slug={store?.slug} size="md" />
            </button>
            <p className={styles.tagline}>{store?.tagline || settings?.hero_desc?.slice(0, 80) || 'Transformando momentos em memórias eternas com produtos únicos.'}</p>
            <div className={styles.social}>
              <motion.a href={`https://wa.me/${wppNumber}`} target="_blank" rel="noopener noreferrer"
                className={styles.socialWpp}
                whileHover={{ scale: 1.15, backgroundColor: '#25D366', color: '#fff' }} aria-label="WhatsApp">
                <FaWhatsapp />
              </motion.a>
              <motion.a href={igUrl} target="_blank" rel="noopener noreferrer"
                className={styles.socialIg}
                whileHover={{ scale: 1.15, backgroundColor: '#E1306C', color: '#fff' }} aria-label="Instagram">
                <FaInstagram />
              </motion.a>
            </div>
          </div>

          <div className={styles.links}>
            <h4>Navegação</h4>
            <ul>
              {[['#sobre','Sobre nós'],['#categorias','Categorias'],['#catalogo','Catálogo'],['#depoimentos','Depoimentos'],['#contato','Contato']].map(([href, label]) => (
                <li key={href}><motion.a href={href} whileHover={{ color: 'var(--gold)', x: 4 }}>{label}</motion.a></li>
              ))}
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Categorias</h4>
            <ul>
              {(() => {
                let cats = ['Festas & Eventos','Chá de Bebê','Presentes','Aniversários','Maternidade']
                if (settings?.categorias_json) {
                  try { cats = JSON.parse(settings.categorias_json).slice(0,5).map(c => c.title) } catch {}
                }
                return cats.map(cat => (
                  <li key={cat}><motion.a href="#catalogo" whileHover={{ color: 'var(--gold)', x: 4 }}>{cat}</motion.a></li>
                ))
              })()}
            </ul>
          </div>

          <div className={styles.links}>
            <h4>Atendimento</h4>
            <ul>
              <li><a href={`https://wa.me/${wppNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={igUrl} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><span>Seg–Sáb: 8h às 20h</span></li>
              <li><span>Entregamos para todo Brasil</span></li>
              <li>
                <button className={styles.switchBtn} onClick={() => navigate('/')}>
                  ↩ Trocar de loja
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 {storeName}. Todos os direitos reservados.</p>
          <p>Feito com <span className={styles.heart}>♥</span> para momentos inesquecíveis</p>
        </div>
      </div>
    </footer>
  )
}
