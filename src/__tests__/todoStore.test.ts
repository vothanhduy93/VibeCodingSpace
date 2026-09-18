import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from '../stores/useTodoStore';

describe('useTodoStore & Smart Rollover Algorithm', () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      archivedTodos: [],
      lastActiveDate: '2026-09-17',
    });
  });

  it('should add a new todo item with correct priority and defaults', () => {
    const store = useTodoStore.getState();
    store.addTodo('Refactor Sound Synthesizer', 'high', 3);

    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Refactor Sound Synthesizer');
    expect(todos[0].priority).toBe('high');
    expect(todos[0].estimatedPomodoros).toBe(3);
    expect(todos[0].isCompleted).toBe(false);
  });

  it('should not add empty or whitespace-only todo', () => {
    useTodoStore.getState().addTodo('   ');
    expect(useTodoStore.getState().todos).toHaveLength(0);
  });

  it('should toggle todo completion state and record completedAt', () => {
    useTodoStore.getState().addTodo('Test Todo Item');
    const todoId = useTodoStore.getState().todos[0].id;

    // Toggle to completed
    useTodoStore.getState().toggleTodo(todoId);
    let item = useTodoStore.getState().todos[0];
    expect(item.isCompleted).toBe(true);
    expect(item.completedAt).toBeDefined();

    // Toggle back to incomplete
    useTodoStore.getState().toggleTodo(todoId);
    item = useTodoStore.getState().todos[0];
    expect(item.isCompleted).toBe(false);
    expect(item.completedAt).toBeUndefined();
  });

  it('should delete a todo item by id', () => {
    useTodoStore.getState().addTodo('Task 1');
    useTodoStore.getState().addTodo('Task 2');
    const task1Id = useTodoStore.getState().todos.find((t) => t.title === 'Task 1')!.id;

    useTodoStore.getState().deleteTodo(task1Id);

    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Task 2');
  });

  it('should clear completed todos to archived list', () => {
    useTodoStore.getState().addTodo('Pending Task');
    useTodoStore.getState().addTodo('Done Task');

    const doneTask = useTodoStore.getState().todos.find((t) => t.title === 'Done Task')!;
    useTodoStore.getState().toggleTodo(doneTask.id);

    useTodoStore.getState().clearCompleted();

    const { todos, archivedTodos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Pending Task');
    expect(archivedTodos).toHaveLength(1);
    expect(archivedTodos[0].title).toBe('Done Task');
  });

  describe('Smart Rollover Algorithm (Midnight Rollover Engine)', () => {
    it('should NOT rollover if today matches lastActiveDate', () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      useTodoStore.setState({
        lastActiveDate: todayStr,
        todos: [
          { id: '1', title: 'Task 1', isCompleted: true, priority: 'normal', createdAt: '' },
          { id: '2', title: 'Task 2', isCompleted: false, priority: 'high', createdAt: '' },
        ],
        archivedTodos: [],
      });

      const didRollover = useTodoStore.getState().checkSmartRollover();
      expect(didRollover).toBe(false);

      const { todos, archivedTodos } = useTodoStore.getState();
      expect(todos).toHaveLength(2);
      expect(archivedTodos).toHaveLength(0);
    });

    it('should archive completed tasks and preserve uncompleted tasks when day changes', () => {
      // Set yesterday's date
      useTodoStore.setState({
        lastActiveDate: '2026-09-17',
        todos: [
          { id: '1', title: 'Yesterday Completed Task A', isCompleted: true, priority: 'normal', createdAt: '' },
          { id: '2', title: 'Yesterday Unfinished Task B', isCompleted: false, priority: 'high', estimatedPomodoros: 3, createdAt: '' },
          { id: '3', title: 'Yesterday Completed Task C', isCompleted: true, priority: 'low', createdAt: '' },
        ],
        archivedTodos: [
          { id: 'old', title: 'Historical Task', isCompleted: true, priority: 'normal', createdAt: '' },
        ],
      });

      const didRollover = useTodoStore.getState().checkSmartRollover();
      expect(didRollover).toBe(true);

      const { todos, archivedTodos, lastActiveDate } = useTodoStore.getState();

      // Only unfinished task remains in active todos
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Yesterday Unfinished Task B');
      expect(todos[0].isCompleted).toBe(false);
      expect(todos[0].priority).toBe('high');

      // Completed tasks moved to archivedTodos
      expect(archivedTodos).toHaveLength(3);
      expect(archivedTodos.map((t) => t.title)).toContain('Yesterday Completed Task A');
      expect(archivedTodos.map((t) => t.title)).toContain('Yesterday Completed Task C');
      expect(archivedTodos.map((t) => t.title)).toContain('Historical Task');

      // Date updated
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      expect(lastActiveDate).toBe(todayStr);
    });
  });
});
