type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

const getImportMetaEnv = (): ImportMetaEnv => {
  return import.meta.env;
};

const getEnv = (key: string, fallback: string): string => {
  const env = getImportMetaEnv();
  const value = env[key as keyof ImportMetaEnv];
  return typeof value === "string" && value.length > 0 ? value : fallback;
};

export const firebaseClientConfig: FirebaseClientConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyB3O2sr6OHsXP0e7uH_KItIjLwV1TyKRLc"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "variagrofoods.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "variagrofoods"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "variagrofoods.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "785533914971"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:785533914971:web:56e5213fe51dd824cc147e"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "G-C23ZELR6K8"),
};
