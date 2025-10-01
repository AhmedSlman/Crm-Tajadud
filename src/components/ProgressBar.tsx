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
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColor = (value: number) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-[#563EB7]';
    if (value >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1a1333] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${getColor(progress)} transition-all duration-300 rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

