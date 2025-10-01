import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  hover?: boolean;
};

export default function Card({ children, className = '', title, action, hover = true }: CardProps) {
  return (
    <div className={`
      relative bg-gradient-to-br from-[#14102a] to-[#1a1333] 
      border border-[#563EB7]/20 rounded-xl 
      shadow-lg shadow-black/20
      transition-all duration-300
      ${hover ? 'hover:shadow-2xl hover:shadow-[#563EB7]/10 hover:border-[#563EB7]/40 hover:-translate-y-1' : ''}
      ${className}
      animate-fadeIn
    `}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#563EB7]/0 to-[#563EB7]/0 hover:from-[#563EB7]/5 hover:to-transparent transition-all duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {(title || action) && (
          <div className="px-6 py-4 border-b border-[#563EB7]/20 flex items-center justify-between backdrop-blur-sm">
            {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
            {action && <div>{action}</div>}
          </div>
        )}
        <div className={title || action ? 'p-6' : 'p-0'}>
          {children}
        </div>
      </div>
    </div>
  );
}

