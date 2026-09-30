import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore'
import firebaseConfig from '@/firebase-applet-config.json'

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// CRITICAL: The app requires firebaseConfig.firestoreDatabaseId as the second parameter
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId)
export const auth = getAuth(app)

// Validate connection on client startup as specified by Firebase skill
if (typeof window !== 'undefined') {
  ;(async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'))
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('Please check your Firebase configuration.')
      }
    }
  })()
}

export default app
