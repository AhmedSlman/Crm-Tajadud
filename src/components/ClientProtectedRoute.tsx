'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientUser } from '@/types';

interface ClientProtectedRouteProps {
  children: React.ReactNode;
}

export default function ClientProtectedRoute({ children }: ClientProtectedRouteProps) {
  const router = useRouter();
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Immediate check before anything renders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedClient = localStorage.getItem('clientUser');
      const adminToken = localStorage.getItem('token');
      
      if (adminToken) {
        router.push('/');
        return;
      }
      
      if (!storedClient) {
        router.push('/client-login');
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    // Check if client is logged in
    const storedClient = localStorage.getItem('clientUser');
    
    if (!storedClient) {
      router.push('/client-login');
      setIsChecking(false);
      return;
    }

    try {
      const client = JSON.parse(storedClient);
      if (client.status === 'suspended') {
        localStorage.removeItem('clientUser');
        router.push('/client-login');
        setIsChecking(false);
        return;
      }
      
      // Clear any admin session if exists
      localStorage.removeItem('user');
      
      setClientUser(client);
      setIsChecking(false);
    } catch (error) {
      localStorage.removeItem('clientUser');
      router.push('/client-login');
      setIsChecking(false);
      return;
    }
  }, [router]);

  // Always show loading until auth check is complete
  if (isChecking || !clientUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
