import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  accent?: 'purple' | 'cyan' | 'amber' | 'emerald';
  label?: string;
  valueDisplay?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const GlassSlider: React.FC<GlassSliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  accent = 'purple',
  label,
  valueDisplay,
  icon,
  disabled = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const accentColors = {
    purple: 'from-purple-600 to-indigo-600',
    cyan: 'from-sky-500 to-cyan-500',
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
  };

  const thumbColors = {
    purple: 'border-purple-600 shadow-purple-600/30',
    cyan: 'border-sky-500 shadow-sky-500/30',
    amber: 'border-amber-500 shadow-amber-500/30',
    emerald: 'border-emerald-500 shadow-emerald-500/30',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || valueDisplay !== undefined || icon) && (
        <div className="flex items-center justify-between text-xs font-medium text-zen-slate select-none">
          <div className="flex items-center gap-2">
            {icon && <span className="text-zen-muted">{icon}</span>}
            {label && <span>{label}</span>}
          </div>
          {valueDisplay !== undefined && (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-zen-body border border-slate-200/60">
              {valueDisplay}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full h-6 flex items-center group cursor-pointer">
        {/* Track background */}
        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden relative border border-slate-300/40">
          {/* Active fill */}
          <div
            className={cn(
              'h-full bg-gradient-to-r rounded-full transition-all duration-75',
              accentColors[accent]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real input range hidden on top */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        {/* Custom Visible Thumb */}
        <div
          className={cn(
            'absolute w-4 h-4 rounded-full bg-white border-2 shadow-md transition-transform duration-75 pointer-events-none group-hover:scale-125 -translate-x-1/2',
            thumbColors[accent]
          )}
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
