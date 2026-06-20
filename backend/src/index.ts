import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Home/Healthcheck route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Task CRUD API is up and running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/tasks', taskRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
