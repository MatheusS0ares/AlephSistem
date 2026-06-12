import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, query, limit } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (token !== 'paizao2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const app = getApps().find((a) => a.name === 'seed-reels') ?? initializeApp(config, 'seed-reels')
  const db = getFirestore(app)

  // Delete existing reels
  const existing = await getDocs(collection(db, 'reels'))
  await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)))

  // Get first 6 products to use their images
  const prodSnap = await getDocs(query(collection(db, 'produtos'), limit(6)))
  const prods = prodSnap.docs.map((d) => d.data() as { imagem: string; nome: string })

  const titulos = [
    'Look Streetwear',
    'Coleção Copa 2026',
    'Conjunto Esportivo',
    'Polo Premium',
    'Bermuda Tactel',
    'Camiseta Oversized',
  ]

  const reels = prods.slice(0, 6).map((p, i) => ({
    thumbnail: p.imagem,
    thumbnailAlt: p.nome,
    titulo: titulos[i] ?? p.nome,
    instagramUrl: 'https://instagram.com/paizaomodas2',
    ordem: i + 1,
    ativo: true,
    destaque: i < 2,
    criadoEm: Date.now(),
  }))

  await Promise.all(reels.map((r) => addDoc(collection(db, 'reels'), r)))

  return NextResponse.json({ ok: true, seeded: reels.length })
}
