import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabase'
import styles from './AjustesPage.module.css'

const WPP_TEMPLATES = [
  { key: 'msg_orcamento',   label: 'Envio de Orçamento', default: 'Olá {nome}! 👑 Orçamento:\n\nProduto: *{produto}*\nQtd: {qtd}x\nTotal: {total}\nSinal: {sinal}\nRestante: {restante}\n\nPrazo estimado: {prazo}\n\nObrigado pela confiança! 🙏' },
  { key: 'msg_confirmado',  label: 'Pedido Confirmado',  default: 'Olá {nome}! ✅ Seu pedido de *{produto}* foi confirmado!\n\nTotal: {total}\nSinal: {sinal}\nRestante: {restante}\nPrazo: {prazo}\n\nAgradecemos pela confiança! ♛' },
  { key: 'msg_encomendado', label: 'Pedido Encomendado', default: 'Olá {nome}! 📦 Seu pedido de *{produto}* foi encomendado! Em breve chega e eu te aviso. Prazo estimado: {prazo} 👑' },
  { key: 'msg_chegou',      label: 'Chegou — Pronto para Entrega', default: 'Olá {nome}! ✨ Seu pedido de *{produto}* chegou e está pronto para entrega!\n\nRestante a pagar: {restante}\n\n♛' },
  { key: 'msg_entregue',    label: 'Pedido Entregue',    default: 'Olá {nome}! 🎉 Seu pedido de *{produto}* foi entregue com sucesso!\n\nEsperamos que você tenha adorado! ♛' },
]

const NF_KEYS = ['nf_portal_url','nf_cnpj','nf_razao_social','nf_inscricao_municipal','nf_cnae','nf_aliquota_iss','nf_discriminacao_padrao']

