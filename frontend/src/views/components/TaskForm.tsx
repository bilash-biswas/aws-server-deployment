import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TaskFormProps {
  onCreateTask: (title: string, description: string) => Promise<{ success: boolean; error?: string }>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await onCreateTask(title, description);
    
    setIsSubmitting(false);
    if (result.success) {
      setTitle('');
      setDescription('');
    } else {
      setErrorMessage(result.error || 'Failed to create task');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg"
    >
      <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2 mb-5">
        <PlusCircle className="text-indigo-500" size={22} /> Add New Task
      </h2>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            placeholder="Add details about this task..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || title.trim() === ''}
          className="mt-2 w-full rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all duration-200"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};
