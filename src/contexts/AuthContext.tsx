import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, // <--- FALTAVA IMPORTAR ISSO
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

// Tipagem do Usuário
interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'student';
}

// O ERRO ESTAVA AQUI: Faltava definir 'signed' na tipagem
interface AuthContextData {
  signed: boolean;     // <--- ESSA LINHA É OBRIGATÓRIA
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// O Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: currentUser.uid,
              email: currentUser.email!,
              name: data.name || 'Usuário',
              role: data.role // 'admin' ou 'student'
            });
          } else {
             console.log("Usuário autenticado mas sem documento no Firestore");
             // Opcional: Deslogar se não tiver cadastro no banco
             // await auth.signOut();
          }
        } catch (error) {
          console.log("Erro ao buscar dados do usuário:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- A FUNÇÃO QUE FALTAVA (LOGIN) ---
  async function signIn(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      // Log do erro real para você ver no terminal
      console.error("ERRO FIREBASE:", error.code, error.message);
      throw error; // Lança o erro para a tela de Login tratar
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, // <--- A PROPRIEDADE MÁGICA QUE LIBERA AS ROTAS
      user, 
      loading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}