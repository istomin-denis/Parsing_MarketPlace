import test from 'node:test';
import assert from 'node:assert/strict';

// The API dependency is installed by `npm install`. Keep the suite usable in
// restricted/offline environments where dependencies have not been installed.
const validation = await import('../src/utils/validation.js').catch(() => null);
const options = validation ? {} : { skip: 'Install Back dependencies with npm install to run schema tests.' };

test('normalizes email addresses during registration', options, () => {
  const value = validation.registerSchema.parse({ email: ' USER@Example.com ', password: 'long-password-123' });
  assert.equal(value.email, 'user@example.com');
});

test('rejects weak registration passwords', options, () => {
  assert.equal(validation.registerSchema.safeParse({ email: 'user@example.com', password: 'short' }).success, false);
});

test('rejects inverted price ranges', options, () => {
  assert.equal(validation.searchSchema.safeParse({ minPrice: '5000', maxPrice: '1000' }).success, false);
});

test('accepts valid login credentials', options, () => {
  assert.equal(validation.loginSchema.safeParse({ email: 'user@example.com', password: 'password123' }).success, true);
});
