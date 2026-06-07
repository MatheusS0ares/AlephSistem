import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { supabase } from '../../../lib/supabase'
import styles from './HudsDashboard.module.css'

function fmtMoney(v) {
  return `R$ ${Number(v || 0).toFixed(2).replace('.', ',')}`
}

function fmtTime(t) {
  return t ? t.slice(0, 5) : '—'
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function nowTimeString() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function HudsDashboard({ onNavigate, store }) {
  const [appointments, setAppointments] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const today = todayString()
    const storeId = store?.id

    const apptQ = supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', today)
      .order('appointment_time', { ascending: true })

    if (storeId && !storeId.startsWith('fallback-')) {
      apptQ.eq('store_id', storeId)
    }

    // Monthly transactions
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    const txQ = supabase
      .from('transactions')
      .select('type, amount')
      .gte('created_at', monthStart)

    if (storeId && !storeId.startsWith('fallback-')) {
      txQ.eq('store_id', storeId)
    }

    const [apptRes, txRes] = await Promise.all([apptQ, txQ])
    setAppointments(apptRes.data || [])
    setTransactions(txRes.data || [])
    setLoading(false)
  }, [store])

  useEffect(() => { loadData() }, [loadData])

  // Expose global for FAB
  useEffect(() => {
    window.__adminOpenNewAppointment = () => onNavigate?.('agendamentos')
    return () => { delete window.__adminOpenNewAppointment }
  }, [onNavigate])

  const today = todayString()
  const now = nowTimeString()

  const todayAppointments = appointments
  const confirmed = todayAppointments.filter(a => a.status === 'confirmado').length
  const pending = todayAppointments.filter(a => a.status === 'agendado').length
  const dayRevenue = todayAppointments
    .filter(a => a.status === 'concluido')
    .reduce((sum, a) => sum + Number(a.price || 0), 0)

  const nextAppt = todayAppointments
    .filter(a => (a.appointment_time || '00:00') > now && a.status !== 'cancelado' && a.status !== 'concluido')
    .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''))[0]

  const monthEntradas = transactions
    .filter(t => t.type === 'entrada' || t.type === 'receita')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const monthSaidas = transactions
    .filter(t => t.type === 'saida' || t.type === 'despesa')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const STATUS_COLOR = {
    agendado: '#7c9ef5',
    confirmado: '#56d18f',
    em_atendimento: '#C8960C',
    concluido: '#888',
    cancelado: '#e05c5c',
  }

  const STATUS_LABEL = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    em_atendimento: 'Em Atend.',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
  }

  const storeName = store?.name || 'Barbearia HUD\'S'

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.greeting}>
            Olá, <span className={styles.greetingGold}>{storeName}</span> ✂️
          </h2>
          <p className={styles.subGreeting}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className={styles.quickActions}>
          <motion.button
            className={styles.btnGold}
            onClick={() => window.__adminOpenNewAppointment?.()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            + Novo agendamento
          </motion.button>
          <motion.button
            className={styles.btnOutline}
            onClick={() => onNavigate?.('agendamentos')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver agenda completa
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <span className={styles.statValue} style={{ color: '#C8960C' }}>
            {todayAppointments.length}
          </span>
          <span className={styles.statLabel}>Hoje no total</span>
        </motion.div>

        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className={styles.statValue} style={{ color: '#56d18f' }}>
            {confirmed}
          </span>
          <span className={styles.statLabel}>Confirmados</span>
        </motion.div>

        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <span className={styles.statValue} style={{ color: '#7c9ef5' }}>
            {pending}
          </span>
          <span className={styles.statLabel}>Aguardando</span>
        </motion.div>

        <motion.div
          className={styles.statCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.statValue} style={{ color: '#c9a84c' }}>
            {fmtMoney(dayRevenue)}
          </span>
          <span className={styles.statLabel}>Receita do dia</span>
        </motion.div>
      </div>

      <div className={styles.mainGrid}>
        {/* Next client card */}
        <div className={styles.col}>
          {nextAppt ? (
            <motion.div
              className={styles.nextCard}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className={styles.nextLabel}>Próximo cliente</div>
              <div className={styles.nextTime}>{fmtTime(nextAppt.appointment_time)}</div>
              <div className={styles.nextName}>{nextAppt.customer_name || '—'}</div>
              {nextAppt.service_name && (
                <div className={styles.nextService}>✂ {nextAppt.service_name}</div>
              )}
              {nextAppt.professional_name && (
                <div className={styles.nextProf}>👤 {nextAppt.professional_name}</div>
              )}
              <span
                className={styles.nextStatus}
                style={{
                  background: (STATUS_COLOR[nextAppt.status] || '#888') + '22',
                  color: STATUS_COLOR[nextAppt.status] || '#888',
                }}
              >
                {STATUS_LABEL[nextAppt.status] || nextAppt.status}
              </span>
              {nextAppt.customer_whatsapp && (
                <a
                  href={`https://wa.me/55${nextAppt.customer_whatsapp.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(nextAppt.customer_name || '')}! Confirmando seu agendamento na Barbearia HUD'S para ${encodeURIComponent(nextAppt.service_name || '')} hoje às ${nextAppt.appointment_time?.slice(0, 5) || ''}. Te esperamos! ✂️`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.nextWpp}
                >
                  💬 Confirmar via WhatsApp
                </a>
              )}
            </motion.div>
          ) : (
            <motion.div
              className={styles.nextCard}
              style={{ opacity: 0.6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
            >
              <div className={styles.nextLabel}>Próximo cliente</div>
              <div className={styles.nextEmpty}>Sem agendamentos pendentes para hoje.</div>
            </motion.div>
          )}

          {/* Monthly financial */}
          <motion.div
            className={styles.financeCard}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.financeHeader}>
              <span className={styles.financeTitle}>Financeiro do mês</span>
              <button className={styles.financeLink} onClick={() => onNavigate?.('caixa')}>
                Ver caixa →
              </button>
            </div>
            <div className={styles.financeRow}>
              <div className={styles.financeItem}>
                <span className={styles.financeLabel}>Entradas</span>
                <span className={styles.financeValue} style={{ color: '#56d18f' }}>
                  {fmtMoney(monthEntradas)}
                </span>
              </div>
              <div className={styles.financeDivider} />
              <div className={styles.financeItem}>
                <span className={styles.financeLabel}>Saídas</span>
                <span className={styles.financeValue} style={{ color: '#e05c5c' }}>
                  {fmtMoney(monthSaidas)}
                </span>
              </div>
              <div className={styles.financeDivider} />
              <div className={styles.financeItem}>
                <span className={styles.financeLabel}>Saldo</span>
                <span
                  className={styles.financeValue}
                  style={{ color: monthEntradas - monthSaidas >= 0 ? '#56d18f' : '#e05c5c' }}
                >
                  {fmtMoney(monthEntradas - monthSaidas)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's schedule */}
        <motion.div
          className={styles.scheduleCard}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.scheduleHeader}>
            <span className={styles.scheduleTitle}>Agenda de hoje</span>
            <span className={styles.scheduleCount}>{todayAppointments.length} agendamentos</span>
          </div>

          {loading ? (
            <div className={styles.scheduleEmpty}>Carregando…</div>
          ) : todayAppointments.length === 0 ? (
            <div className={styles.scheduleEmpty}>
              <span style={{ fontSize: 32 }}>✂️</span>
              <p>Nenhum agendamento para hoje.</p>
              <button className={styles.btnGold} onClick={() => window.__adminOpenNewAppointment?.()}>
                + Novo agendamento
              </button>
            </div>
          ) : (
            <div className={styles.timeline}>
              {todayAppointments.map((a, i) => {
                const color = STATUS_COLOR[a.status] || '#888'
                const isPast = a.appointment_time && a.appointment_time < now
                return (
                  <motion.div
                    key={a.id}
                    className={`${styles.timelineItem} ${isPast ? styles.timelineItemPast : ''}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <div className={styles.timelineDot} style={{ background: color }} />
                    <div className={styles.timelineTime}>{fmtTime(a.appointment_time)}</div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineClient}>{a.customer_name || '—'}</div>
                      <div className={styles.timelineService}>
                        {a.service_name && <span>✂ {a.service_name}</span>}
                        {a.professional_name && <span> · {a.professional_name}</span>}
                      </div>
                    </div>
                    <div className={styles.timelineRight}>
                      {a.price > 0 && (
                        <span className={styles.timelinePrice}>{fmtMoney(a.price)}</span>
                      )}
                      <span
                        className={styles.timelineStatus}
                        style={{ background: color + '22', color }}
                      >
                        {STATUS_LABEL[a.status] || a.status}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
