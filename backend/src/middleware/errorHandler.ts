import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = err;

  // Prisma错误处理
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = '数据库操作失败';
  }

  // JWT错误处理
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的访问令牌';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '访问令牌已过期';
  }

  // 验证错误处理
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '数据验证失败';
  }

  // 记录错误日志
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // 生产环境不返回错误堆栈
  const response: any = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};