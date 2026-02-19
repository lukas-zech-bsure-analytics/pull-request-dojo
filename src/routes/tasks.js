const express = require('express');
const router = express.Router();
const taskModel = require('../models/task');
const { validateTaskInput, validateStatusInput } = require('../utils/validators');

// GET /api/tasks
router.get('/', (req, res) => {
  // PR-ISSUE #1: [Naming] - Poor variable names make code hard to understand
  // WHY: Variable names like 'd', 'x', 't', and 'ret' give no context about what they hold.
  //   A reviewer reading this diff cannot quickly tell what 'd' is or what 'x' filters.
  // SUGGESTION: Use descriptive names: 'd' -> 'tasks', 'x' -> 'priorityFilter',
  //   't' -> 'task', 'ret' -> remove entirely and inline the object in res.json()
  let d = taskModel.getAllTasks();
  const x = req.query.priority;

  if (x) {
    d = d.filter((t) => t.priority === x);
  }

  const ret = { data: d, count: d.length };
  res.json(ret);
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // PR-ISSUE #5: [Performance] - Sorting the entire task list just to find one task by ID
  // WHY: This .sort() call is O(n log n) and its result is never even used — the code
  //   calls getTaskById() on the next line which does its own Array.find(). The sort
  //   was likely left over from debugging or copied from another context.
  // SUGGESTION: Remove the sortedTasks variable and the .sort() call entirely.
  //   getTaskById() already finds the task directly.
  const sortedTasks = taskModel.getAllTasks().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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

  // PR-ISSUE #7: [Missing Validation] - Priority value is passed directly without any validation
  // WHY: A caller can send any string as priority — "urgent", "CRITICAL", "1", "<script>alert(1)</script>"
  //   — and it will be stored as-is. The PUT handler validates priority but this POST handler does not,
  //   creating an inconsistency. The validators.js module already demonstrates the pattern for this.
  // SUGGESTION: Validate priority against ['low', 'medium', 'high'] before creating the task.
  //   Ideally add a validatePriorityInput() function in validators.js, following the same pattern
  //   as the existing validateStatusInput().
  const task = taskModel.createTask({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || '',
    priority: req.body.priority,
  });

  res.status(201).json({ data: task });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  // PR-ISSUE #3: [Error Handling] - Empty catch block silently swallows all errors
  // WHY: If any exception is thrown inside the try block, the catch block does nothing —
  //   no error is logged, no response is sent. The HTTP request will hang until the client
  //   times out. This makes debugging nearly impossible in production.
  // SUGGESTION: At minimum, log the error and return a 500 response:
  //   catch (err) {
  //     console.error('Error updating task:', err);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  //   Better yet, remove the try/catch entirely and let the global error handler in app.js handle it.
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
    // TODO: handle this later
  }
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

  // PR-ISSUE #9: [API Design] - Returns 200 with a body for DELETE instead of 204 No Content
  // WHY: The original code correctly used res.status(204).send() which is the standard REST
  //   convention for successful deletions — "the action was successful and there is no content
  //   to return." Changing to 200 with a message body is inconsistent with the rest of the API
  //   (which uses the { data: ... } envelope) and the exclamation marks are unprofessional.
  // SUGGESTION: Restore the original: res.status(204).send()
  res.status(200).json({ message: 'task was deleted successfully!!' });
});

// PR-ISSUE #8: [Code Duplication] - This entire endpoint duplicates logic already in PUT /:id
// WHY: The PUT /:id handler already accepts and validates a priority field in the request body.
//   This separate PATCH endpoint duplicates the ID parsing, priority validation, not-found check,
//   and update logic. Two copies means two places to update when requirements change, and they
//   can easily drift out of sync. The PATCH endpoint also mutates the task object directly
//   instead of going through the updateTask() model function.
// SUGGESTION: Remove this entire endpoint. Clients should use PUT /api/tasks/:id with
//   { "priority": "high" } in the body to update priority, just like any other field.
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

// PR-ISSUE #2: [Security] - Debug endpoint exposes sensitive internal server state
// WHY: process.env contains ALL environment variables, which typically includes database
//   credentials, API keys, session secrets, and other sensitive configuration. This endpoint
//   has no authentication and would be accessible to anyone who can reach the server.
//   Even process.memoryUsage() and process.uptime() leak operational details useful to attackers.
// SUGGESTION: Remove this endpoint entirely. If diagnostic information is needed, it should
//   be behind authentication, restricted to non-production environments, and should never
//   expose process.env.
router.get('/debug/info', (req, res) => {
  res.json({
    env: process.env,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
});

module.exports = router;
