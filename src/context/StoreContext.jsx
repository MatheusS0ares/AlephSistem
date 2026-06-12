import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const StoreContext = createContext(null)

const FALLBACK_STORES = {
  'reino-imperial': {
    id: 'fallback-1', name: 'Reino Imperial', slug: 'reino-imperial',
    tagline: 'Personalizados exclusivos para você',
    whatsapp: '5500000000001', instagram: '@reinoimperial',
    instagram_url: 'https://instagram.com/reinoimperial',
    address: 'Endereço da Loja Reino Imperial', active: true,
  },
  'personalize': {
    id: 'fallback-2', name: 'Personalize+', slug: 'personalize',
    tagline: 'Sua identidade em cada detalhe',
    whatsapp: '5500000000002', instagram: '@personalize',
    instagram_url: 'https://instagram.com/personalize',
    address: 'Endereço da Loja Personalize', active: true,
  },
}

export function StoreProvider({ slug, children }) {
  const [store, setStore] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    async function load() {
      const { data: storeData } = await supabase
        .from('stores').select('*').eq('slug', slug).eq('active', true).single()

      const resolved = storeData || FALLBACK_STORES[slug] || null
      if (!resolved) { setLoading(false); return }

      const { data: globalSettings } = await supabase
        .from('settings').select('key, value').is('store_id', null)

      const { data: storeSettings } = storeData
        ? await supabase.from('settings').select('key, value').eq('store_id', storeData.id)
        : { data: null }

      const map = {}
      globalSettings?.forEach(r => { map[r.key] = r.value })
      storeSettings?.forEach(r => { map[r.key] = r.value })

      setStore(resolved)
      setSettings(map)
      setLoading(false)
    }
    load()
  }, [slug])

  return (
    <StoreContext.Provider value={{ store, settings, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
