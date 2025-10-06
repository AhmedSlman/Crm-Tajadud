'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { UserRole } from '@/types';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
};

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin, isPending } = useAuth();
  const router = useRouter();
  
  // Check token synchronously - no navigation here
  const [hasToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const clientUser = localStorage.getItem('clientUser');
      return !!token && !clientUser;
    }
    return false;
  });

  // Single useEffect for all auth checks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    const clientUser = localStorage.getItem('clientUser');
    
    // If client user exists, redirect to client area
    if (clientUser) {
      router.replace('/client-dashboard');
      return;
    }
    
    // If no token, redirect to login immediately
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    
    // Wait for auth context to load
    if (loading) return;
    
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    // Account pending approval
    if (user && isPending) {
      router.replace('/auth/pending');
      return;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin) {
      router.replace('/auth/login');
      return;
    }

    // Check role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/auth/login');
      return;
    }
  }, [loading, isAuthenticated, isPending, isAdmin, user, router, requireAdmin, allowedRoles]);

  // Return null if no token - prevents any content flash
  if (!hasToken) {
    return null;
  }

  // Return null while checking auth - prevents content flash
  if (loading || !isAuthenticated || isPending) {
    return null;
  }

  // Return null for unauthorized access
  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

