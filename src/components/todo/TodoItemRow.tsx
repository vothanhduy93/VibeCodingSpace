import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { TodoItem, useTodoStore } from '@/stores/useTodoStore';

interface TodoItemRowProps {
  todo: TodoItem;
}

export const TodoItemRow: React.FC<TodoItemRowProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore();

  const priorityBadges = {
    high: 'bg-amber-50 text-amber-700 border-amber-200/70',
    normal: 'bg-slate-100 text-slate-600 border-slate-200/60',
    low: 'bg-sky-50 text-sky-700 border-sky-200/70',
  };

  return (
    <div
      className={`group glass-tier3 rounded-2xl p-3.5 border transition-all duration-200 flex items-start justify-between gap-3 ${
        todo.isCompleted
          ? 'bg-white/60 border-slate-200/50 opacity-75'
          : 'bg-white/85 hover:bg-white border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Checkbox & Content */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Custom Circular Checkbox */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0 ${
            todo.isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 hover:border-primary group-hover:bg-slate-50'
          }`}
          aria-label={todo.isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* Text & Meta */}
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className={`text-xs sm:text-sm font-medium transition-all ${
              todo.isCompleted
                ? 'line-through text-slate-400'
                : 'text-zen-slate'
            }`}
          >
            {todo.title}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Tag */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                priorityBadges[todo.priority]
              }`}
            >
              {todo.priority}
            </span>

            {/* Pomodoro Estimate */}
            {todo.estimatedPomodoros && (
              <span className="text-[10px] text-zen-muted font-mono">
                {todo.estimatedPomodoros} 🍅
              </span>
            )}

            {/* Completed Time */}
            {todo.completedAt && (
              <span className="text-[10px] text-emerald-600 font-medium">
                Done at {todo.completedAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Action on hover */}
      <button
        onClick={() => deleteTodo(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-zen-subtle hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all cursor-pointer flex-shrink-0"
        title="Delete task"
        aria-label="Delete task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
