import { usePlanner } from '../context/PlannerContext';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, Smile, Flame, CheckCircle, Droplet, BookOpen, Footprints, Plus } from 'lucide-react';

export default function HabitsFullView() {
  const { habits, incrementHabit, decrementHabit } = usePlanner();

  const getIcon = (name: string, iconColor: string) => {
    switch (name) {
      case 'Droplets':
      case 'Hydration':
        return <Droplet className={`${iconColor}`} size={26} />;
      case 'Footprints':
      case 'Step Goal':
        return <Footprints className={`${iconColor}`} size={26} />;
      case 'BookOpen':
      case 'Reading':
        return <BookOpen className={`${iconColor}`} size={26} />;
      default:
        return <Smile className={`${iconColor}`} size={26} />;
    }
  };

  const completedCount = habits.filter(h => h.count >= h.target).length;

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
            <h2 className="font-serif text-3xl font-bold text-on-surface">Habit Core</h2>
            <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
              Cultivate positive loops and monitor active streaks over time
            </p>
          </div>
          <div className="bg-secondary-container px-4.5 py-2.5 rounded-full border border-secondary/25 flex items-center gap-2">
            <Flame size={15} className="text-secondary" />
            <span className="text-xs font-sans font-bold text-on-secondary-container">STREAK: 12 DAYS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Grid: Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <CheckCircle size={22} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-on-surface">{completedCount} / {habits.length}</h4>
            <p className="font-sans text-xs text-outline font-medium">Habits Finished Today</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-on-surface">88%</h4>
            <p className="font-sans text-xs text-outline font-medium">Consistency Rating</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
            <Award size={22} />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-on-surface">Gold Milestone</h4>
            <p className="font-sans text-xs text-outline font-medium">Current Goal Achievement</p>
          </div>
        </div>
      </div>

      {/* Detailed progress list cards */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const progressPct = Math.min(Math.round((habit.count / habit.target) * 100), 100);
          const isFinished = habit.count >= habit.target;
          
          return (
            <div
              key={habit.id}
              className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isFinished ? 'bg-secondary/15' : 'bg-black/5'}`}>
                  {getIcon(habit.icon, isFinished ? 'text-secondary' : 'text-outline')}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                    {habit.name}
                    {isFinished && <span className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full font-sans uppercase font-bold text-[8px]">Goal met</span>}
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant font-medium">
                    Current progress: {habit.count} of {habit.target} {habit.unit}
                  </p>
                </div>
              </div>

              {/* Progress Slider block */}
              <div className="flex-1 max-w-md">
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden shadow-inner flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${isFinished ? 'bg-secondary' : 'bg-primary'}`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-wide text-outline mt-1.5 select-none">
                  <span>PROGRESS</span>
                  <span>{progressPct}%</span>
                </div>
              </div>

              {/* Fast triggers row */}
              <div className="flex items-center gap-3">
                <button
                  id={`habits-view-minus-${habit.id}`}
                  onClick={() => decrementHabit(habit.id)}
                  className="px-4 py-2 bg-black/5 hover:bg-black/10 rounded-full font-sans text-xs font-semibold text-on-surface-variant cursor-pointer"
                >
                  - Decrement
                </button>
                <button
                  id={`habits-view-plus-${habit.id}`}
                  onClick={() => incrementHabit(habit.id)}
                  className="px-4.5 py-2.5 bg-primary hover:bg-primary/95 text-on-primary rounded-full font-sans text-xs font-bold shadow-md shadow-primary/10 cursor-pointer"
                >
                  + Log progress
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
