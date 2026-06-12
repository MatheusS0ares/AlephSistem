import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Produtos: busca compartilhados (store_id IS NULL) + específicos da loja
export function useProducts(storeId = null, category = null) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('order_index')

      if (category) query = query.eq('category', category)

      // Produtos da loja + produtos compartilhados (store_id IS NULL)
      if (storeId) {
        query = query.or(`store_id.eq.${storeId},store_id.is.null`)
      } else {
        query = query.is('store_id', null)
      }

      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    fetch()
  }, [storeId, category])

  return { products, loading }
}

// Depoimentos: compartilhados + da loja
export function useTestimonials(storeId = null) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('featured', { ascending: false })

      if (storeId) {
        query = query.or(`store_id.eq.${storeId},store_id.is.null`)
      } else {
        query = query.is('store_id', null)
      }

      const { data } = await query
      setTestimonials(data || [])
      setLoading(false)
    }
    fetch()
  }, [storeId])

  return { testimonials, loading }
}

// Todas as lojas ativas
export function useStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('stores')
      .select('*')
      .eq('active', true)
      .order('created_at')
      .then(({ data }) => {
        setStores(data || [])
        setLoading(false)
      })
  }, [])

  return { stores, loading }
}

export async function saveOrder(order) {
  const { data, error } = await supabase.from('orders').insert([order]).select().single()
  return { data, error }
}
