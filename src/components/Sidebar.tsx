'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Megaphone, 
  FileText, 
  Calendar,
  BarChart3
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Content Plan', href: '/content', icon: FileText },
  { name: 'Social Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#14102a] h-screen fixed left-0 top-0 flex flex-col border-r border-[#563EB7]/20">
      <div className="p-6 border-b border-[#563EB7]/20">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#563EB7] to-[#7c5fdc] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          Agency CRM
        </h1>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#563EB7] text-white shadow-lg shadow-[#563EB7]/30'
                      : 'text-gray-300 hover:bg-[#1a1333] hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#563EB7]/20">
        <div className="text-xs text-gray-400 text-center">
          © 2025 Agency CRM
        </div>
      </div>
    </div>
  );
}

