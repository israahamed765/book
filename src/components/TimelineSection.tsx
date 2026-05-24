import { usePlanner } from '../context/PlannerContext';
import { Calendar, Trash2, Plus, Sparkles, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineSectionProps {
  onOpenAddSchedule: (timeSlot?: string) => void;
}

export default function TimelineSection({ onOpenAddSchedule }: TimelineSectionProps) {
  const { schedules, deleteSchedule, searchQuery, currentDate, setCurrentDate, openEditModal } = usePlanner();

  // Full day slot array
  const fullHourSlots = [
    { time: '07:00 AM', label: '07 AM' },
    { time: '08:00 AM', label: '08 AM' },
    { time: '09:00 AM', label: '09 AM' },
    { time: '11:00 AM', label: '11 AM' },
    { time: '01:00 PM', label: '01 PM' },
    { time: '03:00 PM', label: '03 PM' },
    { time: '06:00 PM', label: '06 PM' },
  ];

  const handlePrevDay = () => {
    const d = new Date(currentDate + "T12:00:00"); // Avoid meridian shifting
    d.setDate(d.getDate() - 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    setCurrentDate(`${yr}-${mo}-${dy}`);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    setCurrentDate(`${yr}-${mo}-${dy}`);
  };

  // Map schedules for current date to slots
  const dateSchedules = schedules.filter(s => s.date === currentDate);

  const slotsWithData = fullHourSlots.map(slot => {
    const item = dateSchedules.find(s => {
      const cleanTime = (t: string) => t.trim().toUpperCase().replace(/^0/, '');
      return cleanTime(s.time) === cleanTime(slot.time);
    });
    return { ...slot, item };
  });

  // Filter items matching search query
  const filteredSlots = slotsWithData.map(slot => {
    if (!searchQuery) return slot;
    const match = slot.item?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  slot.item?.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return { ...slot, item: match ? slot.item : undefined };
  });

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'meditation':
        return 'bg-[#e7f6f1] border-l-4 border-secondary text-on-secondary-container';
      case 'work':
        return 'bg-[#eeebff] border-l-4 border-primary text-on-primary-container';
      case 'sync':
        return 'bg-[#ffebd6] border-l-4 border-tertiary text-on-tertiary-container';
      case 'break':
        return 'bg-surface-container-high border-l-4 border-outline text-on-surface';
      default:
        return 'bg-surface-container-low border-l-4 border-outline-variant text-on-surface-variant';
    }
  };

  const getTagBg = (cat: string) => {
    switch (cat) {
      case 'meditation': return 'bg-secondary/10 text-secondary';
      case 'work': return 'bg-primary/10 text-primary';
      case 'sync': return 'bg-tertiary/15 text-tertiary';
      default: return 'bg-black/5 text-outline';
    }
  };

  const dObj = new Date(currentDate + "T12:00:00");
  const formattedDate = dObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 h-full flex flex-col shadow-sm">
      {/* Target Title Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-serif text-2xl text-on-surface font-bold">Timeline</h2>
          
          {/* Day Navigation Controls */}
          <div className="flex items-center gap-1.5 mt-2">
            <button
              id="prev-day-btn"
              onClick={handlePrevDay}
              className="p-1 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Previous Day"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-sans text-sm text-on-surface-variant/90 font-bold min-w-[125px] text-center select-none">
              {formattedDate}
            </span>
            <button
              id="next-day-btn"
              onClick={handleNextDay}
              className="p-1 hover:bg-black/5 rounded-full text-outline hover:text-on-surface cursor-pointer select-none"
              title="Next Day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {/* Toggle to today's actual date */}
        <button 
          id="today-reset-btn"
          onClick={() => setCurrentDate('2026-05-24')}
          className="p-2 bg-primary/5 text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
          title="Jump to Today (May 24)"
        >
          <Calendar size={18} />
        </button>
      </div>

      {/* Actual Scrolling List */}
      <div className="flex-1 space-y-0 relative pl-1.5 overflow-y-auto max-h-[580px] scrollbar-thin">
        {/* Timeline continuity connector line */}
        <div className="absolute left-14 top-4 bottom-4 w-0.5 bg-outline-variant/30 z-0"></div>

        <AnimatePresence initial={false}>
          {filteredSlots.map((slot, index) => {
            const hasItem = !!slot.item;
            
            return (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-6 min-h-[90px] group relative z-10"
              >
                {/* Time Indicator */}
                <span className="font-sans font-semibold text-xs text-outline/80 uppercase w-12 pt-3 select-none flex-shrink-0">
                  {slot.label}
                </span>

                {/* Core block content */}
                <div className="flex-1 pt-1.5 pb-4 border-b border-outline-variant/15 last:border-none">
                  {hasItem ? (
                    <div className={`p-4 rounded-2xl relative group/card transition-all duration-300 hover:shadow-md hover:translate-x-[2px] ${getCategoryStyles(slot.item!.category)}`}>
                      <div className="flex justify-between items-start">
                        <div className="pr-12">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-sans font-semibold text-sm leading-snug">
                              {slot.item!.title}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans uppercase font-bold flex-shrink-0 ${getTagBg(slot.item!.category)}`}>
                              {slot.item!.category}
                            </span>
                          </div>
                          {slot.item!.subtitle && (
                            <p className="text-xs mt-1 opacity-85 font-sans font-medium">
                              {slot.item!.subtitle}
                            </p>
                          )}
                        </div>
                        
                        {/* Interactive Edit & Delete button dock */}
                        <div className="opacity-0 group-hover/card:opacity-100 flex items-center gap-1 transition-all absolute right-2.5 top-2.5">
                          <button
                            id={`edit-schedule-${slot.item!.id}`}
                            onClick={() => openEditModal('schedule', slot.item!.id)}
                            className="p-1 border border-black/5 rounded-lg text-outline hover:text-primary hover:bg-black/5 transition-all outline-none cursor-pointer bg-white/60"
                            title="Edit schedule"
                          >
                            <Pencil size={12} strokeWidth={2.5} />
                          </button>
                          <button
                            id={`delete-schedule-${slot.item!.id}`}
                            onClick={() => deleteSchedule(slot.item!.id)}
                            className="p-1 border border-black/5 rounded-lg text-red-500 hover:bg-black/5 transition-all outline-none cursor-pointer bg-white/60"
                            title="Delete schedule"
                          >
                            <Trash2 size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Blank spot fallback builder */
                    <button
                      id={`timeline-add-${slot.time.replace(/\s+/g, '')}`}
                      onClick={() => onOpenAddSchedule(slot.time)}
                      className="w-full text-left p-3.5 border border-dashed border-outline-variant/50 hover:border-primary rounded-xl cursor-pointer group/add transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-xs text-outline/70 font-sans font-medium group-hover/add:text-primary transition-colors flex items-center gap-1.5">
                        <Plus size={12} className="text-outline/50 group-hover/add:text-primary" />
                        + Add activity ({slot.time})
                      </span>
                      <Sparkles size={11} className="text-outline/20 group-hover/add:text-primary/40 transition-colors" />
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
