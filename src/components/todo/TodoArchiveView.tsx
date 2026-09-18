import React from 'react';
import { Archive, CheckCircle2 } from 'lucide-react';
import { useTodoStore } from '@/stores/useTodoStore';

export const TodoArchiveView: React.FC = () => {
  const { archivedTodos } = useTodoStore();

  if (archivedTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zen-muted">
        <Archive className="w-8 h-8 stroke-1 text-slate-300 mb-2" />
        <p className="text-xs font-medium">No archived tasks yet</p>
        <p className="text-[11px] text-zen-subtle mt-1">
          Completed tasks auto-archive at midnight
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
      {archivedTodos.map((todo) => (
        <div
          key={todo.id}
          className="glass-tier3 p-3 rounded-xl border border-slate-200/50 bg-white/60 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-zen-body truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{todo.title}</span>
          </div>
          {todo.completedAt && (
            <span className="text-[10px] text-zen-muted whitespace-nowrap font-mono">
              {todo.completedAt}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
