'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientUser } from '@/types';

interface ClientProtectedRouteProps {
  children: React.ReactNode;
}

export default function ClientProtectedRoute({ children }: ClientProtectedRouteProps) {
  const router = useRouter();
  
  // Check token synchronously - no navigation here
  const [hasClientToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedClient = localStorage.getItem('clientUser');
      const adminToken = localStorage.getItem('token');
      return !!storedClient && !adminToken;
    }
    return false;
  });
  
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Single useEffect for all checks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedClient = localStorage.getItem('clientUser');
    const adminToken = localStorage.getItem('token');
    
    // If admin token exists, redirect to admin area
    if (adminToken) {
      router.replace('/');
      setIsChecking(false);
      return;
    }
    
    // If no client user, redirect to client login
    if (!storedClient) {
      router.replace('/client-login');
      setIsChecking(false);
      return;
    }

    try {
      const client = JSON.parse(storedClient);
      if (client.status === 'suspended') {
        localStorage.removeItem('clientUser');
        router.replace('/client-login');
        setIsChecking(false);
        return;
      }
      
      // Clear any admin session if exists
      localStorage.removeItem('user');
      
      setClientUser(client);
      setIsChecking(false);
    } catch (error) {
      localStorage.removeItem('clientUser');
      router.replace('/client-login');
      setIsChecking(false);
      return;
    }
  }, [router]);

  // Return null if no client token or still checking - prevents any content flash
  if (!hasClientToken || isChecking || !clientUser) {
    return null;
  }

  return <>{children}</>;
}
