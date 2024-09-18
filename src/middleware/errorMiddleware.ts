import { Request, Response, NextFunction } from "express";


class AppError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}


const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const response = {
    message: err.message || "Error del servidor",
    ...(err.errors && { errors: err.errors }), 
  };
  res.status(statusCode).json(response);
};

export { globalErrorHandler, AppError };
