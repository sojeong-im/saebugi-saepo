import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFlnq3TTllzxeHxp_TmJK7uigc6HosVmo",
  authDomain: "saebugi-saepo.firebaseapp.com",
  projectId: "saebugi-saepo",
  storageBucket: "saebugi-saepo.firebasestorage.app",
  messagingSenderId: "623939024580",
  appId: "1:623939024580:web:8db88c8b8949ee7b7a3b91",
  measurementId: "G-DK11E2949F"
};

const app = initializeApp(firebaseConfig);

// Enable offline persistence: data is cached locally → instant load on refresh
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
