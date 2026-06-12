export interface ReelDestaque {
  id: string
  thumbnail: string
  thumbnailAlt: string
  titulo: string | null
  instagramUrl: string
  ordem: number
  ativo: boolean
  destaque: boolean
  criadoEm: number
}

const isConfigured = () => !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

async function getDb() {
  const { getClientDb } = await import('./client')
  return getClientDb()
}

async function fs() {
  return import('firebase/firestore')
}

export async function getReelsDestaque(): Promise<ReelDestaque[]> {
  if (!isConfigured()) return []
  try {
    const db = await getDb()
    const { collection, getDocs } = await fs()
    const snap = await getDocs(collection(db, 'reels'))
    return snap.docs
      .map((d) => ({ ...d.data(), id: d.id } as ReelDestaque))
      .filter((r) => r.ativo)
      .sort((a, b) => Number(b.destaque) - Number(a.destaque) || a.ordem - b.ordem)
      .slice(0, 12)
  } catch {
    return []
  }
}

export async function getReels(): Promise<ReelDestaque[]> {
  if (!isConfigured()) return []
  try {
    const db = await getDb()
    const { collection, getDocs } = await fs()
    const snap = await getDocs(collection(db, 'reels'))
    return snap.docs
      .map((d) => ({ ...d.data(), id: d.id } as ReelDestaque))
      .sort((a, b) => Number(b.destaque) - Number(a.destaque) || a.ordem - b.ordem)
  } catch {
    return []
  }
}

export async function createReel(data: Omit<ReelDestaque, 'id'>): Promise<void> {
  const db = await getDb()
  const { collection, addDoc } = await fs()
  await addDoc(collection(db, 'reels'), data)
}

export async function updateReel(id: string, data: Partial<Omit<ReelDestaque, 'id'>>): Promise<void> {
  const db = await getDb()
  const { doc, updateDoc } = await fs()
  await updateDoc(doc(db, 'reels', id), data)
}

export async function deleteReel(id: string): Promise<void> {
  const db = await getDb()
  const { doc, deleteDoc } = await fs()
  await deleteDoc(doc(db, 'reels', id))
}
