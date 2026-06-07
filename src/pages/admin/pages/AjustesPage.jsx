import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabase'
import styles from './AjustesPage.module.css'

const WPP_TEMPLATES = [
  {
    key: 'msg_agendamento_recebido',
    label: '📅 Agendamento recebido',
    hint: 'Enviada assim que o cliente faz o agendamento pelo site',
    default: 'Olá {nome}! ✂️ Seu agendamento na *HUD\'S Barbearia* foi recebido!\n\n📋 *Serviço:* {servico}\n📆 *Data:* {data}\n⏰ *Horário:* {hora}\n\nAguarde a confirmação. Qualquer dúvida é só chamar! 👊',
  },
  {
    key: 'msg_agendamento_confirmado',
    label: '✅ Agendamento confirmado',
    hint: 'Enviada quando você confirma o horário no painel',
    default: 'Olá {nome}! ✅ Seu horário está *confirmado*!\n\n✂️ *Serviço:* {servico}\n📆 *Data:* {data}\n⏰ *Horário:* {hora}\n\nTe esperamos na HUD\'S! 💈',
  },
  {
    key: 'msg_lembrete',
    label: '🔔 Lembrete de horário',
    hint: 'Enviada na véspera ou no dia do atendimento',
    default: 'Oi {nome}! 👋 Só lembrando que *amanhã* você tem horário na HUD\'S Barbearia.\n\n⏰ *{hora}* — {servico}\n\nQualquer imprevisto, avisa com antecedência! 🙏',
  },
  {
    key: 'msg_pos_atendimento',
    label: '⭐ Pós-atendimento',
    hint: 'Enviada após o atendimento para pedir avaliação',
    default: 'Olá {nome}! Obrigado por ter vindo na *HUD\'S* hoje! ✂️\n\nEsperamos que tenha curtido o resultado. Se quiser, deixa sua avaliação no Google — ajuda muito! 🙏\n\nhttps://g.page/r/SEU_LINK_AQUI\n\nFalou! 💈 Fabrício',
  },
  {
    key: 'msg_cancelamento',
    label: '❌ Cancelamento',
    hint: 'Enviada quando um agendamento é cancelado',
    default: 'Olá {nome}, infelizmente precisamos cancelar seu agendamento de *{servico}* no dia {data} às {hora}.\n\nPor favor, entre em contato para remarcar. Sentimos muito pelo inconveniente! 🙏',
  },
  {
    key: 'msg_promocao',
    label: '🔥 Promoção / novidade',
    hint: 'Mensagem livre para divulgar promoções ou novidades',
    default: 'Oi {nome}! 👑 Novidade na *HUD\'S Barbearia*:\n\n{mensagem}\n\nAgende já: {link_agendamento}\n\n💈 @hudsbarbearia',
  },
]

const MSG_KEYS = WPP_TEMPLATES.map(t => t.key)
const NF_KEYS = ['nf_portal_url','nf_cnpj','nf_razao_social','nf_inscricao_municipal','nf_cnae','nf_aliquota_iss','nf_discriminacao_padrao']

