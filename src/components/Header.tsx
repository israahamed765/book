// import { usePlanner } from '../context/PlannerContext';
// import { Search, Bell, Sparkles, X, Menu ,User} from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { useState, useEffect } from 'react';
// const [realTime, setRealTime] = useState(new Date());
// interface HeaderProps {
//   onOpenQuickAdd: () => void;
// }

// export default function Header({ onOpenQuickAdd }: HeaderProps) {
//   const {
//     searchQuery,
//     setSearchQuery,
//     userProfile,
//     tasks,
//     schedules,
//     currentDate,
//     setCurrentDate,
//     currentTime,
//     setCurrentTime,
//     isSidebarOpen,
//     setIsSidebarOpen
//   } = usePlanner();

//   const [showNotificationCount, setShowNotificationCount] = useState(true);
//   const [showNotificationsToast, setShowNotificationsToast] = useState(false);

//   // Background active alerts
//   const [notifiedItemIds, setNotifiedItemIds] = useState<Record<string, boolean>>({});
//   const [activeAlert, setActiveAlert] = useState<{ title: string; subtitle?: string; time: string } | null>(null);

//   const pendingTasksCount = tasks.filter(t => !t.completed).length;

//   useEffect(() => {
//     // Whenever current simulated date/time changes, check for matching schedules
//     const todaySchedules = schedules.filter(s => s.date === currentDate);
    
//     todaySchedules.forEach(item => {
//       const itemTimeClean = item.time.trim().toUpperCase().replace(/^0/, '');
//       const currentCheckClean = currentTime.trim().toUpperCase().replace(/^0/, '');

//       if (itemTimeClean === currentCheckClean && !notifiedItemIds[item.id]) {
//         // Trigger browser notification
//         if ('Notification' in window && Notification.permission === 'granted') {
//           try {
//             new Notification(`Aura Schedule Reminder: ${item.title}`, {
//               body: item.subtitle || `Scheduled for ${item.time}`,
//             });
//           } catch (err) {
//             console.error('Failed sending push notification', err);
//           }
//         }

//         // Trigger in-app notification card
//         setActiveAlert({
//           title: item.title,
//           subtitle: item.subtitle,
//           time: item.time
//         });

//         // Track notification trigger state key
//         setNotifiedItemIds(prev => ({ ...prev, [item.id]: true }));
//       }
//     });

//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, [currentDate, currentTime, schedules, notifiedItemIds]);

//   const clearAlertHistory = () => {
//     setNotifiedItemIds({});
//     setActiveAlert(null);
//   };
// useEffect(() => {
//   const timer = setInterval(() => {
//     setRealTime(new Date());
//   }, 1000); // تحديث كل ثانية
//   return () => clearInterval(timer);
// }, []);
//   return (
//     <header className="fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-16rem)] flex justify-between items-center h-20 px-4 md:px-10 bg-[#faf9f740] backdrop-blur-md border-b border-white/20 ml-0 lg:ml-64">
//       {/* Brand & Search */}
//       <div className="flex items-center gap-2 md:gap-6">
//         {/* Mobile Hamburger toggle button */}
//         <button
//           id="mobile-hamburger-toggle"
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 -ml-1 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 lg:hidden cursor-pointer flex items-center justify-center transition-colors"
//           title="Open Menu"
//         >
//           <Menu size={20} />
//         </button>

//         <span className="font-serif text-[15px] sm:text-lg md:text-2xl text-primary font-bold tracking-tight whitespace-nowrap">Aura Planner</span>
        
//         <div className="relative hidden xl:block">
//           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
//           <input
//             id="global-search-input"
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search tasks or schedules..."
//             className="pl-11 pr-5 py-2.5 bg-white/50 border border-outline-variant/20 rounded-full w-52 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm font-sans text-on-surface placeholder:text-outline/50 transition-all outline-none"
//           />
//         </div>
//       </div>
// <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-outline-variant/20">
//   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
//     Live: {realTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
//   </span>
// </div>
  
