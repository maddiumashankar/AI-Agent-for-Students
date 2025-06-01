import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean; // To distinguish between operational and programmer errors
}

export const errorHandlingMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log the error for debugging (can be expanded with a logger like Winston)
  console.error(`[ERROR] ${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${err.stack}`);

  // For operational errors, send a more user-friendly message
  // For programmer errors in development, send the full stack
  // For now, we'll keep it simple and send the error message
  // In production, you might want to send generic messages for non-operational errors

  res.status(err.statusCode).json({
    status: 'error',
    statusCode: err.statusCode,
    message: err.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Optional: show stack in dev
  });
};

// Middleware for handling 404 Not Found errors
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Pass it to the global error handler
};
