import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: `
      bg-gradient-to-r from-[#563EB7] to-[#6d4dd4] 
      hover:from-[#6d4dd4] hover:to-[#7c5fdc]
      text-white shadow-lg shadow-[#563EB7]/40 
      hover:shadow-xl hover:shadow-[#563EB7]/50
      hover:scale-105 active:scale-95
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:-translate-x-full hover:before:translate-x-full
      before:transition-transform before:duration-700
    `,
    secondary: `
      bg-gradient-to-br from-[#1a1333] to-[#241a47]
      hover:from-[#241a47] hover:to-[#2d2055]
      text-white border border-[#563EB7]/30
      hover:border-[#563EB7]/60
      shadow-md hover:shadow-lg
      hover:scale-105 active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-700 hover:to-red-800
      text-white shadow-lg shadow-red-600/30
      hover:shadow-xl hover:shadow-red-600/40
      hover:scale-105 active:scale-95
    `,
    ghost: `
      bg-transparent hover:bg-[#1a1333]/50
      text-gray-300 hover:text-white
      hover:scale-105 active:scale-95
    `,
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

