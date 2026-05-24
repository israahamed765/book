
import { Sparkles, Brain, Loader2, RefreshCw, Quote } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { motion, AnimatePresence } from 'motion/react';

export default function AiAssistant() {
  const { optimizeWithAi, aiFeedback, aiIsLoading, currentDate } = usePlanner();

  const formattedDate = new Date(currentDate + "T12:00:00").toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });

  return (
    <section className="bg-gradient-to-br from-indigo-550 to-indigo-700 text-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-500/30 overflow-hidden relative flex flex-col h-full min-h-[220px]">
      {/* Absolute decorative glow circles */}
      <div className="absolute right-0 top-0 w-44 h-44 bg-emerald-400/20 rounded-full blur-3xl -mr-6 -mt-6"></div>
      <div className="absolute left-1/3 bottom-0 w-36 h-36 bg-pink-400/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-emerald-300">
              <Brain size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight">Zen AI Companion</h2>
              <p className="text-[10px] font-sans font-extrabold text-indigo-200 uppercase tracking-widest mt-0.5">Timeline Optimization</p>
            </div>
          </div>

          <button
            onClick={() => optimizeWithAi()}
            disabled={aiIsLoading}
            className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer backdrop-blur-md border border-white/10"
            title="Ask AI Zen Optimizer"
          >
            {aiIsLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </button>
        </div>

        {/* Dynamic Display Board */}
        <div className="flex-1 flex flex-col justify-center py-2">
          <AnimatePresence mode="wait">
            {aiFeedback ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3 font-medium text-indigo-50"
              >
                <Quote size={20} className="text-emerald-300 opacity-60" />
                <p className="text-xs md:text-sm leading-relaxed font-sans italic pl-2 border-l-2 border-emerald-305/70">
                  {aiFeedback}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <p className="text-xs text-indigo-150 leading-relaxed max-w-sm mx-auto font-medium">
                  Would you like to analyze today's ({formattedDate}) schedule? Ask the Zen AI to optimize your focus balance and breathing pauses.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestion Spark Launcher */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
          <span className="text-indigo-200 font-bold flex items-center gap-1">
            <Sparkles size={11} className="text-emerald-300" /> Grounded in Gemini
          </span>
          <button
            onClick={() => optimizeWithAi()}
            disabled={aiIsLoading}
            className="text-[11px] font-extrabold text-emerald-300 hover:text-emerald-250 cursor-pointer flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
          >
            Optimize Daily Balance
          </button>
        </div>
      </div>
    </section>
  );
}
