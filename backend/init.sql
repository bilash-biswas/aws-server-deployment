CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO tasks (title, description, completed) VALUES
('Setup Project', 'Create Express, TypeScript, Docker, and Postgres configuration', true),
('Implement CRUD', 'Create database pool, model, controller, and routes', false),
('Verify API', 'Test all CRUD endpoints using curl or browser subagent', false);