export default function AjustesPage({ storeId }) {
  const [storeForm, setStoreForm] = useState({})
  const [templates, setTemplates] = useState({})
  const [fiscalForm, setFiscalForm] = useState({})
  const [savedStore, setSavedStore] = useState(false)
  const [savedMsg, setSavedMsg]     = useState(false)
  const [savedFiscal, setSavedFiscal] = useState(false)

  const loadData = useCallback(async () => {
    const [storeRes, settRes] = await Promise.all([
      supabase.from('stores').select('*').eq('id', storeId).single(),
      supabase.from('settings').select('key, value').eq('store_id', storeId),
    ])
    if (storeRes.data) {
      const s = storeRes.data
      setStoreForm({
        name:          s.name || '',
        tagline:       s.tagline || '',
        whatsapp:      s.whatsapp || '',
        instagram:     s.instagram || '',
        instagram_url: s.instagram_url || '',
        address:       s.address || '',
        hours:         s.hours || 'Seg a Sáb: 09h–19h\nDomingo: Fechado',
      })
    }
    const tpls = {}; const fiscal = {}
    ;(settRes.data || []).forEach(r => {
      if (MSG_KEYS.includes(r.key))    tpls[r.key]   = r.value
      if (r.key.startsWith('nf_'))     fiscal[r.key] = r.value
    })
    setTemplates(tpls)
    setFiscalForm(fiscal)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  async function saveStore() {
    await supabase.from('stores').update(storeForm).eq('id', storeId)
    setSavedStore(true); setTimeout(() => setSavedStore(false), 2500)
  }

  async function saveTemplates() {
    const upserts = WPP_TEMPLATES.map(t => ({
      store_id: storeId, key: t.key, value: templates[t.key] ?? t.default,
    }))
    await supabase.from('settings').upsert(upserts, { onConflict: 'store_id,key' })
    setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500)
  }

  async function saveFiscal() {
    const upserts = NF_KEYS.filter(k => fiscalForm[k]).map(k => ({ store_id: storeId, key: k, value: fiscalForm[k] }))
    if (upserts.length) await supabase.from('settings').upsert(upserts, { onConflict: 'store_id,key' })
    setSavedFiscal(true); setTimeout(() => setSavedFiscal(false), 2500)
  }

  const VARS = ['{nome}', '{servico}', '{data}', '{hora}', '{preco}', '{profissional}', '{instagram}']

  return (
    <div className={styles.page}>

      {/* ── Identidade ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Identidade</span>
        <h3>Dados da barbearia</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input value={storeForm.name || ''} onChange={e => setStoreForm(f => ({...f, name: e.target.value}))} placeholder="HUD'S Barbearia" />
          </div>
          <div className={styles.formGroup}>
            <label>Slogan</label>
            <input value={storeForm.tagline || ''} onChange={e => setStoreForm(f => ({...f, tagline: e.target.value}))} placeholder="O seu estilo, nossa arte." />
          </div>
          <div className={styles.formGroup}>
            <label>WhatsApp (com DDI)</label>
            <input value={storeForm.whatsapp || ''} onChange={e => setStoreForm(f => ({...f, whatsapp: e.target.value}))} placeholder="5561999385296" />
          </div>
          <div className={styles.formGroup}>
            <label>Instagram (@handle)</label>
            <input value={storeForm.instagram || ''} onChange={e => setStoreForm(f => ({...f, instagram: e.target.value}))} placeholder="@hudsbarbearia" />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Endereço</label>
            <input value={storeForm.address || ''} onChange={e => setStoreForm(f => ({...f, address: e.target.value}))} placeholder="Setor Sul QD 7 CJ C LT 8, Gama-DF" />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Horários de funcionamento</label>
            <textarea rows="3" value={storeForm.hours || ''} onChange={e => setStoreForm(f => ({...f, hours: e.target.value}))} placeholder={'Seg a Sáb: 09h–19h\nDomingo: Fechado'} />
          </div>
        </div>

        <button className={`${styles.btnSave} ${savedStore ? styles.btnSaved : ''}`} onClick={saveStore}>
          {savedStore ? '✓ Salvo!' : 'Salvar dados'}
        </button>
      </div>

      {/* ── Mensagens WhatsApp ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Comunicação</span>
        <h3>Mensagens prontas WhatsApp</h3>
        <p className={styles.helpText}>
          Personalize as mensagens enviadas em cada etapa. Variáveis disponíveis:
        </p>
        <div className={styles.varRow}>
          {VARS.map(v => <code key={v} className={styles.var}>{v}</code>)}
        </div>

        <div className={styles.templateList}>
          {WPP_TEMPLATES.map(t => (
            <div key={t.key} className={styles.templateGroup}>
              <div className={styles.templateLabelRow}>
                <label>{t.label}</label>
                <span className={styles.templateHint}>{t.hint}</span>
              </div>
              <textarea
                rows="4"
                value={templates[t.key] ?? t.default}
                onChange={e => setTemplates(tp => ({...tp, [t.key]: e.target.value}))}
              />
              <button
                className={styles.btnReset}
                onClick={() => setTemplates(tp => ({...tp, [t.key]: t.default}))}
              >
                ↺ Restaurar padrão
              </button>
            </div>
          ))}
        </div>

        <button className={`${styles.btnSave} ${savedMsg ? styles.btnSaved : ''}`} onClick={saveTemplates}>
          {savedMsg ? '✓ Salvo!' : 'Salvar mensagens'}
        </button>
      </div>

      {/* ── NFS-e ── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Fiscal</span>
        <h3>Nota Fiscal de Serviços (NFS-e)</h3>
        <p className={styles.helpText}>
          Dados para emissão de NFS-e no portal da prefeitura. Sem custo adicional de integração.
        </p>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>URL do portal da Prefeitura / SEFAZ</label>
            <input value={fiscalForm.nf_portal_url || ''} onChange={e => setFiscalForm(f => ({...f, nf_portal_url: e.target.value}))} placeholder="https://nfse.suaprefeitura.gov.br/" />
          </div>
          <div className={styles.formGroup}>
            <label>CNPJ</label>
            <input value={fiscalForm.nf_cnpj || ''} onChange={e => setFiscalForm(f => ({...f, nf_cnpj: e.target.value}))} placeholder="00.000.000/0001-00" />
          </div>
          <div className={styles.formGroup}>
            <label>Razão Social</label>
            <input value={fiscalForm.nf_razao_social || ''} onChange={e => setFiscalForm(f => ({...f, nf_razao_social: e.target.value}))} placeholder="Nome na Receita Federal" />
          </div>
          <div className={styles.formGroup}>
            <label>Inscrição Municipal</label>
            <input value={fiscalForm.nf_inscricao_municipal || ''} onChange={e => setFiscalForm(f => ({...f, nf_inscricao_municipal: e.target.value}))} placeholder="0000000" />
          </div>
          <div className={styles.formGroup}>
            <label>Alíquota ISS (%)</label>
            <input type="number" step="0.01" min="0" max="100" value={fiscalForm.nf_aliquota_iss || ''} onChange={e => setFiscalForm(f => ({...f, nf_aliquota_iss: e.target.value}))} placeholder="2.00" />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Discriminação padrão do serviço</label>
            <textarea rows="2" value={fiscalForm.nf_discriminacao_padrao || ''} onChange={e => setFiscalForm(f => ({...f, nf_discriminacao_padrao: e.target.value}))} placeholder="Serviço de barbearia — {servico} para {nome}" />
          </div>
        </div>

        <button className={`${styles.btnSave} ${savedFiscal ? styles.btnSaved : ''}`} onClick={saveFiscal}>
          {savedFiscal ? '✓ Salvo!' : 'Salvar dados fiscais'}
        </button>
      </div>

    </div>
  )
}
