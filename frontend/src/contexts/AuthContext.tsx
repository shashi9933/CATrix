import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI } from '../utils/api';

interface UserType {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (updates: { name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and verify it
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.verify()
        .then((response: any) => {
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates: { name?: string }) => {
    try {
      const response = await userAPI.updateProfile(updates.name || '');
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    // Google OAuth sign-in - to be implemented with backend OAuth support
    // For now, throw error until backend OAuth is configured
    throw new Error('Google Sign-In not yet configured. Please use email/password login.');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 