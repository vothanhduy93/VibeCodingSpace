import React, { useState } from 'react';
import { Command, Search, Timer, Music, Compass } from 'lucide-react';
import { GlassModal, GlassButton } from '@/components/ui';
import { useTranslation } from '@/stores/useLanguageStore';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  key: string;
  name: string;
  description: string;
  category: 'timer' | 'audio' | 'nav';
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const shortcuts: ShortcutItem[] = [
    {
      key: 'Space',
      name: t.shortcuts.spaceTitle,
      description: t.shortcuts.spaceDesc,
      category: 'timer',
    },
    {
      key: 'R',
      name: t.shortcuts.rTitle,
      description: t.shortcuts.rDesc,
      category: 'timer',
    },
    {
      key: 'S',
      name: t.shortcuts.sTitle,
      description: t.shortcuts.sDesc,
      category: 'timer',
    },
    {
      key: 'M',
      name: t.shortcuts.mTitle,
      description: t.shortcuts.mDesc,
      category: 'audio',
    },
    {
      key: 'P',
      name: t.shortcuts.pTitle,
      description: t.shortcuts.pDesc,
      category: 'audio',
    },
    {
      key: 'W',
      name: t.shortcuts.wTitle,
      description: t.shortcuts.wDesc,
      category: 'audio',
    },
    {
      key: 'T',
      name: t.shortcuts.tTitle,
      description: t.shortcuts.tDesc,
      category: 'nav',
    },
    {
      key: 'F',
      name: t.shortcuts.fTitle,
      description: t.shortcuts.fDesc,
      category: 'nav',
    },
    {
      key: '?',
      name: t.shortcuts.questionTitle,
      description: t.shortcuts.questionDesc,
      category: 'nav',
    },
    {
      key: 'Esc',
      name: t.shortcuts.escTitle,
      description: t.shortcuts.escDesc,
      category: 'nav',
    },
  ];

  const filteredShortcuts = shortcuts.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timerShortcuts = filteredShortcuts.filter((s) => s.category === 'timer');
  const audioShortcuts = filteredShortcuts.filter((s) => s.category === 'audio');
  const navShortcuts = filteredShortcuts.filter((s) => s.category === 'nav');

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      icon={<Command className="w-5 h-5 text-primary" />}
      title={
        <div className="flex items-center gap-2">
          <span>{t.shortcuts.title}</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
            {t.shortcuts.proBadge}
          </span>
        </div>
      }
      subtitle={t.shortcuts.subtitle}
    >
      <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
        {/* Search Bar */}
        <div className="relative flex items-center bg-white/90 border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-xs">
          <Search className="w-4 h-4 text-zen-muted mr-2" />
          <input
            type="text"
            placeholder={t.shortcuts.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs text-zen-slate placeholder:text-zen-subtle bg-transparent focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          {/* Timer Shortcuts */}
          {timerShortcuts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zen-slate">
                <Timer className="w-3.5 h-3.5 text-sky-500" />
                <span>{t.shortcuts.sectionTimer}</span>
              </div>
              <div className="flex flex-col gap-2">
                {timerShortcuts.map((s) => (
                  <ShortcutRow key={s.key} item={s} />
                ))}
              </div>
            </div>
          )}

          {/* Audio Shortcuts */}
          {audioShortcuts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zen-slate">
                <Music className="w-3.5 h-3.5 text-primary" />
                <span>{t.shortcuts.sectionAudio}</span>
              </div>
              <div className="flex flex-col gap-2">
                {audioShortcuts.map((s) => (
                  <ShortcutRow key={s.key} item={s} />
                ))}
              </div>
            </div>
          )}

          {/* Navigation Shortcuts */}
          {navShortcuts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zen-slate">
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.shortcuts.sectionNav}</span>
              </div>
              <div className="flex flex-col gap-2">
                {navShortcuts.map((s) => (
                  <ShortcutRow key={s.key} item={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs text-zen-muted">
          <span>{t.shortcuts.proTip}</span>
          <GlassButton variant="secondary" size="sm" onClick={onClose}>
            {t.shortcuts.gotIt}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};

const ShortcutRow: React.FC<{ item: ShortcutItem }> = ({ item }) => (
  <div className="glass-tier3 p-3 rounded-xl border border-slate-200/70 bg-white/75 flex items-center justify-between gap-3 hover:bg-white transition-colors">
    <div className="flex flex-col min-w-0">
      <span className="text-xs font-semibold text-zen-slate">{item.name}</span>
      <span className="text-[11px] text-zen-muted truncate">{item.description}</span>
    </div>
    <kbd className="keycap text-xs text-primary px-2.5 py-1 rounded-lg min-w-[32px] text-center shadow-xs">
      {item.key}
    </kbd>
  </div>
);
