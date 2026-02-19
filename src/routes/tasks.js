const express = require('express');
const router = express.Router();
const taskModel = require('../models/task');
const { validateTaskInput, validateStatusInput } = require('../utils/validators');

router.get('/', (req, res) => {
  let d = taskModel.getAllTasks();
  const x = req.query.priority;

  if (x) {
    d = d.filter((t) => t.priority === x);
  }

  const ret = { data: d, count: d.length };
  res.json(ret);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const sortedTasks = taskModel.getAllTasks().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const task = taskModel.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ data: task });
});

router.post('/', (req, res) => {
  const validation = validateTaskInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const task = taskModel.createTask({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || '',
    priority: req.body.priority,
  });

  res.status(201).json({ data: task });
});

router.put('/:id', (req, res) => {
  try {
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

    if (req.body.priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(req.body.priority)) {
        return res.status(400).json({ error: 'Priority must be low, medium, or high' });
      }
    }

    const task = taskModel.updateTask(id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ data: task });
  } catch (e) {
  }
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const deleted = taskModel.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ message: 'task was deleted successfully!!' });
});

router.patch('/:id/priority', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(req.body.priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high' });
  }

  const task = taskModel.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.priority = req.body.priority;
  task.updatedAt = new Date().toISOString();

  res.json({ data: task });
});

router.get('/debug/info', (req, res) => {
  res.json({
    env: process.env,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
});

module.exports = router;
