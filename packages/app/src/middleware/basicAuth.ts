import { Request, Response, NextFunction } from 'express';
import { ADMIN_USER, ADMIN_PASSWORD } from '../config';

export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(403).send('Access denied.');
  }

  next();
}