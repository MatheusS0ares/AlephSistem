import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const CATEGORIES = {
  festas:      'Festas & Eventos',
  bebes:       'Bebês',
  presentes:   'Presentes',
  aniversario: 'Aniversários',
  maternidade: 'Maternidade',
  corporativo: 'Corporativo',
}

export const ORDER_STATUS = {
  novo:          { label: 'Novo',         color: '#C9A84C' },
  em_andamento:  { label: 'Em andamento', color: '#3B82F6' },
  concluido:     { label: 'Concluído',    color: '#22C55E' },
  cancelado:     { label: 'Cancelado',    color: '#EF4444' },
}
