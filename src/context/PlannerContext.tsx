


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Task, ScheduleItem, Habit, QuickNote } from '../types';

// interface FocusItem {
//   title: string;
//   isPriority: boolean;
//   duration: string;
//   completed: boolean;
// }

// interface UserProfile {
//   email: string;
//   name: string;
// }

// interface PlannerContextType {
//   // Navigation & Date Context
//   activeTab: 'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history';
//   setActiveTab: (tab: 'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history') => void;
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   currentDate: string; // 'YYYY-MM-DD'
//   setCurrentDate: (date: string) => void;
//   currentTime: string; // 'hh:mm AM/PM'
//   setCurrentTime: (time: string) => void;
//   virtualTimeConfigured: boolean;
//   setVirtualTimeConfigured: (val: boolean) => void;
//   isSidebarOpen: boolean;
//   setIsSidebarOpen: (val: boolean) => void;

//   // Data Queries
//   tasks: Task[];
//   schedules: ScheduleItem[];
//   habits: Habit[];
//   habitHistory: Record<string, Record<string, number>>;
//   focusItem: FocusItem;
//   gratitude: string;
//   quickNote: QuickNote;
//   userProfile: UserProfile;

//   // Mutations (Mocked React-Query handlers with date and CRUD capabilities)
//   addTask: (title: string, priority?: boolean, date?: string, time?: string) => void;
//   toggleTask: (id: string) => void;
//   deleteTask: (id: string) => void;
//   editTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  
//   addSchedule: (item: Omit<ScheduleItem, 'id'>, date?: string) => void;
//   deleteSchedule: (id: string) => void;
//   editSchedule: (id: string, updates: Partial<Omit<ScheduleItem, 'id'>>) => void;

//   incrementHabit: (id: string) => void;
//   decrementHabit: (id: string) => void;
//   addHabit: (name: string, icon: string, target: number, unit: string) => void;
//   deleteHabit: (id: string) => void;

//   toggleFocusCompleted: () => void;
//   updateFocusItem: (title: string, isPriority: boolean, duration: string) => void;

//   updateGratitude: (text: string) => void;
//   updateQuickNote: (text: string, labels?: string[]) => void;
//   updateUserProfile: (name: string, email: string) => void;

//   // Dialog Controllers
//   isQuickAddOpen: boolean;
//   setIsQuickAddOpen: (open: boolean) => void;
//   modalInitialTab: 'task' | 'schedule' | 'focus';
//   setModalInitialTab: (tab: 'task' | 'schedule' | 'focus') => void;
//   editingItem: { type: 'task' | 'schedule'; id: string } | null;
//   setEditingItem: (item: { type: 'task' | 'schedule'; id: string } | null) => void;
//   openAddModal: (tab?: 'task' | 'schedule' | 'focus') => void;
//   openEditModal: (type: 'task' | 'schedule', id: string) => void;

//   // Statuses (to mimic react-query state)
//   isLoading: boolean;
// }

// const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

// export function PlannerProvider({ children }: { children: React.ReactNode }) {
//   const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history'>('daily');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentDate, setCurrentDateState] = useState(() => {
//     return localStorage.getItem('aura_virtual_date') || '2026-05-24';
//   });
//   const [currentTime, setCurrentTimeState] = useState(() => {
//     return localStorage.getItem('aura_virtual_time') || '09:00 AM';
//   });
//   const [virtualTimeConfigured, setVirtualTimeConfiguredState] = useState(() => {
//     return localStorage.getItem('aura_virtual_time_configured') === 'true';
//   });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [habitHistory, setHabitHistory] = useState<Record<string, Record<string, number>>>({});

//   const setCurrentDate = (date: string) => {
//     setCurrentDateState(date);
//     localStorage.setItem('aura_virtual_date', date);
//   };

//   const setCurrentTime = (time: string) => {
//     setCurrentTimeState(time);
//     localStorage.setItem('aura_virtual_time', time);
//   };

//   const setVirtualTimeConfigured = (val: boolean) => {
//     setVirtualTimeConfiguredState(val);
//     localStorage.setItem('aura_virtual_time_configured', String(val));
//   };

//   // Dialog Controller States
//   const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
//   const [modalInitialTab, setModalInitialTab] = useState<'task' | 'schedule' | 'focus'>('task');
//   const [editingItem, setEditingItem] = useState<{ type: 'task' | 'schedule'; id: string } | null>(null);

//   const openAddModal = (tab: 'task' | 'schedule' | 'focus' = 'task') => {
//     setEditingItem(null);
//     setModalInitialTab(tab);
//     setIsQuickAddOpen(true);
//   };

