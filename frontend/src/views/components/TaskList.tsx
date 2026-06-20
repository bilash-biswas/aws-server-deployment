import React from 'react';
import type { Task } from '../../models/task.model';
import { TaskCard } from './TaskCard';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (id: number, currentCompleted: boolean) => void;
  onUpdate: (id: number, title: string, description: string) => void;
  onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onToggleComplete,
  onUpdate,
  onDelete,
}) => {
  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 p-12 text-center backdrop-blur-sm">
        <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-850 text-slate-500 mb-4">
          <ClipboardList size={36} />
        </div>
        <h3 className="text-lg font-semibold text-slate-300">No tasks found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-xs">
          Get started by adding a task on the left or try changing your filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
