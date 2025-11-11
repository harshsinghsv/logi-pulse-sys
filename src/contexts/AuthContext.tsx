import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for initial auth token from environment
    const initialAuthToken = import.meta.env.VITE_INITIAL_AUTH_TOKEN;
    
    if (initialAuthToken && !user) {
      signInWithCustomToken(auth, initialAuthToken)
        .then((userCredential) => {
          console.log('Auto-signed in with custom token');
        })
        .catch((error) => {
          console.error('Auto sign-in failed:', error);
        });
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserId(currentUser?.uid || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
