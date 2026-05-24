import { usePlanner } from '../context/PlannerContext';
import { 
  Plus, 
  Minus, 
  Droplet, 
  Footprints, 
  BookOpen, 
  Activity, 
  Sparkles,
  Smile,
  Zap,
  Flame,
  Trash2
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function HabitTrackerSection() {
  const { habits, incrementHabit, decrementHabit, addHabit, deleteHabit } = usePlanner();
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitTarget, setHabitTarget] = useState(8);
  const [habitUnit, setHabitUnit] = useState('cups');
  const [habitIcon, setHabitIcon] = useState('Droplets');

  const getIcon = (name: string, iconColor: string) => {
    switch (name) {
      case 'Droplets':
      case 'Hydration':
        return <Droplet className={`${iconColor}`} size={22} />;
      case 'Footprints':
      case 'Step Goal':
        return <Footprints className={`${iconColor}`} size={22} />;
      case 'BookOpen':
      case 'Reading':
        return <BookOpen className={`${iconColor}`} size={22} />;
      default:
        return <Smile className={`${iconColor}`} size={22} />;
    }
  };

  const handleCreateHabit = (e: FormEvent) => {
    e.preventDefault();
    if (habitName.trim() && habitTarget > 0) {
      addHabit(habitName.trim(), habitIcon, habitTarget, habitUnit);
      setHabitName('');
      setShowAddModal(false);
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm relative overflow-hidden group">
      {/* Header element */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-sans font-bold text-xs uppercase tracking-widest text-outline">Habit Tracking</h2>
        
        <button
          id="habits-add-toggle-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full cursor-pointer transition-all"
        >
          <Plus size={12} />
          Create Habit
        </button>
      </div>

      {/* Grid List Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <AnimatePresence initial={false}>
          {habits.map((habit) => {
            const isFinished = habit.count >= habit.target;
            const progressPct = Math.min(Math.round((habit.count / habit.target) * 100), 100);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-2 group/habit relative p-2.5 rounded-2xl hover:bg-white/40 border border-transparent hover:border-white/20 transition-all text-center select-none"
              >
                {/* Trash custom habit */}
                {habit.id.startsWith('h_') && (
                  <button
                    id={`delete-habit-${habit.id}`}
                    onClick={() => deleteHabit(habit.id)}
                    className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-500 rounded opacity-0 group-hover/habit:opacity-100 transition-opacity cursor-pointer z-10"
                    title="Remove Habit"
                  >
                    <Trash2 size={11} />
                  </button>
                )}

                {/* Micro-Tracker circular outer indicator */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Radial progress circle border using SVG */}
                  <svg className="absolute w-full h-full transform -rotate-90 select-none pointer-events-none">
                    <circle
                      cx="32"
                      cy="32"
                      r="29"
                      strokeWidth="2.5"
                      stroke="rgba(0,0,0,0.04)"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="29"
                      strokeWidth="2.5"
                      stroke={habit.colorClass.includes('text-secondary') ? '#3a6758' : '#5950b6'}
                      fill="transparent"
                      strokeDasharray={182.2}
                      strokeDashoffset={182.2 - (progressPct / 100) * 182.2}
                      transition={{ duration: 0.8 }}
                    />
                  </svg>

                  {/* Core Action Button Trigger */}
                  <button
                    id={`habit-click-trigger-${habit.id}`}
                    onClick={() => incrementHabit(habit.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isFinished
                        ? 'bg-secondary/15 text-secondary border-2 border-secondary/60'
                        : 'bg-white/80 border border-outline-variant/30 text-outline-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {/* Icon wrapper */}
                    {getIcon(habit.icon, isFinished ? 'text-secondary' : 'text-on-surface-variant group-hover/habit:text-primary')}
                  </button>
                </div>

                {/* Meta details */}
                <span className="font-sans font-bold text-xs text-on-surface leading-tight">
                  {habit.name}
                </span>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-sans font-bold text-outline uppercase tracking-wider select-text">
                    {habit.count.toLocaleString()} / {habit.target.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-sans text-on-surface-variant/50">
                    {habit.unit}
                  </span>
                </div>

                {/* Embedded dynamic controls trigger */}
                <div className="flex gap-1.5 mt-1.5 bg-black/5 rounded-full p-0.5 opacity-0 group-hover/habit:opacity-100 transition-all duration-200">
                  <button
                    id={`habit-minus-${habit.id}`}
                    aria-label="Subtract"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementHabit(habit.id);
                    }}
                    className="p-1 rounded-full text-on-surface-variant hover:text-red-500 hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    <Minus size={9} />
                  </button>
                  <button
                    id={`habit-plus-${habit.id}`}
                    aria-label="Add"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementHabit(habit.id);
                    }}
                    className="p-1 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    <Plus size={9} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Habit Creation Overlay Modals */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full border border-outline-variant/20 shadow-xl"
            >
              <h3 className="font-serif text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                Add Custom Habit
              </h3>
              
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-outline">Habit Name</label>
                  <input
                    id="new-habit-name-input"
                    type="text"
                    required
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="e.g. Work out, Call mom"
                    className="w-full border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline">Target Goal</label>
                    <input
                      id="new-habit-target-input"
                      type="number"
                      required
                      min={1}
                      value={habitTarget}
                      onChange={(e) => setHabitTarget(parseInt(e.target.value) || 1)}
                      className="w-full border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-outline">Unit of measure</label>
                    <input
                      id="new-habit-unit-input"
                      type="text"
                      required
                      value={habitUnit}
                      onChange={(e) => setHabitUnit(e.target.value)}
                      placeholder="e.g. cups, mins"
                      className="w-full border border-outline-variant/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-outline block mb-1">Pick Icon</label>
                  <div className="flex gap-2">
                    {['Droplets', 'Footprints', 'BookOpen', 'Smile'].map(ic => (
                      <button
                        id={`habit-icon-picker-${ic}`}
                        key={ic}
                        type="button"
                        onClick={() => setHabitIcon(ic)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          habitIcon === ic 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'border-outline-variant/40 text-outline hover:bg-black/5'
                        }`}
                      >
                        {ic === 'Droplets' && <Droplet size={18} />}
                        {ic === 'Footprints' && <Footprints size={18} />}
                        {ic === 'BookOpen' && <BookOpen size={18} />}
                        {ic === 'Smile' && <Smile size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    id="habit-cancel-btn"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-outline hover:text-on-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="habit-save-btn"
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-semibold cursor-pointer shadow-sm hover:bg-primary/90"
                  >
                    Add Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
