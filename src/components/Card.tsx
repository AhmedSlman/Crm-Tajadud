import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
};

export default function Card({ children, className = '', title, action }: CardProps) {
  return (
    <div className={`bg-[#14102a] border border-[#563EB7]/20 rounded-lg ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-[#563EB7]/20 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title || action ? 'p-6' : 'p-0'}>
        {children}
      </div>
    </div>
  );
}

