import React, { useState } from 'react';
import { Sparkles, Sun, Eye, Undo2, Check, UploadCloud } from 'lucide-react';
import { GlassModal, GlassButton, GlassSlider } from '@/components/ui';
import {
  useBackgroundStore,
  DEFAULT_WALLPAPERS,
  WallpaperPreset,
} from '@/stores/useBackgroundStore';
import { useTranslation } from '@/stores/useLanguageStore';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentWallpaper,
    customUrl,
    overlayOpacity,
    blurAmount,
    setWallpaper,
    setCustomUrl,
    setOverlayOpacity,
    setBlurAmount,
    resetDefaults,
  } = useBackgroundStore();
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customInput, setCustomInput] = useState<string>(customUrl || '');

  const categories = [
    { id: 'all', label: t.wallpaper.categories.all },
    { id: 'nature', label: t.wallpaper.categories.nature },
    { id: 'minimal', label: t.wallpaper.categories.minimal },
    { id: 'rain', label: t.wallpaper.categories.rain },
    { id: 'cozy', label: t.wallpaper.categories.cozy },
  ];

  const filteredWallpapers =
    activeCategory === 'all'
      ? DEFAULT_WALLPAPERS
      : DEFAULT_WALLPAPERS.filter((wp) => wp.category === activeCategory);

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setCustomUrl(customInput.trim());
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      icon={<Sparkles className="w-5 h-5 text-primary" />}
      title={t.wallpaper.title}
      subtitle={t.wallpaper.subtitle}
    >
      <div className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-white/80 text-zen-body hover:bg-white border border-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Thumbnail Grid */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zen-muted mb-3">
            {t.wallpaper.curatedPresetsTitle}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredWallpapers.map((wp: WallpaperPreset) => {
              const isSelected = !customUrl && currentWallpaper.id === wp.id;
              return (
                <div
                  key={wp.id}
                  onClick={() => setWallpaper(wp)}
                  className={`group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 shadow-sm ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/40 scale-[1.02] shadow-md'
                      : 'border-slate-200/80 hover:border-slate-300 hover:scale-[1.01]'
                  }`}
                >
                  <img
                    src={wp.thumbnailUrl}
                    alt={wp.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

                  {/* Top Badge */}
                  {wp.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-zen-slate font-mono text-[10px] font-bold shadow-sm">
                      {wp.badge}
                    </span>
                  )}

                  {/* Active Checkmark */}
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}

                  {/* Name Label */}
                  <span className="absolute bottom-2 left-2 right-2 text-white font-medium text-xs truncate">
                    {wp.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Wallpaper Input */}
        <div className="glass-tier3 p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-zen-slate">
            <UploadCloud className="w-4 h-4 text-primary" />
            <span>{t.wallpaper.customUrlTitle}</span>
          </div>
          <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
            <input
              type="url"
              placeholder={t.wallpaper.customUrlPlaceholder}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-zen-slate placeholder:text-zen-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <GlassButton type="submit" size="sm" variant="primary">
              {t.wallpaper.setUrlButton}
            </GlassButton>
          </form>
        </div>

        {/* Atmosphere Adjustment Sliders */}
        <div className="glass-tier3 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col gap-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zen-muted">
            {t.wallpaper.atmosphereTitle}
          </h4>

          {/* Daylight Dimmer / Overlay */}
          <GlassSlider
            label={t.wallpaper.daylightDimmer}
            icon={<Sun className="w-4 h-4 text-amber-500" />}
            value={overlayOpacity}
            min={0}
            max={70}
            step={1}
            valueDisplay={`${overlayOpacity}${t.wallpaper.softLightSuffix}`}
            onChange={setOverlayOpacity}
            accent="purple"
          />

          {/* Background Blur */}
          <GlassSlider
            label={t.wallpaper.backgroundBlur}
            icon={<Eye className="w-4 h-4 text-sky-500" />}
            value={blurAmount}
            min={0}
            max={20}
            step={1}
            valueDisplay={`${blurAmount}${t.wallpaper.focusSuffix}`}
            onChange={setBlurAmount}
            accent="cyan"
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={resetDefaults}
            className="text-xs text-zen-muted hover:text-zen-slate flex items-center gap-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" />
            {t.wallpaper.resetDefaults}
          </GlassButton>

          <div className="flex items-center gap-2">
            <GlassButton variant="primary" size="sm" onClick={onClose} glow>
              {t.common.done}
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
