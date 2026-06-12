import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null

function getApp(): FirebaseApp {
  if (!_app) {
    _app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig)
  }
  return _app
}

export async function getClientAuth(): Promise<Auth> {
  if (!_auth) {
    const { getAuth } = await import('firebase/auth')
    _auth = getAuth(getApp())
  }
  return _auth
}

export async function getClientDb(): Promise<Firestore> {
  if (!_db) {
    const { getFirestore } = await import('firebase/firestore')
    _db = getFirestore(getApp())
  }
  return _db
}

