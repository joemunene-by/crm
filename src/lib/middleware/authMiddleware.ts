import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for authenticating requests.
 * @param verifyToken - A function that verifies a token and returns a user object or null.
 */
export default function authMiddleware(verifyToken: (token: string) => Promise<any | null>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const user = await verifyToken(token);

      if (!user) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}