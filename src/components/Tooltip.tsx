'use client';

import { ReactNode, useState } from 'react';

type TooltipProps = {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1a1333] border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1333] border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1a1333] border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1a1333] border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute ${positions[position]} z-50 animate-fadeIn`}>
          <div className="bg-[#1a1333] border border-[#563EB7]/30 px-3 py-2 rounded-lg shadow-xl text-sm text-white whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute ${arrows[position]} w-0 h-0 border-4`} />
        </div>
      )}
    </div>
  );
}

