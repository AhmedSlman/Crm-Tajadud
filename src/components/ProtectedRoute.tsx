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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Early check on client side - prevent any flash of content
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const clientUser = localStorage.getItem('clientUser');
      
      if (clientUser) {
        router.push('/client-dashboard');
        return;
      }
      
      if (!token) {
        router.push('/auth/login');
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    if (!loading) {
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
      
      // Auth check complete
      setHasCheckedAuth(true);
    }
  }, [loading, isAuthenticated, isPending, isAdmin, user, router, requireAdmin, allowedRoles]);

  // Show loading until auth is fully verified
  if (loading || !isAuthenticated || isPending || !hasCheckedAuth) {
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

