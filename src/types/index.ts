export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: {
    [key: string]: {
      role: 'owner' | 'member';
      joinedAt: Date;
    };
  };
  peakHours: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'archived';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
  };
  projects: string[];
} 