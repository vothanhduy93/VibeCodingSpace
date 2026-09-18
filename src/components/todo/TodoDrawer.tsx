import React, { useState } from 'react';
import { CheckSquare, X, Zap, CornerDownLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui';
import { useTodoStore, PriorityLevel } from '@/stores/useTodoStore';
import { useTranslation } from '@/stores/useLanguageStore';
import { TodoItemRow } from './TodoItemRow';
import { TodoArchiveView } from './TodoArchiveView';

interface TodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodoDrawer: React.FC<TodoDrawerProps> = ({ isOpen, onClose }) => {
  const { todos, archivedTodos, addTodo, clearCompleted } = useTodoStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'today' | 'archive'>('today');
  const [taskInput, setTaskInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>('normal');

  const pendingCount = todos.filter((t) => !t.isCompleted).length;
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      addTodo(taskInput.trim(), selectedPriority);
      setTaskInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Container (Glass Tier 2) */}
      <div className="relative w-[420px] max-w-[90vw] h-full glass-tier2 border-l border-white/95 shadow-glass-panel flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-250">
        {/* Header & Tabs */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-lg text-zen-slate">
                    {t.todo.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold">
                    {t.todo.leftCount(pendingCount)}
                  </span>
                </div>
                <p className="text-xs text-zen-muted mt-0.5">
                  {t.todo.subtitle}
                </p>
              </div>
            </div>

            <GlassButton
              variant="icon"
              size="icon"
              onClick={onClose}
              aria-label={t.common.close}
              className="text-zen-muted hover:text-zen-slate"
            >
              <X className="w-4 h-4" />
            </GlassButton>
          </div>

          {/* Segmented View Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2 mb-4">
            <button
              onClick={() => setActiveTab('today')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-zen-muted hover:text-zen-slate hover:bg-white/60'
              }`}
            >
              {t.todo.tabToday(todos.length)}
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-zen-muted hover:text-zen-slate hover:bg-white/60'
              }`}
            >
              {t.todo.tabArchive(archivedTodos.length)}
            </button>
          </div>

          {/* Quick Add Input (Only on Today tab) */}
          {activeTab === 'today' && (
            <form onSubmit={handleAddTask} className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 bg-white/90 border border-slate-200/80 rounded-2xl px-3.5 py-2 shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <input
                  type="text"
                  placeholder={t.todo.inputPlaceholder}
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="flex-1 text-xs text-zen-slate placeholder:text-zen-subtle bg-transparent focus:outline-none"
                />
                <span className="keycap text-[10px] text-purple-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" />
                  Enter
                </span>
              </div>

              {/* Priority Pills for new task */}
              <div className="flex items-center gap-1.5 pl-1">
                <span className="text-[10px] text-zen-muted">{t.todo.priorityLabel}</span>
                {(['high', 'normal', 'low'] as PriorityLevel[]).map((p) => {
                  const label =
                    p === 'high'
                      ? t.todo.priorityHigh
                      : p === 'normal'
                      ? t.todo.priorityNormal
                      : t.todo.priorityLow;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPriority(p)}
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize cursor-pointer transition-colors ${
                        selectedPriority === p
                          ? 'bg-zen-slate text-white'
                          : 'bg-slate-100 text-zen-muted hover:text-zen-slate'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </form>
          )}

          {/* Smart Rollover Callout Banner */}
          <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-2.5 text-xs text-purple-900 shadow-xs mb-3">
            <Zap className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-[11px] leading-tight">
              {t.todo.smartRolloverBanner}
            </span>
          </div>
        </div>

        {/* Task List or Archive View */}
        <div className="flex-1 my-2 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {activeTab === 'today' ? (
            todos.length === 0 ? (
              <div className="p-8 text-center text-zen-muted text-xs">
                {t.todo.emptyTasks}
              </div>
            ) : (
              todos.map((todo) => <TodoItemRow key={todo.id} todo={todo} />)
            )
          ) : (
            <TodoArchiveView />
          )}
        </div>

        {/* Footer: Progress Meter & Action */}
        <div className="pt-3 border-t border-slate-200/70 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-zen-slate font-semibold">
            <span>
              {t.todo.progressCompleted(completedCount, totalCount, progressPercent)}
            </span>
            <span className="font-mono text-primary">{progressPercent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {completedCount > 0 && activeTab === 'today' && (
            <div className="flex justify-end pt-1">
              <button
                onClick={clearCompleted}
                className="text-[11px] font-medium text-zen-muted hover:text-rose-600 transition-colors cursor-pointer"
              >
                {t.todo.archiveDoneAction(completedCount)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
