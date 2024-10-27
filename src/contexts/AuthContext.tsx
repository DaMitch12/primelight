// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with your backend
          // For now, just simulate a user
          setUser({
            id: '1',
            email: 'user@example.com',
            name: 'Test User'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Implement actual login logic here
    setUser({
      id: '1',
      email,
      name: 'Test User'
    });
    localStorage.setItem('authToken', 'dummy-token');
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    // Implement actual registration logic here
    setUser({
      id: '1',
      email,
      name
    });
    localStorage.setItem('authToken', 'dummy-token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};