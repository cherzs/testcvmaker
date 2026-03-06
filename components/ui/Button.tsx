'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500': variant === 'secondary',
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
          'px-3 py-1.5 text-sm rounded': size === 'sm',
          'px-4 py-2 text-sm rounded-md': size === 'md',
          'px-6 py-2.5 text-base rounded-md': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
