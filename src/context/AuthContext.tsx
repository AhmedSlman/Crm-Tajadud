'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, LoginCredentials, RegisterData, UserRole } from '@/types';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPending: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, using mock data
      const response = await mockLogin(credentials);
      
      if (response.status === 'pending') {
        throw new Error('Your account is pending approval from admin');
      }
      
      if (response.status === 'suspended') {
        throw new Error('Your account has been suspended');
      }

      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('token', response.token || 'mock-token');
      setUser(response);
      
      router.push('/');
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      const response = await mockRegister(data);
      
      // Don't auto-login after registration, show pending message
      router.push('/auth/pending');
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isPending = user?.status === 'pending';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Mock functions - Replace with actual API calls
async function mockLogin(credentials: LoginCredentials): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock users - simulating backend authentication
      const mockUsers = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@crm.com',
          password: 'admin123',
          role: 'admin' as UserRole,
          status: 'active' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          token: 'mock-admin-token',
        },
        {
          id: '2',
          name: 'Ahmed Hassan',
          email: 'ahmed@crm.com',
          password: '123456',
          role: 'graphic-designer' as UserRole,
          status: 'active' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
          token: 'mock-designer-token',
        },
        {
          id: '3',
          name: 'Sara Mohamed',
          email: 'sara@crm.com',
          password: '123456',
          role: 'social-media' as UserRole,
          status: 'active' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
          token: 'mock-social-token',
        },
        {
          id: '4',
          name: 'Omar Ali',
          email: 'omar@crm.com',
          password: '123456',
          role: 'content-writer' as UserRole,
          status: 'pending' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
          token: 'mock-writer-token',
        },
        {
          id: '6',
          name: 'Youssef Khaled',
          email: 'youssef@crm.com',
          password: '123456',
          role: 'ads-specialist' as UserRole,
          status: 'active' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
          token: 'mock-ads-token',
        },
        {
          id: '7',
          name: 'Heba Samir',
          email: 'heba@crm.com',
          password: '123456',
          role: 'seo-specialist' as UserRole,
          status: 'suspended' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Heba',
          token: 'mock-seo-token',
        },
        {
          id: '8',
          name: 'Karim Mostafa',
          email: 'karim@crm.com',
          password: '123456',
          role: 'account-manager' as UserRole,
          status: 'active' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
          token: 'mock-manager-token',
        },
      ];

      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }

      const { password, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    }, 1000);
  });
}

async function mockRegister(data: RegisterData): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      if (data.email === 'admin@crm.com' || data.email === 'ahmed@crm.com') {
        reject(new Error('Email already exists'));
        return;
      }

      // Simulate successful registration
      resolve();
    }, 1000);
  });
}

