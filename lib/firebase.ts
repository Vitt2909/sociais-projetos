import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { Functions } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

let firebaseAppInstance: FirebaseApp | null = null;

const ensureFirebaseConfig = () => {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Configuração do Firebase ausente. Defina as variáveis de ambiente: ${missingKeys.join(', ')}`,
    );
  }
};

export const getFirebaseApp = (): FirebaseApp => {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  ensureFirebaseConfig();

  firebaseAppInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);

  return firebaseAppInstance;
};

export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp());

export const getFirebaseFirestore = (): Firestore => getFirestore(getFirebaseApp());

export const getFirebaseFunctions = (): Functions => getFunctions(getFirebaseApp());
