import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'

// Firebase web config. These values are safe to expose to the browser (access is
// controlled by Firebase rules + API key restrictions, not by hiding them).
// NEXT_PUBLIC_* env vars override the literals when set.
export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyCRxQeaMqZgwDKvOE1Dywz-j14rnJsFTHM',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'events-registrations-8efaa.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'events-registrations-8efaa',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'events-registrations-8efaa.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '822249601238',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    '1:822249601238:web:d21dc59980d898e94bf177',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-VZRN6PYKDN',
}

// Singleton app instance (safe under hot reload / repeated imports).
export const firebaseApp: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig)
