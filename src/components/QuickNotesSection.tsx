import { usePlanner } from '../context/PlannerContext';
import { PenTool, Notebook, Plus, X } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';

export default function QuickNotesSection() {
  const { quickNote, updateQuickNote } = usePlanner();
  const [localText, setLocalText] = useState(quickNote.text);
  const [newLabel, setNewLabel] = useState('');
  const [showAddLabel, setShowAddLabel] = useState(false);

  // Sync with context changes
  useEffect(() => {
    setLocalText(quickNote.text);
  }, [quickNote.text]);

  const handleTextChange = (val: string) => {
    setLocalText(val);
    updateQuickNote(val, quickNote.labels);
  };

  const toggleLabel = (label: string) => {
    let updated: string[];
    if (quickNote.labels.includes(label)) {
      updated = quickNote.labels.filter(l => l !== label);
    } else {
      updated = [...quickNote.labels, label];
    }
    updateQuickNote(quickNote.text, updated);
  };

  const handleAddCustomLabel = (e: FormEvent) => {
    e.preventDefault();
    if (newLabel.trim() && !quickNote.labels.includes(newLabel.trim())) {
      const updated = [...quickNote.labels, newLabel.trim()];
      updateQuickNote(quickNote.text, updated);
      setNewLabel('');
      setShowAddLabel(false);
    }
  };

  const presetLabels = ['Idea', 'Project Aura', 'Personal', 'Review', 'Meeting'];

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm flex-1 flex flex-col group relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Notebook size={18} className="text-primary" />
          <h2 className="font-serif text-xl text-on-surface font-bold">Quick Notes</h2>
        </div>
        <PenTool size={16} className="text-outline/40 group-hover:text-primary transition-colors" />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Dynamic Textarea */}
        <textarea
          id="quicknote-textarea"
          value={localText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full flex-1 min-h-[100px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 font-sans text-sm text-on-surface placeholder:text-outline/40 leading-relaxed outline-none"
          placeholder="Capture a thought..."
        />

        {/* Dynamic Activity Labels Row */}
        <div className="mt-4 pt-3 border-t border-outline-variant/10 flex flex-wrap items-center gap-2">
          {presetLabels.map(label => {
            const isSelected = quickNote.labels.includes(label);
            return (
              <button
                id={`note-pill-tag-${label.replace(/\s+/g, '')}`}
                key={label}
                onClick={() => toggleLabel(label)}
                className={`px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? label === 'Idea' 
                      ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                      : label === 'Project Aura'
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-sm'
                      : 'bg-tertiary-fixed text-on-tertiary-fixed shadow-sm'
                    : 'bg-black/5 text-outline/70 hover:bg-black/10'
                }`}
              >
                {label}
              </button>
            );
          })}

          {/* Add custom tag */}
          {showAddLabel ? (
            <form onSubmit={handleAddCustomLabel} className="inline-flex items-center bg-white/50 border border-primary/20 rounded-full pl-2.5 pr-1 py-0.5">
              <input
                id="custom-label-input"
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Tag name"
                className="w-16 bg-transparent border-none outline-none text-[10px] font-bold uppercase p-0 focus:ring-0"
                autoFocus
              />
              <button
                id="submit-custom-label"
                type="submit"
                className="p-0.5 text-primary hover:text-primary/80 cursor-pointer"
              >
                <Plus size={10} />
              </button>
              <button
                id="cancel-custom-label"
                type="button"
                onClick={() => setShowAddLabel(false)}
                className="p-0.5 text-outline hover:text-on-surface cursor-pointer"
              >
                <X size={10} />
              </button>
            </form>
          ) : (
            <button
              id="add-label-pill"
              onClick={() => setShowAddLabel(true)}
              className="px-2 py-0.5 border border-dashed border-outline-variant text-outline/70 hover:text-primary hover:border-primary rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all flex items-center gap-0.5"
            >
              <Plus size={10} />
              Tag
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
