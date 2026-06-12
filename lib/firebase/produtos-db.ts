import type { Produto } from '@/lib/data/produtos'
import { produtos as produtosPaizao, categorias as mockCategorias } from '@/lib/data/produtos'
import { magnnataProdutos } from '@/lib/data/magnnata-produtos'
import type { Categoria } from '@/lib/data/produtos'
import { getTenant } from '@/tenants'

const isFirebaseConfigured = () => !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Mock por tenant — usado como fallback quando o Firebase não está configurado.
function mockProdutos(): Produto[] {
  switch (getTenant().id) {
    case 'magnnata': return magnnataProdutos
    case 'station061': return []
    case 'hoomau': return []
    default: return produtosPaizao
  }
}

async function getDb() {
  const { getClientDb } = await import('./client')
  return getClientDb()
}

async function firestoreImport() {
  return import('firebase/firestore')
}

export async function getProdutos(): Promise<Produto[]> {
  if (!isFirebaseConfigured()) return mockProdutos()

  try {
    const db = await getDb()
    const { collection, getDocs } = await firestoreImport()
    const snap = await getDocs(collection(db, 'produtos'))
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Produto))
  } catch {
    return mockProdutos()
  }
}

export async function getProdutoBySlug(slug: string): Promise<Produto | null> {
  if (!isFirebaseConfigured()) {
    return mockProdutos().find((p) => p.slug === slug) ?? null
  }

  try {
    const db = await getDb()
    const { collection, query, where, limit, getDocs } = await firestoreImport()
    const q = query(collection(db, 'produtos'), where('slug', '==', slug), limit(1))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const doc = snap.docs[0]!
    return { ...doc.data(), id: doc.id } as Produto
  } catch {
    return mockProdutos().find((p) => p.slug === slug) ?? null
  }
}

export async function getProdutosByCategoria(categoria: string): Promise<Produto[]> {
  if (!isFirebaseConfigured()) {
    return mockProdutos().filter((p) => p.categoria === categoria)
  }

  try {
    const db = await getDb()
    const { collection, query, where, getDocs } = await firestoreImport()
    const q = query(collection(db, 'produtos'), where('categoria', '==', categoria))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Produto))
  } catch {
    return mockProdutos().filter((p) => p.categoria === categoria)
  }
}

export async function getProdutosDestaque(): Promise<Produto[]> {
  if (!isFirebaseConfigured()) {
    return mockProdutos().filter((p) => p.destaque)
  }

  try {
    const db = await getDb()
    const { collection, getDocs } = await firestoreImport()
    const snap = await getDocs(collection(db, 'produtos'))
    const todos = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Produto))
    // Produtos marcados como "destaque" no admin têm prioridade.
    // Se nenhum estiver marcado, mostra os primeiros produtos reais
    // em vez de cair no mock — assim o catálogo nunca exibe imagens falsas.
    const marcados = todos.filter((p) => p.destaque)
    const lista = marcados.length > 0 ? marcados : todos
    return lista.slice(0, 8)
  } catch {
    return mockProdutos().filter((p) => p.destaque)
  }
}

export async function getCategorias(): Promise<Categoria[]> {
  return mockCategorias
}

export async function getProdutoSlugs(): Promise<string[]> {
  if (!isFirebaseConfigured()) return mockProdutos().map((p) => p.slug)

  try {
    const db = await getDb()
    const { collection, getDocs } = await firestoreImport()
    const snap = await getDocs(collection(db, 'produtos'))
    return snap.docs.map((d) => (d.data() as { slug: string }).slug)
  } catch {
    return mockProdutos().map((p) => p.slug)
  }
}
