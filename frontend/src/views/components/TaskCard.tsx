import React, { useState } from 'react';
import type { Task } from '../../models/task.model';
import { Trash2, Edit3, CheckCircle, Circle, Check, X } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number, currentCompleted: boolean) => void;
  onUpdate: (id: number, title: string, description: string) => void;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleSave = () => {
    if (editTitle.trim() === '') return;
    onUpdate(task.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        task.completed
          ? 'border-emerald-500/20 shadow-emerald-500/5'
          : 'border-slate-850 shadow-slate-950/50'
      }`}
    >
      {/* Decorative colored top bar */}
      <div
        className={`absolute top-0 left-0 h-1 w-full transition-all duration-300 ${
          task.completed ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      />

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Task title..."
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Task description (optional)..."
            rows={2}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Check size={14} /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full min-h-[120px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3
                className={`text-lg font-semibold tracking-tight transition-all duration-300 ${
                  task.completed ? 'text-slate-500 line-through' : 'text-slate-100'
                }`}
              >
                {task.title}
              </h3>
              <button
                onClick={() => onToggleComplete(task.id, task.completed)}
                className={`flex-shrink-0 transition-colors duration-300 ${
                  task.completed ? 'text-emerald-400 hover:text-emerald-500' : 'text-slate-500 hover:text-indigo-450'
                }`}
              >
                {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
              </button>
            </div>
            {task.description && (
              <p
                className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                  task.completed ? 'text-slate-600 line-through' : 'text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-4">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              Created {new Date(task.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-indigo-400 transition-colors"
                title="Edit Task"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-rose-400 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
