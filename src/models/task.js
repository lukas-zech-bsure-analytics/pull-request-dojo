let tasks = [];
let nextId = 1;

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  return tasks.find((task) => task.id === id);
}

function createTask({ title, description = '' }) {
  const task = {
    id: nextId++,
    title,
    description,
    status: 'pending',
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

  const allowedFields = ['title', 'description', 'status'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
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
