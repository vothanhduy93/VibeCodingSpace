import React, { useState } from 'react';
import { Command, Search, Timer, Music, Compass } from 'lucide-react';
import { GlassModal, GlassButton } from '@/components/ui';

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

const SHORTCUTS: ShortcutItem[] = [
  {
    key: 'Space',
    name: 'Play / Pause Pomodoro Timer',
    description: 'Instant toggle focus session countdown',
    category: 'timer',
  },
  {
    key: 'R',
    name: 'Reset Current Pomodoro',
    description: 'Restores cycle back to default interval',
    category: 'timer',
  },
  {
    key: 'S',
    name: 'Skip Session / Break',
    description: 'Jump straight into next working or rest phase',
    category: 'timer',
  },
  {
    key: 'M',
    name: 'Master Mute / Unmute Audio',
    description: 'Silences ambient rain, lofi, and white noise',
    category: 'audio',
  },
  {
    key: 'P',
    name: 'Open Sound Mixer Drawer',
    description: 'Fine-tune binaural beats & environmental audio',
    category: 'audio',
  },
  {
    key: 'W',
    name: 'Open Wallpaper Switcher',
    description: 'Switch between sunlit mountains, study & rain',
    category: 'audio',
  },
  {
    key: 'T',
    name: 'Open Daily Todo Drawer',
    description: 'Slide out checklist & daily priority tasks',
    category: 'nav',
  },
  {
    key: 'F',
    name: 'Toggle Zen Fullscreen Mode',
    description: 'Hide browser chrome for deep immersion',
    category: 'nav',
  },
  {
    key: '?',
    name: 'Toggle This Cheat Sheet',
    description: 'Quickly display or dismiss keyboard shortcuts',
    category: 'nav',
  },
  {
    key: 'Esc',
    name: 'Close Any Open Panel',
    description: 'Dismiss modal, dialog or slideover drawer',
    category: 'nav',
  },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShortcuts = SHORTCUTS.filter(
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
          <span>Keyboard Shortcuts</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
            Pro Flow
          </span>
        </div>
      }
      subtitle="Navigate your zen space with zero mouse friction"
    >
      <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
        {/* Search Bar */}
        <div className="relative flex items-center bg-white/90 border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-xs">
          <Search className="w-4 h-4 text-zen-muted mr-2" />
          <input
            type="text"
            placeholder="Filter shortcuts (e.g. Timer, Sound, Fullscreen)..."
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
                <span>Timer & Focus Controls</span>
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
                <span>Audio & Atmosphere</span>
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
                <span>Workspace Navigation</span>
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
          <span>Pro tip: Press &apos;?&apos; anytime to show or hide this cheat sheet</span>
          <GlassButton variant="secondary" size="sm" onClick={onClose}>
            Got it
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
