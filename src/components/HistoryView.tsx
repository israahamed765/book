import { usePlanner } from '../context/PlannerContext';
import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  Flame, 
  CheckCircle2, 
  Compass, 
  Smile, 
  Calendar, 
  BarChart4, 
  TrendingUp, 
  Award,
  Zap,
  Activity,
  Droplet,
  BookOpen,
  Footprints
} from 'lucide-react';

export default function HistoryView() {
  const { habits, habitHistory, currentDate } = usePlanner();
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || 'h1');
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'trends'>('overview');

  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  // 1. Calculate the last 7 dates based on currentDate state
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(currentDate + "T12:00:00");
    d.setDate(d.getDate() - i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    last7Days.push(`${yr}-${mo}-${dy}`);
  }

  // 2. Format the chart dataset
  const chartData = last7Days.map(dStr => {
    const d = new Date(dStr + "T12:00:00");
    const formattedLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    
    const dayData: Record<string, any> = {
      date: dStr,
      label: formattedLabel,
    };

    let totalProgressPct = 0;
    let completedCountOnDay = 0;

    habits.forEach(h => {
      let count = 0;
      if (dStr === currentDate) {
        count = h.count; // use active count for today
      } else {
        count = habitHistory[dStr]?.[h.id] ?? 0;
      }
      dayData[h.id] = count;
      dayData[h.name] = count;
      const progressPct = Math.min(Math.round((count / h.target) * 100), 100);
      dayData[`${h.name}_pct`] = progressPct;
      
      totalProgressPct += progressPct;
      if (count >= h.target) {
        completedCountOnDay += 1;
      }
    });

    // Average compliance on this day
    dayData.avg_pct = habits.length > 0 ? Math.round(totalProgressPct / habits.length) : 0;
    dayData.completed_count = completedCountOnDay;

    return dayData;
  });

  // Calculate high level achievements over the 7 days
  let perfectDaysCount = 0;
  let totalTargetsReached = 0;
  const habitPerformances = habits.map(h => {
    let metCount = 0;
    let currentStreakSum = 0;
    last7Days.forEach(dStr => {
      let val = 0;
      if (dStr === currentDate) val = h.count;
      else val = habitHistory[dStr]?.[h.id] ?? 0;
      
      if (val >= h.target) {
        metCount++;
      }
    });
    return {
      id: h.id,
      name: h.name,
      target: h.target,
      unit: h.unit,
      metDays: metCount,
      color: h.colorClass
    };
  });

  chartData.forEach(day => {
    if (day.completed_count === habits.length && habits.length > 0) {
      perfectDaysCount++;
    }
    totalTargetsReached += day.completed_count;
  });

  const totalPossibleTargets = last7Days.length * habits.length;
  const overallConsistency = totalPossibleTargets > 0 
    ? Math.round((totalTargetsReached / totalPossibleTargets) * 100) 
    : 0;

  const getIcon = (iconName: string, active: boolean) => {
    const cls = active ? 'text-white' : 'text-outline';
    switch (iconName) {
      case 'Droplets':
      case 'Hydration':
        return <Droplet size={18} className={cls} />;
      case 'Footprints':
      case 'Step Goal':
        return <Footprints size={18} className={cls} />;
      case 'BookOpen':
      case 'Reading':
        return <BookOpen size={18} className={cls} />;
      default:
        return <Smile size={18} className={cls} />;
    }
  };

  // Render tooltip formatted in rich aesthetic
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-outline-variant/10 font-sans text-xs select-none">
          <p className="font-bold text-on-surface mb-2">{label}</p>
          <div className="space-y-1.5 text-on-surface-variant">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {item.value}{item.name.toLowerCase().includes('pct') || item.name.toLowerCase().includes('average') ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

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
            <h2 className="font-serif text-3xl font-bold text-on-surface">Analytics History</h2>
            <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
              Visualize habit compliance curves, success rates and individual trends over the last 7 days
            </p>
          </div>
          <div className="bg-primary/10 px-4.5 py-2.5 rounded-full border border-primary/20 flex items-center gap-2">
            <Activity size={15} className="text-primary animate-pulse" />
            <span className="text-xs font-sans font-bold text-primary">REAL-TIME BI SYNCHRONIZATION RUNNING</span>
          </div>
        </div>
      </div>

      {/* Highlights Metrics Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Consistency metric */}
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={22} />
          </div>
          <div>
            <h4 className="font-serif text-2xl font-black text-on-surface">{overallConsistency}%</h4>
            <p className="font-sans text-xs text-outline font-medium">Compliance Index</p>
          </div>
        </div>

        {/* Perfect Days metric */}
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Award size={22} />
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold text-on-surface">{perfectDaysCount} / 7 Days</h4>
            <p className="font-sans text-xs text-outline font-medium">100% Targets Met</p>
          </div>
        </div>

        {/* Total completed metrics */}
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold text-on-surface">{totalTargetsReached} Hits</h4>
            <p className="font-sans text-xs text-outline font-medium">Sum Goal Meets</p>
          </div>
        </div>

        {/* Active tracking count */}
        <div className="bg-white/60 backdrop-blur-md rounded-[22px] p-6 border border-white/40 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-outline">
            <Zap size={22} />
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold text-on-surface">{habits.length} Habits</h4>
            <p className="font-sans text-xs text-outline font-medium">Actively Monitored</p>
          </div>
        </div>
      </div>

      {/* Main Chart Card container */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2.2rem] p-8 border border-white/40 shadow-sm space-y-6">
        {/* Chart View selector controls */}
        <div className="flex justify-between items-center border-b border-outline-variant/15 pb-4">
          <div className="flex gap-2">
            <button
              id="chart-tab-toggle-overview"
              onClick={() => setActiveChartTab('overview')}
              className={`px-4.5 py-2.5 rounded-full text-xs font-sans font-bold cursor-pointer transition-all ${
                activeChartTab === 'overview'
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`}
            >
              Overview Compliance (%)
            </button>
            <button
              id="chart-tab-toggle-trends"
              onClick={() => setActiveChartTab('trends')}
              className={`px-4.5 py-2.5 rounded-full text-xs font-sans font-bold cursor-pointer transition-all ${
                activeChartTab === 'trends'
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`}
            >
              Individual Trends
            </button>
          </div>

          <span className="font-mono text-[10px] text-outline font-bold uppercase select-none">
            7-Day Window Ending: {currentDate}
          </span>
        </div>

        {/* Recharts chart block */}
        <div className="h-[380px] w-full pt-2">
          {activeChartTab === 'overview' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5950b6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#5950b6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#8c8c8c', fontSize: 10, fontWeight: 'bold' }} 
                  axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#8c8c8c', fontSize: 10, fontWeight: 'bold' }} 
                  axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  name="Average Compliance" 
                  dataKey="avg_pct" 
                  stroke="#5950b6" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorAvg)" 
                />
                {habits.map((h, i) => {
                  const colors = ['#3a6758', '#b54e7d', '#c29738', '#5950b6'];
                  const strokeColor = colors[i % colors.length];
                  return (
                    <Line
                      key={h.id}
                      type="monotone"
                      name={`${h.name} Ratio`}
                      dataKey={`${h.name}_pct`}
                      stroke={strokeColor}
                      strokeWidth={2.0}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col gap-4">
              {/* Pill Selectors for Single Habits */}
              <div className="flex flex-wrap gap-2 select-none">
                {habits.map((h) => {
                  const isCur = h.id === selectedHabitId;
                  return (
                    <button
                      id={`habit-trend-select-${h.id}`}
                      key={h.id}
                      onClick={() => setSelectedHabitId(h.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-bold cursor-pointer transition-all ${
                        isCur
                          ? 'bg-secondary text-on-secondary shadow-md'
                          : 'bg-black/5 text-on-surface-variant hover:bg-black/10'
                      }`}
                    >
                      {getIcon(h.icon, isCur)}
                      <span>{h.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Single Habit Chart */}
              {selectedHabit ? (
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis 
                        dataKey="label" 
                        tick={{ fill: '#8c8c8c', fontSize: 10, fontWeight: 'bold' }} 
                        axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fill: '#8c8c8c', fontSize: 10, fontWeight: 'bold' }} 
                        axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        name={selectedHabit.name} 
                        dataKey={selectedHabit.id} 
                        fill={selectedHabit.colorClass.includes('text-secondary') ? '#3a6758' : '#5950b6'} 
                        radius={[8, 8, 0, 0]}
                        barSize={32}
                      />
                      <ReferenceLine 
                        y={selectedHabit.target} 
                        stroke="#b54e7d" 
                        strokeWidth={1.5}
                        strokeDasharray="4 4" 
                        label={{ value: 'Daily Goal', fill: '#b54e7d', fontSize: 10, fontWeight: 'bold', position: 'top' }} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm font-medium text-outline text-center py-20 font-sans">No habits created to show trends.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom section: detailed weekly compliance scorecard table */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-on-surface mb-5 pl-1">Weekly Standard Performance</h3>
        
        <div className="space-y-4">
          {habitPerformances.map((perf) => {
            const isExcel = perf.metDays >= 5;
            return (
              <div 
                key={perf.id} 
                className="flex items-center justify-between p-4 bg-white/40 border border-black/5 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-black/5 ${perf.color}`}>
                    {getIcon(perf.name, false)}
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-on-surface">{perf.name}</h5>
                    <p className="font-sans text-[10px] text-outline font-semibold">TARGET: {perf.target} {perf.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-on-surface">{perf.metDays} / 7 Days</span>
                    <p className="font-sans text-[9px] text-outline font-semibold uppercase">Target Reached</p>
                  </div>

                  <span className={`text-[9px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                    isExcel 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {isExcel ? 'Stellar' : 'Needs attention'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
