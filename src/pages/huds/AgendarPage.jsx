import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaScissors, FaArrowLeft, FaCheck } from 'react-icons/fa6'
import { supabase } from '../../lib/supabase'
import styles from './AgendarPage.module.css'

const HUDS_WHATSAPP = '5561999385296'

const HORARIOS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const EMPTY_FORM = {
  name: '',
  whatsapp: '',
  service: '',
  date: '',
  time: '',
  notes: '',
}

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function AgendarPage() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const loadServices = useCallback(async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes')
      .eq('active', true)
      .order('name')
    setServices(data || [])
  }, [])

  useEffect(() => { loadServices() }, [loadServices])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const todayStr = new Date().toISOString().split('T')[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setSaveError('Informe seu nome.'); return }
    if (!form.whatsapp.trim()) { setSaveError('Informe seu WhatsApp para contato.'); return }
    if (!form.service) { setSaveError('Selecione um serviço.'); return }
    if (!form.date) { setSaveError('Informe a data preferida.'); return }
    if (!form.time) { setSaveError('Selecione o horário preferido.'); return }

    setSaving(true)
    setSaveError(null)

    const { error } = await supabase.from('appointments').insert({
      customer_name: form.name.trim(),
      customer_whatsapp: form.whatsapp.trim(),
      service_name: form.service,
      appointment_date: form.date,
      appointment_time: form.time,
      notes: form.notes,
      status: 'agendado',
    })

    setSaving(false)

    if (error) {
      setSaveError(error.message || 'Erro ao registrar agendamento. Tente novamente.')
    } else {
      setSuccessData({ ...form })
      setSuccess(true)
    }
  }

  function buildWppLink(data) {
    const text = `Olá! Acabei de fazer meu agendamento pelo site. Meu nome é ${data.name}, para ${data.service} no dia ${fmtDate(data.date)} às ${data.time}.`
    return `https://wa.me/${HUDS_WHATSAPP}?text=${encodeURIComponent(text)}`
  }

  if (success && successData) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <a href="/huds" className={styles.logoLink}>
            <span className={styles.logoText}>HUD'S</span>
            <span className={styles.logoBarbearia}>BARBEARIA</span>
          </a>
        </header>

        <main className={styles.main}>
          <motion.div
            className={styles.successCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <motion.div
              className={styles.successIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
              <FaCheck />
            </motion.div>

            <h2 className={styles.successTitle}>Agendamento Recebido!</h2>
            <p className={styles.successSub}>
              Seu pedido foi registrado com sucesso. Confirme pelo WhatsApp para garantir seu horário.
            </p>

            <div className={styles.successDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Nome</span>
                <span className={styles.detailValue}>{successData.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Serviço</span>
                <span className={styles.detailValue}>{successData.service}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Data</span>
                <span className={styles.detailValue}>{fmtDate(successData.date)}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Horário</span>
                <span className={styles.detailValue}>{successData.time}</span>
              </div>
            </div>

            <motion.a
              href={buildWppLink(successData)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.wppBtn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp />
              Confirmar pelo WhatsApp
            </motion.a>

            <motion.a
              href="/huds"
              className={styles.backBtn}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaArrowLeft /> Voltar para o site
            </motion.a>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/huds" className={styles.logoLink}>
          <span className={styles.logoText}>HUD'S</span>
          <span className={styles.logoBarbearia}>BARBEARIA</span>
        </a>
        <a href="/huds" className={styles.backLink}>
          <FaArrowLeft /> Voltar
        </a>
      </header>

      <main className={styles.main}>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.formCardHeader}>
            <FaScissors className={styles.formIcon} />
            <div>
              <h1 className={styles.formTitle}>AGENDAR HORÁRIO</h1>
              <p className={styles.formSubtitle}>Barbearia HUD'S — Preencha os dados abaixo</p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Seu nome *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="whatsapp">WhatsApp *</label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="61 9 9999-9999"
                  value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="service">Serviço *</label>
              <select
                id="service"
                value={form.service}
                onChange={e => set('service', e.target.value)}
                required
              >
                <option value="">Selecione o serviço…</option>
                {services.length > 0 ? (
                  services.map(s => (
                    <option key={s.id} value={s.name}>{s.name}{s.price ? ` — R$ ${Number(s.price).toFixed(2).replace('.', ',')}` : ''}</option>
                  ))
                ) : (
                  <>
                    <option value="Corte Clássico">Corte Clássico</option>
                    <option value="Degradê / Fade">Degradê / Fade</option>
                    <option value="Barba Completa">Barba Completa</option>
                    <option value="Corte + Barba">Corte + Barba</option>
                    <option value="Hidratação Capilar">Hidratação Capilar</option>
                    <option value="Sobrancelha Masculina">Sobrancelha Masculina</option>
                  </>
                )}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Data preferida *</label>
                <input
                  id="date"
                  type="date"
                  min={todayStr}
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="time">Horário preferido *</label>
                <select
                  id="time"
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                  required
                >
                  <option value="">Selecione o horário…</option>
                  {HORARIOS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes">Observações (opcional)</label>
              <textarea
                id="notes"
                rows="3"
                placeholder="Referência de corte, preferências…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>

            <AnimatePresence>
              {saveError && (
                <motion.p
                  className={styles.error}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {saveError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.03 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
            >
              {saving ? 'Registrando…' : 'Solicitar Agendamento'}
            </motion.button>

            <p className={styles.submitNote}>
              Após enviar, confirme pelo WhatsApp para garantir seu horário.
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
