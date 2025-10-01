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
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // Account pending approval
      if (isPending && !user) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isPending) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