//       {/* <div id="virtual-time-controller" className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 p-1 sm:p-1.5 px-2.5 sm:px-3 rounded-full border border-primary/20 text-on-surface shadow-xs">
//         <span className="text-[9px] uppercase font-sans font-extrabold tracking-wider text-primary hidden md:flex items-center gap-1.5 flex-shrink-0 select-none">
//           <Sparkles size={11} className="text-primary animate-pulse" />
//           Virtual Clock
//         </span>

//         <span className="text-[10px] sm:text-xs font-bold font-mono px-2 py-0.5 sm:py-1 bg-white/95 rounded-md border border-outline-variant/30 text-on-surface select-all whitespace-nowrap">
//           {currentDate} • {currentTime}
//         </span>

//         {/* Reset Alarm handler */}
//         {/* <button
//           id="header-clear-alarms"
//           onClick={clearAlertHistory}
//           className="ml-0.5 px-2 py-0.5 sm:py-1 bg-primary text-on-primary font-sans text-[9px] font-bold tracking-wider uppercase rounded-full hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap shadow-xs hover:scale-105 active:scale-95 font-medium"
//           title="Reset notification trigger states"
//         >
//           Reset
//         </button>
//       </div> */} 

//       {/* Actions & Avatar */}
//       <div className="flex items-center gap-2 sm:gap-6">
//         {/* Quick Add Outline Button */}
//         <button
//           id="header-quick-add-btn"
//           onClick={onOpenQuickAdd}
//           className="hidden sm:flex items-center gap-1.5 px-4 sm:px-5 py-2.5 border border-primary text-primary hover:bg-primary/5 rounded-full font-sans text-xs font-semibold hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
//         >
//           <Sparkles size={13} className="text-primary" />
//           Quick Add
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             id="notifications-bell-btn"
//             onClick={() => {
//               setShowNotificationsToast(true);
//               setShowNotificationCount(false);
//               setTimeout(() => setShowNotificationsToast(false), 5000);
//             }}
//             className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/40 transition-colors cursor-pointer relative"
//           >
//             <Bell size={20} />
//             {showNotificationCount && pendingTasksCount > 0 && (
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tertiary rounded-full ring-2 ring-background"></span>
//             )}
//           </button>

//           {/* Toast Notification Notification */}
//           <AnimatePresence>
//             {showNotificationsToast && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                 className="absolute right-0 mt-2 w-80 bg-white/95 rounded-2xl p-4 shadow-xl border border-outline-variant/20 backdrop-blur-md z-50"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h5 className="text-sm font-bold text-on-surface font-sans">Aura Focus Update</h5>
//                     <p className="text-xs text-on-surface-variant font-sans mt-1">
//                       You have {pendingTasksCount} pending tasks remaining. Launch v1.2 Design Specs is your focal point of the day.
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* User Account */}
//         <div className="flex items-center gap-3">
//           <div className="text-right hidden sm:block">
//             <p className="text-xs font-bold font-sans text-on-surface">{userProfile.name}</p>
//             <p className="text-[10px] font-sans text-on-surface-variant/70">{userProfile.email}</p>
//           </div>
//          {userProfile.avatarUrl ? (
//     <img
//       id="user-avatar-image"
//       alt="User profile"
//       src={userProfile.avatarUrl}
//       className="w-10 h-10 rounded-full object-cover border-2 border-white/60 shadow-md shadow-black/5"
//     />
//   ) : (
//     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-white/60 shadow-md shadow-black/5">
//       <User size={18} />
//     </div>
//   )}
//         </div>
//       </div>

