import { ReactNode } from 'react';
import Button from './Button';
import { Plus, Inbox } from 'lucide-react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="mb-6 p-6 bg-gradient-to-br from-[#563EB7]/10 to-[#7c5fdc]/10 rounded-full">
        {icon || <Inbox size={48} className="text-[#563EB7]" />}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          <Plus size={20} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

