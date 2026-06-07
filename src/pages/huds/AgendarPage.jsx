import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaWhatsapp, FaArrowLeft, FaCheck } from 'react-icons/fa6'
import { supabase } from '../../lib/supabase'
import styles from './AgendarPage.module.css'

const HUDS_WHATSAPP = '5561999385296'

const HORARIOS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
]

const FALLBACK_SERVICES = [
  { id: 'fc1', icon: '✂️', name: 'Corte Clássico',      price: 40,  duration_minutes: 30 },
  { id: 'fc2', icon: '💈', name: 'Degradê / Fade',       price: 45,  duration_minutes: 40 },
  { id: 'fc3', icon: '🪒', name: 'Barba Completa',       price: 35,  duration_minutes: 30 },
  { id: 'fc4', icon: '✂️', name: 'Corte + Barba',        price: 65,  duration_minutes: 60 },
  { id: 'fc5', icon: '🧴', name: 'Hidratação Capilar',   price: 50,  duration_minutes: 45 },
  { id: 'fc6', icon: '💆', name: 'Sobrancelha Masculina', price: 20, duration_minutes: 15 },
]

function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function fmtPrice(val) {
  if (!val && val !== 0) return ''
  return `R$ ${Number(val).toFixed(2).replace('.', ',')}`
}

function buildWppLink(data) {
  const text = `Olá! Acabei de fazer meu agendamento pelo site. Meu nome é ${data.name}, para ${data.service} no dia ${fmtDate(data.date)} às ${data.time}.`
  return `https://wa.me/${HUDS_WHATSAPP}?text=${encodeURIComponent(text)}`
}

const STEP_LABELS = ['Serviço', 'Data & Hora', 'Seus dados']

export default function AgendarPage() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const todayStr = new Date().toISOString().split('T')[0]

  const loadServices = useCallback(async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, price, duration_minutes, icon, active')
      .eq('store_id', 'huds')
      .eq('active', true)
      .order('order_index')
    if (data?.length) setServices(data)
    else setServices(FALLBACK_SERVICES)
  }, [])

  useEffect(() => { loadServices() }, [loadServices])

  const isTimeDisabled = (t) => {
    if (date !== todayStr) return false
    const [h, m] = t.split(':').map(Number)
    const now = new Date()
    return h < now.getHours() || (h === now.getHours() && m <= now.getMinutes())
  }

  async function handleSubmit() {
    if (!name.trim()) { setSaveError('Informe seu nome.'); return }
    if (!whatsapp.trim()) { setSaveError('Informe seu WhatsApp para contato.'); return }
    setSaving(true)
    setSaveError(null)
    const { error } = await supabase.from('appointments').insert({
      customer_name: name.trim(),
      customer_whatsapp: whatsapp.trim(),
      service_name: selectedService.name,
      appointment_date: date,
      appointment_time: time,
      notes: notes,
      status: 'agendado',
    })
    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Erro ao registrar agendamento. Tente novamente.')
    } else {
      setSuccessData({ name: name.trim(), service: selectedService.name, date, time })
      setSuccess(true)
      setStep(4)
    }
  }

  /* ── Step indicator ── */
  function StepIndicator() {
    return (
      <div className={styles.stepIndicator}>
        {STEP_LABELS.map((label, idx) => {
          const n = idx + 1
          const isActive = step === n
          const isDone = step > n
          return (
            <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`${styles.stepDot} ${isActive ? styles.stepDotActive : ''} ${isDone ? styles.stepDotDone : ''}`}>
                {isDone ? '✓' : n}
              </div>
              {n < STEP_LABELS.length && <div className={styles.stepLine} />}
            </div>
          )
        })}
      </div>
    )
  }

  /* ── Success screen ── */
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
              Seu pedido foi registrado. Confirme pelo WhatsApp para garantir seu horário.
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
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp />
              Confirmar pelo WhatsApp
            </motion.a>
            <a href="/huds" className={styles.backBtn}>
              <FaArrowLeft /> Voltar para o site
            </a>
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
        <StepIndicator />
        <p className={styles.stepTitle}>{STEP_LABELS[step - 1]}</p>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Service selection ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.servicesGrid}>
                {(services.length ? services : FALLBACK_SERVICES).map(svc => (
                  <button
                    key={svc.id}
                    className={`${styles.serviceCard} ${selectedService?.id === svc.id ? styles.serviceCardActive : ''}`}
                    onClick={() => setSelectedService(svc)}
                    type="button"
                  >
                    <span className={styles.serviceIcon}>{svc.icon || '✂️'}</span>
                    <span className={styles.serviceName}>{svc.name}</span>
                    {svc.price != null && (
                      <span className={styles.servicePrice}>{fmtPrice(svc.price)}</span>
                    )}
                    {svc.duration_minutes != null && (
                      <span className={styles.serviceDur}>{svc.duration_minutes} min</span>
                    )}
                  </button>
                ))}
              </div>
              <div className={styles.btnRow}>
                <button
                  className={styles.btnNext}
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                >
                  Continuar →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Date + Time ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.formGroup}>
                <label>Data</label>
                <input
                  type="date"
                  className={styles.dateInput}
                  min={todayStr}
                  value={date}
                  onChange={e => { setDate(e.target.value); setTime('') }}
                />
              </div>

              {date && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: 20 }}
                >
                  <div className={styles.formGroup} style={{ marginBottom: 12 }}>
                    <label>Horário</label>
                  </div>
                  <div className={styles.timesGrid}>
                    {HORARIOS.map(h => {
                      const disabled = isTimeDisabled(h)
                      return (
                        <button
                          key={h}
                          type="button"
                          disabled={disabled}
                          className={`${styles.timeBtn} ${time === h ? styles.timeBtnActive : ''}`}
                          style={disabled ? { opacity: 0.28, cursor: 'not-allowed' } : {}}
                          onClick={() => !disabled && setTime(h)}
                        >
                          {h}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              <div className={styles.btnRow}>
                <button className={styles.btnBack} onClick={() => setStep(1)}>← Voltar</button>
                <button
                  className={styles.btnNext}
                  disabled={!date || !time}
                  onClick={() => setStep(3)}
                >
                  Continuar →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Personal data ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.formGroup}>
                <label>Seu nome *</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="61 9 9999-9999"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Observações (opcional)</label>
                <textarea
                  rows={3}
                  placeholder="Referência de corte, preferências…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {saveError && <p className={styles.error}>{saveError}</p>}

              <div className={styles.btnRow}>
                <button className={styles.btnBack} onClick={() => { setSaveError(null); setStep(2) }}>← Voltar</button>
                <motion.button
                  className={styles.btnNext}
                  disabled={saving || !name.trim() || !whatsapp.trim()}
                  onClick={handleSubmit}
                  whileTap={{ scale: 0.97 }}
                >
                  {saving ? 'Registrando…' : 'Solicitar Agendamento'}
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
