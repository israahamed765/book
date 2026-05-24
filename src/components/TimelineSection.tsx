
import { Calendar, Trash2, Plus, Sparkles, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlanner } from '../context/PlannerContext';
import { Schedule } from '../types';

interface TimelineSectionProps {
  onOpenAddSchedule: (timeSlot?: string) => void;
}

export default function TimelineSection({ onOpenAddSchedule }: TimelineSectionProps) {
  const { 
    schedules, 
    deleteSchedule, 
    searchQuery, 
    currentDate, 
    setCurrentDate, 
    setModalState 
  } = usePlanner();

  // Full mindful hour range for a beautifully balanced day
  const fullHourSlots = [
    { time: '07:00 AM', label: '07 AM' },
    { time: '08:00 AM', label: '08 AM' },
    { time: '09:00 AM', label: '09 AM' },
    { time: '10:00 AM', label: '10 AM' },
    { time: '11:00 AM', label: '11 AM' },
    { time: '12:00 PM', label: '12 PM' },
    { time: '01:00 PM', label: '01 PM' },
    { time: '02:00 PM', label: '02 PM' },
    { time: '03:00 PM', label: '03 PM' },
    { time: '04:00 PM', label: '04 PM' },
    { time: '05:00 PM', label: '05 PM' },
    { time: '06:00 PM', label: '06 PM' },
    { time: '07:00 PM', label: '07 PM' },
    { time: '08:00 PM', label: '08 PM' },
  ];

  const handlePrevDay = () => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  // Normalize time string for robust slot grouping (e.g., '07:30 AM' -> '7 AM')
  const normalizeToHourBlock = (timeStr: string) => {
    const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      const hour = parseInt(match[1], 10);
      const ampm = match[3].toUpperCase();
      return `${hour} ${ampm}`;
    }
    return timeStr.trim().toUpperCase().replace(/\s+/g, '');
  };

  const dateSchedules = schedules.filter(s => s.date === currentDate);

  // Group multiple schedules into their respective hour slot block.
  // This completely fixes the "overlapping/stacking bug" where plans on the same hour 
  // overlapped visually or failed to render!
  const filteredSlots = fullHourSlots.map(slot => {
    const slotHourBlock = normalizeToHourBlock(slot.time);
    
    // Find ALL matches for this hour block (allowing multiple events to sit beautifully within the same hour)
    const matchingItems = dateSchedules.filter(s => normalizeToHourBlock(s.time) === slotHourBlock);
    
    // Apply search filter if active
    const filteredItems = matchingItems.filter(item => {
      if (!searchQuery) return true;
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

    return { 
      ...slot, 
      items: filteredItems 
    };
  });

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'meditation': return 'bg-emerald-50/90 border-l-4 border-emerald-600 text-emerald-950 shadow-xs';
      case 'work': return 'bg-indigo-50/90 border-l-4 border-indigo-600 text-indigo-950 shadow-xs';
      case 'sync': return 'bg-amber-50/90 border-l-4 border-amber-600 text-amber-950 shadow-xs';
      case 'break': return 'bg-slate-50 border-l-4 border-slate-400 text-slate-800 shadow-xs';
      default: return 'bg-stone-50 border-l-4 border-stone-400 text-stone-800 shadow-xs';
    }
  };

  const getTagBg = (cat: string) => {
    switch (cat) {
      case 'meditation': return 'bg-emerald-100 text-emerald-850';
      case 'work': return 'bg-indigo-100 text-indigo-850';
      case 'sync': return 'bg-amber-100 text-amber-850';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formattedDate = new Date(currentDate + "T12:00:00").toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  return (
    <section className="bg-white/85 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 h-full flex flex-col shadow-xl">
      {/* Target Title Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-serif text-3xl text-slate-900 font-bold tracking-tight">Timeline</h2>
          
          {/* Day Navigation Controls */}
          <div className="flex items-center gap-1.5 mt-2">
            <button
              id="prev-day-btn"
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer select-none"
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-sans text-sm text-slate-600 font-semibold min-w-[140px] text-center select-none bg-slate-50 py-1 px-3 rounded-full border border-slate-100 shadow-2xs">
              {formattedDate}
            </span>
            <button
              id="next-day-btn"
              onClick={handleNextDay}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer select-none"
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Toggle to today's actual date */}
        <button 
          id="today-reset-btn"
          onClick={() => setCurrentDate('2026-05-24')}
          className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs flex items-center justify-center"
          title="Jump to Today (May 24)"
        >
          <Calendar size={18} />
        </button>
      </div>

      {/* Actual Scrolling List */}
      <div className="flex-1 space-y-0 relative pl-1.5 overflow-y-auto max-h-[580px] scrollbar-thin pr-2">
        {/* Timeline continuity connector line */}
        <div className="absolute left-14 top-4 bottom-4 w-0.5 bg-slate-200 z-0"></div>

        <AnimatePresence initial={false}>
          {filteredSlots.map((slot, index) => {
            const hasItems = slot.items.length > 0;
            
            return (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className="flex gap-6 min-h-[95px] group relative z-10"
              >
                {/* Time Indicator */}
                <span className="font-sans font-bold text-xs text-slate-400 uppercase w-12 pt-3 select-none flex-shrink-0">
                  {slot.label}
                </span>

                {/* Core block content */}
                <div className="flex-1 pt-1.5 pb-4 border-b border-slate-100 last:border-none flex flex-col justify-center">
                  {hasItems ? (
                    /* Group/List wrapper: forces multiple events in the same time slot to stack vertically neatly */
                    <div className="flex flex-col gap-2 w-full">
                      {slot.items.map((item: Schedule) => (
                        <div 
                          key={item.id}
                          className={`p-4 rounded-2xl relative group/card transition-all duration-300 hover:shadow-md hover:translate-x-[2px] ${getCategoryStyles(item.category)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="pr-16">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-sans font-semibold text-sm leading-snug">
                                  {item.title}
                                </h4>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans uppercase font-extrabold tracking-wider flex-shrink-0 ${getTagBg(item.category)}`}>
                                  {item.category}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono font-medium">
                                  {item.time}
                                </span>
                              </div>
                              {item.subtitle && (
                                <p className="text-xs mt-1.5 opacity-90 font-sans font-medium">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            
                            {/* Interactive Edit & Delete button dock */}
                            <div className="opacity-0 group-hover/card:opacity-100 flex items-center gap-1.5 transition-all duration-200 absolute right-3 top-3">
                              <button
                                id={`edit-schedule-${item.id}`}
                                onClick={() => setModalState({ type: 'schedule', mode: 'edit', id: item.id })}
                                className="p-1 border border-slate-200/50 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-2xs transition-all outline-none cursor-pointer bg-white/70"
                                title="Edit schedule"
                              >
                                <Pencil size={12} strokeWidth={2.5} />
                              </button>
                              <button
                                id={`delete-schedule-${item.id}`}
                                onClick={() => deleteSchedule(item.id)}
                                className="p-1 border border-slate-200/50 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-2xs transition-all outline-none cursor-pointer bg-white/70"
                                title="Delete schedule"
                              >
                                <Trash2 size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Quick slot addition block for appending further plans to same hour */}
                      <button
                        onClick={() => onOpenAddSchedule(slot.time)}
                        className="text-[11px] font-sans font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1 px-3 py-1 hover:bg-slate-50 rounded-lg transition-colors w-max cursor-pointer self-start"
                      >
                        <Plus size={10} /> Add another event for {slot.label}
                      </button>
                    </div>
                  ) : (
                    /* Blank spot fallback builder */
                    <button
                      id={`timeline-add-${slot.time.replace(/\s+/g, '')}`}
                      onClick={() => onOpenAddSchedule(slot.time)}
                      className="w-full text-left p-4 border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl cursor-pointer group/add transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-400 font-sans font-medium group-hover/add:text-indigo-600 transition-colors flex items-center gap-2">
                        <Plus size={13} className="text-slate-350 group-hover/add:text-indigo-500" />
                        Add activity ({slot.time})
                      </span>
                      <Sparkles size={12} className="text-slate-200 group-hover/add:text-indigo-300 transition-colors" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
