import { usePlanner } from '../context/PlannerContext';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Save, Sparkles, AlertCircle, Settings } from 'lucide-react';

export default function SettingsView() {
  const { 
    userProfile, 
    updateUserProfile, 
    currentDate, 
    setCurrentDate, 
    currentTime, 
    setCurrentTime,
    setVirtualTimeConfigured 
  } = usePlanner();

  // Settings states
  const [userName, setUserName] = useState(userProfile.name);
  const [userEmail, setUserEmail] = useState(userProfile.email);
  const [accentStyle, setAccentStyle] = useState<'classic' | 'warm' | 'cool'>('classic');
  const [showToast, setShowToast] = useState(false);

  // Virtual Clock Configuration States
  const [tempDate, setTempDate] = useState(currentDate);

  const timeMatch = currentTime.match(/^(\d+):(\d+)\s+(AM|PM)$/i);
  const defaultHour = timeMatch ? timeMatch[1] : '09';
  const defaultMin = timeMatch ? timeMatch[2] : '00';
  const defaultAmpm = timeMatch ? timeMatch[3].toUpperCase() : 'AM';

  const [tempHour, setTempHour] = useState(defaultHour);
  const [tempMin, setTempMin] = useState(defaultMin);
  const [tempAmpm, setTempAmpm] = useState(defaultAmpm);

  // Split and bind year from date
  const parsedYear = currentDate.split('-')[0] || '2026';
  const [tempYear, setTempYear] = useState(parsedYear);

  const handleDateChange = (dateVal: string) => {
    setTempDate(dateVal);
    const yr = dateVal.split('-')[0];
    if (yr) {
      setTempYear(yr);
    }
  };

  const handleYearChange = (yrVal: string) => {
    setTempYear(yrVal);
    const parts = tempDate.split('-');
    if (parts.length === 3) {
      setTempDate(`${yrVal}-${parts[1]}-${parts[2]}`);
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      // 1. Save Profile Preferences
      updateUserProfile(userName.trim(), userEmail.trim());

      // 2. Save Virtual Clock configuration at once!
      setCurrentDate(tempDate);
      setCurrentTime(`${tempHour.padStart(2, '0')}:${tempMin.padStart(2, '0')} ${tempAmpm}`);

      // 3. Set the simulated time system as fully configured
      setVirtualTimeConfigured(true);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Toast Alert popup banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-secondary text-on-secondary px-6 py-4 rounded-2xl shadow-xl flex items-center gap-2.5 font-sans text-sm font-bold border border-secondary/20"
          >
            <Sparkles size={16} className="text-white animate-bounce" />
            Planner preferences updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Header */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2.2rem] p-8 border border-white/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Settings size={22} />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-on-surface animate-fade">Preferences</h2>
            <p className="font-sans text-xs text-on-surface-variant font-medium mt-0.5">
              Personalize your branding details and visual coordinates
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Form card */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-on-surface border-b border-outline-variant/15 pb-3">
            Profile Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-sans font-bold text-outline select-none">Your Name</label>
              <div className="relative mt-1 focus-within:text-primary text-outline transition-colors">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User size={16} />
                </span>
                <input
                  id="settings-username-input"
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-outline-variant/40 bg-white/70 rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-sans font-bold text-outline select-none">Email Address</label>
              <div className="relative mt-1 focus-within:text-primary text-outline transition-colors">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail size={16} />
                </span>
                <input
                  id="settings-email-input"
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full border border-outline-variant/40 bg-white/70 rounded-xl pl-11 pr-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-on-surface border-b border-outline-variant/15 pt-3 pb-2">
            Virtual Clock Parameters
          </h3>
          <p className="text-xs text-on-surface-variant font-medium -mt-3 pb-2">
            Configure simulated temporal reference lines. Updates date travelers and active reminders globally.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            {/* Date Select */}
            <div>
              <label htmlFor="temp-date-picker" className="text-[10px] uppercase font-sans font-bold text-outline select-none">Simulated Date (Month & Day)</label>
              <input
                id="temp-date-picker"
                type="date"
                required
                value={tempDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full border border-outline-variant/40 bg-white/70 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 mt-1"
              />
            </div>

            {/* Year Input */}
            <div>
              <label htmlFor="temp-year-picker" className="text-[10px] uppercase font-sans font-bold text-outline select-none">Simulated Year</label>
              <input
                id="temp-year-picker"
                type="number"
                min="2020"
                max="2100"
                required
                value={tempYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full border border-outline-variant/40 bg-white/70 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-outline-variant/15">
            {/* Hour Selector */}
            <div>
              <label htmlFor="temp-hour-select" className="text-[10px] uppercase font-sans font-bold text-outline select-none">Simulated Hour</label>
              <select
                id="temp-hour-select"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
                className="w-full border border-outline-variant/40 bg-white/70 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 mt-1 cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Minute Selector */}
            <div>
              <label htmlFor="temp-minute-select" className="text-[10px] uppercase font-sans font-bold text-outline select-none">Simulated Minute</label>
              <select
                id="temp-minute-select"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                className="w-full border border-outline-variant/40 bg-white/70 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 mt-1 cursor-pointer"
              >
                {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* AM/PM Select */}
            <div>
              <label htmlFor="temp-ampm-select" className="text-[10px] uppercase font-sans font-bold text-outline select-none">Simulated Period</label>
              <select
                id="temp-ampm-select"
                value={tempAmpm}
                onChange={(e) => setTempAmpm(e.target.value)}
                className="w-full border border-outline-variant/40 bg-white/70 rounded-xl px-4 py-3 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 mt-1 cursor-pointer"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <h3 className="font-serif text-xl font-bold text-on-surface border-b border-outline-variant/15 pt-3 pb-3">
            Interface Cosmetics
          </h3>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-sans font-bold text-outline select-none">Color Scheme Preset</span>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'classic', label: 'Classic Serene', color: 'bg-primary' },
                { key: 'warm', label: 'Warm Orchard', color: 'bg-tertiary-container' },
                { key: 'cool', label: 'Earthy Mint', color: 'bg-secondary' },
              ].map(opt => (
                <button
                  id={`color-preset-select-${opt.key}`}
                  key={opt.key}
                  type="button"
                  onClick={() => setAccentStyle(opt.key as any)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    accentStyle === opt.key
                      ? 'border-primary/80 bg-primary/5 shadow-sm shadow-primary/5'
                      : 'border-outline-variant/30 bg-transparent hover:bg-white/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${opt.color} mb-2.5`} />
                  <span className="font-sans font-bold text-xs block text-on-surface leading-snug">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-outline-variant/15 ">
            <button
              id="settings-save-submit"
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary/95 text-on-primary rounded-full font-sans text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save size={15} />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
