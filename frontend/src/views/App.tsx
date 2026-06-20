import React, { useEffect, useState } from 'react';
import { useTaskController } from '../controllers/task.controller';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { CheckSquare, BarChart2, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export const App: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    loadTasks,
    handleCreateTask,
    handleToggleComplete,
    handleUpdateTask,
    handleDeleteTask,
  } = useTaskController();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filter tasks based on view filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Calculate statistics (Model metrics)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500/30">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-[20%] w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-[15%] w-[250px] h-[250px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 shadow-lg shadow-indigo-500/30">
                <CheckSquare className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Task Manager</h1>
            </div>
            <p className="mt-2 text-sm text-slate-400 font-medium">
              Sleek CRUD dashboard utilizing Express, TypeScript, Redux, and Tailwind v4.
            </p>
          </div>
          {loading && (
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/25 animate-pulse">
              Syncing with server...
            </span>
          )}
        </header>

        {/* Error notification banner */}
        {error && (
          <div className="mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-sm text-rose-400 flex items-center justify-between shadow-lg">
            <span><strong>Connection Error:</strong> {error}. Make sure the Docker backend is running.</span>
            <button
              onClick={loadTasks}
              className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-200 transition-all active:scale-[0.98]"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Statistics Dashboard Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/10">
              <ListTodo size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tasks</p>
              <h4 className="text-2xl font-bold text-slate-100">{totalTasks}</h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/10">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed</p>
              <h4 className="text-2xl font-bold text-emerald-400">{completedTasks}</h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/10">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending</p>
              <h4 className="text-2xl font-bold text-amber-400">{pendingTasks}</h4>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-850 bg-slate-900/20 p-5 backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/10">
              <BarChart2 size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completion</p>
              <h4 className="text-2xl font-bold text-purple-400">{completionRate}%</h4>
            </div>
          </div>
        </section>

        {/* Main Workspace Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Task Panel View */}
          <section className="lg:col-span-4">
            <div className="sticky top-6">
              <TaskForm onCreateTask={handleCreateTask} />
            </div>
          </section>

          {/* Task List Panel View */}
          <section className="lg:col-span-8">
            <div className="flex flex-col gap-6">
              {/* Filters / Header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                  Tasks <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">{filteredTasks.length}</span>
                </h2>
                <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
                  <button
                    onClick={() => setFilter('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      filter === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                      filter === 'completed' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <TaskList
                tasks={filteredTasks}
                loading={loading}
                onToggleComplete={handleToggleComplete}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
export default App;