//   const openEditModal = (type: 'task' | 'schedule', id: string) => {
//     setEditingItem({ type, id });
//     setModalInitialTab(type === 'task' ? 'task' : 'schedule');
//     setIsQuickAddOpen(true);
//   };

//   // Core States
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
//   const [habits, setHabits] = useState<Habit[]>([]);
//   const [focusItem, setFocusItem] = useState<FocusItem>({
//     title: 'Launch v1.2 Design Specs',
//     isPriority: true,
//     duration: '3h Project',
//     completed: false
//   });
//   const [gratitude, setGratitude] = useState('Grateful for the morning sunlight in my workspace and a fresh cup of jasmine tea.');
//   const [quickNote, setQuickNote] = useState<QuickNote>({
//     text: '',
//     labels: ['Idea', 'Project Aura']
//   });
//   const [userProfile, setUserProfile] = useState<UserProfile>({
//     email: 'tsraathmd@gmail.com',
//     name: 'Sarah Ahmed'
//   });

//   // Load from local storage on mount
//   useEffect(() => {
//     try {
//       const storedTasks = localStorage.getItem('aura_tasks');
//       const storedSchedules = localStorage.getItem('aura_schedules');
//       const storedHabits = localStorage.getItem('aura_habits');
//       const storedFocus = localStorage.getItem('aura_focus');
//       const storedGratitude = localStorage.getItem('aura_gratitude');
//       const storedNote = localStorage.getItem('aura_note');
//       const storedProfile = localStorage.getItem('aura_profile');

//       if (storedTasks) {
//         // Safe migration: check if any task lacks a date field
//         let parsedTasks: Task[] = JSON.parse(storedTasks);
//         let migrated = false;
//         parsedTasks = parsedTasks.map(t => {
//           if (!t.date) {
//             migrated = true;
//             return { ...t, date: '2026-05-24' };
//           }
//           return t;
//         });
//         setTasks(parsedTasks);
//         if (migrated) {
//           localStorage.setItem('aura_tasks', JSON.stringify(parsedTasks));
//         }
//       } else {
//         // Mock default tasks across a few days in Week 21 of 2026 (May 24 is Sunday)
//         const defaultTasks: Task[] = [
//           { id: 't-1', title: 'Review brand palette', completed: true, priority: true, date: '2026-05-24' },
//           { id: 't-2', title: 'Update style tokens', completed: false, priority: false, date: '2026-05-24' },
//           { id: 't-3', title: 'Weekly standup notes', completed: false, priority: false, date: '2026-05-24' },
//           { id: 't-4', title: 'Schedule therapist appt', completed: false, priority: false, date: '2026-05-24' },
          
//           { id: 't-5', title: 'Review brand designs with partner', completed: false, priority: true, date: '2026-05-22' },
//           { id: 't-6', title: 'Optimize SVGs', completed: true, priority: false, date: '2026-05-23' },
//           { id: 't-7', title: 'Call agency partners', completed: false, priority: false, date: '2026-05-23' },
//           { id: 't-8', title: 'Yoga session', completed: false, priority: false, date: '2026-05-23' },
//           { id: 't-9', title: 'Record tutorial screencast', completed: false, priority: true, date: '2026-05-25' },
//           { id: 't-10', title: 'Push main design tokens', completed: false, priority: true, date: '2026-05-26' },
//           { id: 't-11', title: 'Clean desk', completed: true, priority: false, date: '2026-05-26' },
//         ];
//         setTasks(defaultTasks);
//         localStorage.setItem('aura_tasks', JSON.stringify(defaultTasks));
//       }

//       if (storedSchedules) {
//         // Safe migration for schedule items
//         let parsedSchedules: ScheduleItem[] = JSON.parse(storedSchedules);
//         let migrated = false;
//         parsedSchedules = parsedSchedules.map(s => {
//           if (!s.date) {
//             migrated = true;
//             return { ...s, date: '2026-05-24' };
//           }
//           return s;
//         });
//         setSchedules(parsedSchedules);
//         if (migrated) {
//           localStorage.setItem('aura_schedules', JSON.stringify(parsedSchedules));
//         }
//       } else {
//         // Mock default schedule items
//         const defaultSchedules: ScheduleItem[] = [
//           { id: 's-1', time: '07:00 AM', title: 'Morning Meditation', subtitle: 'Mindfulness Practice', category: 'meditation', date: '2026-05-24' },
//           { id: 's-2', time: '09:00 AM', title: 'Deep Work: UI Design', subtitle: 'Main Dashboard Components', category: 'work', date: '2026-05-24' },
//           { id: 's-3', time: '11:00 AM', title: 'Client Sync Call', subtitle: 'Aura Planner Project', category: 'sync', date: '2026-05-24' },
//           { id: 's-4', time: '03:00 PM', title: 'Afternoon Tea', subtitle: 'Rest and Recharge', category: 'break', date: '2026-05-24' },
          
