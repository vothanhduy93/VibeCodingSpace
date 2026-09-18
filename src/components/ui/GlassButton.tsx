import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  glow?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'secondary', size = 'md', glow = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] cursor-pointer';

    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg ' +
        (glow ? 'shadow-purple-glow' : 'shadow-primary/20'),
      secondary:
        'glass-tier3 text-zen-slate hover:bg-white/90 border border-slate-200/80 shadow-sm hover:border-slate-300',
      ghost:
        'bg-transparent text-zen-body hover:bg-white/60 hover:text-zen-slate',
      icon:
        'glass-tier3 text-zen-slate hover:bg-white/95 rounded-full border border-slate-200/80 shadow-sm hover:scale-105',
      danger:
        'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-2xl gap-2',
      lg: 'text-base px-7 py-3.5 rounded-full gap-2.5 font-semibold',
      icon: 'p-2.5 rounded-full aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
