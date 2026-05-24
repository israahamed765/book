import { useState, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { motion } from 'motion/react';
import { CalendarRange, Sparkles, Smile, ChevronLeft, ChevronRight, Plus, CheckSquare, Clock } from 'lucide-react';

export default function MonthlyView() {
  const { tasks, schedules, currentDate, setCurrentDate, openAddModal } = usePlanner();

  const [dateObj, setDateObj] = useState(() => {
    return new Date(currentDate + "T12:00:00");
  });

  // Sync state with global currentDate context
  useEffect(() => {
    setDateObj(new Date(currentDate + "T12:00:00"));
  }, [currentDate]);

  const handlePrevMonth = () => {
    const prevDate = new Date(dateObj);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setDateObj(prevDate);
    
    // Keep closest available date index
    const yr = prevDate.getFullYear();
    const mo = String(prevDate.getMonth() + 1).padStart(2, '0');
    const totalDaysInMonth = new Date(yr, prevDate.getMonth() + 1, 0).getDate();
    const dy = String(Math.min(totalDaysInMonth, dateObj.getDate())).padStart(2, '0');
    setCurrentDate(`${yr}-${mo}-${dy}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(dateObj);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setDateObj(nextDate);
    
    // Keep closest available date index
    const yr = nextDate.getFullYear();
    const mo = String(nextDate.getMonth() + 1).padStart(2, '0');
    const totalDaysInMonth = new Date(yr, nextDate.getMonth() + 1, 0).getDate();
    const dy = String(Math.min(totalDaysInMonth, dateObj.getDate())).padStart(2, '0');
    setCurrentDate(`${yr}-${mo}-${dy}`);
  };

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // 0-indexed

  // Total days in active month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // We offset by 1st of month's day in the week
  const startDayOfWeek = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const getDayStr = (dayNum: number) => {
    const mo = String(month + 1).padStart(2, '0');
    const dy = String(dayNum).padStart(2, '0');
    return `${year}-${mo}-${dy}`;
  };

  const getDaySummary = (dayNum: number) => {
    const targetDateStr = getDayStr(dayNum);
    const dayTasks = tasks.filter(t => t.date === targetDateStr);
    const daySchedules = schedules.filter(s => s.date === targetDateStr);
    return {
      hasTasks: dayTasks.length > 0,
      hasSchedules: daySchedules.length > 0,
      totalCount: dayTasks.length + daySchedules.length
    };
  };

  const selectedDayNum = dateObj.getDate();
  const selectedDateStr = getDayStr(selectedDayNum);
  
  // Specific tasks and schedules for active day
  const selectedDayTasks = tasks.filter(t => t.date === selectedDateStr);
  const selectedDaySchedules = schedules.filter(s => s.date === selectedDateStr);

  const monthLabel = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  const activeDayLabel = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'meditation': return 'border-[#5cb89a] bg-[#e7f6f1] text-[#347c64]';
      case 'work': return 'border-primary bg-[#eeebff] text-primary';
      case 'sync': return 'border-tertiary bg-[#ffebd6] text-tertiary';
      default: return 'border-outline bg-black/5 text-outline';
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
            <h2 className="font-serif text-3xl font-bold text-on-surface">Monthly Overview</h2>
            <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
              Maintain a broad awareness of your calendar commitments, benchmarks, and monthly patterns.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              id="monthly-prev-month"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="bg-primary/5 px-4.5 py-2.5 rounded-full border border-primary/20 flex items-center gap-2">
              <CalendarRange size={15} className="text-primary" />
              <span className="text-xs font-sans font-bold text-primary tracking-wide">{monthLabel}</span>
            </div>
            <button
              id="monthly-next-month"
              onClick={handleNextMonth}
              className="p-2 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid card */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm flex flex-col">
          {/* Calendar weekdays labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4 border-b border-outline-variant/15 pb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(label => (
              <span key={label} className="font-sans font-bold text-[10px] text-outline uppercase tracking-widest block py-1 select-none">
                {label}
              </span>
            ))}
          </div>

          {/* Calendar day grid cells */}
          <div className="grid grid-cols-7 gap-2.5">
            {blankDays.map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square opacity-0 select-none" />
            ))}
            
            {daysArray.map((day) => {
              const isSelected = selectedDayNum === day;
              const summary = getDaySummary(day);
              
              return (
                <button
                  id={`monthly-day-cell-${day}`}
                  key={day}
                  onClick={() => setCurrentDate(getDayStr(day))}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer font-sans transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10 scale-105'
                      : 'bg-white/30 hover:bg-white/90 border border-outline-variant/10 text-on-surface hover:border-primary/20'
                  }`}
                >
                  <span className="text-xs font-semibold">{day}</span>
                  
                  {/* Event indicators dots */}
                  {summary.totalCount > 0 && (
                    <div className="flex gap-1 items-center justify-center absolute bottom-2">
                      {summary.hasSchedules && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-primary'}`} />
                      )}
                      {summary.hasTasks && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/85' : 'bg-secondary'}`} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day summary details */}
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-outline-variant/15 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-on-surface mb-0.5">Day Summary</h3>
                <p className="font-sans text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                  {activeDayLabel}
                </p>
              </div>
              <button
                id="monthly-add-btn"
                onClick={() => openAddModal('task')}
                className="p-1 px-2.5 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer hover:bg-primary/95 transition-all shadow-sm"
              >
                <Plus size={11} />
                Add
              </button>
            </div>

            {/* Combined List of Tasks and Schedules */}
            <div className="space-y-4">
              {/* Agenda items slot */}
              <div>
                <h4 className="font-sans font-bold text-[10px] text-outline uppercase tracking-widest flex items-center gap-1 mb-2">
                  <Clock size={11} />
                  Time Slots ({selectedDaySchedules.length})
                </h4>
                {selectedDaySchedules.length === 0 ? (
                  <p className="text-[11px] text-outline/50 italic pl-1 font-sans font-medium">No schedules defined</p>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                    {selectedDaySchedules.map((s) => (
                      <div key={s.id} className={`p-2.5 border-l-4 rounded-lg font-sans text-[11px] flex justify-between items-center ${getCategoryColor(s.category)}`}>
                        <span className="font-semibold truncate">{s.title}</span>
                        <span className="text-[9px] font-bold opacity-80 whitespace-nowrap pl-2">{s.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks checklist slot */}
              <div>
                <h4 className="font-sans font-bold text-[10px] text-outline uppercase tracking-widest flex items-center gap-1 mb-2">
                  <CheckSquare size={11} />
                  Checklist ({selectedDayTasks.length})
                </h4>
                {selectedDayTasks.length === 0 ? (
                  <p className="text-[11px] text-outline/50 italic pl-1 font-sans font-medium">No tasks defined</p>
                ) : (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                    {selectedDayTasks.map((t) => (
                      <div key={t.id} className="p-2.5 bg-white border border-outline-variant/10 rounded-lg font-sans text-[11px] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                        <span className={`truncate font-medium ${t.completed ? 'text-outline/50 line-through' : 'text-on-surface'}`}>
                          {t.title}
                        </span>
                        {t.priority && (
                          <span className="text-[8px] bg-rose-50 text-rose-500 font-bold px-1.5 py-0.5 rounded-full border border-rose-100 flex-shrink-0">
                            High
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/15 flex items-center gap-2">
            <Sparkles size={14} className="text-secondary" />
            <p className="text-[10px] font-sans font-bold text-outline uppercase tracking-wider">
              Connected across all planner views
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
