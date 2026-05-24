import { usePlanner } from '../context/PlannerContext';
import { Plus, Trash2, CheckCircle, Circle, ClipboardList, ArrowUpDown, Pencil } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TodoListSection() {
  const { tasks, addTask, toggleTask, deleteTask, searchQuery, currentDate, openEditModal } = usePlanner();
  const [newTitle, setNewTitle] = useState('');
  const [isInlineCreating, setIsInlineCreating] = useState(false);
  const [isSortedByPriority, setIsSortedByPriority] = useState(false);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      addTask(newTitle.trim(), false, currentDate);
      setNewTitle('');
      setIsInlineCreating(false);
    }
  };

  // Filter tasks based on current date and search
  const filteredTasks = tasks.filter(task => 
    task.date === currentDate &&
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Automatically sort tasks by priority (high-priority items at the top) if enabled
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (isSortedByPriority) {
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
    }
    return 0;
  });

  const dateTasks = tasks.filter(t => t.date === currentDate);
  const totalCount = dateTasks.length;
  const completedCount = dateTasks.filter(t => t.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 flex flex-col shadow-sm h-full">
      {/* List Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-on-surface font-bold">To-Do List</h2>
        <div className="flex items-center gap-1">
          <button
            id="todolist-sort-btn"
            onClick={() => setIsSortedByPriority(!isSortedByPriority)}
            className={`p-1.5 focus:ring-2 focus:ring-primary/20 rounded-full transition-all cursor-pointer ${
              isSortedByPriority 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-outline/75 hover:bg-primary/5 hover:text-primary'
            }`}
            title={isSortedByPriority ? "Original Order" : "Sort by Priority"}
          >
            <ArrowUpDown size={18} />
          </button>
          <button
            id="todolist-add-btn"
            onClick={() => setIsInlineCreating(!isInlineCreating)}
            className="p-1.5 focus:ring-2 focus:ring-primary/20 rounded-full hover:bg-primary/5 text-primary transition-all cursor-pointer"
            title="Add new task"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {/* Inline Quick Creation Form */}
      <AnimatePresence>
        {isInlineCreating && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="mb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-white/50 border border-primary/20 rounded-xl p-1 px-3">
              <input
                id="inline-todo-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to get done?"
                className="flex-1 bg-transparent border-none py-2 text-sm text-on-surface outline-none placeholder:text-outline/40 font-sans"
                autoFocus
              />
              <button
                id="inline-todo-save"
                type="submit"
                disabled={!newTitle.trim()}
                className="p-1.5 bg-primary text-on-primary rounded-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Actual Tasks Scroll Area */}
      {sortedTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-outline/50 select-none">
          <ClipboardList size={32} strokeWidth={1.5} className="mb-2" />
          <p className="text-xs font-sans font-medium">No tasks for today</p>
          {searchQuery && <p className="text-[10px] mt-0.5">Try altering the query.</p>}
        </div>
      ) : (
        <ul className="flex-1 space-y-2.5 overflow-y-auto max-h-[290px] scrollbar-thin">
          <AnimatePresence initial={false}>
            {sortedTasks.map((task) => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/45 transition-all group/item border border-transparent hover:border-white/20"
              >
                <div 
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer select-none min-w-0"
                >
                  <button
                    id={`toggle-task-check-${task.id}`}
                    className="text-primary hover:scale-105 transition-transform flex-shrink-0"
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed ? (
                      <CheckCircle size={20} className="text-secondary fill-secondary/10" />
                    ) : (
                      <Circle size={20} className="text-outline/40 hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`font-sans text-sm font-medium transition-all truncate ${
                      task.completed 
                        ? 'text-outline/55 line-through decoration-outline/30' 
                        : 'text-on-surface'
                    }`}>
                      {task.title}
                    </span>
                    {task.priority && (
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-rose-50 text-rose-500 border border-rose-100/60 scale-90">
                        High
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Action controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all flex-shrink-0">
                  <button
                    id={`edit-task-${task.id}`}
                    onClick={() => openEditModal('task', task.id)}
                    className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                    title="Edit task"
                  >
                    <Pencil size={13} strokeWidth={2.5} />
                  </button>
                  <button
                    id={`delete-task-${task.id}`}
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50/50 transition-all cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Progress Footer */}
      <div className="mt-8 pt-5 border-t border-outline-variant/15 select-none">
        <div className="flex justify-between items-center mb-2.5">
          <p className="font-sans font-bold text-[10px] text-outline uppercase tracking-widest">Progress</p>
          <span className="text-xs font-sans font-bold text-primary">{percentage}%</span>
        </div>
        
        {/* Progress Track */}
        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden shadow-inner relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>
        
        <p className="text-[10px] font-sans font-semibold text-outline/60 mt-1.5 text-right">
          {completedCount} of {totalCount} completed
        </p>
      </div>
    </section>
  );
}
