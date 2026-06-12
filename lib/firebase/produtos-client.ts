import { getClientDb } from './client'
import { slugify } from '@/lib/utils'
import type { Produto } from '@/lib/data/produtos'

const COL = 'produtos'

// Firestore rejeita valores `undefined` — removemos antes de gravar.
function semUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}

export async function listarProdutos(): Promise<Produto[]> {
  const db = await getClientDb()
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Produto))
}

export type ProdutoInput = Omit<Produto, 'id' | 'slug'>

export async function criarProduto(data: ProdutoInput): Promise<string> {
  const db = await getClientDb()
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
  const slug = slugify(data.nome)

  const docRef = await addDoc(collection(db, COL), {
    ...semUndefined(data),
    slug,
    imagens: data.imagens?.length ? data.imagens : [data.imagem],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function atualizarProduto(
  id: string,
  data: Partial<ProdutoInput>
): Promise<void> {
  const db = await getClientDb()
  const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')

  await updateDoc(doc(db, COL, id), {
    ...semUndefined(data),
    updatedAt: serverTimestamp(),
  })
}

export async function deletarProduto(id: string): Promise<void> {
  const db = await getClientDb()
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, COL, id))
}
