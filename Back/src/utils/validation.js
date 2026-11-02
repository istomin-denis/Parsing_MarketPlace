import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(10, 'Пароль должен содержать не менее 10 символов.').max(72).refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Пароль не должен превышать 72 байта.')
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72).refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Некорректная длина пароля.')
});

const optionalPrice = z.preprocess(
  (value) => value === '' || value === undefined ? undefined : Number(value),
  z.number().finite().min(0).max(10_000_000).optional()
);

export const searchSchema = z.object({
  q: z.string().trim().max(100).default(''),
  marketplace: z.enum(['all', 'Wildberries', 'Ozon', 'Yandex Market']).default('all'),
  minPrice: optionalPrice,
  maxPrice: optionalPrice,
  inStock: z.union([z.boolean(), z.enum(['true', 'false'])]).optional().transform((value) => value === true || value === 'true').default(false),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'rating_desc']).default('relevance'),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24)
}).superRefine((value, context) => {
  if (value.minPrice !== undefined && value.maxPrice !== undefined && value.minPrice > value.maxPrice) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['minPrice'], message: 'Минимальная цена не может быть выше максимальной.' });
  }
});
