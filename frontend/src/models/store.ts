import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, TasksState } from './task.model';

const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/tasks'
  : '/api/tasks';

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async Thunks for API interactions (MVC Model actions)
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return (await response.json()) as Task[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch tasks');
  }
});

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: { title: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      return (await response.json()) as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    { id, updates }: { id: number; updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      return (await response.json()) as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete task');
  }
});

// Tasks Slice (Model State Reducers)
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add task
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

// Redux Store Configuration
export const store = configureStore({
  reducer: {
    tasks: tasksSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
