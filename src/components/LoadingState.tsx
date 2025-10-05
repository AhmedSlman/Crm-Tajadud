interface LoadingStateProps {
  message?: string;
  title?: string;
  subtitle?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  title,
  subtitle 
}: LoadingStateProps) {
  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-400 text-lg">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner Component (للاستخدام في الأزرار)
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]} ${className}`}></div>
  );
}