//           { id: 's-5', time: '09:00 AM', title: 'Kickoff brainstorm', subtitle: 'New feature concepts', category: 'work', date: '2026-05-23' },
//           { id: 's-6', time: '11:00 AM', title: 'Sync with engineering team', subtitle: 'Implementation overview', category: 'sync', date: '2026-05-25' },
//           { id: 's-7', time: '03:00 PM', title: 'Team lunch celebration', subtitle: 'Post-launch relax', category: 'break', date: '2026-05-25' }
//         ];
//         setSchedules(defaultSchedules);
//         localStorage.setItem('aura_schedules', JSON.stringify(defaultSchedules));
//       }

//       if (storedHabits) setHabits(JSON.parse(storedHabits));
//       else {
//         // Mock default habits
//         const defaultHabits: Habit[] = [
//           { id: 'h1', name: 'Hydration', icon: 'Droplets', count: 3, target: 8, unit: 'cups', colorClass: 'text-secondary hover:bg-secondary/10' },
//           { id: 'h2', name: 'Step Goal', icon: 'Footprints', count: 6500, target: 10000, unit: 'steps', colorClass: 'text-primary hover:bg-primary/10' },
//           { id: 'h3', name: 'Reading', icon: 'BookOpen', count: 15, target: 30, unit: 'pages', colorClass: 'text-secondary hover:bg-secondary/10' },
//           { id: 'h4', name: 'Zen Time', icon: 'Flower2', count: 10, target: 20, unit: 'mins', colorClass: 'text-primary hover:bg-primary/10' },
//         ];
//         setHabits(defaultHabits);
//         localStorage.setItem('aura_habits', JSON.stringify(defaultHabits));
//       }

//       if (storedFocus) setFocusItem(JSON.parse(storedFocus));
//       if (storedGratitude) setGratitude(JSON.parse(storedGratitude));
//       if (storedNote) setQuickNote(JSON.parse(storedNote));
//       if (storedProfile) setUserProfile(JSON.parse(storedProfile));

//       const storedHistory = localStorage.getItem('aura_habit_history');
//       if (storedHistory) {
//         setHabitHistory(JSON.parse(storedHistory));
//       } else {
//         const mockHist: Record<string, Record<string, number>> = {
//           '2026-05-24': { h1: 3, h2: 6500, h3: 15, h4: 10 },
//           '2026-05-23': { h1: 5, h2: 8000, h3: 20, h4: 15 },
//           '2026-05-22': { h1: 8, h2: 11000, h3: 30, h4: 20 },
//           '2026-05-21': { h1: 4, h2: 5500, h3: 10, h4: 5 },
//           '2026-05-20': { h1: 6, h2: 9500, h3: 25, h4: 0 },
//           '2026-05-19': { h1: 7, h2: 12000, h3: 35, h4: 18 },
//           '2026-05-18': { h1: 3, h2: 6500, h3: 15, h4: 10 },
//           '2026-05-17': { h1: 8, h2: 10500, h3: 30, h4: 20 },
//           '2026-05-16': { h1: 4, h2: 7000, h3: 12, h4: 5 },
//           '2026-05-15': { h1: 6, h2: 9000, h3: 25, h4: 15 },
//         };
//         setHabitHistory(mockHist);
//         localStorage.setItem('aura_habit_history', JSON.stringify(mockHist));
//       }

//     } catch (e) {
//       console.error("Failed loading from localStorage", e);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Save changes helper
//   const save = (key: string, data: any) => {
//     localStorage.setItem(key, JSON.stringify(data));
//   };

// // MUTATIONS
//   const addTask = (title: string, priority = false, date?: string, time?: string) => {
//     const newTask: Task = {
//       id: Date.now().toString(),
//       title,
//       completed: false,
//       priority,
//       date: date || currentDate,
//       time
//     };
//     const updated = [...tasks, newTask];
//     setTasks(updated);
//     save('aura_tasks', updated);
//   };

//   const toggleTask = (id: string) => {
//     const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
//     setTasks(updated);
//     save('aura_tasks', updated);
//   };

//   const deleteTask = (id: string) => {
//     const updated = tasks.filter(t => t.id !== id);
//     setTasks(updated);
//     save('aura_tasks', updated);
//   };

//   const editTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
//     const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
//     setTasks(updated);
//     save('aura_tasks', updated);
//   };

