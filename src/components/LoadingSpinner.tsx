export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-4 border-[#563EB7]/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-[#563EB7] rounded-full animate-spin" />
      </div>
    </div>
  );
}

