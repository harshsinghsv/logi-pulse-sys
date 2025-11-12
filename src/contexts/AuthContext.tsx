import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: false,
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
  // For now, no authentication required - all data is publicly readable
  // Can add Supabase auth later if needed
  return (
    <AuthContext.Provider value={{ userId: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
