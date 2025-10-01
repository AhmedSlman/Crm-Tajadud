import { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
};

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#563EB7]/20 to-[#7c5fdc]/20 text-[#a78bfa] border-[#563EB7]/40 shadow-sm shadow-[#563EB7]/20',
    success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 shadow-sm shadow-green-500/20',
    warning: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/40 shadow-sm shadow-yellow-500/20',
    danger: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20',
    info: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/20',
    default: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/40',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border font-semibold
      backdrop-blur-sm
      transition-all duration-300
      hover:scale-105
      ${variants[variant]} ${sizes[size]}
    `}>
      {children}
    </span>
  );
}

