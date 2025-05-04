// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

interface ITokenPayload {
  id: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token ausente' });
    return;
  }

  // Bearer ashjiahjkshasdjklndwjkn
  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as ITokenPayload;

    req.id = decoded.id;

    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
