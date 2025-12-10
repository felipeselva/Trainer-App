import { initializeApp } from 'firebase/app';
// Mantendo sua configuração correta de persistência
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Suas chaves (Mantenha as suas aqui)
const firebaseConfig = {
apiKey: "",
  authDomain: "",
  projectId: ",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// 2. Blindagem contra Hot-Reload (Singleton Pattern)
if (getApps().length === 0) {
  // Se não existe app inicializado, cria um novo
  app = initializeApp(firebaseConfig);
  
  // Inicializa Auth com Persistência (Só faz isso na primeira vez)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  // Se já existe, pega a instância existente
  app = getApp();
  auth = getAuth(app);
}

// Inicializa o Banco (é seguro chamar múltiplas vezes, mas por coerência colocamos aqui)
db = getFirestore(app);

export { auth, db, app, firebaseConfig };
