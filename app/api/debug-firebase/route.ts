import { NextResponse } from 'next/server'

export async function GET() {
  const info: Record<string, unknown> = {}

  info.env = {
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'MISSING',
    api_key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
    app_id: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'SET' : 'MISSING',
  }

  try {
    const { initializeApp, getApps } = await import('firebase/app')
    const { getFirestore, collection, getDocs } = await import('firebase/firestore')

    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const app = getApps().find((a) => a.name === 'debug') ?? initializeApp(config, 'debug')
    info.app_init = 'ok'

    const db = getFirestore(app)
    info.db_init = 'ok'

    const snap = await getDocs(collection(db, 'produtos'))
    info.count = snap.size
    info.first_3 = snap.docs.slice(0, 3).map((d) => ({
      id: d.id,
      nome: (d.data() as Record<string, unknown>).nome,
      imagem: (d.data() as Record<string, unknown>).imagem,
    }))
  } catch (e) {
    info.error = String(e)
    info.stack = e instanceof Error ? e.stack : undefined
  }

  return NextResponse.json(info)
}
