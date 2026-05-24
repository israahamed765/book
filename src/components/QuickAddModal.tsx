import { usePlanner } from '../context/PlannerContext';
import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, CalendarDays } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'task' | 'schedule' | 'focus';
  editItem?: { type: 'task' | 'schedule'; id: string } | null;
}

export default function QuickAddModal({ isOpen, onClose, initialTab = 'task', editItem = null }: QuickAddModalProps) {
  const { addTask, addSchedule, updateFocusItem, editTask, editSchedule, tasks, schedules } = usePlanner();
  const [activeSubTab, setActiveSubTab] = useState<'task' | 'schedule' | 'focus'>(initialTab);

  // Form states - Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState(false);
  const [taskDate, setTaskDate] = useState('2026-05-24');

  // Form states - Schedule
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleSubtitle, setScheduleSubtitle] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00 AM');
  const [scheduleCategory, setScheduleCategory] = useState<'meditation' | 'work' | 'sync' | 'break' | 'custom'>('work');
  const [scheduleDate, setScheduleDate] = useState('2026-05-24');

  // Form states - Focus Goal
  const [focusTitle, setFocusTitle] = useState('');
  const [focusPriority, setFocusPriority] = useState(true);
  const [focusDuration, setFocusDuration] = useState('3h Project');

  // Load edit values or reset
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setActiveSubTab(editItem.type === 'task' ? 'task' : 'schedule');
        
        if (editItem.type === 'task') {
          const t = tasks.find(x => x.id === editItem.id);
          if (t) {
            setTaskTitle(t.title);
            setTaskPriority(t.priority);
            setTaskDate(t.date || '2026-05-24');
          }
        } else if (editItem.type === 'schedule') {
          const s = schedules.find(x => x.id === editItem.id);
          if (s) {
            setScheduleTitle(s.title);
            setScheduleSubtitle(s.subtitle);
            setScheduleTime(s.time);
            setScheduleCategory(s.category);
            setScheduleDate(s.date || '2026-05-24');
          }
        }
      } else {
        setActiveSubTab(initialTab);
        // Reset fields
        setTaskTitle('');
        setTaskPriority(false);
        setTaskDate('2026-05-24');
        
        setScheduleTitle('');
        setScheduleSubtitle('');
        setScheduleTime('09:00 AM');
        setScheduleCategory('work');
        setScheduleDate('2026-05-24');
      }
    }
  }, [isOpen, editItem, initialTab, tasks, schedules]);

  const handleTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      if (editItem && editItem.type === 'task') {
        editTask(editItem.id, {
          title: taskTitle.trim(),
          priority: taskPriority,
          date: taskDate
        });
      } else {
        addTask(taskTitle.trim(), taskPriority, taskDate);
      }
      setTaskTitle('');
      setTaskPriority(false);
      onClose();
    }
  };

  const handleScheduleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (scheduleTitle.trim()) {
      if (editItem && editItem.type === 'schedule') {
        editSchedule(editItem.id, {
          title: scheduleTitle.trim(),
          subtitle: scheduleSubtitle.trim(),
          time: scheduleTime,
          category: scheduleCategory,
          date: scheduleDate
        });
      } else {
        addSchedule({
          title: scheduleTitle.trim(),
          subtitle: scheduleSubtitle.trim(),
          time: scheduleTime,
          category: scheduleCategory,
        }, scheduleDate);
      }
      setScheduleTitle('');
      setScheduleSubtitle('');
      onClose();
    }
  };

  const handleFocusSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (focusTitle.trim()) {
      updateFocusItem(focusTitle.trim(), focusPriority, focusDuration);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1a1c1b]/30 backdrop-blur-sm"
          />

          {/* Core modal canvas */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg bg-[#faf9f7] rounded-[2rem] border border-white/50 p-8 shadow-2xl shadow-black/10 overflow-hidden"
          >
            {/* Soft lighting accents */}
            <div className="absolute top-0 right-0 p-10 opacity-10 bg-gradient-to-tr from-primary to-secondary rounded-full filter blur-3xl pointer-events-none"></div>

            {/* Core Header row */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2 select-none">
                <Sparkles size={20} className="text-primary" />
                {editItem ? `Edit ${editItem.type === 'task' ? 'Task' : 'Schedule'}` : 'Quick Creator'}
              </h3>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/5 text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation bar selectors - Hidden in Edit Mode */}
            {!editItem && (
              <div className="flex bg-black/5 rounded-xl p-1 mb-6">
                {(['task', 'schedule', 'focus'] as const).map(tabKey => (
                  <button
                    id={`modal-tab-select-${tabKey}`}
                    key={tabKey}
                    type="button"
                    onClick={() => setActiveSubTab(tabKey)}
                    className={`flex-1 py-2 rounded-lg font-sans text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                      activeSubTab === tabKey
                        ? 'bg-white text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
                        : 'text-outline/80 hover:text-on-surface'
                    }`}
                  >
                    {tabKey === 'task' && 'Add Task'}
                    {tabKey === 'schedule' && 'Add Schedule'}
                    {tabKey === 'focus' && 'Update Focus'}
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTAINER FLOWS */}
            <div className="min-h-[220px]">
              {/* TAB: TASK ROUTING */}
              {activeSubTab === 'task' && (
                <form id="modal-task-form" onSubmit={handleTaskSubmit} className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline select-none">Task Title</label>
                    <input
                      id="modal-task-title-input"
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Enter task description"
                      className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-outline select-none">Associated Date</label>
                      <input
                        id="modal-task-date-input"
                        type="date"
                        required
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-sans"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        id="modal-task-priority-checkbox"
                        type="checkbox"
                        checked={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <label htmlFor="modal-task-priority-checkbox" className="font-sans text-xs font-medium text-on-surface-variant cursor-pointer select-none">
                        High Priority
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      id="modal-task-cancel"
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-bold text-outline hover:text-on-surface cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="modal-task-submit"
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-sans text-xs font-bold rounded-full shadow-md shadow-primary/15 cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      {editItem ? 'Save Changes' : 'Save Task'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: SCHEDULE ROUTING */}
              {activeSubTab === 'schedule' && (
                <form id="modal-schedule-form" onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-outline">What hour?</label>
                      <input
                        id="modal-schedule-time-input"
                        type="text"
                        required
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        placeholder="e.g. 09:00 AM"
                        className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-outline">Context Label</label>
                      <select
                        id="modal-schedule-category-select"
                        value={scheduleCategory}
                        onChange={(e) => setScheduleCategory(e.target.value as any)}
                        className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-2.5 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="work">Deep Work / Design</option>
                        <option value="meditation">Mindfulness Practice</option>
                        <option value="sync">Call / Meeting</option>
                        <option value="break">Rest / Meal Break</option>
                        <option value="custom">General Item</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-outline">Associated Date</label>
                      <input
                        id="modal-schedule-date-input"
                        type="date"
                        required
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline">Item Title</label>
                    <input
                      id="modal-schedule-title-input"
                      type="text"
                      required
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      placeholder="e.g. Design Studio Retrospective"
                      className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline">Subtitle/Description</label>
                    <input
                      id="modal-schedule-subtitle-input"
                      type="text"
                      value={scheduleSubtitle}
                      onChange={(e) => setScheduleSubtitle(e.target.value)}
                      placeholder="e.g. Bring brand templates"
                      className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      id="modal-schedule-cancel"
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-bold text-outline hover:text-on-surface cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="modal-schedule-submit"
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-sans text-xs font-bold rounded-full shadow-md shadow-primary/15 cursor-pointer flex items-center gap-1.5"
                    >
                      <CalendarDays size={14} />
                      {editItem ? 'Save Changes' : 'Save Schedule'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: FOCUS ROUTING */}
              {activeSubTab === 'focus' && (
                <form id="modal-focus-form" onSubmit={handleFocusSubmit} className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline">What is your paramount Goal today?</label>
                    <input
                      id="modal-focus-title-input"
                      type="text"
                      required
                      value={focusTitle}
                      onChange={(e) => setFocusTitle(e.target.value)}
                      placeholder="e.g. Review final UI design metrics"
                      className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 pt-3">
                      <input
                        id="modal-focus-priority-checkbox"
                        type="checkbox"
                        checked={focusPriority}
                        onChange={(e) => setFocusPriority(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <label htmlFor="modal-focus-priority-checkbox" className="font-sans text-xs font-medium text-on-surface-variant cursor-pointer select-none">
                        Show Priority Badge
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-outline">Completion duration</label>
                      <input
                        id="modal-focus-duration-input"
                        type="text"
                        value={focusDuration}
                        onChange={(e) => setFocusDuration(e.target.value)}
                        placeholder="e.g. 3h Project, 45m Sprint"
                        className="w-full border border-outline-variant/40 bg-white rounded-xl px-4 py-2.5 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      id="modal-focus-cancel"
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-bold text-outline hover:text-on-surface cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="modal-focus-submit"
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-sans text-xs font-bold rounded-full shadow-md shadow-primary/15 cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      Set Focus
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
