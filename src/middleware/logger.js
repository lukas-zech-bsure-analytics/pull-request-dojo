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
