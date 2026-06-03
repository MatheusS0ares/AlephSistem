import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const StoreContext = createContext(null)

const FALLBACK_STORES = {
  'confeitaria-demo': {
    id: 'fallback-1', name: 'Confeitaria da Mari', slug: 'confeitaria-demo',
    tagline: 'Bolos e doces para momentos especiais',
    whatsapp: '5500000000001', instagram: '@confeitariadamari',
    instagram_url: 'https://instagram.com/confeitariadamari',
    address: 'Brasília - DF', active: true,
  },
  'moda-demo': {
    id: 'fallback-2', name: 'Boutique Style', slug: 'moda-demo',
    tagline: 'Moda feminina com personalidade',
    whatsapp: '5500000000002', instagram: '@boutiquestyle',
    instagram_url: 'https://instagram.com/boutiquestyle',
    address: 'Brasília - DF', active: true,
  },
  'delivery-demo': {
    id: 'fallback-3', name: 'Burguer Express', slug: 'delivery-demo',
    tagline: 'Os melhores burguers da região',
    whatsapp: '5500000000003', instagram: '@burguerexpress',
    instagram_url: 'https://instagram.com/burguerexpress',
    address: 'Brasília - DF', active: true,
  },
  'beleza-demo': {
    id: 'fallback-4', name: 'Studio Beauty', slug: 'beleza-demo',
    tagline: 'Beleza e bem-estar para você',
    whatsapp: '5500000000004', instagram: '@studiobeauty',
    instagram_url: 'https://instagram.com/studiobeauty',
    address: 'Brasília - DF', active: true,
  },
  'personalizados-demo': {
    id: 'fallback-5', name: 'Arte & Mimo', slug: 'personalizados-demo',
    tagline: 'Personalizados exclusivos para cada momento',
    whatsapp: '5500000000005', instagram: '@artemimo',
    instagram_url: 'https://instagram.com/artemimo',
    address: 'Brasília - DF', active: true,
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
