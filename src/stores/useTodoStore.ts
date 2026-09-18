import { create } from 'zustand';

export type PriorityLevel = 'high' | 'normal' | 'low';

export interface TodoItem {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: PriorityLevel;
  estimatedPomodoros?: number;
  completedAt?: string;
  createdAt: string;
}

interface TodoState {
  todos: TodoItem[];
  archivedTodos: TodoItem[];
  lastActiveDate: string; // YYYY-MM-DD

  // Actions
  addTodo: (title: string, priority?: PriorityLevel, estimatedPomodoros?: number) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  checkSmartRollover: () => boolean; // returns true if rollover occurred
}

const STORAGE_KEY = 'vibespace_v1_todos';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const INITIAL_TODOS: TodoItem[] = [
  {
    id: '1',
    title: 'Hoàn thiện hệ thống thiết kế VibeSpace Light Mode & Thủy tinh mờ',
    isCompleted: false,
    priority: 'high',
    estimatedPomodoros: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Tối ưu vòng lặp Web Audio Gapless Loop AudioBuffer',
    isCompleted: false,
    priority: 'normal',
    estimatedPomodoros: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Khởi động phiên tập trung Pomodoro 25 phút chuyên sâu',
    isCompleted: false,
    priority: 'normal',
    estimatedPomodoros: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Phác thảo tài liệu kiến trúc kỹ thuật SDLC v1.2',
    isCompleted: true,
    priority: 'normal',
    completedAt: '09:30',
    createdAt: new Date().toISOString(),
  },
];

function loadStoredTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load todos from localStorage', e);
  }
  return null;
}

const savedData = loadStoredTodos();

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: savedData?.todos || INITIAL_TODOS,
  archivedTodos: savedData?.archivedTodos || [],
  lastActiveDate: savedData?.lastActiveDate || getTodayDateString(),

  addTodo: (title: string, priority: PriorityLevel = 'normal', estimatedPomodoros = 1) => {
    if (!title.trim()) return;

    const newTodo: TodoItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim(),
      isCompleted: false,
      priority,
      estimatedPomodoros,
      createdAt: new Date().toISOString(),
    };

    set({ todos: [newTodo, ...get().todos] });
    saveTodoState(get());
  },

  toggleTodo: (id: string) => {
    const todos = get().todos.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextCompleted,
          completedAt: nextCompleted
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      }
      return t;
    });

    set({ todos });
    saveTodoState(get());
  },

  deleteTodo: (id: string) => {
    set({ todos: get().todos.filter((t) => t.id !== id) });
    saveTodoState(get());
  },

  clearCompleted: () => {
    const { todos, archivedTodos } = get();
    const completed = todos.filter((t) => t.isCompleted);
    const pending = todos.filter((t) => !t.isCompleted);

    const newArchived = [...completed, ...archivedTodos].slice(0, 100);

    set({
      todos: pending,
      archivedTodos: newArchived,
    });
    saveTodoState(get());
  },

  /**
   * Smart Rollover Algorithm:
   * When user opens app on a new day (after midnight 00:00 local time),
   * automatically moves completed items to Archive, while preserving all pending tasks!
   */
  checkSmartRollover: () => {
    const today = getTodayDateString();
    const { lastActiveDate, todos, archivedTodos } = get();

    if (today !== lastActiveDate) {
      const completed = todos.filter((t) => t.isCompleted);
      const pending = todos.filter((t) => !t.isCompleted);
      const updatedArchived = [...completed, ...archivedTodos].slice(0, 100);

      set({
        todos: pending,
        archivedTodos: updatedArchived,
        lastActiveDate: today,
      });
      saveTodoState(get());
      return true;
    }
    return false;
  },
}));

function saveTodoState(state: TodoState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        todos: state.todos,
        archivedTodos: state.archivedTodos,
        lastActiveDate: state.lastActiveDate,
      })
    );
  } catch (e) {
    console.error('Failed to save todos to localStorage', e);
  }
}
