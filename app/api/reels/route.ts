import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getDb() {
  const app = getApps().find((a) => a.name === 'api-reels') ?? initializeApp(config, 'api-reels')
  return getFirestore(app)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getDb()
    const ref = await addDoc(collection(db, 'reels'), {
      ...body,
      criadoEm: Date.now(),
    })
    return NextResponse.json({ ok: true, id: ref.id })
  } catch (err) {
    console.error('[POST /api/reels]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const db = getDb()
    await updateDoc(doc(db, 'reels', id), data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[PATCH /api/reels]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const db = getDb()
    await deleteDoc(doc(db, 'reels', id))
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/reels]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
