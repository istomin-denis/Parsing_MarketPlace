import { HttpError } from '../utils/httpError.js';

export function requireAuth(req, _res, next) {
  if (!req.session?.userId) {
    return next(new HttpError(401, 'Для выполнения действия необходимо войти в аккаунт.', 'AUTH_REQUIRED'));
  }
  next();
}
