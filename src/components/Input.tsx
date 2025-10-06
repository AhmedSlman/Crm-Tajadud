import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-[#1a1333] border ${
          error ? 'border-red-500' : 'border-[#563EB7]/20'
        } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7] transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-[#1a1333] border ${
          error ? 'border-red-500' : 'border-[#563EB7]/20'
        } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#563EB7] transition-colors resize-none ${className}`}
        {...props}
        value={props.value || ''}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

