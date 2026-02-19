const express = require('express');
const router = express.Router();
const taskModel = require('../models/task');
const { validateTaskInput, validateStatusInput } = require('../utils/validators');

// GET /api/tasks
router.get('/', (req, res) => {
  const tasks = taskModel.getAllTasks();
  res.json({ data: tasks, count: tasks.length });
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const task = taskModel.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ data: task });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const validation = validateTaskInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const task = taskModel.createTask({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || '',
  });

  res.status(201).json({ data: task });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (req.body.status) {
    const statusValidation = validateStatusInput(req.body.status);
    if (!statusValidation.valid) {
      return res.status(400).json({ error: statusValidation.message });
    }
  }

  const task = taskModel.updateTask(id, req.body);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ data: task });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const deleted = taskModel.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

module.exports = router;
