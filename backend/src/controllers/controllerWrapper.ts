import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const ERROR_SERVER = { error: 'Server Error' };

export const withErrorHandling = (handler: AsyncController): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json(ERROR_SERVER);
      }
    }
  };
};
