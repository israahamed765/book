import { usePlanner } from '../context/PlannerContext';
import { 
  Calendar, 
  CalendarDays, 
  Repeat, 
  Settings, 
  Plus,
  Compass,
  BarChart3,
  X
} from 'lucide-react';

interface SidebarProps {
  onOpenQuickAdd: () => void;
}

export default function Sidebar({ onOpenQuickAdd }: SidebarProps) {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = usePlanner();

  const navItems = [
    { id: 'daily', label: 'Daily', icon: Calendar },
    { id: 'weekly', label: 'Weekly', icon: CalendarDays },
    { id: 'monthly', label: 'Monthly', icon: Compass },
    { id: 'habits', label: 'Habits', icon: Repeat },
    { id: 'history', label: 'History', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <>
      {/* Backdrop overlay on mobile screens */}
      {isSidebarOpen && (
        <div 
          id="mobile-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      <nav className={`fixed left-0 top-0 h-full w-64 border-r border-[#ffffff40] bg-[#faf9f7f8] lg:bg-[#faf9f760] backdrop-blur-xl flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Title */}
        <div className="mb-10 px-2 pt-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl text-primary font-bold tracking-tight">Planner</h1>
            <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">Stay Focused</p>
          </div>
          
          {/* Close button on mobile */}
          <button
            id="mobile-sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/5 lg:hidden cursor-pointer"
            title="Close navigation panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Link List */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`nav-tab-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Auto close mobile sidebar on select
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-sans transition-all duration-300 text-left cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold border-r-4 border-primary bg-primary/10 shadow-[inner_0_1px_2px_rgba(255,255,255,0.4)]'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual Action Button */}
        <div className="pt-4 border-t border-outline-variant/30 mt-auto">
          <button
            id="sidebar-new-entry-btn"
            onClick={() => {
              onOpenQuickAdd();
              setIsSidebarOpen(false); // Close sidebar on selection
            }}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary font-sans text-sm font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 hover:translate-y-[-1px] transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </nav>
    </>
  );
}
