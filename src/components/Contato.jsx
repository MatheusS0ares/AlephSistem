import { useState } from 'react'
import { motion } from 'motion/react'
import AnimateOnView from './AnimateOnView'
import { saveOrder } from '../hooks/useSupabase'
import { useStore } from '../context/StoreContext'
import styles from './Contato.module.css'

export default function Contato() {
  const { store } = useStore() || {}
  const [form, setForm] = useState({ customer_name: '', whatsapp: '', product_interest: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const wppNumber = store?.whatsapp || '5500000000000'
  const instagram  = store?.instagram || '@reinoimperial'
  const igUrl      = store?.instagram_url || 'https://instagram.com/reinoimperial'

  const infoItems = [
    { icon: '📱', title: 'WhatsApp',    content: wppNumber, href: `https://wa.me/${wppNumber}` },
    { icon: '📸', title: 'Instagram',   content: instagram, href: igUrl },
    { icon: '⏰', title: 'Atendimento', content: 'Seg a Sáb: 8h às 20h' },
    { icon: '📦', title: 'Entrega',     content: 'Todo o Brasil pelos Correios' },
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    await saveOrder({ ...form, store_id: store?.id || null })
    const msg = `Olá Reino Imperial! Me chamo ${form.customer_name}, meu WhatsApp é ${form.whatsapp}. Interesse em: ${form.product_interest || 'Não informado'}. ${form.message}`
    window.open(`https://wa.me/${wppNumber}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setSending(false)
    setForm({ customer_name: '', whatsapp: '', product_interest: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e
    const rect = currentTarget.getBoundingClientRect()
    currentTarget.style.setProperty('--mouse-x', `${clientX - rect.left}px`)
    currentTarget.style.setProperty('--mouse-y', `${clientY - rect.top}px`)
  }

  return (
    <section className={styles.section} id="contato">
      <div className="container">
        <AnimateOnView>
          <div className="section-header">
            <span className="section-eyebrow">Fale conosco</span>
            <h2 className="section-title">Entre em <em>contato</em></h2>
          </div>
        </AnimateOnView>
        <div className={styles.grid}>
          <AnimateOnView delay={0.1}>
            <div className={styles.info}>
              {infoItems.map((item, i) => (
                <motion.div key={item.title} className={styles.item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <div className={styles.itemIcon}>{item.icon}</div>
                  <div>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    {item.href
                      ? <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>{item.content}</a>
                      : <span className={styles.itemText}>{item.content}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.2}>
            <form className={styles.form} onSubmit={handleSubmit} onMouseMove={handleMouseMove}>
              <h3 className={styles.formTitle}>Envie uma mensagem</h3>
              {[
                { id: 'customer_name', label: 'Seu nome', type: 'text', placeholder: 'Como posso te chamar?' },
                { id: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '(00) 00000-0000' },
              ].map(f => (
                <div className={styles.group} key={f.id}>
                  <label htmlFor={f.id}>{f.label}</label>
                  <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder}
                    value={form[f.id]} onChange={e => setForm(p => ({...p, [f.id]: e.target.value}))} required />
                </div>
              ))}
              <div className={styles.group}>
                <label htmlFor="product_interest">Produto de interesse</label>
                <select id="product_interest" name="product_interest" value={form.product_interest}
                  onChange={e => setForm(p => ({...p, product_interest: e.target.value}))}>
                  <option value="">Selecione uma categoria</option>
                  <option>Festas & Eventos</option>
                  <option>Chá de Bebê</option>
                  <option>Presentes</option>
                  <option>Aniversários</option>
                  <option>Maternidade</option>
                  <option>Outro</option>
                </select>
              </div>
              <div className={styles.group}>
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" name="message" rows={4}
                  placeholder="Conte-nos mais sobre o que você precisa..."
                  value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required />
              </div>
              <motion.button type="submit" className={`btn btn--gold btn--full ${sent ? styles.sent : ''}`}
                disabled={sending}
                whileHover={!sending ? { scale: 1.02, y: -2 } : {}}
                whileTap={!sending ? { scale: 0.98 } : {}}>
                {sent ? '✓ Mensagem enviada!' : sending ? 'Enviando...' : 'Enviar pelo WhatsApp 💬'}
              </motion.button>
            </form>
          </AnimateOnView>
        </div>
      </div>
    </section>
  )
}
