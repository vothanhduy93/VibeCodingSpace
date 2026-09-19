import React, { useEffect, useState } from 'react';
import { X, Flame, Clock, CheckCircle2, BarChart2, Calendar } from 'lucide-react';
import { api } from '@/services/apiClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePomodoroStore } from '@/stores/usePomodoroStore';
import { useTranslation } from '@/stores/useLanguageStore';

interface FocusHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HeatmapDay {
  date: string;
  count: number;
  minutes: number;
}

interface AnalyticsStats {
  totalMinutes: number;
  totalSessions: number;
  streakDays: number;
  heatmap: HeatmapDay[];
}

export const FocusHeatmapModal: React.FC<FocusHeatmapModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { totalSessionsCompleted } = usePomodoroStore();

  const [stats, setStats] = useState<AnalyticsStats>({
    totalMinutes: totalSessionsCompleted * 25,
    totalSessions: totalSessionsCompleted,
    streakDays: totalSessionsCompleted > 0 ? 1 : 0,
    heatmap: [],
  });
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // If authenticated, fetch from backend analytics API
    if (isAuthenticated) {
      api
        .get('/api/v1/analytics/stats')
        .then((res) => {
          if (res && res.stats) {
            setStats(res.stats);
          }
        })
        .catch(() => {
          // fallback to local store
        });
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Generate a 12-week grid (84 days) leading up to today
  const gridDays: { dateStr: string; dayData: HeatmapDay }[] = [];
  const heatmapMap = new Map<string, HeatmapDay>();
  for (const h of stats.heatmap) {
    heatmapMap.set(h.date, h);
  }

  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayData = heatmapMap.get(dateStr) || { date: dateStr, count: 0, minutes: 0 };
    gridDays.push({ dateStr, dayData });
  }

  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) return 'bg-slate-100 hover:border-slate-300';
    if (minutes <= 25) return 'bg-emerald-200 hover:bg-emerald-300';
    if (minutes <= 50) return 'bg-emerald-300 hover:bg-emerald-400';
    if (minutes <= 100) return 'bg-emerald-400 hover:bg-emerald-500';
    return 'bg-emerald-600 hover:bg-emerald-700';
  };

  const hoursDisplay = (stats.totalMinutes / 60).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-7 shadow-2xl shadow-purple-900/10 text-zen-slate animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zen-muted hover:text-zen-slate hover:bg-slate-100/80 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline font-extrabold text-lg text-zen-slate tracking-tight">
              {t.analytics.title}
            </h2>
            <p className="text-xs text-zen-muted">{t.analytics.subtitle}</p>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-xl bg-purple-100 text-primary flex items-center justify-center mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-zen-muted font-medium">{t.analytics.totalHours}</span>
            <span className="font-headline font-black text-lg text-zen-slate mt-0.5">
              {hoursDisplay} <span className="text-xs font-normal text-zen-muted">{t.analytics.hours}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-zen-muted font-medium">{t.analytics.totalSessions}</span>
            <span className="font-headline font-black text-lg text-zen-slate mt-0.5">
              {stats.totalSessions}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-xs flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-zen-muted font-medium">{t.analytics.streak}</span>
            <span className="font-headline font-black text-lg text-zen-slate mt-0.5">
              {stats.streakDays} <span className="text-xs font-normal text-zen-muted">{t.analytics.days}</span>
            </span>
          </div>
        </div>

        {/* Activity Heatmap Grid */}
        <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zen-slate">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.analytics.heatmapTitle}</span>
            </div>
            {hoveredDay && (
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                {hoveredDay.date}: {hoveredDay.minutes} {t.analytics.minutes} ({hoveredDay.count} sessions)
              </span>
            )}
          </div>

          {/* 12 columns x 7 rows grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-center">
            {gridDays.map(({ dateStr, dayData }) => (
              <div
                key={dateStr}
                onMouseEnter={() => setHoveredDay(dayData)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-xs cursor-pointer transition-transform hover:scale-125 border border-transparent ${getHeatmapColor(
                  dayData.minutes
                )}`}
                title={`${dateStr}: ${dayData.minutes} mins (${dayData.count} sessions)`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-zen-muted">
            <span>{t.analytics.less}</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-slate-100" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
            <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
            <span>{t.analytics.more}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