//   const addSchedule = (item: Omit<ScheduleItem, 'id'>, date?: string) => {
//     const newItem: ScheduleItem = {
//       ...item,
//       id: Date.now().toString(),
//       date: date || currentDate
//     };
//     // Sort schedules chronologically by parsing time
//     const updated = [...schedules, newItem].sort((a, b) => {
//       const getVal = (tStr: string) => {
//         const parts = tStr.trim().split(' ');
//         if (parts.length < 2) return 12 * 60;
//         const [time, modifier] = parts;
//         let [hours, minutes] = time.split(':').map(Number);
//         if (hours === 12 && modifier === 'AM') hours = 0;
//         if (modifier === 'PM' && hours !== 12) hours += 12;
//         return hours * 60 + (minutes || 0);
//       };
//       return getVal(a.time) - getVal(b.time);
//     });
//     setSchedules(updated);
//     save('aura_schedules', updated);
//   };

//   const editSchedule = (id: string, updates: Partial<Omit<ScheduleItem, 'id'>>) => {
//     const updatedSchedules = schedules.map(s => s.id === id ? { ...s, ...updates } : s);
//     const getVal = (tStr: string) => {
//       const parts = tStr.trim().split(' ');
//       if (parts.length < 2) return 12 * 60;
//       const [time, modifier] = parts;
//       let [hours, minutes] = time.split(':').map(Number);
//       if (hours === 12 && modifier === 'AM') hours = 0;
//       if (modifier === 'PM' && hours !== 12) hours += 12;
//       return hours * 60 + (minutes || 0);
//     };
//     const sorted = [...updatedSchedules].sort((a, b) => getVal(a.time) - getVal(b.time));
//     setSchedules(sorted);
//     save('aura_schedules', sorted);
//   };

//   const deleteSchedule = (id: string) => {
//     const updated = schedules.filter(s => s.id !== id);
//     setSchedules(updated);
//     save('aura_schedules', updated);
//   };

//   const incrementHabit = (id: string) => {
//     let finalCount = 0;
//     const updated = habits.map(h => {
//       if (h.id === id) {
//         const jump = h.unit === 'steps' ? 1000 : 1;
//         const newCount = Math.min(h.count + jump, h.target * 1.5);
//         finalCount = newCount;
//         return { ...h, count: newCount };
//       }
//       return h;
//     });
//     setHabits(updated);
//     save('aura_habits', updated);

//     setHabitHistory(prev => {
//       const next = {
//         ...prev,
//         [currentDate]: {
//           ...(prev[currentDate] || {}),
//           [id]: finalCount
//         }
//       };
//       save('aura_habit_history', next);
//       return next;
//     });
//   };

//   const decrementHabit = (id: string) => {
//     let finalCount = 0;
//     const updated = habits.map(h => {
//       if (h.id === id) {
//         const jump = h.unit === 'steps' ? 1000 : 1;
//         const newCount = Math.max(h.count - jump, 0);
//         finalCount = newCount;
//         return { ...h, count: newCount };
//       }
//       return h;
//     });
//     setHabits(updated);
//     save('aura_habits', updated);

//     setHabitHistory(prev => {
//       const next = {
//         ...prev,
//         [currentDate]: {
//           ...(prev[currentDate] || {}),
//           [id]: finalCount
//         }
//       };
//       save('aura_habit_history', next);
//       return next;
//     });
//   };

//   const addHabit = (name: string, icon: string, target: number, unit: string) => {
//     const colors = [
//       'text-primary hover:bg-primary/10',
//       'text-secondary hover:bg-secondary/10',
//       'text-tertiary hover:bg-tertiary/10'
//     ];
//     const pickedColor = colors[habits.length % colors.length];
//     const newHabit: Habit = {
//       id: 'h_' + Date.now(),
//       name,
//       icon,
//       count: 0,
//       target,
//       unit,
//       colorClass: pickedColor
//     };
//     const updated = [...habits, newHabit];
//     setHabits(updated);
//     save('aura_habits', updated);
//   };

//   const deleteHabit = (id: string) => {
//     const updated = habits.filter(h => h.id !== id);
//     setHabits(updated);
//     save('aura_habits', updated);
//   };

//   const toggleFocusCompleted = () => {
//     const updated = { ...focusItem, completed: !focusItem.completed };
//     setFocusItem(updated);
//     save('aura_focus', updated);
//   };

//   const updateFocusItem = (title: string, isPriority: boolean, duration: string) => {
//     const updated = { ...focusItem, title, isPriority, duration };
//     setFocusItem(updated);
//     save('aura_focus', updated);
//   };

//   const updateGratitude = (text: string) => {
//     setGratitude(text);
//     save('aura_gratitude', text);
//   };

//   const updateQuickNote = (text: string, labels?: string[]) => {
//     const updated = {
//       text,
//       labels: labels !== undefined ? labels : quickNote.labels
//     };
//     setQuickNote(updated);
//     save('aura_note', updated);
//   };

