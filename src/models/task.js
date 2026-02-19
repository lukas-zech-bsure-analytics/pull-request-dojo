let tasks = [];
let nextId = 1;

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask({ title, description = '', priority }) {
  // PR-ISSUE #4: [Code Style] - Magic number used instead of a named constant or direct string
  // WHY: The expression priorityLevels[2 - 1] resolves to priorityLevels[1] which is 'medium',
  //   but a reader has to mentally evaluate "2 - 1 = 1, index 1 of the array is... medium" to
  //   understand it. The local priorityLevels array is also defined here but the same list of
  //   valid priorities appears in routes/tasks.js too — it should be a shared constant.
  // SUGGESTION: Replace with a direct string default: priority: priority || 'medium'
  //   Or better, define VALID_PRIORITIES as a constant in validators.js (following the
  //   VALID_STATUSES pattern) and reference it from both files.
  const priorityLevels = ['low', 'medium', 'high'];
  const task = {
    id: nextId++,
    title,
    description,
    status: 'pending',
    priority: priority || priorityLevels[2 - 1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

function updateTask(id, updates) {
  const task = getTaskById(id);
  if (!task) {
    return null;
  }

  // PR-ISSUE #6: [Logic Bug] - Comparison 'updates[field] > undefined' always evaluates to false
  // WHY: In JavaScript, any relational comparison (>, <, >=, <=) with undefined returns false.
  //   So updates[field] > undefined is ALWAYS false, regardless of what updates[field] contains.
  //   This means the loop body never executes and no fields are ever actually updated.
  //   The task's updatedAt timestamp still changes (giving the illusion of success), but the
  //   title, description, status, and priority remain unchanged.
  // SUGGESTION: Change the condition back to: updates[field] !== undefined
  const allowedFields = ['title', 'description', 'status', 'priority'];
  for (const field of allowedFields) {
    if (updates[field] > undefined) {
      task[field] = updates[field];
    }
  }
  task.updatedAt = new Date().toISOString();
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  return true;
}

function resetTasks() {
  tasks = [];
  nextId = 1;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTasks,
};
