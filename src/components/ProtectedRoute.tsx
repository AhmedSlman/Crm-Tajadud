'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!loading) {
      // Check if client is trying to access admin routes
      const clientUser = localStorage.getItem('clientUser');
      if (clientUser) {
        router.push('/client-dashboard');
        return;
      }

      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // Account pending approval
      if (user && isPending) {
        router.push('/auth/pending');
        return;
      }

      // Check admin requirement
      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }

      // Check role-based access
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/');
        return;
      }
    }
  }, [loading, isAuthenticated, isPending, isAdmin, user, router, requireAdmin, allowedRoles]);

  // Always show loading while checking auth or during redirects
  if (loading || !isAuthenticated || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check admin access
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

