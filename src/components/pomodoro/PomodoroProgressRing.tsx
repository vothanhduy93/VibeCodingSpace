import React from 'react';

interface PomodoroProgressRingProps {
  progress: number; // 0 to 1 (fraction completed)
  size?: number; // diameter in pixels
  strokeWidth?: number;
  children?: React.ReactNode;
}

export const PomodoroProgressRing: React.FC<PomodoroProgressRingProps> = ({
  progress,
  size = 240,
  strokeWidth = 8,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Stroke dash offset calculation
  const strokeDashoffset = circumference - Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full -rotate-90 transform"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="zenProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(226, 232, 240, 0.7)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Dynamic Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#zenProgressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>

      {/* Center content (Digits & labels) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