export default function AjustesPage({ storeId }) {
  const [storeForm, setStoreForm] = useState({})
  const [templates, setTemplates] = useState({})
  const [fiscalForm, setFiscalForm] = useState({})
  const [saved, setSaved] = useState(false)
  const [fiscalSaved, setFiscalSaved] = useState(false)

  const loadData = useCallback(async () => {
    const [storeRes, settRes] = await Promise.all([
      supabase.from('stores').select('*').eq('id', storeId).single(),
      supabase.from('settings').select('key, value').or('key.like.msg_%,key.like.nf_%').eq('store_id', storeId),
    ])
    if (storeRes.data) {
      const s = storeRes.data
      setStoreForm({
        name: s.name || '',
        tagline: s.tagline || '',
        whatsapp: s.whatsapp || '',
        instagram: s.instagram || '',
        instagram_url: s.instagram_url || '',
        address: s.address || '',
      })
    }
    const tpls = {}
    const fiscal = {}
    ;(settRes.data || []).forEach(r => {
      if (r.key.startsWith('msg_')) tpls[r.key] = r.value
      if (r.key.startsWith('nf_'))  fiscal[r.key] = r.value
    })
    setTemplates(tpls)
    setFiscalForm(fiscal)
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  async function saveStore() {
    if (!storeId) return
    await supabase.from('stores').update(storeForm).eq('id', storeId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    loadData()
  }

  async function saveFiscal() {
    const upserts = NF_KEYS
      .filter(k => fiscalForm[k] !== undefined && fiscalForm[k] !== '')
      .map(k => ({ store_id: storeId, key: k, value: fiscalForm[k] }))
    if (upserts.length > 0) {
      await supabase.from('settings').upsert(upserts, { onConflict: 'store_id,key' })
    }
    setFiscalSaved(true)
    setTimeout(() => setFiscalSaved(false), 2000)
  }

  async function saveTemplates() {
    const upserts = WPP_TEMPLATES.map(t => ({
      store_id: storeId,
      key: t.key,
      value: templates[t.key] ?? t.default,
    }))
    await supabase.from('settings').upsert(upserts, { onConflict: 'store_id,key' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const VARS = ['{nome}','{produto}','{total}','{restante}','{prazo}','{sinal}','{qtd}','{instagram}']

  return (
    <div className={styles.page}>
      {/* Identidade */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Identidade</span>
        <h3>Dados da empresa</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nome</label>
            <input value={storeForm.name || ''} onChange={e => setStoreForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div className={styles.formGroup}>
            <label>Slogan / Tagline</label>
            <input value={storeForm.tagline || ''} onChange={e => setStoreForm(f => ({...f, tagline: e.target.value}))} />
          </div>
          <div className={styles.formGroup}>
            <label>WhatsApp (com DDI, ex: 5561999999999)</label>
            <input value={storeForm.whatsapp || ''} onChange={e => setStoreForm(f => ({...f, whatsapp: e.target.value}))} placeholder="5561999999999" />
          </div>
          <div className={styles.formGroup}>
            <label>Instagram (@handle)</label>
            <input value={storeForm.instagram || ''} onChange={e => setStoreForm(f => ({...f, instagram: e.target.value}))} placeholder="@reinoimperial" />
          </div>
          <div className={styles.formGroup}>
            <label>URL Instagram</label>
            <input value={storeForm.instagram_url || ''} onChange={e => setStoreForm(f => ({...f, instagram_url: e.target.value}))} placeholder="https://instagram.com/reinoimperial" />
          </div>
          <div className={styles.formGroup}>
            <label>Endereço</label>
            <input value={storeForm.address || ''} onChange={e => setStoreForm(f => ({...f, address: e.target.value}))} />
          </div>
        </div>

        <button className={styles.btnSave} onClick={saveStore}>
          {saved ? '✓ Salvo!' : 'Salvar dados'}
        </button>
      </div>

      {/* WhatsApp templates */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Comunicação</span>
        <h3>Mensagens prontas WhatsApp</h3>
        <p className={styles.helpText}>
          Variáveis disponíveis:{' '}
          {VARS.map(v => <code key={v} className={styles.var}>{v}</code>)}
        </p>

        <div className={styles.templateList}>
          {WPP_TEMPLATES.map(t => (
            <div key={t.key} className={styles.templateGroup}>
              <label>{t.label}</label>
              <textarea
                rows="3"
                value={templates[t.key] ?? t.default}
                onChange={e => setTemplates(tp => ({...tp, [t.key]: e.target.value}))}
              />
            </div>
          ))}
        </div>

        <button className={styles.btnSave} onClick={saveTemplates}>
          {saved ? '✓ Salvo!' : 'Salvar mensagens'}
        </button>
      </div>

      {/* Nota Fiscal */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Fiscal</span>
        <h3>Nota Fiscal de Serviços (NFS-e)</h3>
        <p className={styles.helpText}>
          Preencha os dados do emitente para que sejam pré-exibidos ao emitir uma NF direto no portal da prefeitura/SEFAZ — sem custo de integração.
        </p>

        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>URL do Portal da Prefeitura / SEFAZ</label>
            <input
              value={fiscalForm.nf_portal_url || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_portal_url: e.target.value}))}
              placeholder="https://nfse.suaprefeitura.gov.br/"
            />
          </div>
          <div className={styles.formGroup}>
            <label>CNPJ</label>
            <input
              value={fiscalForm.nf_cnpj || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_cnpj: e.target.value}))}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Razão Social</label>
            <input
              value={fiscalForm.nf_razao_social || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_razao_social: e.target.value}))}
              placeholder="Nome da empresa na Receita Federal"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Inscrição Municipal</label>
            <input
              value={fiscalForm.nf_inscricao_municipal || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_inscricao_municipal: e.target.value}))}
              placeholder="0000000"
            />
          </div>
          <div className={styles.formGroup}>
            <label>CNAE</label>
            <input
              value={fiscalForm.nf_cnae || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_cnae: e.target.value}))}
              placeholder="ex: 9001-9/03"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Alíquota ISS (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={fiscalForm.nf_aliquota_iss || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_aliquota_iss: e.target.value}))}
              placeholder="2.00"
            />
          </div>
          <div className={`${styles.formGroup} ${styles.colSpan2}`}>
            <label>Discriminação padrão do serviço</label>
            <textarea
              rows="2"
              value={fiscalForm.nf_discriminacao_padrao || ''}
              onChange={e => setFiscalForm(f => ({...f, nf_discriminacao_padrao: e.target.value}))}
              placeholder="Personalização de {produto} — quantidade: {qtd}"
            />
            <span className={styles.varHint}>
              Variáveis:{' '}
              {['{produto}','{qtd}','{nome}','{total}'].map(v => <code key={v} className={styles.var}>{v}</code>)}
            </span>
          </div>
        </div>

        <button className={styles.btnSave} onClick={saveFiscal}>
          {fiscalSaved ? '✓ Salvo!' : 'Salvar dados fiscais'}
        </button>
      </div>
    </div>
  )
}
