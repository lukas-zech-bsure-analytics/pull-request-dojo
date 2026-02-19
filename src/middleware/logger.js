// PR-ISSUE #10: [Mentor Opportunity] - Deeply nested conditionals instead of guard clauses
// WHY: The original logger was 10 lines of flat, readable code. This rewrite introduces
//   4 levels of nesting with if/else blocks. The checks for req, req.method, and
//   req.originalUrl !== '/health' are either unnecessary (Express guarantees req and
//   req.method exist) or could be handled with an early return. The inner branching
//   for error status codes and priority query params adds more nesting. Each additional
//   feature request will push the "happy path" code further to the right.
// SUGGESTION: Use the guard clause / early return pattern to flatten the structure:
//   1. If the URL is '/health', call next() and return immediately.
//   2. Then proceed with the main logging logic at the top indentation level.
//   3. Use a simple ternary or helper function for the log prefix instead of nested if/else.
//   The original flat version from main is a good reference.
function logger(req, res, next) {
  if (req) {
    if (req.method) {
      if (req.originalUrl !== '/health') {
        const start = Date.now();

        res.on('finish', () => {
          const duration = Date.now() - start;
          if (res.statusCode >= 400) {
            console.log(`[ERROR] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
          } else {
            if (req.query && req.query.priority) {
              console.log(`[FILTERED] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
            } else {
              console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
            }
          }
        });

        next();
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = logger;
