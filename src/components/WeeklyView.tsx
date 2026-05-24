import { usePlanner } from '../context/PlannerContext';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Calendar, Plus, Smile, Award, Sparkles, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function WeeklyView() {
  const { tasks, schedules, currentDate, setCurrentDate, openAddModal, toggleTask } = usePlanner();

  // Helper to find the Monday of the week for a given date
  const getMonday = (dStr: string) => {
    const d = new Date(dStr + "T12:00:00");
    const day = d.getDay(); // Sunday is 0, Monday is 1...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    return new Date(d.setDate(diff));
  };

  // Internal anchor date to allow navigating between different weeks
  const [weekAnchorDate, setWeekAnchorDate] = useState(currentDate);

  // Re-sync anchor date with global context currentDate
  useEffect(() => {
    setWeekAnchorDate(currentDate);
  }, [currentDate]);

  const handlePrevWeek = () => {
    const d = new Date(weekAnchorDate + "T12:00:00");
    d.setDate(d.getDate() - 7);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const newDate = `${yr}-${mo}-${dy}`;
    setWeekAnchorDate(newDate);
    setCurrentDate(newDate); // Update global context too
  };

  const handleNextWeek = () => {
    const d = new Date(weekAnchorDate + "T12:00:00");
    d.setDate(d.getDate() + 7);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const newDate = `${yr}-${mo}-${dy}`;
    setWeekAnchorDate(newDate);
    setCurrentDate(newDate); // Update global context too
  };

  // Generate the 7 weekdays of the current anchor week
  const startMonday = getMonday(weekAnchorDate);
  const weekdays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startMonday);
    d.setDate(d.getDate() + i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${dy}`;
    
    // Count both schedule items and tasks for this date
    const dateTasks = tasks.filter(t => t.date === dateStr);
    const dateSchedules = schedules.filter(s => s.date === dateStr);

    return {
      date: dateStr,
      name: d.toLocaleDateString('en-US', { weekday: 'long' }),
      abbreviation: d.toLocaleDateString('en-US', { weekday: 'short' }),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayNum: d.getDate(),
      taskCount: dateTasks.length,
      scheduleCount: dateSchedules.length
    };
  });

  const activeDay = weekdays.find(w => w.date === currentDate) || weekdays[0];

  // Specific tasks and schedules matching the active week day
  const activeDayTasks = tasks.filter(t => t.date === activeDay.date);
  const activeDaySchedules = schedules.filter(s => s.date === activeDay.date);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'meditation': return 'border-[#5cb89a] text-[#347c64] bg-[#e7f6f1]';
      case 'work': return 'border-primary text-primary bg-[#eeebff]';
      case 'sync': return 'border-tertiary text-tertiary bg-[#ffebd6]';
      default: return 'border-outline text-outline bg-black/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      {/* Editorial Header */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2.2rem] p-8 border border-white/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-on-surface">Weekly Planner</h2>
            <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
              Navigate weeks, map upcoming tasks, and sync priorities with your timeline.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              id="weekly-prev-week"
              onClick={handlePrevWeek}
              className="p-2 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Previous Week"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="bg-primary/5 px-4.5 py-2.5 rounded-full border border-primary/20 flex items-center gap-2">
              <Calendar size={15} className="text-primary" />
              <span className="text-xs font-sans font-bold text-primary tracking-wide uppercase">
                {weekdays[0].label.toUpperCase()} - {weekdays[6].label.toUpperCase()} • {startMonday.getFullYear()}
              </span>
            </div>
            <button
              id="weekly-next-week"
              onClick={handleNextWeek}
              className="p-2 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Next Week"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 7 days horizontal layout selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekdays.map((day) => {
          const isSelected = currentDate === day.date;
          return (
            <button
              id={`weekly-day-select-${day.date}`}
              key={day.date}
              onClick={() => setCurrentDate(day.date)}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                  : 'bg-white/60 backdrop-blur-md border-white/40 hover:bg-white/90 text-on-surface hover:border-primary/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-sans font-bold text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-outline'}`}>
                  {day.abbreviation}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {day.dayNum}
                </span>
              </div>
              
              <span className="font-serif text-lg font-bold leading-tight block mt-2">{day.name}</span>
              
              <div className="flex items-center gap-1.5 mt-3">
                <span className={`font-sans text-[10px] font-bold ${isSelected ? 'text-white/70' : 'text-outline/80'}`}>
                  {day.taskCount} tasks
                </span>
                <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/40' : 'bg-outline/30'}`}></span>
                <span className={`font-sans text-[10px] font-bold ${isSelected ? 'text-white/70' : 'text-outline/80'}`}>
                  {day.scheduleCount} slots
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day details content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Tasks list for the day */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-[22px] p-8 border border-white/40 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
              <CheckSquare size={18} className="text-primary" />
              Tasks Checklist • <span className="opacity-80 font-sans font-medium text-base">{activeDay.name} ({activeDay.label})</span>
            </h3>
            <button
              id="weekly-add-task-btn"
              onClick={() => openAddModal('task')}
              className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-full cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              Add Task
            </button>
          </div>

          <ul className="space-y-2.5 flex-1 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
            {activeDayTasks.length === 0 ? (
              <div className="py-14 text-center text-outline/50 flex flex-col items-center justify-center">
                <Smile size={32} className="mb-2 text-outline/40" />
                <p className="text-sm font-semibold">Rest and Recover Today</p>
                <p className="text-xs mt-0.5">No active task targets registered on this date.</p>
              </div>
            ) : (
              activeDayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-3.5 bg-white/70 hover:bg-white border border-outline-variant/10 hover:border-primary/20 rounded-xl flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-4.5 h-4.5 rounded text-primary border-outline-variant focus:ring-primary/10 cursor-pointer flex-shrink-0"
                    />
                    <span className={`font-sans text-sm font-medium transition-all truncate ${
                      task.completed ? 'text-outline/50 line-through decoration-outline/20' : 'text-on-surface'
                    }`}>
                      {task.title}
                    </span>
                  </div>
                  {task.priority && (
                    <span className="flex-shrink-0 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-500 border border-rose-100">
                      High
                    </span>
                  )}
                </div>
              ))
            )}
          </ul>
        </div>

        {/* Right column: Timeline Schedule Agenda snapshot */}
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-8 border border-white/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Agenda Items
              </h3>
              <button
                id="weekly-add-sched-btn"
                onClick={() => openAddModal('schedule')}
                className="text-primary hover:text-primary/80 transition-colors p-1"
                title="Add schedule slot"
              >
                <Plus size={18} />
              </button>
            </div>

            <ul className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin rounded-xl">
              {activeDaySchedules.length === 0 ? (
                <div className="py-12 text-center text-outline/40 flex flex-col items-center justify-center">
                  <Sparkles size={24} className="mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Clear Timeline Hour</p>
                  <p className="text-[10px] mt-0.5">Click plus to add a dynamic hour target.</p>
                </div>
              ) : (
                activeDaySchedules.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border border-l-4 font-sans text-xs flex justify-between items-start ${getCategoryColor(item.category)}`}
                  >
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      {item.subtitle && <div className="opacity-80 text-[10px] mt-0.5">{item.subtitle}</div>}
                    </div>
                    <span className="text-[10px] font-bold opacity-75 whitespace-nowrap pl-2">
                      {item.time}
                    </span>
                  </div>
                ))
              )}
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-outline-variant/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
              <Award size={16} />
            </div>
            <p className="text-[10px] font-sans font-medium text-on-surface-variant leading-relaxed">
              Energy sync active. Click details inside the timeline or checklist to direct.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
