import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import styles from './FooterHuds.module.css'

export default function FooterHuds({ whatsapp = '5500000000000', instagram = 'https://instagram.com/hudsbarbearia' }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoSub}>BARBEARIA</span>
            <span className={styles.logoMain}>HUD'S</span>
          </div>
          <p className={styles.tagline}>Seu estilo, nossa arte.</p>
          <div className={styles.social}>
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <nav className={styles.links}>
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Serviços</a>
          <a href="#como-agendar">Como Agendar</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Barbearia HUD'S. Todos os direitos reservados.</span>
        <span className={styles.aleph}>Desenvolvido por <strong>Aleph Sistem</strong></span>
      </div>
    </footer>
  )
}
