import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import { AppError } from '../../../errors/AppError';

interface ITockenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITockenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
