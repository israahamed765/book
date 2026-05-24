export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: boolean;
  category?: string;
  date: string; // 'YYYY-MM-DD'
  time?: string; // e.g., '10:00 AM'
}

export interface ScheduleItem {
  id: string;
  time: string; // "07:00 AM", "09:00 AM", etc.
  title: string;
  subtitle: string;
  category: 'meditation' | 'work' | 'sync' | 'break' | 'custom';
  date: string; // 'YYYY-MM-DD'
}

export interface Habit {
  id: string;
  name: string;
  icon: string; // Lucide icon name, e.g., "Droplets", "Footprints", "BookOpen", "Flower2"
  count: number;
  target: number;
  unit: string;
  colorClass: string;
}

export interface ProgressStats {
  completed: number;
  total: number;
}

export interface QuickNote {
  text: string;
  labels: string[];
}
