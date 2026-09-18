import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassButton } from './GlassButton';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'lg',
  className,
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card (Glass Tier 2) */}
      <div
        className={cn(
          'relative w-full glass-tier2 rounded-3xl p-6 sm:p-8 shadow-glass-panel border border-white/95 z-10 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200',
          maxWidthStyles[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || icon) && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2.5 rounded-2xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-zen-slate">
                    {title}
                  </h3>
                )}
                {subtitle && <p className="text-xs text-zen-muted mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <GlassButton
              variant="icon"
              size="icon"
              onClick={onClose}
              className="text-zen-muted hover:text-zen-slate -mr-2 -mt-2"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </GlassButton>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
