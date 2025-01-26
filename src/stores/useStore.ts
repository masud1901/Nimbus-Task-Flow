import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Project, Task, TodoItem } from '@/types/database'

interface CreateTaskParams {
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  remindersEnabled?: boolean;
  createdBy: string;
}

interface Store {
  projects: Project[]
  tasks: Task[]
  loading: boolean
  fetchProjects: () => Promise<void>
  fetchTasks: (projectId: string) => Promise<void>
  createProject: (name: string, description: string | undefined, owner_id: string | undefined) => Promise<void>
  createTask: (params: CreateTaskParams) => Promise<void>
  toggleTaskComplete: (taskId: string) => Promise<void>
  todos: TodoItem[]
  fetchTodos: (taskId: string) => Promise<void>
  addTodo: (taskId: string, content: string, priority: string) => Promise<void>
  toggleTodo: (todoId: string) => Promise<void>
  updateTodoOrder: (todoId: string, newIndex: number) => Promise<void>
}

export const useStore = create<Store>((set, get) => ({
  projects: [],
  tasks: [],
  loading: false,
  todos: [],
  
  fetchProjects: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching projects:', error)
      set({ loading: false })
      return
    }
    if (data) {
      console.log('Fetched projects:', data)
      set({ projects: data })
    }
    set({ loading: false })
  },
  
  fetchTasks: async (projectId) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data) set({ tasks: data })
    set({ loading: false })
  },
  
  createProject: async (name, description, owner_id) => {
    if (!owner_id) throw new Error('User not authenticated')
    
    const { error } = await supabase
      .from('projects')
      .insert([{ name, description, owner_id }])
    if (error) throw error
  },
  
  createTask: async (params) => {
    const { error } = await supabase
      .from('tasks')
      .insert([{
        project_id: params.projectId,
        title: params.title,
        description: params.description || null,
        due_date: params.dueDate || null,
        priority: params.priority || 'medium',
        reminder_enabled: params.remindersEnabled,
        created_by: params.createdBy,
        completed: false,
        created_at: new Date().toISOString(),
      }]);
    
    if (error) {
      console.error('Task creation error:', error);
      throw error;
    }

    // Update local tasks
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', params.projectId)
      .order('created_at', { ascending: false });

    if (data) {
      set({ tasks: data });
    }
  },

  toggleTaskComplete: async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);
    
    if (error) throw error;
  },
  
  fetchTodos: async (taskId) => {
    const { data, error } = await supabase
      .from('todo_items')
      .select('*')
      .eq('task_id', taskId)
      .order('order_index');
    
    if (error) throw error;
    if (data) set({ todos: data });
  },

  addTodo: async (taskId, content, priority) => {
    const { data: todos } = await supabase
      .from('todo_items')
      .select('order_index')
      .eq('task_id', taskId)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextIndex = todos?.[0]?.order_index + 1 || 0;

    const { error } = await supabase
      .from('todo_items')
      .insert([{
        task_id: taskId,
        content,
        priority,
        order_index: nextIndex,
      }]);

    if (error) throw error;
    get().fetchTodos(taskId);
  },

  toggleTodo: async (todoId) => {
    const { error } = await supabase
      .from('todo_items')
      .update({ completed: true })
      .eq('id', todoId);

    if (error) throw error;
  },

  updateTodoOrder: async (todoId, newIndex) => {
    const { error } = await supabase
      .from('todo_items')
      .update({ order_index: newIndex })
      .eq('id', todoId);

    if (error) throw error;
  },
})) 