//   const updateUserProfile = (name: string, email: string) => {
//     const updated = { name, email };
//     setUserProfile(updated);
//     save('aura_profile', updated);
//   };

//   return (
//     <PlannerContext.Provider value={{
//       activeTab,
//       setActiveTab,
//       searchQuery,
//       setSearchQuery,
//       currentDate,
//       setCurrentDate,
//       currentTime,
//       setCurrentTime,
//       virtualTimeConfigured,
//       setVirtualTimeConfigured,
//       isSidebarOpen,
//       setIsSidebarOpen,
//       tasks,
//       schedules,
//       habits,
//       habitHistory,
//       focusItem,
//       gratitude,
//       quickNote,
//       userProfile,
//       addTask,
//       toggleTask,
//       deleteTask,
//       editTask,
//       addSchedule,
//       deleteSchedule,
//       editSchedule,
//       incrementHabit,
//       decrementHabit,
//       addHabit,
//       deleteHabit,
//       toggleFocusCompleted,
//       updateFocusItem,
//       updateGratitude,
//       updateQuickNote,
//       updateUserProfile,
//       isQuickAddOpen,
//       setIsQuickAddOpen,
//       modalInitialTab,
//       setModalInitialTab,
//       editingItem,
//       setEditingItem,
//       openAddModal,
//       openEditModal,
//       isLoading
//     }}>
//       {children}
//     </PlannerContext.Provider>
//   );
// }

// export function usePlanner() {
//   const context = useContext(PlannerContext);
//   if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
//   return context;
// }


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, ScheduleItem, Habit, QuickNote } from '../types';

interface FocusItem {
  title: string;
  isPriority: boolean;
  duration: string;
  completed: boolean;
}

interface UserProfile {
  email: string;
  name: string;
  avatarUrl?: string; // إدخال الصورة هنا لضمان حفظها
}

