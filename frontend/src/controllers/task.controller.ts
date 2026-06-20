import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, addTask, updateTask, deleteTask } from '../models/store';
import type { RootState, AppDispatch } from '../models/store';
import { useCallback } from 'react';

export const useTaskController = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Model state selectors
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);

  // Controller Actions executed by Views
  const loadTasks = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = useCallback(async (title: string, description: string) => {
    if (!title.trim()) return { success: false, error: 'Title is required' };
    try {
      const resultAction = await dispatch(addTask({ title, description }));
      if (addTask.fulfilled.match(resultAction)) {
        return { success: true, task: resultAction.payload };
      } else {
        return { success: false, error: resultAction.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error occurred' };
    }
  }, [dispatch]);

  const handleToggleComplete = useCallback(async (id: number, currentCompleted: boolean) => {
    try {
      const resultAction = await dispatch(updateTask({ id, updates: { completed: !currentCompleted } }));
      if (updateTask.fulfilled.match(resultAction)) {
        return { success: true, task: resultAction.payload };
      } else {
        return { success: false, error: resultAction.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error occurred' };
    }
  }, [dispatch]);

  const handleUpdateTask = useCallback(async (id: number, title: string, description: string) => {
    if (!title.trim()) return { success: false, error: 'Title is required' };
    try {
      const resultAction = await dispatch(updateTask({ id, updates: { title, description } }));
      if (updateTask.fulfilled.match(resultAction)) {
        return { success: true, task: resultAction.payload };
      } else {
        return { success: false, error: resultAction.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error occurred' };
    }
  }, [dispatch]);

  const handleDeleteTask = useCallback(async (id: number) => {
    try {
      const resultAction = await dispatch(deleteTask(id));
      if (deleteTask.fulfilled.match(resultAction)) {
        return { success: true };
      } else {
        return { success: false, error: resultAction.payload as string };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error occurred' };
    }
  }, [dispatch]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    handleCreateTask,
    handleToggleComplete,
    handleUpdateTask,
    handleDeleteTask
  };
};
