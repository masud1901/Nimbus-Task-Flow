export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  reminder_enabled: boolean;
  created_by: string;
  created_at: string;
}

export interface TodoItem {
  id: string;
  task_id: string;
  content: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  order_index: number;
  created_at: string;
} 