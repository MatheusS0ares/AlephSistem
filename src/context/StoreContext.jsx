import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { initGA4 } from '../lib/analytics'

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
  'huds': {
    id: 'fallback-huds', name: "Barbearia HUD'S", slug: 'huds',
    tagline: 'Seu estilo, nossa arte.',
    whatsapp: '5500000000006', instagram: '@hudsbarbearia',
    instagram_url: 'https://instagram.com/hudsbarbearia',
    address: 'Brasília - DF', active: true,
  },
  'delicias-da-emely': {
    id: 'delicias-da-emely', name: 'Delicias da Emely', slug: 'delicias-da-emely',
    tagline: 'Brigadeiros gourmet e doces especiais',
    whatsapp: '5561992235201', instagram: '@deliciasdaemely',
    instagram_url: 'https://instagram.com/deliciasdaemely',
    address: 'Brasília - DF', active: true,
  },
}

const FALLBACK_SETTINGS = {
  'delicias-da-emely': {
    store_type: 'confeitaria',
    hero_eyebrow: '✦ Confeitaria artesanal feita com amor ✦',
    hero_title: 'Celebre cada momento com uma doce lembrança',
    hero_desc: 'Brigadeiros gourmet, kits presente e caixas especiais para cada ocasião. Feito por encomenda, entregue com carinho.',
    hero_wpp_text: 'Olá Emely! Quero fazer um pedido 🍫',
    banner_ativo: '1',
    banner_texto: '🍫 Dia dos Namorados! Últimas vagas disponíveis — peça agora pelo WhatsApp.',
    banner_cor: 'd4006e',
    categorias_json: JSON.stringify([
      { icon: '🍫', title: 'Brigadeiros',       desc: 'Gourmet nos melhores sabores: Ninho, Pistache, Morango e muito mais.',  cat: 'brigadeiros'   },
      { icon: '🎁', title: 'Kits Presente',     desc: 'Caixas montadas com capricho para presentear com amor.',                 cat: 'kits-presente' },
      { icon: '🎂', title: 'Festas',            desc: 'Doces artesanais para aniversários, chás e comemorações.',               cat: 'festas'        },
      { icon: '❤️', title: 'Dia dos Namorados', desc: 'Kits especiais: Jogo do Prazer, Ferrero Rocher e caixinhas surpresa.',   cat: 'namorados'     },
      { icon: '🏢', title: 'Corporativo',       desc: 'Brindes personalizados e kits para eventos empresariais.',               cat: 'corporativo'   },
      { icon: '🍬', title: 'Chocolates',        desc: 'Trufas, bombons e kits de chocolates artesanais premium.',               cat: 'chocolates'    },
    ]),
    como_funciona_steps: JSON.stringify([
      { num: '01', icon: '📲', title: 'Escolha seus doces',    desc: 'Veja o cardápio, escolha os sabores, quantidades e embalagem ideal para a ocasião.' },
      { num: '02', icon: '💬', title: 'Peça pelo WhatsApp',    desc: 'Confirme o pedido, endereço e forma de pagamento direto com a Emely.' },
      { num: '03', icon: '🍫', title: 'Receba com amor',       desc: 'Entregamos ou você retira. Feito na hora, com ingredientes frescos e muito carinho.' },
    ]),
    depoimentos_json: JSON.stringify([
      { id: 1, name: 'Juliana Ferreira',    role: 'Aniversário 🎂',   text: 'Pedi os brigadeiros gourmet para o aniversário da minha filha e foi um sucesso! Todos perguntaram onde comprei. Já pedi mais duas vezes!', stars: 5, featured: true  },
      { id: 2, name: 'Carlos & Patrícia',  role: 'Casal 💑',          text: 'Presenteamos com o Jogo do Prazer no Dia dos Namorados e foi a melhor ideia! Embalagem linda, brigadeiros deliciosos e chegou no prazo.',   stars: 5, featured: false },
      { id: 3, name: 'TechBrasília',       role: 'Corporativo 🏢',   text: 'Pedimos 80 caixinhas para nosso evento. Atendimento impecável, qualidade incrível e entrega pontual. Parceira oficial da empresa!',          stars: 5, featured: false },
    ]),
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
      if (!storeData && FALLBACK_SETTINGS[slug]) {
        Object.assign(map, FALLBACK_SETTINGS[slug])
      }
      globalSettings?.forEach(r => { map[r.key] = r.value })
      storeSettings?.forEach(r => { map[r.key] = r.value })

      setStore(resolved)
      setSettings(map)
      setLoading(false)
      if (map.ga4_id) initGA4(map.ga4_id)
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
