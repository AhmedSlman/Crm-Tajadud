type ProgressBarProps = {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function ProgressBar({ 
  progress, 
  showLabel = false, 
  size = 'md',
  className = '' 
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const getColor = (value: number) => {
    if (value >= 75) return 'from-green-500 to-emerald-500';
    if (value >= 50) return 'from-[#563EB7] to-[#7c5fdc]';
    if (value >= 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getGlowColor = (value: number) => {
    if (value >= 75) return 'shadow-green-500/50';
    if (value >= 50) return 'shadow-[#563EB7]/50';
    if (value >= 25) return 'shadow-yellow-500/50';
    return 'shadow-red-500/50';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-medium">Progress</span>
          <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
      )}
      <div className={`relative w-full bg-[#1a1333] rounded-full overflow-hidden ${heights[size]} shadow-inner`}>
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Progress fill */}
        <div
          className={`
            relative ${heights[size]} 
            bg-gradient-to-r ${getColor(progress)}
            rounded-full
            transition-all duration-700 ease-out
            shadow-lg ${getGlowColor(progress)}
          `}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 2s infinite'
               }}
          />
        </div>
      </div>
    </div>
  );
}

