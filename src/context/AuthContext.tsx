'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, LoginCredentials, RegisterData, UserRole } from '@/types';
import { authAPI } from '@/lib/api';

// Helper function لحذف الـ token من cookies و localStorage
const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  // حذف من localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // حذف من cookies
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

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
        try {
          // التحقق من صحة التوكن مع الخادم
          const validation = await authAPI.validateToken();
          
          if (validation.valid && validation.user) {
            setUser(validation.user as AuthUser);
            // تحديث البيانات المحلية
            localStorage.setItem('user', JSON.stringify(validation.user));
          } else {
            // التوكن غير صالح، مسح البيانات
            clearAuthData();
            setUser(null);
          }
        } catch (error) {
          // إذا فشل التحقق من التوكن، استخدم البيانات المحفوظة محلياً
          console.log('Token validation failed, using cached user data');
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // لا تمسح البيانات في حالة فشل الاتصال بالخادم
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      // استخدام API الحقيقي
      const response = await authAPI.login(credentials);
      
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
      
      // استخدام API الحقيقي
      await authAPI.register(data);
      
      // Don't auto-login after registration, show pending message
      router.push('/auth/pending');
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // إشعار الخادم بتسجيل الخروج
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // مسح البيانات المحلية في جميع الأحوال
      clearAuthData();
      setUser(null);
      router.push('/auth/login');
    }
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


