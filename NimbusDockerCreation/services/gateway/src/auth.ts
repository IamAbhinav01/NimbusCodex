import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Extend Express Request to append the decoded user
export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify JWT tokens on protected routes.
 * If authentication fails, it returns a 401 Unauthorized before
 * the proxy can even forward the request to the Orchestrator.
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[Auth] Rejected ${req.method} ${req.url}: Missing or invalid token format`);
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.warn(`[Auth] Rejected ${req.method} ${req.url}: ${error.message}`);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    return;
  }
};
