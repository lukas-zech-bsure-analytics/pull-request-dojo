const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

function validateTaskInput(input) {
  if (!input.title || typeof input.title !== 'string') {
    return { valid: false, message: 'Title is required and must be a string' };
  }

  const trimmedTitle = input.title.trim();
  if (trimmedTitle.length === 0) {
    return { valid: false, message: 'Title cannot be empty' };
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return { valid: false, message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` };
  }

  if (input.description && typeof input.description !== 'string') {
    return { valid: false, message: 'Description must be a string' };
  }

  if (input.description && input.description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return { valid: false, message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer` };
  }

  return { valid: true };
}

function validateStatusInput(status) {
  if (!VALID_STATUSES.includes(status)) {
    return {
      valid: false,
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    };
  }
  return { valid: true };
}

module.exports = {
  validateTaskInput,
  validateStatusInput,
  VALID_STATUSES,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
};
