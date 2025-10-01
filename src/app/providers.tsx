'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import QuickActions from '@/components/QuickActions';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <AuthProvider>
      <DataProvider>
        {isAuthPage ? (
          // Auth pages - no sidebar/topbar
          <>{children}</>
        ) : (
          // Main app - with sidebar/topbar
          <div className="relative min-h-screen">
            <Sidebar />
            <Topbar />
            <main className="relative z-0 ml-64 mt-16 p-8 min-h-screen">
              {children}
            </main>
            <QuickActions />
          </div>
        )}
      </DataProvider>
    </AuthProvider>
  );
}

