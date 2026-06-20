import { Request, Response } from 'express';
import pool from '../config/db';
import { Task } from '../models/task.model';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error in getAllTasks:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error in getTaskById:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error in createTask:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const { title, description, completed } = req.body;

    // Check if task exists
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const currentTask = checkResult.rows[0];
    const newTitle = title !== undefined ? title : currentTask.title;
    const newDescription = description !== undefined ? description : currentTask.description;
    const newCompleted = completed !== undefined ? completed : currentTask.completed;

    if (typeof newTitle !== 'string' || newTitle.trim() === '') {
      res.status(400).json({ error: 'Title must be a non-empty string' });
      return;
    }

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [newTitle.trim(), newDescription, newCompleted, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error in updateTask:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (error: any) {
    console.error('Error in deleteTask:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
