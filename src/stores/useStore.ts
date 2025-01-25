import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Project, Task } from '@/types/database'

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
}

export const useStore = create<Store>((set) => ({
  projects: [],
  tasks: [],
  loading: false,
  
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
        description: params.description,
        due_date: params.dueDate,
        priority: params.priority,
        reminder_enabled: params.remindersEnabled,
        created_by: params.createdBy,
        status: 'pending'
      }]);
    
    if (error) throw error;
  },

  toggleTaskComplete: async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('id', taskId);
    
    if (error) throw error;
  }
})) 