//       {/* Global In-app notification toast alert matches */}
//       <AnimatePresence>
//         {activeAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -50, scale: 0.9 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20, scale: 0.9 }}
//             className="fixed top-6 right-6 z-50 w-96 bg-[#867bc5] text-white rounded-[1.5rem] p-5 shadow-2xl border border-white/20 select-none"
//           >
//             <div className="flex justify-between items-start">
//               <div className="flex gap-3">
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0 animate-bounce">
//                   <Bell size={18} />
//                 </div>
//                 <div>
//                   <span className="text-[9px] uppercase tracking-wider font-bold text-white/70">Aura Reminder Alarm</span>
//                   <h4 className="font-serif text-base font-bold leading-snug mt-0.5">{activeAlert.title}</h4>
//                   {activeAlert.subtitle && <p className="text-xs text-white/85 font-sans mt-1">{activeAlert.subtitle}</p>}
//                   <span className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white">
//                     Scheduled Hour: {activeAlert.time}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 id="close-active-alarm-toast"
//                 onClick={() => setActiveAlert(null)}
//                 className="p-1 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }



import { usePlanner } from '../context/PlannerContext';
import { Search, Bell, Sparkles, X, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenQuickAdd: () => void;
}

export default function Header({ onOpenQuickAdd }: HeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    userProfile,
    tasks,
    schedules,
    currentDate,
    isSidebarOpen,
    setIsSidebarOpen
  } = usePlanner();

  // الحالة للوقت الحقيقي (تم نقلها إلى داخل المكون لتجنب الخطأ)
  const [realTime, setRealTime] = useState(new Date());
  const [showNotificationCount, setShowNotificationCount] = useState(true);
  const [showNotificationsToast, setShowNotificationsToast] = useState(false);
  const [notifiedItemIds, setNotifiedItemIds] = useState<Record<string, boolean>>({});
  const [activeAlert, setActiveAlert] = useState<{ title: string; subtitle?: string; time: string } | null>(null);

  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // منطق الاشعارات (يعتمد الآن على الوقت الحقيقي)
  useEffect(() => {
    const todaySchedules = schedules.filter(s => s.date === currentDate);
    
    // تحويل الوقت الحقيقي لصيغة تشبه صيغة بياناتك (مثلاً "09:00 AM")
    const currentTimeString = realTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase();

    todaySchedules.forEach(item => {
      // تنظيف الوقت للمقارنة
      const itemTimeClean = item.time.trim().toUpperCase();
      const currentCheckClean = currentTimeString.trim().toUpperCase();

      if (itemTimeClean === currentCheckClean && !notifiedItemIds[item.id]) {
        setActiveAlert({
          title: item.title,
          subtitle: item.subtitle,
          time: item.time
        });
        setNotifiedItemIds(prev => ({ ...prev, [item.id]: true }));
      }
    });
  }, [realTime, currentDate, schedules, notifiedItemIds]);

  return (
    <header className="fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-16rem)] flex justify-between items-center h-20 px-4 md:px-10 bg-[#faf9f740] backdrop-blur-md border-b border-white/20 ml-0 lg:ml-64">
      
      {/* Brand & Search */}
      <div className="flex items-center gap-2 md:gap-6">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2">
          <Menu size={20} />
        </button>
        <span className="font-serif text-2xl text-primary font-bold">Aura Planner</span>
        
        {/* عرض الوقت الحقيقي */}
        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-outline-variant/20">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Live: {realTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Actions & Avatar */}
      <div className="flex items-center gap-6">
        <button onClick={onOpenQuickAdd} className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 border border-primary text-primary rounded-full text-xs font-semibold">
          <Sparkles size={13} /> Quick Add
        </button>

        <div className="relative">
          <button onClick={() => setShowNotificationsToast(!showNotificationsToast)} className="p-2 rounded-full">
            <Bell size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold">{userProfile.name}</p>
          </div>
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="User" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Alert Toast */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div className="fixed top-6 right-6 z-50 w-80 bg-[#867bc5] text-white p-4 rounded-2xl shadow-xl">
             <h4 className="font-bold">{activeAlert.title}</h4>
             <button onClick={() => setActiveAlert(null)} className="absolute top-2 right-2"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}