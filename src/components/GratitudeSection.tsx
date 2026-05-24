import { usePlanner } from '../context/PlannerContext';
import { Heart, Edit2, Check } from 'lucide-react';
import { useState } from 'react';

export default function GratitudeSection() {
  const { gratitude, updateGratitude } = usePlanner();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(gratitude);

  const handleSave = () => {
    if (editText.trim()) {
      updateGratitude(editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm flex-1 flex flex-col group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-3 translate-y-[-3px] select-none pointer-events-none">
        <Heart size={140} className="text-tertiary fill-tertiary" />
      </div>

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-tertiary fill-tertiary" />
          <h2 className="font-serif text-xl text-on-surface font-bold">Gratitude</h2>
        </div>

        {/* Change toggle trigger */}
        {!isEditing && (
          <button
            id="edit-gratitude-btn"
            onClick={() => {
              setEditText(gratitude);
              setIsEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-outline hover:text-tertiary hover:bg-white/50 transition-all cursor-pointer"
            title="Update Gratitude Entry"
          >
            <Edit2 size={12} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              id="gratitude-input-field"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-sm font-sans italic bg-white/70 border border-tertiary/20 rounded-xl p-3 outline-none focus:ring-2 focus:ring-tertiary/20 text-on-surface-variant min-h-[90px] resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                id="cancel-gratitude-btn"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs text-outline font-semibold hover:text-on-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-gratitude-btn"
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-tertiary hover:bg-tertiary/90 text-on-tertiary rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-sm shadow-tertiary/10"
              >
                <Check size={12} />
                Save
              </button>
            </div>
          </div>
        ) : (
          <blockquote 
            onDoubleClick={() => {
              setEditText(gratitude);
              setIsEditing(true);
            }}
            className="font-serif text-[17px] italic text-on-surface-variant leading-relaxed select-text cursor-pointer hover:text-on-surface transition-colors"
            title="Double click to edit"
          >
            "{gratitude}"
          </blockquote>
        )}
      </div>
    </section>
  );
}
