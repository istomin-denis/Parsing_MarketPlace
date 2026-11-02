import { ZodError } from 'zod';

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Маршрут не найден.' } });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Проверьте переданные параметры.',
        details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
      }
    });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = status >= 500 ? 'Внутренняя ошибка сервера.' : error.message;

  if (status >= 500) console.error(error);
  res.status(status).json({ error: { code, message } });
}
