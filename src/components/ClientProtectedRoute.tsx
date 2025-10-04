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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if client is logged in
    const storedClient = localStorage.getItem('clientUser');
    
    if (!storedClient) {
      router.push('/client-login');
      return;
    }

    try {
      const client = JSON.parse(storedClient);
      if (client.status === 'suspended') {
        localStorage.removeItem('clientUser');
        router.push('/client-login');
        return;
      }
      
      // Clear any admin session if exists
      localStorage.removeItem('user');
      
      setClientUser(client);
    } catch (error) {
      localStorage.removeItem('clientUser');
      router.push('/client-login');
      return;
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c081e]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!clientUser) {
    return null;
  }

  return <>{children}</>;
}
