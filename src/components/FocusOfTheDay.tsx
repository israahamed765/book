import { usePlanner } from '../context/PlannerContext';
import { Leaf, Clock, Edit2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';

export default function FocusOfTheDay() {
  const { focusItem, toggleFocusCompleted, updateFocusItem } = usePlanner();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(focusItem.title);
  const [editDuration, setEditDuration] = useState(focusItem.duration);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateFocusItem(editTitle, focusItem.isPriority, editDuration);
      setIsEditing(false);
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 overflow-hidden relative group shadow-sm">
      {/* Background visual graphics */}
      <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Focus of the Day</h2>
        
        {!isEditing && (
          <button 
            id="edit-focus-trigger-btn"
            onClick={() => {
              setEditTitle(focusItem.title);
              setEditDuration(focusItem.duration);
              setIsEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-outline hover:text-primary hover:bg-white/50 transition-all cursor-pointer"
            title="Update Focus"
          >
            <Edit2 size={13} />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="focus-title-edit"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-2xl font-serif font-bold bg-white/70 border border-primary/20 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            autoFocus
          />
          <div className="flex gap-4 items-center">
            <input
              id="focus-duration-edit"
              type="text"
              value={editDuration}
              placeholder="Duration tag (e.g. 3h Project)"
              className="text-xs bg-white/70 border border-primary/20 rounded-lg px-3 py-1.5 font-sans outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
            <button
              id="focus-edit-save-btn"
              type="submit"
              className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-semibold cursor-pointer hover:bg-primary/90"
            >
              Save Focus
            </button>
            <button
              id="focus-edit-cancel-btn"
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-outline font-semibold hover:text-on-surface cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Main Display Title */}
          <div className="flex-1">
            <h3 className={`font-serif text-3xl font-bold tracking-tight text-on-surface leading-tight transition-all ${focusItem.completed ? 'line-through text-outline/50' : ''}`}>
              {focusItem.title}
            </h3>
          </div>

          {/* Action indicator ring */}
          <div className="relative flex-shrink-0 self-center md:self-auto flex items-center justify-center">
            {/* Pulsing glow ring wrapper */}
            {!focusItem.completed && (
              <div className="absolute inset-0 rounded-full bg-secondary/15 blur-lg animate-pulse scale-110"></div>
            )}
            
            <button
              id="toggle-focus-status-btn"
              onClick={toggleFocusCompleted}
              className={`relative z-10 px-8 py-3.5 rounded-full font-sans font-semibold text-sm shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 ${
                focusItem.completed 
                  ? 'bg-primary-container/20 text-primary hover:bg-primary-container/30 shadow-none' 
                  : 'bg-secondary text-on-secondary hover:bg-secondary/90 hover:translate-y-[-1px]'
              }`}
            >
              {focusItem.completed ? (
                <>
                  <RotateCcw size={16} />
                  ReopenFocus
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Complete
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Meta Labels / Tag Chips */}
      <div className="mt-6 flex flex-wrap gap-3">
        {focusItem.isPriority && (
          <div className="flex items-center gap-1.5 bg-secondary-fixed/40 px-3.5 py-1.5 rounded-full border border-secondary/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Leaf size={12} className="text-on-secondary-fixed-variant fill-on-secondary-fixed-variant" />
            <span className="font-sans font-bold text-[10px] text-on-secondary-fixed-variant uppercase tracking-wider">Priority</span>
          </div>
        )}
        {focusItem.duration && (
          <div className="flex items-center gap-1.5 bg-primary-fixed/40 px-3.5 py-1.5 rounded-full border border-primary/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Clock size={12} className="text-on-primary-fixed-variant" />
            <span className="font-sans font-bold text-[10px] text-on-primary-fixed-variant uppercase tracking-wider">{focusItem.duration}</span>
          </div>
        )}
      </div>
    </section>
  );
}
