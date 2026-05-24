import { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TimelineSection from './components/TimelineSection';
import FocusOfTheDay from './components/FocusOfTheDay';
import TodoListSection from './components/TodoListSection';
import GratitudeSection from './components/GratitudeSection';
import QuickNotesSection from './components/QuickNotesSection';
import HabitTrackerSection from './components/HabitTrackerSection';
import QuickAddModal from './components/QuickAddModal';

// Expanded Tab views
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import HabitsFullView from './components/HabitsFullView';
import SettingsView from './components/SettingsView';
import HistoryView from './components/HistoryView';

import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function DashboardGrid() {
  const {
    activeTab,
    setActiveTab,
    isQuickAddOpen,
    setIsQuickAddOpen,
    modalInitialTab,
    editingItem,
    openAddModal,
    virtualTimeConfigured
  } = usePlanner();

  return (
    <div className="min-h-screen bg-[#faf9f7] text-on-surface antialiased font-sans">
      {/* Structural Sidebar Rail */}
      <Sidebar onOpenQuickAdd={() => openAddModal('task')} />

      {/* Main Container Core */}
      <div className="ml-0 lg:ml-64 pt-20 min-h-screen flex flex-col">
        {/* Upper Header Control panel */}
        <Header onOpenQuickAdd={() => openAddModal('task')} />

        {/* Scrolling Inner Container */}
        <main className="flex-1 p-4 sm:p-10 leading-normal select-none">
          <div className="max-w-7xl mx-auto h-full space-y-6">
            {/* Elegant banner notification asking to configure the virtual clock */}
            <AnimatePresence>
              {!virtualTimeConfigured && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -15 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -15 }}
                  className="bg-[#faf1da] border border-[#f0dfb2] rounded-[1.5rem] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 flex-shrink-0 text-lg">
                      🕒
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-amber-950">Initialize Simulated Reference Lines</h4>
                      <p className="font-sans text-xs text-amber-800 mt-0.5">
                        To activate notifications, calendars, and accurate tracking, please initialize the Simulated Date, Year, and Hour criteria.
                      </p>
                    </div>
                  </div>
                  <button
                    id="setup-virtual-clock-warning-btn"
                    onClick={() => setActiveTab('settings')}
                    className="flex-shrink-0 self-start sm:self-center px-4.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    Setup System Parameters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === 'daily' && (
                <motion.div
                  key="daily-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="grid grid-cols-12 gap-6 items-start"
                >
                  {/* Left Column Section: Dynamic Timeline scheduler */}
                  <div className="col-span-12 lg:col-span-5 xl:col-span-4 h-full">
                    <TimelineSection onOpenAddSchedule={(slot) => openAddModal('schedule')} />
                  </div>

                  {/* Right Column Section: To-Do list, Focus Goal, Gratitude, Habits */}
                  <div className="col-span-12 lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                    {/* Focal point of the day */}
                    <FocusOfTheDay />

                    {/* Multi-widget row (To-Do list vs Gratitude stack) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* Left: Checkable To-Do List */}
                      <TodoListSection />

                      {/* Right: Gratitude & Quick Notes Stack */}
                      <div className="flex flex-col gap-6">
                        <GratitudeSection />
                        <QuickNotesSection />
                      </div>
                    </div>

                    {/* Circular Micro-Habits tracking dock */}
                    <HabitTrackerSection />
                  </div>
                </motion.div>
              )}

              {activeTab === 'weekly' && <WeeklyView key="weekly-view" />}
              {activeTab === 'monthly' && <MonthlyView key="monthly-view" />}
              {activeTab === 'habits' && <HabitsFullView key="habits-view" />}
              {activeTab === 'history' && <HistoryView key="history-view" />}
              {activeTab === 'settings' && <SettingsView key="settings-view" />}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global floating context FAB button */}
      <button
        id="global-fab-btn"
        onClick={() => openAddModal('task')}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary hover:bg-primary/90 text-on-primary rounded-full shadow-[0_10px_25px_rgba(89,80,182,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-40 group"
        title="Add target item"
      >
        <Plus size={28} className="text-on-primary group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Dynamic Modal Overlay Dialogs */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialTab={modalInitialTab}
        editItem={editingItem}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <DashboardGrid />
    </PlannerProvider>
  );
}
