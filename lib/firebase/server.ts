import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!

  // Preferência 1: base64 da service account (evita problemas de escaping)
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64
  if (b64) {
    const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
    return initializeApp({ credential: cert(sa) })
  }

  // Preferência 2: JSON completo da service account
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (json) {
    const sa = JSON.parse(json)
    return initializeApp({ credential: cert(sa) })
  }

  // Fallback: variáveis individuais
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey?.includes('\n')
        ? privateKey
        : privateKey?.replace(/\\n/g, '\n'),
    }),
  })
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}
