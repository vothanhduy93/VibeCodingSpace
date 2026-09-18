import React, { useState } from 'react';
import { Settings2, Save } from 'lucide-react';
import { GlassModal, GlassButton, GlassSlider } from '@/components/ui';
import { usePomodoroStore } from '@/stores/usePomodoroStore';

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroSettingsModal: React.FC<PomodoroSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings } = usePomodoroStore();

  const [focusTime, setFocusTime] = useState(settings.focusDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreakDuration);
  const [longBreak, setLongBreak] = useState(settings.longBreakDuration);
  const [autoBreaks, setAutoBreaks] = useState(settings.autoStartBreaks);
  const [autoPomodoros, setAutoPomodoros] = useState(settings.autoStartPomodoros);

  const handleSave = () => {
    updateSettings({
      focusDuration: focusTime,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
      autoStartBreaks: autoBreaks,
      autoStartPomodoros: autoPomodoros,
    });
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      icon={<Settings2 className="w-5 h-5 text-primary" />}
      title="Pomodoro Preferences"
      subtitle="Customize your focus & break intervals"
    >
      <div className="flex flex-col gap-6">
        {/* Sliders */}
        <div className="glass-tier3 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col gap-4">
          <GlassSlider
            label="Focus Interval"
            value={focusTime}
            min={1}
            max={60}
            step={1}
            valueDisplay={`${focusTime} min`}
            onChange={setFocusTime}
            accent="purple"
          />

          <GlassSlider
            label="Short Break Interval"
            value={shortBreak}
            min={1}
            max={30}
            step={1}
            valueDisplay={`${shortBreak} min`}
            onChange={setShortBreak}
            accent="cyan"
          />

          <GlassSlider
            label="Long Break Interval"
            value={longBreak}
            min={1}
            max={45}
            step={1}
            valueDisplay={`${longBreak} min`}
            onChange={setLongBreak}
            accent="emerald"
          />
        </div>

        {/* Automation Toggles */}
        <div className="glass-tier3 p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
          <label className="flex items-center justify-between text-xs font-medium text-zen-slate cursor-pointer">
            <span>Auto-start Breaks</span>
            <input
              type="checkbox"
              checked={autoBreaks}
              onChange={(e) => setAutoBreaks(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
            />
          </label>

          <label className="flex items-center justify-between text-xs font-medium text-zen-slate cursor-pointer">
            <span>Auto-start Pomodoros</span>
            <input
              type="checkbox"
              checked={autoPomodoros}
              onChange={(e) => setAutoPomodoros(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
          <GlassButton variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-1.5"
            glow
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