interface PlannerContextType {
  // Navigation & Date Context
  activeTab: 'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history';
  setActiveTab: (tab: 'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentDate: string; // 'YYYY-MM-DD'
  setCurrentDate: (date: string) => void;
  currentTime: string; // 'hh:mm AM/PM'
  setCurrentTime: (time: string) => void;
  virtualTimeConfigured: boolean;
  setVirtualTimeConfigured: (val: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;

  // Data Queries
  tasks: Task[];
  schedules: ScheduleItem[];
  habits: Habit[];
  habitHistory: Record<string, Record<string, number>>;
  focusItem: FocusItem;
  gratitude: string;
  quickNote: QuickNote;
  userProfile: UserProfile;

  // Mutations (Mocked React-Query handlers with date and CRUD capabilities)
  addTask: (title: string, priority?: boolean, date?: string, time?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  
  addSchedule: (item: Omit<ScheduleItem, 'id'>, date?: string) => void;
  deleteSchedule: (id: string) => void;
  editSchedule: (id: string, updates: Partial<Omit<ScheduleItem, 'id'>>) => void;

  incrementHabit: (id: string) => void;
  decrementHabit: (id: string) => void;
  addHabit: (name: string, icon: string, target: number, unit: string) => void;
  deleteHabit: (id: string) => void;

  toggleFocusCompleted: () => void;
  updateFocusItem: (title: string, isPriority: boolean, duration: string) => void;

  updateGratitude: (text: string) => void;
  updateQuickNote: (text: string, labels?: string[]) => void;
  updateUserProfile: (name: string, email: string, avatarUrl?: string) => void; // إضافة معامل الصورة هنا

  // Dialog Controllers
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  modalInitialTab: 'task' | 'schedule' | 'focus';
  setModalInitialTab: (tab: 'task' | 'schedule' | 'focus') => void;
  editingItem: { type: 'task' | 'schedule'; id: string } | null;
  setEditingItem: (item: { type: 'task' | 'schedule'; id: string } | null) => void;
  openAddModal: (tab?: 'task' | 'schedule' | 'focus') => void;
  openEditModal: (type: 'task' | 'schedule', id: string) => void;

  // Statuses (to mimic react-query state)
  isLoading: boolean;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'habits' | 'settings' | 'history'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDateState] = useState(() => {
    return localStorage.getItem('aura_virtual_date') || '2026-05-24';
  });
  const [currentTime, setCurrentTimeState] = useState(() => {
    return localStorage.getItem('aura_virtual_time') || '09:00 AM';
  });
  const [virtualTimeConfigured, setVirtualTimeConfiguredState] = useState(() => {
    return localStorage.getItem('aura_virtual_time_configured') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habitHistory, setHabitHistory] = useState<Record<string, Record<string, number>>>({});

  const setCurrentDate = (date: string) => {
    setCurrentDateState(date);
    localStorage.setItem('aura_virtual_date', date);
  };

  const setCurrentTime = (time: string) => {
    setCurrentTimeState(time);
    localStorage.setItem('aura_virtual_time', time);
  };

  const setVirtualTimeConfigured = (val: boolean) => {
    setVirtualTimeConfiguredState(val);
    localStorage.setItem('aura_virtual_time_configured', String(val));
  };

  // Dialog Controller States
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'task' | 'schedule' | 'focus'>('task');
  const [editingItem, setEditingItem] = useState<{ type: 'task' | 'schedule'; id: string } | null>(null);

  const openAddModal = (tab: 'task' | 'schedule' | 'focus' = 'task') => {
    setEditingItem(null);
    setModalInitialTab(tab);
    setIsQuickAddOpen(true);
  };

  const openEditModal = (type: 'task' | 'schedule', id: string) => {
    setEditingItem({ type, id });
    setModalInitialTab(type === 'task' ? 'task' : 'schedule');
    setIsQuickAddOpen(true);
  };

  // Core States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusItem, setFocusItem] = useState<FocusItem>({
    title: 'Launch v1.2 Design Specs',
    isPriority: true,
    duration: '3h Project',
    completed: false
  });
  const [gratitude, setGratitude] = useState('Grateful for the morning sunlight in my workspace and a fresh cup of jasmine tea.');
  const [quickNote, setQuickNote] = useState<QuickNote>({
    text: '',
    labels: ['Idea', 'Project Aura']
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'tsraathmd@gmail.com',
    name: 'Sarah Ahmed',
    avatarUrl: undefined
  });

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('aura_tasks');
      const storedSchedules = localStorage.getItem('aura_schedules');
      const storedHabits = localStorage.getItem('aura_habits');
      const storedFocus = localStorage.getItem('aura_focus');
      const storedGratitude = localStorage.getItem('aura_gratitude');
      const storedNote = localStorage.getItem('aura_note');
      const storedProfile = localStorage.getItem('aura_profile');

      if (storedTasks) {
        // Safe migration: check if any task lacks a date field
        let parsedTasks: Task[] = JSON.parse(storedTasks);
        let migrated = false;
        parsedTasks = parsedTasks.map(t => {
          if (!t.date) {
            migrated = true;
            return { ...t, date: '2026-05-24' };
          }
          return t;
        });
        setTasks(parsedTasks);
        if (migrated) {
          localStorage.setItem('aura_tasks', JSON.stringify(parsedTasks));
        }
      } else {
        // Mock default tasks across a few days in Week 21 of 2026 (May 24 is Sunday)
        const defaultTasks: Task[] = [
          { id: 't-1', title: 'Review brand palette', completed: true, priority: true, date: '2026-05-24' },
          { id: 't-2', title: 'Update style tokens', completed: false, priority: false, date: '2026-05-24' },
          { id: 't-3', title: 'Weekly standup notes', completed: false, priority: false, date: '2026-05-24' },
          { id: 't-4', title: 'Schedule therapist appt', completed: false, priority: false, date: '2026-05-24' },
          
          { id: 't-5', title: 'Review brand designs with partner', completed: false, priority: true, date: '2026-05-22' },
          { id: 't-6', title: 'Optimize SVGs', completed: true, priority: false, date: '2026-05-23' },
          { id: 't-7', title: 'Call agency partners', completed: false, priority: false, date: '2026-05-23' },
          { id: 't-8', title: 'Yoga session', completed: false, priority: false, date: '2026-05-23' },
          { id: 't-9', title: 'Record tutorial screencast', completed: false, priority: true, date: '2026-05-25' },
          { id: 't-10', title: 'Push main design tokens', completed: false, priority: true, date: '2026-05-26' },
          { id: 't-11', title: 'Clean desk', completed: true, priority: false, date: '2026-05-26' },
        ];
        setTasks(defaultTasks);
        localStorage.setItem('aura_tasks', JSON.stringify(defaultTasks));
      }

      if (storedSchedules) {
        // Safe migration for schedule items
        let parsedSchedules: ScheduleItem[] = JSON.parse(storedSchedules);
        let migrated = false;
        parsedSchedules = parsedSchedules.map(s => {
          if (!s.date) {
            migrated = true;
            return { ...s, date: '2026-05-24' };
          }
          return s;
        });
        setSchedules(parsedSchedules);
        if (migrated) {
          localStorage.setItem('aura_schedules', JSON.stringify(parsedSchedules));
        }
      } else {
        // Mock default schedule items
        const defaultSchedules: ScheduleItem[] = [
          { id: 's-1', time: '07:00 AM', title: 'Morning Meditation', subtitle: 'Mindfulness Practice', category: 'meditation', date: '2026-05-24' },
          { id: 's-2', time: '09:00 AM', title: 'Deep Work: UI Design', subtitle: 'Main Dashboard Components', category: 'work', date: '2026-05-24' },
          { id: 's-3', time: '11:00 AM', title: 'Client Sync Call', subtitle: 'Aura Planner Project', category: 'sync', date: '2026-05-24' },
          { id: 's-4', time: '03:00 PM', title: 'Afternoon Tea', subtitle: 'Rest and Recharge', category: 'break', date: '2026-05-24' },
          
          { id: 's-5', time: '09:00 AM', title: 'Kickoff brainstorm', subtitle: 'New feature concepts', category: 'work', date: '2026-05-23' },
          { id: 's-6', time: '11:00 AM', title: 'Sync with engineering team', subtitle: 'Implementation overview', category: 'sync', date: '2026-05-25' },
          { id: 's-7', time: '03:00 PM', title: 'Team lunch celebration', subtitle: 'Post-launch relax', category: 'break', date: '2026-05-25' }
        ];
        setSchedules(defaultSchedules);
        localStorage.setItem('aura_schedules', JSON.stringify(defaultSchedules));
      }

      if (storedHabits) setHabits(JSON.parse(storedHabits));
      else {
        // Mock default habits
        const defaultHabits: Habit[] = [
          { id: 'h1', name: 'Hydration', icon: 'Droplets', count: 3, target: 8, unit: 'cups', colorClass: 'text-secondary hover:bg-secondary/10' },
          { id: 'h2', name: 'Step Goal', icon: 'Footprints', count: 6500, target: 10000, unit: 'steps', colorClass: 'text-primary hover:bg-primary/10' },
          { id: 'h3', name: 'Reading', icon: 'BookOpen', count: 15, target: 30, unit: 'pages', colorClass: 'text-secondary hover:bg-secondary/10' },
          { id: 'h4', name: 'Zen Time', icon: 'Flower2', count: 10, target: 20, unit: 'mins', colorClass: 'text-primary hover:bg-primary/10' },
        ];
        setHabits(defaultHabits);
        localStorage.setItem('aura_habits', JSON.stringify(defaultHabits));
      }

      if (storedFocus) setFocusItem(JSON.parse(storedFocus));
      if (storedGratitude) setGratitude(JSON.parse(storedGratitude));
      if (storedNote) setQuickNote(JSON.parse(storedNote));
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));

      const storedHistory = localStorage.getItem('aura_habit_history');
      if (storedHistory) {
        setHabitHistory(JSON.parse(storedHistory));
      } else {
        const mockHist: Record<string, Record<string, number>> = {
          '2026-05-24': { h1: 3, h2: 6500, h3: 15, h4: 10 },
          '2026-05-23': { h1: 5, h2: 8000, h3: 20, h4: 15 },
          '2026-05-22': { h1: 8, h2: 11000, h3: 30, h4: 20 },
          '2026-05-21': { h1: 4, h2: 5500, h3: 10, h4: 5 },
          '2026-05-20': { h1: 6, h2: 9500, h3: 25, h4: 0 },
          '2026-05-19': { h1: 7, h2: 12000, h3: 35, h4: 18 },
          '2026-05-18': { h1: 3, h2: 6500, h3: 15, h4: 10 },
          '2026-05-17': { h1: 8, h2: 10500, h3: 30, h4: 20 },
          '2026-05-16': { h1: 4, h2: 7000, h3: 12, h4: 5 },
          '2026-05-15': { h1: 6, h2: 9000, h3: 25, h4: 15 },
        };
        setHabitHistory(mockHist);
        localStorage.setItem('aura_habit_history', JSON.stringify(mockHist));
      }

    } catch (e) {
      console.error("Failed loading from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes helper
  const save = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

// MUTATIONS
  const addTask = (title: string, priority = false, date?: string, time?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      date: date || currentDate,
      time
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    save('aura_tasks', updated);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    save('aura_tasks', updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    save('aura_tasks', updated);
  };

  const editTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(updated);
    save('aura_tasks', updated);
  };

  const addSchedule = (item: Omit<ScheduleItem, 'id'>, date?: string) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
      date: date || currentDate
    };
    // Sort schedules chronologically by parsing time
    const updated = [...schedules, newItem].sort((a, b) => {
      const getVal = (tStr: string) => {
        const parts = tStr.trim().split(' ');
        if (parts.length < 2) return 12 * 60;
        const [time, modifier] = parts;
        let [hours, minutes] = time.split(':').map(Number);
        if (hours === 12 && modifier === 'AM') hours = 0;
        if (modifier === 'PM' && hours !== 12) hours += 12;
        return hours * 60 + (minutes || 0);
      };
      return getVal(a.time) - getVal(b.time);
    });
    setSchedules(updated);
    save('aura_schedules', updated);
  };

  const editSchedule = (id: string, updates: Partial<Omit<ScheduleItem, 'id'>>) => {
    const updatedSchedules = schedules.map(s => s.id === id ? { ...s, ...updates } : s);
    const getVal = (tStr: string) => {
      const parts = tStr.trim().split(' ');
      if (parts.length < 2) return 12 * 60;
      const [time, modifier] = parts;
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (modifier === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + (minutes || 0);
    };
    const sorted = [...updatedSchedules].sort((a, b) => getVal(a.time) - getVal(b.time));
    setSchedules(sorted);
    save('aura_schedules', sorted);
  };

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    save('aura_schedules', updated);
  };

  const incrementHabit = (id: string) => {
    let finalCount = 0;
    const updated = habits.map(h => {
      if (h.id === id) {
        const jump = h.unit === 'steps' ? 1000 : 1;
        const newCount = Math.min(h.count + jump, h.target * 1.5);
        finalCount = newCount;
        return { ...h, count: newCount };
      }
      return h;
    });
    setHabits(updated);
    save('aura_habits', updated);

    setHabitHistory(prev => {
      const next = {
        ...prev,
        [currentDate]: {
          ...(prev[currentDate] || {}),
          [id]: finalCount
        }
      };
      save('aura_habit_history', next);
      return next;
    });
  };

  const decrementHabit = (id: string) => {
    let finalCount = 0;
    const updated = habits.map(h => {
      if (h.id === id) {
        const jump = h.unit === 'steps' ? 1000 : 1;
        const newCount = Math.max(h.count - jump, 0);
        finalCount = newCount;
        return { ...h, count: newCount };
      }
      return h;
    });
    setHabits(updated);
    save('aura_habits', updated);

    setHabitHistory(prev => {
      const next = {
        ...prev,
        [currentDate]: {
          ...(prev[currentDate] || {}),
          [id]: finalCount
        }
      };
      save('aura_habit_history', next);
      return next;
    });
  };

  const addHabit = (name: string, icon: string, target: number, unit: string) => {
    const colors = [
      'text-primary hover:bg-primary/10',
      'text-secondary hover:bg-secondary/10',
      'text-tertiary hover:bg-tertiary/10'
    ];
    const pickedColor = colors[habits.length % colors.length];
    const newHabit: Habit = {
      id: 'h_' + Date.now(),
      name,
      icon,
      count: 0,
      target,
      unit,
      colorClass: pickedColor
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    save('aura_habits', updated);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    save('aura_habits', updated);
  };

  const toggleFocusCompleted = () => {
    const updated = { ...focusItem, completed: !focusItem.completed };
    setFocusItem(updated);
    save('aura_focus', updated);
  };

  const updateFocusItem = (title: string, isPriority: boolean, duration: string) => {
    const updated = { ...focusItem, title, isPriority, duration };
    setFocusItem(updated);
    save('aura_focus', updated);
  };

  const updateGratitude = (text: string) => {
    setGratitude(text);
    save('aura_gratitude', text);
  };

  const updateQuickNote = (text: string, labels?: string[]) => {
    const updated = {
      text,
      labels: labels !== undefined ? labels : quickNote.labels
    };
    setQuickNote(updated);
    save('aura_note', updated);
  };

  const updateUserProfile = (name: string, email: string, avatarUrl?: string) => {
    const updated = { name, email, avatarUrl };
    setUserProfile(updated);
    save('aura_profile', updated);
  };

  return (
    <PlannerContext.Provider value={{
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      currentDate,
      setCurrentDate,
      currentTime,
      setCurrentTime,
      virtualTimeConfigured,
      setVirtualTimeConfigured,
      isSidebarOpen,
      setIsSidebarOpen,
      tasks,
      schedules,
      habits,
      habitHistory,
      focusItem,
      gratitude,
      quickNote,
      userProfile,
      addTask,
      toggleTask,
      deleteTask,
      editTask,
      addSchedule,
      deleteSchedule,
      editSchedule,
      incrementHabit,
      decrementHabit,
      addHabit,
      deleteHabit,
      toggleFocusCompleted,
      updateFocusItem,
      updateGratitude,
      updateQuickNote,
      updateUserProfile,
      isQuickAddOpen,
      setIsQuickAddOpen,
      modalInitialTab,
      setModalInitialTab,
      editingItem,
      setEditingItem,
      openAddModal,
      openEditModal,
      isLoading
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within a PlannerProvider');
  return context;
}